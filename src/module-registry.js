export const MODULE_REGISTRY_VERSION = 8;

export const MODULE_CLASSIFICATIONS = Object.freeze({
  core:{label:"Core",description:"Required foundation shared by future apps."},
  optional:{label:"Reusable optional",description:"Reusable module enabled only where the app needs it."},
  firevault:{label:"FireVault-specific",description:"Fire-alarm capability layered above the shared core."}
});

export const FUTURE_APP_COLUMNS = Object.freeze([
  {key:"fireVault",label:"FireVault"},
  {key:"travelGuide",label:"Travel Guide"},
  {key:"fishing",label:"Fishing"},
  {key:"ghostTowns",label:"Ghost Towns"},
  {key:"gardening",label:"Gardening"},
  {key:"inspection",label:"Inspection"}
]);

export const MODULE_REGISTRY = Object.freeze([
  {id:"core.records",name:"Record Database",classification:"core",status:"active",description:"Stable records with profile-selected fields, identity, address, metadata, history, and relationships.",dependencies:[],appForgeReady:true,apps:{fireVault:true,travelGuide:true,fishing:true,ghostTowns:true,gardening:true,inspection:true}},
  {id:"core.themeProfile",name:"Branding & Theme Profile",classification:"core",status:"active",description:"Profile-resolved app assets, wordmark, semantic colors, typography, shape, density, and mobile browser chrome.",dependencies:[],appForgeReady:true,apps:{fireVault:true,travelGuide:true,fishing:true,ghostTowns:true,gardening:true,inspection:true}},
  {id:"core.contentPacks",name:"Data Sources & Content Packs",classification:"core",status:"active",description:"Profile-selected local, bundled, imported, and future remote content sources with reusable pack manifests and library organization.",dependencies:["core.offlineStorage"],appForgeReady:true,apps:{fireVault:true,travelGuide:true,fishing:true,ghostTowns:true,gardening:true,inspection:true}},
  {id:"core.syncStorageProfile",name:"Sync & Storage Profile",classification:"core",status:"active",description:"Profile-selected local backends, approved cloud providers, backup rules, package exchange, conflict policy, and credential safeguards.",dependencies:["core.offlineStorage","core.backupRestore"],appForgeReady:true,apps:{fireVault:true,travelGuide:true,fishing:true,ghostTowns:true,gardening:true,inspection:true}},
  {id:"core.appForgeBlueprint",name:"AppForge Product Blueprint",classification:"core",status:"active",description:"One validated, portable product definition combining identity, modules, data, workflows, theme, content, and storage policy.",dependencies:["core.records","core.themeProfile","core.contentPacks","core.syncStorageProfile"],appForgeReady:true,apps:{fireVault:true,travelGuide:true,fishing:true,ghostTowns:true,gardening:true,inspection:true}},
  {id:"core.appForgeRecipes",name:"AppForge Product Recipes",classification:"core",status:"active",description:"Validated starting profiles for distinct vertical products with explicit branding, database, and publication requirements.",dependencies:["core.appForgeBlueprint"],appForgeReady:true,apps:{fireVault:true,travelGuide:true,fishing:true,ghostTowns:true,gardening:true,inspection:true}},
  {id:"core.appForgeFactory",name:"AppForge Factory Manifest",classification:"core",status:"active",description:"Deterministic generation requests, composed profiles, validation gates, required inputs, guardrails, and expected build outputs.",dependencies:["core.appForgeRecipes"],appForgeReady:true,apps:{fireVault:true,travelGuide:true,fishing:true,ghostTowns:true,gardening:true,inspection:true}},
  {id:"core.search",name:"Search Directory",classification:"core",status:"active",description:"Fast search, filtering, sorting, favorites, and record opening.",dependencies:["core.records"],appForgeReady:true,apps:{fireVault:true,travelGuide:true,fishing:true,ghostTowns:true,gardening:true,inspection:true}},
  {id:"core.nearby",name:"Nearby GPS",classification:"core",status:"active",description:"Distance-ranked nearby records using saved coordinates.",dependencies:["core.records"],appForgeReady:true,apps:{fireVault:true,travelGuide:true,fishing:true,ghostTowns:true,gardening:false,inspection:true}},
  {id:"core.notes",name:"Notes & History",classification:"core",status:"active",description:"Record-specific notes, timestamps, authorship, and activity history.",dependencies:["core.records"],appForgeReady:true,apps:{fireVault:true,travelGuide:true,fishing:true,ghostTowns:true,gardening:true,inspection:true}},
  {id:"core.photos",name:"Quick Photo",classification:"core",status:"active",description:"Account-aware camera capture, review, categorization, and safe media saving.",dependencies:["core.records","core.offlineStorage"],appForgeReady:true,apps:{fireVault:true,travelGuide:true,fishing:true,ghostTowns:true,gardening:true,inspection:true}},
  {id:"core.files",name:"Files & Documents",classification:"core",status:"active",description:"Record-linked photos, documents, links, and reference material.",dependencies:["core.records","core.offlineStorage"],appForgeReady:true,apps:{fireVault:true,travelGuide:true,fishing:true,ghostTowns:true,gardening:true,inspection:true}},
  {id:"core.photoOverlay",name:"Photo Overlay",classification:"core",status:"active",description:"Configurable metadata stamps rendered consistently in preview and export.",dependencies:["core.photos"],appForgeReady:true,apps:{fireVault:true,travelGuide:true,fishing:true,ghostTowns:true,gardening:true,inspection:true}},
  {id:"core.locationNavigator",name:"Exact Location Navigator",classification:"core",status:"active",description:"Saved entrances, parking, equipment points, access notes, and route targets.",dependencies:["core.records","core.nearby"],appForgeReady:true,apps:{fireVault:true,travelGuide:true,fishing:true,ghostTowns:true,gardening:true,inspection:true}},
  {id:"core.offlineStorage",name:"Offline Storage",classification:"core",status:"active",description:"Local-first vault plus IndexedDB media storage and resilient startup.",dependencies:[],appForgeReady:true,apps:{fireVault:true,travelGuide:true,fishing:true,ghostTowns:true,gardening:true,inspection:true}},
  {id:"core.backupRestore",name:"Backup & Restore",classification:"core",status:"active",description:"Snapshots, complete exports, restore preview, and recovery safeguards.",dependencies:["core.offlineStorage"],appForgeReady:true,apps:{fireVault:true,travelGuide:true,fishing:true,ghostTowns:true,gardening:true,inspection:true}},
  {id:"core.security",name:"Security Foundation",classification:"core",status:"active",description:"Privacy lock, audit records, device identity, integrity checks, and recycle recovery.",dependencies:["core.offlineStorage"],appForgeReady:true,apps:{fireVault:true,travelGuide:true,fishing:true,ghostTowns:true,gardening:true,inspection:true}},
  {id:"optional.equipment",name:"Equipment Records",classification:"optional",status:"active",description:"Structured equipment, model, status, location, and service-reference records.",dependencies:["core.records"],appForgeReady:true,apps:{fireVault:true,travelGuide:false,fishing:true,ghostTowns:false,gardening:true,inspection:true}},
  {id:"optional.tasks",name:"Tasks",classification:"optional",status:"active",description:"Open work, priorities, due dates, and completion tracking.",dependencies:["core.records","core.notes"],appForgeReady:true,apps:{fireVault:true,travelGuide:false,fishing:false,ghostTowns:false,gardening:true,inspection:true}},
  {id:"optional.deficiencies",name:"Deficiencies / Issues",classification:"optional",status:"active",description:"Structured problems, recommendations, evidence, and resolution status.",dependencies:["core.records","core.photos"],appForgeReady:true,apps:{fireVault:true,travelGuide:false,fishing:false,ghostTowns:false,gardening:true,inspection:true}},
  {id:"optional.reports",name:"Reports",classification:"optional",status:"active",description:"Configurable record reports with selected notes, photos, tasks, and issues.",dependencies:["core.records","core.files"],appForgeReady:true,apps:{fireVault:true,travelGuide:false,fishing:false,ghostTowns:false,gardening:false,inspection:true}},
  {id:"optional.cloudStorage",name:"Cloud Storage Adapters",classification:"optional",status:"foundation",description:"Provider-neutral file destinations, OneDrive/SharePoint profiles, and WebDAV backup.",dependencies:["core.files","core.backupRestore","core.syncStorageProfile"],appForgeReady:true,apps:{fireVault:true,travelGuide:true,fishing:true,ghostTowns:true,gardening:true,inspection:true}},
  {id:"optional.importExport",name:"Import & Export",classification:"optional",status:"active",description:"CSV onboarding, safe JSON packages, summaries, and transfer workflows.",dependencies:["core.records","core.backupRestore"],appForgeReady:true,apps:{fireVault:true,travelGuide:true,fishing:true,ghostTowns:true,gardening:true,inspection:true}},
  {id:"firevault.fireAlarmProfile",name:"Fire Alarm Account Profile",classification:"firevault",status:"active",description:"Panel, communicator, monitoring, technician, and fire-service terminology.",dependencies:["core.records","optional.equipment"],appForgeReady:false,apps:{fireVault:true,travelGuide:false,fishing:false,ghostTowns:false,gardening:false,inspection:false}},
  {id:"firevault.panelDocuments",name:"Panel Documents",classification:"firevault",status:"active",description:"Fire-alarm manuals and documents connected to panel make, model, and account.",dependencies:["core.files","optional.equipment","firevault.fireAlarmProfile"],appForgeReady:false,apps:{fireVault:true,travelGuide:false,fishing:false,ghostTowns:false,gardening:false,inspection:false}},
  {id:"firevault.fireLocationTypes",name:"Fire Location Types",classification:"firevault",status:"active",description:"Panel, annunciator, riser, fire pump, FDC, Knox Box, and related exact locations.",dependencies:["core.locationNavigator","firevault.fireAlarmProfile"],appForgeReady:false,apps:{fireVault:true,travelGuide:false,fishing:false,ghostTowns:false,gardening:false,inspection:false}}
]);

