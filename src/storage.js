import { stageVaultMedia, stripPersistedMediaForStorage, hydrateVaultMediaFromCache } from "./media-store.js?v=1.03.19";
export const BUILD = "1.03.19";
export const SECURITY_SCHEMA_VERSION = 4;
export const KEY = "firevault_vault_build_030";
export const DEVICE_KEY = "firevault_device_identity_062";

export const DEMO_MODE_KEY = "firevault_demo_mode_0738";
export const DEMO_VAULT_KEY = `${KEY}_demo_0738`; // legacy key; Build 0.73.9 no longer stores the demo vault here
let demoRuntimeVault0739 = null;
let runtimeDeviceIdentity0739 = "";

const SECURITY_FOUNDATION_VERSION_0790 = 1;
const SECURITY_AUDIT_LIMIT_0790 = 300;
const SECURITY_CHANGE_QUEUE_LIMIT_0790 = 500;
const SECURITY_RECYCLE_LIMIT_0790 = 12;
const SECURITY_RECYCLE_DAYS_0790 = 30;

export function isDemoMode(){
  try{if(localStorage.getItem(DEMO_MODE_KEY)==="1") return true;}catch{}
  try{return sessionStorage.getItem(DEMO_MODE_KEY)==="1";}catch{return false;}
}
export function setDemoMode(enabled){
  // The old persistent demo vault could push an iPhone PWA over its localStorage quota.
  // Remove it before changing modes; Build 0.73.9 keeps demo records in memory instead.
  try{localStorage.removeItem(DEMO_VAULT_KEY);}catch{}
  demoRuntimeVault0739 = null;
  if(enabled){
    let stored=false;
    try{localStorage.setItem(DEMO_MODE_KEY,"1");stored=true;}catch{}
    if(!stored){try{sessionStorage.setItem(DEMO_MODE_KEY,"1");stored=true;}catch{}}
    return stored;
  }
  try{localStorage.removeItem(DEMO_MODE_KEY);}catch{}
  try{sessionStorage.removeItem(DEMO_MODE_KEY);}catch{}
  return false;
}
export function resetDemoData(){
  demoRuntimeVault0739 = null;
  try{localStorage.removeItem(DEMO_VAULT_KEY);}catch{}
  try{sessionStorage.removeItem(DEMO_VAULT_KEY);}catch{}
}

