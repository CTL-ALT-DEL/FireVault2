import { APP_PROFILE, APP_PROFILE_SCHEMA_VERSION } from "./app-profile.js?v=1.01.0";
import { MODULE_REGISTRY, MODULE_REGISTRY_VERSION, moduleRegistryExport } from "./module-registry.js?v=1.01.0";
import { MODULE_BINDINGS_VERSION, moduleBindingsExport } from "./module-bindings.js?v=1.01.0";
import { RECORD_SCHEMA, RECORD_SCHEMA_VERSION, recordSchemaExport } from "./record-schema.js?v=1.01.0";
import { WORKFLOW_SCHEMA, WORKFLOW_SCHEMA_VERSION, workflowSchemaExport } from "./workflow-schema.js?v=1.01.0";
import { THEME_PROFILE_SCHEMA_VERSION, resolveThemeProfile, themeProfileExport } from "./theme-profile.js?v=1.01.0";
import { CONTENT_PACK_SCHEMA_VERSION, CONTENT_SOURCES, CONTENT_PACKS, contentPackRegistryExport } from "./content-pack-registry.js?v=1.01.0";
import { SYNC_STORAGE_PROFILE_SCHEMA_VERSION, STORAGE_PROVIDERS, resolveSyncStorageProfile, syncStorageProfileExport } from "./sync-storage-profile.js?v=1.01.0";

export const APP_FORGE_BLUEPRINT_SCHEMA_VERSION = 1;
export const APP_FORGE_BLUEPRINT_KIND = "field-vault.app-forge-blueprint";

function unique(values=[]){return [...new Set((Array.isArray(values)?values:[]).map(value=>String(value||"").trim()).filter(Boolean))];}
function clone(value){return JSON.parse(JSON.stringify(value));}
function result(id,label,ok,detail,severity="error"){return {id,label,ok:Boolean(ok),severity:ok?"pass":severity,detail:String(detail||"")};}

export function validateAppForgeProfile(appProfile=APP_PROFILE){
  const enabled=new Set(unique(appProfile?.enabledModules));
  const moduleIds=new Set(MODULE_REGISTRY.map(module=>module.id));
  const unknownModules=[...enabled].filter(id=>!moduleIds.has(id));
  const missingDependencies=MODULE_REGISTRY.filter(module=>enabled.has(module.id)).flatMap(module=>(module.dependencies||[]).filter(id=>!enabled.has(id)).map(id=>`${module.id} → ${id}`));

  const bindings=moduleBindingsExport();
  const bindingModules=unique([
    ...Object.values(bindings.navigation||{}).flat(),
    ...Object.values(bindings.routes||{}).flat(),
    ...Object.values(bindings.settings||{}).flat(),
    ...(bindings.accountTabs||[]).flatMap(tab=>tab.modules||[])
  ]);
  const unknownBindingModules=bindingModules.filter(id=>!moduleIds.has(id));

  const fieldIds=new Set(RECORD_SCHEMA.fields.map(field=>field.id));
  const sectionIds=new Set(RECORD_SCHEMA.detailSections.map(section=>section.id));
  const photoCategoryIds=new Set(RECORD_SCHEMA.photoCategories.map(category=>category.id));
  const unknownRecordRefs=[
    ...unique(appProfile?.dataModel?.enabledFieldIds).filter(id=>!fieldIds.has(id)).map(id=>`field:${id}`),
    ...unique(appProfile?.dataModel?.requiredFieldIds).filter(id=>!fieldIds.has(id)).map(id=>`required:${id}`),
    ...unique(appProfile?.dataModel?.detailSectionIds).filter(id=>!sectionIds.has(id)).map(id=>`section:${id}`),
    ...unique(appProfile?.dataModel?.photoCategoryIds).filter(id=>!photoCategoryIds.has(id)).map(id=>`photo:${id}`)
  ];

  const actionIds=new Set(WORKFLOW_SCHEMA.actions.map(action=>action.id));
  const workflowRefs=unique([
    ...(appProfile?.workflows?.directoryActionIds||[]),
    ...(appProfile?.workflows?.detailPrimaryActionIds||[]),
    ...(appProfile?.workflows?.notesActionIds||[])
  ]);
  const unknownWorkflowRefs=workflowRefs.filter(id=>!actionIds.has(id));

  const sourceIds=new Set(CONTENT_SOURCES.map(source=>source.id));
  const packIds=new Set(CONTENT_PACKS.map(pack=>pack.id));
  const configuredSources=new Set(unique(appProfile?.content?.enabledSourceIds));
  const configuredPacks=unique(appProfile?.content?.enabledPackIds);
  const unknownContentRefs=[
    ...[...configuredSources].filter(id=>!sourceIds.has(id)).map(id=>`source:${id}`),
    ...configuredPacks.filter(id=>!packIds.has(id)).map(id=>`pack:${id}`)
  ];
  const unavailablePackSources=configuredPacks.map(id=>CONTENT_PACKS.find(pack=>pack.id===id)).filter(Boolean).filter(pack=>!configuredSources.has(pack.sourceId)).map(pack=>`${pack.id} → ${pack.sourceId}`);

  const providerIds=new Set(STORAGE_PROVIDERS.map(provider=>provider.id));
  const configuredProviders=new Set(unique(appProfile?.syncStorage?.enabledProviderIds));
  const unknownProviders=[...configuredProviders].filter(id=>!providerIds.has(id));
  const roleProviders=Object.entries(appProfile?.syncStorage?.roles||{}).flatMap(([role,ids])=>unique(ids).filter(id=>!configuredProviders.has(id)||!providerIds.has(id)).map(id=>`${role}:${id}`));

  const theme=resolveThemeProfile(appProfile);
  const requiredAssets=[theme.branding.mark,theme.branding.logo,theme.branding.icon192,theme.branding.icon512,theme.branding.appleTouchIcon].filter(Boolean);
  const identityOk=Boolean(String(appProfile?.id||"").trim()&&String(appProfile?.name||"").trim()&&String(appProfile?.industry||"").trim()&&String(appProfile?.purpose||"").trim());
  const checks=[
    result("identity","Product identity",identityOk,identityOk?`${appProfile.name} has an ID, industry, and purpose.`:"ID, name, industry, and purpose are required."),
    result("modules","Module selection",!unknownModules.length,unknownModules.length?`Unknown: ${unknownModules.join(", ")}`:`${enabled.size} selected modules resolve.`),
    result("dependencies","Module dependencies",!missingDependencies.length,missingDependencies.length?`Missing: ${missingDependencies.join(", ")}`:"Every selected module dependency is enabled."),
    result("bindings","UI bindings",!unknownBindingModules.length,unknownBindingModules.length?`Unknown: ${unknownBindingModules.join(", ")}`:`${bindingModules.length} binding references resolve.`),
    result("records","Record schema",!unknownRecordRefs.length,unknownRecordRefs.length?`Unknown: ${unknownRecordRefs.join(", ")}`:"Fields, detail sections, and photo categories resolve."),
    result("workflows","Workflow schema",!unknownWorkflowRefs.length,unknownWorkflowRefs.length?`Unknown: ${unknownWorkflowRefs.join(", ")}`:`${workflowRefs.length} configured actions resolve.`),
    result("content","Content packs",!unknownContentRefs.length&&!unavailablePackSources.length,[...unknownContentRefs,...unavailablePackSources].length?`Unresolved: ${[...unknownContentRefs,...unavailablePackSources].join(", ")}`:"Every selected pack and source resolves."),
    result("storage","Sync and storage",!unknownProviders.length&&!roleProviders.length,[...unknownProviders,...roleProviders].length?`Unresolved: ${[...unknownProviders,...roleProviders].join(", ")}`:"Every provider and storage role resolves."),
    result("theme","Theme assets",requiredAssets.length===5,requiredAssets.length===5?"Mark, logo, PWA icons, and Apple touch icon are assigned.":"All five required brand assets must be assigned.")
  ];
  const errors=checks.filter(check=>!check.ok&&check.severity==="error");
  const warnings=checks.filter(check=>!check.ok&&check.severity==="warning");
  return clone({ready:errors.length===0,status:errors.length?"blocked":warnings.length?"review":"ready",checks,passed:checks.filter(check=>check.ok).length,total:checks.length,errorCount:errors.length,warningCount:warnings.length});
}

