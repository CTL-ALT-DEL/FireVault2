import { MODULE_REGISTRY, moduleById, enabledModuleIds } from "./module-registry.js?v=0.96.1";
import { NAV_MODULE_REQUIREMENTS, ROUTE_MODULE_REQUIREMENTS, SETTINGS_MODULE_REQUIREMENTS, ACCOUNT_TAB_BINDINGS } from "./module-bindings.js?v=0.96.1";
import { RECORD_SCHEMA, activeRecordFields, activeDetailSections, recordPhotoCategories } from "./record-schema.js?v=0.96.1";
import { WORKFLOW_SCHEMA, activeWorkflowActions, quickPhotoWorkflow } from "./workflow-schema.js?v=0.96.1";
import { resolveThemeProfile } from "./theme-profile.js?v=0.96.1";
import { CONTENT_SOURCES, CONTENT_PACKS, activeContentSources, activeContentPacks } from "./content-pack-registry.js?v=0.96.1";
import { STORAGE_PROVIDERS, resolveSyncStorageProfile, syncStorageSettingsTabEnabled } from "./sync-storage-profile.js?v=0.96.1";

export const ARCHITECTURE_AUDIT_SCHEMA_VERSION = 1;

export const LOCATION_GUIDE_TEST_PROFILE = Object.freeze({
  schemaVersion:9,
  id:"location-guide-proof",
  family:"field-vault",
  name:"Location Guide Proof",
  shortName:"Guide Proof",
  industry:"Location guide",
  audience:"Travelers and field researchers",
  purpose:"Hidden validation profile proving that the shared Field Vault core can operate without FireVault-specific modules.",
  terminology:Object.freeze({
    recordSingular:"Location",recordPlural:"Locations",recordId:"Location ID",
    locationSingular:"Point",locationPlural:"Points",personSingular:"Contributor",personPlural:"Contributors",
    noteSingular:"Note",notePlural:"Notes",equipmentSingular:"Amenity",equipmentPlural:"Amenities",
    deficiencySingular:"Condition",deficiencyPlural:"Conditions",taskSingular:"Checklist Item",taskPlural:"Checklist Items",
    fileSingular:"Reference",filePlural:"References"
  }),
  labels:Object.freeze({
    recordDirectory:"Location Directory",recordDetail:"Location Detail",addRecord:"Add Location",editRecord:"Edit Location",
    unnamedRecord:"Unnamed Location",searchRecords:"Search Locations",nearbyRecords:"Nearby Locations",chooseRecord:"Choose Location",
    currentRecord:"Current Location",recordActions:"Location actions",recordSections:"Location sections",noRecords:"No Locations yet",
    noMatchingRecords:"No matching Locations",firstRecord:"Add First Location",recordPhoto:"Location Photo",recordPhotos:"Location Photos"
  }),
  navigation:Object.freeze({nearby:"Nearby",search:"Explore",photo:"Photo",settings:"Settings"}),
  branding:Object.freeze({
    mark:"assets/favicon.png",logo:"assets/firevault-logo-master.png",icon192:"assets/icon-192.png",icon512:"assets/icon-512.png",
    appleTouchIcon:"assets/apple-touch-icon.png",wordmark:Object.freeze([Object.freeze({text:"LOCATION",tone:"primary"}),Object.freeze({text:"GUIDE",tone:"accent"})]),tagline:"Places worth finding"
  }),
  appearance:Object.freeze({
    profileId:"location-guide-proof-dark",profileName:"Location Guide Proof Dark",theme:"dark",accent:"#22c55e",accentStrong:"#166534",
    background:"#07110d",surface:"#102018",surfaceRaised:"#173326",line:"#315343",text:"#f0fdf4",muted:"#a7c4b2",
    success:"#22c55e",warning:"#f59e0b",info:"#38bdf8",cyan:"#22d3ee",themeColor:"#07110d",statusBarStyle:"black",
    radius:18,controlRadius:15,compact:false,baseFontSize:14
  }),
  defaultPhotoCategories:Object.freeze(["Before","After","Other"]),
  dataModel:Object.freeze({
    schemaId:"firevault.account.v1",
    enabledFieldIds:Object.freeze(["name","externalAccountId","street","city","state","zip","gps","notes"]),
    requiredFieldIds:Object.freeze(["name"]),
    detailSectionIds:Object.freeze(["overview","notes","locations","docs","details"]),
    photoCategoryIds:Object.freeze(["before","after","other"])
  }),
  workflows:Object.freeze({
    presetId:"location-guide-proof",
    directoryActionIds:Object.freeze(["route","note","photo","favorite"]),
    detailPrimaryActionIds:Object.freeze(["route","note","photo"]),
    notesActionIds:Object.freeze(["photo"]),
    quickPhoto:Object.freeze({defaultUseOverlay:true,defaultIncludeReport:false,rememberAccount:true,rememberCategory:true,allowAccountChange:true,allowRetake:true,showCategory:true,showOverlayToggle:true,showReportToggle:false,showTitle:true,showInternalNotes:true,showCustomerCaption:true,cameraFacing:"environment",maxImageDimension:2048,jpegQuality:0.86})
  }),
  content:Object.freeze({
    registryId:"location-guide-proof-content",
    enabledSourceIds:Object.freeze(["local.user-vault","bundled.app-reference","remote.versioned-catalog","import.csv-json"]),
    enabledPackIds:Object.freeze(["core.user-library","core.account-content","travel.wyoming-points"]),
    updatePolicy:Object.freeze({mode:"manual",allowMetered:false,verifyManifests:true,keepPreviousVersion:true})
  }),
  syncStorage:Object.freeze({
    profileId:"location-guide-proof-local",
    enabledProviderIds:Object.freeze(["local"]),
    roles:Object.freeze({vault:Object.freeze(["local"]),media:Object.freeze(["local"]),backup:Object.freeze(["local"]),photo:Object.freeze(["local"]),document:Object.freeze(["local"]),"sync-package":Object.freeze([])}),
    local:Object.freeze({offlineFirst:true,vaultBackend:"localStorage",mediaBackend:"indexedDB",persistentStorageRecommended:true}),
    backup:Object.freeze({manualExport:true,automaticSnapshots:true,snapshotLimit:8,verifyBeforeRestore:true,includeMedia:true}),
    collaboration:Object.freeze({mode:"disabled",automaticSync:false,queueOffline:true,conflictPolicy:"manual-review"}),
    security:Object.freeze({storeCredentialsInVault:false,requireHttps:true,preserveLocalCopy:true,preventPersonalFallback:true})
  }),
  interfaceIntegration:Object.freeze({terminology:true,navigation:true,routes:true,accountTabs:true,accountActions:true,settings:true,recordFields:true,detailSections:true,photoCategories:true,workflows:true,brandingTheme:true,contentPacks:true,syncStorage:true,architectureValidation:true}),
  enabledModules:Object.freeze([
    "core.records","core.themeProfile","core.contentPacks","core.syncStorageProfile","core.architectureValidation","core.search","core.nearby","core.notes","core.photos","core.files","core.photoOverlay","core.locationNavigator","core.offlineStorage","core.backupRestore","core.security","optional.importExport"
  ])
});

