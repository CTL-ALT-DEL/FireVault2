import { APP_PROFILE } from "./app-profile.js?v=1.03.5";
import { validateAppForgeProfile, appForgeBlueprintExport } from "./app-forge-blueprint.js?v=1.03.5";

export const APP_FORGE_RECIPE_SCHEMA_VERSION = 1;

function clone(value){return JSON.parse(JSON.stringify(value));}
function locationModules(){return [
  "core.records","core.themeProfile","core.contentPacks","core.syncStorageProfile","core.appForgeBlueprint","core.appForgeRecipes",
  "core.search","core.nearby","core.notes","core.photos","core.files","core.photoOverlay","core.locationNavigator",
  "core.offlineStorage","core.backupRestore","core.security","optional.importExport"
];}
function localStorageProfile(id){return {
  profileId:`${id}-local-first`,
  enabledProviderIds:["local"],
  roles:{vault:["local"],media:["local"],backup:["local"],photo:["local"],document:["local"],"sync-package":[]},
  local:{offlineFirst:true,vaultBackend:"localStorage",mediaBackend:"indexedDB",persistentStorageRecommended:true},
  backup:{manualExport:true,automaticSnapshots:true,snapshotLimit:12,verifyBeforeRestore:true,includeMedia:true},
  collaboration:{mode:"disabled",automaticSync:false,queueOffline:true,conflictPolicy:"manual-review"},
  security:{storeCredentialsInVault:false,requireHttps:true,preserveLocalCopy:true,preventPersonalFallback:true}
};}
function locationDataModel(id){return {
  schemaId:`${id}.location.v1`,
  enabledFieldIds:["name","externalAccountId","street","city","state","zip","gps","notes"],
  requiredFieldIds:["name"],
  detailSectionIds:["overview","notes","locations","docs","details"],
  photoCategoryIds:["before","after","other"]
};}
function locationWorkflows(id){return {
  presetId:`${id}-explorer`,
  directoryActionIds:["route","note","favorite","photo"],
  detailPrimaryActionIds:["route","note","photo"],
  notesActionIds:["photo"],
  quickPhoto:{defaultUseOverlay:true,defaultIncludeReport:false,rememberAccount:true,rememberCategory:true,allowAccountChange:true,allowRetake:true,showCategory:true,showOverlayToggle:true,showReportToggle:false,showTitle:true,showInternalNotes:true,showCustomerCaption:true,cameraFacing:"environment",maxImageDimension:2048,jpegQuality:.86}
};}
function locationProfile(spec){
  const profile=clone(APP_PROFILE);
  profile.id=spec.id;profile.name=spec.name;profile.shortName=spec.shortName;profile.industry=spec.industry;profile.audience=spec.audience;profile.purpose=spec.purpose;
  profile.terminology={...profile.terminology,recordSingular:spec.recordSingular,recordPlural:spec.recordPlural,recordId:spec.recordId,personSingular:"Explorer",personPlural:"Explorers",equipmentSingular:"Feature",equipmentPlural:"Features",deficiencySingular:"Condition",deficiencyPlural:"Conditions"};
  profile.navigation={nearby:"Nearby",search:"Explore",photo:"Photo",settings:"Settings"};
  profile.branding={...profile.branding,wordmark:[{text:spec.wordmark[0],tone:"primary"},{text:spec.wordmark[1],tone:"accent"}],tagline:spec.tagline};
  profile.appearance={...profile.appearance,profileId:`${spec.id}-dark`,profileName:`${spec.name} Dark`,accent:spec.accent,accentStrong:spec.accentStrong,background:spec.background,surface:spec.surface,surfaceRaised:spec.surfaceRaised,themeColor:spec.themeColor};
  profile.dataModel=locationDataModel(spec.id);
  profile.workflows=locationWorkflows(spec.id);
  profile.content={registryId:`${spec.id}-content-v1`,enabledSourceIds:["local.user-vault","bundled.app-reference","import.csv-json","remote.versioned-catalog"],enabledPackIds:["core.user-library","core.account-content",...spec.packIds],updatePolicy:{mode:"manual",allowMetered:false,verifyManifests:true,keepPreviousVersion:true}};
  profile.syncStorage=localStorageProfile(spec.id);
  profile.enabledModules=locationModules();
  profile.interfaceIntegration={...profile.interfaceIntegration,appForgeBlueprint:true,appForgeRecipes:true};
  return profile;
}

