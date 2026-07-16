import { GENERATED_APP_PROFILE } from "./generated-app-profile.js?v=1.03.3";

export const APP_PROFILE_SCHEMA_VERSION = 12;

const FIREVAULT_APP_PROFILE = Object.freeze({
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
    recordId: "Account ID",
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
  labels: Object.freeze({
    recordDirectory: "{{account}} Directory",
    recordDetail: "{{account}} Detail",
    addRecord: "Add {{account}}",
    editRecord: "Edit {{account}}",
    unnamedRecord: "Unnamed {{account}}",
    searchRecords: "Search {{accounts}}",
    nearbyRecords: "Nearby {{accounts}}",
    chooseRecord: "Choose {{account}}",
    currentRecord: "Current {{account}}",
    recordActions: "{{account}} actions",
    recordSections: "{{account}} sections",
    noRecords: "No {{accounts}} yet",
    noMatchingRecords: "No matching {{accounts}}",
    firstRecord: "Add First {{account}}",
    recordPhoto: "{{account}} Photo",
    recordPhotos: "{{account}} Photos"
  }),
  navigation: Object.freeze({
    nearby: "Nearby",
    search: "Search",
    photo: "Photo",
    settings: "Settings"
  }),
  branding: Object.freeze({
    mark:"assets/favicon.png",
    logo:"assets/firevault-logo-master.png",
    icon192:"assets/icon-192.png",
    icon512:"assets/icon-512.png",
    appleTouchIcon:"assets/apple-touch-icon.png",
    wordmark:Object.freeze([
      Object.freeze({text:"FIRE",tone:"primary"}),
      Object.freeze({text:"VAULT",tone:"accent"})
    ]),
    tagline:"Field Vault System"
  }),
  appearance: Object.freeze({
    profileId:"firevault-dark",
    profileName:"FireVault Dark",
    theme:"dark",
    accent:"#ef4444",
    accentStrong:"#991b1b",
    background:"#0b0d10",
    surface:"#151922",
    surfaceRaised:"#1d2330",
    line:"#303747",
    text:"#f4f7fb",
    muted:"#a7b0c0",
    success:"#22c55e",
    warning:"#f59e0b",
    info:"#38bdf8",
    cyan:"#22d3ee",
    themeColor:"#101216",
    statusBarStyle:"black",
    radius:18,
    controlRadius:15,
    compact:false,
    baseFontSize:14
  }),
  defaultPhotoCategories: Object.freeze([
    "Panel","NAC","Device","Communicator","Battery","Deficiency","Before","After","Other"
  ]),
  dataModel: Object.freeze({
    schemaId:"firevault.account.v1",
    enabledFieldIds:Object.freeze([
      "name","externalAccountId","sitePhone","street","city","state","zip","gps","panelManufacturer","panelModel","notes"
    ]),
    requiredFieldIds:Object.freeze(["name"]),
    detailSectionIds:Object.freeze(["overview","notes","locations","equipment","docs","details"]),
    photoCategoryIds:Object.freeze(["panel","nac","device","communicator","battery","deficiency","before","after","other"])
  }),
  workflows:Object.freeze({
    presetId:"fire-alarm-technician",
    directoryActionIds:Object.freeze(["call","route","note","favorite"]),
    detailPrimaryActionIds:Object.freeze(["call","route","note","photo"]),
    notesActionIds:Object.freeze(["task","deficiency","photo","report"]),
    quickPhoto:Object.freeze({
      defaultUseOverlay:true,
      defaultIncludeReport:false,
      rememberAccount:true,
      rememberCategory:true,
      allowAccountChange:true,
      allowRetake:true,
      showCategory:true,
      showOverlayToggle:true,
      showReportToggle:true,
      showTitle:true,
      showInternalNotes:true,
      showCustomerCaption:true,
      cameraFacing:"environment",
      maxImageDimension:2048,
      jpegQuality:0.86
    })
  }),
  content:Object.freeze({
    registryId:"firevault-content-v1",
    enabledSourceIds:Object.freeze(["local.user-vault","bundled.app-reference","import.csv-json"]),
    enabledPackIds:Object.freeze(["core.user-library","core.account-content","firevault.field-reference","firevault.panel-documents"]),
    updatePolicy:Object.freeze({mode:"manual",allowMetered:false,verifyManifests:true,keepPreviousVersion:true})
  }),
  syncStorage:Object.freeze({
    profileId:"firevault-local-first",
    enabledProviderIds:Object.freeze(["local","webdav","onedrive","sharepoint"]),
    roles:Object.freeze({
      vault:Object.freeze(["local"]),
      media:Object.freeze(["local"]),
      backup:Object.freeze(["local","webdav"]),
      photo:Object.freeze(["local","onedrive","sharepoint"]),
      document:Object.freeze(["local","onedrive","sharepoint"]),
      "sync-package":Object.freeze(["onedrive","sharepoint"])
    }),
    local:Object.freeze({offlineFirst:true,vaultBackend:"localStorage",mediaBackend:"indexedDB",persistentStorageRecommended:true}),
    backup:Object.freeze({manualExport:true,automaticSnapshots:true,snapshotLimit:12,verifyBeforeRestore:true,includeMedia:true}),
    collaboration:Object.freeze({mode:"package-exchange",automaticSync:false,queueOffline:true,conflictPolicy:"manual-review"}),
    security:Object.freeze({storeCredentialsInVault:false,requireHttps:true,preserveLocalCopy:true,preventPersonalFallback:true})
  }),
  interfaceIntegration:Object.freeze({
    terminology:true,
    navigation:true,
    routes:true,
    accountTabs:true,
    accountActions:true,
    settings:true,
    recordFields:true,
    detailSections:true,
    photoCategories:true,
    workflows:true,
    brandingTheme:true,
    contentPacks:true,
    syncStorage:true,
    appForgeBlueprint:true,
    appForgeRecipes:true,
    appForgeFactory:true,
    appForgeGenerator:true
  }),
  enabledModules: Object.freeze([
    "core.records",
    "core.themeProfile",
    "core.contentPacks",
    "core.syncStorageProfile",
    "core.appForgeBlueprint",
    "core.appForgeRecipes",
    "core.appForgeFactory",
    "core.appForgeGenerator",
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

export const APP_PROFILE = Object.freeze(GENERATED_APP_PROFILE ? {...GENERATED_APP_PROFILE,schemaVersion:APP_PROFILE_SCHEMA_VERSION} : FIREVAULT_APP_PROFILE);

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
    account_lower:appTerm("account",1,{lower:true}),
    accounts_lower:appTerm("account",2,{lower:true}),
    account_id:APP_PROFILE.terminology.recordId || `${appTerm("account",1)} ID`,
    location:appTerm("location",1),
    locations:appTerm("location",2),
    technician:appTerm("technician",1),
    technicians:appTerm("technician",2),
    note:appTerm("note",1),
    notes:appTerm("note",2),
    ...values
  };
  return source.replace(/\{\{([a-z_]+)\}\}/gi,(match,key)=>Object.prototype.hasOwnProperty.call(replacements,key)?String(replacements[key]):match);
}

export function appLabel(key, values={}){
  const template=APP_PROFILE.labels?.[String(key||"")] || String(key||"");
  return applyProfileTerms(template,values);
}

export function appProfileExport(){
  return JSON.parse(JSON.stringify(APP_PROFILE));
}
