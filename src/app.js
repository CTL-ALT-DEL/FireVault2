import { BUILD, KEY, ACTIVE_JOB_KEY, loadData, saveData, ensureSite, fullAddress, esc, uid, downloadBlob } from "./storage.js";

let data = loadData();
let view = new URLSearchParams(location.search).get("route") || data.settings.app?.defaultScreen || "home";
let selectedSiteId = null;
let mode = null;
let settingsTab = "tech";
let settingsRailScroll = 0;
let lastEmailTemplateField = "emailSubject";
let taskFilter = "open";
let deficiencyFilter = "open";
let activeJob = loadActiveJob();
let activeRoute = loadActiveRoute();
let nearbyState = null;
let siteSearch = "";
let libraryFolder = "all";
let routeReviewId = "";
let routeHistorySearch = "";
let simpleToolsOpen = false;
let jobTimer = null;
const QUICK_EVENTS = ["Arrived on site","Opened panel","Panel normal","Trouble active","Ground fault active","Device tested","Customer update","Parts needed"];
const DEFAULT_CHECKLIST = [
  ["Panel", "Panel normal / no active troubles"],
  ["Panel", "AC power normal and cabinet secure"],
  ["Panel", "Batteries present, dated, and visually OK"],
  ["Signals", "Monitoring / communicator signal path verified"],
  ["Devices", "Sample initiating devices tested"],
  ["Notification", "Audible / visual notification verified"],
  ["Documentation", "Customer notified of status"],
  ["Wrap-Up", "Panel restored and left normal"]
];
const EMAIL_TAGS = [
  ["{site_name}","Site"], ["{date}","Date"], ["{technician}","Tech"],
  ["{company}","Company"], ["{phone}","Phone"], ["{email}","Email"]
];
const REPORT_SECTION_KEY = "firevault_report_section_prefs";
let reportSectionPrefs = loadReportSectionPrefs();
const appEl = document.getElementById("app");
const themePresets = {
  "firevault-dark": {label:"FireVault Dark", accentColor:"#ef4444"},
  "fire-red": {label:"Fire Red", accentColor:"#ef4444"},
  "industrial-blue": {label:"Industrial Blue", accentColor:"#38bdf8"},
  "night-shift": {label:"Night Shift", accentColor:"#f59e0b"},
  "high-contrast": {label:"High Contrast", accentColor:"#facc15", highContrast:true},
  "amoled-black": {label:"AMOLED Black", accentColor:"#ef4444"}
};

const FEATURE_DEFAULTS = {dailyRoute:true, library:false, reports:false, equipment:false, diagnostics:false, advancedGps:false, attention:false, routeReview:false, csvExports:false, backupRepair:false};
const FEATURE_LABELS = [
  ["dailyRoute","Daily Route","Route day logging, active route card, waypoint tools, and saved route days."],
  ["advancedGps","Advanced GPS","GPS / Maps dashboard tools, nearby site detection, and GPS capture cards."],
  ["attention","Attention Queue","Priority review shortcut for open tasks, deficiencies, and site health warnings."],
  ["library","Library","Global library tab for manuals, links, forms, codes, and folders."],
  ["reports","Report Center","Site report tools, report delivery actions, and generated report packages."],
  ["equipment","Equipment Vault","Panel, communicator, power supply, and equipment inventory screens."],
  ["routeReview","Route Review Panels","Expandable saved Daily Route review panels and compact waypoint timelines."],
  ["csvExports","CSV / Export Tools","CSV route exports and advanced export buttons."],
  ["diagnostics","Diagnostics","Stability checkpoint, repair tools, and technical vault health details."],
  ["backupRepair","Backup / Repair","Backup center, import/export, repair, and danger-zone tools."]
];
function appMode(){ return data.settings.app?.viewMode || "simple"; }
function visibility(){ data.settings.visibility = {...FEATURE_DEFAULTS, ...(data.settings.visibility || {})}; return data.settings.visibility; }
function featureOn(key){
  const mode=appMode();
  const v=visibility();
  if(mode === "power") return true;
  if(mode === "advanced") return v[key] !== false;
  return v[key] === true;
}
function featureClass(key, extra=""){ return `${extra||""}${featureOn(key)?"":" featureHidden472"}`.trim(); }
function hiddenIf(condition){ return condition ? " featureHidden472" : ""; }
function applyFeatureVisibility(){
  const mode=appMode();
  document.body.classList.toggle("view-simple472", mode === "simple");
  document.body.classList.toggle("view-advanced472", mode === "advanced");
  document.body.classList.toggle("view-power472", mode === "power");
  const navLibrary=document.getElementById("nav-library");
  if(navLibrary) navLibrary.style.display = featureOn("library") ? "" : "none";
}
function setViewMode(mode){ data.settings.app={...(data.settings.app||{}),viewMode:mode}; save(); toast(`${mode === "power" ? "Technician Power Mode" : mode === "advanced" ? "Advanced View" : "Simple View"} enabled.`); route("home"); }

function hiddenFeatureCount473(){ return FEATURE_LABELS.filter(([key])=>!featureOn(key)).length; }
function simpleToolRows473(){
  return [
    ["dailyRoute","Daily Route","routeLog","Route day logging and saved route reports."],
    ["advancedGps","GPS / Nearby","sites","GPS capture, map links, and nearby site detection."],
    ["attention","Attention Queue","attention","Priority review list for sites needing attention."],
    ["library","Library","library","Manuals, links, forms, codes, and folders."],
    ["reports","Reports","sites","Enable reports, then open a site and tap Report."],
    ["equipment","Equipment","sites","Enable equipment, then open a site vault."],
    ["diagnostics","Diagnostics","diagnostics","Stability checkpoint and repair tools."],
    ["backupRepair","Backup / Repair","settings","Backup, import/export, and vault safety tools."]
  ];
}
function simpleToolsMarkup473(){
  const hidden=hiddenFeatureCount473();
  return `<div class="card simpleToolsCard473">
    <button class="simpleToolsToggle473" id="simpleMoreBtn473"><span><strong>More Tools</strong><small>${hidden} hidden feature${hidden===1?"":"s"} available</small></span><em>${simpleToolsOpen?"Hide":"Show"}</em></button>
    ${simpleToolsOpen?`<div class="simpleToolsDrawer473">${simpleToolRows473().map(([key,label,target,note])=>`<button class="ghost simpleToolBtn473 ${featureOn(key)?"enabled":""}" data-simple-feature="${esc(key)}" data-simple-target="${esc(target)}"><strong>${esc(label)}</strong><small>${featureOn(key)?"Visible now":esc(note)}</small></button>`).join("")}</div>`:""}
  </div>`;
}
function enableSimpleFeature473(feature,target){
  visibility()[feature]=true;
  save();
  if(target==="settings"){
    settingsTab = feature === "backupRepair" ? "backup" : "visibility";
    mode="settingsDetail";
    toast(`${featureLabel473(feature)} enabled.`);
    route("settings");
    return;
  }
  if(feature === "reports" || feature === "equipment") toast(`${featureLabel473(feature)} enabled. Open a site to use it.`);
  else toast(`${featureLabel473(feature)} enabled.`);
  route(target);
}
function featureLabel473(feature){ return (FEATURE_LABELS.find(([k])=>k===feature)||[feature,feature])[1]; }


const FEATURE_PRESETS_474 = {
  minimal:{label:"Minimal Daily", mode:"simple", icon:"◯", note:"Clean dashboard for basic sites and today’s route.", features:{dailyRoute:true, advancedGps:false, attention:false, library:false, reports:false, equipment:false, routeReview:false, csvExports:false, diagnostics:false, backupRepair:false}},
  route:{label:"Route Logger", mode:"simple", icon:"◇", note:"Daily Route plus GPS / nearby tools.", features:{dailyRoute:true, advancedGps:true, attention:false, library:false, reports:false, equipment:false, routeReview:true, csvExports:false, diagnostics:false, backupRepair:false}},
  service:{label:"Service Tech", mode:"advanced", icon:"▣", note:"Sites, reports, equipment, GPS, and attention tools.", features:{dailyRoute:true, advancedGps:true, attention:true, library:false, reports:true, equipment:true, routeReview:false, csvExports:false, diagnostics:false, backupRepair:false}},
  inspection:{label:"Inspector", mode:"advanced", icon:"▤", note:"Reports, equipment, route review, library, and export tools.", features:{dailyRoute:true, advancedGps:true, attention:true, library:true, reports:true, equipment:true, routeReview:true, csvExports:true, diagnostics:false, backupRepair:false}},
  power:{label:"Power Mode", mode:"power", icon:"⚡", note:"Show every FireVault module and advanced control.", features:{dailyRoute:true, advancedGps:true, attention:true, library:true, reports:true, equipment:true, routeReview:true, csvExports:true, diagnostics:true, backupRepair:true}}
};
function visibilityPresetCards474(){
  return `<div class="card settingGroup compactPane featurePresets474"><div class="paneHead"><div><h2>Quick View Presets</h2><p class="paneNote">One tap changes the app mode and visible features. You can still fine-tune each toggle below.</p></div></div><div class="presetGrid474">${Object.entries(FEATURE_PRESETS_474).map(([key,p])=>`<button class="ghost presetFeatureBtn474" data-feature-preset="${esc(key)}"><span>${esc(p.icon)}</span><strong>${esc(p.label)}</strong><small>${esc(p.note)}</small></button>`).join("")}</div></div>`;
}
function applyFeaturePreset474(name){
  const p=FEATURE_PRESETS_474[name];
  if(!p){ toast("Preset unavailable."); return; }
  data.settings.app={...(data.settings.app||{}),viewMode:p.mode};
  data.settings.visibility={...FEATURE_DEFAULTS,...p.features};
  save();
  toast(`${p.label} preset applied.`);
  settings();
}
function currentPresetName474(){
  const mode=appMode();
  const v=visibility();
  const keys=Object.keys(FEATURE_DEFAULTS);
  const found=Object.values(FEATURE_PRESETS_474).find(p=>p.mode===mode && keys.every(k=>(p.features[k]===true)===(v[k]===true)));
  return found?.label || (mode === "power" ? "Power Mode" : mode === "advanced" ? "Custom Advanced" : "Custom Simple");
}


applyTheme();
document.getElementById("buildButton").addEventListener("click", showChangelog);
document.querySelectorAll("nav button").forEach(btn => btn.addEventListener("click", () => route(btn.dataset.route)));
window.addEventListener("error", e => showError(e.error || e.message));
window.addEventListener("unhandledrejection", e => showError(e.reason || e));

function save(){ saveData(data); applyTheme(); }
function site(){ return data.sites.find(s => s.id === selectedSiteId); }
function val(id){ return document.getElementById(id)?.value?.trim() || ""; }
function raw(id){ return document.getElementById(id)?.value || ""; }
function checked(id){ return !!document.getElementById(id)?.checked; }
function route(v){
  if(v === "library" && !featureOn("library")){ toast("Library is hidden in Simple View. Turn it on in Settings → Simple View."); v="home"; }
  if(v === "diagnostics" && !featureOn("diagnostics")){ toast("Diagnostics is hidden in Simple View. Turn it on in Settings → Simple View."); v="settings"; }
  if((v === "report") && !featureOn("reports")){ toast("Reports are hidden in Simple View."); v="siteDetail"; }
  if(["equipmentList","equipmentForm"].includes(v) && !featureOn("equipment")){ toast("Equipment Vault is hidden in Simple View."); v="siteDetail"; }
  if((v === "nearbySites") && !featureOn("advancedGps")){ toast("Advanced GPS is hidden in Simple View."); v="home"; }
  if((v === "routeLog") && !activeRoute && !featureOn("dailyRoute")){ toast("Daily Route is hidden in Simple View."); v="home"; }
  view = v; mode = null; render();
}
function html(content){ appEl.innerHTML = content; }
function toast(msg){ const t=document.createElement("div"); t.className="toast"; t.textContent=msg; document.body.appendChild(t); setTimeout(()=>t.remove(),1800); }
function haptic(ms=12){
  if(data.settings.app?.haptics === false) return;
  try{ if(navigator.vibrate) navigator.vibrate(ms); }catch{}
}
document.addEventListener("pointerup", e=>{
  const target=e.target.closest?.("button,.btn,label.checkRow,input[type=checkbox],select");
  if(target) haptic(target.classList?.contains("primary") ? 18 : 10);
}, {passive:true});

function hasGps(s){
  return !!(s && s.gps && Number.isFinite(Number(s.gps.lat)) && Number.isFinite(Number(s.gps.lng)));
}
function gpsLine(s){
  if(!hasGps(s)) return "No GPS coordinates saved.";
  const g=s.gps;
  const acc=Number.isFinite(Number(g.accuracy)) && Number(g.accuracy)>0 ? ` • Accuracy ±${Math.round(Number(g.accuracy))} m` : "";
  const when=g.capturedAt ? ` • Saved ${new Date(g.capturedAt).toLocaleString([], {month:"short",day:"numeric",hour:"numeric",minute:"2-digit"})}` : "";
  return `${Number(g.lat).toFixed(6)}, ${Number(g.lng).toFixed(6)}${acc}${when}`;
}
function mapQuery(s){ return hasGps(s) ? `${Number(s.gps.lat).toFixed(6)},${Number(s.gps.lng).toFixed(6)}` : fullAddress(s); }
function mapUrl(s, provider){
  const q=encodeURIComponent(mapQuery(s));
  return provider === "google" ? `https://www.google.com/maps/search/?api=1&query=${q}` : `https://maps.apple.com/?q=${q}`;
}
function gpsOptions(){ const g=data.settings.gps||{}; return {enableHighAccuracy:g.highAccuracy!==false,timeout:15000,maximumAge:60000}; }
function captureGpsForSite(){
  const s=site();
  if(!s){ toast("Open a saved site first."); return; }
  if(data.settings.gps?.enabled===false){ toast("GPS tools are hidden in Settings."); return; }
  if(!navigator.geolocation){ toast("GPS is not available in this browser."); return; }
  toast("Requesting GPS location...");
  navigator.geolocation.getCurrentPosition(pos=>{
    s.gps={lat:Number(pos.coords.latitude.toFixed(6)),lng:Number(pos.coords.longitude.toFixed(6)),accuracy:Math.round(pos.coords.accuracy || 0),capturedAt:new Date().toISOString()};
    save(); toast("GPS saved to site."); render();
  },err=>toast("GPS failed: " + (err.message || "permission denied")),gpsOptions());
}
function captureGpsIntoForm(){
  if(!navigator.geolocation){ toast("GPS is not available in this browser."); return; }
  toast("Requesting GPS location...");
  navigator.geolocation.getCurrentPosition(pos=>{
    const lat=document.getElementById("gpsLat"), lng=document.getElementById("gpsLng"), acc=document.getElementById("gpsAccuracy"), at=document.getElementById("gpsCapturedAt");
    if(lat) lat.value=Number(pos.coords.latitude.toFixed(6));
    if(lng) lng.value=Number(pos.coords.longitude.toFixed(6));
    if(acc) acc.value=Math.round(pos.coords.accuracy || 0);
    if(at) at.value=new Date().toISOString();
    toast("GPS captured. Save the site to keep it.");
  },err=>toast("GPS failed: " + (err.message || "permission denied")),gpsOptions());
}

function distanceMeters(lat1,lng1,lat2,lng2){
  const R=6371000;
  const toRad=v=>Number(v)*Math.PI/180;
  const dLat=toRad(lat2-lat1), dLng=toRad(lng2-lng1);
  const a=Math.sin(dLat/2)**2 + Math.cos(toRad(lat1))*Math.cos(toRad(lat2))*Math.sin(dLng/2)**2;
  return 2*R*Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}
function nearbyRadiusMiles(){
  const r=Number(data.settings.gps?.nearbyRadiusMiles);
  return Number.isFinite(r) && r>0 ? r : 1;
}
function distanceLabel(m){
  const miles=m/1609.344;
  if(miles<0.2) return `${Math.round(m*3.28084)} ft`;
  if(miles<10) return `${miles.toFixed(1)} mi`;
  return `${Math.round(miles)} mi`;
}
function gpsSiteDistances(lat,lng){
  return data.sites.filter(hasGps).map(s=>({s,meters:distanceMeters(lat,lng,Number(s.gps.lat),Number(s.gps.lng))})).sort((a,b)=>a.meters-b.meters);
}
function siteHealth(s){
  ensureSite(s);
  const openTasks=(s.tasks||[]).filter(t=>!taskIsDone(t));
  const overdue=openTasks.filter(t=>taskDueState(t)==="overdue").length;
  const dueToday=openTasks.filter(t=>taskDueState(t)==="today").length;
  const openDef=(s.deficiencies||[]).filter(d=>(d.status||"Open")!=="Closed");
  const critical=openDef.filter(d=>(d.priority||"").toLowerCase()==="critical").length;
  const equipmentIssues=(s.equipment||[]).filter(e=>/(needs|issue|trouble|fail|offline|attention)/i.test(e.status||"")).length;
  const missingGps=!hasGps(s);
  let score=100;
  score-=Math.min(40, overdue*14);
  score-=Math.min(30, openDef.length*10);
  score-=Math.min(24, equipmentIssues*12);
  score-=Math.min(12, dueToday*4);
  if(missingGps) score-=5;
  score=Math.max(0, Math.round(score));
  let label="Normal";
  let cls="healthOk";
  if(critical || overdue || equipmentIssues){ label="Attention"; cls="healthWarn"; }
  else if(openDef.length || openTasks.length || dueToday){ label="Watch"; cls="healthWatch"; }
  else if(missingGps){ label="GPS Needed"; cls="healthInfo"; }
  const details=[];
  if(overdue) details.push(`${overdue} overdue task${overdue===1?"":"s"}`);
  if(dueToday) details.push(`${dueToday} due today`);
  if(openDef.length) details.push(`${openDef.length} open deficienc${openDef.length===1?"y":"ies"}`);
  if(equipmentIssues) details.push(`${equipmentIssues} equipment issue${equipmentIssues===1?"":"s"}`);
  if(missingGps) details.push("GPS missing");
  if(!details.length) details.push("No open issues detected");
  return {score,label,cls,details,openTasks:openTasks.length,overdue,dueToday,openDef:openDef.length,equipmentIssues,missingGps};
}
function siteHealthLine(s){
  const h=siteHealth(s);
  return `${h.label} • ${h.score}% • ${h.details.slice(0,2).join(" • ")}`;
}
function siteSnapshotText(s){
  ensureSite(s);
  const h=siteHealth(s);
  const contacts=(s.contacts||[]).slice(0,4).map(c=>`- ${contactTitle(c)}${c.phone?` | ${c.phone}`:""}${c.email?` | ${c.email}`:""}${c.accessNotes?` | Access: ${String(c.accessNotes).replaceAll("\n"," / ")}`:""}`);
  const openTasks=(s.tasks||[]).filter(t=>!taskIsDone(t)).slice(0,6).map(t=>`- ${t.title||"Task"}${t.due?` | Due ${t.due}`:""}${t.source?` | ${t.source}`:""}`);
  const openDef=(s.deficiencies||[]).filter(d=>(d.status||"Open")!=="Closed").slice(0,6).map(d=>`- ${d.title||d.device||"Deficiency"}${d.priority?` | ${d.priority}`:""}${d.notes?` | ${String(d.notes).replaceAll("\n"," / ")}`:""}`);
  const equipIssues=(s.equipment||[]).filter(e=>/(needs|issue|trouble|fail|offline|attention)/i.test(e.status||"")).slice(0,6).map(e=>`- ${equipmentTitle(e)} | ${e.status||"Needs Attention"}${e.location?` | ${e.location}`:""}`);
  const docs=(s.docs||[]).slice(0,4).map(d=>`- ${docTitle(d)}${d.ref?` | ${d.ref}`:""}${d.url?` | ${d.url}`:""}`);
  const lines=[
    `FIREVAULT SITE SNAPSHOT`,
    `Site: ${s.name||"Unnamed Site"}`,
    `Address: ${fullAddress(s)}`,
    `Panel: ${[s.panelManufacturer,s.panelModel].filter(Boolean).join(" ")||"Not entered"}`,
    `Health: ${h.label} ${h.score}% - ${h.details.join("; ")}`,
    `GPS: ${gpsLine(s)}`,
    `Maps: ${mapUrl(s, data.settings.gps?.mapProvider==="google" ? "google" : "apple")}`,
    ``,
    `CONTACTS / ACCESS`,
    ...(contacts.length?contacts:["- None saved"]),
    ``,
    `OPEN TASKS`,
    ...(openTasks.length?openTasks:["- None"]),
    ``,
    `OPEN DEFICIENCIES`,
    ...(openDef.length?openDef:["- None"]),
    ``,
    `EQUIPMENT ATTENTION`,
    ...(equipIssues.length?equipIssues:["- None"]),
    ``,
    `DOCUMENTS / LINKS`,
    ...(docs.length?docs:["- None saved"]),
    ``,
    `SITE NOTES`,
    s.notes || "No notes entered.",
    ``,
    `Generated by FireVault Build ${BUILD} on ${new Date().toLocaleString()}`
  ];
  return lines.join("\n");
}
async function shareSiteSnapshot(){
  const s=site(); if(!s){ route("sites"); return; }
  const text=siteSnapshotText(s);
  try{
    if(navigator.share){ await navigator.share({title:`FireVault - ${s.name||"Site Snapshot"}`, text}); toast("Snapshot shared."); return; }
  }catch(err){ if(err?.name === "AbortError") return; }
  try{ await navigator.clipboard.writeText(text); toast("Snapshot copied."); }
  catch{ toast("Snapshot ready, but clipboard is unavailable."); }
}

function attentionRows(){
  return data.sites.map(s=>{
    const h=siteHealth(s);
    const openTasks=(s.tasks||[]).filter(t=>!taskIsDone(t));
    const openDef=(s.deficiencies||[]).filter(d=>(d.status||"Open")!=="Closed");
    const equipmentIssues=(s.equipment||[]).filter(e=>/(needs|issue|trouble|fail|offline|attention)/i.test(e.status||""));
    const needsAttention=h.cls!=="healthOk" || openTasks.length || openDef.length || equipmentIssues.length || h.missingGps;
    return {s,h,openTasks,openDef,equipmentIssues,needsAttention};
  }).filter(r=>r.needsAttention).sort((a,b)=>{
    const rank={healthWarn:0,healthWatch:1,healthInfo:2,healthOk:3};
    return (rank[a.h.cls]??4)-(rank[b.h.cls]??4) || a.h.score-b.h.score || (a.s.name||"").localeCompare(b.s.name||"");
  });
}

function attentionActionLine(r){
  const parts=[];
  if(r.h.overdue) parts.push(`${r.h.overdue} overdue`);
  if(r.h.dueToday) parts.push(`${r.h.dueToday} due today`);
  if(r.openDef.length) parts.push(`${r.openDef.length} deficienc${r.openDef.length===1?"y":"ies"}`);
  if(r.equipmentIssues.length) parts.push(`${r.equipmentIssues.length} equipment issue${r.equipmentIssues.length===1?"":"s"}`);
  if(r.h.missingGps) parts.push("GPS needed");
  return parts.join(" • ") || "Review site details";
}

