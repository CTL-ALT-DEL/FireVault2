export const MODULE_BINDINGS_VERSION = 1;

export const NAV_MODULE_REQUIREMENTS = Object.freeze({
  nearby:Object.freeze(["core.nearby"]),
  search:Object.freeze(["core.search"]),
  photo:Object.freeze(["core.photos"]),
  settings:Object.freeze([])
});

export const ROUTE_MODULE_REQUIREMENTS = Object.freeze({
  home:Object.freeze(["core.nearby"]),
  nearbySites:Object.freeze(["core.nearby"]),
  sites:Object.freeze(["core.search"]),
  siteDetail:Object.freeze(["core.records"]),
  siteForm:Object.freeze(["core.records"]),
  contactsList:Object.freeze(["core.records"]),
  contactForm:Object.freeze(["core.records"]),
  siteDocs:Object.freeze(["core.files"]),
  siteDocForm:Object.freeze(["core.files"]),
  equipmentList:Object.freeze(["optional.equipment"]),
  equipmentForm:Object.freeze(["optional.equipment"]),
  tasks:Object.freeze(["optional.tasks"]),
  taskForm:Object.freeze(["optional.tasks"]),
  deficiencies:Object.freeze(["optional.deficiencies"]),
  deficiencyForm:Object.freeze(["optional.deficiencies"]),
  report:Object.freeze(["optional.reports"]),
  library:Object.freeze(["core.files"]),
  resourceForm:Object.freeze(["core.files"]),
  jobMode:Object.freeze(["core.notes"]),
  settings:Object.freeze([])
});

export const SETTINGS_MODULE_REQUIREMENTS = Object.freeze({
  tech:Object.freeze(["firevault.fireAlarmProfile"]),
  gps:Object.freeze(["core.nearby"]),
  plusCodes:Object.freeze(["core.locationNavigator"]),
  overlay:Object.freeze(["core.photoOverlay"]),
  reports:Object.freeze(["optional.reports"]),
  email:Object.freeze(["optional.reports"]),
  privacy:Object.freeze(["core.security"]),
  security:Object.freeze(["core.security"]),
  cloudFiles:Object.freeze(["core.files"]),
  microsoftStorage:Object.freeze(["optional.cloudStorage"]),
  sync:Object.freeze(["optional.cloudStorage"]),
  customerImport:Object.freeze(["optional.importExport"]),
  categories:Object.freeze(["core.records"]),
  backup:Object.freeze(["core.backupRestore"]),
  webdav:Object.freeze(["optional.cloudStorage"]),
  updates:Object.freeze([]),
  demo:Object.freeze(["core.records"]),
  about:Object.freeze([]),
  architecture:Object.freeze([])
});

export const ACCOUNT_TAB_BINDINGS = Object.freeze([
  Object.freeze({key:"overview",label:"Overview",modules:Object.freeze(["core.records"])}),
  Object.freeze({key:"notes",label:"Notes",modules:Object.freeze(["core.notes"])}),
  Object.freeze({key:"locations",label:"Locations",modules:Object.freeze(["core.locationNavigator"])}),
  Object.freeze({key:"equipment",term:"equipment",modules:Object.freeze(["optional.equipment"])}),
  Object.freeze({key:"docs",term:"file",modules:Object.freeze(["core.files"])}),
  Object.freeze({key:"details",label:"Details",modules:Object.freeze(["core.records"])})
]);

export function requirementsMet(enabledIds,requirements=[]){
  const enabled=enabledIds instanceof Set?enabledIds:new Set(enabledIds||[]);
  return (requirements||[]).every(id=>enabled.has(id));
}

export function moduleBindingsExport(){
  return JSON.parse(JSON.stringify({
    version:MODULE_BINDINGS_VERSION,
    navigation:NAV_MODULE_REQUIREMENTS,
    routes:ROUTE_MODULE_REQUIREMENTS,
    settings:SETTINGS_MODULE_REQUIREMENTS,
    accountTabs:ACCOUNT_TAB_BINDINGS
  }));
}
