import { BUILD, KEY, ACTIVE_JOB_KEY, loadData, saveData, ensureSite, fullAddress, esc, uid, downloadBlob } from "./storage.js";

let data = loadData();
let view = new URLSearchParams(location.search).get("route") || data.settings.app?.defaultScreen || "home";
let selectedSiteId = null;
let mode = null;
let settingsTab = "tech";
let settingsRailScroll = 0;
let lastEmailTemplateField = "emailSubject";
let activeJob = loadActiveJob();
let nearbyState = null;
let jobTimer = null;
const QUICK_EVENTS = ["Arrived on site","Opened panel","Panel normal","Trouble active","Ground fault active","Device tested","Customer update","Parts needed"];
const EMAIL_TAGS = [
  ["{site_name}","Site"], ["{date}","Date"], ["{technician}","Tech"],
  ["{company}","Company"], ["{phone}","Phone"], ["{email}","Email"]
];
const appEl = document.getElementById("app");
const themePresets = {
  "firevault-dark": {label:"FireVault Dark", accentColor:"#ef4444"},
  "fire-red": {label:"Fire Red", accentColor:"#ef4444"},
  "industrial-blue": {label:"Industrial Blue", accentColor:"#38bdf8"},
  "night-shift": {label:"Night Shift", accentColor:"#f59e0b"},
  "high-contrast": {label:"High Contrast", accentColor:"#facc15", highContrast:true},
  "amoled-black": {label:"AMOLED Black", accentColor:"#ef4444"}
};

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
function route(v){ view = v; mode = null; render(); }
function html(content){ appEl.innerHTML = content; }
function toast(msg){ const t=document.createElement("div"); t.className="toast"; t.textContent=msg; document.body.appendChild(t); setTimeout(()=>t.remove(),1800); }

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
}

function loadActiveJob(){ try{ const raw = localStorage.getItem(ACTIVE_JOB_KEY); return raw ? JSON.parse(raw) : null; } catch{ return null; } }
function saveActiveJob(){ activeJob ? localStorage.setItem(ACTIVE_JOB_KEY, JSON.stringify(activeJob)) : localStorage.removeItem(ACTIVE_JOB_KEY); }
function fmtDate(d=new Date()){ return d.toLocaleDateString([], {month:"short", day:"numeric", year:"numeric"}); }
function todayIso(){ return new Date().toISOString().slice(0,10); }
function elapsedText(startIso){ const ms=Date.now()-new Date(startIso).getTime(); const h=Math.floor(ms/3600000); const m=Math.floor((ms%3600000)/60000); const s=Math.floor((ms%60000)/1000); return h?`${h}:${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`:`${m}:${String(s).padStart(2,"0")}`; }
function durationText(startIso,endIso){
  if(!startIso || !endIso) return "Duration not saved";
  const ms=Math.max(0,new Date(endIso).getTime()-new Date(startIso).getTime());
  const h=Math.floor(ms/3600000), m=Math.floor((ms%3600000)/60000);
  return h ? `${h}h ${m}m` : `${m}m`;
}
function eventTime(iso){ return new Date(iso).toLocaleTimeString([], {hour:"numeric", minute:"2-digit"}); }
function addJobEvent(note){
  if(!activeJob) return;
  activeJob.events = Array.isArray(activeJob.events) ? activeJob.events : [];
  activeJob.events.unshift({time:new Date().toISOString(), note});
  saveActiveJob();
}
function startJobTimer(){ stopJobTimer(); jobTimer=setInterval(()=>{ const el=document.getElementById("jobElapsed"); if(el && activeJob) el.textContent=elapsedText(activeJob.startedAt); },1000); }
function stopJobTimer(){ if(jobTimer){ clearInterval(jobTimer); jobTimer=null; } }
function setActiveNav(){ document.querySelectorAll("nav button").forEach(b=>b.classList.remove("active")); const section=["siteDetail","siteForm","tasks","taskForm","deficiencies","deficiencyForm","report","jobMode","nearbySites"].includes(view)?"sites":view; document.getElementById("nav-"+section)?.classList.add("active"); }

function render(){
  try{
    const routes = {home, sites, nearbySites, siteDetail, siteForm, tasks, taskForm, deficiencies, deficiencyForm, report, library, resourceForm, jobMode, settings, diagnostics};
    (routes[view] || home)();
    view === "jobMode" ? startJobTimer() : stopJobTimer();
    setActiveNav();
  }catch(err){ showError(err); }
}

function showError(err){
  console.error(err);
  html(`<div class="screen"><div class="card errorBox"><h1>FireVault Diagnostics</h1><p>The app caught an error instead of going black.</p><p>${esc(err?.stack || err?.message || err)}</p><button class="primary" onclick="location.reload()">Reload App</button></div></div>`);
}

