import { APP_PROFILE } from "./app-profile.js?v=1.03.0";
import { MODULE_REGISTRY } from "./module-registry.js?v=1.03.0";
import { CONTENT_PACKS } from "./content-pack-registry.js?v=1.03.0";
import { STORAGE_PROVIDERS } from "./sync-storage-profile.js?v=1.03.0";
import { validateAppForgeProfile, appForgeBlueprintExport } from "./app-forge-blueprint.js?v=1.03.0";
import { APP_FORGE_RECIPE_SCHEMA_VERSION, appForgeRecipes, appForgeRecipeById } from "./app-forge-recipes.js?v=1.03.0";

export const APP_FORGE_FACTORY_SCHEMA_VERSION = 1;
export const APP_FORGE_FACTORY_KIND = "field-vault.app-forge-factory-manifest";

export const APP_FORGE_GENERATION_REQUEST_SCHEMA = Object.freeze({
  id:"field-vault.generation-request.v1",
  required:Object.freeze(["baseRecipeId","product.id","product.name","product.industry","product.audience","product.purpose","terminology.recordSingular","terminology.recordPlural","terminology.recordId","branding.wordmark","branding.tagline","branding.accent","modules.enabledIds","content.enabledPackIds","storage.profileId","outputs.targets"]),
  outputTargets:Object.freeze(["pwa","ios-profile","android-profile"]),
  productIdPattern:"^[a-z][a-z0-9-]{2,47}$",
  accentPattern:"^#[0-9a-fA-F]{6}$"
});