const RECIPE_DEFINITIONS=[
  {
    id:"firevault",name:"FireVault",category:"Field service",description:"Production fire-alarm technician product using the complete active FireVault profile.",profile:clone(APP_PROFILE),status:"active",assetStatus:"production",databaseStatus:"user-vault",requirements:[]
  },
  {
    id:"wyoming-explorer",name:"Wyoming Explorer",category:"Travel guide",description:"Statewide points of interest, unusual stops, services, history, photos, notes, and nearby navigation.",status:"foundation",assetStatus:"placeholder",databaseStatus:"planned-content-pack",requirements:["Replace placeholder brand icons","Install a verified Wyoming location database"],
    profile:locationProfile({id:"wyoming-explorer",name:"Wyoming Explorer",shortName:"WY Explorer",industry:"Wyoming travel and discovery",audience:"Wyoming residents and travelers",purpose:"Offline-friendly discovery, navigation, photos, notes, and reference information for Wyoming destinations.",recordSingular:"Place",recordPlural:"Places",recordId:"Place ID",wordmark:["WYOMING","EXPLORER"],tagline:"Find What Is Nearby",accent:"#f59e0b",accentStrong:"#92400e",background:"#07110d",surface:"#102019",surfaceRaised:"#183128",themeColor:"#0b1812",packIds:["travel.wyoming-points"]})
  },
  {
    id:"wyoming-fishing",name:"Wyoming Fishing Guide",category:"Outdoor guide",description:"Fishing access points, water notes, regulations, conditions, photos, and exact parking or access locations.",status:"foundation",assetStatus:"placeholder",databaseStatus:"planned-content-pack",requirements:["Replace placeholder brand icons","Install verified fishing locations and current regulations"],
    profile:locationProfile({id:"wyoming-fishing",name:"Wyoming Fishing Guide",shortName:"WY Fishing",industry:"Fishing and outdoor recreation",audience:"Wyoming anglers and visitors",purpose:"Offline-friendly fishing-location discovery, access navigation, personal notes, photos, and reference information.",recordSingular:"Fishing Spot",recordPlural:"Fishing Spots",recordId:"Spot ID",wordmark:["FISH","GUIDE"],tagline:"Water, Access, Conditions",accent:"#38bdf8",accentStrong:"#0369a1",background:"#06111a",surface:"#0d1e2b",surfaceRaised:"#153247",themeColor:"#081722",packIds:["outdoors.fishing-spots"]})
  },
  {
    id:"ghost-towns",name:"Ghost Towns Guide",category:"Themed travel",description:"Historic and abandoned places with access, safety, history, photos, personal notes, and nearby navigation.",status:"foundation",assetStatus:"placeholder",databaseStatus:"planned-content-pack",requirements:["Replace placeholder brand icons","Install a verified historic-sites database"],
    profile:locationProfile({id:"ghost-towns",name:"Ghost Towns Guide",shortName:"Ghost Towns",industry:"Historic and themed travel",audience:"History travelers and explorers",purpose:"Offline-friendly discovery, access guidance, history, safety notes, photos, and navigation for ghost towns and historic sites.",recordSingular:"Historic Site",recordPlural:"Historic Sites",recordId:"Site ID",wordmark:["GHOST","TOWNS"],tagline:"History Beyond the Highway",accent:"#d97706",accentStrong:"#78350f",background:"#120d08",surface:"#21170f",surfaceRaised:"#342317",themeColor:"#171008",packIds:["travel.wyoming-points","history.ghost-towns"]})
  }
];

export const APP_FORGE_RECIPES=Object.freeze(RECIPE_DEFINITIONS.map(recipe=>Object.freeze(clone(recipe))));

export function appForgeRecipes(){return clone(APP_FORGE_RECIPES.map(recipe=>{
  const validation=validateAppForgeProfile(recipe.profile);
  return {...recipe,validation,profile:clone(recipe.profile)};
}));}
export function appForgeRecipeById(id){return appForgeRecipes().find(recipe=>recipe.id===String(id||""))||null;}
export function appForgeRecipeSummary(){
  const recipes=appForgeRecipes();
  return {schemaVersion:APP_FORGE_RECIPE_SCHEMA_VERSION,total:recipes.length,active:recipes.filter(recipe=>recipe.status==="active").length,foundation:recipes.filter(recipe=>recipe.status==="foundation").length,blueprintReady:recipes.filter(recipe=>recipe.validation.ready).length,publishReady:recipes.filter(recipe=>recipe.status==="active"&&!recipe.requirements.length).length};
}
export function appForgeRecipeBlueprintExport(id,build="1.03.5"){
  const recipe=appForgeRecipeById(id);if(!recipe)return null;
  const blueprint=appForgeBlueprintExport(recipe.profile,build);
  blueprint.recipe={schemaVersion:APP_FORGE_RECIPE_SCHEMA_VERSION,id:recipe.id,category:recipe.category,status:recipe.status,assetStatus:recipe.assetStatus,databaseStatus:recipe.databaseStatus,requirements:[...recipe.requirements]};
  return blueprint;
}
export function appForgeRecipeCatalogExport(){
  return {version:APP_FORGE_RECIPE_SCHEMA_VERSION,recipes:appForgeRecipes().map(recipe=>({id:recipe.id,name:recipe.name,category:recipe.category,description:recipe.description,status:recipe.status,assetStatus:recipe.assetStatus,databaseStatus:recipe.databaseStatus,requirements:[...recipe.requirements],profile:recipe.profile,validation:recipe.validation}))};
}