export function enabledModuleIds(profile){return [...new Set(profile?.enabledModules||[])];}
export function isModuleEnabled(profile,id){return enabledModuleIds(profile).includes(String(id||""));}
export function areModulesEnabled(profile,ids=[]){return (ids||[]).every(id=>isModuleEnabled(profile,id));}

export function moduleById(id){
  return MODULE_REGISTRY.find(module=>module.id===id) || null;
}

export function moduleRegistrySummary(enabledIds=[]){
  const enabled=new Set(enabledIds||[]);
  const summary={total:MODULE_REGISTRY.length,core:0,optional:0,firevault:0,enabled:0,appForgeReady:0};
  MODULE_REGISTRY.forEach(module=>{
    summary[module.classification]=(summary[module.classification]||0)+1;
    if(enabled.has(module.id))summary.enabled++;
    if(module.appForgeReady)summary.appForgeReady++;
  });
  return summary;
}

export function moduleMatrixRows(){
  return MODULE_REGISTRY.map(module=>({
    id:module.id,
    module:module.name,
    classification:MODULE_CLASSIFICATIONS[module.classification]?.label||module.classification,
    status:module.status,
    appForgeReady:module.appForgeReady,
    dependencies:[...module.dependencies],
    ...module.apps
  }));
}

export function moduleRegistryExport(){
  return JSON.parse(JSON.stringify({version:MODULE_REGISTRY_VERSION,classifications:MODULE_CLASSIFICATIONS,apps:FUTURE_APP_COLUMNS,modules:MODULE_REGISTRY}));
}