const RUNTIME_ROUTE_CATALOG = Object.freeze([
  "home","dashboard068","dailySummary","actionCenter","pinnedSites","sites","nearbySites","attention","siteDetail","visits","visitDetail","checklist","siteForm","contactsList","contactForm","siteDocs","siteDocForm","equipmentList","equipmentForm","tasks","taskForm","deficiencies","deficiencyForm","report","library","resourceForm","jobMode","settings"
]);
const RUNTIME_ACCOUNT_TAB_CATALOG = Object.freeze(["overview","notes","locations","equipment","docs","details"]);
const RUNTIME_SETTINGS_CATALOG = Object.freeze(["tech","gps","plusCodes","overlay","reports","email","privacy","security","cloudFiles","microsoftStorage","sync","customerImport","categories","backup","webdav","updates","demo","about","architecture"]);

function unique(values=[]){return [...new Set(Array.isArray(values)?values:[])];}
function issue(checks,id,category,status,title,detail,evidence={}){
  checks.push({id,category,status,title,detail,evidence});
}
function pass(checks,id,category,title,detail,evidence={}){issue(checks,id,category,"pass",title,detail,evidence);}
function warn(checks,id,category,title,detail,evidence={}){issue(checks,id,category,"warning",title,detail,evidence);}
function fail(checks,id,category,title,detail,evidence={}){issue(checks,id,category,"fail",title,detail,evidence);}
function configuredIds(profile,path=[]){
  let value=profile;
  for(const key of path)value=value?.[key];
  return Array.isArray(value)?value:[];
}
function unknownIds(values,known){const set=new Set(known);return unique(values).filter(id=>!set.has(id));}
function duplicateIds(values){const seen=new Set(),dupes=new Set();for(const value of values||[]){if(seen.has(value))dupes.add(value);seen.add(value);}return [...dupes];}
function requirementsUnknown(binding){
  const registered=new Set(MODULE_REGISTRY.map(module=>module.id));
  return unique(Object.values(binding).flat()).filter(id=>!registered.has(id));
}
function sectionResult(checks,category){
  const items=checks.filter(check=>check.category===category);
  return {category,total:items.length,pass:items.filter(item=>item.status==="pass").length,warning:items.filter(item=>item.status==="warning").length,fail:items.filter(item=>item.status==="fail").length};
}