function demoIso(daysAgo=0,hour=9){
  const d=new Date();
  d.setDate(d.getDate()-Number(daysAgo||0));
  d.setHours(hour,0,0,0);
  return d.toISOString();
}
function demoDate(daysAgo=0){ return demoIso(daysAgo).slice(0,10); }
function demoId(prefix,index){ return `demo-${prefix}-${String(index).padStart(2,"0")}`; }
function demoSite(spec,index){
  const attention=index%4===0 || index===2 || index===15;
  const openTask=index%3===0 || index===6 || index===17;
  const lastVisitDays=5+(index*7)%80;
  const nextDueDays=Math.max(2,45-(index*3)%50);
  const contactName=["Alex Morgan","Jamie Lee","Taylor Brooks","Jordan Reed","Casey Miller","Riley Parker","Morgan Hayes","Cameron Blake","Avery Collins","Drew Bennett"][index%10];
  const sourceGroup=spec.group||(["Commercial","Priority","Education","Healthcare"][index%4]);
  const communicator=String(spec.accountId||"").startsWith("G7C")?"Honeywell CLSS":String(spec.accountId||"").startsWith("AN")?"Honeywell AlarmNet":String(spec.accountId||"").startsWith("VA1")?"IPDACT":"Basic Dialer";
  return {
    id:demoId("site",index+1), demoRecord:true, name:spec.name,
    street:spec.street, city:spec.city||"Boise", state:"ID", zip:spec.zip,
    externalAccountId:spec.accountId, accountId:spec.accountId, deviceType:communicator,
    sitePhone:`(208) 555-${String(1100+index).slice(-4)}`, devicePhone:`(208) 555-${String(2100+index).slice(-4)}`,
    siteId1:`BOI-${String(index+1).padStart(3,"0")}`, siteId2:`DEMO-${String(700+index)}`,
    siteLanguage:"English", sourceGroupNumber:sourceGroup,
    panelManufacturer:["Notifier","Fire-Lite","Honeywell","Edwards","Siemens"][index%5],
    panelModel:["NFS2-3030","ES-200X","XLS3000","EST4","FC2025"][index%5],
    panelLocation:["Main electrical room","Front lobby riser room","Level 1 fire command center","Receiving electrical room"][index%4],
    status:"Active", priority:attention?"High":"Normal", pinned:index<4,
    gps:{lat:spec.lat,lng:spec.lng,accuracy:8+(index%5)*3,capturedAt:demoIso(40+index),source:"Demo dataset"},
    geocodeSource:"Demo dataset", geocodedAt:demoIso(60+index),
    notes:`DEMO ACCOUNT — Fictional customer information for FireVault demonstrations. ${spec.note||"Review access notes before service."}`,
    accessNotes:["Check in at the front desk and request the fire alarm key set.","Use the east service entrance; call the site contact on arrival.","Security escort is required beyond the lobby.","Panel room key is stored in the labeled Knox cabinet."][index%4],
    contacts:[{
      id:demoId("contact",index+1),name:contactName,role:["Facility Manager","Chief Engineer","Office Manager","Maintenance Supervisor"][index%4],
      phone:`(208) 555-${String(3100+index).slice(-4)}`,email:`demo.contact${index+1}@example.com`,primary:true,
      accessNotes:["Available weekdays 7:00 AM–4:00 PM","Call 15 minutes before arrival","Meet at the main entrance","After-hours number is routed to security"][index%4]
    }],
    equipment:[
      {id:demoId("panel",index+1),type:"Fire Alarm Control Panel",manufacturer:["Notifier","Fire-Lite","Honeywell","Edwards","Siemens"][index%5],model:["NFS2-3030","ES-200X","XLS3000","EST4","FC2025"][index%5],location:["Main electrical room","Lobby riser room","Fire command center","Receiving electrical room"][index%4],status:attention&&index%2===0?"Needs Attention":"Normal",notes:"Demo equipment record."},
      {id:demoId("comm",index+1),type:"Communicator",manufacturer:communicator.split(" ")[0],model:communicator,location:"At fire alarm panel",status:"Online",notes:"Dual-path communication shown for demonstration."},
      {id:demoId("battery",index+1),type:"Standby Batteries",manufacturer:"Demo Power",model:index%2?"12V 18Ah":"12V 26Ah",location:"Panel cabinet",status:index%6===0?"Replace Soon":"Normal",notes:`Date code ${2024+(index%2)}-${String((index%12)+1).padStart(2,"0")}.`}
    ],
    tasks:openTask?[{id:demoId("task",index+1),title:["Verify communicator signal strength","Replace faded panel directory","Schedule annual inspection","Confirm after-hours access procedure"][index%4],status:"Open",priority:attention?"High":"Normal",due:demoDate(-nextDueDays),source:"Demo Mode",notes:"Fictional open task included to demonstrate workflow.",createdAt:demoIso(8+index)}]:[],
    deficiencies:attention?[{id:demoId("def",index+1),title:["Battery date approaching replacement","Device label missing","Remote annunciator display dim","Door holder did not release during test"][index%4],device:["Battery set","Addressable module","Remote annunciator","Door holder"][index%4],location:["Main panel cabinet","Second floor corridor","Front lobby","West stair door"][index%4],priority:index%8===0?"Critical":"Normal",status:"Open",notes:"Demo deficiency — no real customer condition.",recommendation:"Review and correct during the next scheduled service visit.",createdAt:demoIso(12+index)}]:[],
    visits:[
      {id:demoId("visit",index*2+1),date:demoDate(lastVisitDays),startedAt:demoIso(lastVisitDays,9),endedAt:demoIso(lastVisitDays,11),summary:"Annual inspection completed",notes:"Demo visit: panel restored to normal and customer notified.",technician:"Demo Technician",status:"Completed"},
      {id:demoId("visit",index*2+2),date:demoDate(lastVisitDays+95),startedAt:demoIso(lastVisitDays+95,10),endedAt:demoIso(lastVisitDays+95,11),summary:"Service call and communicator test",notes:"Demo visit: communication paths verified.",technician:"Demo Technician",status:"Completed"}
    ],
    docs:[
      {id:demoId("doc",index+1),title:"Fire Alarm Panel Reference",type:"Link",category:"Manual",url:"https://example.com/demo-manual",ref:"DEMO-MANUAL",notes:"Placeholder document link for demonstration only.",createdAt:demoIso(90+index)},
      {id:demoId("photo",index+1),title:"Panel Cabinet Photo",type:"Photo",category:"Panel",notes:"Photo placeholder metadata for Demo Mode.",createdAt:demoIso(30+index)}
    ],
    checklist:[
      {id:demoId("check",index*3+1),area:"Panel",item:"Panel normal / no active troubles",done:true,status:"Complete"},
      {id:demoId("check",index*3+2),area:"Signals",item:"Monitoring signal path verified",done:index%5!==0,status:index%5!==0?"Complete":"Open"},
      {id:demoId("check",index*3+3),area:"Documentation",item:"Customer notified of status",done:true,status:"Complete"}
    ],
    noteEntries:[
      {id:demoId("note",index+1),note:"Demo technician note: account reviewed and access information confirmed.",createdAt:demoIso(3+index),type:"Site Note",technician:"Demo Technician"}
    ],
    knownIssues:[],reportDeliveries:[],locationPoints:[
      {id:demoId("location",index*3+1),type:"Parking Area",label:"Technician Parking",floor:"",placement:"Outdoor",description:"Recommended service-vehicle parking",notes:"Keep the fire lane and FDC clear.",lat:Number((spec.lat+0.00015).toFixed(7)),lng:Number((spec.lng+0.00014).toFixed(7)),accuracy:8,verification:"verified",lastVerifiedAt:demoIso(14+index),createdAt:demoIso(125+index),updatedAt:demoIso(14+index)},
      {id:demoId("location",index*3+2),type:"Main Entrance",label:"Main Entrance",floor:"1",placement:"Outdoor",description:"Primary technician entrance",notes:"Check in with the site contact on arrival.",lat:Number((spec.lat+0.00008).toFixed(7)),lng:Number((spec.lng-0.00006).toFixed(7)),accuracy:7,verification:"verified",lastVerifiedAt:demoIso(12+index),createdAt:demoIso(120+index),updatedAt:demoIso(12+index)},
      {id:demoId("location",index*3+3),type:"Fire Alarm Control Panel",label:"Main Fire Alarm Panel",floor:index%3===0?"B1":"1",placement:"Indoor",description:["Main electrical room","Lobby riser room","Fire command center","Receiving electrical room"][index%4],notes:"Demo location for Building Navigator.",lat:Number((spec.lat-0.00005).toFixed(7)),lng:Number((spec.lng+0.00007).toFixed(7)),accuracy:6,verification:index%5===0?"needs":"verified",lastVerifiedAt:index%5===0?demoIso(240):demoIso(20+index),photoDocId:demoId("photo",index+1),createdAt:demoIso(115+index),updatedAt:demoIso(20+index)}
    ],preferredLocationPointId:demoId("location",index*3+2),createdAt:demoIso(300+index),modifiedAt:demoIso(index),modifiedBy:"Demo Technician",createdBy:"Demo Technician"
  };
}
export function createDemoVault(){
  const specs=[
    ["Boise River Medical Center","1550 Demo Medical Way","Boise","83702","G7CBOI-01",43.6178,-116.1970,"Healthcare","Main hospital building."],
    ["Boise River Medical Center — East Wing","1550 Demo Medical Way","Boise","83702","G7CBOI-02",43.6178,-116.1970,"Healthcare","Separate account at the same campus address."],
    ["Capitol Plaza Offices","450 Capitol Center Dr","Boise","83702","ANBOI1001",43.6150,-116.2024,"Priority","Multi-tenant downtown office property."],
    ["Treasure Valley High School","9800 W Schoolhouse Ln","Boise","83704","G7CSCH-01",43.6275,-116.3010,"Education","School access requires front-office check-in."],
    ["Foothills Senior Living","3400 N Foothill View Dr","Boise","83702","VA1BOI2001",43.6470,-116.2150,"Healthcare","Coordinate tests with the facilities director."],
    ["Riverbend Apartments","2215 W Riverbend Ave","Boise","83702","BSC-1005",43.6270,-116.2290,"Residential","Multiple residential buildings share the main panel room."],
    ["Boise Tech Campus — Building A","7800 W Innovation Way","Boise","83704","G7CTEC-01",43.6120,-116.2790,"Priority","Campus building A."],
    ["Boise Tech Campus — Building B","7800 W Innovation Way","Boise","83704","G7CTEC-02",43.6120,-116.2790,"Priority","Separate account at the same campus address."],
    ["Greenbelt Market Center","1620 S Greenbelt Blvd","Boise","83706","ANBOI1002",43.5950,-116.1840,"Commercial","Retail center with several tenant notification zones."],
    ["Parkcenter Hotel","2850 E Parkcenter Blvd","Boise","83706","VA1BOI2002",43.5890,-116.1670,"Hospitality","Coordinate testing with the front desk."],
    ["Vista Commerce Center","4100 S Vista Commerce Ave","Boise","83705","ANBOI1003",43.5650,-116.2150,"Commercial","Warehouse and office combination occupancy."],
    ["Airport Logistics Warehouse","6300 W Freight St","Boise","83709","G7CLOG-01",43.5530,-116.2660,"Priority","Large warehouse with air-sampling detection."],
    ["West Boise Retail Center","10500 W Fairview Demo Rd","Boise","83704","BSC-2201",43.6190,-116.3140,"Commercial","Retail center demonstration account."],
    ["Garden City Public Works","6015 N Riverside Demo Dr","Garden City","83714","G7CGC-01",43.6620,-116.2740,"Municipal","Municipal operations building."],
    ["Eagle River Community Church","1450 E Mission Demo Ln","Eagle","83616","ANEAG1001",43.6900,-116.3350,"Assembly","Large assembly occupancy with weekend access constraints."],
    ["Meridian Civic Annex","2200 E Civic Demo Way","Meridian","83642","G7CMER-01",43.6110,-116.3680,"Municipal","Public-facing municipal office."],
    ["Meridian Distribution Center","3450 S Commerce Demo Rd","Meridian","83642","VA1MER2001",43.5730,-116.3830,"Priority","High-bay distribution warehouse."],
    ["Kuna Community Library","725 W Library Demo St","Kuna","83634","G7CKUN-01",43.4920,-116.4310,"Education","Community library within the Boise demo radius."],
    ["Harris Ranch Clubhouse","3900 E Ranch Demo Dr","Boise","83716","ANBOI1004",43.5730,-116.1470,"Residential","Clubhouse and amenity building."],
    ["North End Arts Center","1800 N 13th Demo St","Boise","83702","BSC-2202",43.6330,-116.2020,"Assembly","Performance and gallery space demonstration account."]
  ].map(x=>({name:x[0],street:x[1],city:x[2],zip:x[3],accountId:x[4],lat:x[5],lng:x[6],group:x[7],note:x[8]}));
  const sites=specs.map(demoSite);
  return normalize({
    demoMode:true,demoVersion:1,sites,
    resources:[
      {id:"demo-resource-01",title:"Demo Fire Alarm Panel Manual",folder:"Manuals",type:"Link",url:"https://example.com/demo-manual",notes:"Fictional reference entry for Demo Mode."},
      {id:"demo-resource-02",title:"Demo Inspection Checklist",folder:"Forms",type:"Document",notes:"Sample form metadata for demonstrations."}
    ],
    resourceFolders:["Manuals","Forms","Links","Codes"],breadcrumbs:[],
    settings:{
      technician:{name:"Demo Technician",company:"Example Fire Protection",phone:"(208) 555-0100",email:"demo.tech@example.com",license:"DEMO-TECH-01",defaultRole:"Fire Alarm Technician"},
      app:{profileId:"firevault",architectureVersion:2,defaultScreen:"home",distanceUnit:"feet",confirmDeletes:true,autoBackupReminder:true,haptics:true,viewMode:"simple"},
      visibility:{library:false,reports:true,equipment:true,advancedGps:true,attention:true},
      gps:{enabled:true,mapProvider:"apple",highAccuracy:true,includeInReports:true,nearbyRadiusMiles:20},
      reports:{title:"FireVault Demo Service Report",includeTechnician:true,includePhotos:true,includeMapLink:true,includeDeficiencies:true,includeTasks:true,format:"detailed"},
      email:{defaultTo:"customer@example.com",cc:"office@example.com",subjectPrefix:"FireVault Demo",defaultSubject:"FireVault Demo Report - {site_name} - {date}",signature:"{technician}\n{company}\n{phone}\n{email}"},
      sync:{provider:"onedrive",enabled:false,organization:"Example Fire Protection",workspace:"FireVault Demo Workspace",autoSync:true,wifiOnly:false,conflictPolicy:"review"},
      accountCategories:{version:1,definitions:[
        {id:"demo-category-healthcare",name:"Healthcare",color:"#22c55e",enabled:true,match:"any",rules:[{id:"demo-rule-h1",field:"sourceGroup",operator:"equals",value:"Healthcare"}]},
        {id:"demo-category-education",name:"Education",color:"#38bdf8",enabled:true,match:"any",rules:[{id:"demo-rule-e1",field:"sourceGroup",operator:"equals",value:"Education"}]},
        {id:"demo-category-priority",name:"Priority Service",color:"#ef4444",enabled:true,match:"any",rules:[{id:"demo-rule-p1",field:"sourceGroup",operator:"equals",value:"Priority"}]},
        {id:"demo-category-campus",name:"Multi-Building Campus",color:"#f59e0b",enabled:true,match:"any",rules:[{id:"demo-rule-c1",field:"address",operator:"contains",value:"Demo Medical Way"},{id:"demo-rule-c2",field:"address",operator:"contains",value:"Innovation Way"}]},
        {id:"demo-category-boise",name:"Boise Metro",color:"#a78bfa",enabled:true,match:"any",rules:[{id:"demo-rule-b1",field:"state",operator:"equals",value:"ID"}]}
      ]}
    },
    syncState:{schemaVersion:SECURITY_SCHEMA_VERSION,lastLocalSave:demoIso(0),lastSuccessfulSync:"",activity:[{id:"demo-sync-01",type:"customer-csv-import",at:demoIso(2),technician:"Demo Technician",details:"20 fictional Boise accounts loaded for demonstration."}]}
  });
}

