export const RECORD_SCHEMA_VERSION = 1;

export const RECORD_SCHEMA = Object.freeze({
  id:"firevault.account.v1",
  label:"FireVault Account Record",
  description:"Configurable field and section definition layered over the shared Field Vault record engine.",
  groups:Object.freeze([
    Object.freeze({id:"identity",label:"Account Identity",description:"Stable identity and primary contact fields shared by the directory and detail screens."}),
    Object.freeze({id:"location",label:"Location",description:"Address, coordinates, and route-ready location data."}),
    Object.freeze({id:"fireSystem",label:"Fire Alarm System",description:"FireVault-specific panel and technician reference fields."})
  ]),
  fields:Object.freeze([
    Object.freeze({id:"name",path:"name",group:"identity",label:"Account Name",type:"text",required:true,modules:Object.freeze(["core.records"]),searchable:true,appForgeReady:true}),
    Object.freeze({id:"externalAccountId",path:"externalAccountId",group:"identity",label:"Account ID",type:"text",required:false,modules:Object.freeze(["core.records"]),searchable:true,unique:true,appForgeReady:true}),
    Object.freeze({id:"sitePhone",path:"sitePhone",group:"identity",label:"Site Phone",type:"phone",required:false,modules:Object.freeze(["core.records"]),searchable:true,appForgeReady:true}),
    Object.freeze({id:"street",path:"street",group:"location",label:"Street Address",type:"text",required:false,modules:Object.freeze(["core.records"]),searchable:true,appForgeReady:true}),
    Object.freeze({id:"city",path:"city",group:"location",label:"City",type:"text",required:false,modules:Object.freeze(["core.records"]),searchable:true,appForgeReady:true}),
    Object.freeze({id:"state",path:"state",group:"location",label:"State",type:"text",required:false,modules:Object.freeze(["core.records"]),searchable:true,appForgeReady:true}),
    Object.freeze({id:"zip",path:"zip",group:"location",label:"ZIP",type:"postal",required:false,modules:Object.freeze(["core.records"]),searchable:true,appForgeReady:true}),
    Object.freeze({id:"gps",path:"gps",group:"location",label:"GPS",type:"coordinates",required:false,modules:Object.freeze(["core.nearby"]),searchable:false,appForgeReady:true}),
    Object.freeze({id:"panelManufacturer",path:"panelManufacturer",group:"fireSystem",label:"Panel Make",type:"text",required:false,modules:Object.freeze(["firevault.fireAlarmProfile"]),searchable:true,appForgeReady:false}),
    Object.freeze({id:"panelModel",path:"panelModel",group:"fireSystem",label:"Panel Model",type:"text",required:false,modules:Object.freeze(["firevault.fireAlarmProfile"]),searchable:true,appForgeReady:false}),
    Object.freeze({id:"notes",path:"notes",group:"fireSystem",label:"Site Notes",type:"multiline",required:false,modules:Object.freeze(["core.notes"]),searchable:true,appForgeReady:true})
  ]),
  detailSections:Object.freeze([
    Object.freeze({id:"overview",label:"Overview",modules:Object.freeze(["core.records"]),appForgeReady:true}),
    Object.freeze({id:"notes",label:"Notes",modules:Object.freeze(["core.notes"]),appForgeReady:true}),
    Object.freeze({id:"locations",label:"Locations",modules:Object.freeze(["core.locationNavigator"]),appForgeReady:true}),
    Object.freeze({id:"equipment",label:"Equipment",modules:Object.freeze(["optional.equipment"]),appForgeReady:true}),
    Object.freeze({id:"docs",label:"Files",modules:Object.freeze(["core.files"]),appForgeReady:true}),
    Object.freeze({id:"details",label:"Details",modules:Object.freeze(["core.records"]),appForgeReady:true})
  ]),
  photoCategories:Object.freeze([
    Object.freeze({id:"panel",label:"Panel",hint:"Panel cabinet, display, trouble state, or wiring overview.",modules:Object.freeze(["firevault.fireAlarmProfile"]),appForgeReady:false}),
    Object.freeze({id:"nac",label:"NAC",hint:"Horn/strobe circuit, EOL, module, or notification appliance wiring.",modules:Object.freeze(["firevault.fireAlarmProfile"]),appForgeReady:false}),
    Object.freeze({id:"device",label:"Device",hint:"Smoke, pull station, duct detector, module, tamper, flow, or other field device.",modules:Object.freeze(["firevault.fireAlarmProfile"]),appForgeReady:false}),
    Object.freeze({id:"communicator",label:"Communicator",hint:"Cellular/IP communicator, antenna, signal screen, or wiring.",modules:Object.freeze(["firevault.fireAlarmProfile"]),appForgeReady:false}),
    Object.freeze({id:"battery",label:"Battery",hint:"Batteries, date codes, charger readings, or cabinet condition.",modules:Object.freeze(["firevault.fireAlarmProfile"]),appForgeReady:false}),
    Object.freeze({id:"deficiency",label:"Deficiency",hint:"Problem condition, damage, missing device, access issue, or failed test evidence.",modules:Object.freeze(["optional.deficiencies"]),appForgeReady:true}),
    Object.freeze({id:"before",label:"Before",hint:"Before repair or before cleanup documentation.",modules:Object.freeze(["core.photos"]),appForgeReady:true}),
    Object.freeze({id:"after",label:"After",hint:"After repair, restore, cleanup, or completion documentation.",modules:Object.freeze(["core.photos"]),appForgeReady:true}),
    Object.freeze({id:"other",label:"Other",hint:"General site photo.",modules:Object.freeze(["core.photos"]),appForgeReady:true})
  ])
});