function home(){
  const visits = data.sites.flatMap(s => (s.visits||[]).map(v => ({...v, site:s.name})));
  const openTasks = data.sites.reduce((n,s)=>n+(s.tasks||[]).filter(t => (t.status||"Open") !== "Done").length,0);
  const def = data.sites.reduce((n,s)=>n+(s.deficiencies||[]).filter(d => (d.status||"Open") !== "Closed").length,0);
  const gpsSites = data.sites.filter(hasGps).length;
  const now = new Date();
  html(`<div class="screen">
    <div><div class="todayDay"><h1>${now.toLocaleDateString([], {weekday:"long"})}</h1></div><p>${fmtDate(now)} • Modular field dashboard</p></div>
    <div class="grid3">
      <div class="card tile metricCard" id="sitesCard"><strong>${data.sites.length}</strong><span>Sites</span></div>
      <div class="card tile metricCard" id="tasksCard"><strong>${openTasks}</strong><span>Open Tasks</span></div>
      <div class="card tile metricCard" id="defCard"><strong>${def}</strong><span>Deficiencies</span></div>
    </div>
    <div class="grid2 homeActionGrid">
      <button class="primary tile" id="addSiteBtn"><strong>＋ Add Site</strong><span>Create customer vault</span></button>
      <button class="ghost tile gpsHomeTile" id="gpsHomeBtn"><strong>⌖ GPS / Maps</strong><span>${gpsSites} site${gpsSites===1?"":"s"} with GPS</span></button>
      <button class="ghost tile nearbyHomeTile" id="nearbyHomeBtn"><strong>◎ Nearby Sites</strong><span>Detect saved sites near me</span></button>
      <button class="ghost tile" id="settingsBtn"><strong>⚙ Settings</strong><span>Preferences</span></button>
      <button class="ghost tile" id="libraryBtn"><strong>▣ Library</strong><span>Panel resources</span></button>
      <button class="ghost tile" id="diagBtn"><strong>Diagnostics</strong><span>Build status</span></button>
    </div>
    ${activeJob ? `<div class="card activeJobMini"><div class="row"><div><h2>Service Call Active</h2><p>${esc(activeJob.siteName)} • <span id="jobElapsed">${elapsedText(activeJob.startedAt)}</span></p></div><button class="primary" id="resumeJobBtn">Open</button></div></div>` : ""}
    <div class="card grow"><h2>Build ${BUILD}</h2><p>Email Defaults now uses a cleaner template composer with tag chips and live preview.</p><p>Settings tab position now stays where you tapped instead of jumping back to the far left.</p></div>
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
  document.getElementById("settingsBtn").onclick=()=>route("settings");
  document.getElementById("libraryBtn").onclick=()=>route("library");
  document.getElementById("diagBtn").onclick=()=>route("diagnostics");
  const rb=document.getElementById("resumeJobBtn"); if(rb) rb.onclick=()=>{selectedSiteId=activeJob.siteId; route("jobMode");};
}

function sites(){
  html(`<div class="screen"><div class="row"><h1>Sites</h1><div class="miniActions"><button class="ghost smallBtn" id="nearBtn">Nearby</button><button class="primary" id="addBtn">＋</button></div></div>
    <div class="list grow">${data.sites.length?data.sites.map(s=>`<div class="card siteItem redline" data-id="${s.id}"><div class="row"><div><h2>${esc(s.name||"Unnamed Site")}</h2><p>${esc(fullAddress(s))}</p><p>${esc([s.panelManufacturer,s.panelModel].filter(Boolean).join(" ")||"Panel not entered")}</p></div><div class="sitePills"><span class="pill">${(s.tasks||[]).length} tasks</span><span class="pill ${hasGps(s)?"gpsPill":"noGpsPill"}">${hasGps(s)?"GPS saved":"No GPS"}</span></div></div></div>`).join(""):`<div class="empty">No sites yet. Add your first customer vault.</div>`}</div></div>`);
  document.getElementById("addBtn").onclick=()=>{selectedSiteId=null; mode=null; route("siteForm");};
  document.getElementById("nearBtn").onclick=detectNearbySites;
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
  html(`<div class="screen"><div class="row"><button class="back ghost" id="backBtn">←</button><button class="ghost" id="editBtn">Edit</button></div>
    <div class="card redline"><h1>${esc(s.name)}</h1><p>${esc(fullAddress(s))}</p><p>${esc([s.panelManufacturer,s.panelModel].filter(Boolean).join(" ")||"Panel not entered")}</p></div>
    <div class="grid2">
      <button class="primary tile" id="jobBtn"><strong>Start Job</strong><span>Live service call</span></button>
      <button class="ghost tile" id="reportBtn"><strong>Report</strong><span>Copy/download</span></button>
      <button class="ghost tile" id="taskBtn"><strong>${open}</strong><span>Open Tasks</span></button>
      <button class="ghost tile" id="defBtn"><strong>${def}</strong><span>Deficiencies</span></button>
    </div>
    <div class="card gpsCard"><div class="row"><div><h2>GPS / Maps</h2><p>${esc(gpsLine(s))}</p></div>${data.settings.gps?.enabled===false?"":`<button id="captureGpsBtn" class="primary smallBtn">Capture GPS</button>`}</div><div class="mapActions"><button id="appleBtn" class="ghost">Apple Maps</button><button id="googleBtn" class="ghost">Google Maps</button></div></div>
    <div class="card recentVisitsCard"><div class="row"><div><h2>Recent Visits</h2><p>${(s.visits||[]).length ? `${(s.visits||[]).length} saved visit${(s.visits||[]).length===1?"":"s"}` : "No completed visits yet."}</p></div></div>${(s.visits||[]).slice(0,3).map(v=>`<div class="visitMini"><strong>${esc(v.date || fmtDate(new Date(v.startedAt||Date.now())))}</strong><span>${esc(durationText(v.startedAt,v.endedAt))}</span><p>${esc((v.notes||"").split("\n").slice(0,2).join(" • ") || "No visit notes saved.")}</p></div>`).join("")}</div>
    <div class="card grow"><h2>Site Notes</h2><p>${esc(s.notes || "No notes entered.")}</p></div>
  </div>`);
  document.getElementById("backBtn").onclick=()=>route("sites");
  document.getElementById("editBtn").onclick=()=>{mode="edit"; route("siteForm");};
  document.getElementById("taskBtn").onclick=()=>route("tasks");
  document.getElementById("defBtn").onclick=()=>route("deficiencies");
  document.getElementById("reportBtn").onclick=()=>route("report");
  document.getElementById("jobBtn").onclick=startJob;
  const gpsBtn=document.getElementById("captureGpsBtn"); if(gpsBtn) gpsBtn.onclick=captureGpsForSite;
  document.getElementById("appleBtn").onclick=()=>window.open(mapUrl(s,"apple"),"_blank");
  document.getElementById("googleBtn").onclick=()=>window.open(mapUrl(s,"google"),"_blank");
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
  const rows=[]; data.sites.forEach(s=>ensureSite(s).tasks.forEach(t=>rows.push({s,t})));
  const filtered = selectedSiteId ? rows.filter(r=>r.s.id===selectedSiteId) : rows;
  html(`<div class="screen"><div class="row"><button class="back ghost" id="backBtn">←</button><h1>Tasks</h1><button class="primary" id="addBtn">＋</button></div><div class="list grow">${filtered.length?filtered.map(r=>`<div class="card siteItem ${(r.t.status||"Open")==="Done"?"taskDone":"taskOpen"}" data-site="${r.s.id}" data-id="${r.t.id}"><h2>${esc(r.t.title||"Task")}</h2><p>${esc(r.s.name)} • ${esc(r.t.status||"Open")} • ${esc(r.t.due||"No due date")}</p><p>${esc(r.t.notes||"")}</p></div>`).join(""):`<div class="empty">No tasks found.</div>`}</div></div>`);
  document.getElementById("backBtn").onclick=()=>selectedSiteId?route("siteDetail"):route("home");
  document.getElementById("addBtn").onclick=()=>{mode=null; route("taskForm");};
  document.querySelectorAll(".siteItem").forEach(el=>el.onclick=()=>{selectedSiteId=el.dataset.site; mode=el.dataset.id; route("taskForm");});
}
function taskForm(){
  const s = selectedSiteId ? site() : data.sites[0]; if(!s){ alert("Add a site first."); route("sites"); return; }
  const t = mode ? (s.tasks||[]).find(x=>x.id===mode) : {};
  html(`<div class="screen"><div class="row"><button class="back ghost" id="backBtn">←</button><h1>${mode?"Edit":"Add"} Task</h1></div><div class="form grow"><div class="card"><label>Site</label><select id="sitePick">${data.sites.map(x=>`<option value="${x.id}" ${x.id===s.id?"selected":""}>${esc(x.name)}</option>`).join("")}</select><label>Title</label><input id="title" value="${esc(t.title||"")}"><div class="compactField"><div><label>Status</label><select id="status"><option ${t.status!=="Done"?"selected":""}>Open</option><option ${t.status==="Done"?"selected":""}>Done</option></select></div><div><label>Due</label><input id="due" type="date" value="${esc(t.due||"")}"></div></div><label>Notes</label><textarea id="notes">${esc(t.notes||"")}</textarea></div><button class="primary" id="saveBtn">Save Task</button>${mode?`<button class="danger" id="delBtn">Delete Task</button>`:""}</div></div>`);
  document.getElementById("backBtn").onclick=()=>route("tasks");
  document.getElementById("saveBtn").onclick=()=>{ const target=ensureSite(data.sites.find(x=>x.id===val("sitePick"))); const obj={title:val("title")||"Untitled Task",status:val("status"),due:val("due"),notes:raw("notes")}; target.tasks=target.tasks||[]; if(mode){ Object.assign(t,obj); } else target.tasks.unshift({...obj,id:uid(),createdAt:new Date().toISOString()}); selectedSiteId=target.id; save(); route("tasks"); };
  const del=document.getElementById("delBtn"); if(del) del.onclick=()=>{s.tasks=s.tasks.filter(x=>x.id!==mode); save(); route("tasks");};
}

function deficiencies(){
  const rows=[]; data.sites.forEach(s=>ensureSite(s).deficiencies.forEach(d=>rows.push({s,d})));
  const filtered = selectedSiteId ? rows.filter(r=>r.s.id===selectedSiteId) : rows;
  html(`<div class="screen"><div class="row"><button class="back ghost" id="backBtn">←</button><h1>Deficiencies</h1><button class="primary" id="addBtn">＋</button></div><div class="list grow">${filtered.length?filtered.map(r=>`<div class="card siteItem deficiencyCard" data-site="${r.s.id}" data-id="${r.d.id}"><h2>${esc(r.d.title||"Deficiency")}</h2><p>${esc(r.s.name)} • ${esc(r.d.priority||"Normal")} • ${esc(r.d.status||"Open")}</p><p>${esc(r.d.notes||"")}</p></div>`).join(""):`<div class="empty">No deficiencies found.</div>`}</div></div>`);
  document.getElementById("backBtn").onclick=()=>selectedSiteId?route("siteDetail"):route("home");
  document.getElementById("addBtn").onclick=()=>{mode=null; route("deficiencyForm");};
  document.querySelectorAll(".siteItem").forEach(el=>el.onclick=()=>{selectedSiteId=el.dataset.site; mode=el.dataset.id; route("deficiencyForm");});
}
function deficiencyForm(){
  const s = selectedSiteId ? site() : data.sites[0]; if(!s){ alert("Add a site first."); route("sites"); return; }
  const d = mode ? (s.deficiencies||[]).find(x=>x.id===mode) : {};
  html(`<div class="screen"><div class="row"><button class="back ghost" id="backBtn">←</button><h1>${mode?"Edit":"Add"} Deficiency</h1></div><div class="form grow"><div class="card"><label>Site</label><select id="sitePick">${data.sites.map(x=>`<option value="${x.id}" ${x.id===s.id?"selected":""}>${esc(x.name)}</option>`).join("")}</select><label>Title</label><input id="title" value="${esc(d.title||"")}"><div class="compactField"><div><label>Priority</label><select id="priority">${["Normal","High","Critical"].map(x=>`<option ${d.priority===x?"selected":""}>${x}</option>`).join("")}</select></div><div><label>Status</label><select id="status"><option ${d.status!=="Closed"?"selected":""}>Open</option><option ${d.status==="Closed"?"selected":""}>Closed</option></select></div></div><label>Notes</label><textarea id="notes">${esc(d.notes||"")}</textarea><label><input type="checkbox" id="makeTask" ${!mode?"checked":""}> Create matching follow-up task</label></div><button class="primary" id="saveBtn">Save Deficiency</button>${mode?`<button class="danger" id="delBtn">Delete Deficiency</button>`:""}</div></div>`);
  document.getElementById("backBtn").onclick=()=>route("deficiencies");
  document.getElementById("saveBtn").onclick=()=>{ const target=ensureSite(data.sites.find(x=>x.id===val("sitePick"))); const obj={title:val("title")||"Untitled Deficiency",priority:val("priority"),status:val("status"),notes:raw("notes")}; target.deficiencies=target.deficiencies||[]; if(mode){ Object.assign(d,obj); } else { target.deficiencies.unshift({...obj,id:uid(),createdAt:new Date().toISOString()}); if(checked("makeTask")){target.tasks.unshift({id:uid(),title:"Resolve: "+obj.title,status:"Open",due:"",notes:obj.notes,createdAt:new Date().toISOString()});} } selectedSiteId=target.id; save(); route("deficiencies"); };
  const del=document.getElementById("delBtn"); if(del) del.onclick=()=>{s.deficiencies=s.deficiencies.filter(x=>x.id!==mode); save(); route("deficiencies");};
}

function reportText(s){
  const set=data.settings, tech=set.technician||{};
  return `${set.reports.title}\nGenerated: ${new Date().toLocaleString()}\n\nSITE\n${s.name}\n${fullAddress(s)}\nPanel: ${[s.panelManufacturer,s.panelModel].filter(Boolean).join(" ")||"Not entered"}\nGPS: ${data.settings.gps?.includeInReports===false?"Hidden in Settings":gpsLine(s)}\nMap: ${mapUrl(s,(set.gps&&set.gps.mapProvider)||"apple")}\n\nTECHNICIAN\n${tech.name||""}\n${tech.company||""}\n${tech.phone||""}\n${tech.email||""}\n\nTASKS\n${(s.tasks||[]).map(t=>`- ${t.status||"Open"}: ${t.title}${t.due?` due ${t.due}`:""}`).join("\n")||"No tasks"}\n\nDEFICIENCIES\n${(s.deficiencies||[]).map(d=>`- ${d.status||"Open"}: ${d.priority||"Normal"} - ${d.title}`).join("\n")||"No deficiencies"}\n\nNOTES\n${s.notes||"No notes"}\n\nEMAIL SUBJECT\n${renderTemplate(set.email.defaultSubject,s)}\n\nSIGNATURE\n${renderTemplate(set.email.signature,s)}`;
}
function renderTemplate(t,s){ const tech=data.settings.technician||{}; return String(t||"").replaceAll("{site_name}",s.name||"").replaceAll("{date}",fmtDate()).replaceAll("{technician}",tech.name||"").replaceAll("{company}",tech.company||"").replaceAll("{phone}",tech.phone||"").replaceAll("{email}",tech.email||""); }
function report(){ const s=site(); if(!s){route("sites"); return;} const txt=reportText(s); html(`<div class="screen"><div class="row"><button class="back ghost" id="backBtn">←</button><h1>Report</h1></div><div class="reportActions"><button class="primary" id="copyBtn">Copy Report</button><button class="ghost" id="downloadBtn">Download TXT</button></div><div class="card reportBox grow">${esc(txt)}</div></div>`); document.getElementById("backBtn").onclick=()=>route("siteDetail"); document.getElementById("copyBtn").onclick=async()=>{await navigator.clipboard.writeText(txt); toast("Report copied.");}; document.getElementById("downloadBtn").onclick=()=>downloadBlob(`firevault-report-${(s.name||"site").replace(/\W+/g,"-")}.txt`,txt); }

function library(){ html(`<div class="screen"><div class="row"><h1>Library</h1><button class="primary" id="addBtn">＋</button></div><div class="list grow">${data.resources.length?data.resources.map(r=>`<div class="card docLine siteItem" data-id="${r.id}"><h2>${esc(r.m||"Resource")}</h2><p>${esc(r.n||"")}</p><p>${esc(r.url||"")}</p></div>`).join(""):`<div class="empty">No resources yet.</div>`}</div></div>`); document.getElementById("addBtn").onclick=()=>{mode=null; route("resourceForm");}; document.querySelectorAll(".siteItem").forEach(el=>el.onclick=()=>{mode=el.dataset.id; route("resourceForm");}); }
function resourceForm(){ const r=mode?data.resources.find(x=>x.id===mode):{}; html(`<div class="screen"><div class="row"><button class="back ghost" id="backBtn">←</button><h1>${mode?"Edit":"Add"} Resource</h1></div><div class="form grow"><div class="card"><label>Manufacturer</label><input id="m" value="${esc(r.m||"")}"><label>Name / Model</label><input id="n" value="${esc(r.n||"")}"><label>URL / Notes</label><textarea id="url">${esc(r.url||"")}</textarea></div><button class="primary" id="saveBtn">Save Resource</button>${mode?`<button class="danger" id="delBtn">Delete Resource</button>`:""}</div></div>`); document.getElementById("backBtn").onclick=()=>route("library"); document.getElementById("saveBtn").onclick=()=>{const obj={m:val("m"),n:val("n"),url:raw("url")}; if(mode) Object.assign(r,obj); else data.resources.unshift({...obj,id:uid()}); save(); route("library");}; const del=document.getElementById("delBtn"); if(del) del.onclick=()=>{data.resources=data.resources.filter(x=>x.id!==mode); save(); route("library");}; }

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
    <div class="card quickEventCard"><h2>Quick Events</h2><div class="quickEventGrid">${QUICK_EVENTS.map(q=>`<button class="ghost quickEventBtn" data-note="${esc(q)}">${esc(q)}</button>`).join("")}</div></div>
    <div class="grid2"><button class="ghost" id="noteBtn">Custom Event</button><button class="primary" id="finishBtn">Finish Visit</button></div>
    <div class="list grow serviceEventList">${events.length?events.map(e=>`<div class="card visit"><strong>${esc(eventTime(e.time))}</strong><p>${esc(e.note)}</p></div>`).join(""):`<div class="empty">No events yet.</div>`}</div>
  </div>`);
  document.getElementById("backBtn").onclick=()=>route("siteDetail");
  document.querySelectorAll(".quickEventBtn").forEach(b=>b.onclick=()=>{addJobEvent(b.dataset.note); render();});
  document.getElementById("noteBtn").onclick=()=>{const note=prompt("Event note:","Checked panel"); if(note){addJobEvent(note); render();}};
  document.getElementById("finishBtn").onclick=()=>{
    s.visits=s.visits||[];
    const endedAt=new Date().toISOString();
    s.visits.unshift({id:uid(),date:todayIso(),startedAt:activeJob.startedAt,endedAt,notes:(activeJob.events||[]).map(e=>`${eventTime(e.time)} - ${e.note}`).join("\n")});
    activeJob=null; saveActiveJob(); save(); toast("Visit saved."); route("siteDetail");
  };
}