export function runArchitectureAudit(profile={},options={}){
  const checks=[];
  const enabled=enabledModuleIds(profile);
  const enabledSet=new Set(enabled);
  const moduleIds=MODULE_REGISTRY.map(module=>module.id);
  const profileLabel=profile.name||profile.id||"Unnamed profile";

  if(profile.id&&profile.name)pass(checks,"profile.identity","Profile","Profile identity is complete",`${profileLabel} has a stable id and display name.`,{id:profile.id,name:profile.name});
  else fail(checks,"profile.identity","Profile","Profile identity is incomplete","Both profile.id and profile.name are required.");

  const unknownModules=unknownIds(enabled,moduleIds);
  unknownModules.length?fail(checks,"modules.references","Modules","Enabled modules contain unknown IDs",unknownModules.join(", "),{unknownModules}):pass(checks,"modules.references","Modules","All enabled modules are registered",`${enabled.length} enabled module IDs resolve in the Module Registry.`);
  const duplicateModules=duplicateIds(profile.enabledModules||[]);
  duplicateModules.length?warn(checks,"modules.duplicates","Modules","Duplicate module IDs were found",duplicateModules.join(", "),{duplicateModules}):pass(checks,"modules.duplicates","Modules","Enabled module IDs are unique","No duplicate module IDs were found.");

  const missingDependencies=[];
  enabled.forEach(id=>{
    const module=moduleById(id);
    (module?.dependencies||[]).forEach(dependency=>{if(!enabledSet.has(dependency))missingDependencies.push({module:id,dependency});});
  });
  missingDependencies.length?fail(checks,"modules.dependencies","Modules","Enabled-module dependencies are incomplete",missingDependencies.map(row=>`${row.module} → ${row.dependency}`).join("; "),{missingDependencies}):pass(checks,"modules.dependencies","Modules","All enabled-module dependencies are satisfied",`${enabled.length} enabled modules have a complete dependency chain.`);

  const bindingUnknown=[...requirementsUnknown(NAV_MODULE_REQUIREMENTS),...requirementsUnknown(ROUTE_MODULE_REQUIREMENTS),...requirementsUnknown(SETTINGS_MODULE_REQUIREMENTS),...unknownIds(ACCOUNT_TAB_BINDINGS.flatMap(item=>item.modules||[]),moduleIds)];
  const bindingUnknownUnique=unique(bindingUnknown);
  bindingUnknownUnique.length?fail(checks,"bindings.moduleReferences","Bindings","UI bindings reference unknown modules",bindingUnknownUnique.join(", "),{unknown:bindingUnknownUnique}):pass(checks,"bindings.moduleReferences","Bindings","All UI binding module references are valid","Navigation, route, Settings, and Account Detail bindings resolve to registered modules.");

  const boundRoutes=Object.keys(ROUTE_MODULE_REQUIREMENTS);
  const missingRuntimeRoutes=boundRoutes.filter(route=>!RUNTIME_ROUTE_CATALOG.includes(route));
  missingRuntimeRoutes.length?fail(checks,"routes.runtimeCoverage","Routes","Bound routes are missing from the runtime catalog",missingRuntimeRoutes.join(", "),{missingRuntimeRoutes}):pass(checks,"routes.runtimeCoverage","Routes","All profile-controlled routes have runtime handlers",`${boundRoutes.length} route bindings map to supported runtime screens.`);
  const activeRoutes=boundRoutes.filter(route=>(ROUTE_MODULE_REQUIREMENTS[route]||[]).every(id=>enabledSet.has(id)));
  activeRoutes.length?pass(checks,"routes.active","Routes","The profile exposes active routes",`${activeRoutes.length} profile-controlled routes are active.`,{activeRoutes}):fail(checks,"routes.active","Routes","The profile exposes no active routes","At least one Search, Nearby, record, or Settings route must be available.");

  const boundSettings=Object.keys(SETTINGS_MODULE_REQUIREMENTS);
  const unsupportedSettings=boundSettings.filter(tab=>!RUNTIME_SETTINGS_CATALOG.includes(tab));
  unsupportedSettings.length?fail(checks,"settings.runtimeCoverage","Settings","Bound Settings pages are missing from the runtime catalog",unsupportedSettings.join(", "),{unsupportedSettings}):pass(checks,"settings.runtimeCoverage","Settings","All bound Settings pages have runtime handlers",`${boundSettings.length} Settings bindings map to supported pages.`);

  const configuredFields=configuredIds(profile,["dataModel","enabledFieldIds"]);
  const configuredRequired=configuredIds(profile,["dataModel","requiredFieldIds"]);
  const configuredSections=configuredIds(profile,["dataModel","detailSectionIds"]);
  const configuredCategories=configuredIds(profile,["dataModel","photoCategoryIds"]);
  const unknownFields=unknownIds(configuredFields,RECORD_SCHEMA.fields.map(field=>field.id));
  const unknownRequired=unknownIds(configuredRequired,RECORD_SCHEMA.fields.map(field=>field.id));
  const requiredNotEnabled=configuredRequired.filter(id=>!configuredFields.includes(id));
  const unknownSections=unknownIds(configuredSections,RECORD_SCHEMA.detailSections.map(section=>section.id));
  const unknownCategories=unknownIds(configuredCategories,RECORD_SCHEMA.photoCategories.map(category=>category.id));
  const dataProblems=[...unknownFields.map(id=>`field:${id}`),...unknownRequired.map(id=>`required:${id}`),...requiredNotEnabled.map(id=>`required-not-enabled:${id}`),...unknownSections.map(id=>`section:${id}`),...unknownCategories.map(id=>`photo-category:${id}`)];
  dataProblems.length?fail(checks,"records.references","Record schema","Record-schema configuration contains invalid references",dataProblems.join(", "),{unknownFields,unknownRequired,requiredNotEnabled,unknownSections,unknownCategories}):pass(checks,"records.references","Record schema","All configured record-schema references are valid",`${configuredFields.length} fields, ${configuredSections.length} sections, and ${configuredCategories.length} photo categories resolve.`);

  const fields=activeRecordFields(profile),sections=activeDetailSections(profile),categories=recordPhotoCategories(profile);
  fields.length?pass(checks,"records.activeFields","Record schema","The profile has active record fields",`${fields.length} fields remain after module filtering.`,{fields:fields.map(field=>field.id)}):fail(checks,"records.activeFields","Record schema","No record fields remain active","The record form cannot operate without at least one active field.");
  const unrenderedSections=sections.map(section=>section.id).filter(id=>!RUNTIME_ACCOUNT_TAB_CATALOG.includes(id)||!ACCOUNT_TAB_BINDINGS.some(binding=>binding.key===id));
  unrenderedSections.length?fail(checks,"records.detailSections","Record schema","Active detail sections lack a safe Account Detail renderer",unrenderedSections.join(", "),{unrenderedSections}):pass(checks,"records.detailSections","Record schema","Every active Account Detail section has a safe renderer",`${sections.length} active sections map to known Account Detail tabs.`,{sections:sections.map(section=>section.id)});
  categories.length?pass(checks,"records.photoCategories","Record schema","Photo categories are available",`${categories.length} categories remain after module filtering.`):warn(checks,"records.photoCategories","Record schema","No photo categories are active","Photo capture can still work, but category selection will be unavailable.");

  const actionIds=WORKFLOW_SCHEMA.actions.map(action=>action.id);
  const workflowRefs=[...configuredIds(profile,["workflows","directoryActionIds"]),...configuredIds(profile,["workflows","detailPrimaryActionIds"]),...configuredIds(profile,["workflows","notesActionIds"])];
  const unknownActions=unknownIds(workflowRefs,actionIds);
  unknownActions.length?fail(checks,"workflow.references","Workflow","Workflow presets contain unknown action IDs",unknownActions.join(", "),{unknownActions}):pass(checks,"workflow.references","Workflow","All configured workflow actions are registered",`${unique(workflowRefs).length} configured actions resolve.`);
  const surfaces={directory:activeWorkflowActions(profile,"directory"),detailPrimary:activeWorkflowActions(profile,"detailPrimary"),notes:activeWorkflowActions(profile,"notes")};
  const invalidSurfaceActions=[];
  Object.entries(surfaces).forEach(([surface,actions])=>actions.forEach(action=>{if(!action.surfaceSupport.includes(surface))invalidSurfaceActions.push(`${surface}:${action.id}`);}));
  invalidSurfaceActions.length?fail(checks,"workflow.surfaceSupport","Workflow","Actions are assigned to unsupported surfaces",invalidSurfaceActions.join(", "),{invalidSurfaceActions}):pass(checks,"workflow.surfaceSupport","Workflow","Active actions match their supported surfaces",`${Object.values(surfaces).flat().length} active action placements are valid.`);
  const photo=quickPhotoWorkflow(profile);
  if(photo.maxImageDimension>=640&&photo.maxImageDimension<=4096&&photo.jpegQuality>=.5&&photo.jpegQuality<=.96)pass(checks,"workflow.quickPhoto","Workflow","Quick Photo settings normalize safely",`${photo.maxImageDimension}px at JPEG quality ${photo.jpegQuality}.`);
  else fail(checks,"workflow.quickPhoto","Workflow","Quick Photo settings are outside supported limits","Review maximum image dimension and JPEG quality.",{photo});

  const theme=resolveThemeProfile(profile);
  const missingBrandAssets=["mark","logo","icon192","icon512","appleTouchIcon"].filter(key=>!theme.branding[key]);
  missingBrandAssets.length?fail(checks,"theme.assets","Theme","Theme branding assets are incomplete",missingBrandAssets.join(", "),{missingBrandAssets}):pass(checks,"theme.assets","Theme","Theme branding assets resolve","Mark, logo, install icons, and Apple touch icon are defined.");
  const colorValues=Object.values(theme.colors||{});
  colorValues.every(value=>/^#[0-9a-f]{6}$/i.test(value))?pass(checks,"theme.colors","Theme","Theme colors are valid six-digit hex values",`${colorValues.length} semantic colors validated.`):fail(checks,"theme.colors","Theme","Theme contains invalid color values","All semantic colors must use six-digit hex notation.");

  const sourceIds=CONTENT_SOURCES.map(source=>source.id),packIds=CONTENT_PACKS.map(pack=>pack.id);
  const configuredSources=configuredIds(profile,["content","enabledSourceIds"]),configuredPacks=configuredIds(profile,["content","enabledPackIds"]);
  const unknownSources=unknownIds(configuredSources,sourceIds),unknownPacks=unknownIds(configuredPacks,packIds);
  if(unknownSources.length||unknownPacks.length)fail(checks,"content.references","Content packs","Content configuration contains unknown sources or packs",[...unknownSources.map(id=>`source:${id}`),...unknownPacks.map(id=>`pack:${id}`)].join(", "),{unknownSources,unknownPacks});
  else pass(checks,"content.references","Content packs","All configured sources and packs are registered",`${configuredSources.length} sources and ${configuredPacks.length} packs resolve.`);
  const activeSources=activeContentSources(profile),activePacks=activeContentPacks(profile),activeSourceSet=new Set(activeSources.map(source=>source.id));
  const packsMissingSources=activePacks.filter(pack=>!activeSourceSet.has(pack.sourceId)).map(pack=>({pack:pack.id,source:pack.sourceId}));
  packsMissingSources.length?fail(checks,"content.sourceCoverage","Content packs","Active content packs are missing their configured source",packsMissingSources.map(row=>`${row.pack} → ${row.source}`).join("; "),{packsMissingSources}):pass(checks,"content.sourceCoverage","Content packs","Every active content pack has an approved source",`${activePacks.length} active packs have source coverage.`);

  const storage=resolveSyncStorageProfile(profile),providerIds=STORAGE_PROVIDERS.map(provider=>provider.id);
  const configuredProviders=configuredIds(profile,["syncStorage","enabledProviderIds"]),unknownProviders=unknownIds(configuredProviders,providerIds);
  unknownProviders.length?fail(checks,"storage.providers","Sync & storage","Storage configuration contains unknown providers",unknownProviders.join(", "),{unknownProviders}):pass(checks,"storage.providers","Sync & storage","All configured storage providers are registered",`${storage.enabledProviderIds.length} providers resolve.`);
  const roleProblems=[];
  Object.entries(storage.roles).forEach(([role,ids])=>ids.forEach(id=>{const provider=STORAGE_PROVIDERS.find(item=>item.id===id);if(!provider||!provider.roles.includes(role))roleProblems.push(`${role}:${id}`);}));
  roleProblems.length?fail(checks,"storage.roles","Sync & storage","Provider role assignments are invalid",roleProblems.join(", "),{roleProblems}):pass(checks,"storage.roles","Sync & storage","Provider roles match declared capabilities","Vault, media, backup, photo, document, and package roles validated.");
  if(storage.local.offlineFirst&&storage.roles.vault.includes("local")&&storage.roles.media.includes("local"))pass(checks,"storage.offlineFoundation","Sync & storage","Offline-first storage has local vault and media coverage",`${storage.local.vaultBackend} vault with ${storage.local.mediaBackend} media.`);
  else warn(checks,"storage.offlineFoundation","Sync & storage","Offline-first local coverage is incomplete","A field app should normally keep both vault and media roles on the local provider.");

  const enabledIntegration=Object.entries(profile.interfaceIntegration||{}).filter(([,value])=>value===true).map(([key])=>key);
  enabledIntegration.length>=10?pass(checks,"integration.coverage","Integration","Architecture layers are connected to the interface",`${enabledIntegration.length} integration flags are active.`,{enabledIntegration}):warn(checks,"integration.coverage","Integration","Some architecture layers are not marked active",`${enabledIntegration.length} integration flags are enabled.`,{enabledIntegration});

  if(profile.id==="firevault"){
    const expectedModules=["core.records","core.search","core.nearby","core.notes","core.photos","core.files","core.photoOverlay","core.locationNavigator","core.offlineStorage","core.backupRestore","core.security","optional.equipment","optional.tasks","optional.deficiencies","optional.reports","firevault.fireAlarmProfile","firevault.panelDocuments","firevault.fireLocationTypes"];
    const missingExpected=expectedModules.filter(id=>!enabledSet.has(id));
    missingExpected.length?fail(checks,"firevault.modules","FireVault regression","FireVault is missing expected technician modules",missingExpected.join(", "),{missingExpected}):pass(checks,"firevault.modules","FireVault regression","Expected technician modules remain enabled",`${expectedModules.length} critical FireVault modules are active.`);
    const expectedSections=["overview","notes","locations","equipment","docs","details"],missingSections=expectedSections.filter(id=>!sections.some(section=>section.id===id));
    missingSections.length?fail(checks,"firevault.sections","FireVault regression","FireVault Account Detail sections are missing",missingSections.join(", "),{missingSections}):pass(checks,"firevault.sections","FireVault regression","All FireVault Account Detail sections remain available",expectedSections.join(" · "));
    const expectedPhotoCategories=["panel","nac","device","communicator","battery","deficiency","before","after","other"],missingPhotoCategories=expectedPhotoCategories.filter(id=>!categories.some(category=>category.id===id));
    missingPhotoCategories.length?fail(checks,"firevault.photoCategories","FireVault regression","FireVault photo categories are missing",missingPhotoCategories.join(", "),{missingPhotoCategories}):pass(checks,"firevault.photoCategories","FireVault regression","All FireVault photo categories remain available",`${expectedPhotoCategories.length} categories validated.`);
    const expectedActions=["call","route","note","photo","favorite","task","deficiency","report"],activeActionIds=new Set(Object.values(surfaces).flat().map(action=>action.id)),missingActions=expectedActions.filter(id=>!activeActionIds.has(id));
    missingActions.length?fail(checks,"firevault.actions","FireVault regression","FireVault technician actions are missing",missingActions.join(", "),{missingActions}):pass(checks,"firevault.actions","FireVault regression","All expected FireVault technician actions remain available",expectedActions.join(" · "));
    const majorRoutes=["home","nearbySites","sites","siteDetail","siteForm","siteDocs","equipmentList","tasks","deficiencies","report","library","jobMode","settings"],missingMajorRoutes=majorRoutes.filter(route=>!RUNTIME_ROUTE_CATALOG.includes(route)||(ROUTE_MODULE_REQUIREMENTS[route]&&!activeRoutes.includes(route)));
    missingMajorRoutes.length?fail(checks,"firevault.routes","FireVault regression","Major FireVault routes lack active runtime coverage",missingMajorRoutes.join(", "),{missingMajorRoutes}):pass(checks,"firevault.routes","FireVault regression","Major FireVault routes retain active runtime coverage",`${majorRoutes.length} technician routes validated.`);
  }

  if(profile.id==="location-guide-proof"){
    const verticalModules=enabled.filter(id=>id.startsWith("firevault."));
    verticalModules.length?fail(checks,"proof.verticalIsolation","Alternate-profile proof","The proof profile still enables FireVault vertical modules",verticalModules.join(", "),{verticalModules}):pass(checks,"proof.verticalIsolation","Alternate-profile proof","The proof profile runs without FireVault vertical modules","No firevault.* modules are enabled.");
    const fireFields=fields.filter(field=>!field.appForgeReady).map(field=>field.id);
    fireFields.length?fail(checks,"proof.fieldIsolation","Alternate-profile proof","FireVault-only fields leaked into the proof profile",fireFields.join(", "),{fireFields}):pass(checks,"proof.fieldIsolation","Alternate-profile proof","The proof profile exposes only reusable record fields",`${fields.length} active fields are AppForge-ready.`);
    const terminologyPass=profile.terminology?.recordSingular==="Location"&&profile.terminology?.recordPlural==="Locations";
    terminologyPass?pass(checks,"proof.terminology","Alternate-profile proof","Record terminology transforms correctly","Account becomes Location / Locations."):fail(checks,"proof.terminology","Alternate-profile proof","Record terminology did not transform","Expected Location / Locations.");
    const hasTravelPack=activePacks.some(pack=>pack.id==="travel.wyoming-points");
    hasTravelPack?pass(checks,"proof.contentPack","Alternate-profile proof","A non-FireVault content pack resolves","Wyoming Points of Interest is active in the hidden proof profile."):fail(checks,"proof.contentPack","Alternate-profile proof","The non-FireVault content pack did not resolve","Expected travel.wyoming-points.");
    const onlyLocalStorage=storage.enabledProviderIds.length===1&&storage.enabledProviderIds[0]==="local";
    onlyLocalStorage?pass(checks,"proof.storage","Alternate-profile proof","The proof profile can use a reduced local-only storage configuration","Remote-provider Settings can be removed without breaking the local vault."):fail(checks,"proof.storage","Alternate-profile proof","The proof profile did not reduce to local-only storage",storage.enabledProviderIds.join(", "));
    const activeNav=Object.entries(NAV_MODULE_REQUIREMENTS).filter(([,requirements])=>requirements.every(id=>enabledSet.has(id))).map(([key])=>key);
    const expectedNav=["nearby","search","photo","settings"],missingNav=expectedNav.filter(key=>!activeNav.includes(key));
    missingNav.length?fail(checks,"proof.navigation","Alternate-profile proof","The reduced profile lost required core navigation",missingNav.join(", "),{activeNav,missingNav}):pass(checks,"proof.navigation","Alternate-profile proof","The reduced profile retains complete core navigation",activeNav.join(" · "));
    const verticalRoutes=["equipmentList","equipmentForm","tasks","taskForm","deficiencies","deficiencyForm","report"].filter(route=>activeRoutes.includes(route));
    verticalRoutes.length?fail(checks,"proof.routeReduction","Alternate-profile proof","Optional or vertical routes remained active",verticalRoutes.join(", "),{verticalRoutes}):pass(checks,"proof.routeReduction","Alternate-profile proof","Optional technician routes are removed safely","Equipment, task, deficiency, and report routes are inactive.");
    const reducedSettings=!syncStorageSettingsTabEnabled(profile,"microsoftStorage")&&!syncStorageSettingsTabEnabled(profile,"webdav")&&!syncStorageSettingsTabEnabled(profile,"sync")&&syncStorageSettingsTabEnabled(profile,"backup");
    reducedSettings?pass(checks,"proof.settingsReduction","Alternate-profile proof","Remote storage Settings reduce safely","Microsoft Storage, WebDAV, and Team Sync are hidden while local Backup remains available."):fail(checks,"proof.settingsReduction","Alternate-profile proof","Storage Settings did not reduce as expected","Review provider-aware Settings filtering.");
    const proofActions=new Set(Object.values(surfaces).flat().map(action=>action.id)),leakedActions=["call","task","deficiency","report"].filter(id=>proofActions.has(id));
    leakedActions.length?fail(checks,"proof.workflowReduction","Alternate-profile proof","Excluded workflow actions leaked into the reduced profile",leakedActions.join(", "),{leakedActions}):pass(checks,"proof.workflowReduction","Alternate-profile proof","Workflow actions reduce without FireVault task/report behavior","Route, Note, Photo, and Favorite remain; Call, Task, Deficiency, and Report are excluded.");
  }

  const totals={pass:checks.filter(check=>check.status==="pass").length,warning:checks.filter(check=>check.status==="warning").length,fail:checks.filter(check=>check.status==="fail").length,total:checks.length};
  return {
    schemaVersion:ARCHITECTURE_AUDIT_SCHEMA_VERSION,
    profile:{id:profile.id||"",name:profileLabel,schemaVersion:Number(profile.schemaVersion)||0},
    build:String(options.build||"unknown"),storageKey:String(options.storageKey||""),generatedAt:new Date().toISOString(),
    passed:totals.fail===0,status:totals.fail?"FAIL":totals.warning?"PASS_WITH_WARNINGS":"PASS",totals,
    sections:unique(checks.map(check=>check.category)).map(category=>sectionResult(checks,category)),checks
  };
}

export function runArchitectureValidationSuite(primaryProfile={},options={}){
  const primary=runArchitectureAudit(primaryProfile,options);
  const proof=runArchitectureAudit(LOCATION_GUIDE_TEST_PROFILE,options);
  const failed=primary.totals.fail+proof.totals.fail;
  const warnings=primary.totals.warning+proof.totals.warning;
  return {
    schemaVersion:ARCHITECTURE_AUDIT_SCHEMA_VERSION,
    generatedAt:new Date().toISOString(),build:String(options.build||"unknown"),storageKey:String(options.storageKey||""),
    passed:failed===0,status:failed?"FAIL":warnings?"PASS_WITH_WARNINGS":"PASS",
    totals:{total:primary.totals.total+proof.totals.total,pass:primary.totals.pass+proof.totals.pass,warning:warnings,fail:failed},
    primary,proof,
    proofProfile:{id:LOCATION_GUIDE_TEST_PROFILE.id,name:LOCATION_GUIDE_TEST_PROFILE.name,visibleToUser:false,purpose:LOCATION_GUIDE_TEST_PROFILE.purpose}
  };
}

export function architectureAuditText(suite){
  const lines=[
    `FIREVAULT ARCHITECTURE VALIDATION`,
    `Build: ${suite.build}`,
    `Generated: ${suite.generatedAt}`,
    `Overall: ${suite.status}`,
    `Checks: ${suite.totals.pass} passed, ${suite.totals.warning} warnings, ${suite.totals.fail} failed`,
    `Storage key: ${suite.storageKey}`,
    "",
    `PRIMARY PROFILE — ${suite.primary.profile.name}: ${suite.primary.status}`
  ];
  [suite.primary,suite.proof].forEach((audit,index)=>{
    if(index===1)lines.push("",`HIDDEN PROOF PROFILE — ${audit.profile.name}: ${audit.status}`);
    audit.checks.forEach(check=>lines.push(`[${check.status.toUpperCase()}] ${check.category} / ${check.title}: ${check.detail}`));
  });
  return lines.join("\n");
}

export function architectureAuditExport(suite){return JSON.parse(JSON.stringify(suite));}
