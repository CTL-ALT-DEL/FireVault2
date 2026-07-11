export const BUILD = "0.62.0";
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
  return {total:rows.length,pending:rows.filter(x=>x?.sync?.status==="pending").length,synced:rows.filter(x=>x?.sync?.status==="synced").length,conflicts:rows.filter(x=>x?.sync?.status==="conflict"||x?.sync?.conflict).length,localOnly:rows.filter(x=>x?.sync?.status==="local").length};
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
  data.syncState={...(data.syncState||{}),schemaVersion:1,deviceId:deviceIdentity(),provider:data.settings?.sync?.provider||"onedrive",lastLocalSave:nowIso(),lastSuccessfulSync:data.syncState?.lastSuccessfulSync||""};
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
  data.syncState = {...(data.syncState||{}),schemaVersion:1,deviceId:deviceIdentity(),provider:data.settings.sync.provider,lastLocalSave:data.syncState?.lastLocalSave||"",lastSuccessfulSync:data.syncState?.lastSuccessfulSync||""};
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