function enabledModules(profile){return new Set(profile?.enabledModules||[]);}
function configuredIds(profile,key,fallback=[]){
  const value=profile?.dataModel?.[key];
  return Array.isArray(value)?new Set(value):new Set(fallback);
}
function modulesSatisfied(profile,modules=[]){
  const enabled=enabledModules(profile);
  return (modules||[]).every(id=>enabled.has(id));
}

export function recordFieldById(id){return RECORD_SCHEMA.fields.find(field=>field.id===String(id||""))||null;}
export function activeRecordFields(profile){
  const configured=configuredIds(profile,"enabledFieldIds",RECORD_SCHEMA.fields.map(field=>field.id));
  const required=configuredIds(profile,"requiredFieldIds",RECORD_SCHEMA.fields.filter(field=>field.required).map(field=>field.id));
  return RECORD_SCHEMA.fields.filter(field=>configured.has(field.id)&&modulesSatisfied(profile,field.modules)).map(field=>({...field,required:required.has(field.id)}));
}
export function recordFieldEnabled(profile,id){return activeRecordFields(profile).some(field=>field.id===String(id||""));}
export function recordFieldRequired(profile,id){return activeRecordFields(profile).some(field=>field.id===String(id||"")&&field.required);}
export function activeRecordGroups(profile){
  const fields=activeRecordFields(profile);
  return RECORD_SCHEMA.groups.filter(group=>fields.some(field=>field.group===group.id));
}
export function activeDetailSections(profile){
  const configured=configuredIds(profile,"detailSectionIds",RECORD_SCHEMA.detailSections.map(section=>section.id));
  return RECORD_SCHEMA.detailSections.filter(section=>configured.has(section.id)&&modulesSatisfied(profile,section.modules));
}
export function recordDetailSectionEnabled(profile,id){return activeDetailSections(profile).some(section=>section.id===String(id||""));}
export function recordPhotoCategories(profile){
  const configured=configuredIds(profile,"photoCategoryIds",RECORD_SCHEMA.photoCategories.map(category=>category.id));
  return RECORD_SCHEMA.photoCategories.filter(category=>configured.has(category.id)&&modulesSatisfied(profile,category.modules));
}
export function recordSchemaSummary(profile){
  const fields=activeRecordFields(profile),sections=activeDetailSections(profile),categories=recordPhotoCategories(profile);
  return {
    schemaId:profile?.dataModel?.schemaId||RECORD_SCHEMA.id,
    totalFields:RECORD_SCHEMA.fields.length,
    activeFields:fields.length,
    requiredFields:fields.filter(field=>field.required).length,
    searchableFields:fields.filter(field=>field.searchable).length,
    detailSections:sections.length,
    photoCategories:categories.length,
    verticalFields:fields.filter(field=>!field.appForgeReady).length,
    appForgeReadyFields:fields.filter(field=>field.appForgeReady).length
  };
}
export function recordSchemaExport(profile){
  return JSON.parse(JSON.stringify({
    version:RECORD_SCHEMA_VERSION,
    profileDataModel:profile?.dataModel||{},
    schema:RECORD_SCHEMA,
    active:{fields:activeRecordFields(profile),groups:activeRecordGroups(profile),detailSections:activeDetailSections(profile),photoCategories:recordPhotoCategories(profile)}
  }));
}