export function appForgeReadinessSummary(appProfile=APP_PROFILE){
  const validation=validateAppForgeProfile(appProfile);
  const enabled=new Set(unique(appProfile?.enabledModules));
  const enabledModules=MODULE_REGISTRY.filter(module=>enabled.has(module.id));
  return clone({
    schemaVersion:APP_FORGE_BLUEPRINT_SCHEMA_VERSION,
    ready:validation.ready,
    status:validation.status,
    checksPassed:validation.passed,
    checksTotal:validation.total,
    enabledModules:enabledModules.length,
    reusableModules:enabledModules.filter(module=>module.appForgeReady).length,
    verticalModules:enabledModules.filter(module=>!module.appForgeReady).length,
    productId:appProfile?.id||"",
    productName:appProfile?.name||""
  });
}

export function appForgeBlueprintExport(appProfile=APP_PROFILE,build="1.01.0"){
  const validation=validateAppForgeProfile(appProfile);
  const theme=resolveThemeProfile(appProfile);
  const storage=resolveSyncStorageProfile(appProfile);
  return clone({
    kind:APP_FORGE_BLUEPRINT_KIND,
    schemaVersion:APP_FORGE_BLUEPRINT_SCHEMA_VERSION,
    build:String(build||"1.01.0"),
    createdAt:new Date().toISOString(),
    product:{
      id:appProfile.id,
      family:appProfile.family,
      name:appProfile.name,
      shortName:appProfile.shortName,
      industry:appProfile.industry,
      audience:appProfile.audience,
      purpose:appProfile.purpose
    },
    readiness:validation,
    contracts:{
      appProfile:APP_PROFILE_SCHEMA_VERSION,
      moduleRegistry:MODULE_REGISTRY_VERSION,
      moduleBindings:MODULE_BINDINGS_VERSION,
      recordSchema:RECORD_SCHEMA_VERSION,
      workflowSchema:WORKFLOW_SCHEMA_VERSION,
      themeProfile:THEME_PROFILE_SCHEMA_VERSION,
      contentPacks:CONTENT_PACK_SCHEMA_VERSION,
      syncStorageProfile:SYNC_STORAGE_PROFILE_SCHEMA_VERSION
    },
    runtime:{
      architecture:"shared-field-vault-core",
      defaultRoute:appProfile?.navigation?.nearby?"home":"settings",
      offlineFirst:storage.local.offlineFirst,
      pwa:{manifest:"manifest.json",serviceWorker:"sw.js",themeColor:theme.chrome.themeColor,backgroundColor:theme.chrome.backgroundColor},
      nativeTargets:{ios:"profile-ready",android:"profile-ready"}
    },
    appProfile:clone(appProfile),
    components:{
      moduleRegistry:moduleRegistryExport(),
      moduleBindings:moduleBindingsExport(),
      recordSchema:recordSchemaExport(appProfile),
      workflowSchema:workflowSchemaExport(appProfile),
      themeProfile:themeProfileExport(appProfile),
      contentPacks:contentPackRegistryExport(appProfile),
      syncStorage:syncStorageProfileExport(appProfile)
    }
  });
}