const AUTO_BACKUP_INDEX_KEY = `${KEY}_auto_backup_index`;
const AUTO_BACKUP_PREFIX = `${KEY}_auto_backup_`;
const AUTO_BACKUP_LIMIT = 3;
const AUTO_BACKUP_MIN_INTERVAL = 5 * 60 * 1000;

function vaultCount(value){ return Array.isArray(value?.sites) ? value.sites.length : 0; }
function readAutoBackupIndex(){
  try{
    const rows=JSON.parse(localStorage.getItem(AUTO_BACKUP_INDEX_KEY)||"[]");
    return Array.isArray(rows)?rows.filter(x=>x&&x.key):[];
  }catch{return [];}
}
function writeAutoBackupIndex(rows){
  try{localStorage.setItem(AUTO_BACKUP_INDEX_KEY,JSON.stringify(rows));}catch{}
}
function createAutoBackupSnapshot(value,reason="automatic"){
  if(isDemoMode()) return null;
  if(!value || typeof value!=="object" || !Array.isArray(value.sites)) return null;
  const now=Date.now();
  let index=readAutoBackupIndex();
  const latest=index[0];
  if(latest && !["before-restore","restored"].includes(reason) && now-Number(latest.timestamp||0)<AUTO_BACKUP_MIN_INTERVAL && Number(latest.siteCount||0)===vaultCount(value)) return latest;
  const stamp=new Date(now).toISOString();
  const key=`${AUTO_BACKUP_PREFIX}${now}`;
  const snapshotValue=stripPersistedMediaForStorage(value);
  const payload={format:"firevault-auto-backup",formatVersion:2,build:BUILD,createdAt:stamp,reason,siteCount:vaultCount(snapshotValue),mediaBackend:"indexeddb",data:snapshotValue};
  try{
    localStorage.setItem(key,JSON.stringify(payload));
    index=[{key,timestamp:now,createdAt:stamp,reason,siteCount:payload.siteCount,build:BUILD},...index.filter(x=>x.key!==key)];
    while(index.length>AUTO_BACKUP_LIMIT){ const old=index.pop(); try{localStorage.removeItem(old.key);}catch{} }
    writeAutoBackupIndex(index);
    localStorage.setItem("firevault_last_auto_backup",stamp);
    return index[0];
  }catch(err){ console.error("Automatic backup failed",err); return null; }
}
export function autoBackupInfo(){
  if(isDemoMode()) return {count:0,last:null,items:[]};
  const index=readAutoBackupIndex();
  return {count:index.length,last:index[0]||null,items:index};
}
export function latestAutoBackup(){
  if(isDemoMode()) return null;
  const item=readAutoBackupIndex()[0];
  if(!item) return null;
  try{return JSON.parse(localStorage.getItem(item.key)||"null");}catch{return null;}
}
export function restoreAutoBackup(key){
  if(isDemoMode()) throw new Error("Automatic restore is disabled in Demo Mode.");
  try{
    const payload=JSON.parse(localStorage.getItem(key)||"null");
    const value=payload?.data;
    if(!value || !Array.isArray(value.sites)) throw new Error("Backup snapshot is invalid.");
    const current=parseVaultCandidate(localStorage.getItem(KEY),KEY)?.value;
    if(current) createAutoBackupSnapshot(current,"before-restore");
    localStorage.setItem(KEY,JSON.stringify(value));
    localStorage.setItem(RECOVERY_KEY,JSON.stringify(value));
    createAutoBackupSnapshot(value,"restored");
    return normalize(value);
  }catch(err){ throw err; }
}

export function deviceIdentity(){
  let id="";
  try{id=localStorage.getItem(DEVICE_KEY)||"";}catch{}
  if(!id) id=runtimeDeviceIdentity0739 || `device-${uid()}`;
  runtimeDeviceIdentity0739=id;
  try{if(localStorage.getItem(DEVICE_KEY)!==id) localStorage.setItem(DEVICE_KEY,id);}catch{}
  return id;
}
function nowIso(){ return new Date().toISOString(); }
function techIdentity(data){
  const t=data?.settings?.technician||{};
  return (t.email||t.name||"Unassigned technician").trim() || "Unassigned technician";
}
function comparable(record){
  if(!record || typeof record!=="object") return record;
  const clone={...record};
  delete clone.sync; delete clone.createdAt; delete clone.modifiedAt; delete clone.createdBy; delete clone.modifiedBy;
  delete clone.createdByUserId; delete clone.modifiedByUserId; delete clone.recordVersion; delete clone.changeId;
  delete clone.deletedAt; delete clone.deletedBy; delete clone.deletedByUserId; delete clone.workspaceId;
  return JSON.stringify(clone);
}
function syncMeta(record,data,previous){
  const now=nowIso(), tech=techIdentity(data), device=deviceIdentity();
  const foundation=ensureSecurityFoundation0790(data);
  const userId=foundation.localUser.id;
  record.workspaceId=record.workspaceId||previous?.workspaceId||foundation.workspaceId;
  record.createdAt=record.createdAt||previous?.createdAt||now;
  record.createdBy=record.createdBy||previous?.createdBy||tech;
  record.createdByUserId=record.createdByUserId||previous?.createdByUserId||userId;
  record.modifiedAt=record.modifiedAt||previous?.modifiedAt||record.createdAt;
  record.modifiedBy=record.modifiedBy||previous?.modifiedBy||record.createdBy;
  record.modifiedByUserId=record.modifiedByUserId||previous?.modifiedByUserId||record.createdByUserId;
  record.recordVersion=Math.max(1,Number(record.recordVersion||previous?.recordVersion||1));
  record.changeId=record.changeId||previous?.changeId||`change-${uid()}`;
  record.deletedAt=record.deletedAt||previous?.deletedAt||"";
  record.deletedBy=record.deletedBy||previous?.deletedBy||"";
  record.deletedByUserId=record.deletedByUserId||previous?.deletedByUserId||"";
  record.sync={
    status:record.sync?.status||previous?.sync?.status||"pending",
    deviceId:record.sync?.deviceId||previous?.sync?.deviceId||device,
    lastSyncedAt:record.sync?.lastSyncedAt||previous?.sync?.lastSyncedAt||"",
    remoteVersion:Number(record.sync?.remoteVersion||previous?.sync?.remoteVersion||0),
    baseVersion:Number(record.sync?.baseVersion||previous?.sync?.baseVersion||0),
    conflict:!!(record.sync?.conflict||previous?.sync?.conflict)
  };
  if(previous && comparable(record)!==comparable(previous)){
    record.modifiedAt=now;
    record.modifiedBy=tech;
    record.modifiedByUserId=userId;
    record.recordVersion=Math.max(Number(previous.recordVersion||1)+1,record.recordVersion+1);
    record.changeId=`change-${uid()}`;
    record.sync.status="pending";
    record.sync.deviceId=device;
    record.sync.baseVersion=Number(previous.recordVersion||1);
    record.sync.conflict=false;
  }
}
const CHILD_ARRAYS=["visits","knownIssues","equipment","contacts","docs","checklist","deficiencies","tasks","reportDeliveries","noteEntries"];

