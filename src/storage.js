export const BUILD = "0.75.3";
export const KEY = "firevault_vault_build_030";
export const ACTIVE_JOB_KEY = "firevault_active_job_modular";
export const DEVICE_KEY = "firevault_device_identity_062";

export const DEMO_MODE_KEY = "firevault_demo_mode_0738";
export const DEMO_VAULT_KEY = `${KEY}_demo_0738`; // legacy key; Build 0.73.9 no longer stores the demo vault here
let demoRuntimeVault0739 = null;
let runtimeDeviceIdentity0739 = "";

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
    knownIssues:[],reportDeliveries:[],locationPoints:[],createdAt:demoIso(300+index),modifiedAt:demoIso(index),modifiedBy:"Demo Technician",createdBy:"Demo Technician"
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
    routeLogs:[{id:"demo-route-01",date:demoDate(1),startedAt:demoIso(1,7),endedAt:demoIso(1,16),status:"Completed",events:[
      {id:"demo-route-event-01",type:"Start",note:"Demo route started",at:demoIso(1,7),lat:43.6150,lng:-116.2023},
      {id:"demo-route-event-02",type:"Arrived",note:"Boise River Medical Center",siteId:"demo-site-01",siteName:"Boise River Medical Center",at:demoIso(1,9),lat:43.6178,lng:-116.1970},
      {id:"demo-route-event-03",type:"Arrived",note:"Boise Tech Campus",siteId:"demo-site-07",siteName:"Boise Tech Campus — Building A",at:demoIso(1,12),lat:43.6120,lng:-116.2790},
      {id:"demo-route-event-04",type:"End",note:"Demo route completed",at:demoIso(1,16),lat:43.6150,lng:-116.2023}
    ]}],
    settings:{
      technician:{name:"Demo Technician",company:"Example Fire Protection",phone:"(208) 555-0100",email:"demo.tech@example.com",license:"DEMO-TECH-01",defaultRole:"Fire Alarm Technician"},
      app:{defaultScreen:"home",distanceUnit:"feet",theme:"dark",confirmDeletes:true,autoBackupReminder:true,compactMode:false,largeText:false,haptics:true,viewMode:"power"},
      visibility:{dailyRoute:true,library:true,reports:true,equipment:true,diagnostics:true,advancedGps:true,attention:true,routeReview:true,csvExports:true,backupRepair:true},
      theme:{name:"firevault-dark",accentColor:"#ef4444",highContrast:false,largeText:false,compactLayout:false,buttonStyle:"rounded",cardStyle:"glass"},
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
    syncState:{schemaVersion:3,lastLocalSave:demoIso(0),lastSuccessfulSync:"",activity:[{id:"demo-sync-01",type:"customer-csv-import",at:demoIso(2),technician:"Demo Technician",details:"20 fictional Boise accounts loaded for demonstration."}]}
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
  const payload={format:"firevault-auto-backup",formatVersion:1,build:BUILD,createdAt:stamp,reason,siteCount:vaultCount(value),data:value};
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
  delete clone.sync; delete clone.createdAt; delete clone.modifiedAt; delete clone.createdBy; delete clone.modifiedBy; delete clone.recordVersion; delete clone.deletedAt;
  return JSON.stringify(clone);
}
function syncMeta(record,data,previous){
  const now=nowIso(), tech=techIdentity(data), device=deviceIdentity();
  record.createdAt=record.createdAt||previous?.createdAt||now;
  record.createdBy=record.createdBy||previous?.createdBy||tech;
  record.modifiedAt=record.modifiedAt||previous?.modifiedAt||record.createdAt;
  record.modifiedBy=record.modifiedBy||previous?.modifiedBy||record.createdBy;
  record.recordVersion=Number(record.recordVersion||previous?.recordVersion||1);
  record.sync={status:record.sync?.status||previous?.sync?.status||"pending",deviceId:record.sync?.deviceId||previous?.sync?.deviceId||device,lastSyncedAt:record.sync?.lastSyncedAt||previous?.sync?.lastSyncedAt||"",remoteVersion:Number(record.sync?.remoteVersion||previous?.sync?.remoteVersion||0),conflict:!!(record.sync?.conflict||previous?.sync?.conflict)};
  if(previous && comparable(record)!==comparable(previous)){
    record.modifiedAt=now; record.modifiedBy=tech; record.recordVersion=Math.max(Number(previous.recordVersion||1)+1,record.recordVersion+1);
    record.sync.status="pending"; record.sync.deviceId=device; record.sync.conflict=false;
  }
}
const CHILD_ARRAYS=["visits","knownIssues","equipment","contacts","docs","checklist","deficiencies","tasks","reportDeliveries","noteEntries"];
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
  return {
    format:"firevault-shared-vault-package",formatVersion:1,appBuild:BUILD,exportedAt:nowIso(),deviceId:deviceIdentity(),
    technician:techIdentity(data),organization:data.settings?.sync?.organization||"",workspace:data.settings?.sync?.workspace||"FireVault Shared Vault",
    sites:(data.sites||[]).map(packageRecord),resources:(data.resources||[]).map(packageRecord)
  };
}
function contentKey(record){
  if(!record || typeof record!=="object") return "";
  const clone=JSON.parse(JSON.stringify(record));
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
  data.syncState={...(data.syncState||{}),schemaVersion:3,lastSuccessfulSync:when,lastImportedPackage:{exportedAt:pkg.exportedAt||"",deviceId:pkg.deviceId||"",technician:pkg.technician||"",workspace:pkg.workspace||""}};
  recordSyncActivity(data,"package-import",{workspace:pkg.workspace||"",fromDevice:pkg.deviceId||"",fromTechnician:pkg.technician||"",stats:{...stats}});
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
  const candidates=[];
  try{
    [KEY,RECOVERY_KEY].forEach(key=>{const c=parseVaultCandidate(localStorage.getItem(key),key);if(c)candidates.push(c);});
    for(let i=0;i<localStorage.length;i++){
      const key=localStorage.key(i)||"";
      if(!key.toLowerCase().includes("firevault") || key===KEY || key===RECOVERY_KEY || key===DEMO_VAULT_KEY || key.toLowerCase().includes("_demo_")) continue;
      const c=parseVaultCandidate(localStorage.getItem(key),key); if(c)candidates.push(c);
    }
  }catch(err){console.error("Vault recovery scan failed",err);}
  candidates.sort((a,b)=>b.count-a.count || String(b.updated).localeCompare(String(a.updated)));
  return candidates[0]||null;
}
export function loadData(){
  let demoActive=isDemoMode();
  let best=null;
  if(!demoActive) best=recoverBestLocalVault();

  // Build 0.74.1: when no real customer vault exists, FireVault opens the
  // protected fictional Boise workspace instead of presenting an empty app.
  // The demo master is generated in code and is never stored as a deletable vault.
  if(!demoActive && !best){
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
    const loaded=normalize(best.value);
    createAutoBackupSnapshot(loaded,"startup");
    return loaded;
  }
  return normalize({sites:[], resources:[], breadcrumbs:[]});
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
    data.syncState={...(data.syncState||{}),schemaVersion:3,deviceId:deviceIdentity(),provider:data.settings?.sync?.provider||"onedrive",lastLocalSave:nowIso(),lastSuccessfulSync:data.syncState?.lastSuccessfulSync||""};
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
  const prevSites=new Map((previous?.sites||[]).map(x=>[x?.id,x]));
  data.sites.forEach(site=>migrateRecordTree(site,data,prevSites.get(site.id)));
  const prevResources=new Map((previous?.resources||[]).map(x=>[x?.id,x]));
  data.resources.forEach(item=>migrateRecordTree(item,data,prevResources.get(item.id)));
  data.syncState={...(data.syncState||{}),schemaVersion:3,deviceId:deviceIdentity(),provider:data.settings?.sync?.provider||"onedrive",lastLocalSave:nowIso(),lastSuccessfulSync:data.syncState?.lastSuccessfulSync||""};
  const serialized=JSON.stringify(data);
  try{
    localStorage.setItem(KEY,serialized);
  }catch(err){
    const index=readAutoBackupIndex();
    index.slice().reverse().forEach(item=>{try{localStorage.removeItem(item.key);}catch{}});
    writeAutoBackupIndex([]);
    localStorage.setItem(KEY,serialized);
  }
  createAutoBackupSnapshot(data,"automatic");
}
export function normalize(data){
  data.sites = Array.isArray(data.sites) ? data.sites : [];
  data.resources = Array.isArray(data.resources) ? data.resources : [];
  data.resourceFolders = Array.isArray(data.resourceFolders) ? data.resourceFolders : ["Manuals","Forms","Links","Codes"];
  if(!data.resourceFolders.length) data.resourceFolders = ["Manuals","Forms","Links","Codes"];
  data.breadcrumbs = Array.isArray(data.breadcrumbs) ? data.breadcrumbs : [];
  data.routeLogs = Array.isArray(data.routeLogs) ? data.routeLogs : [];
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
  data.settings.technician = data.settings.technician || {name:"", company:"", phone:"", email:"", license:"", defaultRole:"Fire Alarm Technician"};
  data.settings.notifications = data.settings.notifications || {dailyReminder:false, reminderTime:"07:30", taskAlerts:true, inspectionAlerts:true, gpsPrompts:true};
  data.settings.reports = data.settings.reports || {title:"FireVault Service Report", includeTechnician:true, includePhotos:true, includeMapLink:true, includeDeficiencies:true, includeTasks:true, format:"detailed"};
  data.settings.pdf = data.settings.pdf || {paperSize:"Letter", orientation:"Portrait", photoSize:"Medium", includeLogo:true, footerText:"Generated by FireVault"};
  data.settings.email = data.settings.email || {defaultTo:"", cc:"", subjectPrefix:"FireVault Report", defaultSubject:"FireVault Report - {site_name} - {date}", signature:"{technician}\n{company}\n{phone}\n{email}"};
  data.settings.app = data.settings.app || {defaultScreen:"home", distanceUnit:"feet", theme:"dark", confirmDeletes:true, autoBackupReminder:true, compactMode:false, largeText:false, haptics:true, viewMode:"simple"};
  data.settings.app.haptics = data.settings.app.haptics !== false;
  data.settings.app.viewMode = data.settings.app.viewMode || "simple";
  const featureDefaults = {dailyRoute:true, library:false, reports:false, equipment:false, diagnostics:false, advancedGps:true, attention:false, routeReview:false, csvExports:false, backupRepair:false};
  data.settings.visibility = {...featureDefaults, ...(data.settings.visibility || {})};
  data.settings.theme = data.settings.theme || {name:"firevault-dark", accentColor:"#ef4444", highContrast:false, largeText:false, compactLayout:false, buttonStyle:"rounded", cardStyle:"glass"};
  data.settings.advanced = data.settings.advanced || {aiTechnician:false, reverseAddressLookup:false, cloudBackup:false, voiceTranscription:false, ocrReader:false, emailGateway:false, weather:false, traffic:false};
  data.settings.gps = {enabled:true, mapProvider:"apple", highAccuracy:true, includeInReports:true, nearbyRadiusMiles:1, ...(data.settings.gps || {})};
  data.settings.sync = {provider:"onedrive",enabled:false,organization:"",workspace:"FireVault Shared Vault",autoSync:true,wifiOnly:false,conflictPolicy:"review",...(data.settings.sync||{})};
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
  data.syncState = {...(data.syncState||{}),schemaVersion:3,deviceId:deviceIdentity(),provider:data.settings.sync.provider,lastLocalSave:data.syncState?.lastLocalSave||"",lastSuccessfulSync:data.syncState?.lastSuccessfulSync||""};
  const homeCardDefaults = {pinnedSites:{visible:true,behavior:"remember"},fieldFocus:{visible:true,behavior:"remember"},nearbyAccounts:{visible:true,behavior:"remember"},recentAccounts:{visible:true,behavior:"remember"}};
  data.settings.homeLayout = data.settings.homeLayout || {preset:"custom",cards:{}};
  data.settings.homeLayout.preset = data.settings.homeLayout.preset || "custom";
  data.settings.homeLayout.cards = data.settings.homeLayout.cards || {};
  Object.entries(homeCardDefaults).forEach(([key,defaults])=>{
    const current=data.settings.homeLayout.cards[key]||{};
    data.settings.homeLayout.cards[key]={visible:current.visible!==false,behavior:["remember","expanded","collapsed"].includes(current.behavior)?current.behavior:defaults.behavior};
  });
  data.sites.forEach(ensureSite);
  data.sites.forEach(site=>migrateRecordTree(site,data,null));
  data.resources.forEach(item=>migrateRecordTree(item,data,null));
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