function settings(){
  const tabs=[
    ["tech","Tech"],["reports","Report"],["email","Email"],["overlay","Photos"],
    ["gps","GPS"],["themes","Theme"],["advanced","Advanced"],["backup","Backup"],["about","About"]
  ];
  const active=tabs.find(t=>t[0]===settingsTab)||tabs[0];
  html(`<div class="screen settingsScreen settingsScreen409">
    <div class="settingsMiniHead">
      <div class="settingsMiniTitle"><h1>Settings</h1><p>${active[1]}</p></div>
      <button class="ghost iconBtn settingsInfoBtn" id="diagBtn" title="Diagnostics" aria-label="Diagnostics">ⓘ</button>
    </div>
    <div class="settingsPickerRail" id="settingsPickerRail" aria-label="Settings sections">${tabs.map(t=>`<button class="settingsPill ${settingsTab===t[0]?"active":""}" data-tab="${t[0]}">${t[1]}</button>`).join("")}</div>
    <div class="settingsContent settingsContent409 grow">${settingsPanel()}</div>
  </div>`);
  const rail=document.getElementById("settingsPickerRail");
  if(rail){
    rail.scrollLeft=settingsRailScroll;
    rail.addEventListener("scroll",()=>{ settingsRailScroll=rail.scrollLeft; }, {passive:true});
  }
  document.querySelectorAll(".settingsPill").forEach(b=>b.onclick=()=>{
    const currentRail=document.getElementById("settingsPickerRail");
    if(currentRail) settingsRailScroll=currentRail.scrollLeft;
    settingsTab=b.dataset.tab;
    settings();
  });
  document.getElementById("diagBtn").onclick=()=>route("diagnostics");
  wireSettingsPanel();
}
function fieldBlock(label, inner, note=""){
  return `<div class="settingField"><label>${label}</label>${inner}${note?`<p class="fieldNote">${note}</p>`:""}</div>`;
}
function checkBlock(id, text, on){
  return `<label class="checkRow"><input type="checkbox" id="${id}" ${on?"checked":""}><span>${text}</span></label>`;
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
  if(settingsTab==="themes") return `<div class="settingsStack"><div class="card settingGroup compactPane"><div class="paneHead"><h2>Theme Engine</h2><button class="primary saveMini" id="saveSettings">Apply</button></div><p class="paneNote">Quick presets and live UI controls.</p><div class="presetGrid">${Object.entries(themePresets).map(([key,p])=>`<button class="ghost presetBtn" data-preset="${key}"><span class="themeSwatch" style="background:${p.accentColor}"></span><span>${p.label}</span></button>`).join("")}</div><div class="settingsGrid">${fieldBlock("Theme",`<select id="themeName">${Object.entries(themePresets).map(([key,p])=>`<option value="${key}" ${t.name===key?"selected":""}>${p.label}</option>`).join("")}</select>`)}${fieldBlock("Accent Color",`<input id="themeAccent" type="color" value="${esc(t.accentColor||"#ef4444")}">`)}${fieldBlock("Buttons",`<select id="buttonStyle"><option value="rounded" ${t.buttonStyle!=="squared"?"selected":""}>rounded</option><option value="squared" ${t.buttonStyle==="squared"?"selected":""}>squared</option></select>`)}${fieldBlock("Cards",`<select id="cardStyle"><option value="glass" ${t.cardStyle!=="solid"?"selected":""}>glass</option><option value="solid" ${t.cardStyle==="solid"?"selected":""}>solid</option></select>`)}</div><div class="settingsList">${checkBlock("themeHighContrast","High contrast support",t.highContrast)}${checkBlock("themeLargeText","Larger text",t.largeText)}${checkBlock("themeCompact","Compact layout",t.compactLayout)}</div></div></div>`;
  if(settingsTab==="advanced") return `<div class="settingsStack"><div class="card settingGroup compactPane"><div class="paneHead"><h2>Advanced Features</h2><button class="primary saveMini" id="saveSettings">Save</button></div><p class="paneNote"><span class="featureStar">*</span> Requires outside services, permissions, APIs, or future backend modules.</p><div class="settingsList twoCol">${[["advAi","aiTechnician","AI Technician"],["advReverse","reverseAddressLookup","Reverse Address Lookup *"],["advCloud","cloudBackup","Cloud Backup *"],["advVoice","voiceTranscription","Voice Transcription *"],["advOcr","ocrReader","OCR Reader *"],["advEmail","emailGateway","Email Gateway *"],["advWeather","weather","Weather Context *"],["advTraffic","traffic","Traffic / Routing *"]].map(x=>checkBlock(x[0],x[2],a[x[1]])).join("")}</div></div></div>`;
  if(settingsTab==="backup") return `<div class="settingsStack"><div class="card settingGroup compactPane"><div class="paneHead"><h2>Import / Export</h2></div><p class="paneNote">Export before replacing files in GitHub Pages.</p><div class="settingsList"><button class="primary" id="exportBtn">Export Backup</button>${fieldBlock("Import Backup",`<input type="file" id="importFile" accept="application/json">`)}<button class="danger" id="resetBtn">Clear Local Data</button></div></div></div>`;
  return `<div class="settingsStack"><div class="card settingGroup compactPane"><div class="paneHead"><h2>About FireVault</h2></div><p class="paneNote">A modular field knowledge system for fire alarm technicians.</p><div class="aboutGrid"><div><strong>Build</strong><span>${BUILD}</span></div><div><strong>Storage key</strong><span>${KEY}</span></div><div><strong>Roadmap lane</strong><span>Modular foundation, settings polish, iPhone PWA, deeper service-call modules.</span></div></div></div></div>`;
}
function wireSettingsPanel(){
  const saveBtn=document.getElementById("saveSettings"); if(saveBtn) saveBtn.onclick=saveSettings;
  ["emailSubject","emailSig"].forEach(id=>{ const el=document.getElementById(id); if(el){ el.addEventListener("focus",()=>lastEmailTemplateField=id); el.addEventListener("input",updateEmailPreview); } });
  document.querySelectorAll(".emailTagChip").forEach(b=>b.onclick=()=>{ const target=document.getElementById(lastEmailTemplateField) || document.getElementById("emailSubject"); insertAtCursor(target, b.dataset.emailTag || ""); });
  document.querySelectorAll(".presetBtn").forEach(b=>b.onclick=()=>{ const p=themePresets[b.dataset.preset]; data.settings.theme.name=b.dataset.preset; data.settings.theme.accentColor=p.accentColor; if(p.highContrast) data.settings.theme.highContrast=true; save(); settings(); toast("Theme applied."); });
  const exportBtn=document.getElementById("exportBtn"); if(exportBtn) exportBtn.onclick=()=>downloadBlob(`firevault-backup-build-${BUILD}.json`, JSON.stringify(data,null,2), "application/json");
  const importFile=document.getElementById("importFile"); if(importFile) importFile.onchange=e=>{ const f=e.target.files[0]; if(!f)return; const r=new FileReader(); r.onload=()=>{try{data=loadData(); Object.assign(data, JSON.parse(r.result)); saveData(data); data=loadData(); applyTheme(); toast("Backup imported."); route("home");}catch{alert("Import failed.");}}; r.readAsText(f); };
  const resetBtn=document.getElementById("resetBtn"); if(resetBtn) resetBtn.onclick=()=>{ if(confirm("Clear FireVault local data on this browser?")){localStorage.removeItem(KEY); data=loadData(); applyTheme(); route("home");} };
}
function saveSettings(){
  const s=data.settings;
  if(settingsTab==="tech") s.technician={name:val("techName"),company:val("techCompany"),phone:val("techPhone"),email:val("techEmail"),license:val("techLicense"),defaultRole:"Fire Alarm Technician"};
  if(settingsTab==="reports") s.reports={...s.reports,title:val("reportTitle")||"FireVault Service Report",format:val("reportFormat"),includeTechnician:checked("repTech"),includeTasks:checked("repTasks"),includeDeficiencies:checked("repDef")};
  if(settingsTab==="email") s.email={...s.email,defaultTo:val("emailTo"),cc:val("emailCc"),defaultSubject:val("emailSubject"),signature:raw("emailSig")};
  if(settingsTab==="overlay") s.overlay={...s.overlay,alignment:val("ovAlign"),fontSize:val("ovSize"),accentColor:val("ovAccent"),showLogo:checked("ovLogo")};
  if(settingsTab==="gps") s.gps={enabled:checked("gpsEnabled"),mapProvider:val("gpsMapProvider")||"apple",highAccuracy:val("gpsHighAccuracy")!=="false",includeInReports:checked("gpsReports"),nearbyRadiusMiles:Number(val("gpsNearbyRadius"))||1};
  if(settingsTab==="themes") s.theme={name:val("themeName"),accentColor:val("themeAccent"),highContrast:checked("themeHighContrast"),largeText:checked("themeLargeText"),compactLayout:checked("themeCompact"),buttonStyle:val("buttonStyle"),cardStyle:val("cardStyle")};
  if(settingsTab==="advanced") s.advanced={aiTechnician:checked("advAi"),reverseAddressLookup:checked("advReverse"),cloudBackup:checked("advCloud"),voiceTranscription:checked("advVoice"),ocrReader:checked("advOcr"),emailGateway:checked("advEmail"),weather:checked("advWeather"),traffic:checked("advTraffic")};
  save(); toast("Settings saved."); settings();
}