function securityUserLabel0790(data){
  const tech=data?.settings?.technician||{};
  return String(tech.name||tech.email||"Local FireVault User").trim()||"Local FireVault User";
}
function securityUserEmail0790(data){ return String(data?.settings?.technician?.email||"").trim(); }
function ensureSecurityFoundation0790(data){
  data=data&&typeof data==="object"?data:{};
  const now=nowIso();
  const prior=data.securityFoundation&&typeof data.securityFoundation==="object"?data.securityFoundation:{};
  const workspaceId=String(prior.workspaceId||`workspace-${uid()}`);
  const localUserPrior=prior.localUser&&typeof prior.localUser==="object"?prior.localUser:{};
  const localUserId=String(localUserPrior.id||`user-local-${uid()}`);
  const devicePrior=prior.device&&typeof prior.device==="object"?prior.device:{};
  data.securityFoundation={
    schemaVersion:SECURITY_SCHEMA_VERSION,
    foundationVersion:SECURITY_FOUNDATION_VERSION_0790,
    workspaceId,
    migratedAt:prior.migratedAt||now,
    lastValidatedAt:prior.lastValidatedAt||now,
    localUser:{
      id:localUserId,
      displayName:securityUserLabel0790(data),
      email:securityUserEmail0790(data),
      role:localUserPrior.role||"owner",
      status:localUserPrior.status||"active",
      createdAt:localUserPrior.createdAt||now
    },
    device:{
      id:deviceIdentity(),
      label:devicePrior.label||"This FireVault device",
      registeredAt:devicePrior.registeredAt||now,
      lastSeenAt:devicePrior.lastSeenAt||now
    },
    protections:{
      confirmRestore:prior.protections?.confirmRestore!==false,
      confirmReset:prior.protections?.confirmReset!==false,
      excludeCredentialsFromBackups:true,
      softDelete:true,
      auditHistory:true,
      ...(prior.protections||{})
    }
  };
  data.auditLog=Array.isArray(data.auditLog)?data.auditLog:[];
  data.recycleBin=Array.isArray(data.recycleBin)?data.recycleBin:[];
  data.syncState=data.syncState||{};
  data.syncState.changeQueue=Array.isArray(data.syncState.changeQueue)?data.syncState.changeQueue:[];
  return data.securityFoundation;
}
function auditEntry0790(data,type,details={}){
  const foundation=ensureSecurityFoundation0790(data);
  const row={
    id:`audit-${uid()}`,
    at:nowIso(),
    type,
    workspaceId:foundation.workspaceId,
    userId:foundation.localUser.id,
    user:foundation.localUser.displayName,
    deviceId:foundation.device.id,
    ...details
  };
  data.auditLog.unshift(row);
  data.auditLog=data.auditLog.slice(0,SECURITY_AUDIT_LIMIT_0790);
  return row;
}
function queueChange0790(data,operation,row,details={}){
  const foundation=ensureSecurityFoundation0790(data);
  data.syncState.changeQueue.unshift({
    id:`queue-${uid()}`,
    operation,
    at:nowIso(),
    workspaceId:foundation.workspaceId,
    userId:foundation.localUser.id,
    deviceId:foundation.device.id,
    recordType:row?.type||details.recordType||"record",
    recordId:row?.record?.id||details.recordId||"",
    siteId:row?.siteId||details.siteId||"",
    version:Number(row?.record?.recordVersion||details.version||1),
    changeId:row?.record?.changeId||details.changeId||"",
    status:"pending"
  });
  data.syncState.changeQueue=data.syncState.changeQueue.slice(0,SECURITY_CHANGE_QUEUE_LIMIT_0790);
}
function removeMediaPayloads0910(value){
  if(Array.isArray(value)){value.forEach(removeMediaPayloads0910);return value;}
  if(!value||typeof value!=="object")return value;
  delete value.imageData;delete value.photoData;
  Object.values(value).forEach(removeMediaPayloads0910);
  return value;
}
function auditComparable0790(record){
  if(!record||typeof record!=="object") return "";
  const clone=removeMediaPayloads0910(JSON.parse(JSON.stringify(record)));
  ["sync","createdAt","modifiedAt","createdBy","modifiedBy","createdByUserId","modifiedByUserId","recordVersion","changeId","workspaceId","deletedAt","deletedBy","deletedByUserId"].forEach(k=>delete clone[k]);
  CHILD_ARRAYS.forEach(k=>delete clone[k]);
  return JSON.stringify(clone);
}
function securitySnapshot0790(record){
  let attachmentsOmitted=false;
  const walk=value=>{
    if(Array.isArray(value)) return value.map(walk);
    if(value&&typeof value==="object"){
      const out={}; Object.entries(value).forEach(([k,v])=>{out[k]=walk(v);}); return out;
    }
    if(typeof value==="string" && value.length>100000 && value.startsWith("data:")){
      attachmentsOmitted=true; return "[large attachment omitted from local recycle snapshot]";
    }
    return value;
  };
  return {snapshot:walk(record),attachmentsOmitted};
}
function trimRecycleBin0790(data){
  const cutoff=Date.now()-SECURITY_RECYCLE_DAYS_0790*86400000;
  data.recycleBin=(data.recycleBin||[]).filter(x=>Date.parse(x?.deletedAt||0)>=cutoff).slice(0,SECURITY_RECYCLE_LIMIT_0790);
}
function captureSoftDeletes0790(previous,next){
  if(!previous||!Array.isArray(previous.sites)) return 0;
  ensureSecurityFoundation0790(next);
  const prevRows=trackedRows(previous), nextKeys=new Set(trackedRows(next).map(r=>`${r.type}:${r.record?.id}`));
  const removedSiteIds=new Set(prevRows.filter(r=>r.type==="site"&&!nextKeys.has(`site:${r.record?.id}`)).map(r=>r.record?.id));
  let count=0;
  prevRows.forEach(row=>{
    const key=`${row.type}:${row.record?.id}`;
    if(nextKeys.has(key)) return;
    if(row.type!=="site"&&removedSiteIds.has(row.siteId)) return;
    if((next.recycleBin||[]).some(x=>x.recordType===row.type&&x.recordId===row.record?.id)) return;
    const secured=securitySnapshot0790(row.record);
    const foundation=next.securityFoundation;
    next.recycleBin.unshift({
      id:`deleted-${uid()}`,
      recordId:row.record?.id||"",
      recordType:row.type,
      siteId:row.siteId||"",
      siteName:row.siteName||"",
      title:row.record?.name||row.record?.title||row.record?.summary||row.record?.note||row.type,
      deletedAt:nowIso(),
      deletedBy:foundation.localUser.displayName,
      deletedByUserId:foundation.localUser.id,
      deviceId:foundation.device.id,
      workspaceId:foundation.workspaceId,
      recordVersion:Number(row.record?.recordVersion||1)+1,
      attachmentsOmitted:secured.attachmentsOmitted,
      snapshot:secured.snapshot,
      sync:{status:"pending",deviceId:foundation.device.id,conflict:false}
    });
    auditEntry0790(next,"record-deleted",{recordType:row.type,recordId:row.record?.id||"",siteId:row.siteId||"",title:row.record?.name||row.record?.title||row.type});
    queueChange0790(next,"delete",row,{version:Number(row.record?.recordVersion||1)+1});
    count++;
  });
  trimRecycleBin0790(next);
  return count;
}
function auditRecordChanges0790(previous,next){
  if(!previous||!Array.isArray(previous.sites)) return;
  ensureSecurityFoundation0790(next);
  const prevMap=new Map(trackedRows(previous).map(r=>[`${r.type}:${r.record?.id}`,r]));
  let emitted=0;
  trackedRows(next).forEach(row=>{
    const key=`${row.type}:${row.record?.id}`;
    const before=prevMap.get(key);
    if(!before){
      if(emitted<60) auditEntry0790(next,"record-created",{recordType:row.type,recordId:row.record?.id||"",siteId:row.siteId||"",title:row.record?.name||row.record?.title||row.type});
      queueChange0790(next,"create",row); emitted++; return;
    }
    if(auditComparable0790(before.record)!==auditComparable0790(row.record)){
      if(emitted<60) auditEntry0790(next,"record-updated",{recordType:row.type,recordId:row.record?.id||"",siteId:row.siteId||"",title:row.record?.name||row.record?.title||row.type,version:Number(row.record?.recordVersion||1)});
      queueChange0790(next,"update",row); emitted++;
    }
  });
  if(emitted>60) auditEntry0790(next,"bulk-change-summary",{changedRecords:emitted,detailLimit:60});
}
export function securityFoundationSummary(data){
  const f=ensureSecurityFoundation0790(data);
  trimRecycleBin0790(data);
  return {
    schemaVersion:SECURITY_SCHEMA_VERSION,
    foundationVersion:f.foundationVersion,
    workspaceId:f.workspaceId,
    user:{...f.localUser},
    device:{...f.device},
    auditCount:(data.auditLog||[]).length,
    recycleCount:(data.recycleBin||[]).length,
    pendingChanges:(data.syncState?.changeQueue||[]).filter(x=>x.status!=="synced").length,
    migratedAt:f.migratedAt,
    protections:{...f.protections}
  };
}
export function securityAudit(data){ return Array.isArray(data?.auditLog)?data.auditLog:[]; }
export function validateVaultIntegrity(data){
  const errors=[];
  const warnings=[];
  const ids=new Set();
  const accountIds=new Map();
  let records=0;
  const addRecord=(record,label)=>{
    records++;
    if(!record || typeof record!=="object"){ errors.push(`${label} is not a valid record.`); return; }
    if(!record.id) errors.push(`${label} is missing a record ID.`);
    else if(ids.has(record.id)) errors.push(`Duplicate record ID: ${record.id}`);
    else ids.add(record.id);
    if(!record.workspaceId) warnings.push(`${label} is missing a workspace ID.`);
    if(!record.createdByUserId || !record.modifiedByUserId) warnings.push(`${label} is missing user audit metadata.`);
    if(!record.changeId || !Number(record.recordVersion||0)) warnings.push(`${label} is missing version metadata.`);
  };
  if(!data || typeof data!=="object") errors.push("Vault root is not a valid object.");
  if(!Array.isArray(data?.sites)) errors.push("Accounts collection is not an array.");
  (Array.isArray(data?.sites)?data.sites:[]).forEach((site,index)=>{
    const label=site?.name||`Account ${index+1}`;
    addRecord(site,label);
    if(!String(site?.name||"").trim()) warnings.push(`Account ${index+1} has no site name.`);
    const accountId=String(site?.externalAccountId||"").trim().toUpperCase();
    if(accountId){
      if(accountIds.has(accountId)) warnings.push(`Account ID ${accountId} is used by more than one account.`);
      else accountIds.set(accountId,site?.id||label);
    }
    if(site?.gps && (site.gps.lat!==undefined || site.gps.lng!==undefined)){
      const lat=Number(site.gps.lat), lng=Number(site.gps.lng);
      if(!Number.isFinite(lat)||!Number.isFinite(lng)||Math.abs(lat)>90||Math.abs(lng)>180) warnings.push(`${label} has invalid GPS coordinates.`);
    }
    CHILD_ARRAYS.forEach(key=>{
      if(!Array.isArray(site?.[key])){ errors.push(`${label} has invalid ${key} storage.`); return; }
      site[key].forEach((record,i)=>addRecord(record,`${label} ${key} ${i+1}`));
    });
  });
  if(!Array.isArray(data?.resources)) errors.push("Library resources collection is not an array.");
  (Array.isArray(data?.resources)?data.resources:[]).forEach((record,i)=>addRecord(record,`Library item ${i+1}`));
  if(!data?.settings || typeof data.settings!=="object") errors.push("Settings collection is missing or invalid.");
  if(!Array.isArray(data?.auditLog)) errors.push("Security audit log is missing or invalid.");
  if(!Array.isArray(data?.recycleBin)) errors.push("Recycle bin is missing or invalid.");
  const foundation=data?.securityFoundation;
  if(!foundation?.workspaceId || !foundation?.localUser?.id || !foundation?.device?.id) errors.push("Workspace, local user, or device identity is incomplete.");
  if(Number(foundation?.schemaVersion||data?.syncState?.schemaVersion||0)!==SECURITY_SCHEMA_VERSION) errors.push(`Security schema does not match version ${SECURITY_SCHEMA_VERSION}.`);
  return {
    status:errors.length?"critical":warnings.length?"warning":"healthy",
    checkedAt:nowIso(),
    siteCount:Array.isArray(data?.sites)?data.sites.length:0,
    recordCount:records,
    errorCount:errors.length,
    warningCount:warnings.length,
    errors:errors.slice(0,50),
    warnings:warnings.slice(0,50)
  };
}
export function recordSecurityEvent(data,type,details={}){
  const row=auditEntry0790(data,type,details);
  saveData(data);
  return row;
}
export function recycleBinInfo(data){
  ensureSecurityFoundation0790(data); trimRecycleBin0790(data);
  return {count:data.recycleBin.length,items:data.recycleBin.map(x=>({id:x.id,recordId:x.recordId,recordType:x.recordType,siteName:x.siteName,title:x.title,deletedAt:x.deletedAt,attachmentsOmitted:!!x.attachmentsOmitted}))};
}
export function restoreRecycleRecord(data,deletedId){
  ensureSecurityFoundation0790(data);
  const index=data.recycleBin.findIndex(x=>x.id===deletedId);
  if(index<0) throw new Error("Deleted record was not found.");
  const item=data.recycleBin[index], record=JSON.parse(JSON.stringify(item.snapshot));
  record.deletedAt=""; record.deletedBy=""; record.deletedByUserId="";
  record.modifiedAt=nowIso(); record.modifiedBy=securityUserLabel0790(data); record.modifiedByUserId=data.securityFoundation.localUser.id;
  record.recordVersion=Math.max(Number(record.recordVersion||1),Number(item.recordVersion||1))+1;
  record.changeId=`change-${uid()}`; record.sync={...(record.sync||{}),status:"pending",deviceId:deviceIdentity(),conflict:false};
  if(item.recordType==="site"){
    if(data.sites.some(x=>x.id===record.id)) throw new Error("That account already exists.");
    data.sites.push(record);
  }else{
    const site=data.sites.find(x=>x.id===item.siteId);
    if(!site||!CHILD_ARRAYS.includes(item.recordType)) throw new Error("The parent account is no longer available.");
    site[item.recordType]=Array.isArray(site[item.recordType])?site[item.recordType]:[];
    if(site[item.recordType].some(x=>x.id===record.id)) throw new Error("That record already exists.");
    site[item.recordType].push(record);
  }
  data.recycleBin.splice(index,1);
  auditEntry0790(data,"record-restored",{recordType:item.recordType,recordId:item.recordId,siteId:item.siteId,title:item.title});
  queueChange0790(data,"restore",{type:item.recordType,siteId:item.siteId,record});
  saveData(data);
  return record;
}
export function purgeRecycleBin(data){
  ensureSecurityFoundation0790(data);
  const count=data.recycleBin.length;
  data.recycleBin=[];
  auditEntry0790(data,"recycle-bin-purged",{recordCount:count});
  saveData(data);
  return count;
}
function migrateRecordTree(record,data,previous){
  if(!record || typeof record!=="object") return;
  record.id=record.id||uid();
  syncMeta(record,data,previous);
  CHILD_ARRAYS.forEach(key=>{
    if(!Array.isArray(record[key])) return;
    const prevMap=new Map((previous?.[key]||[]).map(x=>[x?.id,x]));
    record[key].forEach(item=>migrateRecordTree(item,data,prevMap.get(item?.id)));
  });
}
export function syncSummary(data){
  const rows=[];
  (data.sites||[]).forEach(site=>{ rows.push(site); CHILD_ARRAYS.forEach(k=>(site[k]||[]).forEach(x=>rows.push(x))); });
  (data.resources||[]).forEach(x=>rows.push(x));
  return {total:rows.length,pending:rows.filter(x=>x?.sync?.status==="pending").length,synced:rows.filter(x=>x?.sync?.status==="synced").length,conflicts:rows.filter(x=>x?.sync?.status==="conflict"||x?.sync?.conflict).length,localOnly:rows.filter(x=>x?.sync?.status==="local").length,packaged:rows.filter(x=>x?.sync?.status==="packaged").length};
}