function checklistStats(s){
  const items=Array.isArray(s?.checklist) ? s.checklist : [];
  const total=items.length;
  const ok=items.filter(i=>i.status==="OK").length;
  const issue=items.filter(i=>i.status==="Issue").length;
  const na=items.filter(i=>i.status==="N/A").length;
  const pending=Math.max(0,total-ok-issue-na);
  const done=ok+issue+na;
  const progress=total ? Math.round((done/total)*100) : 0;
  return {total,ok,issue,na,pending,progress};
}
function checklistItemClass(item){
  if(item.status==="OK") return "checkOk";
  if(item.status==="Issue") return "checkIssue";
  if(item.status==="N/A") return "checkNa";
  return "checkPending";
}
function seedChecklist(s){
  ensureSite(s);
  if(!Array.isArray(s.checklist)) s.checklist=[];
  if(s.checklist.length) return false;
  s.checklist = DEFAULT_CHECKLIST.map(([category,label])=>({id:uid(),category,label,status:"Pending",notes:"",createdAt:new Date().toISOString()}));
  return true;
}
function checklistReportBlock(s){
  const items=Array.isArray(s.checklist) ? s.checklist : [];
  if(!items.length) return "No checklist saved";
  return items.map(i=>`- ${i.status||"Pending"}: ${i.category?`${i.category} - `:""}${i.label||"Checklist item"}${i.notes?` | ${String(i.notes).replaceAll("\n"," / ")}`:""}`).join("\n");
}
function checklistInspectionNote(s){
  const stats=checklistStats(s);
  const parts=[`${stats.progress}% complete`, `${stats.ok} OK`, `${stats.issue} issue${stats.issue===1?"":"s"}`, `${stats.na} N/A`, `${stats.pending} pending`];
  return `Inspection checklist completed • ${parts.join(" • ")}`;
}
function checklistLastSavedLine(s){
  if(!s?.lastInspectionAt) return "No completed inspection saved yet.";
  const when=new Date(s.lastInspectionAt).toLocaleString([], {month:"short",day:"numeric",hour:"numeric",minute:"2-digit"});
  const issue=Number(s.lastInspectionIssues||0);
  return `Last saved ${when} • ${Number(s.lastInspectionProgress||0)}% complete • ${issue} issue${issue===1?"":"s"}`;
}
function completeChecklistInspection(){
  const s=site(); if(!s) return;
  seedChecklist(s);
  const stats=checklistStats(s);
  const defaultNote = stats.issue ? `${stats.issue} checklist issue${stats.issue===1?"":"s"} found. Deficiencies created where needed.` : "Checklist completed. Site left normal.";
  const note=prompt("Inspection completion note:", defaultNote);
  if(note===null) return;
  const now=new Date().toISOString();
  s.visits = Array.isArray(s.visits) ? s.visits : [];
  s.visits.unshift({
    id:uid(),
    type:"Inspection Checklist",
    startedAt:now,
    endedAt:now,
    notes:[note, "", checklistInspectionNote(s), "", "Checklist Summary", checklistReportBlock(s)].join("\n"),
    events:[{time:now,note:"Inspection checklist completed"}],
    checklistStats:{...stats},
    createdAt:now
  });
  s.lastInspectionAt=now;
  s.lastInspectionProgress=stats.progress;
  s.lastInspectionIssues=stats.issue;
  save();
  toast("Inspection saved to Visit History.");
  route("siteDetail");
}
function startNewChecklistRound(){
  const s=site(); if(!s) return;
  if(!confirm("Start a new checklist round? This clears OK / Issue / N/A status but keeps your checklist items and notes.")) return;
  seedChecklist(s);
  (s.checklist||[]).forEach(item=>{ item.status="Pending"; delete item.checkedAt; });
  save();
  toast("Checklist round reset.");
  render();
}
function createDeficiencyFromChecklist(s,item){
  ensureSite(s);
  const exists=(s.deficiencies||[]).some(d=>d.checklistId===item.id && (d.status||"Open")!=="Closed");
  if(exists) return;
  s.deficiencies.unshift({
    id:uid(),
    title:`Checklist issue: ${item.label||"Inspection item"}`,
    priority:"High",
    status:"Open",
    notes:[`Created from Inspection Checklist on ${fmtDate()}.`, item.category?`Category: ${item.category}`:"", item.notes?`Notes: ${item.notes}`:""].filter(Boolean).join("\n"),
    checklistId:item.id,
    createdAt:new Date().toISOString()
  });
}
function setChecklistStatus(itemId,status){
  const s=site(); if(!s) return;
  const item=(s.checklist||[]).find(i=>i.id===itemId);
  if(!item) return;
  item.status=status;
  item.checkedAt=new Date().toISOString();
  if(status==="Issue"){
    const note=prompt("Issue note for this checklist item:", item.notes || "Needs follow-up.");
    if(note !== null) item.notes=note;
    createDeficiencyFromChecklist(s,item);
    toast("Issue flagged and deficiency created.");
  }else{
    toast(`Checklist marked ${status}.`);
  }
  save(); render();
}
function checklist(){
  const s=site(); if(!s){ route("sites"); return; }
  const seeded=seedChecklist(s);
  if(seeded) save();
  const stats=checklistStats(s);
  html(`<div class="screen checklistScreen"><div class="row"><button class="back ghost" id="backBtn">←</button><div><h1>Inspection Checklist</h1><p>${esc(s.name||"Site")}</p></div><button class="primary smallBtn" id="addCheckItemBtn">＋</button></div>
    <div class="card checklistHero"><div><strong>${stats.progress}%</strong><span>Complete</span></div><div><strong>${stats.ok}</strong><span>OK</span></div><div><strong>${stats.issue}</strong><span>Issues</span></div><div><strong>${stats.pending}</strong><span>Pending</span></div></div>
    <div class="card checklistTools"><p>Tap OK, Issue, or N/A as you work. Issue automatically creates an open deficiency so it shows in Site Health, Attention Queue, and reports.</p><p class="fieldNote">${esc(checklistLastSavedLine(s))}</p><div class="checkToolButtons"><button class="primary smallBtn completeInspectionBtn" id="completeChecklistBtn">Complete Inspection</button><button class="ghost smallBtn" id="newChecklistRoundBtn">New Round</button><button class="ghost smallBtn" id="copyChecklistBtn">Copy Summary</button><button class="ghost smallBtn" id="resetChecklistBtn">Reset Defaults</button></div></div>
    <div class="list grow checklistList">${s.checklist.length?s.checklist.map(item=>`<div class="card checkItem ${checklistItemClass(item)}"><div class="checkItemTop"><div><span class="checkCategory">${esc(item.category||"General")}</span><h2>${esc(item.label||"Checklist item")}</h2>${item.notes?`<p>${esc(item.notes)}</p>`:""}</div><span class="pill checkStatus">${esc(item.status||"Pending")}</span></div><div class="checkButtons"><button class="ghost smallBtn checkStatusBtn" data-id="${esc(item.id)}" data-status="OK">OK</button><button class="ghost smallBtn checkStatusBtn" data-id="${esc(item.id)}" data-status="Issue">Issue</button><button class="ghost smallBtn checkStatusBtn" data-id="${esc(item.id)}" data-status="N/A">N/A</button><button class="ghost smallBtn checkNoteBtn" data-id="${esc(item.id)}">Note</button></div></div>`).join(""):`<div class="empty">No checklist items saved.</div>`}</div>
  </div>`);
  document.getElementById("backBtn").onclick=()=>route("siteDetail");
  document.getElementById("addCheckItemBtn").onclick=()=>{
    const label=prompt("Checklist item:", "");
    if(!label) return;
    const category=prompt("Category:", "General") || "General";
    s.checklist.unshift({id:uid(),category,label,status:"Pending",notes:"",createdAt:new Date().toISOString()});
    save(); toast("Checklist item added."); render();
  };
  document.getElementById("completeChecklistBtn").onclick=completeChecklistInspection;
  document.getElementById("newChecklistRoundBtn").onclick=startNewChecklistRound;
  document.getElementById("resetChecklistBtn").onclick=()=>{
    if(!confirm("Reset this site checklist to the default template? Existing checklist notes/status will be replaced.")) return;
    s.checklist=[]; seedChecklist(s); save(); toast("Checklist reset."); render();
  };
  document.getElementById("copyChecklistBtn").onclick=async()=>{
    await navigator.clipboard.writeText(`Inspection Checklist - ${s.name||"Site"}\n${checklistReportBlock(s)}`);
    toast("Checklist copied.");
  };
  document.querySelectorAll(".checkStatusBtn").forEach(b=>b.onclick=()=>setChecklistStatus(b.dataset.id,b.dataset.status));
  document.querySelectorAll(".checkNoteBtn").forEach(b=>b.onclick=()=>{
    const item=s.checklist.find(i=>i.id===b.dataset.id); if(!item) return;
    const note=prompt("Checklist note:", item.notes || "");
    if(note===null) return;
    item.notes=note; item.checkedAt=new Date().toISOString(); save(); toast("Checklist note saved."); render();
  });
}

function siteSearchBlob(s){
  ensureSite(s);
  const parts=[s.name, fullAddress(s), s.panelManufacturer, s.panelModel, s.notes];
  (s.contacts||[]).forEach(c=>parts.push(c.name,c.company,c.role,c.phone,c.email,c.type,c.accessNotes,c.notes));
  (s.equipment||[]).forEach(e=>parts.push(e.type,e.status,e.location,e.make,e.model,e.serial,e.notes));
  (s.docs||[]).forEach(d=>parts.push(d.type,d.title,d.ref,d.url,d.notes));
  (s.tasks||[]).forEach(t=>parts.push(t.title,t.status,t.notes,t.source));
  (s.deficiencies||[]).forEach(d=>parts.push(d.title,d.priority,d.status,d.notes));
  (s.checklist||[]).forEach(i=>parts.push(i.category,i.label,i.status,i.notes));
  return parts.filter(Boolean).join(" ").toLowerCase();
}
function detectNearbySites(){
  if(data.settings.gps?.enabled===false){ toast("GPS tools are hidden in Settings."); return; }
  if(!navigator.geolocation){ toast("GPS is not available in this browser."); return; }
  if(!data.sites.some(hasGps)){ route("sites"); setTimeout(()=>toast("No saved GPS sites yet. Open a site and capture GPS first."),50); return; }
  toast("Checking for nearby sites...");
  navigator.geolocation.getCurrentPosition(pos=>{
    nearbyState={lat:Number(pos.coords.latitude.toFixed(6)),lng:Number(pos.coords.longitude.toFixed(6)),accuracy:Math.round(pos.coords.accuracy||0),at:new Date().toISOString()};
    route("nearbySites");
  },err=>toast("Nearby check failed: " + (err.message || "permission denied")),gpsOptions());
}

function applyTheme(){
  const t = data.settings.theme || {};
  const body = document.body;
  body.className = "";
  const preset = t.name || "firevault-dark";
  body.classList.add("theme-" + preset);
  if(t.largeText) body.classList.add("large-text");
  if(t.compactLayout) body.classList.add("compact-layout");
  if(t.buttonStyle === "squared") body.classList.add("square-buttons");
  if(t.cardStyle === "solid") body.classList.add("solid-cards");
  if(t.accentColor) body.style.setProperty("--accent", t.accentColor);
  const meta = document.querySelector('meta[name="theme-color"]');
  if(meta) meta.setAttribute("content", t.accentColor || "#101216");
  applyFeatureVisibility();
}

function loadActiveJob(){ try{ const raw = localStorage.getItem(ACTIVE_JOB_KEY); return raw ? JSON.parse(raw) : null; } catch{ return null; } }
function saveActiveJob(){ activeJob ? localStorage.setItem(ACTIVE_JOB_KEY, JSON.stringify(activeJob)) : localStorage.removeItem(ACTIVE_JOB_KEY); }

const ACTIVE_ROUTE_KEY = "firevault_active_route_day";
function loadActiveRoute(){ try{ const raw = localStorage.getItem(ACTIVE_ROUTE_KEY); return raw ? JSON.parse(raw) : null; } catch{ return null; } }
function saveActiveRoute(){ activeRoute ? localStorage.setItem(ACTIVE_ROUTE_KEY, JSON.stringify(activeRoute)) : localStorage.removeItem(ACTIVE_ROUTE_KEY); }
function routeEventTime(iso){ try{return new Date(iso).toLocaleTimeString([], {hour:"numeric",minute:"2-digit"});}catch{return "";} }
function routeDateLabel(iso){ try{return new Date(iso).toLocaleDateString([], {weekday:"short",month:"short",day:"numeric",year:"numeric"});}catch{return "";} }
function routeDuration(start,end){
  if(!start) return "Not started";
  const a=new Date(start).getTime(), b=end?new Date(end).getTime():Date.now();
  if(!Number.isFinite(a)||!Number.isFinite(b)||b<a) return "0 min";
  const m=Math.round((b-a)/60000);
  if(m<60) return `${m} min`;
  return `${Math.floor(m/60)}h ${m%60}m`;
}
function routePointEvents(log=activeRoute){
  return (log?.events||[]).filter(e=>Number.isFinite(Number(e.lat)) && Number.isFinite(Number(e.lng)));
}
function routeDistanceMetersTotal(log=activeRoute){
  const pts=routePointEvents(log);
  let total=0;
  for(let i=1;i<pts.length;i++) total += distanceMeters(Number(pts[i-1].lat),Number(pts[i-1].lng),Number(pts[i].lat),Number(pts[i].lng));
  return total;
}
function routeDistanceLabel(log=activeRoute){
  const pts=routePointEvents(log);
  if(pts.length<2) return "Not enough GPS points";
  return distanceLabel(routeDistanceMetersTotal(log));
}
function routeDirectionsLink(log=activeRoute){
  const pts=routePointEvents(log);
  if(pts.length<2) return "";
  const trimmed=pts.length>10 ? pts.filter((_,i)=>i===0||i===pts.length-1||i%Math.ceil(pts.length/8)===0).slice(0,10) : pts;
  const origin=`${Number(trimmed[0].lat).toFixed(6)},${Number(trimmed[0].lng).toFixed(6)}`;
  const dest=`${Number(trimmed[trimmed.length-1].lat).toFixed(6)},${Number(trimmed[trimmed.length-1].lng).toFixed(6)}`;
  const mids=trimmed.slice(1,-1).map(e=>`${Number(e.lat).toFixed(6)},${Number(e.lng).toFixed(6)}`);
  if(data.settings.gps?.mapProvider==="google"){
    let url=`https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(dest)}&travelmode=driving`;
    if(mids.length) url += `&waypoints=${encodeURIComponent(mids.join("|"))}`;
    return url;
  }
  return `https://maps.apple.com/?saddr=${encodeURIComponent(origin)}&daddr=${encodeURIComponent(dest)}`;
}
function routeOdometerMiles(log=activeRoute){
  const start=Number(log?.startOdometer);
  const end=Number(log?.endOdometer);
  if(!Number.isFinite(start) || !Number.isFinite(end) || end < start) return null;
  return end-start;
}
function routeOdometerLabel(log=activeRoute){
  const miles=routeOdometerMiles(log);
  if(miles===null) return "Odometer not entered";
  return `${miles>=100?miles.toFixed(0):miles.toFixed(1)} mi odometer`;
}
function routeOdometerReportLines(log=activeRoute){
  const lines=[];
  if(log?.vehicle) lines.push(`Vehicle: ${log.vehicle}`);
  if(log?.startOdometer!==undefined && log?.startOdometer!=="") lines.push(`Start Odometer: ${log.startOdometer}`);
  if(log?.endOdometer!==undefined && log?.endOdometer!=="") lines.push(`End Odometer: ${log.endOdometer}`);
  const miles=routeOdometerMiles(log);
  if(miles!==null) lines.push(`Odometer Miles: ${miles>=100?miles.toFixed(0):miles.toFixed(1)} mi`);
  if(log?.dayNotes) lines.push(`Day Notes: ${String(log.dayNotes).replaceAll("\n"," | ")}`);
  return lines;
}
function routeSummaryLine(log=activeRoute){
  if(!log) return "No route day selected.";
  const events=log.events||[];
  const siteCount=[...new Set(events.filter(e=>e.siteName).map(e=>e.siteName))].length;
  const odo=routeOdometerMiles(log);
  return `${events.length} waypoint${events.length===1?"":"s"} • ${siteCount} site${siteCount===1?"":"s"} • ${routeDuration(log.startedAt,log.endedAt)} • ${routeDistanceLabel(log)}${odo!==null?` • ${routeOdometerLabel(log)}`:""}`;
}
function saveRouteDetails469(){
  if(!activeRoute){ toast("Start a route day first."); return; }
  activeRoute.vehicle=val("routeVehicle");
  const start=val("routeStartOdo");
  const end=val("routeEndOdo");
  activeRoute.startOdometer=start===""?"":Number(start);
  activeRoute.endOdometer=end===""?"":Number(end);
  activeRoute.dayNotes=raw("routeDayNotes").trim();
  saveActiveRoute();
  toast("Route details saved.");
  routeLog();
}

function routePauseStatusLine(log=activeRoute){
  if(!log) return "No route active";
  if(log.endedAt) return "Saved";
  return log.paused ? "Paused" : "Recording";
}
function pauseRouteDay(){
  if(!activeRoute){ toast("Start Daily Route first."); return; }
  if(activeRoute.paused){ toast("Route is already paused."); return; }
  const now=new Date().toISOString();
  activeRoute.paused=true;
  activeRoute.pausedAt=now;
  activeRoute.events=activeRoute.events||[];
  activeRoute.events.push({id:uid(),type:"Paused",label:"Route Paused",notes:"Recording paused.",at:now});
  saveActiveRoute();
  toast("Daily Route paused.");
  if(view === "routeLog") routeLog(); else render();
}
function resumeRouteDay(){
  if(!activeRoute){ toast("Start Daily Route first."); return; }
  if(!activeRoute.paused){ toast("Route is already recording."); return; }
  const now=new Date().toISOString();
  activeRoute.paused=false;
  activeRoute.resumedAt=now;
  activeRoute.events=activeRoute.events||[];
  activeRoute.events.push({id:uid(),type:"Resumed",label:"Route Resumed",notes:"Recording resumed.",at:now});
  saveActiveRoute();
  toast("Daily Route resumed.");
  if(view === "routeLog") routeLog(); else render();
}
function routeGpsText(ev){
  if(!ev || !Number.isFinite(Number(ev.lat)) || !Number.isFinite(Number(ev.lng))) return "No GPS";
  const acc=Number.isFinite(Number(ev.accuracy)) && Number(ev.accuracy)>0 ? ` ±${Math.round(Number(ev.accuracy))}m` : "";
  return `${Number(ev.lat).toFixed(6)}, ${Number(ev.lng).toFixed(6)}${acc}`;
}
function routeMapLink(ev){
  if(!ev || !Number.isFinite(Number(ev.lat)) || !Number.isFinite(Number(ev.lng))) return "";
  const q=encodeURIComponent(`${Number(ev.lat).toFixed(6)},${Number(ev.lng).toFixed(6)}`);
  return (data.settings.gps?.mapProvider==="google") ? `https://www.google.com/maps/search/?api=1&query=${q}` : `https://maps.apple.com/?q=${q}`;
}
function getGpsPosition(){
  return new Promise((resolve)=>{
    if(data.settings.gps?.enabled===false || !navigator.geolocation){ resolve(null); return; }
    navigator.geolocation.getCurrentPosition(pos=>resolve({
      lat:Number(pos.coords.latitude.toFixed(6)),
      lng:Number(pos.coords.longitude.toFixed(6)),
      accuracy:Math.round(pos.coords.accuracy||0)
    }),()=>resolve(null),gpsOptions());
  });
}
function ensureActiveRoute(){
  if(activeRoute) return activeRoute;
  activeRoute={id:uid(),date:localDateString(),startedAt:new Date().toISOString(),endedAt:null,vehicle:"",startOdometer:"",endOdometer:"",dayNotes:"",events:[]};
  saveActiveRoute();
  return activeRoute;
}
async function addRouteEvent(type,label,siteId="",notes=""){
  const route=ensureActiveRoute();
  const allowedWhilePaused=["Paused","Resumed","End Day"];
  if(route.paused && !allowedWhilePaused.includes(type)){
    toast("Daily Route is paused. Resume recording first.");
    return;
  }
  toast("Capturing route point...");
  const gps=await getGpsPosition();
  const s=siteId?data.sites.find(x=>x.id===siteId):null;
  const ev={id:uid(),type,label:label||type,siteId:siteId||"",siteName:s?.name||"",address:s?fullAddress(s):"",notes:notes||"",at:new Date().toISOString(),...(gps||{})};
  if(gps && data.sites.some(hasGps)){
    const nearest=gpsSiteDistances(gps.lat,gps.lng)[0];
    if(nearest){
      ev.nearestSite=nearest.s.name||"Unnamed Site";
      ev.nearestDistance=distanceLabel(nearest.meters);
    }
  }
  route.events.push(ev);
  if(route.nearbySuggestion && siteId && route.nearbySuggestion.siteId===siteId) delete route.nearbySuggestion;
  saveActiveRoute();
  toast(`${label||type} added.`);
  if(view === "routeLog") routeLog(); else render();
}
function editRouteEvent(id){
  if(!activeRoute){ toast("No active route day."); return; }
  const ev=(activeRoute.events||[]).find(x=>x.id===id);
  if(!ev){ toast("Waypoint not found."); return; }
  const label=prompt("Edit waypoint title", ev.label||ev.type||"Waypoint");
  if(label===null) return;
  const notes=prompt("Edit waypoint notes", ev.notes||"");
  if(notes===null) return;
  ev.label=(label.trim()||ev.label||ev.type||"Waypoint");
  ev.notes=notes.trim();
  saveActiveRoute();
  toast("Waypoint updated.");
  routeLog();
}
function deleteRouteEvent(id){
  if(!activeRoute){ toast("No active route day."); return; }
  const ev=(activeRoute.events||[]).find(x=>x.id===id);
  if(!ev){ toast("Waypoint not found."); return; }
  if(!confirm(`Delete waypoint "${ev.label||ev.type||"Waypoint"}"?`)) return;
  activeRoute.events=(activeRoute.events||[]).filter(x=>x.id!==id);
  saveActiveRoute();
  toast("Waypoint deleted.");
  routeLog();
}
function undoLastRouteEvent(){
  if(!activeRoute || !(activeRoute.events||[]).length){ toast("No waypoint to remove."); return; }
  const ev=activeRoute.events[activeRoute.events.length-1];
  if(!confirm(`Remove last waypoint "${ev.label||ev.type||"Waypoint"}"?`)) return;
  activeRoute.events.pop();
  saveActiveRoute();
  toast("Last waypoint removed.");
  routeLog();
}
function routeSuggestion(){
  if(!activeRoute?.nearbySuggestion) return null;
  const n=activeRoute.nearbySuggestion;
  const s=data.sites.find(x=>x.id===n.siteId);
  if(!s) return null;
  return {n,s};
}
async function checkRouteNearestSite(){
  if(!activeRoute){ toast("Start Daily Route first."); return; }
  if(activeRoute.paused){ toast("Daily Route is paused. Resume recording first."); return; }
  if(!data.sites.some(hasGps)){ toast("No saved GPS sites yet."); return; }
  toast("Checking nearest saved site...");
  const gps=await getGpsPosition();
  if(!gps){ toast("GPS check unavailable."); return; }
  const nearest=gpsSiteDistances(gps.lat,gps.lng)[0];
  if(!nearest){ toast("No nearby site match found."); return; }
  activeRoute.nearbySuggestion={
    siteId:nearest.s.id,
    siteName:nearest.s.name||"Unnamed Site",
    address:fullAddress(nearest.s),
    meters:Math.round(nearest.meters),
    distance:distanceLabel(nearest.meters),
    lat:gps.lat,
    lng:gps.lng,
    accuracy:gps.accuracy||0,
    checkedAt:new Date().toISOString()
  };
  saveActiveRoute();
  toast(`Nearest site: ${activeRoute.nearbySuggestion.siteName}`);
  if(view === "routeLog") routeLog(); else render();
}
function clearRouteSuggestion(){
  if(!activeRoute) return;
  delete activeRoute.nearbySuggestion;
  saveActiveRoute();
  routeLog();
}
function routeUseSuggestion(kind){
  const found=routeSuggestion();
  if(!found){ toast("No suggested site available."); return; }
  const label=kind==="Left Site" ? `Left: ${found.s.name||"Site"}` : `Arrived: ${found.s.name||"Site"}`;
  addRouteEvent(kind,label,found.s.id);
}
async function startRouteDay(){
  if(activeRoute){ route("routeLog"); return; }
  activeRoute={id:uid(),date:localDateString(),startedAt:new Date().toISOString(),endedAt:null,vehicle:"",startOdometer:"",endOdometer:"",dayNotes:"",events:[]};
  saveActiveRoute();
  await addRouteEvent("Start Day","Start Day");
}
async function endRouteDay(){
  if(!activeRoute){ toast("No active route day."); return; }
  await addRouteEvent("End Day","End Day");
  activeRoute.paused=false;
  activeRoute.endedAt=new Date().toISOString();
  data.routeLogs=data.routeLogs||[];
  data.routeLogs.unshift(activeRoute);
  data.routeLogs=data.routeLogs.slice(0,90);
  activeRoute=null;
  saveActiveRoute();
  save();
  toast("Daily route saved.");
  if(view === "routeLog") routeLog(); else render();
}
function routeReportText(log=activeRoute){
  if(!log) return "No active route log.";
  const stops=log.events||[];
  const siteStops=stops.filter(e=>e.siteName).length;
  const lines=[
    `FIREVAULT DAILY ROUTE REPORT`,
    `Date: ${routeDateLabel(log.startedAt||new Date())}`,
    `Start: ${log.startedAt?routeEventTime(log.startedAt):"Not started"}`,
    `End: ${log.endedAt?routeEventTime(log.endedAt):"Active"}`,
    `Status: ${routePauseStatusLine(log)}`,
    `Duration: ${routeDuration(log.startedAt,log.endedAt)}`,
    `Estimated Route Distance: ${routeDistanceLabel(log)}`,
    ...routeOdometerReportLines(log),
    `Waypoints: ${stops.length}`,
    `Site Stops: ${siteStops}`,
    ``,
    routeDirectionsLink(log) ? `Route Directions: ${routeDirectionsLink(log)}` : `Route Directions: Not enough GPS points`,
    ``,
    `STOPS / WAYPOINTS`
  ];
  if(!stops.length) lines.push("- No waypoints recorded.");
  stops.forEach((e,i)=>{
    lines.push(`${i+1}. ${routeEventTime(e.at)} - ${e.label||e.type}${e.siteName?` - ${e.siteName}`:""}`);
    if(e.address) lines.push(`   Address: ${e.address}`);
    lines.push(`   GPS: ${routeGpsText(e)}`);
    const link=routeMapLink(e); if(link) lines.push(`   Map: ${link}`);
    if(e.nearestSite) lines.push(`   Nearby: ${e.nearestSite} (${e.nearestDistance})`);
    if(e.notes) lines.push(`   Notes: ${e.notes}`);
  });
  lines.push(``, `Generated by FireVault Build ${BUILD} on ${new Date().toLocaleString()}`);
  return lines.join("\n");
}
function copyRouteReport(log=activeRoute){
  const text=routeReportText(log);
  if(navigator.clipboard?.writeText){
    navigator.clipboard.writeText(text).then(()=>toast("Route report copied."),()=>toast("Clipboard unavailable."));
  }else toast("Clipboard unavailable.");
}
function downloadRouteReport(log=activeRoute){
  const name=`firevault-route-${(log?.date||localDateString())}.txt`;
  downloadBlob(name, routeReportText(log));
}