function diagnostics(){ const totalTasks=data.sites.reduce((n,s)=>n+(s.tasks||[]).length,0); const totalDef=data.sites.reduce((n,s)=>n+(s.deficiencies||[]).length,0); const totalVisits=data.sites.reduce((n,s)=>n+(s.visits||[]).length,0); html(`<div class="screen"><div class="row"><button class="back ghost" id="backHome">←</button><h1>Diagnostics</h1></div><div class="card grow errorBox"><p>Build: ${BUILD}</p><p>Sites: ${data.sites.length}</p><p>Total Tasks: ${totalTasks}</p><p>Total Deficiencies: ${totalDef}</p><p>Total Visits: ${totalVisits}</p><p>Active Job: ${activeJob ? esc(activeJob.siteName) : "None"}</p><p>Current Theme: ${esc(data.settings.theme.name)}</p><p>Accent: ${esc(data.settings.theme.accentColor)}</p><p>Advanced AI Enabled: ${data.settings.advanced?.aiTechnician ? "Yes" : "No"}</p><p>GPS Tools: ${data.settings.gps?.enabled !== false ? "Enabled" : "Hidden"}</p><p>Nearby Radius: ${nearbyRadiusMiles()} mi</p><p>Import/Export: Ready</p><p>Storage key: ${KEY}</p><p>Modules loaded successfully.</p></div></div>`); document.getElementById("backHome").onclick=()=>route("home"); }
function showChangelog(){
  const notes = [
    "Build number advanced to 0.41.8 across the header, manifest, diagnostics, and release notes.",
    "Redesigned Email Defaults into a modern template composer with recipient, subject, signature, tag, and preview sections.",
    "Replaced the cramped inline tag help with tappable insert-tag chips.",
    "Added live subject and signature preview using a sample site and technician profile.",
    "Settings pill-tab rail now remembers its horizontal scroll position after a tab is pressed.",
    "Kept Nearby Sites, GPS capture, map actions, GPS report support, and the iPhone safe-area baseline from 0.41.7."
  ];
  const overlay=document.createElement("div");
  overlay.className="releaseOverlay";
  overlay.innerHTML=`<div class="releaseSheet" role="dialog" aria-modal="true" aria-label="FireVault release notes">
    <div class="releaseHead"><div><strong>FireVault</strong><span>Build ${BUILD}</span></div><button class="ghost iconBtn" id="closeRelease" aria-label="Close release notes">×</button></div>
    <div class="releaseBody"><h2>Release Notes</h2><p class="releaseIntro">Email Defaults redesign and Settings tab position fix.</p><ul>${notes.map(n=>`<li>${esc(n)}</li>`).join("")}</ul></div>
  </div>`;
  document.body.appendChild(overlay);
  const close=()=>overlay.remove();
  document.getElementById("closeRelease").onclick=close;
  overlay.addEventListener("click",e=>{ if(e.target===overlay) close(); });
}
render();