function trackedRows(data){
  const rows=[];
  (data.sites||[]).forEach(site=>{
    rows.push({type:"site",siteId:site.id,siteName:site.name||"Unnamed site",record:site});
    CHILD_ARRAYS.forEach(key=>(site[key]||[]).forEach(record=>rows.push({type:key,siteId:site.id,siteName:site.name||"Unnamed site",record})));
  });
  (data.resources||[]).forEach(record=>rows.push({type:"resource",siteId:"",siteName:"Library",record}));
  return rows;
}
export function syncQueue(data){
  return trackedRows(data).filter(row=>["pending","conflict","local","packaged"].includes(row.record?.sync?.status||"pending")).map(row=>({
    type:row.type,siteId:row.siteId,siteName:row.siteName,id:row.record.id,title:row.record.name||row.record.title||row.record.summary||row.record.note||row.type,
    modifiedAt:row.record.modifiedAt||row.record.createdAt||"",modifiedBy:row.record.modifiedBy||row.record.createdBy||"Unassigned technician",
    version:Number(row.record.recordVersion||1),status:row.record.sync?.status||"pending"
  })).sort((a,b)=>String(b.modifiedAt).localeCompare(String(a.modifiedAt)));
}

export function syncConflicts(data){
  return trackedRows(data).filter(row=>row.record?.sync?.status==="conflict"||row.record?.sync?.conflict).map(row=>({
    type:row.type,siteId:row.siteId,siteName:row.siteName,id:row.record.id,title:row.record.name||row.record.title||row.record.summary||row.record.note||row.type,
    modifiedAt:row.record.modifiedAt||row.record.createdAt||"",modifiedBy:row.record.modifiedBy||row.record.createdBy||"Unassigned technician",
    version:Number(row.record.recordVersion||1),remoteVersion:Number(row.record.sync?.remoteVersion||1),remoteSnapshot:row.record.sync?.remoteSnapshot||null
  })).sort((a,b)=>String(b.modifiedAt).localeCompare(String(a.modifiedAt)));
}
function findTrackedRecord(data,id){
  let found=null;
  trackedRows(data).some(row=>{ if(row.record?.id===id){ found=row.record; return true; } return false; });
  return found;
}
export function recordSyncActivity(data,type,details={}){
  data.syncState=data.syncState||{};
  data.syncState.activity=Array.isArray(data.syncState.activity)?data.syncState.activity:[];
  data.syncState.activity.unshift({id:uid(),type,at:nowIso(),deviceId:deviceIdentity(),technician:techIdentity(data),...details});
  data.syncState.activity=data.syncState.activity.slice(0,100);
}
export function syncActivity(data){
  return Array.isArray(data?.syncState?.activity)?data.syncState.activity:[];
}
export function resolveSyncConflict(data,id,choice){
  const record=findTrackedRecord(data,id);
  if(!record || !record.sync?.remoteSnapshot) throw new Error("Conflict record was not found.");
  const when=nowIso();
  if(choice==="remote"){
    const remote=packageRecord(record.sync.remoteSnapshot);
    const children={}; CHILD_ARRAYS.forEach(k=>{ if(Array.isArray(remote[k])) children[k]=remote[k]; });
    Object.keys(record).forEach(k=>delete record[k]); Object.assign(record,remote);
    CHILD_ARRAYS.forEach(k=>{ if(children[k]) record[k]=children[k]; });
    markSynced(record,when);
  } else {
    record.recordVersion=Math.max(Number(record.recordVersion||1),Number(record.sync.remoteVersion||1))+1;
    record.modifiedAt=when; record.modifiedBy=techIdentity(data);
    record.sync={...(record.sync||{}),status:"pending",conflict:false,deviceId:deviceIdentity(),remoteSnapshot:null,conflictDetectedAt:""};
  }
  recordSyncActivity(data,"conflict-resolved",{recordId:id,choice,siteName:"",recordType:"record"});
  saveData(data);
  return record;
}
export function notePackageExport(data,pkg){
  data.syncState=data.syncState||{};
  data.syncState.lastExportedPackage={exportedAt:pkg.exportedAt,deviceId:pkg.deviceId,technician:pkg.technician,workspace:pkg.workspace};
  recordSyncActivity(data,"package-export",{workspace:pkg.workspace,recordCount:(pkg.sites||[]).length+(pkg.resources||[]).length});
  saveData(data);
}

