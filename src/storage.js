export const BUILD = "0.64.1";
export const KEY = "firevault_vault_build_030";
export const ACTIVE_JOB_KEY = "firevault_active_job_modular";
export const DEVICE_KEY = "firevault_device_identity_062";

export function deviceIdentity(){
  let id = localStorage.getItem(DEVICE_KEY);
  if(!id){ id = `device-${uid()}`; localStorage.setItem(DEVICE_KEY,id); }
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
export function loadData(){
  try{ const raw = localStorage.getItem(KEY); if(raw) return normalize(JSON.parse(raw)); }
  catch(err){ console.error("Load failed", err); }
  return normalize({sites:[], resources:[], breadcrumbs:[]});
}
export function saveData(data){
  let previous=null;
  try{ previous=JSON.parse(localStorage.getItem(KEY)||"null"); }catch{}
  normalize(data);
  const prevSites=new Map((previous?.sites||[]).map(x=>[x?.id,x]));
  data.sites.forEach(site=>migrateRecordTree(site,data,prevSites.get(site.id)));
  const prevResources=new Map((previous?.resources||[]).map(x=>[x?.id,x]));
  data.resources.forEach(item=>migrateRecordTree(item,data,prevResources.get(item.id)));
  data.syncState={...(data.syncState||{}),schemaVersion:3,deviceId:deviceIdentity(),provider:data.settings?.sync?.provider||"onedrive",lastLocalSave:nowIso(),lastSuccessfulSync:data.syncState?.lastSuccessfulSync||""};
  localStorage.setItem(KEY, JSON.stringify(data));
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