function clone(value){return JSON.parse(JSON.stringify(value));}
function unique(values=[]){return [...new Set((Array.isArray(values)?values:[]).map(value=>String(value||"").trim()).filter(Boolean))];}
function slug(value=""){return String(value||"").toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"").slice(0,48);}
function safeHex(value,fallback){return /^#[0-9a-f]{6}$/i.test(String(value||""))?String(value):fallback;}
function requestResult(id,label,ok,detail){return {id,label,ok:Boolean(ok),detail:String(detail||"")};}

export function createAppForgeGenerationRequest(recipeId="firevault",overrides={}){
  const recipe=appForgeRecipeById(recipeId)||appForgeRecipeById("firevault");
  const profile=clone(recipe.profile);
  const product={
    id:slug(overrides?.product?.id||profile.id)||profile.id,
    name:String(overrides?.product?.name||profile.name),
    shortName:String(overrides?.product?.shortName||profile.shortName||profile.name),
    industry:String(overrides?.product?.industry||profile.industry),
    audience:String(overrides?.product?.audience||profile.audience),
    purpose:String(overrides?.product?.purpose||profile.purpose)
  };
  const wordmark=Array.isArray(overrides?.branding?.wordmark)&&overrides.branding.wordmark.length?overrides.branding.wordmark:profile.branding.wordmark.map(segment=>segment.text);
  return clone({
    schemaVersion:APP_FORGE_FACTORY_SCHEMA_VERSION,
    requestId:`${product.id}-factory-request`,
    baseRecipeId:recipe.id,
    product,
    terminology:{recordSingular:String(overrides?.terminology?.recordSingular||profile.terminology.recordSingular),recordPlural:String(overrides?.terminology?.recordPlural||profile.terminology.recordPlural),recordId:String(overrides?.terminology?.recordId||profile.terminology.recordId)},
    branding:{wordmark:wordmark.slice(0,3).map(String),tagline:String(overrides?.branding?.tagline||profile.branding.tagline),accent:safeHex(overrides?.branding?.accent,profile.appearance.accent),assetMode:recipe.assetStatus},
    modules:{enabledIds:unique(overrides?.modules?.enabledIds||profile.enabledModules)},
    content:{enabledSourceIds:unique(overrides?.content?.enabledSourceIds||profile.content.enabledSourceIds),enabledPackIds:unique(overrides?.content?.enabledPackIds||profile.content.enabledPackIds),databaseStatus:recipe.databaseStatus},
    storage:{profileId:String(overrides?.storage?.profileId||profile.syncStorage.profileId),enabledProviderIds:unique(overrides?.storage?.enabledProviderIds||profile.syncStorage.enabledProviderIds)},
    outputs:{targets:unique(overrides?.outputs?.targets||["pwa","ios-profile"]),includeBlueprint:true,includeProfile:true,includeArchitectureContracts:true},
    publication:{recipeStatus:recipe.status,requirements:[...recipe.requirements]}
  });
}

export function validateAppForgeGenerationRequest(request={}){
  const recipe=appForgeRecipeById(request.baseRecipeId);
  const moduleIds=new Set(MODULE_REGISTRY.map(module=>module.id));
  const packIds=new Set(CONTENT_PACKS.map(pack=>pack.id));
  const providerIds=new Set(STORAGE_PROVIDERS.map(provider=>provider.id));
  const targets=new Set(APP_FORGE_GENERATION_REQUEST_SCHEMA.outputTargets);
  const checks=[
    requestResult("recipe","Base recipe",Boolean(recipe),recipe?`${recipe.name} resolves.`:"Choose a registered Product Recipe."),
    requestResult("product-id","Product ID",new RegExp(APP_FORGE_GENERATION_REQUEST_SCHEMA.productIdPattern).test(String(request?.product?.id||"")),"Use 3–48 lowercase letters, numbers, or hyphens, beginning with a letter."),
    requestResult("identity","Product identity",[request?.product?.name,request?.product?.industry,request?.product?.audience,request?.product?.purpose].every(value=>String(value||"").trim()),"Name, industry, audience, and purpose are required."),
    requestResult("terminology","Record terminology",[request?.terminology?.recordSingular,request?.terminology?.recordPlural,request?.terminology?.recordId].every(value=>String(value||"").trim()),"Singular, plural, and record ID labels are required."),
    requestResult("branding","Brand specification",Array.isArray(request?.branding?.wordmark)&&request.branding.wordmark.some(value=>String(value||"").trim())&&String(request?.branding?.tagline||"").trim()&&new RegExp(APP_FORGE_GENERATION_REQUEST_SCHEMA.accentPattern).test(String(request?.branding?.accent||"")),"At least one wordmark segment, a tagline, and a six-digit accent color are required."),
    requestResult("modules","Module selection",unique(request?.modules?.enabledIds).length>0&&unique(request?.modules?.enabledIds).every(id=>moduleIds.has(id)),"Every selected module must resolve in the Module Registry."),
    requestResult("content","Content selection",unique(request?.content?.enabledPackIds).every(id=>packIds.has(id)),"Every selected content pack must resolve in the Content Pack Registry."),
    requestResult("storage","Storage selection",unique(request?.storage?.enabledProviderIds).length>0&&unique(request?.storage?.enabledProviderIds).every(id=>providerIds.has(id)),"Every selected provider must resolve in the Sync & Storage Profile."),
    requestResult("outputs","Output targets",unique(request?.outputs?.targets).length>0&&unique(request?.outputs?.targets).every(id=>targets.has(id)),"Choose at least one supported build target.")
  ];
  return clone({ready:checks.every(check=>check.ok),passed:checks.filter(check=>check.ok).length,total:checks.length,checks});
}

export function composeAppForgeProfile(request={}){
  const recipe=appForgeRecipeById(request.baseRecipeId);if(!recipe)return null;
  const profile=clone(recipe.profile);
  profile.id=request.product.id;profile.name=request.product.name;profile.shortName=request.product.shortName;profile.industry=request.product.industry;profile.audience=request.product.audience;profile.purpose=request.product.purpose;
  profile.terminology={...profile.terminology,...request.terminology};
  profile.branding={...profile.branding,wordmark:request.branding.wordmark.map((text,index)=>({text,tone:index===0?"primary":"accent"})),tagline:request.branding.tagline};
  profile.appearance={...profile.appearance,profileId:`${request.product.id}-dark`,profileName:`${request.product.name} Dark`,accent:request.branding.accent};
  profile.enabledModules=unique(request.modules.enabledIds);
  profile.content={...profile.content,enabledSourceIds:unique(request.content.enabledSourceIds),enabledPackIds:unique(request.content.enabledPackIds)};
  profile.syncStorage={...profile.syncStorage,profileId:request.storage.profileId,enabledProviderIds:unique(request.storage.enabledProviderIds)};
  return profile;
}

function factoryOutputs(request,recipe,blueprintReady){
  const rows=[
    {id:"request",name:"Generation Request",path:"factory/generation-request.json",status:"ready",description:"Normalized factory inputs and selected recipe."},
    {id:"profile",name:"App Profile",path:"architecture/app-profile.json",status:blueprintReady?"ready":"blocked",description:"Identity, terminology, modules, workflows, theme, content, and storage."},
    {id:"blueprint",name:"Validated Blueprint",path:"architecture/appforge-blueprint.json",status:blueprintReady?"ready":"blocked",description:"Portable profile plus versioned component contracts."},
    {id:"pwa",name:"PWA Shell",path:"app/",status:request.outputs.targets.includes("pwa")?"planned":"not-requested",description:"Shared Field Vault runtime configured by the generated profile."},
    {id:"ios",name:"iOS Project Profile",path:"native/ios-profile.json",status:request.outputs.targets.includes("ios-profile")?"planned":"not-requested",description:"Xcode handoff configuration; native project generation remains a later factory stage."},
    {id:"assets",name:"Brand Asset Set",path:"assets/",status:recipe.assetStatus==="production"?"ready":"required",description:recipe.assetStatus==="production"?"Production assets assigned.":"Original app icon, mark, logo, and launch assets are required."},
    {id:"database",name:"Verified Content Database",path:"content/",status:recipe.databaseStatus==="user-vault"?"ready":"required",description:recipe.databaseStatus==="user-vault"?"Uses the existing user-managed vault.":"Verified records and versioned content-pack manifests are required."}
  ];
  return rows;
}

export function appForgeFactoryManifest(recipeId="firevault",build="1.03.0",overrides={}){
  const recipe=appForgeRecipeById(recipeId);if(!recipe)return null;
  const request=createAppForgeGenerationRequest(recipeId,overrides);
  const requestValidation=validateAppForgeGenerationRequest(request);
  const profile=requestValidation.ready?composeAppForgeProfile(request):null;
  const profileValidation=profile?validateAppForgeProfile(profile):{ready:false,passed:0,total:9,checks:[]};
  const blueprint=profile&&profileValidation.ready?appForgeBlueprintExport(profile,build):null;
  if(blueprint)delete blueprint.createdAt;
  const outputs=factoryOutputs(request,recipe,Boolean(blueprint));
  const requiredOutputs=outputs.filter(output=>output.status==="required");
  return clone({
    kind:APP_FORGE_FACTORY_KIND,
    schemaVersion:APP_FORGE_FACTORY_SCHEMA_VERSION,
    recipeSchemaVersion:APP_FORGE_RECIPE_SCHEMA_VERSION,
    build:String(build||"1.03.0"),
    request,
    recipe:{id:recipe.id,name:recipe.name,status:recipe.status,assetStatus:recipe.assetStatus,databaseStatus:recipe.databaseStatus},
    validation:{request:requestValidation,profile:profileValidation},
    readiness:{factoryReady:requestValidation.ready&&profileValidation.ready,publicationReady:requestValidation.ready&&profileValidation.ready&&!recipe.requirements.length&&!requiredOutputs.length,state:!requestValidation.ready||!profileValidation.ready?"blocked":requiredOutputs.length?"requirements-pending":"ready"},
    requirements:{publication:[...recipe.requirements],requiredOutputs:requiredOutputs.map(output=>output.id)},
    outputs,
    guardrails:{activeAppId:APP_PROFILE.id,activeAppUnchanged:true,customerDataExcluded:true,credentialsExcluded:true,recipeActivation:false,automaticPublishing:false},
    blueprint
  });
}

export function appForgeFactorySummary(build="1.03.0"){
  const manifests=appForgeRecipes().map(recipe=>appForgeFactoryManifest(recipe.id,build)).filter(Boolean);
  return clone({schemaVersion:APP_FORGE_FACTORY_SCHEMA_VERSION,total:manifests.length,factoryReady:manifests.filter(manifest=>manifest.readiness.factoryReady).length,publicationReady:manifests.filter(manifest=>manifest.readiness.publicationReady).length,requirementsPending:manifests.filter(manifest=>manifest.readiness.state==="requirements-pending").length,outputItems:manifests.reduce((sum,manifest)=>sum+manifest.outputs.length,0)});
}

export function appForgeFactorySchemaExport(){return clone({version:APP_FORGE_FACTORY_SCHEMA_VERSION,kind:APP_FORGE_FACTORY_KIND,generationRequest:APP_FORGE_GENERATION_REQUEST_SCHEMA});}