function packageRecord(record){ return JSON.parse(JSON.stringify(record)); }
export function createSyncPackage(data){
  const foundation=ensureSecurityFoundation0790(data);
  const tombstones=(data.recycleBin||[]).map(item=>({
    id:item.id,recordId:item.recordId,recordType:item.recordType,siteId:item.siteId,deletedAt:item.deletedAt,
    deletedByUserId:item.deletedByUserId,deviceId:item.deviceId,workspaceId:item.workspaceId,recordVersion:item.recordVersion,
    sync:item.sync||{status:"pending"}
  }));
  return {
    format:"firevault-shared-vault-package",formatVersion:2,appBuild:BUILD,securitySchema:SECURITY_SCHEMA_VERSION,
    exportedAt:nowIso(),deviceId:deviceIdentity(),exportedByUserId:foundation.localUser.id,
    technician:techIdentity(data),organization:data.settings?.sync?.organization||"",workspace:data.settings?.sync?.workspace||"FireVault Shared Vault",
    workspaceId:foundation.workspaceId,sites:(data.sites||[]).map(packageRecord),resources:(data.resources||[]).map(packageRecord),
    changeQueue:(data.syncState?.changeQueue||[]).map(packageRecord),tombstones
  };
}
function contentKey(record){
  if(!record || typeof record!=="object") return "";
  const clone=removeMediaPayloads0910(JSON.parse(JSON.stringify(record)));
  delete clone.sync; delete clone.modifiedAt; delete clone.modifiedBy; delete clone.recordVersion;
  CHILD_ARRAYS.forEach(k=>delete clone[k]);
  return JSON.stringify(clone);
}
function markSynced(record,when){
  record.sync={...(record.sync||{}),status:"synced",conflict:false,lastSyncedAt:when,remoteVersion:Number(record.recordVersion||1)};
}
function mergeArray(localArr,incomingArr,data,when,stats){
  const map=new Map((localArr||[]).map(x=>[x.id,x]));
  (incomingArr||[]).forEach(remote=>{
    const local=map.get(remote.id);
    if(!local){ const added=packageRecord(remote); markSynced(added,when); localArr.push(added); stats.added++; return; }
    mergeOne(local,remote,data,when,stats);
  });
}
function mergeOne(local,remote,data,when,stats){
  const lv=Number(local.recordVersion||1), rv=Number(remote.recordVersion||1);
  if(rv>lv){
    const preserved={}; CHILD_ARRAYS.forEach(k=>{ if(Array.isArray(local[k])) preserved[k]=local[k]; });
    Object.keys(local).forEach(k=>delete local[k]); Object.assign(local,packageRecord(remote));
    CHILD_ARRAYS.forEach(k=>{ if(preserved[k] && !Array.isArray(remote[k])) local[k]=preserved[k]; });
    markSynced(local,when); stats.updated++;
  } else if(rv===lv && contentKey(local)!==contentKey(remote)){
    local.sync={...(local.sync||{}),status:"conflict",conflict:true,conflictDetectedAt:when,remoteVersion:rv,remoteSnapshot:packageRecord(remote)};
    stats.conflicts++;
  } else if(rv===lv){ markSynced(local,when); stats.matched++; }
  else { stats.localNewer++; }
  CHILD_ARRAYS.forEach(k=>{ if(Array.isArray(remote[k])){ local[k]=Array.isArray(local[k])?local[k]:[]; mergeArray(local[k],remote[k],data,when,stats); } });
}
export function importSyncPackage(data,pkg){
  if(!pkg || pkg.format!=="firevault-shared-vault-package" || !Array.isArray(pkg.sites)) throw new Error("Not a valid FireVault Shared Vault package.");
  const when=nowIso(), stats={added:0,updated:0,matched:0,conflicts:0,localNewer:0};
  const siteMap=new Map((data.sites||[]).map(x=>[x.id,x]));
  pkg.sites.forEach(remote=>{
    const local=siteMap.get(remote.id);
    if(!local){ const added=packageRecord(remote); markSynced(added,when); data.sites.push(added); stats.added++; }
    else mergeOne(local,remote,data,when,stats);
  });
  data.resources=Array.isArray(data.resources)?data.resources:[];
  mergeArray(data.resources,pkg.resources||[],data,when,stats);
  const remoteTombstones=Array.isArray(pkg.tombstones)?pkg.tombstones:[];
  const existingRemote=new Map((data.syncState?.remoteTombstones||[]).map(x=>[`${x.recordType}:${x.recordId}`,x]));
  remoteTombstones.forEach(x=>existingRemote.set(`${x.recordType}:${x.recordId}`,packageRecord(x)));
  data.syncState={...(data.syncState||{}),schemaVersion:SECURITY_SCHEMA_VERSION,lastSuccessfulSync:when,remoteTombstones:[...existingRemote.values()].slice(-200),lastImportedPackage:{exportedAt:pkg.exportedAt||"",deviceId:pkg.deviceId||"",technician:pkg.technician||"",workspace:pkg.workspace||"",workspaceId:pkg.workspaceId||"",securitySchema:Number(pkg.securitySchema||0)}};
  recordSyncActivity(data,"package-import",{workspace:pkg.workspace||"",fromDevice:pkg.deviceId||"",fromTechnician:pkg.technician||"",remoteDeleted:remoteTombstones.length,stats:{...stats}});
  saveData(data);
  return stats;
}