function routeCsvEscape(v){
  const s=String(v ?? "");
  return /[",\n]/.test(s) ? `"${s.replace(/"/g,'""')}"` : s;
}
function routeCsvText(log=activeRoute){
  if(!log) return "Vehicle,Start Odometer,End Odometer,Odometer Miles,Day Notes,Time,Type,Label,Site,Address,Latitude,Longitude,Accuracy,Nearest Site,Nearest Distance,Notes,Map Link\n";
  const header=["Vehicle","Start Odometer","End Odometer","Odometer Miles","Day Notes","Time","Type","Label","Site","Address","Latitude","Longitude","Accuracy","Nearest Site","Nearest Distance","Notes","Map Link"];
  const odo=routeOdometerMiles(log);
  const rows=(log.events||[]).map(e=>[
    log.vehicle||"",
    log.startOdometer??"",
    log.endOdometer??"",
    odo===null?"":(odo>=100?odo.toFixed(0):odo.toFixed(1)),
    log.dayNotes||"",
    e.at ? new Date(e.at).toLocaleString() : "",
    e.type||"",
    e.label||"",
    e.siteName||"",
    e.address||"",
    Number.isFinite(Number(e.lat)) ? Number(e.lat).toFixed(6) : "",
    Number.isFinite(Number(e.lng)) ? Number(e.lng).toFixed(6) : "",
    Number.isFinite(Number(e.accuracy)) ? Math.round(Number(e.accuracy)) : "",
    e.nearestSite||"",
    e.nearestDistance||"",
    e.notes||"",
    routeMapLink(e)||""
  ]);
  return [header, ...rows].map(r=>r.map(routeCsvEscape).join(",")).join("\n");
}
function downloadRouteCsv(log=activeRoute){
  const name=`firevault-route-${(log?.date||localDateString())}.csv`;
  downloadBlob(name, routeCsvText(log), "text/csv");
  toast("Route CSV downloaded.");
}
function routeCustomerSummaryText(log=activeRoute){
  if(!log) return "No route day selected.";
  const events=log.events||[];
  const siteNames=[...new Set(events.filter(e=>e.siteName).map(e=>e.siteName))];
  const lines=[
    `FireVault Daily Work Route Summary`,
    `Date: ${routeDateLabel(log.startedAt||new Date())}`,
    `Time: ${log.startedAt?routeEventTime(log.startedAt):"Not started"} - ${log.endedAt?routeEventTime(log.endedAt):"Active"}`,
    `Duration: ${routeDuration(log.startedAt,log.endedAt)}`,
    `Stops Recorded: ${events.length}`,
    `Sites Visited: ${siteNames.length ? siteNames.join(", ") : "None recorded"}`,
    `Estimated Route Distance: ${routeDistanceLabel(log)}`,
    ...routeOdometerReportLines(log),
    ``,
    `Stop Timeline:`
  ];
  if(!events.length) lines.push(`- No stops recorded.`);
  events.forEach((e,i)=>{
    const stopName=e.siteName ? `${e.label||e.type} - ${e.siteName}` : (e.label||e.type||"Stop");
    lines.push(`${i+1}. ${routeEventTime(e.at)} - ${stopName}`);
    if(e.notes) lines.push(`   Notes: ${e.notes}`);
  });
  lines.push(``, `Generated from FireVault Build ${BUILD}`);
  return lines.join("\n");
}
function copyRouteCustomerSummary(log=activeRoute){
  const text=routeCustomerSummaryText(log);
  if(navigator.clipboard?.writeText){
    navigator.clipboard.writeText(text).then(()=>toast("Customer summary copied."),()=>toast("Clipboard unavailable."));
  }else toast("Clipboard unavailable.");
}

function fmtDate(d=new Date()){ return d.toLocaleDateString([], {month:"short", day:"numeric", year:"numeric"}); }
function todayIso(){ return new Date().toISOString().slice(0,10); }
function localDateString(d=new Date()){
  const y=d.getFullYear();
  const m=String(d.getMonth()+1).padStart(2,"0");
  const day=String(d.getDate()).padStart(2,"0");
  return `${y}-${m}-${day}`;
}
function taskIsDone(t){ return (t?.status || "Open") === "Done"; }
function taskDueState(t){
  if(taskIsDone(t)) return "done";
  if(!t?.due) return "none";
  const today=localDateString();
  if(t.due < today) return "overdue";
  if(t.due === today) return "today";
  return "upcoming";
}
function taskDueLabel(t){
  const state=taskDueState(t);
  if(state === "done") return "Completed";
  if(state === "overdue") return `Overdue ${t.due}`;
  if(state === "today") return "Due today";
  if(state === "upcoming") return `Due ${t.due}`;
  return "No due date";
}
function allTaskRows(){
  const rows=[];
  data.sites.forEach(s=>ensureSite(s).tasks.forEach(t=>rows.push({s,t,state:taskDueState(t)})));
  return rows;
}
function taskFilterCounts(rows){
  return {
    all: rows.length,
    open: rows.filter(r=>!taskIsDone(r.t)).length,
    today: rows.filter(r=>r.state === "today").length,
    overdue: rows.filter(r=>r.state === "overdue").length,
    service: rows.filter(r=>r.t.source === "Service Call" && !taskIsDone(r.t)).length,
    done: rows.filter(r=>taskIsDone(r.t)).length
  };
}
function taskMatchesFilter(r, filter){
  if(filter === "all") return true;
  if(filter === "open") return !taskIsDone(r.t);
  if(filter === "today") return r.state === "today";
  if(filter === "overdue") return r.state === "overdue";
  if(filter === "service") return r.t.source === "Service Call" && !taskIsDone(r.t);
  if(filter === "done") return taskIsDone(r.t);
  return true;
}
function taskSortValue(r){
  if(taskIsDone(r.t)) return `9-${r.t.due || "9999-99-99"}`;
  if(r.state === "overdue") return `0-${r.t.due}`;
  if(r.state === "today") return `1-${r.t.due}`;
  if(r.state === "upcoming") return `2-${r.t.due}`;
  return "3-9999-99-99";
}
function toggleTaskDone(siteId, taskId){
  const s=data.sites.find(x=>x.id===siteId);
  const t=s?.tasks?.find(x=>x.id===taskId);
  if(!t) return;
  if(taskIsDone(t)){ t.status="Open"; delete t.completedAt; toast("Task reopened."); }
  else { t.status="Done"; t.completedAt=new Date().toISOString(); toast("Task completed."); }
  save(); render();
}
function elapsedText(startIso){ const ms=Date.now()-new Date(startIso).getTime(); const h=Math.floor(ms/3600000); const m=Math.floor((ms%3600000)/60000); const s=Math.floor((ms%60000)/1000); return h?`${h}:${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`:`${m}:${String(s).padStart(2,"0")}`; }
function durationText(startIso,endIso){
  if(!startIso || !endIso) return "Duration not saved";
  const ms=Math.max(0,new Date(endIso).getTime()-new Date(startIso).getTime());
  const h=Math.floor(ms/3600000), m=Math.floor((ms%3600000)/60000);
  return h ? `${h}h ${m}m` : `${m}m`;
}
function eventTime(iso){ return new Date(iso).toLocaleTimeString([], {hour:"numeric", minute:"2-digit"}); }
function visitDateLabel(v){
  if(v?.startedAt) return new Date(v.startedAt).toLocaleDateString([], {month:"short", day:"numeric", year:"numeric"});
  return v?.date || fmtDate();
}
function visitTimeRange(v){
  if(!v?.startedAt) return "Time not saved";
  const start=eventTime(v.startedAt);
  const end=v.endedAt ? eventTime(v.endedAt) : "open";
  return `${start} – ${end}`;
}
function visitNotesPreview(v, lines=2){
  return (v?.notes || "").split("\n").filter(Boolean).slice(0,lines).join(" • ") || "No visit notes saved.";
}
function visitReportBlock(v){
  return `${visitDateLabel(v)} • ${visitTimeRange(v)} • ${durationText(v.startedAt,v.endedAt)}\n${v.notes || "No visit notes saved."}`;
}
function addJobEvent(note){
  if(!activeJob) return;
  activeJob.events = Array.isArray(activeJob.events) ? activeJob.events : [];
  activeJob.events.unshift({time:new Date().toISOString(), note});
  saveActiveJob();
}
function addServiceFollowUp(kind="Follow-up"){
  const s=site();
  if(!s || !activeJob){ toast("Start a job first."); return; }
  const defaultTitle = kind === "Parts Needed" ? "Parts needed" : "Follow up from service call";
  const title = prompt(`${kind} task title:`, defaultTitle);
  if(!title) return;
  const notes = prompt("Task notes:", `${kind} created during service call on ${fmtDate()} for ${s.name || "site"}.`) || "";
  s.tasks = Array.isArray(s.tasks) ? s.tasks : [];
  s.tasks.unshift({
    id:uid(),
    title: kind === "Parts Needed" && !title.toLowerCase().startsWith("parts") ? `Parts needed: ${title}` : title,
    status:"Open",
    due:"",
    notes,
    source:"Service Call",
    sourceStartedAt:activeJob.startedAt,
    createdAt:new Date().toISOString()
  });
  addJobEvent(`${kind}: ${title}`);
  save();
  saveActiveJob();
  toast(`${kind} task added.`);
  render();
}
function startJobTimer(){ stopJobTimer(); jobTimer=setInterval(()=>{ const el=document.getElementById("jobElapsed"); if(el && activeJob) el.textContent=elapsedText(activeJob.startedAt); },1000); }
function stopJobTimer(){ if(jobTimer){ clearInterval(jobTimer); jobTimer=null; } }
function setActiveNav(){ document.querySelectorAll("nav button").forEach(b=>b.classList.remove("active")); const section=view==="routeLog"?"home":(["siteDetail","visits","visitDetail","checklist","siteForm","contactsList","contactForm","siteDocs","siteDocForm","equipmentList","equipmentForm","tasks","taskForm","deficiencies","deficiencyForm","report","jobMode","nearbySites","attention"].includes(view)?"sites":view); document.getElementById("nav-"+section)?.classList.add("active"); }

function render(){
  try{
    const routes = {home, routeLog, sites, nearbySites, attention:attentionQueue, siteDetail, visits, visitDetail, checklist, siteForm, contactsList, contactForm, siteDocs, siteDocForm, equipmentList, equipmentForm, tasks, taskForm, deficiencies, deficiencyForm, report, library, resourceForm, jobMode, settings, diagnostics};
    (routes[view] || home)();
    view === "jobMode" ? startJobTimer() : stopJobTimer();
    applyFeatureVisibility();
    setActiveNav();
  }catch(err){ showError(err); }
}

function showError(err){
  console.error(err);
  html(`<div class="screen"><div class="card errorBox"><h1>FireVault Diagnostics</h1><p>The app caught an error instead of going black.</p><p>${esc(err?.stack || err?.message || err)}</p><button class="primary" onclick="location.reload()">Reload App</button></div></div>`);
}

function home(){
  const visits = data.sites.flatMap(s => (s.visits||[]).map(v => ({...v, site:s.name})));
  const taskRows = allTaskRows();
  const taskCounts = taskFilterCounts(taskRows);
  const openTasks = taskCounts.open;
  const def = data.sites.reduce((n,s)=>n+(s.deficiencies||[]).filter(d => (d.status||"Open") !== "Closed").length,0);
  const gpsSites = data.sites.filter(hasGps).length;
  const attentionList = attentionRows();
  const lastExport = localStorage.getItem("firevault_last_backup_export") || "No export recorded";
  const dataHealth = data.sites.length ? "Vault Ready" : "Add First Site";
  const now = new Date();
  html(`<div class="screen homeScreen450">
    <div class="homeHero450 homeHero457 homeHero463"><div class="homeDateWrap463">${activeRoute?`<span class="${activeRoute.paused?"routeLed470 routeLedPaused470":"routeLed463"}" aria-label="${activeRoute.paused?"Daily route paused":"Daily route recording"}"></span>`:""}<div class="homeDateBlock457"><div class="todayDay"><h1>${now.toLocaleDateString([], {weekday:"long"})}</h1></div><p class="homeDateLine457">${fmtDate(now)}</p></div></div></div>
    <div class="grid3 ${appMode()==="simple"?"simpleMetricGrid473":""}">
      <div class="card tile metricCard" id="sitesCard"><strong>${data.sites.length}</strong><span>Sites</span></div>
      <div class="card tile metricCard taskMetricCard" id="tasksCard"><strong>${openTasks}</strong><span>${taskCounts.overdue ? `${taskCounts.overdue} overdue` : taskCounts.today ? `${taskCounts.today} due today` : "Open Tasks"}</span></div>
      <div class="card tile metricCard" id="defCard"><strong>${def}</strong><span>Deficiencies</span></div>
    </div>
    <div class="grid2 homeActionGrid ${appMode()==="simple"?"simpleActionGrid473":""}">
      <button class="primary tile" id="addSiteBtn"><strong>＋ Add Site</strong><span>Create customer vault</span></button>
      <button class="ghost tile gpsHomeTile ${featureOn("advancedGps")?"":"featureHidden472"}" id="gpsHomeBtn"><strong>⌖ GPS / Maps</strong><span>${gpsSites} site${gpsSites===1?"":"s"} with GPS</span></button>
      <button class="ghost tile nearbyHomeTile ${featureOn("advancedGps")?"":"featureHidden472"}" id="nearbyHomeBtn"><strong>◎ Nearby Sites</strong><span>Detect saved sites near me</span></button>
      <button class="ghost tile attentionHomeTile ${featureOn("attention")?"":"featureHidden472"}" id="attentionHomeBtn"><strong>⚠ Attention Queue</strong><span>${attentionList.length ? `${attentionList.length} site${attentionList.length===1?"":"s"} to review` : "No priority issues"}</span></button>
      <button class="ghost tile routeHomeTile462 ${(featureOn("dailyRoute")||activeRoute)?"":"featureHidden472"}" id="routeLogBtn"><strong>◇ Daily Route</strong><span>${activeRoute ? `${(activeRoute.events||[]).length} active waypoints` : `${(data.routeLogs||[]).length} saved route days`}</span></button>
    </div>
    ${appMode()==="simple"?`<div class="card simpleViewNotice472 simpleViewNotice473"><div><h2>Simple View Active</h2><p>FireVault is keeping the dashboard clean. Current preset: <strong>${esc(currentPresetName474())}</strong>.</p></div><div class="simpleNoticeActions473"><button class="ghost smallBtn" id="manageViewBtn472">Manage View</button><button class="primary smallBtn" id="advancedNowBtn473">Advanced</button></div></div>${simpleToolsMarkup473()}`:""}
    ${activeRoute ? `<div class="card activeRouteMini468 ${activeRoute.paused?"activeRoutePaused470":""}"><div class="activeRouteHead468"><div><h2><span class="${activeRoute.paused?"routeLed470 routeLedPaused470":"routeLed463"} miniLed468"></span>${activeRoute.paused?"Daily Route Paused":"Daily Route Recording"}</h2><p>${esc(routeSummaryLine(activeRoute))}</p></div><button class="primary smallBtn" id="openRouteMiniBtn">Open</button></div><div class="activeRouteStats468"><div><strong>${(activeRoute.events||[]).length}</strong><span>Waypoints</span></div><div><strong>${routeDuration(activeRoute.startedAt)}</strong><span>Time</span></div><div><strong>${esc(routeDistanceLabel(activeRoute))}</strong><span>Distance</span></div></div><div class="activeRouteActions468"><button class="ghost smallBtn" id="homeRoutePointBtn" ${activeRoute.paused?"disabled":""}>Waypoint</button><button class="ghost smallBtn" id="homeRouteNearestBtn" ${activeRoute.paused?"disabled":""}>Nearest</button><button class="${activeRoute.paused?"primary":"ghost"} smallBtn" id="homeRoutePauseBtn">${activeRoute.paused?"Resume":"Pause"}</button><button class="danger smallBtn" id="homeRouteEndBtn">End / Save</button></div></div>` : ""}
    ${activeJob ? `<div class="card activeJobMini"><div class="row"><div><h2>Service Call Active</h2><p>${esc(activeJob.siteName)} • <span id="jobElapsed">${elapsedText(activeJob.startedAt)}</span></p></div><button class="primary" id="resumeJobBtn">Open</button></div></div>` : ""}
    <div class="card grow homeStatus450"><div class="homeStatusHead450"><h2>Stability Checkpoint</h2><span>${dataHealth}</span></div><div class="homeStatusGrid450"><div><strong>${data.sites.length}</strong><span>Sites</span></div><div><strong>${visits.length}</strong><span>Visits</span></div><div><strong>${gpsSites}</strong><span>GPS Saved</span></div></div><p>Current build focuses on app polish, visual consistency, and safer update habits.</p><p class="fieldNote">Last backup export: ${esc(lastExport)}</p></div>
  </div>`);
  document.getElementById("sitesCard").onclick=()=>route("sites");
  document.getElementById("tasksCard").onclick=()=>{selectedSiteId=null; route("tasks");};
  document.getElementById("defCard").onclick=()=>{selectedSiteId=null; route("deficiencies");};
  document.getElementById("addSiteBtn").onclick=()=>{selectedSiteId=null; mode=null; route("siteForm");};
  document.getElementById("gpsHomeBtn").onclick=()=>{
    if(data.sites.length){ route("sites"); setTimeout(()=>toast("Open a site to capture GPS or launch maps."),50); }
    else { selectedSiteId=null; mode=null; route("siteForm"); setTimeout(()=>toast("Use Capture in GPS Coordinates."),50); }
  };
  document.getElementById("nearbyHomeBtn").onclick=detectNearbySites;
  document.getElementById("attentionHomeBtn").onclick=()=>route("attention");
  document.getElementById("routeLogBtn").onclick=()=>route("routeLog");
  const manageView=document.getElementById("manageViewBtn472"); if(manageView) manageView.onclick=()=>{settingsTab="visibility"; mode="settingsDetail"; route("settings");};
  const advancedNow=document.getElementById("advancedNowBtn473"); if(advancedNow) advancedNow.onclick=()=>setViewMode("advanced");
  const simpleMore=document.getElementById("simpleMoreBtn473"); if(simpleMore) simpleMore.onclick=()=>{simpleToolsOpen=!simpleToolsOpen; home();};
  document.querySelectorAll("[data-simple-feature]").forEach(btn=>btn.onclick=()=>enableSimpleFeature473(btn.dataset.simpleFeature, btn.dataset.simpleTarget));
  const openRouteMini=document.getElementById("openRouteMiniBtn"); if(openRouteMini) openRouteMini.onclick=()=>route("routeLog");
  const homeRoutePoint=document.getElementById("homeRoutePointBtn"); if(homeRoutePoint) homeRoutePoint.onclick=()=>{ const note=prompt("Waypoint note", "Manual waypoint")||"Manual waypoint"; addRouteEvent("Waypoint", note); };
  const homeRouteNearest=document.getElementById("homeRouteNearestBtn"); if(homeRouteNearest) homeRouteNearest.onclick=checkRouteNearestSite;
  const homeRoutePause=document.getElementById("homeRoutePauseBtn"); if(homeRoutePause) homeRoutePause.onclick=()=> activeRoute?.paused ? resumeRouteDay() : pauseRouteDay();
  const homeRouteEnd=document.getElementById("homeRouteEndBtn"); if(homeRouteEnd) homeRouteEnd.onclick=()=>{ if(confirm("End and save today’s route?")) endRouteDay(); };
  const rb=document.getElementById("resumeJobBtn"); if(rb) rb.onclick=()=>{selectedSiteId=activeJob.siteId; route("jobMode");};
}


function routeLog(){
  const saved=(data.routeLogs||[]);
  const active=activeRoute;
  const siteOptions=data.sites.map(s=>`<option value="${esc(s.id)}">${esc(s.name||"Unnamed Site")}</option>`).join("");
  const events=active?.events||[];
  const paused=!!active?.paused;
  const suggestion=active?routeSuggestion():null;
  html(`<div class="screen routeLogScreen462">
    <div class="row"><button class="back ghost" id="backBtn">←</button><h1>Daily Route</h1></div>
    <div class="card routeHero462 ${active?(paused?"paused470":"active"):"idle"}">
      <div><strong>${active?(paused?"Route Paused":"Route Active"):"No Active Route"}</strong><span>${active?routeSummaryLine(active):`${saved.length} saved day${saved.length===1?"":"s"}`}</span></div>
      <p>${active?(paused?"Recording is paused. Resume when you want FireVault to capture the next stop or waypoint.":"Track stops, site arrivals, breaks, and manual GPS waypoints while the app is open."):"Start a route day to record sites visited and waypoints for a daily report."}</p>
    </div>
    <div class="routeControls462">
      ${active?`<button class="danger" id="endRouteBtn">End Day / Save</button><button class="${paused?"primary":"ghost"}" id="${paused?"resumeRouteBtn":"pauseRouteBtn"}">${paused?"Resume Route":"Pause Route"}</button>`:`<button class="primary" id="startRouteBtn">Start Day</button>`}
      <button class="ghost" id="copyRouteBtn" ${active||saved[0]?"":"disabled"}>Copy Report</button>
      <button class="ghost" id="downloadRouteBtn" ${active||saved[0]?"":"disabled"}>Download Report</button>
      <button class="ghost ${featureOn("csvExports")?"":"featureHidden472"}" id="csvRouteBtn" ${active||saved[0]?"":"disabled"}>CSV Export</button>
      <button class="ghost" id="summaryRouteBtn" ${active||saved[0]?"":"disabled"}>Customer Summary</button>
      ${active?`<button class="ghost" id="undoRouteBtn" ${events.length?"":"disabled"}>Undo Last Point</button>`:""}
    </div>
    ${(active||saved[0])?`<div class="card routeReportPreview464 routeReportPreview467"><div><h2>Daily Report Summary</h2><p>${esc(routeSummaryLine(active||saved[0]))}</p><p class="fieldNote">Export as TXT${featureOn("csvExports")?", CSV":""}, or copy a cleaner customer summary.</p></div>${routeDirectionsLink(active||saved[0])?`<a class="btn ghost" href="${esc(routeDirectionsLink(active||saved[0]))}" target="_blank" rel="noopener">Open Route Map</a>`:""}</div>`:""}
    ${active?`<div class="card routeDetails469"><div class="routeDetailsHead469"><div><h2>Vehicle / Mileage</h2><p>${esc(routeOdometerLabel(active))}</p></div><button class="primary smallBtn" id="saveRouteDetailsBtn">Save Details</button></div><div class="routeOdoGrid469"><div><label>Vehicle</label><input id="routeVehicle" value="${esc(active.vehicle||"")}" placeholder="Truck / van / unit #"></div><div><label>Start Odometer</label><input id="routeStartOdo" type="number" inputmode="decimal" step="0.1" value="${esc(active.startOdometer??"")}" placeholder="Optional"></div><div><label>End Odometer</label><input id="routeEndOdo" type="number" inputmode="decimal" step="0.1" value="${esc(active.endOdometer??"")}" placeholder="Optional"></div></div><label>Day Notes</label><textarea id="routeDayNotes" placeholder="General notes for today’s route report...">${esc(active.dayNotes||"")}</textarea></div>`:""}
    ${active?`<div class="card routeQuick462 ${paused?"routeQuickPaused470":""}">
      <div class="routeSitePick462"><label>Site Stop</label><select id="routeSiteSelect"><option value="">Select saved site...</option>${siteOptions}</select></div>
      <div class="grid2">
        <button class="primary" id="arrivedBtn" ${paused?"disabled":""}>Arrived Site</button>
        <button class="ghost" id="leftBtn" ${paused?"disabled":""}>Left Site</button>
        <button class="ghost" id="waypointBtn" ${paused?"disabled":""}>Manual Waypoint</button>
        <button class="ghost" id="breakBtn" ${paused?"disabled":""}>Break / Fuel / Parts</button>
        <button class="ghost routeNearestBtn466" id="nearestBtn" ${paused?"disabled":""}>Check Nearest Site</button>
      </div>
      <p class="fieldNote">${paused?"Route is paused. Resume to add site stops, waypoints, or nearest-site checks.":"GPS capture works while FireVault is open. iPhone home-screen web apps may limit background tracking."}</p>
    </div>`:""}
    ${suggestion?`<div class="card routeSuggestion466"><div><h2>Suggested Site Stop</h2><p><strong>${esc(suggestion.s.name||"Unnamed Site")}</strong> • ${esc(suggestion.n.distance)} away</p><p>${esc(suggestion.n.address||"No address saved")}</p><p class="fieldNote">Checked ${routeEventTime(suggestion.n.checkedAt)} • GPS accuracy ±${Math.round(Number(suggestion.n.accuracy)||0)} m</p></div><div class="grid3 routeSuggestionActions466"><button class="primary" id="suggestArriveBtn">Arrived</button><button class="ghost" id="suggestLeftBtn">Left</button><button class="ghost" id="clearSuggestionBtn">Clear</button></div></div>`:""}
    <div class="list grow routeList462">
      ${active?`<div class="routeSectionTitle462"><strong>Today</strong><span>${routeDateLabel(active.startedAt)}</span></div>${events.length?events.map(e=>routeEventCard(e,true)).join(""):`<div class="empty">No route points yet. Add a waypoint or site stop.</div>`}`:(()=>{const filtered=saved.filter(log=>routeReviewMatches(log,routeHistorySearch));return `<div class="routeHistoryTools471"><input id="routeHistorySearch" type="search" value="${esc(routeHistorySearch)}" placeholder="Search route history, site, vehicle, notes..."><button class="ghost" id="clearRouteSearchBtn" ${routeHistorySearch?"":"disabled"}>Clear</button></div><div class="routeSectionTitle462"><strong>Saved Route Days</strong><span>${filtered.length} of ${saved.length}</span></div>${filtered.length?filtered.map(routeHistoryCard).join(""):(saved.length?`<div class="empty">No saved route days match this search.</div>`:`<div class="empty">No saved route days yet.</div>`)} `})()}
    </div>
  </div>`);
  document.getElementById("backBtn").onclick=()=>route("home");
  const routeSearch=document.getElementById("routeHistorySearch"); if(routeSearch) routeSearch.oninput=()=>{routeHistorySearch=routeSearch.value; routeLog();};
  const routeSearchClear=document.getElementById("clearRouteSearchBtn"); if(routeSearchClear) routeSearchClear.onclick=()=>{routeHistorySearch=""; routeLog();};
  const start=document.getElementById("startRouteBtn"); if(start) start.onclick=startRouteDay;
  const end=document.getElementById("endRouteBtn"); if(end) end.onclick=endRouteDay;
  const pause=document.getElementById("pauseRouteBtn"); if(pause) pause.onclick=pauseRouteDay;
  const resume=document.getElementById("resumeRouteBtn"); if(resume) resume.onclick=resumeRouteDay;
  const copy=document.getElementById("copyRouteBtn"); if(copy) copy.onclick=()=>copyRouteReport(activeRoute||saved[0]);
  const download=document.getElementById("downloadRouteBtn"); if(download) download.onclick=()=>downloadRouteReport(activeRoute||saved[0]);
  const csv=document.getElementById("csvRouteBtn"); if(csv) csv.onclick=()=>downloadRouteCsv(activeRoute||saved[0]);
  const summary=document.getElementById("summaryRouteBtn"); if(summary) summary.onclick=()=>copyRouteCustomerSummary(activeRoute||saved[0]);
  const undo=document.getElementById("undoRouteBtn"); if(undo) undo.onclick=undoLastRouteEvent;
  const saveDetails=document.getElementById("saveRouteDetailsBtn"); if(saveDetails) saveDetails.onclick=saveRouteDetails469;
  const arrived=document.getElementById("arrivedBtn"); if(arrived) arrived.onclick=()=>{ const id=val("routeSiteSelect"); if(!id){toast("Select a site first."); return;} const s=data.sites.find(x=>x.id===id); addRouteEvent("Arrived",`Arrived: ${s?.name||"Site"}`,id); };
  const left=document.getElementById("leftBtn"); if(left) left.onclick=()=>{ const id=val("routeSiteSelect"); if(!id){toast("Select a site first."); return;} const s=data.sites.find(x=>x.id===id); addRouteEvent("Left Site",`Left: ${s?.name||"Site"}`,id); };
  const waypoint=document.getElementById("waypointBtn"); if(waypoint) waypoint.onclick=()=>{ const note=prompt("Waypoint note", "Manual waypoint")||"Manual waypoint"; addRouteEvent("Waypoint",note); };
  const br=document.getElementById("breakBtn"); if(br) br.onclick=()=>{ const note=prompt("Stop note", "Break / Fuel / Parts")||"Break / Fuel / Parts"; addRouteEvent("Stop",note); };
  const nearest=document.getElementById("nearestBtn"); if(nearest) nearest.onclick=checkRouteNearestSite;
  const sugArr=document.getElementById("suggestArriveBtn"); if(sugArr) sugArr.onclick=()=>routeUseSuggestion("Arrived");
  const sugLeft=document.getElementById("suggestLeftBtn"); if(sugLeft) sugLeft.onclick=()=>routeUseSuggestion("Left Site");
  const sugClear=document.getElementById("clearSuggestionBtn"); if(sugClear) sugClear.onclick=clearRouteSuggestion;
  document.querySelectorAll("[data-review-route]").forEach(b=>b.onclick=()=>{ routeReviewId = routeReviewId===b.dataset.reviewRoute ? "" : b.dataset.reviewRoute; routeLog(); });
  document.querySelectorAll("[data-copy-route]").forEach(b=>b.onclick=()=>{ const log=saved.find(x=>x.id===b.dataset.copyRoute); if(log) copyRouteReport(log); });
  document.querySelectorAll("[data-download-route]").forEach(b=>b.onclick=()=>{ const log=saved.find(x=>x.id===b.dataset.downloadRoute); if(log) downloadRouteReport(log); });
  document.querySelectorAll("[data-csv-route]").forEach(b=>b.onclick=()=>{ const log=saved.find(x=>x.id===b.dataset.csvRoute); if(log) downloadRouteCsv(log); });
  document.querySelectorAll("[data-summary-route]").forEach(b=>b.onclick=()=>{ const log=saved.find(x=>x.id===b.dataset.summaryRoute); if(log) copyRouteCustomerSummary(log); });
  document.querySelectorAll("[data-delete-route]").forEach(b=>b.onclick=()=>{ const id=b.dataset.deleteRoute; if(confirm("Delete this saved route day?")){ data.routeLogs=(data.routeLogs||[]).filter(x=>x.id!==id); save(); routeLog(); } });
  document.querySelectorAll("[data-edit-route-event]").forEach(b=>b.onclick=()=>editRouteEvent(b.dataset.editRouteEvent));
  document.querySelectorAll("[data-delete-route-event]").forEach(b=>b.onclick=()=>deleteRouteEvent(b.dataset.deleteRouteEvent));
}

function routeSiteSequence(log){
  const names=(log?.events||[]).filter(e=>e.siteName).map(e=>e.siteName);
  const seq=[];
  names.forEach(n=>{ if(seq[seq.length-1]!==n) seq.push(n); });
  return seq;
}
function routeReviewMatches(log, q){
  if(!q) return true;
  const hay=[log.date, log.vehicle, log.dayNotes, routeDateLabel(log.startedAt||log.date), routeSummaryLine(log), routeSiteSequence(log).join(" "), ...(log.events||[]).flatMap(e=>[e.label,e.type,e.siteName,e.address,e.notes,e.nearestSite])].join(" ").toLowerCase();
  return hay.includes(q.toLowerCase());
}
function routeReviewStats(log){
  const events=log?.events||[];
  const seq=routeSiteSequence(log);
  const start=events[0], end=events[events.length-1];
  return {events,seq,start,end};
}
function routeReviewMiniEvent(e,i){
  const link=routeMapLink(e);
  return `<div class="routeReviewMiniEvent471"><span>${i+1}</span><div><strong>${esc(routeEventTime(e.at))} • ${esc(e.label||e.type)}</strong><small>${esc(e.siteName||e.notes||routeGpsText(e))}</small></div>${link?`<a href="${esc(link)}" target="_blank" rel="noopener">Map</a>`:""}</div>`;
}
function routeReviewPanel(log){
  const st=routeReviewStats(log);
  return `<div class="routeReviewPanel471"><div class="routeReviewStats471"><div><strong>${st.events.length}</strong><span>Points</span></div><div><strong>${st.seq.length}</strong><span>Sites</span></div><div><strong>${esc(routeDistanceLabel(log))}</strong><span>GPS Miles</span></div><div><strong>${esc(routeOdometerMiles(log)===null?"—":String(routeOdometerMiles(log)))}</strong><span>Odo Miles</span></div></div><div class="routeReviewStops471"><strong>Stop Sequence</strong><p>${st.seq.length?esc(st.seq.join(" → ")):"No site stop sequence recorded."}</p></div><div class="routeReviewTimeline471">${st.events.length?st.events.map(routeReviewMiniEvent).join(""):`<div class="empty">No saved points.</div>`}</div></div>`;
}
function routeEventCard(e,editable=false){
  const link=routeMapLink(e);
  return `<div class="card routeEventCard462 routeEventCard465"><div class="routeEventTop462"><div><h2>${esc(e.label||e.type)}</h2><p>${routeEventTime(e.at)}${e.siteName?` • ${esc(e.siteName)}`:""}</p></div><span class="pill">${esc(e.type||"Stop")}</span></div><p>${esc(routeGpsText(e))}</p>${e.address?`<p>${esc(e.address)}</p>`:""}${e.nearestSite?`<p class="fieldNote">Nearest saved site: ${esc(e.nearestSite)} (${esc(e.nearestDistance)})</p>`:""}${e.notes?`<p class="routeNote465">${esc(e.notes)}</p>`:""}<div class="routeEventFooter465">${link?`<a class="btn ghost routeMapBtn462" href="${esc(link)}" target="_blank" rel="noopener">Open Map</a>`:""}${editable?`<button class="ghost" data-edit-route-event="${esc(e.id)}">Edit</button><button class="danger" data-delete-route-event="${esc(e.id)}">Delete</button>`:""}</div></div>`;
}
function routeHistoryCard(log){
  const events=log.events||[];
  const unique=routeSiteSequence(log);
  const reviewOpen=routeReviewId===log.id;
  return `<div class="card routeHistoryCard462 routeHistoryCard471 ${reviewOpen?"openReview471":""}"><div class="routeEventTop462"><div><h2>${routeDateLabel(log.startedAt||log.date)}</h2><p>${routeSummaryLine(log)}</p></div><span class="pill">${log.endedAt?"Saved":"Active"}</span></div><p>${unique.length?esc(unique.slice(0,5).join(" → ")):"No site stops recorded."}</p>${routeOdometerMiles(log)!==null?`<p class="fieldNote">${esc(routeOdometerLabel(log))}${log.vehicle?` • ${esc(log.vehicle)}`:""}</p>`:""}<div class="routeHistoryActions462 routeHistoryActions467 routeHistoryActions471"><button class="primary ${featureOn("routeReview")?"":"featureHidden472"}" data-review-route="${esc(log.id)}">${reviewOpen?"Hide":"Review"}</button><button class="ghost" data-copy-route="${esc(log.id)}">Copy</button><button class="ghost" data-download-route="${esc(log.id)}">TXT</button><button class="ghost ${featureOn("csvExports")?"":"featureHidden472"}" data-csv-route="${esc(log.id)}">CSV</button><button class="ghost" data-summary-route="${esc(log.id)}">Summary</button><button class="danger" data-delete-route="${esc(log.id)}">Delete</button></div>${routeDirectionsLink(log)?`<a class="btn ghost routeMapBtn462" href="${esc(routeDirectionsLink(log))}" target="_blank" rel="noopener">Open Route Map</a>`:""}${(reviewOpen&&featureOn("routeReview"))?routeReviewPanel(log):""}</div>`;
}

function attentionQueue(){
  const rows=attentionRows();
  const attention=rows.filter(r=>r.h.cls==="healthWarn").length;
  const watch=rows.filter(r=>r.h.cls==="healthWatch").length;
  const gpsNeeded=rows.filter(r=>r.h.missingGps).length;
  html(`<div class="screen attentionScreen"><div class="row"><button class="back ghost" id="backBtn">←</button><h1>Attention Queue</h1></div>
    <div class="card attentionHero"><div><strong>${rows.length}</strong><span>Sites to Review</span></div><div><strong>${attention}</strong><span>Attention</span></div><div><strong>${watch}</strong><span>Watch</span></div><div><strong>${gpsNeeded}</strong><span>GPS Needed</span></div></div>
    <div class="list grow attentionList">${rows.length?rows.map(r=>`<div class="card attentionItem ${r.h.cls}" data-id="${esc(r.s.id)}"><div class="attentionTop"><div><h2>${esc(r.s.name||"Unnamed Site")}</h2><p>${esc(fullAddress(r.s))}</p></div><span class="healthScore smallScore">${r.h.score}%</span></div><div class="attentionLine">${esc(attentionActionLine(r))}</div><div class="attentionMini"><span>${r.h.openTasks} open tasks</span><span>${r.h.openDef} deficiencies</span><span>${r.h.equipmentIssues} equipment issues</span></div></div>`).join(""):`<div class="empty">No priority issues found. Sites look clean.</div>`}</div>
  </div>`);
  document.getElementById("backBtn").onclick=()=>route("home");
  document.querySelectorAll(".attentionItem").forEach(el=>el.onclick=()=>{selectedSiteId=el.dataset.id; route("siteDetail");});
}

function sites(){
  const gpsSavedCount = data.sites.filter(hasGps).length;
  const attentionCount = data.sites.filter(s=>siteHealth(s).cls === "healthWarn").length;
  html(`<div class="screen sitesScreen423 sitesScreen432"><div class="row"><h1>Sites</h1><div class="miniActions"><button class="ghost smallBtn" id="nearBtn">Nearby</button><button class="primary" id="addBtn">＋</button></div></div>
    <div class="card siteFinderCard"><div class="siteFinderTop"><input id="siteSearch" type="search" placeholder="Search sites, panels, contacts, equipment..." value="${esc(siteSearch)}" autocomplete="off"><button class="ghost smallBtn" id="clearSiteSearch">Clear</button></div><div class="siteFinderHint"><span id="siteSearchCount">${data.sites.length} site${data.sites.length===1?"":"s"}</span><span>Searches all saved vault details</span></div></div>
    <div class="card gpsStatusBar"><div><strong>GPS / Nearby</strong><p>${gpsSavedCount} site${gpsSavedCount===1?"":"s"} with GPS saved • ${attentionCount} need attention • radius ${nearbyRadiusMiles()} mi</p></div><button class="ghost smallBtn" id="gpsStripScan">Scan Nearby</button></div>
    <div class="list grow siteSearchList">${data.sites.length?data.sites.map(s=>`<div class="card siteItem redline" data-id="${esc(s.id)}" data-search="${esc(siteSearchBlob(s))}"><div class="row"><div><h2>${esc(s.name||"Unnamed Site")}</h2><p>${esc(fullAddress(s))}</p><p>${esc([s.panelManufacturer,s.panelModel].filter(Boolean).join(" ")||"Panel not entered")}</p></div><div class="sitePills"><span class="pill healthPill ${siteHealth(s).cls}">${siteHealth(s).label} ${siteHealth(s).score}%</span><span class="pill">${(s.tasks||[]).filter(t=>(t.status||"Open")!=="Done").length} open</span><span class="pill">${(s.equipment||[]).length} equip</span><span class="pill ${hasGps(s)?"gpsPill":"noGpsPill"}">${hasGps(s)?"GPS saved":"No GPS"}</span></div></div></div>`).join(""):`<div class="empty">No sites yet. Add your first customer vault.</div>`}</div></div>`);
  document.getElementById("addBtn").onclick=()=>{selectedSiteId=null; mode=null; route("siteForm");};
  document.getElementById("nearBtn").onclick=detectNearbySites;
  document.getElementById("gpsStripScan").onclick=detectNearbySites;
  const searchEl=document.getElementById("siteSearch");
  const clearBtn=document.getElementById("clearSiteSearch");
  const countEl=document.getElementById("siteSearchCount");
  const applySiteSearch=()=>{
    siteSearch=(searchEl?.value||"").trim().toLowerCase();
    let shown=0;
    document.querySelectorAll(".siteSearchList .siteItem").forEach(el=>{
      const ok=!siteSearch || (el.dataset.search||"").includes(siteSearch);
      el.hidden=!ok;
      if(ok) shown++;
    });
    if(countEl) countEl.textContent = `${shown} of ${data.sites.length} site${data.sites.length===1?"":"s"}`;
    if(clearBtn) clearBtn.style.visibility = siteSearch ? "visible" : "hidden";
  };
  if(searchEl){ searchEl.oninput=applySiteSearch; applySiteSearch(); }
  if(clearBtn) clearBtn.onclick=()=>{ if(searchEl){ searchEl.value=""; searchEl.focus(); } applySiteSearch(); };
  document.querySelectorAll(".siteItem").forEach(el=>el.onclick=()=>{selectedSiteId=el.dataset.id; route("siteDetail");});
}


function nearbySites(){
  const radius=nearbyRadiusMiles();
  const gpsCount=data.sites.filter(hasGps).length;
  const rows=nearbyState ? gpsSiteDistances(nearbyState.lat, nearbyState.lng) : [];
  const nearby=rows.filter(r=>r.meters <= radius*1609.344);
  const shown=nearby.length ? nearby : rows.slice(0,5);
  const status=nearbyState ? `${nearby.length} within ${radius} mi • Accuracy ±${nearbyState.accuracy||0} m` : `${gpsCount} saved site${gpsCount===1?"":"s"} with GPS`;
  html(`<div class="screen nearbyScreen"><div class="row"><button class="back ghost" id="backBtn">←</button><button class="primary smallBtn" id="scanNearbyBtn">Scan</button></div>
    <div class="card nearbyHero"><h1>Nearby Sites</h1><p>${esc(status)}</p><p class="fieldNote">This uses your current phone GPS and compares it to saved site coordinates.</p></div>
    <div class="list grow">${nearbyState ? (shown.length ? shown.map(r=>`<div class="card siteItem nearbyItem ${r.meters <= radius*1609.344 ? "nearMatch" : "nearFallback"}" data-id="${r.s.id}"><div class="row"><div><h2>${esc(r.s.name||"Unnamed Site")}</h2><p>${esc(fullAddress(r.s))}</p><p>${esc(gpsLine(r.s))}</p></div><span class="pill gpsPill">${distanceLabel(r.meters)}</span></div></div>`).join("") : `<div class="empty">No saved GPS sites found. Open a site and capture GPS first.</div>`) : `<div class="empty">Tap Scan to detect saved sites near your current location.</div>`}</div>
  </div>`);
  document.getElementById("backBtn").onclick=()=>route("home");
  document.getElementById("scanNearbyBtn").onclick=detectNearbySites;
  document.querySelectorAll(".nearbyItem").forEach(el=>el.onclick=()=>{selectedSiteId=el.dataset.id; route("siteDetail");});
}

function siteDetail(){
  const s=site(); if(!s){ route("sites"); return; }
  const open=(s.tasks||[]).filter(t=>(t.status||"Open")!=="Done").length;
  const def=(s.deficiencies||[]).filter(d=>(d.status||"Open")!=="Closed").length;
  const siteVisits=Array.isArray(s.visits) ? s.visits : [];
  const equipment=Array.isArray(s.equipment) ? s.equipment : [];
  const contacts=Array.isArray(s.contacts) ? s.contacts : [];
  const docs=Array.isArray(s.docs) ? s.docs : [];
  const checklistItems=Array.isArray(s.checklist) ? s.checklist : [];
  const checkStats=checklistStats(s);
  const health=siteHealth(s);
  html(`<div class="screen siteDetailScreen446"><div class="row siteTopBar"><button class="back ghost" id="backBtn">←</button><button class="ghost" id="editBtn">Edit</button></div>
    <div class="card redline siteHero446"><h1>${esc(s.name)}</h1><p>${esc(fullAddress(s))}</p><p>${esc([s.panelManufacturer,s.panelModel].filter(Boolean).join(" ")||"Panel not entered")}</p></div>
    <div class="card healthSnapshotCard ${health.cls}"><div class="healthSnapshotTop"><div><h2>Site Health</h2><p>${esc(health.details.join(" • "))}</p></div><span class="healthScore">${health.score}%</span></div><div class="healthBars"><span><strong>${health.openTasks}</strong> Open</span><span><strong>${health.openDef}</strong> Def</span><span><strong>${health.equipmentIssues}</strong> Equip</span></div></div>
    <div class="card snapshotCard"><div><h2>Field Snapshot</h2><p>One-tap summary with address, GPS, contacts/access, open tasks, deficiencies, equipment attention, documents, and notes.</p></div><button class="primary smallBtn" id="copySnapshotCardBtn">Share / Copy</button></div>
    <div class="grid2 siteActionGrid446">
      <button class="primary tile" id="jobBtn"><strong>Start Job</strong><span>Live service call</span></button>
      <button class="ghost tile ${featureOn("reports")?"":"featureHidden472"}" id="reportBtn"><strong>Report</strong><span>Copy/download</span></button>
      <button class="ghost tile snapshotTile" id="snapshotBtn"><strong>Snapshot</strong><span>Share field summary</span></button>
      <button class="ghost tile checklistTile" id="checklistBtn"><strong>${checklistItems.length ? checkStats.progress + "%" : "New"}</strong><span>Checklist</span></button>
      <button class="ghost tile" id="taskBtn"><strong>${open}</strong><span>Open Tasks</span></button>
      <button class="ghost tile" id="defBtn"><strong>${def}</strong><span>Deficiencies</span></button>
      <button class="ghost tile ${featureOn("equipment")?"":"featureHidden472"}" id="equipmentBtn"><strong>${equipment.length}</strong><span>Equipment</span></button>
      <button class="ghost tile" id="contactsBtn"><strong>${contacts.length}</strong><span>Contacts / Access</span></button>
      <button class="ghost tile" id="docsBtn"><strong>${docs.length}</strong><span>Documents / Links</span></button>
    </div>
    <div class="card gpsCard ${featureOn("advancedGps")?"":"featureHidden472"}"><div class="row"><div><h2>GPS / Maps</h2><p>${esc(gpsLine(s))}</p></div>${data.settings.gps?.enabled===false?"":`<button id="captureGpsBtn" class="primary smallBtn">Capture GPS</button>`}</div><div class="mapActions"><button id="appleBtn" class="ghost">Apple Maps</button><button id="googleBtn" class="ghost">Google Maps</button></div></div>
    <div class="card checklistMiniCard"><div class="row"><div><h2>Inspection Checklist</h2><p>${checklistItems.length ? `${checkStats.progress}% complete • ${checkStats.issue} issue${checkStats.issue===1?"":"s"} • ${checkStats.pending} pending • ${checklistLastSavedLine(s)}` : "Default fire alarm field checklist ready to start."}</p></div><button class="ghost smallBtn" id="manageChecklistBtn">Open</button></div><div class="checkMiniBar"><span style="width:${checkStats.progress}%"></span></div></div>
    <div class="card contactsMiniCard"><div class="row"><div><h2>Contacts & Access</h2><p>${contacts.length ? `${contacts.length} saved contact${contacts.length===1?"":"s"}` : "Customer, access, gate, and after-hours details."}</p></div><button class="ghost smallBtn" id="manageContactsBtn">Manage</button></div>${contacts.length?contacts.slice(0,3).map(c=>`<button class="contactLine" data-contact="${esc(c.id)}"><strong>${esc(contactTitle(c))}</strong><span>${esc(contactMeta(c))}</span></button>`).join(""):`<p class="fieldNote">Add customer contacts, access codes, lockbox notes, or monitoring center details here.</p>`}</div>
    <div class="card equipmentMiniCard ${featureOn("equipment")?"":"featureHidden472"}"><div class="row"><div><h2>Equipment Vault</h2><p>${equipment.length ? `${equipment.length} saved equipment item${equipment.length===1?"":"s"}` : "Panel, communicator, power supply, and device notes."}</p></div><button class="ghost smallBtn" id="manageEquipmentBtn">Manage</button></div>${equipment.length?equipment.slice(0,3).map(e=>`<button class="equipmentLine" data-eq="${esc(e.id)}"><strong>${esc(equipmentTitle(e))}</strong><span>${esc(e.location||e.type||"No location entered")}</span></button>`).join(""):`<p class="fieldNote">Add the panel, communicator, power supplies, and important site equipment here.</p>`}</div>
    <div class="card docsMiniCard"><div class="row"><div><h2>Documents / Links</h2><p>${docs.length ? `${docs.length} saved document${docs.length===1?"":"s"}` : "Manuals, permits, forms, and site reference links."}</p></div><button class="ghost smallBtn" id="manageDocsBtn">Manage</button></div>${docs.length?docs.slice(0,3).map(d=>`<button class="docLineMini" data-doc="${esc(d.id)}"><strong>${esc(docTitle(d))}</strong><span>${esc(docMeta(d))}</span></button>`).join(""):`<p class="fieldNote">Add PDF links, panel manuals, account references, permit numbers, or inspection form notes here.</p>`}</div>
    <div class="card recentVisitsCard visitLogCard"><div class="row"><div><h2>Visit History</h2><p>${siteVisits.length ? `${siteVisits.length} completed visit${siteVisits.length===1?"":"s"}` : "No completed visits yet."}</p></div>${siteVisits.length?`<button class="ghost smallBtn" id="allVisitsBtn">View All</button>`:""}</div>${siteVisits.length?siteVisits.slice(0,3).map(v=>`<button class="visitMini visitMiniButton" data-visit="${esc(v.id)}"><strong>${esc(visitDateLabel(v))}</strong><span>${esc(durationText(v.startedAt,v.endedAt))}</span><p>${esc(visitNotesPreview(v,2))}</p></button>`).join(""):`<p class="fieldNote">Finish a Job Mode service call and it will appear here.</p>`}</div>
    <div class="card grow"><h2>Site Notes</h2><p>${esc(s.notes || "No notes entered.")}</p></div>
  </div>`);
  document.getElementById("backBtn").onclick=()=>route("sites");
  document.getElementById("editBtn").onclick=()=>{mode="edit"; route("siteForm");};
  document.getElementById("taskBtn").onclick=()=>route("tasks");
  document.getElementById("defBtn").onclick=()=>route("deficiencies");
  document.getElementById("equipmentBtn").onclick=()=>route("equipmentList");
  document.getElementById("contactsBtn").onclick=()=>route("contactsList");
  document.getElementById("docsBtn").onclick=()=>route("siteDocs");
  document.getElementById("reportBtn").onclick=()=>route("report");
  document.getElementById("snapshotBtn").onclick=shareSiteSnapshot;
  document.getElementById("checklistBtn").onclick=()=>route("checklist");
  const manageChecklist=document.getElementById("manageChecklistBtn"); if(manageChecklist) manageChecklist.onclick=()=>route("checklist");
  document.getElementById("copySnapshotCardBtn").onclick=shareSiteSnapshot;
  document.getElementById("jobBtn").onclick=startJob;
  const gpsBtn=document.getElementById("captureGpsBtn"); if(gpsBtn) gpsBtn.onclick=captureGpsForSite;
  document.getElementById("appleBtn").onclick=()=>window.open(mapUrl(s,"apple"),"_blank");
  document.getElementById("googleBtn").onclick=()=>window.open(mapUrl(s,"google"),"_blank");
  const manageContacts=document.getElementById("manageContactsBtn"); if(manageContacts) manageContacts.onclick=()=>route("contactsList");
  document.querySelectorAll(".contactLine").forEach(b=>b.onclick=()=>{mode=b.dataset.contact; route("contactForm");});
  const manageEq=document.getElementById("manageEquipmentBtn"); if(manageEq) manageEq.onclick=()=>route("equipmentList");
  document.querySelectorAll(".equipmentLine").forEach(b=>b.onclick=()=>{mode=b.dataset.eq; route("equipmentForm");});
  const manageDocs=document.getElementById("manageDocsBtn"); if(manageDocs) manageDocs.onclick=()=>route("siteDocs");
  document.querySelectorAll(".docLineMini").forEach(b=>b.onclick=()=>{mode=b.dataset.doc; route("siteDocForm");});
  const allVisits=document.getElementById("allVisitsBtn"); if(allVisits) allVisits.onclick=()=>route("visits");
  document.querySelectorAll(".visitMiniButton").forEach(b=>b.onclick=()=>{mode=b.dataset.visit; route("visitDetail");});
}



function docTitle(d){ return [d.type,d.title].filter(Boolean).join(" • ") || "Document / Link"; }
function docMeta(d){
  const parts=[];
  if(d.ref) parts.push(d.ref);
  if(d.url) parts.push("Link saved");
  if(d.date) parts.push(d.date);
  return parts.join(" • ") || "No reference details entered";
}
function docReportLine(d){
  const main=`- ${docTitle(d)}${d.ref?` | Ref ${d.ref}`:""}${d.date?` | ${d.date}`:""}${d.url?` | ${d.url}`:""}`;
  const notes=d.notes ? `\n  Notes: ${String(d.notes).replaceAll("\n","\n  ")}` : "";
  return main + notes;
}
function siteDocs(){
  const s=site(); if(!s){ route("sites"); return; }
  s.docs=Array.isArray(s.docs) ? s.docs : [];
  const docs=s.docs;
  const linked=docs.filter(d=>d.url).length;
  html(`<div class="screen docsScreen"><div class="row"><button class="back ghost" id="backBtn">←</button><div><h1>Documents / Links</h1><p>${esc(s.name||"Site")}</p></div><button class="primary" id="addDocBtn">＋</button></div>
    <div class="card docsHero"><h2>Site Documents Vault</h2><p>Keep the field references that are specific to this customer: manuals, permits, inspection forms, account numbers, and useful links.</p><div class="docStats"><span><strong>${docs.length}</strong>Total</span><span><strong>${linked}</strong>Links</span><span><strong>${docs.length-linked}</strong>Notes</span></div></div>
    <div class="list grow docsList">${docs.length?docs.map(d=>`<div class="card docVaultItem" data-doc="${esc(d.id)}"><div class="row"><div><h2>${esc(docTitle(d))}</h2><p>${esc(docMeta(d))}</p></div><span class="pill">${esc(d.type||"Doc")}</span></div>${d.notes?`<p class="docNotes">${esc(String(d.notes).split("\n").slice(0,2).join(" • "))}</p>`:""}<div class="docQuickActions">${d.url?`<button class="ghost smallBtn openDocLink" data-url="${esc(d.url)}">Open Link</button>`:""}<button class="ghost smallBtn copyDocRef" data-doc="${esc(d.id)}">Copy</button></div></div>`).join(""):`<div class="empty">No documents or links saved yet. Add a panel manual, permit number, inspection form, or account reference.</div>`}</div>
  </div>`);
  document.getElementById("backBtn").onclick=()=>route("siteDetail");
  document.getElementById("addDocBtn").onclick=()=>{mode=null; route("siteDocForm");};
  document.querySelectorAll(".docVaultItem").forEach(b=>b.onclick=()=>{mode=b.dataset.doc; route("siteDocForm");});
  document.querySelectorAll(".openDocLink").forEach(b=>b.onclick=e=>{e.stopPropagation(); window.open(b.dataset.url,"_blank");});
  document.querySelectorAll(".copyDocRef").forEach(b=>b.onclick=async e=>{e.stopPropagation(); const d=docs.find(x=>x.id===b.dataset.doc); if(d){ await navigator.clipboard.writeText(`${docTitle(d)}\n${d.url||""}\n${d.notes||""}`.trim()); toast("Document reference copied."); }});
}
function siteDocForm(){
  const s=site(); if(!s){ route("sites"); return; }
  s.docs=Array.isArray(s.docs) ? s.docs : [];
  const d=mode ? s.docs.find(x=>x.id===mode) : {};
  const types=["Panel Manual","Permit","Inspection Form","Monitoring Account","Contract","Photo Set","Map / Drawing","Code Reference","Other"];
  html(`<div class="screen"><div class="row"><button class="back ghost" id="backBtn">←</button><h1>${mode?"Edit":"Add"} Document</h1></div><div class="form grow">
    <div class="card docFormCard"><div class="compactField"><div><label>Type</label><select id="docType">${types.map(x=>`<option value="${esc(x)}" ${((d.type||"Panel Manual")===x)?"selected":""}>${esc(x)}</option>`).join("")}</select></div><div><label>Date / Revision</label><input id="docDate" value="${esc(d.date||"")}" placeholder="Rev, date, or version"></div></div>
    <label>Title</label><input id="docTitle" value="${esc(d.title||"")}" placeholder="Notifier NFS2-640 manual, annual inspection form...">
    <label>Reference / Account / Permit #</label><input id="docRef" value="${esc(d.ref||"")}" placeholder="Account number, permit number, drawing ID...">
    <label>URL / Link</label><input id="docUrl" value="${esc(d.url||"")}" placeholder="https://...">
    <label>Notes</label><textarea id="docNotes" placeholder="Where to find it, customer-specific instructions, page numbers, revision notes...">${esc(d.notes||"")}</textarea></div>
    <button class="primary" id="saveDocBtn">Save Document</button>${mode?`<button class="danger" id="deleteDocBtn">Delete Document</button>`:""}
  </div></div>`);
  document.getElementById("backBtn").onclick=()=>route("siteDocs");
  document.getElementById("saveDocBtn").onclick=()=>{
    const obj={type:val("docType"),title:val("docTitle")||"Untitled Reference",ref:val("docRef"),url:val("docUrl"),date:val("docDate"),notes:raw("docNotes")};
    if(mode && d){ Object.assign(d,obj); }
    else s.docs.unshift({...obj,id:uid(),createdAt:new Date().toISOString()});
    save(); toast("Document saved."); route("siteDocs");
  };
  const del=document.getElementById("deleteDocBtn"); if(del) del.onclick=()=>{ if(confirm("Delete this document reference?")){ s.docs=s.docs.filter(x=>x.id!==mode); save(); toast("Document deleted."); route("siteDocs"); } };
}

function contactTitle(c){ return [c.name,c.role].filter(Boolean).join(" • ") || c.type || "Contact"; }
function contactMeta(c){
  const parts=[];
  if(c.type) parts.push(c.type);
  if(c.phone) parts.push(c.phone);
  if(c.email) parts.push(c.email);
  if(c.afterHours) parts.push("After hours");
  return parts.join(" • ") || "No phone or email entered";
}
function contactReportLine(c){
  const main=`- ${contactTitle(c)}${c.phone?` | ${c.phone}`:""}${c.email?` | ${c.email}`:""}${c.afterHours?" | After hours":""}`;
  const access=c.accessNotes ? `\n  Access: ${String(c.accessNotes).replaceAll("\n","\n  ")}` : "";
  const notes=c.notes ? `\n  Notes: ${String(c.notes).replaceAll("\n","\n  ")}` : "";
  return main + access + notes;
}
function contactsList(){
  const s=site(); if(!s){ route("sites"); return; }
  s.contacts=Array.isArray(s.contacts) ? s.contacts : [];
  const contacts=s.contacts;
  const counts={
    total:contacts.length,
    access:contacts.filter(c=>c.accessNotes || String(c.type||"").toLowerCase().includes("access")).length,
    afterHours:contacts.filter(c=>c.afterHours).length
  };
  html(`<div class="screen contactsScreen"><div class="row"><button class="back ghost" id="backBtn">←</button><div><h1>Contacts & Access</h1><p>${esc(s.name||"Site")}</p></div><button class="primary" id="addContactBtn">＋</button></div>
    <div class="card contactsHero"><h2>Site Contacts</h2><p>Keep customer contacts, gate/lockbox notes, monitoring details, and after-hours access in one field-ready vault.</p><div class="contactStats"><span><strong>${counts.total}</strong>Total</span><span><strong>${counts.access}</strong>Access</span><span><strong>${counts.afterHours}</strong>After Hours</span></div></div>
    <div class="list grow contactList">${contacts.length?contacts.map(c=>`<div class="card contactItem" data-contact="${esc(c.id)}"><div class="row contactItemTop"><div><h2>${esc(contactTitle(c))}</h2><p>${esc(contactMeta(c))}</p></div><span class="pill">${esc(c.type||"Contact")}</span></div>${c.accessNotes?`<p class="accessNotes">${esc(c.accessNotes)}</p>`:""}${c.notes?`<p class="contactNotes">${esc(c.notes)}</p>`:""}<div class="contactQuickActions">${c.phone?`<button class="ghost smallBtn contactCallBtn" data-phone="${esc(c.phone)}">Call</button>`:""}${c.email?`<button class="ghost smallBtn contactEmailBtn" data-email="${esc(c.email)}">Email</button>`:""}<button class="ghost smallBtn contactEditBtn" data-contact="${esc(c.id)}">Edit</button></div></div>`).join(""):`<div class="empty">No contacts saved yet. Add a customer, property manager, gate code, or monitoring contact.</div>`}</div>
  </div>`);
  document.getElementById("backBtn").onclick=()=>route("siteDetail");
  document.getElementById("addContactBtn").onclick=()=>{mode=null; route("contactForm");};
  document.querySelectorAll(".contactItem").forEach(b=>b.onclick=()=>{mode=b.dataset.contact; route("contactForm");});
  document.querySelectorAll(".contactEditBtn").forEach(b=>b.onclick=e=>{e.stopPropagation(); mode=b.dataset.contact; route("contactForm");});
  document.querySelectorAll(".contactCallBtn").forEach(b=>b.onclick=e=>{e.stopPropagation(); location.href=`tel:${b.dataset.phone}`;});
  document.querySelectorAll(".contactEmailBtn").forEach(b=>b.onclick=e=>{e.stopPropagation(); location.href=`mailto:${b.dataset.email}`;});
}
function contactForm(){
  const s=site(); if(!s){ route("sites"); return; }
  s.contacts=Array.isArray(s.contacts) ? s.contacts : [];
  const c=mode ? s.contacts.find(x=>x.id===mode) : {};
  const types=["Customer","Property Manager","Maintenance","Security","Monitoring","Emergency","Access","Other"];
  html(`<div class="screen"><div class="row"><button class="back ghost" id="backBtn">←</button><h1>${mode?"Edit":"Add"} Contact</h1></div><div class="form grow">
    <div class="card contactFormCard"><div class="compactField"><div><label>Type</label><select id="contactType">${types.map(x=>`<option value="${esc(x)}" ${((c.type||"Customer")===x)?"selected":""}>${esc(x)}</option>`).join("")}</select></div><div><label>Role / Title</label><input id="contactRole" value="${esc(c.role||"")}" placeholder="Manager, owner, security"></div></div>
    <label>Name</label><input id="contactName" value="${esc(c.name||"")}" placeholder="Contact name or department">
    <div class="compactField"><div><label>Phone</label><input id="contactPhone" inputmode="tel" value="${esc(c.phone||"")}"></div><div><label>Email</label><input id="contactEmail" inputmode="email" value="${esc(c.email||"")}"></div></div>
    <label class="checkRow inlineCheck"><input type="checkbox" id="contactAfterHours" ${c.afterHours?"checked":""}> After-hours / emergency contact</label>
    <label>Access Notes</label><textarea id="contactAccess" placeholder="Gate code, key box, panel room access, alarm account, call-before-entry notes...">${esc(c.accessNotes||"")}</textarea>
    <label>General Notes</label><textarea id="contactNotes" placeholder="Preferences, instructions, who to notify, billing notes...">${esc(c.notes||"")}</textarea></div>
    <button class="primary" id="saveContactBtn">Save Contact</button>${mode?`<button class="danger" id="deleteContactBtn">Delete Contact</button>`:""}
  </div></div>`);
  document.getElementById("backBtn").onclick=()=>route("contactsList");
  document.getElementById("saveContactBtn").onclick=()=>{
    const obj={type:val("contactType"),role:val("contactRole"),name:val("contactName"),phone:val("contactPhone"),email:val("contactEmail"),afterHours:checked("contactAfterHours"),accessNotes:raw("contactAccess"),notes:raw("contactNotes")};
    if(mode && c){ Object.assign(c,obj); }
    else s.contacts.unshift({...obj,id:uid(),createdAt:new Date().toISOString()});
    save(); toast("Contact saved."); route("contactsList");
  };
  const del=document.getElementById("deleteContactBtn"); if(del) del.onclick=()=>{ if(confirm("Delete this contact?")){ s.contacts=s.contacts.filter(x=>x.id!==mode); save(); toast("Contact deleted."); route("contactsList"); } };
}

function equipmentTitle(e){ return [e.type,e.make,e.model].filter(Boolean).join(" • ") || "Equipment"; }
function equipmentStatusClass(e){
  const status=String(e?.status||"Active").toLowerCase();
  if(status.includes("attention")) return "equipmentNeedsAttention";
  if(status.includes("replaced")) return "equipmentReplaced";
  if(status.includes("removed")) return "equipmentRemoved";
  return "equipmentActive";
}
function equipmentMeta(e){
  const parts=[];
  if(e.location) parts.push(e.location);
  if(e.serial) parts.push(`Serial ${e.serial}`);
  if(e.date) parts.push(`Checked ${e.date}`);
  return parts.join(" • ") || "No location or checked date entered";
}
function updateEquipmentStatus(eqId,status){
  const s=site(); if(!s) return;
  s.equipment=Array.isArray(s.equipment) ? s.equipment : [];
  const e=s.equipment.find(x=>x.id===eqId);
  if(!e) return;
  e.status=status;
  e.date=localDateString();
  e.lastCheckedAt=new Date().toISOString();
  if(status==="Needs Attention"){
    s.tasks=Array.isArray(s.tasks) ? s.tasks : [];
    const title=`Equipment attention: ${equipmentTitle(e)}`;
    const exists=s.tasks.some(t=>(t.status||"Open")!=="Done" && t.title===title);
    if(!exists){
      s.tasks.unshift({id:uid(),title,status:"Open",due:"",notes:`Created from Equipment Vault on ${fmtDate()}.\n${equipmentMeta(e)}${e.notes?`\n\nEquipment notes: ${e.notes}`:""}`,source:"Equipment Vault",equipmentId:e.id,createdAt:new Date().toISOString()});
    }
    toast(exists ? "Equipment flagged. Open task already exists." : "Equipment flagged and task created.");
  } else {
    toast(status==="Active" ? "Equipment checked OK." : `Equipment marked ${status}.`);
  }
  save();
  render();
}
function equipmentList(){
  const s=site(); if(!s){ route("sites"); return; }
  const equipment=Array.isArray(s.equipment) ? s.equipment : [];
  const counts={
    active:equipment.filter(e=>(e.status||"Active")==="Active").length,
    attention:equipment.filter(e=>(e.status||"").includes("Attention")).length,
    replaced:equipment.filter(e=>(e.status||"")==="Replaced").length
  };
  html(`<div class="screen equipmentScreen"><div class="row"><button class="back ghost" id="backBtn">←</button><div><h1>Equipment Vault</h1><p>${esc(s.name||"Site")}</p></div><button class="primary" id="addEquipmentBtn">＋</button></div>
    <div class="card equipmentHero equipmentHero429"><h2>Site Equipment</h2><p>Quickly mark hardware checked, flag attention items, and create equipment follow-up tasks from the field.</p><div class="equipmentStats"><span><strong>${equipment.length}</strong>Total</span><span><strong>${counts.active}</strong>Active</span><span><strong>${counts.attention}</strong>Attention</span></div></div>
    <div class="list grow equipmentList">${equipment.length?equipment.map(e=>`<div class="card equipmentItem equipmentItem429" data-eq="${esc(e.id)}"><div class="row equipmentItemTop"><div><h2>${esc(equipmentTitle(e))}</h2><p>${esc(equipmentMeta(e))}</p></div><span class="pill equipmentStatusPill ${equipmentStatusClass(e)}">${esc(e.status||"Active")}</span></div>${e.notes?`<p class="equipmentNotes">${esc(e.notes)}</p>`:""}<div class="equipmentQuickActions"><button class="ghost smallBtn eqQuickBtn eqOkBtn" data-eq="${esc(e.id)}" data-status="Active">Checked OK</button><button class="ghost smallBtn eqQuickBtn eqIssueBtn" data-eq="${esc(e.id)}" data-status="Needs Attention">Flag Issue</button><button class="ghost smallBtn eqQuickBtn eqReplacedBtn" data-eq="${esc(e.id)}" data-status="Replaced">Replaced</button></div></div>`).join(""):`<div class="empty">No equipment saved yet. Add the panel or communicator first.</div>`}</div>
  </div>`);
  document.getElementById("backBtn").onclick=()=>route("siteDetail");
  document.getElementById("addEquipmentBtn").onclick=()=>{mode=null; route("equipmentForm");};
  document.querySelectorAll(".equipmentItem").forEach(b=>b.onclick=()=>{mode=b.dataset.eq; route("equipmentForm");});
  document.querySelectorAll(".eqQuickBtn").forEach(b=>b.onclick=e=>{e.stopPropagation(); updateEquipmentStatus(b.dataset.eq,b.dataset.status);});
}
function equipmentForm(){
  const s=site(); if(!s){ route("sites"); return; }
  s.equipment=Array.isArray(s.equipment) ? s.equipment : [];
  const e=mode ? s.equipment.find(x=>x.id===mode) : {};
  const types=["Fire Alarm Panel","Communicator","Power Supply","NAC Extender","Annunciator","Smoke Detector","Pull Station","Notification Appliance","Other"];
  const statuses=["Active","Needs Attention","Replaced","Removed"];
  const intervals=["None","Monthly","Quarterly","Semiannual","Annual","Two Year"];
  html(`<div class="screen"><div class="row"><button class="back ghost" id="backBtn">←</button><h1>${mode?"Edit":"Add"} Equipment</h1></div><div class="form grow">
    <div class="card equipmentFormCard"><div class="compactField"><div><label>Type</label><select id="eqType">${types.map(x=>`<option value="${esc(x)}" ${e.type===x?"selected":""}>${esc(x)}</option>`).join("")}</select></div><div><label>Status</label><select id="eqStatus">${statuses.map(x=>`<option value="${esc(x)}" ${((e.status||"Active")===x)?"selected":""}>${esc(x)}</option>`).join("")}</select></div></div>
    <label>Location</label><input id="eqLocation" value="${esc(e.location||"")}" placeholder="Panel room, riser room, lobby, etc.">
    <div class="compactField"><div><label>Make</label><input id="eqMake" value="${esc(e.make||"")}"></div><div><label>Model</label><input id="eqModel" value="${esc(e.model||"")}"></div></div>
    <div class="compactField"><div><label>Serial / ID</label><input id="eqSerial" value="${esc(e.serial||"")}"></div><div><label>Installed / Checked</label><input id="eqDate" type="date" value="${esc(e.date||"")}"></div></div>
    <div class="compactField"><div><label>Service Interval</label><select id="eqInterval">${intervals.map(x=>`<option value="${esc(x)}" ${((e.interval||"None")===x)?"selected":""}>${esc(x)}</option>`).join("")}</select></div><div><label>Last Quick Check</label><input value="${esc(e.lastCheckedAt ? new Date(e.lastCheckedAt).toLocaleString([], {month:'short',day:'numeric',hour:'numeric',minute:'2-digit'}) : 'Not checked yet')}" disabled></div></div>
    <label>Notes</label><textarea id="eqNotes" placeholder="Battery date, account number, loop notes, quirks, access notes...">${esc(e.notes||"")}</textarea></div>
    ${mode?`<div class="card equipmentActionPanel"><h2>Field Actions</h2><p>Quick actions update status, checked date, and create a follow-up task if attention is needed.</p><div class="equipmentQuickActions"><button class="ghost smallBtn eqFormStatus" data-status="Active">Checked OK</button><button class="ghost smallBtn eqFormStatus" data-status="Needs Attention">Flag Issue</button><button class="ghost smallBtn eqFormStatus" data-status="Replaced">Replaced</button></div></div>`:""}
    <button class="primary" id="saveEquipmentBtn">Save Equipment</button>${mode?`<button class="danger" id="deleteEquipmentBtn">Delete Equipment</button>`:""}
  </div></div>`);
  document.getElementById("backBtn").onclick=()=>route("equipmentList");
  document.getElementById("saveEquipmentBtn").onclick=()=>{
    const obj={type:val("eqType"),status:val("eqStatus"),location:val("eqLocation"),make:val("eqMake"),model:val("eqModel"),serial:val("eqSerial"),date:val("eqDate"),interval:val("eqInterval"),notes:raw("eqNotes")};
    if(mode && e){ Object.assign(e,obj); }
    else s.equipment.unshift({...obj,id:uid(),createdAt:new Date().toISOString()});
    save(); toast("Equipment saved."); route("equipmentList");
  };
  document.querySelectorAll(".eqFormStatus").forEach(b=>b.onclick=e=>{e.preventDefault(); updateEquipmentStatus(mode,b.dataset.status);});
  const del=document.getElementById("deleteEquipmentBtn"); if(del) del.onclick=()=>{ if(confirm("Delete this equipment item?")){ s.equipment=s.equipment.filter(x=>x.id!==mode); save(); toast("Equipment deleted."); route("equipmentList"); } };
}

function visits(){
  const s=site(); if(!s){ route("sites"); return; }
  const siteVisits=Array.isArray(s.visits) ? s.visits : [];
  html(`<div class="screen visitLogScreen"><div class="row"><button class="back ghost" id="backBtn">←</button><h1>Visit Log</h1></div>
    <div class="card visitLogHero"><h2>${esc(s.name)}</h2><p>${siteVisits.length ? `${siteVisits.length} saved visit${siteVisits.length===1?"":"s"}` : "No completed visits yet."}</p><button class="primary smallBtn" id="startVisitBtn">Start New Visit</button></div>
    <div class="list grow">${siteVisits.length?siteVisits.map(v=>`<button class="card visitLogItem" data-visit="${esc(v.id)}"><div class="row"><div><h2>${esc(visitDateLabel(v))}</h2><p>${esc(visitTimeRange(v))} • ${esc(durationText(v.startedAt,v.endedAt))}</p></div><span class="pill">${esc(v.type||"Visit")}</span></div><p>${esc(visitNotesPreview(v,3))}</p></button>`).join(""):`<div class="empty">Use Job Mode to create the first visit log for this site.</div>`}</div>
  </div>`);
  document.getElementById("backBtn").onclick=()=>route("siteDetail");
  document.getElementById("startVisitBtn").onclick=startJob;
  document.querySelectorAll(".visitLogItem").forEach(b=>b.onclick=()=>{mode=b.dataset.visit; route("visitDetail");});
}

function visitDetail(){
  const s=site(); if(!s){ route("sites"); return; }
  const siteVisits=Array.isArray(s.visits) ? s.visits : [];
  const v=siteVisits.find(x=>x.id===mode) || siteVisits[0];
  if(!v){ route("visits"); return; }
  const text=`${s.name}\n${visitReportBlock(v)}`;
  html(`<div class="screen visitDetailScreen"><div class="row"><button class="back ghost" id="backBtn">←</button><h1>Visit Detail</h1></div>
    <div class="card visitDetailHero"><h2>${esc(visitDateLabel(v))}</h2><p>${esc(visitTimeRange(v))}</p><div class="grid2 visitActions"><button class="primary" id="copyVisitBtn">Copy Visit</button><button class="danger" id="deleteVisitBtn">Delete</button></div></div>
    <div class="card grow visitFullNotes"><h2>Service Timeline</h2><pre>${esc(v.notes || "No visit notes saved.")}</pre></div>
  </div>`);
  document.getElementById("backBtn").onclick=()=>route("visits");
  document.getElementById("copyVisitBtn").onclick=async()=>{await navigator.clipboard.writeText(text); toast("Visit copied.");};
  document.getElementById("deleteVisitBtn").onclick=()=>{ if(confirm("Delete this saved visit?")){ s.visits=siteVisits.filter(x=>x.id!==v.id); save(); toast("Visit deleted."); route("visits"); } };
}

function siteForm(){
  const s = mode==="edit" ? site() : {};
  html(`<div class="screen"><div class="row"><button class="back ghost" id="backBtn">←</button><h1>${mode==="edit"?"Edit":"Add"} Site</h1></div><div class="form grow">
    <div class="card"><label>Name</label><input id="name" value="${esc(s.name||"")}"><label>Street</label><input id="street" value="${esc(s.street||"")}"><div class="compactField"><div><label>City</label><input id="city" value="${esc(s.city||"")}"></div><div><label>State</label><input id="state" value="${esc(s.state||"")}"></div></div><label>ZIP</label><input id="zip" value="${esc(s.zip||"")}"></div>
    <div class="card gpsEditCard"><div class="row"><h2>GPS Coordinates</h2><button type="button" class="ghost smallBtn" id="formGpsBtn">Capture</button></div><div class="compactField"><div><label>Latitude</label><input id="gpsLat" inputmode="decimal" value="${hasGps(s)?esc(s.gps.lat):""}"></div><div><label>Longitude</label><input id="gpsLng" inputmode="decimal" value="${hasGps(s)?esc(s.gps.lng):""}"></div></div><div class="compactField"><div><label>Accuracy m</label><input id="gpsAccuracy" inputmode="numeric" value="${hasGps(s)?esc(s.gps.accuracy||""):""}"></div><div><label>Captured</label><input id="gpsCapturedAt" value="${hasGps(s)?esc(s.gps.capturedAt||""):""}"></div></div><p class="fieldNote">GPS is optional. Capture requires browser location permission and works best from HTTPS.</p></div>
    <div class="card"><div class="compactField"><div><label>Panel Make</label><input id="pm" value="${esc(s.panelManufacturer||"")}"></div><div><label>Panel Model</label><input id="model" value="${esc(s.panelModel||"")}"></div></div><label>Notes</label><textarea id="notes">${esc(s.notes||"")}</textarea></div>
    <button class="primary" id="saveBtn">Save Site</button>${mode==="edit"?`<button class="danger" id="delBtn">Delete Site</button>`:""}
  </div></div>`);
  document.getElementById("backBtn").onclick=()=>{route(mode==="edit"?"siteDetail":"sites")};
  const fg=document.getElementById("formGpsBtn"); if(fg) fg.onclick=captureGpsIntoForm;
  document.getElementById("saveBtn").onclick=()=>{
    const obj={name:val("name")||"Unnamed Site",street:val("street"),city:val("city"),state:val("state"),zip:val("zip"),panelManufacturer:val("pm"),panelModel:val("model"),notes:raw("notes")};
    const gpsLat=Number(val("gpsLat")), gpsLng=Number(val("gpsLng"));
    if(Number.isFinite(gpsLat) && Number.isFinite(gpsLng)) obj.gps={lat:gpsLat,lng:gpsLng,accuracy:Number(val("gpsAccuracy"))||0,capturedAt:val("gpsCapturedAt")||new Date().toISOString()};
    else obj.gps=null;
    if(mode==="edit" && s){ Object.assign(s,obj); } else { const n=ensureSite({...obj,id:uid(),createdAt:new Date().toISOString()}); data.sites.unshift(n); selectedSiteId=n.id; }
    save(); route("siteDetail");
  };
  const del=document.getElementById("delBtn"); if(del) del.onclick=()=>{ if(!data.settings.app.confirmDeletes || confirm("Delete this site?")){ data.sites=data.sites.filter(x=>x.id!==s.id); save(); selectedSiteId=null; route("sites"); } };
}

function tasks(){
  const rows=allTaskRows();
  const scoped = selectedSiteId ? rows.filter(r=>r.s.id===selectedSiteId) : rows;
  const counts = taskFilterCounts(scoped);
  const filters=[
    ["open","Open",counts.open],["today","Today",counts.today],["overdue","Overdue",counts.overdue],
    ["service","Service",counts.service],["done","Done",counts.done],["all","All",counts.all]
  ];
  if(selectedSiteId && taskFilter === "service" && !counts.service) taskFilter="open";
  const filtered=scoped.filter(r=>taskMatchesFilter(r, taskFilter)).sort((a,b)=>taskSortValue(a).localeCompare(taskSortValue(b)) || (a.t.title||"").localeCompare(b.t.title||""));
  html(`<div class="screen tasksScreen422"><div class="row taskTopRow"><button class="back ghost" id="backBtn">←</button><div><h1>Task Center</h1><p>${selectedSiteId ? esc(site()?.name || "Site tasks") : "All site follow-ups"}</p></div><button class="primary" id="addBtn">＋</button></div>
    <div class="taskFilterRail" id="taskFilterRail">${filters.map(f=>`<button class="taskFilterPill ${taskFilter===f[0]?"active":""}" data-filter="${f[0]}"><span>${f[1]}</span><strong>${f[2]}</strong></button>`).join("")}</div>
    <div class="list grow taskList">${filtered.length?filtered.map(r=>`<div class="card taskCard ${taskIsDone(r.t)?"taskDone":"taskOpen"} ${r.state==="overdue"?"taskOverdue":""} ${r.state==="today"?"taskToday":""}" data-site="${r.s.id}" data-id="${r.t.id}">
      <div class="taskCardMain"><div><h2>${esc(r.t.title||"Task")}</h2><p>${esc(r.s.name)} • ${esc(taskDueLabel(r.t))}</p></div><div class="taskBadges"><span class="pill ${r.state==="overdue"?"dangerPill":r.state==="today"?"todayPill":""}">${esc(taskIsDone(r.t)?"Done":r.state==="none"?"Open":r.state)}</span>${r.t.source?`<span class="pill serviceTaskPill">${esc(r.t.source)}</span>`:""}</div></div>
      ${r.t.notes?`<p class="taskNotes">${esc(r.t.notes)}</p>`:""}
      <div class="taskQuickActions"><button class="ghost smallBtn taskSiteBtn" data-site="${r.s.id}">Site</button><button class="${taskIsDone(r.t)?"ghost":"primary"} smallBtn taskDoneBtn" data-site="${r.s.id}" data-id="${r.t.id}">${taskIsDone(r.t)?"Reopen":"Done"}</button></div>
    </div>`).join(""):`<div class="empty">No tasks in this view.</div>`}</div></div>`);
  document.getElementById("backBtn").onclick=()=>selectedSiteId?route("siteDetail"):route("home");
  document.getElementById("addBtn").onclick=()=>{mode=null; route("taskForm");};
  document.querySelectorAll(".taskFilterPill").forEach(b=>b.onclick=()=>{taskFilter=b.dataset.filter; tasks();});
  document.querySelectorAll(".taskCard").forEach(el=>el.onclick=()=>{selectedSiteId=el.dataset.site; mode=el.dataset.id; route("taskForm");});
  document.querySelectorAll(".taskDoneBtn").forEach(b=>b.onclick=e=>{e.stopPropagation(); toggleTaskDone(b.dataset.site,b.dataset.id);});
  document.querySelectorAll(".taskSiteBtn").forEach(b=>b.onclick=e=>{e.stopPropagation(); selectedSiteId=b.dataset.site; route("siteDetail");});
}

function taskForm(){
  const s = selectedSiteId ? site() : data.sites[0]; if(!s){ alert("Add a site first."); route("sites"); return; }
  const t = mode ? (s.tasks||[]).find(x=>x.id===mode) : {};
  html(`<div class="screen"><div class="row"><button class="back ghost" id="backBtn">←</button><h1>${mode?"Edit":"Add"} Task</h1></div><div class="form grow"><div class="card"><label>Site</label><select id="sitePick">${data.sites.map(x=>`<option value="${x.id}" ${x.id===s.id?"selected":""}>${esc(x.name)}</option>`).join("")}</select><label>Title</label><input id="title" value="${esc(t.title||"")}"><div class="compactField"><div><label>Status</label><select id="status"><option ${t.status!=="Done"?"selected":""}>Open</option><option ${t.status==="Done"?"selected":""}>Done</option></select></div><div><label>Due</label><input id="due" type="date" value="${esc(t.due||"")}"></div></div><label>Notes</label><textarea id="notes">${esc(t.notes||"")}</textarea></div><button class="primary" id="saveBtn">Save Task</button>${mode?`<button class="danger" id="delBtn">Delete Task</button>`:""}</div></div>`);
  document.getElementById("backBtn").onclick=()=>route("tasks");
  document.getElementById("saveBtn").onclick=()=>{ const target=ensureSite(data.sites.find(x=>x.id===val("sitePick"))); const obj={title:val("title")||"Untitled Task",status:val("status"),due:val("due"),notes:raw("notes")}; target.tasks=target.tasks||[]; if(mode){ Object.assign(t,obj); } else target.tasks.unshift({...obj,id:uid(),createdAt:new Date().toISOString()}); selectedSiteId=target.id; save(); route("tasks"); };
  const del=document.getElementById("delBtn"); if(del) del.onclick=()=>{s.tasks=s.tasks.filter(x=>x.id!==mode); save(); route("tasks");};
}

function allDeficiencyRows(){
  const rows=[];
  data.sites.forEach(s=>ensureSite(s).deficiencies.forEach(d=>rows.push({s,d})));
  return rows;
}
function deficiencyClosed(d){ return (d.status||"Open") === "Closed"; }
function deficiencySeverityRank(d){
  const p=(d.priority||"Normal").toLowerCase();
  if(p==="critical") return 0;
  if(p==="high") return 1;
  return 2;
}
function deficiencyAgeLine(d){
  const created=d.createdAt ? new Date(d.createdAt) : null;
  if(!created || Number.isNaN(created.getTime())) return "No date saved";
  const days=Math.max(0, Math.floor((Date.now()-created.getTime())/86400000));
  if(days===0) return "Created today";
  if(days===1) return "Created yesterday";
  return `Open ${days} days`;
}
function deficiencyFilterCounts(rows){
  return {
    open: rows.filter(r=>!deficiencyClosed(r.d)).length,
    critical: rows.filter(r=>!deficiencyClosed(r.d) && (r.d.priority||"")==="Critical").length,
    high: rows.filter(r=>!deficiencyClosed(r.d) && ["Critical","High"].includes(r.d.priority||"")).length,
    checklist: rows.filter(r=>!deficiencyClosed(r.d) && r.d.checklistId).length,
    closed: rows.filter(r=>deficiencyClosed(r.d)).length,
    all: rows.length
  };
}
function deficiencyMatchesFilter(r, filter){
  if(filter==="all") return true;
  if(filter==="closed") return deficiencyClosed(r.d);
  if(filter==="critical") return !deficiencyClosed(r.d) && (r.d.priority||"")==="Critical";
  if(filter==="high") return !deficiencyClosed(r.d) && ["Critical","High"].includes(r.d.priority||"");
  if(filter==="checklist") return !deficiencyClosed(r.d) && !!r.d.checklistId;
  return !deficiencyClosed(r.d);
}
function resolveDeficiency(siteId, defId){
  const s=ensureSite(data.sites.find(x=>x.id===siteId));
  const d=(s.deficiencies||[]).find(x=>x.id===defId);
  if(!d) return;
  d.status="Closed"; d.resolvedAt=new Date().toISOString();
  save(); toast("Deficiency closed."); deficiencies();
}
function reopenDeficiency(siteId, defId){
  const s=ensureSite(data.sites.find(x=>x.id===siteId));
  const d=(s.deficiencies||[]).find(x=>x.id===defId);
  if(!d) return;
  d.status="Open"; delete d.resolvedAt;
  save(); toast("Deficiency reopened."); deficiencies();
}
function deficiencyCard(r){
  const d=r.d;
  const closed=deficiencyClosed(d);
  const sev=(d.priority||"Normal").toLowerCase();
  return `<div class="card siteItem deficiencyCard439 ${closed?"defClosed":""} def-${esc(sev)}" data-site="${esc(r.s.id)}" data-id="${esc(d.id)}">
    <div class="defCardTop"><div><h2>${esc(d.title||"Deficiency")}</h2><p>${esc(r.s.name||"Site")} • ${esc(deficiencyAgeLine(d))}</p></div><span class="pill ${closed?"defDonePill":sev==="critical"?"dangerPill":sev==="high"?"todayPill":""}">${esc(closed?"Closed":(d.priority||"Normal"))}</span></div>
    ${d.notes?`<p class="defNotes">${esc(d.notes)}</p>`:""}
    <div class="defMeta">${d.checklistId?`<span>Checklist Issue</span>`:""}${d.resolvedAt?`<span>Closed ${esc(new Date(d.resolvedAt).toLocaleDateString())}</span>`:""}<span>${esc(d.status||"Open")}</span></div>
    <div class="defQuickActions"><button class="ghost smallBtn defSiteBtn" data-site="${esc(r.s.id)}">Site</button><button class="${closed?"ghost":"primary"} smallBtn defResolveBtn" data-site="${esc(r.s.id)}" data-id="${esc(d.id)}">${closed?"Reopen":"Close"}</button></div>
  </div>`;
}
function deficiencies(){
  const rows=allDeficiencyRows();
  const scoped = selectedSiteId ? rows.filter(r=>r.s.id===selectedSiteId) : rows;
  const counts=deficiencyFilterCounts(scoped);
  const filters=[
    ["open","Open",counts.open], ["critical","Critical",counts.critical], ["high","High+",counts.high],
    ["checklist","Checklist",counts.checklist], ["closed","Closed",counts.closed], ["all","All",counts.all]
  ];
  if(!counts[deficiencyFilter] && deficiencyFilter!=="open" && deficiencyFilter!=="all") deficiencyFilter="open";
  const filtered=scoped.filter(r=>deficiencyMatchesFilter(r, deficiencyFilter)).sort((a,b)=>deficiencySeverityRank(a.d)-deficiencySeverityRank(b.d) || (deficiencyClosed(a.d)-deficiencyClosed(b.d)) || (new Date(b.d.createdAt||0)-new Date(a.d.createdAt||0)));
  html(`<div class="screen deficiencyScreen439"><div class="row defTopRow"><button class="back ghost" id="backBtn">←</button><div><h1>Deficiency Center</h1><p>${selectedSiteId ? esc(site()?.name || "Site deficiencies") : "Open issues across all sites"}</p></div><button class="primary" id="addBtn">＋</button></div>
    <div class="card defHero439"><div><strong>${counts.open}</strong><span>Open</span></div><div><strong>${counts.critical}</strong><span>Critical</span></div><div><strong>${counts.checklist}</strong><span>Checklist</span></div><div><strong>${counts.closed}</strong><span>Closed</span></div></div>
    <div class="defFilterRail" id="defFilterRail">${filters.map(f=>`<button class="defFilterPill ${deficiencyFilter===f[0]?"active":""}" data-filter="${f[0]}"><span>${f[1]}</span><strong>${f[2]}</strong></button>`).join("")}</div>
    <div class="list grow defList439">${filtered.length?filtered.map(deficiencyCard).join(""):`<div class="empty">No deficiencies in this view.</div>`}</div></div>`);
  document.getElementById("backBtn").onclick=()=>selectedSiteId?route("siteDetail"):route("home");
  document.getElementById("addBtn").onclick=()=>{mode=null; route("deficiencyForm");};
  document.querySelectorAll(".defFilterPill").forEach(b=>b.onclick=()=>{deficiencyFilter=b.dataset.filter; deficiencies();});
  document.querySelectorAll(".deficiencyCard439").forEach(el=>el.onclick=()=>{selectedSiteId=el.dataset.site; mode=el.dataset.id; route("deficiencyForm");});
  document.querySelectorAll(".defResolveBtn").forEach(b=>b.onclick=e=>{e.stopPropagation(); const d=allDeficiencyRows().find(r=>r.s.id===b.dataset.site && r.d.id===b.dataset.id)?.d; if(!d) return; if(deficiencyClosed(d)) reopenDeficiency(b.dataset.site,b.dataset.id); else resolveDeficiency(b.dataset.site,b.dataset.id);});
  document.querySelectorAll(".defSiteBtn").forEach(b=>b.onclick=e=>{e.stopPropagation(); selectedSiteId=b.dataset.site; route("siteDetail");});
}
function deficiencyForm(){
  const s = selectedSiteId ? site() : data.sites[0]; if(!s){ alert("Add a site first."); route("sites"); return; }
  const d = mode ? (s.deficiencies||[]).find(x=>x.id===mode) : {};
  html(`<div class="screen"><div class="row"><button class="back ghost" id="backBtn">←</button><h1>${mode?"Edit":"Add"} Deficiency</h1></div><div class="form grow"><div class="card"><label>Site</label><select id="sitePick">${data.sites.map(x=>`<option value="${x.id}" ${x.id===s.id?"selected":""}>${esc(x.name)}</option>`).join("")}</select><label>Title</label><input id="title" value="${esc(d.title||"")}"><div class="compactField"><div><label>Priority</label><select id="priority">${["Normal","High","Critical"].map(x=>`<option ${d.priority===x?"selected":""}>${x}</option>`).join("")}</select></div><div><label>Status</label><select id="status"><option ${d.status!=="Closed"?"selected":""}>Open</option><option ${d.status==="Closed"?"selected":""}>Closed</option></select></div></div><label>Notes</label><textarea id="notes">${esc(d.notes||"")}</textarea><label><input type="checkbox" id="makeTask" ${!mode?"checked":""}> Create matching follow-up task</label></div><button class="primary" id="saveBtn">Save Deficiency</button>${mode?`<button class="danger" id="delBtn">Delete Deficiency</button>`:""}</div></div>`);
  document.getElementById("backBtn").onclick=()=>route("deficiencies");
  document.getElementById("saveBtn").onclick=()=>{ const target=ensureSite(data.sites.find(x=>x.id===val("sitePick"))); const obj={title:val("title")||"Untitled Deficiency",priority:val("priority"),status:val("status"),notes:raw("notes")}; target.deficiencies=target.deficiencies||[]; if(mode){ const wasClosed=deficiencyClosed(d); Object.assign(d,obj); if(obj.status==="Closed" && !wasClosed) d.resolvedAt=new Date().toISOString(); if(obj.status!=="Closed") delete d.resolvedAt; } else { const created={...obj,id:uid(),createdAt:new Date().toISOString()}; if(created.status==="Closed") created.resolvedAt=new Date().toISOString(); target.deficiencies.unshift(created); if(checked("makeTask")){target.tasks.unshift({id:uid(),title:"Resolve: "+obj.title,status:"Open",due:"",notes:obj.notes,createdAt:new Date().toISOString()});} } selectedSiteId=target.id; save(); route("deficiencies"); };
  const del=document.getElementById("delBtn"); if(del) del.onclick=()=>{s.deficiencies=s.deficiencies.filter(x=>x.id!==mode); save(); route("deficiencies");};
}


function loadReportSectionPrefs(){
  try{ return JSON.parse(localStorage.getItem(REPORT_SECTION_KEY) || "null"); }
  catch{ return null; }
}
function saveReportSectionPrefs(prefs){
  reportSectionPrefs = prefs;
  try{ localStorage.setItem(REPORT_SECTION_KEY, JSON.stringify(prefs)); }catch{}
}
function defaultReportSections(){
  const r=data.settings.reports || {};
  return {
    site:true,
    tech:r.includeTechnician !== false,
    visits:true,
    contacts:true,
    equipment:true,
    docs:true,
    checklist:true,
    tasks:r.includeTasks !== false,
    deficiencies:r.includeDeficiencies !== false,
    notes:true,
    email:true
  };
}
function reportSectionState(){
  return {...defaultReportSections(), ...(reportSectionPrefs || {})};
}
function reportSectionLabels(){
  return [
    ["site","Site"], ["tech","Tech"], ["visits","Visits"], ["contacts","Contacts"],
    ["equipment","Equipment"], ["docs","Docs"], ["checklist","Checklist"], ["tasks","Tasks"],
    ["deficiencies","Deficiencies"], ["notes","Notes"], ["email","Email"]
  ];
}
function reportSectionControls(opts){
  return reportSectionLabels().map(([key,label])=>`<label class="reportSectionToggle ${opts[key]?"on":""}"><input type="checkbox" data-section="${key}" ${opts[key]?"checked":""}><span>${esc(label)}</span></label>`).join("");
}
function reportJoin(sections){
  return sections.map(([title, body])=>`${title}\n${body}`).join("\n\n");
}

function reportText(s, opts=reportSectionState()){
  const set=data.settings, tech=set.technician||{};
  const visits=(s.visits||[]).slice(0,5).map(v=>visitReportBlock(v)).join("\n\n") || "No completed visits";
  const contacts=(s.contacts||[]).map(contactReportLine).join("\n") || "No contacts or access notes saved";
  const equipment=(s.equipment||[]).map(e=>`- ${e.status||"Active"}: ${equipmentTitle(e)}${e.location?` @ ${e.location}`:""}${e.serial?` | Serial ${e.serial}`:""}${e.date?` | Checked ${e.date}`:""}${e.interval&&e.interval!=="None"?` | Interval ${e.interval}`:""}${e.notes?`\n  Notes: ${String(e.notes).replaceAll("\n","\n  ")}`:""}`).join("\n") || "No equipment saved";
  const docs=(s.docs||[]).map(docReportLine).join("\n") || "No documents or links saved";
  const checklist=checklistReportBlock(s);
  const sections=[];
  sections.push([set.reports.title || "FireVault Service Report", `Generated: ${new Date().toLocaleString()}\nBuild: ${BUILD}`]);
  if(opts.site) sections.push(["SITE", `${s.name||"Unnamed Site"}\n${fullAddress(s)}\nPanel: ${[s.panelManufacturer,s.panelModel].filter(Boolean).join(" ")||"Not entered"}\nGPS: ${data.settings.gps?.includeInReports===false?"Hidden in Settings":gpsLine(s)}\nMap: ${mapUrl(s,(set.gps&&set.gps.mapProvider)||"apple")}\nHealth: ${siteHealthLine(s)}`]);
  if(opts.tech) sections.push(["TECHNICIAN", `${tech.name||""}\n${tech.company||""}\n${tech.phone||""}\n${tech.email||""}`.trim() || "No technician profile entered"]);
  if(opts.visits) sections.push(["VISITS", visits]);
  if(opts.contacts) sections.push(["CONTACTS / ACCESS", contacts]);
  if(opts.equipment) sections.push(["EQUIPMENT", equipment]);
  if(opts.docs) sections.push(["DOCUMENTS / LINKS", docs]);
  if(opts.checklist) sections.push(["INSPECTION CHECKLIST", checklist]);
  if(opts.tasks) sections.push(["TASKS", (s.tasks||[]).map(t=>`- ${t.status||"Open"}: ${t.title}${t.source?` [${t.source}]`:""}${t.due?` due ${t.due}`:""}`).join("\n")||"No tasks"]);
  if(opts.deficiencies) sections.push(["DEFICIENCIES", (s.deficiencies||[]).map(d=>`- ${d.status||"Open"}: ${d.priority||"Normal"} - ${d.title}`).join("\n")||"No deficiencies"]);
  if(opts.notes) sections.push(["NOTES", s.notes||"No notes"]);
  if(opts.email) sections.push(["EMAIL SUBJECT", renderTemplate(set.email.defaultSubject,s) || "FireVault Report"]), sections.push(["SIGNATURE", renderTemplate(set.email.signature,s) || "No signature template entered"]);
  return reportJoin(sections);
}
function renderTemplate(t,s){ const tech=data.settings.technician||{}; return String(t||"").replaceAll("{site_name}",s.name||"").replaceAll("{date}",fmtDate()).replaceAll("{technician}",tech.name||"").replaceAll("{company}",tech.company||"").replaceAll("{phone}",tech.phone||"").replaceAll("{email}",tech.email||""); }
function reportStats(s){
  ensureSite(s);
  const h=siteHealth(s);
  const openTasks=(s.tasks||[]).filter(t=>!taskIsDone(t));
  const openDef=(s.deficiencies||[]).filter(d=>(d.status||"Open")!=="Closed");
  const equipmentIssues=(s.equipment||[]).filter(e=>/(needs|issue|trouble|fail|offline|attention)/i.test(e.status||""));
  const checkStats=checklistStats(s);
  return {h,openTasks,openDef,equipmentIssues,checklistStats:checkStats};
}
function reportPreviewCards(s){
  const stats=reportStats(s);
  const contacts=(s.contacts||[]).length;
  const docs=(s.docs||[]).length;
  const visits=(s.visits||[]).length;
  return [
    ["Site", fullAddress(s), [siteHealthLine(s), gpsLine(s)]],
    ["Service", `${visits} visit${visits===1?"":"s"} saved`, [`${stats.openTasks.length} open task${stats.openTasks.length===1?"":"s"}`, `${stats.openDef.length} open deficienc${stats.openDef.length===1?"y":"ies"}`]],
    ["Equipment", `${(s.equipment||[]).length} equipment record${(s.equipment||[]).length===1?"":"s"}`, [`${stats.equipmentIssues.length} item${stats.equipmentIssues.length===1?"":"s"} need attention`, `${contacts} contact${contacts===1?"":"s"} / ${docs} document${docs===1?"":"s"}`]],
    ["Checklist", `${stats.checklistStats.progress || 0}% complete`, [`${stats.checklistStats.ok} OK`, `${stats.checklistStats.issue} issue${stats.checklistStats.issue===1?"":"s"}`, `${stats.checklistStats.pending} pending`]]
  ];
}
async function shareReportText(s,txt){
  try{
    if(navigator.share){ await navigator.share({title:`FireVault Report - ${s.name||"Site"}`, text:txt}); toast("Report shared."); return true; }
  }catch(err){ if(err?.name === "AbortError") return false; }
  try{ await navigator.clipboard.writeText(txt); toast("Report copied."); return true; }
  catch{ toast("Report ready, but clipboard is unavailable."); return false; }
}
function reportDeliveryRows(s){
  return Array.isArray(s.reportDeliveries) ? s.reportDeliveries : [];
}
function logReportDelivery(s, method, subject){
  if(!s) return;
  s.reportDeliveries = reportDeliveryRows(s);
  s.reportDeliveries.unshift({id:uid(), method, subject:subject || "FireVault Report", at:new Date().toISOString()});
  s.reportDeliveries = s.reportDeliveries.slice(0,25);
  save();
}
function reportDeliveryHtml(s){
  const rows=reportDeliveryRows(s).slice(0,6);
  if(!rows.length) return `<div class="reportDeliveryEmpty">No report delivery actions logged yet.</div>`;
  return rows.map(r=>`<button class="reportDeliveryRow reportDeliveryReceiptBtn" data-delivery="${esc(r.id)}" title="Copy delivery receipt"><div><strong>${esc(r.method||"Report")}</strong><span>${esc(r.subject||"FireVault Report")}</span></div><time>${esc(new Date(r.at||Date.now()).toLocaleString([], {month:"short",day:"numeric",hour:"numeric",minute:"2-digit"}))}</time></button>`).join("");
}
function reportDeliveryText(s,r){
  const when=new Date(r?.at||Date.now()).toLocaleString();
  return [`FIREVAULT REPORT DELIVERY`, `Site: ${s?.name||"Unnamed Site"}`, `Address: ${s?fullAddress(s):""}`, `Method: ${r?.method||"Report"}`, `Subject: ${r?.subject||"FireVault Report"}`, `Logged: ${when}`, `Build: ${BUILD}`].join("\n");
}
async function copyReportDeliveryReceipt(s,id){
  const r=reportDeliveryRows(s).find(x=>x.id===id);
  if(!r){ toast("Delivery log item not found."); return; }
  try{ await navigator.clipboard.writeText(reportDeliveryText(s,r)); toast("Delivery receipt copied."); }
  catch{ toast("Clipboard unavailable."); }
}
function createReportFollowUpTask(s){
  if(!s) return;
  s.tasks=Array.isArray(s.tasks) ? s.tasks : [];
  const latest=reportDeliveryRows(s)[0];
  const baseTitle="Follow up on report delivery";
  const exists=s.tasks.some(t=>!taskIsDone(t) && t.source==="Report Delivery" && t.title===baseTitle);
  if(exists){ toast("Open report follow-up already exists."); return; }
  const due=new Date(); due.setDate(due.getDate()+2);
  s.tasks.unshift({id:uid(),title:baseTitle,status:"Open",due:due.toISOString().slice(0,10),notes:`Created from Report Center on ${fmtDate()}.\n${latest ? reportDeliveryText(s,latest) : "No delivery event logged yet."}`,source:"Report Delivery",createdAt:new Date().toISOString()});
  save();
  toast("Report follow-up task added.");
}
function reportMailtoUrl(s, txt, subject){
  const email=data.settings.email || {};
  const to=String(email.defaultTo || "").trim();
  const cc=String(email.cc || "").trim();
  const params=[];
  params.push(`subject=${encodeURIComponent(subject || "FireVault Report")}`);
  params.push(`body=${encodeURIComponent(txt)}`);
  if(cc) params.push(`cc=${encodeURIComponent(cc)}`);
  return `mailto:${to}?${params.join("&")}`;
}
function openReportEmailDraft(s, txt, subject){
  logReportDelivery(s,"Email Draft",subject);
  toast("Opening email draft.");
  window.location.href = reportMailtoUrl(s, txt, subject);
}
function report(){
  const s=site(); if(!s){route("sites"); return;}
  const opts=reportSectionState();
  const txt=reportText(s, opts);
  const stats=reportStats(s);
  const subject=renderTemplate(data.settings.email.defaultSubject,s);
  html(`<div class="screen reportScreen440 reportScreen447"><div class="row reportTopRow"><button class="back ghost" id="backBtn">←</button><div><h1>Report Center</h1><p>${esc(s.name||"Site")}</p></div></div>
    <div class="card reportHero440 ${stats.h.cls}"><div><strong>${stats.h.score}%</strong><span>Health</span></div><div><strong>${stats.openTasks.length}</strong><span>Open Tasks</span></div><div><strong>${stats.openDef.length}</strong><span>Deficiencies</span></div><div><strong>${stats.equipmentIssues.length}</strong><span>Equip Issues</span></div></div>
    <div class="reportActionGrid440 reportActionGrid442 reportActionGrid447"><button class="primary" id="shareBtn">Share / Copy</button><button class="ghost" id="emailDraftBtn">Email Draft</button><button class="ghost" id="copyBtn">Copy TXT</button><button class="ghost" id="downloadBtn">Download</button><button class="ghost" id="subjectBtn">Copy Subject</button></div>
    <div class="card reportReadyCard reportReadyCard442 reportReadyCard447"><div><h2>Ready to Send</h2><p>${esc(subject || "FireVault Report")}</p><small>${esc((data.settings.email.defaultTo || "No default recipient") + (data.settings.email.cc ? ` • CC ${data.settings.email.cc}` : ""))}</small></div><span class="pill ${stats.h.cls}">${esc(stats.h.label)}</span></div>
    <div class="card reportDeliveryCard442 reportDeliveryCard444 reportDeliveryCard447"><div class="reportDeliveryHead"><div><h2>Delivery Log</h2><p>Tap a delivery item to copy a receipt. Add a follow-up task when a report needs customer confirmation.</p></div><div class="reportDeliveryHeadActions"><button class="ghost smallBtn" id="followReportBtn">Follow-Up</button><button class="ghost smallBtn" id="logSentBtn">Log Sent</button></div></div><div class="reportDeliveryList">${reportDeliveryHtml(s)}</div></div>
    <div class="card reportOptions441 reportOptions447"><div class="reportOptionsHead"><div><h2>Report Package</h2><p>Tap sections on/off before sharing, copying, or downloading.</p></div><button class="ghost smallBtn" id="resetReportSections">Reset</button></div><div class="reportSectionGrid441">${reportSectionControls(opts)}</div></div>
    <div class="reportPreviewGrid440 reportPreviewGrid447">${reportPreviewCards(s).map(card=>`<div class="card reportPreviewCard440"><span>${esc(card[0])}</span><h2>${esc(card[1])}</h2>${card[2].map(x=>`<p>${esc(x)}</p>`).join("")}</div>`).join("")}</div>
    <div class="card reportBox reportBox440 reportBox447 grow">${esc(txt)}</div></div>`);
  document.getElementById("backBtn").onclick=()=>route("siteDetail");
  document.getElementById("shareBtn").onclick=async()=>{ if(await shareReportText(s,txt)){ logReportDelivery(s,"Share / Copy",subject); report(); } };
  document.getElementById("emailDraftBtn").onclick=()=>openReportEmailDraft(s,txt,subject);
  document.getElementById("copyBtn").onclick=async()=>{await navigator.clipboard.writeText(txt); logReportDelivery(s,"Copied TXT",subject); toast("Report copied."); report();};
  document.getElementById("subjectBtn").onclick=async()=>{await navigator.clipboard.writeText(subject); logReportDelivery(s,"Subject Copied",subject); toast("Email subject copied."); report();};
  document.getElementById("downloadBtn").onclick=()=>{ downloadBlob(`firevault-report-${(s.name||"site").replace(/\W+/g,"-")}.txt`,txt); logReportDelivery(s,"Downloaded TXT",subject); report(); };
  document.getElementById("logSentBtn").onclick=()=>{ const method=prompt("Delivery note:","Sent to customer"); if(method){ logReportDelivery(s,method,subject); toast("Delivery logged."); report(); } };
  document.getElementById("followReportBtn").onclick=()=>{ createReportFollowUpTask(s); report(); };
  document.querySelectorAll(".reportDeliveryReceiptBtn").forEach(b=>b.onclick=()=>copyReportDeliveryReceipt(s,b.dataset.delivery));
  document.querySelectorAll(".reportSectionToggle input").forEach(cb=>cb.onchange=()=>{ const next={...reportSectionState(), [cb.dataset.section]: cb.checked}; saveReportSectionPrefs(next); report(); });
  const resetSections=document.getElementById("resetReportSections"); if(resetSections) resetSections.onclick=()=>{ reportSectionPrefs=null; try{localStorage.removeItem(REPORT_SECTION_KEY);}catch{}; toast("Report package reset."); report(); };
}


function ensureLibraryFolders(){
  const defaults=["Manuals","Forms","Links","Codes"];
  data.resourceFolders = Array.isArray(data.resourceFolders) ? data.resourceFolders.filter(Boolean) : [];
  defaults.forEach(f=>{ if(!data.resourceFolders.includes(f)) data.resourceFolders.push(f); });
  return data.resourceFolders;
}
function resourceFolderName(r){
  return r?.folder || "Unfiled";
}
function libraryFolderRows(){
  ensureLibraryFolders();
  const base=[
    {id:"all", label:"All", icon:"▦", count:data.resources.length},
    {id:"unfiled", label:"Unfiled", icon:"◇", count:data.resources.filter(r=>!r.folder).length}
  ];
  return base.concat(data.resourceFolders.map(f=>({id:f, label:f, icon:"▤", count:data.resources.filter(r=>r.folder===f).length})));
}
function filteredResources(){
  if(libraryFolder==="all") return data.resources;
  if(libraryFolder==="unfiled") return data.resources.filter(r=>!r.folder);
  return data.resources.filter(r=>r.folder===libraryFolder);
}
function canEditLibraryFolder(){
  return !["all","unfiled"].includes(libraryFolder);
}
function addLibraryFolder(){
  const name=prompt("New folder name");
  if(!name) return;
  const clean=name.trim();
  if(!clean) return;
  ensureLibraryFolders();
  if(data.resourceFolders.some(f=>f.toLowerCase()===clean.toLowerCase())){ toast("Folder already exists."); return; }
  data.resourceFolders.push(clean);
  libraryFolder=clean;
  save();
  library();
}
function editLibraryFolder(){
  if(!canEditLibraryFolder()){ toast("Select a custom folder first."); return; }
  const next=prompt("Rename folder", libraryFolder);
  if(!next) return;
  const clean=next.trim();
  if(!clean || clean===libraryFolder) return;
  ensureLibraryFolders();
  if(data.resourceFolders.some(f=>f.toLowerCase()===clean.toLowerCase())){ toast("Folder already exists."); return; }
  data.resourceFolders=data.resourceFolders.map(f=>f===libraryFolder?clean:f);
  data.resources.forEach(r=>{ if(r.folder===libraryFolder) r.folder=clean; });
  libraryFolder=clean;
  save();
  library();
}
function deleteLibraryFolder(){
  if(!canEditLibraryFolder()){ toast("Select a custom folder first."); return; }
  const count=data.resources.filter(r=>r.folder===libraryFolder).length;
  if(!confirm(`Delete folder "${libraryFolder}"? ${count} resource${count===1?"":"s"} will move to Unfiled.`)) return;
  const old=libraryFolder;
  data.resourceFolders=ensureLibraryFolders().filter(f=>f!==old);
  data.resources.forEach(r=>{ if(r.folder===old) r.folder=""; });
  libraryFolder="all";
  save();
  library();
}
function library(){
  ensureLibraryFolders();
  const rows=filteredResources();
  const folders=libraryFolderRows();
  const active=folders.find(f=>f.id===libraryFolder) || folders[0];
  if(!folders.some(f=>f.id===libraryFolder)) libraryFolder="all";
  html(`<div class="screen libraryScreen457">
    <div class="libraryHero457 card">
      <div><h1>Library</h1><p>Manuals, links, drawings, forms, and field references.</p></div>
      <button class="primary" id="addBtn">＋ Resource</button>
    </div>
    <div class="libraryFolderBar457">
      <button class="ghost smallBtn" id="addFolderBtn">＋ Folder</button>
      <button class="ghost smallBtn" id="editFolderBtn" ${canEditLibraryFolder()?"":"disabled"}>Edit</button>
      <button class="ghost smallBtn dangerLite457" id="deleteFolderBtn" ${canEditLibraryFolder()?"":"disabled"}>Delete</button>
    </div>
    <div class="libraryTabs457" aria-label="Library folders">
      ${folders.map(f=>`<button class="libraryTab457 ${f.id===libraryFolder?"active":""}" data-folder="${esc(f.id)}"><span>${f.icon}</span><strong>${esc(f.label)}</strong><em>${f.count}</em></button>`).join("")}
    </div>
    <div class="libraryFolderTitle457"><strong>${esc(active?.label || "All")}</strong><span>${rows.length} resource${rows.length===1?"":"s"}</span></div>
    <div class="list grow libraryList457">
      ${rows.length?rows.map(r=>`<div class="card libraryResource457 siteItem" data-id="${esc(r.id)}"><div><h2>${esc(r.n||r.m||"Resource")}</h2><p>${esc(r.m||"Manufacturer not entered")} • ${esc(resourceFolderName(r))}</p><p>${esc(r.url||"No URL or notes entered.")}</p></div><span class="libraryEditPill457">Edit</span></div>`).join(""):`<div class="empty">No resources in this folder yet.</div>`}
    </div>
  </div>`);
  document.getElementById("addBtn").onclick=()=>{mode=null; route("resourceForm");};
  document.getElementById("addFolderBtn").onclick=addLibraryFolder;
  document.getElementById("editFolderBtn").onclick=editLibraryFolder;
  document.getElementById("deleteFolderBtn").onclick=deleteLibraryFolder;
  document.querySelectorAll(".libraryTab457").forEach(el=>el.onclick=()=>{ libraryFolder=el.dataset.folder; library(); });
  document.querySelectorAll(".siteItem").forEach(el=>el.onclick=()=>{mode=el.dataset.id; route("resourceForm");});
}
function resourceForm(){
  ensureLibraryFolders();
  const r=mode?data.resources.find(x=>x.id===mode):{};
  const selectedFolder = mode ? (r.folder || "") : (canEditLibraryFolder() ? libraryFolder : "");
  html(`<div class="screen resourceForm457">
    <div class="row"><button class="back ghost" id="backBtn">←</button><h1>${mode?"Edit":"Add"} Resource</h1></div>
    <div class="form grow">
      <div class="card resourceEditCard457">
        <label>Folder</label>
        <select id="folder"><option value="">Unfiled</option>${ensureLibraryFolders().map(f=>`<option value="${esc(f)}" ${selectedFolder===f?"selected":""}>${esc(f)}</option>`).join("")}</select>
        <label>Manufacturer / Source</label>
        <input id="m" value="${esc(r.m||"")}" placeholder="Notifier, Silent Knight, NFPA, customer portal...">
        <label>Name / Model / Title</label>
        <input id="n" value="${esc(r.n||"")}" placeholder="Manual, drawing, form, link title...">
        <label>URL / Notes</label>
        <textarea id="url" placeholder="Paste link or add field notes">${esc(r.url||"")}</textarea>
      </div>
      <button class="primary" id="saveBtn">Save Resource</button>
      ${mode?`<button class="danger" id="delBtn">Delete Resource</button>`:""}
    </div>
  </div>`);
  document.getElementById("backBtn").onclick=()=>route("library");
  document.getElementById("saveBtn").onclick=()=>{
    const obj={folder:val("folder"),m:val("m"),n:val("n"),url:raw("url")};
    if(mode) Object.assign(r,obj);
    else data.resources.unshift({...obj,id:uid()});
    if(obj.folder) libraryFolder=obj.folder;
    save();
    route("library");
  };
  const del=document.getElementById("delBtn");
  if(del) del.onclick=()=>{data.resources=data.resources.filter(x=>x.id!==mode); save(); route("library");};
}

function startJob(){
  const s=site();
  if(!s) return;
  if(activeJob && activeJob.siteId !== s.id){
    if(!confirm(`A service call is already active for ${activeJob.siteName}. Replace it with this site?`)) return;
  }
  if(activeJob && activeJob.siteId === s.id){ route("jobMode"); return; }
  activeJob={siteId:s.id,siteName:s.name,startedAt:new Date().toISOString(),events:[{time:new Date().toISOString(),note:"Job started"}]};
  saveActiveJob(); route("jobMode");
}
function jobMode(){
  const s=site();
  if(!s||!activeJob){route("siteDetail"); return;}
  const events = Array.isArray(activeJob.events) ? activeJob.events : [];
  html(`<div class="screen serviceCallScreen"><div class="row"><button class="back ghost" id="backBtn">←</button><h1>Job Mode</h1></div>
    <div class="card serviceTimerCard"><h2>${esc(s.name)}</h2><div class="timer" id="jobElapsed">${elapsedText(activeJob.startedAt)}</div><p>Started ${esc(eventTime(activeJob.startedAt))}</p></div>
    <div class="card quickEventCard"><div class="row"><h2>Quick Events</h2><span class="pill">${events.length} events</span></div><div class="quickEventGrid">${QUICK_EVENTS.map(q=>`<button class="ghost quickEventBtn" data-note="${esc(q)}">${esc(q)}</button>`).join("")}</div></div>
    <div class="card jobFollowCard"><h2>Service Follow-Up</h2><p>Create action items while the job is still fresh. These save as open tasks for this site.</p><div class="jobActionGrid"><button class="ghost" id="noteBtn">Custom Event</button><button class="ghost" id="followBtn">Follow-Up Task</button><button class="ghost" id="partsBtn">Parts Needed</button><button class="primary" id="finishBtn">Finish Visit</button></div></div>
    <div class="list grow serviceEventList">${events.length?events.map(e=>`<div class="card visit"><strong>${esc(eventTime(e.time))}</strong><p>${esc(e.note)}</p></div>`).join(""):`<div class="empty">No events yet.</div>`}</div>
  </div>`);
  document.getElementById("backBtn").onclick=()=>route("siteDetail");
  document.querySelectorAll(".quickEventBtn").forEach(b=>b.onclick=()=>{ if(b.dataset.note === "Parts needed") addServiceFollowUp("Parts Needed"); else {addJobEvent(b.dataset.note); render();} });
  document.getElementById("noteBtn").onclick=()=>{const note=prompt("Event note:","Checked panel"); if(note){addJobEvent(note); render();}};
  document.getElementById("followBtn").onclick=()=>addServiceFollowUp("Follow-up");
  document.getElementById("partsBtn").onclick=()=>addServiceFollowUp("Parts Needed");
  document.getElementById("finishBtn").onclick=()=>{
    s.visits=s.visits||[];
    const endedAt=new Date().toISOString();
    s.visits.unshift({id:uid(),date:todayIso(),startedAt:activeJob.startedAt,endedAt,notes:(activeJob.events||[]).map(e=>`${eventTime(e.time)} - ${e.note}`).join("\n")});
    activeJob=null; saveActiveJob(); save(); toast("Visit saved."); route("siteDetail");
  };
}

function settingsTabs(){
  return [
    ["tech","Technician","Name, company, phone, email, and license information used in reports."],
    ["gps","GPS / Maps","Location capture, map provider, nearby radius, and GPS report visibility."],
    ["reports","Reports","Default report title, format, and included report sections."],
    ["email","Email","Default recipients, subject template, signature template, and tag tools."],
    ["overlay","Photo Overlay","Photo stamp alignment, size, accent color, and logo visibility."],
    ["themes","Theme","Theme presets, accent color, 3D controls, text size, and haptics."],
    ["visibility","Simple View","App mode and feature visibility for a cleaner default screen."],
    ["advanced","Advanced","Optional future modules marked with an asterisk when services are required."],
    ["backup","Backup","Export, import, data safety snapshot, restore tools, and danger zone."],
    ["about","About","Build information, storage key, and FireVault roadmap notes."]
  ];
}

function settings(){
  const tabs=settingsTabs();
  const active=tabs.find(t=>t[0]===settingsTab)||tabs[0];
  const inDetail = mode === "settingsDetail";
  if(!inDetail){
    html(`<div class="screen settingsHomeScreen settingsHomeScreen451">
      <div class="settingsHomeHero451 card">
        <div><h1>Settings</h1><p>Choose a settings area. Each option opens full screen with a Save button and a back arrow.</p></div>
        <button class="ghost iconBtn settingsInfoBtn" id="diagBtn" title="Diagnostics" aria-label="Diagnostics">ⓘ</button>
      </div>
      <div class="settingsChoiceGrid451 grow" aria-label="Settings choices">
        ${tabs.map((t,i)=>`<button class="settingsChoice451 settingsChoice455 settingsChoice456" data-tab="${t[0]}"><span class="settingsChoiceIcon451">${["👤","⌖","▤","✉","▧","◐","☰","⚡","⇅","ⓘ"][i]}</span><span class="settingsChoiceText456"><strong>${t[1]}</strong><small>${t[2]}</small></span><span class="settingsChoiceArrow455">›</span></button>`).join("")}
        <button class="settingsChoice451 settingsChoice455 settingsChoice456 settingsChoiceUtility451" id="diagnosticsChoice"><span class="settingsChoiceIcon451">⌁</span><span class="settingsChoiceText456"><strong>Diagnostics</strong><small>Build, storage, GPS, module, task, report, and vault health details.</small></span><span class="settingsChoiceArrow455">›</span></button>
      </div>
    </div>`);
    document.querySelectorAll(".settingsChoice451[data-tab]").forEach(b=>b.onclick=()=>{ settingsTab=b.dataset.tab; mode="settingsDetail"; settings(); });
    document.getElementById("diagBtn").onclick=()=>route("diagnostics");
    document.getElementById("diagnosticsChoice").onclick=()=>route("diagnostics");
    return;
  }
  const saveable=!['backup','about'].includes(settingsTab);
  html(`<div class="screen settingsDetailScreen451 settingsScreen settingsScreen448 settingsScreen449">
    <div class="settingsDetailTop451">
      <button class="ghost settingsBack451" id="settingsBackBtn">← Settings</button>
      <div class="settingsDetailTitle451"><h1>${active[1]}</h1><p>${active[2]}</p></div>
      ${saveable?`<button class="primary settingsTopSave451" id="saveSettingsTop">Save</button>`:`<button class="ghost settingsTopSave451" id="settingsDoneBtn">Choices</button>`}
    </div>
    <div class="settingsDetailBody451 grow settingsContent448 settingsContent449">${settingsPanel()}</div>
  </div>`);
  document.getElementById("settingsBackBtn").onclick=()=>{ mode=null; settings(); };
  const done=document.getElementById("settingsDoneBtn"); if(done) done.onclick=()=>{ mode=null; settings(); };
  const saveTop=document.getElementById("saveSettingsTop"); if(saveTop) saveTop.onclick=saveSettings;
  wireSettingsPanel();
}
function fieldBlock(label, inner, note=""){
  return `<div class="settingField"><label>${label}</label>${inner}${note?`<p class="fieldNote">${note}</p>`:""}</div>`;
}
function checkBlock(id, text, on){
  return `<label class="checkRow"><input type="checkbox" id="${id}" ${on?"checked":""}><span>${text}</span></label>`;
}

function backupStats(){
  const sites=data.sites||[];
  const tasks=sites.reduce((n,s)=>n+(s.tasks||[]).length,0);
  const openTasks=sites.reduce((n,s)=>n+(s.tasks||[]).filter(t=>(t.status||"Open")!=="Done").length,0);
  const visits=sites.reduce((n,s)=>n+(s.visits||[]).length,0);
  const deficiencies=sites.reduce((n,s)=>n+(s.deficiencies||[]).length,0);
  const equipment=sites.reduce((n,s)=>n+(s.equipment||[]).length,0);
  const contacts=sites.reduce((n,s)=>n+(s.contacts||[]).length,0);
  const docs=sites.reduce((n,s)=>n+(s.docs||[]).length,0);
  const gps=sites.filter(hasGps).length;
  const checklist=sites.reduce((n,s)=>n+(s.checklist||[]).length,0);
  const deliveries=sites.reduce((n,s)=>n+(s.reportDeliveries||[]).length,0);
  return {sites:sites.length,tasks,openTasks,visits,deficiencies,equipment,contacts,docs,gps,checklist,deliveries};
}
function backupSummaryText(){
  const b=backupStats();
  return [
    `FireVault Backup Summary - Build ${BUILD}`,
    `Created: ${new Date().toLocaleString()}`,
    `Storage key: ${KEY}`,
    `Sites: ${b.sites}`,
    `GPS sites: ${b.gps}`,
    `Visits: ${b.visits}`,
    `Tasks: ${b.tasks} (${b.openTasks} open)`,
    `Deficiencies: ${b.deficiencies}`,
    `Equipment records: ${b.equipment}`,
    `Contacts: ${b.contacts}`,
    `Documents / Links: ${b.docs}`,
    `Checklist items: ${b.checklist}`,
    `Report deliveries: ${b.deliveries}`
  ].join("\n");
}
function backupSettingsPanel(){
  const b=backupStats();
  const last=localStorage.getItem("firevault_last_backup_export") || "Not exported from this browser yet";
  const totalVaultItems=b.sites+b.visits+b.tasks+b.deficiencies+b.equipment+b.contacts+b.docs+b.checklist+b.deliveries;
  const health=totalVaultItems ? "Ready" : "Empty";
  return `<div class="settingsStack backupCenter449">
    <div class="card settingGroup compactPane backupHero449">
      <div class="paneHead"><div><h2>Backup Center</h2><p class="paneNote">Export before replacing GitHub Pages files or clearing browser data.</p></div><span class="pill backupState449">${health}</span></div>
      <div class="backupStats449">
        <div><strong>${b.sites}</strong><span>Sites</span></div>
        <div><strong>${b.visits}</strong><span>Visits</span></div>
        <div><strong>${b.openTasks}</strong><span>Open Tasks</span></div>
        <div><strong>${b.gps}</strong><span>GPS Saved</span></div>
      </div>
      <div class="backupActionGrid449">
        <button class="primary" id="exportBtn">Export Backup</button>
        <button class="ghost" id="copyBackupSummaryBtn">Copy Summary</button>
      </div>
      <p class="fieldNote">Last export: ${esc(last)}</p>
    </div>
    <div class="card compactPane backupImport449">
      <div class="paneHead"><h2>Import / Restore</h2></div>
      <p class="paneNote">Choose a FireVault JSON backup. Import replaces the current local vault after the file loads.</p>
      ${fieldBlock("Import Backup",`<input type="file" id="importFile" accept="application/json">`)}
    </div>
    <div class="card compactPane backupDanger449">
      <div class="paneHead"><h2>Danger Zone</h2></div>
      <p class="paneNote">Only clears data stored in this browser on this device.</p>
      <button class="danger" id="resetBtn">Clear Local Data</button>
    </div>
  </div>`;
}
function emailTagButtons(){
  return EMAIL_TAGS.map(([tag,label])=>`<button type="button" class="emailTagChip" data-email-tag="${tag}"><strong>${esc(label)}</strong><span>${esc(tag)}</span></button>`).join("");
}
function emailSampleSite(){ return {name:"Acme Fire Panel", street:"123 Main St", city:"Casper", state:"WY", zip:"82601"}; }
function emailPreviewHtml(subject, signature){
  const sample=emailSampleSite();
  const renderedSubject=renderTemplate(subject || "", sample) || "FireVault Report - Acme Fire Panel - Today";
  const renderedSig=renderTemplate(signature || "", sample) || "Technician\nCompany\nPhone\nEmail";
  return `<div class="emailPreviewLine"><strong>Subject</strong><span id="emailPreviewSubject">${esc(renderedSubject)}</span></div><div class="emailPreviewSignature" id="emailPreviewSignature">${esc(renderedSig).replaceAll("\n","<br>")}</div>`;
}
function emailSettingsPanel(email){
  return `<div class="settingsStack emailSettingsPro">
    <div class="card settingGroup compactPane emailComposerPane">
      <div class="paneHead emailPaneHead"><div><h2>Email Defaults</h2><p class="paneNote">Clean templates for outgoing FireVault reports.</p></div><button class="primary saveMini" id="saveSettings">Save</button></div>
      <div class="emailCardStack">
        <section class="emailModule">
          <div class="emailModuleTitle"><span>Recipients</span><small>Optional</small></div>
          <div class="emailRowGrid">
            <div class="emailControl"><label for="emailTo">Default To</label><input id="emailTo" autocomplete="email" inputmode="email" placeholder="customer@example.com" value="${esc(email.defaultTo)}"></div>
            <div class="emailControl"><label for="emailCc">CC</label><input id="emailCc" autocomplete="email" inputmode="email" placeholder="office@example.com" value="${esc(email.cc)}"></div>
          </div>
        </section>
        <section class="emailModule emailTemplateModule">
          <div class="emailModuleTitle"><span>Subject Template</span><small>Tap tags below</small></div>
          <div class="emailControl full"><input id="emailSubject" class="templateInput" value="${esc(email.defaultSubject)}" placeholder="FireVault Report - {site_name} - {date}"></div>
        </section>
        <section class="emailModule emailTemplateModule">
          <div class="emailModuleTitle"><span>Signature Template</span><small>Report footer</small></div>
          <div class="emailControl full"><textarea id="emailSig" class="emailSignatureTextarea" placeholder="{technician}\n{company}\n{phone}\n{email}">${esc(email.signature)}</textarea></div>
        </section>
        <section class="emailModule tagModule">
          <div class="emailModuleTitle"><span>Insert Tags</span><small>Use in subject or signature</small></div>
          <div class="emailTagGrid">${emailTagButtons()}</div>
        </section>
        <section class="emailModule emailPreviewCard">
          <div class="emailModuleTitle"><span>Live Example</span><small>Sample site</small></div>
          ${emailPreviewHtml(email.defaultSubject, email.signature)}
        </section>
      </div>
    </div>
  </div>`;
}
function insertAtCursor(el, text){
  if(!el) return;
  const start=Number.isFinite(el.selectionStart) ? el.selectionStart : el.value.length;
  const end=Number.isFinite(el.selectionEnd) ? el.selectionEnd : el.value.length;
  el.setRangeText(text, start, end, "end");
  el.focus();
  updateEmailPreview();
}
function updateEmailPreview(){
  const subject=document.getElementById("emailSubject");
  const sig=document.getElementById("emailSig");
  const subjectPreview=document.getElementById("emailPreviewSubject");
  const sigPreview=document.getElementById("emailPreviewSignature");
  if(subjectPreview && subject) subjectPreview.textContent=renderTemplate(subject.value, emailSampleSite()) || "FireVault Report";
  if(sigPreview && sig) sigPreview.innerHTML=esc(renderTemplate(sig.value, emailSampleSite())).replaceAll("\n","<br>") || "Signature preview";
}
function settingsPanel(){
  const s=data.settings, t=s.theme, tech=s.technician, email=s.email, r=s.reports, o=s.overlay, a=s.advanced, gps=s.gps||{};
  if(settingsTab==="tech") return `<div class="settingsStack"><div class="card settingGroup compactPane"><div class="paneHead"><h2>Technician Profile</h2><button class="primary saveMini" id="saveSettings">Save</button></div><p class="paneNote">Used on reports, email tags, and future photo stamps.</p><div class="settingsGrid">${fieldBlock("Name",`<input id="techName" value="${esc(tech.name)}">`)}${fieldBlock("Company",`<input id="techCompany" value="${esc(tech.company)}">`)}${fieldBlock("Phone",`<input id="techPhone" value="${esc(tech.phone)}">`)}${fieldBlock("Email",`<input id="techEmail" value="${esc(tech.email)}">`)}${fieldBlock("License / ID",`<input id="techLicense" value="${esc(tech.license)}">`)}</div></div></div>`;
  if(settingsTab==="reports") return `<div class="settingsStack"><div class="card settingGroup compactPane"><div class="paneHead"><h2>Report Defaults</h2><button class="primary saveMini" id="saveSettings">Save</button></div><p class="paneNote">Controls generated site reports.</p><div class="settingsGrid">${fieldBlock("Report Title",`<input id="reportTitle" value="${esc(r.title)}">`)}${fieldBlock("Format",`<select id="reportFormat"><option ${r.format==="detailed"?"selected":""}>detailed</option><option ${r.format==="compact"?"selected":""}>compact</option></select>`)}</div><div class="settingsList">${checkBlock("repTech","Include technician profile",r.includeTechnician)}${checkBlock("repTasks","Include open and completed tasks",r.includeTasks)}${checkBlock("repDef","Include deficiencies",r.includeDeficiencies)}</div></div></div>`;
  if(settingsTab==="email") return emailSettingsPanel(email);
  if(settingsTab==="overlay") return `<div class="settingsStack"><div class="card settingGroup compactPane"><div class="paneHead"><h2>Photo Overlay</h2><button class="primary saveMini" id="saveSettings">Save</button></div><p class="paneNote">Preview and format the field photo stamp.</p><div class="previewPanel compactPreview"><div class="previewOverlay ${o.alignment==="top"?"top":""}">FIREVAULT • Site • Date • Time</div></div><div class="settingsGrid">${fieldBlock("Alignment",`<select id="ovAlign"><option ${o.alignment==="bottom"?"selected":""}>bottom</option><option ${o.alignment==="top"?"selected":""}>top</option></select>`)}${fieldBlock("Font Size",`<select id="ovSize"><option ${o.fontSize==="small"?"selected":""}>small</option><option ${o.fontSize==="medium"?"selected":""}>medium</option><option ${o.fontSize==="large"?"selected":""}>large</option></select>`)}${fieldBlock("Accent Color",`<input id="ovAccent" type="color" value="${esc(o.accentColor)}">`)}</div><div class="settingsList">${checkBlock("ovLogo","Show FireVault logo on overlay",o.showLogo)}</div></div></div>`;
  if(settingsTab==="gps") return `<div class="settingsStack"><div class="card settingGroup compactPane gpsSettingsPane"><div class="paneHead"><h2>GPS / Maps</h2><button class="primary saveMini" id="saveSettings">Save</button></div><p class="paneNote">Restored GPS tools. Coordinates are saved locally inside each site record.</p><div class="settingsGrid">${fieldBlock("Default Map",`<select id="gpsMapProvider"><option value="apple" ${gps.mapProvider!=="google"?"selected":""}>Apple Maps</option><option value="google" ${gps.mapProvider==="google"?"selected":""}>Google Maps</option></select>`)}${fieldBlock("GPS Accuracy",`<select id="gpsHighAccuracy"><option value="true" ${gps.highAccuracy!==false?"selected":""}>High accuracy</option><option value="false" ${gps.highAccuracy===false?"selected":""}>Standard</option></select>`)}${fieldBlock("Nearby Radius",`<input id="gpsNearbyRadius" inputmode="decimal" value="${esc(gps.nearbyRadiusMiles||1)}">`,`Miles for Nearby Sites detection`)}</div><div class="settingsList">${checkBlock("gpsEnabled","Show GPS capture buttons on site pages",gps.enabled!==false)}${checkBlock("gpsReports","Include GPS coordinates in reports",gps.includeInReports!==false)}</div><p class="fieldNote">Browser GPS works only when allowed by the phone/browser and served from HTTPS.</p></div></div>`;
  if(settingsTab==="themes") return `<div class="settingsStack"><div class="card settingGroup compactPane"><div class="paneHead"><h2>Theme Engine</h2><button class="primary saveMini" id="saveSettings">Apply</button></div><p class="paneNote">Quick presets and live UI controls.</p><div class="presetGrid">${Object.entries(themePresets).map(([key,p])=>`<button class="ghost presetBtn" data-preset="${key}"><span class="themeSwatch" style="background:${p.accentColor}"></span><span>${p.label}</span></button>`).join("")}</div><div class="settingsGrid">${fieldBlock("Theme",`<select id="themeName">${Object.entries(themePresets).map(([key,p])=>`<option value="${key}" ${t.name===key?"selected":""}>${p.label}</option>`).join("")}</select>`)}${fieldBlock("Accent Color",`<input id="themeAccent" type="color" value="${esc(t.accentColor||"#ef4444")}">`)}${fieldBlock("Buttons",`<select id="buttonStyle"><option value="rounded" ${t.buttonStyle!=="squared"?"selected":""}>rounded</option><option value="squared" ${t.buttonStyle==="squared"?"selected":""}>squared</option></select>`)}${fieldBlock("Cards",`<select id="cardStyle"><option value="glass" ${t.cardStyle!=="solid"?"selected":""}>glass</option><option value="solid" ${t.cardStyle==="solid"?"selected":""}>solid</option></select>`)}</div><div class="settingsList">${checkBlock("themeHighContrast","High contrast support",t.highContrast)}${checkBlock("themeLargeText","Larger text",t.largeText)}${checkBlock("themeCompact","Compact layout",t.compactLayout)}${checkBlock("themeHaptics","Haptic button feedback",s.app?.haptics!==false)}</div></div></div>`;
  if(settingsTab==="visibility") { const mode=appMode(); const v=visibility(); return `<div class="settingsStack simpleSettings472"><div class="card settingGroup compactPane simpleHero472"><div class="paneHead"><div><h2>Simple View / Feature Visibility</h2><p class="paneNote">Keep FireVault feature-rich, but only show the tools you need day-to-day.</p></div><button class="primary saveMini" id="saveSettings">Save</button></div><div class="settingsGrid">${fieldBlock("App Mode",`<select id="viewMode"><option value="simple" ${mode==="simple"?"selected":""}>Simple View</option><option value="advanced" ${mode==="advanced"?"selected":""}>Advanced View</option><option value="power" ${mode==="power"?"selected":""}>Technician Power Mode</option></select>`,`Simple hides nonessential tools. Advanced shows most modules. Power shows everything.`)}</div><div class="viewModeQuick472"><button class="ghost" data-view-mode="simple">Simple</button><button class="ghost" data-view-mode="advanced">Advanced</button><button class="ghost" data-view-mode="power">Power</button></div></div>${visibilityPresetCards474()}<div class="card settingGroup compactPane"><div class="paneHead"><h2>Visible Features</h2></div><p class="paneNote">These toggles mainly affect Simple View. Advanced View shows most modules unless switched off. Power Mode ignores these and shows everything.</p><div class="settingsList featureList472">${FEATURE_LABELS.map(([key,label,note])=>`<label class="checkRow featureCheck472"><input type="checkbox" id="vis_${key}" ${v[key]?"checked":""}><span><strong>${esc(label)}</strong><small>${esc(note)}</small></span></label>`).join("")}</div></div></div>`; }
  if(settingsTab==="advanced") return `<div class="settingsStack"><div class="card settingGroup compactPane"><div class="paneHead"><h2>Advanced Features</h2><button class="primary saveMini" id="saveSettings">Save</button></div><p class="paneNote"><span class="featureStar">*</span> Requires outside services, permissions, APIs, or future backend modules.</p><div class="settingsList twoCol">${[["advAi","aiTechnician","AI Technician"],["advReverse","reverseAddressLookup","Reverse Address Lookup *"],["advCloud","cloudBackup","Cloud Backup *"],["advVoice","voiceTranscription","Voice Transcription *"],["advOcr","ocrReader","OCR Reader *"],["advEmail","emailGateway","Email Gateway *"],["advWeather","weather","Weather Context *"],["advTraffic","traffic","Traffic / Routing *"]].map(x=>checkBlock(x[0],x[2],a[x[1]])).join("")}</div></div></div>`;
  if(settingsTab==="backup") return backupSettingsPanel();
  return `<div class="settingsStack"><div class="card settingGroup compactPane"><div class="paneHead"><h2>About FireVault</h2></div><p class="paneNote">A modular field knowledge system for fire alarm technicians.</p><div class="aboutGrid"><div><strong>Build</strong><span>${BUILD}</span></div><div><strong>Storage key</strong><span>${KEY}</span></div><div><strong>Roadmap lane</strong><span>Modular foundation, settings polish, iPhone PWA, deeper service-call modules.</span></div></div></div></div>`;
}
function wireSettingsPanel(){
  const saveBtn=document.getElementById("saveSettings"); if(saveBtn) saveBtn.onclick=saveSettings;
  ["emailSubject","emailSig"].forEach(id=>{ const el=document.getElementById(id); if(el){ el.addEventListener("focus",()=>lastEmailTemplateField=id); el.addEventListener("input",updateEmailPreview); } });
  document.querySelectorAll(".emailTagChip").forEach(b=>b.onclick=()=>{ const target=document.getElementById(lastEmailTemplateField) || document.getElementById("emailSubject"); insertAtCursor(target, b.dataset.emailTag || ""); });
  document.querySelectorAll(".presetBtn").forEach(b=>b.onclick=()=>{ const p=themePresets[b.dataset.preset]; data.settings.theme.name=b.dataset.preset; data.settings.theme.accentColor=p.accentColor; if(p.highContrast) data.settings.theme.highContrast=true; save(); settings(); toast("Theme applied."); });
  document.querySelectorAll("[data-view-mode]").forEach(b=>b.onclick=()=>setViewMode(b.dataset.viewMode));
  document.querySelectorAll("[data-feature-preset]").forEach(b=>b.onclick=()=>applyFeaturePreset474(b.dataset.featurePreset));
  const exportBtn=document.getElementById("exportBtn"); if(exportBtn) exportBtn.onclick=()=>{ const stamp=new Date().toISOString().slice(0,10); localStorage.setItem("firevault_last_backup_export", new Date().toLocaleString()); downloadBlob(`firevault-backup-${stamp}-build-${BUILD}.json`, JSON.stringify(data,null,2), "application/json"); toast("Backup exported."); settings(); };
  const copyBackupSummaryBtn=document.getElementById("copyBackupSummaryBtn"); if(copyBackupSummaryBtn) copyBackupSummaryBtn.onclick=async()=>{ try{ await navigator.clipboard.writeText(backupSummaryText()); toast("Backup summary copied."); }catch{ toast("Clipboard unavailable."); } };
  const importFile=document.getElementById("importFile"); if(importFile) importFile.onchange=e=>{ const f=e.target.files[0]; if(!f)return; const r=new FileReader(); r.onload=()=>{try{data=loadData(); Object.assign(data, JSON.parse(r.result)); saveData(data); data=loadData(); applyTheme(); toast("Backup imported."); route("home");}catch{alert("Import failed.");}}; r.readAsText(f); };
  const resetBtn=document.getElementById("resetBtn"); if(resetBtn) resetBtn.onclick=()=>{ if(confirm("Clear FireVault local data on this browser? Export a backup first if you need this vault later.")){localStorage.removeItem(KEY); data=loadData(); applyTheme(); route("home");} };
}
function saveSettings(){
  const s=data.settings;
  if(settingsTab==="tech") s.technician={name:val("techName"),company:val("techCompany"),phone:val("techPhone"),email:val("techEmail"),license:val("techLicense"),defaultRole:"Fire Alarm Technician"};
  if(settingsTab==="reports") s.reports={...s.reports,title:val("reportTitle")||"FireVault Service Report",format:val("reportFormat"),includeTechnician:checked("repTech"),includeTasks:checked("repTasks"),includeDeficiencies:checked("repDef")};
  if(settingsTab==="email") s.email={...s.email,defaultTo:val("emailTo"),cc:val("emailCc"),defaultSubject:val("emailSubject"),signature:raw("emailSig")};
  if(settingsTab==="overlay") s.overlay={...s.overlay,alignment:val("ovAlign"),fontSize:val("ovSize"),accentColor:val("ovAccent"),showLogo:checked("ovLogo")};
  if(settingsTab==="gps") s.gps={enabled:checked("gpsEnabled"),mapProvider:val("gpsMapProvider")||"apple",highAccuracy:val("gpsHighAccuracy")!=="false",includeInReports:checked("gpsReports"),nearbyRadiusMiles:Number(val("gpsNearbyRadius"))||1};
  if(settingsTab==="themes") { s.theme={name:val("themeName"),accentColor:val("themeAccent"),highContrast:checked("themeHighContrast"),largeText:checked("themeLargeText"),compactLayout:checked("themeCompact"),buttonStyle:val("buttonStyle"),cardStyle:val("cardStyle")}; s.app={...(s.app||{}),haptics:checked("themeHaptics"),viewMode:s.app?.viewMode||"simple"}; }
  if(settingsTab==="visibility") { s.app={...(s.app||{}),viewMode:val("viewMode")||"simple"}; const next={...visibility()}; FEATURE_LABELS.forEach(([key])=>next[key]=checked("vis_"+key)); s.visibility=next; }
  if(settingsTab==="advanced") s.advanced={aiTechnician:checked("advAi"),reverseAddressLookup:checked("advReverse"),cloudBackup:checked("advCloud"),voiceTranscription:checked("advVoice"),ocrReader:checked("advOcr"),emailGateway:checked("advEmail"),weather:checked("advWeather"),traffic:checked("advTraffic")};
  save(); toast("Settings saved."); settings();
}


function stabilityReport(){
  const issues=[];
  const pass=[];
  const routeNames=["home","sites","nearbySites","attention","siteDetail","visits","visitDetail","checklist","siteForm","contactsList","contactForm","siteDocs","siteDocForm","equipmentList","equipmentForm","tasks","taskForm","deficiencies","deficiencyForm","report","library","resourceForm","jobMode","settings","diagnostics"];
  pass.push(`${routeNames.length} app routes registered`);
  if(Array.isArray(data.sites)) pass.push("Sites database is an array"); else issues.push("Sites database is not an array");
  if(Array.isArray(data.resources)) pass.push("Library resources database is an array"); else issues.push("Library resources database is not an array");
  if(Array.isArray(data.resourceFolders)) pass.push("Library folders are available"); else issues.push("Library folders are missing");
  if(data.settings && data.settings.app && data.settings.theme && data.settings.gps) pass.push("Core settings objects are present"); else issues.push("One or more core settings objects are missing");
  const ids=new Set();
  (data.sites||[]).forEach((s,idx)=>{
    if(!s.id) issues.push(`Site ${idx+1} is missing an ID`);
    if(s.id && ids.has(s.id)) issues.push(`Duplicate site ID detected: ${s.id}`);
    if(s.id) ids.add(s.id);
    ["visits","tasks","deficiencies","equipment","contacts","docs","checklist","reportDeliveries"].forEach(k=>{
      if(!Array.isArray(s[k])) issues.push(`${s.name||"Unnamed site"} has invalid ${k} storage`);
    });
    if(s.gps && (!Number.isFinite(Number(s.gps.lat)) || !Number.isFinite(Number(s.gps.lng)))) issues.push(`${s.name||"Unnamed site"} has invalid GPS coordinates`);
  });
  const resourceIds=new Set();
  (data.resources||[]).forEach((r,idx)=>{
    if(!r.id) issues.push(`Library resource ${idx+1} is missing an ID`);
    if(r.id && resourceIds.has(r.id)) issues.push(`Duplicate library resource ID detected: ${r.id}`);
    if(r.id) resourceIds.add(r.id);
  });
  if(activeJob && !data.sites.some(s=>s.id===activeJob.siteId)) issues.push("Active service call points to a site that no longer exists");
  if(!issues.length){
    pass.push("No duplicate site IDs found");
    pass.push("No invalid GPS coordinates found");
    pass.push("No orphaned active job found");
  }
  return {issues, pass, status:issues.length ? "Needs Review" : "Passed"};
}
function diagnosticsText(){
  const taskRows=allTaskRows();
  const taskCounts=taskFilterCounts(taskRows);
  const totalDef=data.sites.reduce((n,s)=>n+(s.deficiencies||[]).length,0);
  const totalVisits=data.sites.reduce((n,s)=>n+(s.visits||[]).length,0);
  const stability=stabilityReport();
  const lines=[
    `FireVault Diagnostics`,
    `Build: ${BUILD}`,
    `Stability: ${stability.status}`,
    `Sites: ${data.sites.length}`,
    `Resources: ${data.resources.length}`,
    `Open Tasks: ${taskCounts.open}`,
    `Due Today: ${taskCounts.today}`,
    `Overdue Tasks: ${taskCounts.overdue}`,
    `Deficiencies: ${totalDef}`,
    `Visits: ${totalVisits}`,
    `GPS Saved Sites: ${data.sites.filter(hasGps).length}`,
    `Route Days: ${(data.routeLogs||[]).length}`,
    `Active Job: ${activeJob ? activeJob.siteName : "None"}`,
    `Storage Key: ${KEY}`,
    ``,
    `Stability Issues:`,
    ...(stability.issues.length ? stability.issues.map(i=>`- ${i}`) : ["- None"]),
    ``,
    `Checks Passed:`,
    ...stability.pass.map(p=>`- ${p}`),
    ``,
    `Generated: ${new Date().toLocaleString()}`
  ];
  return lines.join("\n");
}
function copyDiagnostics(){
  const text=diagnosticsText();
  if(navigator.clipboard?.writeText){
    navigator.clipboard.writeText(text).then(()=>toast("Diagnostics copied."),()=>toast("Clipboard unavailable."));
  }else{
    toast("Clipboard unavailable.");
  }
}
function repairVaultState(){
  data = loadData();
  data.sites = Array.isArray(data.sites) ? data.sites : [];
  data.resources = Array.isArray(data.resources) ? data.resources : [];
  data.resourceFolders = Array.isArray(data.resourceFolders) ? data.resourceFolders.filter(Boolean) : ["Manuals","Forms","Links","Codes"];
  if(!data.resourceFolders.length) data.resourceFolders = ["Manuals","Forms","Links","Codes"];
  const siteIds=new Set();
  data.sites.forEach(s=>{
    ensureSite(s);
    if(!s.id || siteIds.has(s.id)) s.id=uid();
    siteIds.add(s.id);
    if(s.gps && (!Number.isFinite(Number(s.gps.lat)) || !Number.isFinite(Number(s.gps.lng)))) s.gps=null;
  });
  const resourceIds=new Set();
  data.resources.forEach(r=>{
    if(!r.id || resourceIds.has(r.id)) r.id=uid();
    resourceIds.add(r.id);
    r.folder = r.folder || "";
  });
  if(activeJob && !data.sites.some(s=>s.id===activeJob.siteId)){
    activeJob=null;
    saveActiveJob();
  }
  localStorage.setItem("firevault_last_stability_check", new Date().toLocaleString());
  save();
  toast("Stability repair completed.");
  diagnostics();
}
function diagnostics(){
  const taskRows=allTaskRows();
  const taskCounts=taskFilterCounts(taskRows);
  const totalTasks=taskRows.length;
  const serviceTasks=taskRows.filter(r=>r.t.source==="Service Call").length;
  const totalDef=data.sites.reduce((n,s)=>n+(s.deficiencies||[]).length,0);
  const openDefTotal=data.sites.reduce((n,s)=>n+(s.deficiencies||[]).filter(d=>(d.status||"Open")!=="Closed").length,0);
  const closedDefTotal=data.sites.reduce((n,s)=>n+(s.deficiencies||[]).filter(d=>(d.status||"Open")==="Closed").length,0);
  const totalVisits=data.sites.reduce((n,s)=>n+(s.visits||[]).length,0);
  const totalContacts=data.sites.reduce((n,s)=>n+(s.contacts||[]).length,0);
  const totalDocs=data.sites.reduce((n,s)=>n+(s.docs||[]).length,0);
  const totalReportDeliveries=data.sites.reduce((n,s)=>n+(s.reportDeliveries||[]).length,0);
  const reportFollowUps=allTaskRows().filter(r=>r.t.source==="Report Delivery" && !taskIsDone(r.t)).length;
  const totalChecklist=data.sites.reduce((n,s)=>n+(s.checklist||[]).length,0);
  const checklistIssues=data.sites.reduce((n,s)=>n+(s.checklist||[]).filter(i=>i.status==="Issue").length,0);
  const completedInspections=data.sites.reduce((n,s)=>n+(s.visits||[]).filter(v=>v.type==="Inspection Checklist").length,0);
  const healthWarn=data.sites.filter(s=>siteHealth(s).cls==="healthWarn").length;
  const healthWatch=data.sites.filter(s=>siteHealth(s).cls==="healthWatch").length;
  const attentionTotal=attentionRows().length;
  const stability=stabilityReport();
  const lastCheck=localStorage.getItem("firevault_last_stability_check") || "Not run yet";
  html(`<div class="screen diagnosticsScreen460">
    <div class="row"><button class="back ghost" id="backHome">←</button><h1>Diagnostics</h1></div>
    <div class="card stabilityHero460 ${stability.issues.length?"needsReview":"passed"}">
      <div><strong>${stability.status}</strong><span>Stability Checkpoint</span></div>
      <p>${stability.issues.length ? `${stability.issues.length} issue${stability.issues.length===1?"":"s"} found. Run Repair Vault if needed.` : "Core data structure, routes, GPS records, and active job state look clean."}</p>
    </div>
    <div class="grid2 diagnosticsActions460">
      <button class="primary" id="repairVaultBtn">Repair Vault</button>
      <button class="ghost" id="copyDiagBtn">Copy Diagnostics</button>
    </div>
    <div class="card diagnosticsGrid460">
      <div><strong>${data.sites.length}</strong><span>Sites</span></div>
      <div><strong>${data.resources.length}</strong><span>Resources</span></div>
      <div><strong>${totalVisits}</strong><span>Visits</span></div>
      <div><strong>${taskCounts.open}</strong><span>Open Tasks</span></div>
      <div><strong>${taskCounts.overdue}</strong><span>Overdue</span></div>
      <div><strong>${openDefTotal}</strong><span>Open Def.</span></div>
      <div><strong>${data.sites.filter(hasGps).length}</strong><span>GPS Saved</span></div>
      <div><strong>${attentionTotal}</strong><span>Attention</span></div>
    </div>
    <div class="list grow diagnosticsList460">
      <div class="card"><h2>Stability Issues</h2>${stability.issues.length?`<ul>${stability.issues.map(i=>`<li>${esc(i)}</li>`).join("")}</ul>`:`<p>No issues found.</p>`}</div>
      <div class="card"><h2>Checks Passed</h2><ul>${stability.pass.map(p=>`<li>${esc(p)}</li>`).join("")}</ul></div>
      <div class="card errorBox"><p>Build: ${BUILD}</p><p>Total Tasks: ${totalTasks}</p><p>Due Today: ${taskCounts.today}</p><p>Service Follow-Ups: ${serviceTasks}</p><p>Total Deficiencies: ${totalDef}</p><p>Closed Deficiencies: ${closedDefTotal}</p><p>Total Contacts: ${totalContacts}</p><p>Total Documents: ${totalDocs}</p><p>Report Deliveries: ${totalReportDeliveries}</p><p>Report Follow-Ups: ${reportFollowUps}</p><p>Checklist Items: ${totalChecklist}</p><p>Checklist Issues: ${checklistIssues}</p><p>Completed Inspections: ${completedInspections}</p><p>Attention Sites: ${healthWarn}</p><p>Watch Sites: ${healthWatch}</p><p>Active Job: ${activeJob ? esc(activeJob.siteName) : "None"}</p><p>Current Theme: ${esc(data.settings.theme.name)}</p><p>Accent: ${esc(data.settings.theme.accentColor)}</p><p>Route Days: ${(data.routeLogs||[]).length}</p><p>GPS Tools: ${data.settings.gps?.enabled !== false ? "Enabled" : "Hidden"}</p><p>Nearby Radius: ${nearbyRadiusMiles()} mi</p><p>Haptics: ${data.settings.app?.haptics !== false ? "Enabled" : "Off"}</p><p>Last Stability Check: ${esc(lastCheck)}</p><p>Storage key: ${KEY}</p><p>Modules loaded successfully.</p></div>
    </div>
  </div>`);
  document.getElementById("backHome").onclick=()=>route("home");
  document.getElementById("repairVaultBtn").onclick=repairVaultState;
  document.getElementById("copyDiagBtn").onclick=copyDiagnostics;
}
function showChangelog(){
  const notes = [
    "Added Quick View Presets for Simple View / Feature Visibility.",
    "Added Minimal Daily, Route Logger, Service Tech, Inspector, and Power Mode presets.",
    "Each preset changes app mode and visible feature toggles in one tap.",
    "Simple View now shows the current preset name on the dashboard.",
    "Preserved the More Tools drawer and all Daily Route features."
  ];
  const overlay=document.createElement("div");
  overlay.className="releaseOverlay";
  overlay.innerHTML=`<div class="releaseSheet" role="dialog" aria-modal="true" aria-label="FireVault release notes">
    <div class="releaseHead"><div><strong>FireVault</strong><span>Build ${BUILD}</span></div><button class="ghost iconBtn" id="closeRelease" aria-label="Close release notes">×</button></div>
    <div class="releaseBody"><h2>Release Notes</h2><p class="releaseIntro">daily route report polish with distance and map links.</p><ul>${notes.map(n=>`<li>${esc(n)}</li>`).join("")}</ul></div>
  </div>`;
  document.body.appendChild(overlay);
  const close=()=>overlay.remove();
  document.getElementById("closeRelease").onclick=close;
  overlay.addEventListener("click",e=>{ if(e.target===overlay) close(); });
}

render();
window.__FIREVAULT_BOOTED = true;
