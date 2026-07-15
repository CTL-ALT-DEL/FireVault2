export const APP_PROFILE_SCHEMA_VERSION = 1;

export const APP_PROFILE = Object.freeze({
  schemaVersion: APP_PROFILE_SCHEMA_VERSION,
  id: "firevault",
  family: "field-vault",
  name: "FireVault",
  shortName: "FireVault",
  industry: "Fire alarm service",
  audience: "Fire alarm technicians",
  purpose: "Local-first field knowledge, account history, navigation, photos, documents, and technician reference.",
  terminology: Object.freeze({
    recordSingular: "Account",
    recordPlural: "Accounts",
    locationSingular: "Location",
    locationPlural: "Locations",
    personSingular: "Technician",
    personPlural: "Technicians",
    noteSingular: "Note",
    notePlural: "Notes",
    equipmentSingular: "Equipment",
    equipmentPlural: "Equipment",
    deficiencySingular: "Deficiency",
    deficiencyPlural: "Deficiencies",
    taskSingular: "Task",
    taskPlural: "Tasks",
    fileSingular: "File",
    filePlural: "Files"
  }),
  navigation: Object.freeze({
    nearby: "Nearby",
    search: "Search",
    photo: "Photo",
    settings: "Settings"
  }),
  appearance: Object.freeze({
    theme: "dark",
    accent: "#ef4444",
    background: "#0b0d10",
    surface: "#101216"
  }),
  defaultPhotoCategories: Object.freeze([
    "Panel","NAC","Device","Communicator","Battery","Deficiency","Before","After","Other"
  ]),
  enabledModules: Object.freeze([
    "core.records",
    "core.search",
    "core.nearby",
    "core.notes",
    "core.photos",
    "core.files",
    "core.photoOverlay",
    "core.locationNavigator",
    "core.offlineStorage",
    "core.backupRestore",
    "core.security",
    "optional.equipment",
    "optional.tasks",
    "optional.deficiencies",
    "optional.reports",
    "optional.cloudStorage",
    "optional.importExport",
    "firevault.fireAlarmProfile",
    "firevault.panelDocuments",
    "firevault.fireLocationTypes"
  ])
});

const TERM_KEYS = Object.freeze({
  account: ["recordSingular","recordPlural"],
  record: ["recordSingular","recordPlural"],
  location: ["locationSingular","locationPlural"],
  technician: ["personSingular","personPlural"],
  person: ["personSingular","personPlural"],
  note: ["noteSingular","notePlural"],
  equipment: ["equipmentSingular","equipmentPlural"],
  deficiency: ["deficiencySingular","deficiencyPlural"],
  task: ["taskSingular","taskPlural"],
  file: ["fileSingular","filePlural"]
});

export function appTerm(key, count=1, options={}){
  const pair=TERM_KEYS[String(key||"").toLowerCase()];
  const fallback=String(key||"");
  if(!pair) return options.lower ? fallback.toLowerCase() : fallback;
  const value=APP_PROFILE.terminology[Number(count)===1?pair[0]:pair[1]] || fallback;
  return options.lower ? value.toLowerCase() : value;
}

export function appNavigationLabel(key){
  return APP_PROFILE.navigation[String(key||"")] || String(key||"");
}

export function applyProfileTerms(template, values={}){
  const source=String(template||"");
  const replacements={
    app_name:APP_PROFILE.name,
    industry:APP_PROFILE.industry,
    account:appTerm("account",1),
    accounts:appTerm("account",2),
    location:appTerm("location",1),
    locations:appTerm("location",2),
    technician:appTerm("technician",1),
    technicians:appTerm("technician",2),
    ...values
  };
  return source.replace(/\{\{([a-z_]+)\}\}/gi,(match,key)=>Object.prototype.hasOwnProperty.call(replacements,key)?String(replacements[key]):match);
}

export function appProfileExport(){
  return JSON.parse(JSON.stringify(APP_PROFILE));
}