export function uid(){ return Date.now().toString(36)+Math.random().toString(36).slice(2,7); }
export function esc(s){ return String(s ?? "").replace(/[&<>"']/g, m => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"}[m])); }
const RECOVERY_KEY = `${KEY}_recovery`;
function parseVaultCandidate(raw,key){
  if(!raw) return null;
  try{
    const value=JSON.parse(raw);
    if(!value || typeof value!=="object" || !Array.isArray(value.sites)) return null;
    return {key,value,count:value.sites.length,updated:value.syncState?.lastLocalSave||""};
  }catch{return null;}
}
function recoverBestLocalVault(){
  let primary=null;
  try{primary=parseVaultCandidate(localStorage.getItem(KEY),KEY);}catch{}
  // Build 0.79.0: a valid populated primary vault is authoritative. Older
  // recovery logic preferred whichever copy had more accounts, which could
  // unintentionally undo legitimate deletions by reopening the recovery copy.
  if(primary && primary.count>0) return primary;
  const candidates=[];
  try{
    const recovery=parseVaultCandidate(localStorage.getItem(RECOVERY_KEY),RECOVERY_KEY); if(recovery)candidates.push(recovery);
    for(let i=0;i<localStorage.length;i++){
      const key=localStorage.key(i)||"";
      if(!key.toLowerCase().includes("firevault") || key===KEY || key===RECOVERY_KEY || key===DEMO_VAULT_KEY || key.toLowerCase().includes("_demo_")) continue;
      const c=parseVaultCandidate(localStorage.getItem(key),key); if(c)candidates.push(c);
    }
  }catch(err){console.error("Vault recovery scan failed",err);}
  candidates.sort((a,b)=>b.count-a.count || String(b.updated).localeCompare(String(a.updated)));
  return candidates[0]||primary||null;
}
export function loadData(options={}){
  const allowEmptyReal=options?.allowEmptyReal===true;
  let demoActive=isDemoMode();
  let best=null;
  if(!demoActive) best=recoverBestLocalVault();

  // Build 0.74.1: when no real customer vault exists, FireVault opens the
  // protected fictional Boise workspace instead of presenting an empty app.
  // The demo master is generated in code and is never stored as a deletable vault.
  if(!demoActive && !best && !allowEmptyReal){
    setDemoMode(true);
    demoActive=true;
  }

  if(demoActive){
    // Demo changes live only in a temporary working copy. Exiting Demo Mode
    // discards them and reloads the untouched real vault. If no real vault exists,
    // the protected demo master becomes the default again on the next startup.
    try{localStorage.removeItem(DEMO_VAULT_KEY);}catch{}
    if(!demoRuntimeVault0739 || !Array.isArray(demoRuntimeVault0739.sites)){
      demoRuntimeVault0739=createDemoVault();
    }
    return normalize(demoRuntimeVault0739);
  }
  if(best){
    try{
      if(best.key!==KEY && best.count>0){
        localStorage.setItem(KEY,JSON.stringify(best.value));
        localStorage.setItem(RECOVERY_KEY,JSON.stringify(best.value));
        localStorage.setItem("firevault_last_recovery_source",best.key);
      }
    }catch{}
    const sourceSchema=Number(best.value?.securityFoundation?.schemaVersion||best.value?.syncState?.schemaVersion||0);
    if(sourceSchema<SECURITY_SCHEMA_VERSION) createAutoBackupSnapshot(best.value,"before-security-migration");
    const loaded=normalize(best.value);
    hydrateVaultMediaFromCache(loaded);
    if(sourceSchema<SECURITY_SCHEMA_VERSION){
      loaded.securityFoundation.migratedAt=nowIso();
      loaded.securityFoundation.lastValidatedAt=nowIso();
      auditEntry0790(loaded,"security-foundation-migrated",{fromSchema:sourceSchema,toSchema:SECURITY_SCHEMA_VERSION,siteCount:loaded.sites.length});
      loaded.syncState.schemaVersion=SECURITY_SCHEMA_VERSION;
      const migratedText=JSON.stringify(loaded);
      let persisted=false;
      try{localStorage.setItem(KEY,migratedText);persisted=true;}catch(err){
        // Keep the pre-migration recovery copy, remove only rolling snapshots,
        // and retry so schema metadata does not trigger a startup quota crash.
        const index=readAutoBackupIndex();
        index.forEach(item=>{try{localStorage.removeItem(item.key);}catch{}});
        writeAutoBackupIndex([]);
        try{localStorage.setItem(KEY,migratedText);persisted=true;}catch(retryErr){console.error("Security foundation migration could not be persisted",retryErr);}
      }
      if(persisted) createAutoBackupSnapshot(loaded,"after-security-migration");
    }else createAutoBackupSnapshot(loaded,"startup");
    return loaded;
  }
  const empty=normalize({sites:[], resources:[], breadcrumbs:[]});
  hydrateVaultMediaFromCache(empty);
  return empty;
}
export function saveData(data){
  if(isDemoMode()){
    const previous=demoRuntimeVault0739;
    normalize(data);
    const prevSites=new Map((previous?.sites||[]).map(x=>[x?.id,x]));
    data.sites.forEach(site=>migrateRecordTree(site,data,prevSites.get(site.id)));
    const prevResources=new Map((previous?.resources||[]).map(x=>[x?.id,x]));
    data.resources.forEach(item=>migrateRecordTree(item,data,prevResources.get(item.id)));
    data.demoMode=true;
    data.syncState={...(data.syncState||{}),schemaVersion:SECURITY_SCHEMA_VERSION,deviceId:deviceIdentity(),provider:data.settings?.sync?.provider||"onedrive",lastLocalSave:nowIso(),lastSuccessfulSync:data.syncState?.lastSuccessfulSync||""};
    demoRuntimeVault0739=data;
    return data;
  }
  let previous=null;
  try{ previous=JSON.parse(localStorage.getItem(KEY)||"null"); }catch{}
  normalize(data);
  const previousCount=Array.isArray(previous?.sites)?previous.sites.length:0;
  const nextCount=Array.isArray(data?.sites)?data.sites.length:0;
  if(previousCount>0 && nextCount===0){
    console.error("Blocked unsafe empty-vault overwrite",{previousCount,nextCount});
    try{localStorage.setItem(RECOVERY_KEY,JSON.stringify(previous));}catch{}
    return previous;
  }
  if(previousCount>0){
    try{localStorage.setItem(RECOVERY_KEY,JSON.stringify(previous));}catch{}
    createAutoBackupSnapshot(previous,"before-save");
  }
  const previousNormalized=previous?normalize(JSON.parse(JSON.stringify(previous))):null;
  ensureSecurityFoundation0790(data);
  captureSoftDeletes0790(previousNormalized,data);
  const prevSites=new Map((previousNormalized?.sites||[]).map(x=>[x?.id,x]));
  data.sites.forEach(site=>migrateRecordTree(site,data,prevSites.get(site.id)));
  const prevResources=new Map((previousNormalized?.resources||[]).map(x=>[x?.id,x]));
  data.resources.forEach(item=>migrateRecordTree(item,data,prevResources.get(item.id)));
  auditRecordChanges0790(previousNormalized,data);
  data.securityFoundation.device.lastSeenAt=nowIso();
  data.securityFoundation.lastValidatedAt=nowIso();
  data.syncState={...(data.syncState||{}),schemaVersion:SECURITY_SCHEMA_VERSION,deviceId:deviceIdentity(),provider:data.settings?.sync?.provider||"onedrive",lastLocalSave:nowIso(),lastSuccessfulSync:data.syncState?.lastSuccessfulSync||""};
  const mediaWrite=stageVaultMedia(data);
  const storageSafe=stripPersistedMediaForStorage(data);
  const serialized=JSON.stringify(storageSafe);
  try{
    localStorage.setItem(KEY,serialized);
  }catch(err){
    const index=readAutoBackupIndex();
    index.slice().reverse().forEach(item=>{try{localStorage.removeItem(item.key);}catch{}});
    writeAutoBackupIndex([]);
    localStorage.setItem(KEY,serialized);
  }
  createAutoBackupSnapshot(storageSafe,"automatic");
  mediaWrite.then(()=>{
    // Compact any inline payloads that were retained for crash safety until
    // their IndexedDB write completed. This metadata-only rewrite does not
    // create another audit event or automatic snapshot.
    try{
      const current=JSON.parse(localStorage.getItem(KEY)||"null");
      if(current&&Array.isArray(current.sites)) localStorage.setItem(KEY,JSON.stringify(stripPersistedMediaForStorage(current)));
      const recovery=JSON.parse(localStorage.getItem(RECOVERY_KEY)||"null");
      if(recovery&&Array.isArray(recovery.sites)) localStorage.setItem(RECOVERY_KEY,JSON.stringify(stripPersistedMediaForStorage(recovery)));
    }catch(err){console.warn("FireVault media compaction will retry on the next save.",err);}
  }).catch(err=>console.error("FireVault media could not be moved to IndexedDB.",err));
}
export function normalize(data){
  data.sites = Array.isArray(data.sites) ? data.sites : [];
  data.resources = Array.isArray(data.resources) ? data.resources : [];
  data.resourceFolders = Array.isArray(data.resourceFolders) ? data.resourceFolders : ["Manuals","Forms","Links","Codes"];
  if(!data.resourceFolders.length) data.resourceFolders = ["Manuals","Forms","Links","Codes"];
  data.breadcrumbs = Array.isArray(data.breadcrumbs) ? data.breadcrumbs : [];
  data.legacyArchive = data.legacyArchive && typeof data.legacyArchive === "object" ? data.legacyArchive : {};
  if(Array.isArray(data.routeLogs) && data.routeLogs.length && !Array.isArray(data.legacyArchive.routeLogs)) data.legacyArchive.routeLogs=data.routeLogs;
  delete data.routeLogs;
  data.settings = data.settings || {};
  data.settings.overlay = data.settings.overlay || {fields:["site","date","time"], alignment:"bottom", fontSize:"medium", textColor:"#ffffff", accentColor:"#ef4444", backgroundStyle:"bar", opacity:"85", template:"{site_name} • {date} • {time}", showLogo:true, showTagline:true, logoMode:"firevault", customLogoData:""};
  data.settings.overlay.template = data.settings.overlay.template || "{site_name} • {date} • {time}";
  data.settings.overlay.alignment = data.settings.overlay.alignment || "bottom";
  data.settings.overlay.fontSize = data.settings.overlay.fontSize || "medium";
  data.settings.overlay.textColor = data.settings.overlay.textColor || "#ffffff";
  data.settings.overlay.accentColor = data.settings.overlay.accentColor || "#ef4444";
  data.settings.overlay.backgroundStyle = data.settings.overlay.backgroundStyle || "bar";
  data.settings.overlay.opacity = String(data.settings.overlay.opacity || "85");
  data.settings.overlay.showLogo = data.settings.overlay.showLogo !== false;
  data.settings.overlay.showTagline = data.settings.overlay.showTagline !== false;
  data.settings.overlay.logoMode = data.settings.overlay.logoMode || "firevault";
  data.settings.overlay.customLogoData = data.settings.overlay.customLogoData || "";
  data.settings.technician = {name:"", company:"", phone:"", email:"", license:"", defaultRole:"Fire Alarm Technician", photoData:"", photoUpdatedAt:"", ...(data.settings.technician||{})};
  if(!/^data:image\//.test(String(data.settings.technician.photoData||""))) data.settings.technician.photoData="";
  data.settings.technician.photoUpdatedAt=String(data.settings.technician.photoUpdatedAt||"");
  const technicianOverlayAllowed0946=new Set(["{technician}","{company}","{phone}","{email}","{license}"]);
  const technicianOverlaySeen0946=new Set();
  const technicianOverlayRaw0948=data.settings.technicianOverlay||{};
  const technicianOverlaySource0946=Array.isArray(technicianOverlayRaw0948.fields)?technicianOverlayRaw0948.fields:[];
  const technicianOverlayFields0946=technicianOverlaySource0946.flatMap(item=>{
    const tag=String(item?.tag||"");
    if(!technicianOverlayAllowed0946.has(tag)||technicianOverlaySeen0946.has(tag))return [];
    technicianOverlaySeen0946.add(tag);
    return [{tag,breakBefore:Boolean(item?.breakBefore)}];
  });
  const technicianOverlayLegacyAlign0948=technicianOverlaySource0946.map(item=>item?.align).filter(Boolean);
  const technicianOverlayAlignment0948=["left","center","right"].includes(technicianOverlayRaw0948.alignment)
    ? technicianOverlayRaw0948.alignment
    : (technicianOverlayLegacyAlign0948.length&&technicianOverlayLegacyAlign0948.every(value=>value==="left")?"left":"right");
  data.settings.technicianOverlay={
    fields:technicianOverlayFields0946.length?technicianOverlayFields0946:[
      {tag:"{technician}",breakBefore:false},
      {tag:"{phone}",breakBefore:false}
    ],
    alignment:technicianOverlayAlignment0948
  };
  if(data.settings.technicianOverlay.fields[0])data.settings.technicianOverlay.fields[0].breakBefore=false;
  data.settings.notifications = data.settings.notifications || {dailyReminder:false, reminderTime:"07:30", taskAlerts:true, inspectionAlerts:true, gpsPrompts:true};
  data.settings.reports = data.settings.reports || {title:"FireVault Service Report", includeTechnician:true, includePhotos:true, includeMapLink:true, includeDeficiencies:true, includeTasks:true, format:"detailed"};
  data.settings.pdf = data.settings.pdf || {paperSize:"Letter", orientation:"Portrait", photoSize:"Medium", includeLogo:true, footerText:"Generated by FireVault"};
  data.settings.email = data.settings.email || {defaultTo:"", cc:"", subjectPrefix:"FireVault Report", defaultSubject:"FireVault Report - {site_name} - {date}", signature:"{technician}\n{company}\n{phone}\n{email}"};
  data.settings.app = data.settings.app || {profileId:"firevault", architectureVersion:2, defaultScreen:"home", distanceUnit:"feet", confirmDeletes:true, autoBackupReminder:true, haptics:true, viewMode:"simple"};
  data.settings.app.profileId = String(data.settings.app.profileId||"firevault");
  data.settings.app.architectureVersion = Math.max(2,Number(data.settings.app.architectureVersion)||2);
  data.settings.app.haptics = data.settings.app.haptics !== false;
  data.settings.app.viewMode = data.settings.app.viewMode || "simple";
  const featureDefaults = {library:false, reports:false, equipment:false, advancedGps:true, attention:false, csvExports:false, backupRepair:false};
  data.settings.visibility = {...featureDefaults, ...(data.settings.visibility || {})};
  const retiredVisibility0900={};
  ["dailyRoute","diagnostics","routeReview"].forEach(key=>{if(Object.prototype.hasOwnProperty.call(data.settings.visibility,key)){retiredVisibility0900[key]=data.settings.visibility[key];delete data.settings.visibility[key];}});
  if(Object.keys(retiredVisibility0900).length && !data.legacyArchive.visibility) data.legacyArchive.visibility=retiredVisibility0900;
  if(data.settings.theme && !data.legacyArchive.theme) data.legacyArchive.theme=data.settings.theme;
  if(data.settings.advanced && !data.legacyArchive.advanced) data.legacyArchive.advanced=data.settings.advanced;
  delete data.settings.theme;
  delete data.settings.advanced;
  data.settings.gps = {enabled:true, mapProvider:"apple", highAccuracy:true, includeInReports:true, nearbyRadiusMiles:1, addressAssist:true, reverseGeocodeEndpoint:"https://nominatim.openstreetmap.org/reverse", addressSearchEndpoint:"https://nominatim.openstreetmap.org/search", ...(data.settings.gps || {})};
  data.settings.sync = {provider:"onedrive",enabled:false,organization:"",workspace:"FireVault Shared Vault",autoSync:true,wifiOnly:false,conflictPolicy:"review",...(data.settings.sync||{})};
  const fileStorage=data.settings.fileStorage||{};
  data.settings.fileStorage={
    version:2,
    photo:{provider:"local",connectionId:"",folder:"FireVault/Photos",...(fileStorage.photo||{})},
    document:{provider:"local",connectionId:"",folder:"FireVault/Documents",...(fileStorage.document||{})},
    keepLocalCopy:fileStorage.keepLocalCopy!==false,
    uploadOnSave:!!fileStorage.uploadOnSave,
    neverFallbackToPersonal:fileStorage.neverFallbackToPersonal!==false
  };
  data.settings.plusCodes={
    enabled:true,
    autoGenerate:true,
    accountLength:10,
    locationLength:11,
    includeInReports:true,
    searchable:true,
    verifyAfterDays:180,
    ...(data.settings.plusCodes||{})
  };
  data.settings.plusCodes.accountLength=[10,11].includes(Number(data.settings.plusCodes.accountLength))?Number(data.settings.plusCodes.accountLength):10;
  data.settings.plusCodes.locationLength=[10,11].includes(Number(data.settings.plusCodes.locationLength))?Number(data.settings.plusCodes.locationLength):11;
  data.settings.plusCodes.verifyAfterDays=[90,180,365].includes(Number(data.settings.plusCodes.verifyAfterDays))?Number(data.settings.plusCodes.verifyAfterDays):180;
  if(Object.prototype.hasOwnProperty.call(data.settings,"dataQuality")) delete data.settings.dataQuality;
  const defaultCategories0737 = [];
  const rawCategories0737 = data.settings.accountCategories;
  const sourceCategories0737 = rawCategories0737 && Array.isArray(rawCategories0737.definitions) ? rawCategories0737.definitions : defaultCategories0737;
  data.settings.accountCategories = {
    version:1,
    definitions:sourceCategories0737.map((category,index)=>({
      id:String(category?.id||`category-${index+1}`),
      name:String(category?.name||`Category ${index+1}`).trim()||`Category ${index+1}`,
      color:/^#[0-9a-f]{6}$/i.test(String(category?.color||""))?String(category.color):"#22c55e",
      enabled:category?.enabled!==false,
      match:category?.match==="any"?"any":"all",
      rules:(Array.isArray(category?.rules)?category.rules:[]).map((rule,ruleIndex)=>({
        id:String(rule?.id||`rule-${index+1}-${ruleIndex+1}`),
        field:["accountId","name","address","city","state","zip","deviceType","sourceGroup","panel","phone"].includes(rule?.field)?rule.field:"accountId",
        operator:["startsWith","contains","equals","endsWith","notContains","present","empty"].includes(rule?.operator)?rule.operator:"contains",
        value:String(rule?.value||"").trim()
      }))
    }))
  };
  data.syncState = {...(data.syncState||{}),schemaVersion:SECURITY_SCHEMA_VERSION,deviceId:deviceIdentity(),provider:data.settings.sync.provider,lastLocalSave:data.syncState?.lastLocalSave||"",lastSuccessfulSync:data.syncState?.lastSuccessfulSync||""};
  ensureSecurityFoundation0790(data);
  trimRecycleBin0790(data);
  const homeCardDefaults = {pinnedSites:{visible:true,behavior:"remember"},fieldFocus:{visible:true,behavior:"remember"},nearbyAccounts:{visible:true,behavior:"remember"},recentAccounts:{visible:true,behavior:"remember"}};
  data.settings.homeLayout = data.settings.homeLayout || {preset:"custom",cards:{}};
  data.settings.homeLayout.preset = data.settings.homeLayout.preset || "custom";
  data.settings.homeLayout.cards = data.settings.homeLayout.cards || {};
  Object.entries(homeCardDefaults).forEach(([key,defaults])=>{
    const current=data.settings.homeLayout.cards[key]||{};
    data.settings.homeLayout.cards[key]={visible:current.visible!==false,behavior:["remember","expanded","collapsed"].includes(current.behavior)?current.behavior:defaults.behavior};
  });
  data.sites.forEach(ensureSite);
  data.sites.forEach(site=>{
    (site.docs||[]).forEach(doc=>{
      const isPhoto=!!(doc.imageData||doc.photoData||/^image\//i.test(String(doc.mime||doc.mimeType||"")));
      const target=isPhoto?data.settings.fileStorage.photo:data.settings.fileStorage.document;
      doc.storageProvider=doc.storageProvider||target.provider||"local";
      doc.storageConnectionId=doc.storageConnectionId||target.connectionId||"";
      doc.storageFolder=doc.storageFolder||target.folder||`FireVault/${isPhoto?"Photos":"Documents"}`;
      doc.storageTargetId=doc.storageTargetId||`${doc.storageProvider}:${isPhoto?"photo":"document"}`;
      doc.storageStatus=doc.storageStatus||(doc.storageProvider==="local"?"local":"pending");
      doc.remoteFileId=doc.remoteFileId||"";
      doc.remoteRevision=doc.remoteRevision||"";
      doc.remoteUrl=doc.remoteUrl||"";
    });
  });
  data.sites.forEach(site=>migrateRecordTree(site,data,null));
  data.resources.forEach(item=>migrateRecordTree(item,data,null));
  hydrateVaultMediaFromCache(data);
  return data;
}
export function ensureSite(s){
  s.id = s.id || uid();
  s.visits = Array.isArray(s.visits) ? s.visits : [];
  s.knownIssues = Array.isArray(s.knownIssues) ? s.knownIssues : [];
  s.equipment = Array.isArray(s.equipment) ? s.equipment : [];
  s.contacts = Array.isArray(s.contacts) ? s.contacts : [];
  s.docs = Array.isArray(s.docs) ? s.docs : [];
  s.checklist = Array.isArray(s.checklist) ? s.checklist : [];
  s.deficiencies = Array.isArray(s.deficiencies) ? s.deficiencies : [];
  s.tasks = Array.isArray(s.tasks) ? s.tasks : [];
  s.reportDeliveries = Array.isArray(s.reportDeliveries) ? s.reportDeliveries : [];
  s.noteEntries = Array.isArray(s.noteEntries) ? s.noteEntries : [];
  s.locationPoints = Array.isArray(s.locationPoints) ? s.locationPoints : [];
  if(s.gps && (!Number.isFinite(Number(s.gps.lat)) || !Number.isFinite(Number(s.gps.lng)))) s.gps = null;
  return s;
}
export function fullAddress(s){ return [s.street, s.city, s.state, s.zip].filter(Boolean).join(", ") || s.address || "No address entered"; }
export function downloadBlob(filename, content, type="text/plain"){
  const blob = new Blob([content], {type});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob); a.download = filename; a.click();
  setTimeout(()=>URL.revokeObjectURL(a.href), 1500);
}
