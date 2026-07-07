import { BUILD, KEY, loadData, saveData, ensureSite, fullAddress, esc, uid } from "./storage.js";
import { stampFireVaultPhoto } from "./photos.js";

let data = loadData();
let view = "home";
let selectedSiteId = null;
let mode = null;
let currentDocImageData = "";
let settingsTab = "tech";
const ACTIVE_JOB_KEY = "firevault_active_job_modular";
let activeJob = loadActiveJob();
let jobTimer = null;

const appEl = document.getElementById("app");
document.getElementById("buildButton").addEventListener("click", showChangelog);
document.querySelectorAll("nav button").forEach(btn => btn.addEventListener("click", () => route(btn.dataset.route)));

window.addEventListener("error", e => showError(e.error || e.message));
window.addEventListener("unhandledrejection", e => showError(e.reason || e));

function save(){ saveData(data); }
function site(){ return ensureSite(data.sites.find(s => s.id === selectedSiteId) || {}); }
function getSite(){ return data.sites.find(s => s.id === selectedSiteId); }
function val(id){ return document.getElementById(id)?.value?.trim() || ""; }
function checked(id){ return !!document.getElementById(id)?.checked; }

function loadActiveJob(){
  try{
    const raw = localStorage.getItem(ACTIVE_JOB_KEY);
    return raw ? JSON.parse(raw) : null;
  }catch(err){
    console.error("Active job load failed", err);
    return null;
  }
}

function saveActiveJob(){
  if(activeJob) localStorage.setItem(ACTIVE_JOB_KEY, JSON.stringify(activeJob));
  else localStorage.removeItem(ACTIVE_JOB_KEY);
}

function fmtTime(iso){
  if(!iso) return "";
  return new Date(iso).toLocaleTimeString([], {hour:"numeric", minute:"2-digit"});
}

function elapsedText(startIso){
  const ms = Date.now() - new Date(startIso).getTime();
  const h = Math.floor(ms/3600000);
  const m = Math.floor((ms%3600000)/60000);
  const s = Math.floor((ms%60000)/1000);
  return h ? `${h}:${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}` : `${m}:${String(s).padStart(2,"0")}`;
}

function startJobTimer(){
  stopJobTimer();
  jobTimer = setInterval(() => {
    const el = document.getElementById("jobElapsed");
    if(el && activeJob) el.textContent = elapsedText(activeJob.startedAt);
  }, 1000);
}

function stopJobTimer(){
  if(jobTimer){ clearInterval(jobTimer); jobTimer = null; }
}

function route(v){ view = v; mode = null; render(); }

function render(){
  try{
    const routes = {home, sites, siteDetail, siteForm, docs, docForm, imageViewer, library, resourceForm, jobMode, visits, visitDetail, tasks, taskForm, deficiencies, deficiencyForm, report, importer, aiTechnician, dailySummary, settings, diagnostics};
    (routes[view] || home)();
    if(view === "jobMode") startJobTimer(); else stopJobTimer();
    setActiveNav();
  }catch(err){
    showError(err);
  }
}

function html(content){ appEl.innerHTML = content; }

function showError(err){
  console.error(err);
  html(`<div class="screen">
    <div class="card errorBox">
      <h1>FireVault Diagnostics</h1>
      <p>The app caught an error instead of going black.</p>
      <p>${esc(err?.stack || err?.message || err)}</p>
      <button class="primary" onclick="location.reload()">Reload App</button>
    </div>
  </div>`);
}

function setActiveNav(){
  document.querySelectorAll("nav button").forEach(b => b.classList.remove("active"));
  const section = ["siteDetail","siteForm","docs","docForm","imageViewer","jobMode","visits","visitDetail","tasks","taskForm","deficiencies","deficiencyForm","report","aiTechnician"].includes(view) ? "sites" : view;
  document.getElementById("nav-"+section)?.classList.add("active");
}


function getCurrentGps(cb){
  if(!navigator.geolocation){
    alert("GPS is not available in this browser.");
    return;
  }
  navigator.geolocation.getCurrentPosition(
    pos => cb(pos.coords.latitude, pos.coords.longitude),
    err => alert("GPS failed: " + err.message),
    {enableHighAccuracy:true, timeout:12000, maximumAge:30000}
  );
}

function distanceFeet(lat1,lng1,lat2,lng2){
  if(!lat1 || !lng1 || !lat2 || !lng2) return null;
  const R=6371000;
  const toRad=x=>x*Math.PI/180;
  const dLat=toRad(Number(lat2)-Number(lat1));
  const dLng=toRad(Number(lng2)-Number(lng1));
  const a=Math.sin(dLat/2)**2 + Math.cos(toRad(Number(lat1))) * Math.cos(toRad(Number(lat2))) * Math.sin(dLng/2)**2;
  const meters=R*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));
  return Math.round(meters*3.28084);
}

function formatDistance(ft){
  if(ft === null || ft === undefined) return "";
  return ft > 5280 ? (ft/5280).toFixed(1)+" mi" : ft+" ft";
}

function mapQuery(s){
  if(s.lat && s.lng) return encodeURIComponent(s.lat + "," + s.lng);
  return encodeURIComponent(fullAddress(s));
}

function openAppleMaps(s){
  window.open("https://maps.apple.com/?q=" + mapQuery(s), "_blank");
}

function openGoogleMaps(s){
  window.open("https://www.google.com/maps/search/?api=1&query=" + mapQuery(s), "_blank");
}

function nearbySitesFrom(lat,lng){
  return data.sites
    .map(s => ({site:s, ft:distanceFeet(lat,lng,s.lat,s.lng)}))
    .filter(x => x.ft !== null)
    .sort((a,b)=>a.ft-b.ft);
}

function todayLabel(){
  const now = new Date();
  return {
    day: now.toLocaleDateString([], {weekday:"long"}),
    date: now.toLocaleDateString([], {month:"long", day:"numeric", year:"numeric"})
  };
}

function openVisitsPlaceholder(){
  alert("Visit History module is coming next. This card is now wired as a shortcut.");
}

function openTasksPlaceholder(){
  alert("Tasks module is coming back in an upcoming modular build. This card is now wired as a shortcut.");
}

function home(){
  const visits = data.sites.flatMap(s => (s.visits||[]).map(v => ({...v, site:s.name})));
  const openTasks = data.sites.reduce((n,s)=>n+(s.tasks||[]).filter(t => (t.status||"Open") !== "Done").length,0);
  const today = todayLabel();
  html(`<div class="screen">
    <div><div class="todayDay">${today.day}</div><div class="todayDate">${today.date}</div><p>Field dashboard for today’s service work.</p></div>
    <div class="grid3">
      <div class="card tile metricCard" id="sitesCard"><strong>${data.sites.length}</strong><span>Sites</span></div>
      <div class="card tile metricCard" id="visitsCard"><strong>${visits.length}</strong><span>Visits</span></div>
      <div class="card tile metricCard" id="tasksCard"><strong>${openTasks}</strong><span>Open Tasks</span></div>
    </div>
    <div class="grid2">
      <button class="primary tile" id="nearbyBtn"><strong>📍 Nearby Site</strong><span>Use GPS to match location</span></button>
      <button class="ghost tile" id="dailyBtn"><strong>🧭 Daily Summary</strong><span>Route and breadcrumbs</span></button>
      <button class="ghost tile" id="addSiteBtn"><strong>＋ Add Site</strong><span>Create customer vault</span></button>
      <button class="ghost tile" id="dropCrumbBtn"><strong>📌 Drop Crumb</strong><span>Save current GPS</span></button>
    </div>
    <div id="nearbyBox"></div>
    ${activeJob ? `<div class="card activeJobMini"><div class="row"><div><h2>Service Call Active</h2><p>${esc(activeJob.siteName)} • <span id="jobElapsed">${elapsedText(activeJob.startedAt)}</span></p></div><button class="primary" id="resumeJobBtn">Open</button></div></div>` : ""}
    <div class="card grow"><h2>Job Mode Module</h2><p>Start live service calls, timestamp events, and finish calls into visit history.</p><button class="ghost" id="diagBtn">Diagnostics</button></div>
  </div>`);
  document.getElementById("sitesCard").onclick = () => route("sites");
  document.getElementById("visitsCard").onclick = () => route("visits");
  document.getElementById("tasksCard").onclick = () => { selectedSiteId=null; view="tasks"; render(); };
  document.getElementById("addSiteBtn").onclick = () => { selectedSiteId=null; view="siteForm"; render(); };
  document.getElementById("diagBtn").onclick = () => { view="diagnostics"; render(); };
  document.getElementById("nearbyBtn").onclick = scanNearbySites;
  document.getElementById("dailyBtn").onclick = () => { view="dailySummary"; render(); };
  document.getElementById("dropCrumbBtn").onclick = dropBreadcrumb;
  const resumeBtn = document.getElementById("resumeJobBtn");
  if(resumeBtn) resumeBtn.onclick = () => {
    selectedSiteId = activeJob.siteId;
    view = "jobMode";
    render();
  };
}

function scanNearbySites(){
  const box = document.getElementById("nearbyBox");
  if(box) box.innerHTML = `<div class="card">Checking GPS...</div>`;
  getCurrentGps((lat,lng)=>{
    const matches = nearbySitesFrom(lat,lng).slice(0,5);
    if(!box) return;
    if(!matches.length){
      box.innerHTML = `<div class="card gpsWarn"><h2>No GPS site match</h2><p>Add GPS coordinates to customer sites using Edit Site → Use Current GPS.</p></div>`;
      return;
    }
    box.innerHTML = `<div class="card gpsGood"><h2>Nearby Sites</h2>${matches.map(x=>`<div class="card tight siteItem nearbyPick" data-id="${x.site.id}"><strong>${esc(x.site.name)}</strong><p>${formatDistance(x.ft)} away</p></div>`).join("")}</div>`;
    document.querySelectorAll(".nearbyPick").forEach(el => el.onclick = () => {
      selectedSiteId = el.dataset.id;
      view = "siteDetail";
      render();
    });
  });
}


function todayIso(){
  return new Date().toISOString().slice(0,10);
}

function minutesBetween(a,b){
  if(!a || !b) return null;
  const m = Math.round((new Date(b).getTime() - new Date(a).getTime()) / 60000);
  return isFinite(m) && m >= 0 ? m : null;
}

function dropBreadcrumb(){
  getCurrentGps((lat,lng)=>{
    const note = prompt("Breadcrumb note:", "Manual breadcrumb") || "Manual breadcrumb";
    data.breadcrumbs = Array.isArray(data.breadcrumbs) ? data.breadcrumbs : [];
    data.breadcrumbs.unshift({
      id: uid(),
      date: todayIso(),
      time: new Date().toISOString(),
      lat: lat.toFixed(6),
      lng: lng.toFixed(6),
      note
    });
    save();
    alert("Breadcrumb saved.");
    view = "dailySummary";
    render();
  });
}

function visitsForDate(date){
  const rows = [];
  data.sites.forEach(s => {
    ensureSite(s);
    s.visits.forEach(v => {
      if((v.date || "") === date) rows.push({site:s, visit:v, type:"visit"});
    });
  });
  rows.sort((a,b)=>(a.visit.startedAt || a.visit.date || "").localeCompare(b.visit.startedAt || b.visit.date || ""));
  return rows;
}

function breadcrumbsForDate(date){
  data.breadcrumbs = Array.isArray(data.breadcrumbs) ? data.breadcrumbs : [];
  return data.breadcrumbs.filter(b => b.date === date).sort((a,b)=>(a.time||"").localeCompare(b.time||""));
}

function dailyRoutePoints(date){
  const visitPoints = visitsForDate(date)
    .filter(r => r.site.lat && r.site.lng)
    .map(r => ({label:r.site.name, lat:r.site.lat, lng:r.site.lng, time:r.visit.startedAt || r.visit.date, kind:"site"}));
  const crumbs = breadcrumbsForDate(date)
    .map(b => ({label:b.note || "Breadcrumb", lat:b.lat, lng:b.lng, time:b.time, kind:"crumb"}));
  return [...visitPoints, ...crumbs].sort((a,b)=>(a.time||"").localeCompare(b.time||""));
}

function appleRouteUrl(points){
  if(!points.length) return "";
  if(points.length === 1) return "https://maps.apple.com/?q=" + encodeURIComponent(points[0].lat + "," + points[0].lng);
  const first = points[0];
  const last = points[points.length-1];
  return "https://maps.apple.com/?saddr=" + encodeURIComponent(first.lat + "," + first.lng) + "&daddr=" + encodeURIComponent(last.lat + "," + last.lng);
}

function googleRouteUrl(points){
  if(!points.length) return "";
  if(points.length === 1) return "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(points[0].lat + "," + points[0].lng);
  const first = points[0];
  const last = points[points.length-1];
  const mids = points.slice(1,-1).slice(0,8).map(p => p.lat + "," + p.lng).join("|");
  return "https://www.google.com/maps/dir/?api=1&origin=" + encodeURIComponent(first.lat + "," + first.lng) + "&destination=" + encodeURIComponent(last.lat + "," + last.lng) + (mids ? "&waypoints=" + encodeURIComponent(mids) : "");
}

function dailySummaryText(date){
  const visits = visitsForDate(date);
  const crumbs = breadcrumbsForDate(date);
  const points = dailyRoutePoints(date);
  const lines = [];
  lines.push("FIREVAULT DAILY SUMMARY");
  lines.push("Date: " + date);
  lines.push("");
  lines.push("VISITED SITES (" + visits.length + ")");
  if(visits.length){
    visits.forEach((r,i)=>{
      const v = r.visit;
      const mins = minutesBetween(v.startedAt, v.endedAt);
      lines.push(`${i+1}. ${r.site.name} - ${v.startedAt ? fmtTime(v.startedAt) : ""}${mins!==null ? " - " + Math.floor(mins/60)+"h "+(mins%60)+"m" : ""}`);
      lines.push("   " + fullAddress(r.site));
    });
  }else lines.push("None recorded.");
  lines.push("");
  lines.push("BREADCRUMBS (" + crumbs.length + ")");
  if(crumbs.length) crumbs.forEach((b,i)=>lines.push(`${i+1}. ${fmtTime(b.time)} - ${b.note} - ${b.lat}, ${b.lng}`));
  else lines.push("None recorded.");
  lines.push("");
  lines.push("ROUTE POINTS (" + points.length + ")");
  if(points.length) points.forEach((p,i)=>lines.push(`${i+1}. ${fmtTime(p.time)} - ${p.label} - ${p.lat}, ${p.lng}`));
  else lines.push("No GPS route points.");
  return lines.join("\\n");
}

function dailySummary(){
  const date = mode || todayIso();
  const visits = visitsForDate(date);
  const crumbs = breadcrumbsForDate(date);
  const points = dailyRoutePoints(date);
  let totalMins = 0;
  visits.forEach(r => {
    const m = minutesBetween(r.visit.startedAt, r.visit.endedAt);
    if(m !== null) totalMins += m;
  });
  html(`<div class="screen">
    <div class="row"><button class="back ghost" id="dailyBack">←</button><h1>Daily Summary</h1></div>
    <div class="card">
      <label>Date</label>
      <input id="summaryDate" type="date" value="${esc(date)}">
      <div class="grid3">
        <div class="summaryStat"><strong>${visits.length}</strong><span>Sites</span></div>
        <div class="summaryStat"><strong>${crumbs.length}</strong><span>Crumbs</span></div>
        <div class="summaryStat"><strong>${Math.floor(totalMins/60)}h ${totalMins%60}m</strong><span>Site Time</span></div>
      </div>
      <div class="grid2">
        <button class="primary" id="dropCrumbDaily">Drop Crumb</button>
        <button class="ghost" id="copyDaily">Copy Summary</button>
      </div>
      <div class="grid2">
        <button class="ghost" id="appleRoute">Apple Route</button>
        <button class="ghost" id="googleRoute">Google Route</button>
      </div>
    </div>

    <div class="card routeCard">
      <h2>Route Points</h2>
      <div class="routePath">${points.length ? points.map((p,i)=>`<div class="routeLine"><span class="routeDot"></span><div><strong>${esc(fmtTime(p.time))}</strong> ${esc(p.label)}<p>${esc(p.lat+", "+p.lng)}</p></div></div>`).join("") : `<div class="empty">No GPS points for this date. Start/finish jobs or drop manual breadcrumbs.</div>`}</div>
    </div>

    <div class="card grow" style="overflow:auto">
      <h2>Visited Sites</h2>
      ${visits.length ? visits.map(r=>`<div class="card tight compactVisit siteItem dailyVisit" data-site="${r.site.id}" data-visit="${r.visit.id}"><div><strong>${esc(r.site.name)}</strong><p>${esc(r.visit.startedAt ? fmtTime(r.visit.startedAt) : r.visit.date)}</p></div><span class="pill">View</span></div>`).join("") : `<div class="empty">No visits recorded for this date.</div>`}
    </div>
  </div>`);
  document.getElementById("dailyBack").onclick = () => { mode=null; route("home"); };
  document.getElementById("summaryDate").onchange = () => { mode = val("summaryDate"); view="dailySummary"; render(); };
  document.getElementById("dropCrumbDaily").onclick = dropBreadcrumb;
  document.getElementById("copyDaily").onclick = () => {
    navigator.clipboard?.writeText(dailySummaryText(date)).then(()=>alert("Daily summary copied.")).catch(()=>{
      alert(dailySummaryText(date));
    });
  };
  document.getElementById("appleRoute").onclick = () => {
    const url = appleRouteUrl(points);
    if(url) window.open(url,"_blank"); else alert("No route points available.");
  };
  document.getElementById("googleRoute").onclick = () => {
    const url = googleRouteUrl(points);
    if(url) window.open(url,"_blank"); else alert("No route points available.");
  };
  document.querySelectorAll(".dailyVisit").forEach(el => el.onclick = () => {
    selectedSiteId = el.dataset.site;
    mode = el.dataset.visit;
    view = "visitDetail";
    render();
  });
}


function sites(){
  html(`<div class="screen">
    <div class="row"><div><h1>Sites</h1><p>Customer vaults.</p></div><div class="row"><button class="ghost" id="importSites">Import</button><button class="primary" id="addSite">＋ Add</button></div></div>
    <input id="siteSearch" placeholder="Search sites, city, panel, notes...">
    <div id="siteList" class="list grow"></div>
  </div>`);
  document.getElementById("addSite").onclick = () => { selectedSiteId=null; view="siteForm"; render(); };
  document.getElementById("importSites").onclick = () => { view="importer"; render(); };
  document.getElementById("siteSearch").oninput = drawSiteList;
  drawSiteList();
}

function drawSiteList(){
  const q = (document.getElementById("siteSearch")?.value || "").toLowerCase();
  const list = data.sites.filter(s => JSON.stringify(s).toLowerCase().includes(q));
  document.getElementById("siteList").innerHTML = list.length ? list.map(s => {
    ensureSite(s);
    return `<div class="card siteItem" data-id="${s.id}">
      <div class="row"><h2>${esc(s.name || "Unnamed Site")}</h2><span class="pill">${esc(s.panelManufacturer || "Panel TBD")}</span></div>
      <p>${esc(fullAddress(s))}</p>
      <span class="pill">Docs ${s.docs.length}</span><span class="pill">Visits ${s.visits.length}</span><span class="pill">Tasks ${s.tasks.length}</span>
    </div>`;
  }).join("") : `<div class="empty">No sites yet.</div>`;
  document.querySelectorAll(".siteItem").forEach(el => el.onclick = () => { selectedSiteId=el.dataset.id; view="siteDetail"; render(); });
}

function siteDetail(){
  const s = getSite(); if(!s) return route("sites");
  ensureSite(s);
  html(`<div class="screen">
    <div class="row"><button class="back ghost" id="backSites">←</button><button class="ghost" id="editSite">Edit</button></div>
    <div class="card redline"><h1>${esc(s.name)}</h1><p>${esc(fullAddress(s))}</p><span class="pill">${esc(s.panelManufacturer||"Panel TBD")}</span><span class="pill">${esc(s.panelModel||"Model TBD")}</span></div>
    <button class="${activeJob && activeJob.siteId===s.id ? "ghost" : "primary"} tile" id="startJobBtn"><strong>${activeJob && activeJob.siteId===s.id ? "OPEN ACTIVE CALL" : "▶ START SERVICE CALL"}</strong><span>${activeJob && activeJob.siteId===s.id ? "Timer running" : "Create live timeline"}</span></button>
    <div class="grid2">
      <button class="tile" id="docsBtn"><strong>Docs / Photos</strong><span>${s.docs.length} records</span></button>
      <button class="tile" id="gpsBtn"><strong>GPS</strong><span>${s.lat&&s.lng?"Saved":"Not set"}</span></button>
      <button class="tile" id="visitsBtn"><strong>Visits</strong><span>${s.visits.length} records</span></button>
      <button class="tile" id="tasksBtn"><strong>Tasks</strong><span>${s.tasks.filter(t => (t.status||"Open") !== "Done").length} open</span></button>
    </div>
    <div class="grid2">
      <button class="tile" id="defBtn"><strong>Deficiencies</strong><span>${s.deficiencies.length} items</span></button>
      <button class="tile" id="aiBtn"><strong>AI Tech <span class="featureStar">*</span></strong><span>Site context</span></button>
    </div>
    <div class="grid2">
      <button class="tile" id="reportBtn"><strong>Report</strong><span>Copy / download</span></button>
      <button class="tile" id="quickContextBtn"><strong>Context</strong><span>Site snapshot</span></button>
    </div>
    <div class="card ${s.lat&&s.lng?"gpsGood":"gpsWarn"}">
      <h2>Location</h2>
      <p>${esc(fullAddress(s))}</p>
      <p><strong>GPS:</strong> ${s.lat&&s.lng?esc(s.lat+", "+s.lng):"Not saved"}</p>
      <div class="mapActions"><button class="ghost" id="appleMapBtn">Apple Maps</button><button class="ghost" id="googleMapBtn">Google Maps</button></div>
    </div>
    <div class="card grow"><h2>Site Notes</h2><p>${esc(s.notes || "No site notes yet.")}</p></div>
  </div>`);
  document.getElementById("backSites").onclick = () => route("sites");
  document.getElementById("editSite").onclick = () => { view="siteForm"; render(); };
  document.getElementById("startJobBtn").onclick = () => startServiceCall(s);
  document.getElementById("docsBtn").onclick = () => { view="docs"; render(); };
  document.getElementById("visitsBtn").onclick = () => { view="visits"; render(); };
  document.getElementById("tasksBtn").onclick = () => { view="tasks"; render(); };
  document.getElementById("defBtn").onclick = () => { view="deficiencies"; render(); };
  document.getElementById("aiBtn").onclick = () => { view="aiTechnician"; render(); };
  document.getElementById("reportBtn").onclick = () => { view="report"; render(); };
  document.getElementById("quickContextBtn").onclick = () => { view="aiTechnician"; render(); };
  document.getElementById("gpsBtn").onclick = () => { view="siteForm"; render(); };
  document.getElementById("appleMapBtn").onclick = () => openAppleMaps(s);
  document.getElementById("googleMapBtn").onclick = () => openGoogleMaps(s);
}

function siteForm(){
  const s = selectedSiteId ? getSite() : {};
  html(`<div class="screen">
    <div class="row"><button class="back ghost" id="cancelSite">←</button><h1>${selectedSiteId?"Edit Site":"Add Site"}</h1></div>
    <div class="form grow">
      <label>Site Name</label><input id="name" value="${esc(s.name)}">
      <label>Street</label><input id="street" value="${esc(s.street || s.address)}">
      <div class="grid2"><div><label>City</label><input id="city" value="${esc(s.city)}"></div><div><label>State</label><input id="state" value="${esc(s.state)}"></div></div>
      <label>ZIP</label><input id="zip" value="${esc(s.zip)}">
      <div class="grid2"><div><label>Manufacturer</label><input id="panelManufacturer" value="${esc(s.panelManufacturer)}"></div><div><label>Model</label><input id="panelModel" value="${esc(s.panelModel)}"></div></div>
      <div class="grid2"><div><label>Latitude</label><input id="lat" value="${esc(s.lat)}" placeholder="GPS latitude"></div><div><label>Longitude</label><input id="lng" value="${esc(s.lng)}" placeholder="GPS longitude"></div></div>
      <button class="ghost" id="useGps">📍 Use Current GPS For Site</button>
      <label>Notes</label><textarea id="notes">${esc(s.notes)}</textarea>
    </div>
    <button class="primary" id="saveSite">Save Site</button>
  </div>`);
  document.getElementById("cancelSite").onclick = () => selectedSiteId ? route("siteDetail") : route("sites");
  document.getElementById("useGps").onclick = () => {
    getCurrentGps((lat,lng)=>{
      document.getElementById("lat").value = lat.toFixed(6);
      document.getElementById("lng").value = lng.toFixed(6);
    });
  };
  document.getElementById("saveSite").onclick = () => {
    const obj = {
      name: val("name") || "Unnamed Site", street: val("street"), city: val("city"), state: val("state"), zip: val("zip"),
      address: val("street"), panelManufacturer: val("panelManufacturer"), panelModel: val("panelModel"), lat: val("lat"), lng: val("lng"), notes: val("notes")
    };
    if(selectedSiteId){
      Object.assign(getSite(), obj);
    }else{
      const s = ensureSite({...obj, id:uid(), createdAt:new Date().toISOString()});
      data.sites.unshift(s); selectedSiteId=s.id;
    }
    save(); route("siteDetail");
  };
}

function docs(){
  const s = getSite(); if(!s) return route("sites"); ensureSite(s);
  html(`<div class="screen">
    <div class="row"><button class="back ghost" id="backSite">←</button><h1>Docs / Photos</h1><button class="primary" id="addDoc">＋ Add</button></div>
    <div class="list grow">${s.docs.length ? s.docs.map(d => `<div class="card docLine">
      <div class="row"><h2>${esc(d.title||"Untitled")}</h2><button class="ghost editDoc" data-id="${d.id}">Edit</button></div>
      <span class="pill">${esc(d.type||"File")}</span><span class="pill">${esc(d.location||"No location")}</span>
      <p>${esc(d.notes||"")}</p>
      ${d.imageData ? `<img class="thumb viewDoc" data-id="${d.id}" src="${esc(d.imageData)}"><button class="primary viewDoc" data-id="${d.id}">View Image</button>` : ""}
      ${d.url ? `<a class="btn ghost" href="${esc(d.url)}" target="_blank">Open Link</a>` : ""}
    </div>`).join("") : `<div class="empty">No docs/photos yet.</div>`}</div>
  </div>`);
  document.getElementById("backSite").onclick = () => route("siteDetail");
  document.getElementById("addDoc").onclick = () => { mode=null; view="docForm"; render(); };
  document.querySelectorAll(".editDoc").forEach(b => b.onclick = () => { mode=b.dataset.id; view="docForm"; render(); });
  document.querySelectorAll(".viewDoc").forEach(b => b.onclick = () => { mode=b.dataset.id; view="imageViewer"; render(); });
}

function docForm(){
  const s = getSite(); if(!s) return route("sites"); ensureSite(s);
  const d = mode ? s.docs.find(x => x.id === mode) || {} : {};
  currentDocImageData = d.imageData || "";
  html(`<div class="screen">
    <div class="row"><button class="back ghost" id="backDocs">←</button><h1>${mode?"Edit File":"Add File"}</h1></div>
    <div class="form grow">
      <label>File Type</label><select id="dtype">${["Panel Photo","Trouble Screenshot","Riser Diagram","Map / Floor Plan","Battery Label","Inspection Report","Manual Link","Cloud File Link","Other"].map(t=>`<option ${d.type===t?"selected":""}>${t}</option>`).join("")}</select>
      <label>Title</label><input id="dtitle" value="${esc(d.title)}">
      <label>Location</label><input id="dlocation" value="${esc(d.location)}">
      <label>URL / Link</label><input id="durl" value="${esc(d.url)}">
      <div class="photoBox"><label>Photo Upload</label><input id="dfile" type="file" accept="image/*"><p>New photos are stamped with FireVault overlay.</p><img id="photoPreview" class="thumb" style="${d.imageData?'':'display:none'}" src="${esc(d.imageData||'')}"></div>
      <label>Notes</label><textarea id="dnotes">${esc(d.notes)}</textarea>
    </div>
    <div class="grid2"><button class="primary" id="saveDoc">Save File</button>${mode?`<button class="danger" id="deleteDoc">Delete</button>`:`<button class="ghost" id="cancelDoc">Cancel</button>`}</div>
  </div>`);
  document.getElementById("backDocs").onclick = () => route("docs");
  document.getElementById("cancelDoc")?.addEventListener("click", () => route("docs"));
  document.getElementById("dfile").onchange = e => {
    const file = e.target.files[0]; if(!file) return;
    const reader = new FileReader();
    reader.onload = () => stampFireVaultPhoto(reader.result, s, data.settings, stamped => {
      currentDocImageData = stamped;
      const img = document.getElementById("photoPreview");
      img.src = stamped; img.style.display = "block";
    });
    reader.readAsDataURL(file);
  };
  document.getElementById("saveDoc").onclick = () => {
    const obj = {type:val("dtype"), title:val("dtitle") || val("dtype"), location:val("dlocation"), url:val("durl"), imageData:currentDocImageData, notes:val("dnotes"), updatedAt:new Date().toISOString()};
    if(mode){
      const i = s.docs.findIndex(x => x.id === mode); if(i >= 0) s.docs[i] = {...s.docs[i], ...obj};
    }else{
      s.docs.unshift({...obj, id:uid(), createdAt:new Date().toISOString()});
    }
    save(); mode=null; currentDocImageData=""; route("docs");
  };
  document.getElementById("deleteDoc")?.addEventListener("click", () => {
    if(confirm("Delete this file/photo?")){
      s.docs = s.docs.filter(x => x.id !== mode); save(); mode=null; route("docs");
    }
  });
}

function imageViewer(){
  const s = getSite(); const d = s?.docs?.find(x => x.id === mode);
  if(!d?.imageData) return route("docs");
  html(`<div class="screen">
    <div class="row"><button class="back ghost" id="backDocs">←</button><h1>${esc(d.title||"Image")}</h1></div>
    <div class="card grow" style="overflow:auto;padding:8px"><img src="${esc(d.imageData)}" style="width:100%;height:auto;border-radius:16px"><p>${esc(d.notes||"")}</p></div>
  </div>`);
  document.getElementById("backDocs").onclick = () => route("docs");
}


function startServiceCall(s){
  if(activeJob && activeJob.siteId !== s.id && !confirm("Another service call is active. Replace it?")) return;
  if(activeJob && activeJob.siteId === s.id){
    view = "jobMode";
    render();
    return;
  }
  const begin = (lat,lng) => {
    activeJob = {
      id: uid(),
      siteId: s.id,
      siteName: s.name || "Unnamed Site",
      startedAt: new Date().toISOString(),
      lat: lat || "",
      lng: lng || "",
      events: [{id:uid(), time:new Date().toISOString(), type:"Arrived", text: lat ? `Service call started at GPS ${lat.toFixed(5)}, ${lng.toFixed(5)}` : "Service call started"}]
    };
    saveActiveJob();
    view = "jobMode";
    render();
  };
  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(
      pos => begin(pos.coords.latitude, pos.coords.longitude),
      () => begin(null,null),
      {enableHighAccuracy:true,timeout:8000,maximumAge:30000}
    );
  }else{
    begin(null,null);
  }
}

function jobMode(){
  if(!activeJob){ route("sites"); return; }
  const s = data.sites.find(x => x.id === activeJob.siteId);
  if(!s){ activeJob=null; saveActiveJob(); route("sites"); return; }
  selectedSiteId = s.id;
  html(`<div class="screen">
    <div class="row"><button class="back ghost" id="backSite">←</button><h1>Job Mode</h1></div>
    <div class="card jobBanner">
      <h1>${esc(s.name)}</h1>
      <p>SERVICE CALL ACTIVE</p>
      <div class="grid3">
        <div><span class="pill">Started</span><p><strong>${fmtTime(activeJob.startedAt)}</strong></p></div>
        <div><span class="pill">Elapsed</span><div class="timer" id="jobElapsed">${elapsedText(activeJob.startedAt)}</div></div>
        <div><span class="pill">GPS</span><p><strong>${activeJob.lat ? "Saved" : "Manual"}</strong></p></div>
      </div>
    </div>

    <div class="quickGrid">
      <button class="quickBtn" data-event="⚠ Ground Fault">⚠<br>Ground</button>
      <button class="quickBtn" data-event="🚨 NAC Trouble">🚨<br>NAC</button>
      <button class="quickBtn" data-event="🔋 Battery">🔋<br>Battery</button>
      <button class="quickBtn" data-event="💨 Smoke Detector">💨<br>Smoke</button>
      <button class="quickBtn" data-event="🚪 Pull Station">🚪<br>Pull</button>
      <button class="quickBtn" data-event="📡 Communicator">📡<br>Comm</button>
      <button class="quickBtn" id="customNoteBtn">📝<br>Note</button>
      <button class="quickBtn" id="jobPhotoBtn">📷<br>Photo</button>
      <button class="quickBtn" data-event="✅ Test Passed">✅<br>Passed</button>
    </div>
    <input id="jobPhotoInput" type="file" accept="image/*" capture="environment" style="display:none">

    <div class="card grow">
      <div class="row"><h2>Live Timeline</h2><button class="danger" id="finishJobBtn">Finish</button></div>
      <div class="list">${activeJob.events.map(e => `<div class="card tight visit"><span class="eventTime">${fmtTime(e.time)}</span><strong>${esc(e.type)}</strong><p>${esc(e.text)}</p></div>`).join("")}</div>
    </div>
  </div>`);

  document.getElementById("backSite").onclick = () => route("siteDetail");
  document.querySelectorAll("[data-event]").forEach(btn => btn.onclick = () => addJobEvent(btn.dataset.event, btn.dataset.event));
  document.getElementById("customNoteBtn").onclick = () => {
    const t = prompt("Enter service note:");
    if(t) addJobEvent("Note", t);
  };
  document.getElementById("jobPhotoBtn").onclick = () => document.getElementById("jobPhotoInput").click();
  document.getElementById("jobPhotoInput").onchange = handleJobPhoto;
  document.getElementById("finishJobBtn").onclick = finishServiceCall;
}

function addJobEvent(type,text,tags=[]){
  if(!activeJob) return;
  activeJob.events.unshift({id:uid(), time:new Date().toISOString(), type, text, tags});
  saveActiveJob();
  view = "jobMode";
  render();
}

function handleJobPhoto(e){
  const file = e.target.files[0];
  if(!file || !activeJob) return;
  const s = data.sites.find(x => x.id === activeJob.siteId);
  if(!s) return;
  const reader = new FileReader();
  reader.onload = () => {
    stampFireVaultPhoto(reader.result, s, data.settings, stamped => {
      const title = prompt("Photo title:", "Service call photo") || "Service call photo";
      const doc = {id:uid(), type:"Panel Photo", title, location:"Service Call", url:"", imageData:stamped, notes:"Captured during service call on " + new Date().toLocaleString(), createdAt:new Date().toISOString()};
      ensureSite(s).docs.unshift(doc);
      save();
      activeJob.events.unshift({id:uid(), time:new Date().toISOString(), type:"📷 Photo Added", text:title, docId:doc.id, tags:["Photo"]});
      saveActiveJob();
      view = "jobMode";
      render();
    });
  };
  reader.readAsDataURL(file);
}

function finishServiceCall(){
  if(!activeJob) return;
  const s = data.sites.find(x => x.id === activeJob.siteId);
  if(!s) return;
  ensureSite(s);
  const endedAt = new Date().toISOString();
  activeJob.events.unshift({id:uid(), time:endedAt, type:"Departed", text:"Service call finished"});
  const timeline = activeJob.events.slice().reverse().map(e => `${fmtTime(e.time)} - ${e.text}`).join("\\n");
  const mins = Math.max(0, Math.round((new Date(endedAt)-new Date(activeJob.startedAt))/60000));
  s.visits.unshift({
    id: activeJob.id,
    date: new Date(activeJob.startedAt).toISOString().slice(0,10),
    startedAt: activeJob.startedAt,
    endedAt,
    summary: `Service call: ${Math.floor(mins/60)}h ${mins%60}m on site\\n${timeline}`,
    tags:["Service Call"],
    events: activeJob.events
  });
  save();
  activeJob = null;
  saveActiveJob();
  alert("Service call saved to visit history.");
  view = "visits";
  render();
}

function visits(){
  const s = getSite();
  const rows = s ? ensureSite(s).visits.map(v => ({site:s, visit:v})) : data.sites.flatMap(site => ensureSite(site).visits.map(v => ({site, visit:v})));
  rows.sort((a,b)=>(b.visit.startedAt || b.visit.date || "").localeCompare(a.visit.startedAt || a.visit.date || ""));
  html(`<div class="screen">
    <div class="row"><button class="back ghost" id="visitsBack">←</button><h1>Visits</h1></div>
    <div class="list grow">${rows.length ? rows.map(r => {
      const v = r.visit;
      const time = v.startedAt ? fmtTime(v.startedAt) : (v.date || "");
      return `<div class="card compactVisit siteItem visitPick" data-site="${r.site.id}" data-visit="${v.id}">
        <div><strong>${esc(r.site.name)}</strong><p>${esc(time)}</p></div>
        <span class="pill">View</span>
      </div>`;
    }).join("") : `<div class="empty">No visits yet.</div>`}</div>
  </div>`);
  document.getElementById("visitsBack").onclick = () => s ? route("siteDetail") : route("home");
  document.querySelectorAll(".visitPick").forEach(el => el.onclick = () => {
    selectedSiteId = el.dataset.site;
    mode = el.dataset.visit;
    view = "visitDetail";
    render();
  });
}

function visitDetail(){
  const s = getSite();
  const v = s?.visits?.find(x => x.id === mode);
  if(!s || !v) return route("visits");
  html(`<div class="screen">
    <div class="row"><button class="back ghost" id="backVisits">←</button><h1>Visit Detail</h1></div>
    <div class="card visit">
      <h2>${esc(s.name)}</h2>
      <p><strong>Date:</strong> ${esc(v.date || "")}</p>
      <p><strong>Started:</strong> ${esc(v.startedAt ? fmtTime(v.startedAt) : "")}</p>
      <p><strong>Ended:</strong> ${esc(v.endedAt ? fmtTime(v.endedAt) : "")}</p>
    </div>
    <div class="card grow" style="overflow:auto"><h2>Summary</h2><p style="white-space:pre-line">${esc(v.summary || "")}</p></div>
  </div>`);
  document.getElementById("backVisits").onclick = () => route("visits");
}



function allTaskRows(){
  const rows = [];
  data.sites.forEach(s => {
    ensureSite(s);
    s.tasks.forEach(t => rows.push({site:s, task:t}));
  });
  return rows;
}

function tasks(){
  const currentSite = getSite();
  const rows = currentSite
    ? ensureSite(currentSite).tasks.map(t => ({site:currentSite, task:t}))
    : allTaskRows();

  rows.sort((a,b)=>{
    const ad = a.task.due || "9999-99-99";
    const bd = b.task.due || "9999-99-99";
    return ad.localeCompare(bd);
  });

  html(`<div class="screen">
    <div class="row">
      <button class="back ghost" id="tasksBack">←</button>
      <h1>${currentSite ? "Site Tasks" : "Open Tasks"}</h1>
      ${currentSite ? `<button class="primary" id="addTask">＋ Add</button>` : ""}
    </div>
    <div class="list grow">${rows.length ? rows.map(r => {
      const t = r.task;
      const done = (t.status||"Open") === "Done";
      return `<div class="card ${done ? "taskDone statusDone" : "taskOpen"} siteItem taskPick" data-site="${r.site.id}" data-task="${t.id}">
        <div class="row"><h2><span class="statusDot"></span>${esc(t.title || "Untitled Task")}</h2><span class="pill">${esc(t.status || "Open")}</span></div>
        <p>${currentSite ? "" : esc(r.site.name)}</p>
        <span class="pill ${t.priority==="Critical"?"priorityCritical":t.priority==="High"?"priorityHigh":""}">${esc(t.priority || "Normal")}</span>
        <span class="pill">${esc(t.due || "No due date")}</span>
        <p>${esc(t.notes || "")}</p>
      </div>`;
    }).join("") : `<div class="empty">No tasks recorded.</div>`}</div>
  </div>`);
  document.getElementById("tasksBack").onclick = () => currentSite ? route("siteDetail") : route("home");
  document.getElementById("addTask")?.addEventListener("click", () => { mode=null; view="taskForm"; render(); });
  document.querySelectorAll(".taskPick").forEach(el => el.onclick = () => {
    selectedSiteId = el.dataset.site;
    mode = el.dataset.task;
    view = "taskForm";
    render();
  });
}

function taskForm(){
  let s = getSite();
  if(!s && selectedSiteId) s = getSite();
  if(!s) return route("sites");
  ensureSite(s);
  const t = mode ? s.tasks.find(x => x.id === mode) || {} : {};
  html(`<div class="screen">
    <div class="row"><button class="back ghost" id="taskBack">←</button><h1>${mode ? "Edit Task" : "Add Task"}</h1></div>
    <div class="form grow">
      <label>Task</label><input id="taskTitle" value="${esc(t.title)}" placeholder="Replace batteries, quote NAC repair...">
      <div class="grid2">
        <div><label>Status</label><select id="taskStatus">${["Open","Waiting","Scheduled","Done"].map(x=>`<option ${t.status===x?"selected":""}>${x}</option>`).join("")}</select></div>
        <div><label>Priority</label><select id="taskPriority">${["Critical","High","Normal","Low"].map(x=>`<option ${t.priority===x?"selected":""}>${x}</option>`).join("")}</select></div>
      </div>
      <label>Due Date</label><input id="taskDue" type="date" value="${esc(t.due)}">
      <label>Notes</label><textarea id="taskNotes">${esc(t.notes)}</textarea>
    </div>
    <div class="grid2"><button class="primary" id="saveTask">Save Task</button>${mode ? `<button class="danger" id="deleteTask">Delete</button>` : `<button class="ghost" id="cancelTask">Cancel</button>`}</div>
  </div>`);
  document.getElementById("taskBack").onclick = () => route("tasks");
  document.getElementById("cancelTask")?.addEventListener("click", () => route("tasks"));
  document.getElementById("saveTask").onclick = () => {
    const obj = {title:val("taskTitle"),status:val("taskStatus"),priority:val("taskPriority"),due:val("taskDue"),notes:val("taskNotes"),updatedAt:new Date().toISOString()};
    if(!obj.title){ alert("Enter a task title."); return; }
    if(mode){
      const i = s.tasks.findIndex(x => x.id === mode);
      if(i >= 0) s.tasks[i] = {...s.tasks[i], ...obj};
    }else{
      s.tasks.unshift({...obj, id:uid(), createdAt:new Date().toISOString()});
    }
    save(); mode=null; route("tasks");
  };
  document.getElementById("deleteTask")?.addEventListener("click", () => {
    if(confirm("Delete this task?")){
      s.tasks = s.tasks.filter(x => x.id !== mode);
      save(); mode=null; route("tasks");
    }
  });
}

function deficiencies(){
  const s = getSite();
  if(!s) return route("sites");
  ensureSite(s);
  html(`<div class="screen">
    <div class="row"><button class="back ghost" id="defBack">←</button><h1>Deficiencies</h1><button class="primary" id="addDef">＋ Add</button></div>
    <div class="list grow">${s.deficiencies.length ? s.deficiencies.map(d => `<div class="card deficiencyCard siteItem defPick" data-id="${d.id}">
      <div class="row"><h2>${esc(d.status || "Open")}</h2><span class="pill ${d.severity==="Critical"?"priorityCritical":d.severity==="High"?"priorityHigh":""}">${esc(d.severity || "Needs Review")}</span></div>
      <p><strong>${esc(d.description || "No description")}</strong></p>
      <span class="pill">${esc(d.system || "System TBD")}</span>
      <span class="pill">${esc(d.location || "Location TBD")}</span>
      <p>${esc(d.recommendation || "")}</p>
    </div>`).join("") : `<div class="empty">No deficiencies recorded.</div>`}</div>
  </div>`);
  document.getElementById("defBack").onclick = () => route("siteDetail");
  document.getElementById("addDef").onclick = () => { mode=null; view="deficiencyForm"; render(); };
  document.querySelectorAll(".defPick").forEach(el => el.onclick = () => {
    mode = el.dataset.id;
    view = "deficiencyForm";
    render();
  });
}

function deficiencyForm(){
  const s = getSite();
  if(!s) return route("sites");
  ensureSite(s);
  const d = mode ? s.deficiencies.find(x => x.id === mode) || {} : {};
  html(`<div class="screen">
    <div class="row"><button class="back ghost" id="defFormBack">←</button><h1>${mode ? "Edit Deficiency" : "Add Deficiency"}</h1></div>
    <div class="form grow">
      <div class="grid2">
        <div><label>Status</label><select id="defStatus">${["Open","Quoted","Scheduled","Corrected","Needs Review"].map(x=>`<option ${d.status===x?"selected":""}>${x}</option>`).join("")}</select></div>
        <div><label>Severity</label><select id="defSeverity">${["Critical","High","Medium","Low","Needs Review"].map(x=>`<option ${d.severity===x?"selected":""}>${x}</option>`).join("")}</select></div>
      </div>
      <label>System</label><select id="defSystem">${["Fire Alarm","Sprinkler Monitor","NAC","SLC","Communicator","Power Supply","Battery","Elevator Recall","Smoke Control","Other"].map(x=>`<option ${d.system===x?"selected":""}>${x}</option>`).join("")}</select>
      <label>Location</label><input id="defLocation" value="${esc(d.location)}" placeholder="Loading dock, lobby, room 118...">
      <label>Description</label><textarea id="defDescription">${esc(d.description)}</textarea>
      <label>Recommendation</label><textarea id="defRecommendation">${esc(d.recommendation)}</textarea>
      ${!mode ? `<label><input type="checkbox" id="makeTask" checked> Create follow-up task</label>` : ""}
    </div>
    <div class="grid2"><button class="primary" id="saveDef">Save Deficiency</button>${mode ? `<button class="danger" id="deleteDef">Delete</button>` : `<button class="ghost" id="cancelDef">Cancel</button>`}</div>
  </div>`);
  document.getElementById("defFormBack").onclick = () => route("deficiencies");
  document.getElementById("cancelDef")?.addEventListener("click", () => route("deficiencies"));
  document.getElementById("saveDef").onclick = () => {
    const obj = {status:val("defStatus"),severity:val("defSeverity"),system:val("defSystem"),location:val("defLocation"),description:val("defDescription"),recommendation:val("defRecommendation"),updatedAt:new Date().toISOString()};
    if(!obj.description){ alert("Enter a deficiency description."); return; }
    if(mode){
      const i = s.deficiencies.findIndex(x => x.id === mode);
      if(i >= 0) s.deficiencies[i] = {...s.deficiencies[i], ...obj};
    }else{
      s.deficiencies.unshift({...obj, id:uid(), date:new Date().toISOString().slice(0,10), createdAt:new Date().toISOString()});
      if(checked("makeTask")){
        s.tasks.unshift({
          id:uid(),
          title:"Correct deficiency: " + obj.description.slice(0,60),
          status:"Open",
          priority:obj.severity==="Critical" ? "Critical" : obj.severity==="High" ? "High" : "Normal",
          due:"",
          notes:obj.recommendation || "",
          createdAt:new Date().toISOString()
        });
      }
    }
    save(); mode=null; route("deficiencies");
  };
  document.getElementById("deleteDef")?.addEventListener("click", () => {
    if(confirm("Delete this deficiency?")){
      s.deficiencies = s.deficiencies.filter(x => x.id !== mode);
      save(); mode=null; route("deficiencies");
    }
  });
}





function buildSiteContext(s){
  ensureSite(s);
  const openTasks = s.tasks.filter(t => (t.status||"Open") !== "Done");
  const openDefs = s.deficiencies.filter(d => (d.status||"Open") !== "Corrected");
  const lastVisit = s.visits[0];

  const lines = [];
  lines.push("SITE CONTEXT");
  lines.push("Name: " + (s.name || ""));
  lines.push("Address: " + fullAddress(s));
  lines.push("Panel: " + [s.panelManufacturer, s.panelModel].filter(Boolean).join(" "));
  lines.push("GPS: " + (s.lat && s.lng ? s.lat + ", " + s.lng : "Not set"));
  lines.push("");
  lines.push("COUNTS");
  lines.push("Visits: " + s.visits.length);
  lines.push("Open Tasks: " + openTasks.length);
  lines.push("Deficiencies: " + s.deficiencies.length);
  lines.push("Docs/Photos: " + s.docs.length);
  lines.push("Resources: " + (data.resources||[]).length);
  lines.push("");
  lines.push("OPEN TASKS");
  if(openTasks.length) openTasks.slice(0,5).forEach((t,i)=>lines.push(`${i+1}. [${t.priority||"Normal"}] ${t.title||""}`));
  else lines.push("None.");
  lines.push("");
  lines.push("OPEN DEFICIENCIES");
  if(openDefs.length) openDefs.slice(0,5).forEach((d,i)=>lines.push(`${i+1}. [${d.severity||"Needs Review"}] ${d.description||""}`));
  else lines.push("None.");
  lines.push("");
  lines.push("LAST VISIT");
  if(lastVisit) lines.push((lastVisit.summary || "").split("\\n").slice(0,8).join("\\n"));
  else lines.push("No visits recorded.");
  return lines.join("\\n");
}

function localAiAnswer(question, s){
  const q = question.toLowerCase();
  ensureSite(s);
  if(!question.trim()) return "Ask a question about this site, panel, tasks, deficiencies, visits, or photos.";
  if(q.includes("ground") || q.includes("fault")){
    const matches = JSON.stringify(s).toLowerCase().includes("ground");
    return matches
      ? "This site has previous notes or records mentioning ground/fault. Review the visit history, known issues, photos, and deficiencies before troubleshooting."
      : "No stored ground fault history found for this site. Start with panel trouble details, isolate circuits, check NAC/SLC field wiring, and document findings in Job Mode.";
  }
  if(q.includes("battery")){
    return s.docs.some(d => JSON.stringify(d).toLowerCase().includes("battery"))
      ? "There are battery-related docs/photos on this site. Check Docs / Photos and verify date codes, voltage, and load-test status."
      : "No battery records found. Add battery label photos and record voltage/load-test results during the service call.";
  }
  if(q.includes("task") || q.includes("follow")){
    const open = s.tasks.filter(t => (t.status||"Open") !== "Done");
    return open.length ? `There are ${open.length} open follow-up task(s). Open the Tasks section for priority and due dates.` : "No open follow-up tasks recorded.";
  }
  if(q.includes("deficien")){
    return s.deficiencies.length ? `There are ${s.deficiencies.length} deficiency record(s). Review severity, status, and recommendations in the Deficiencies section.` : "No deficiencies recorded for this site.";
  }
  if(q.includes("panel") || q.includes("model")){
    return `Stored panel information: ${[s.panelManufacturer, s.panelModel].filter(Boolean).join(" ") || "No panel information entered yet."}`;
  }
  return "Local AI placeholder response: I can summarize stored site context now. Future AI Technician* will use external AI services when enabled in Settings → Advanced Features.";
}

function aiTechnician(){
  const s = getSite();
  if(!s) return route("sites");
  const adv = data.settings.advanced || {};
  const context = buildSiteContext(s);
  html(`<div class="screen">
    <div class="row"><button class="back ghost" id="aiBack">←</button><h1>AI Technician <span class="featureStar">*</span></h1></div>
    <div class="card aiCard">
      <h2>${esc(s.name || "Site")}</h2>
      <p>This is a local placeholder. External AI service can be enabled later in Settings → Advanced Features.</p>
      <span class="pill">${adv.aiTechnician ? "AI Enabled" : "AI Disabled"}</span>
    </div>
    <div class="card aiQuestion">
      <label>Ask about this site</label>
      <textarea id="aiQuestion" placeholder="Example: What should I check for this ground fault?"></textarea>
      <button class="primary" id="askAi">Ask Local Assistant</button>
    </div>
    <div id="aiAnswerBox"></div>
    <div class="card grow" style="overflow:auto">
      <h2>Site Context</h2>
      <div class="contextBlock">${esc(context)}</div>
    </div>
  </div>`);
  document.getElementById("aiBack").onclick = () => route("siteDetail");
  document.getElementById("askAi").onclick = () => {
    const answer = localAiAnswer(val("aiQuestion"), s);
    document.getElementById("aiAnswerBox").innerHTML = `<div class="card aiAnswer"><h2>Answer</h2><p>${esc(answer)}</p></div>`;
  };
}


function csvEscape(v){
  const s = String(v ?? "");
  return `"${s.replace(/"/g,'""')}"`;
}

function downloadBlob(filename, content, type){
  const blob = new Blob([content], {type});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
}

function exportSitesCSV(){
  const headers = ["Name","Street","City","State","ZIP","Address","Panel Manufacturer","Panel Model","Latitude","Longitude","Visits","Tasks","Deficiencies","Docs"];
  const rows = data.sites.map(s => {
    ensureSite(s);
    return [
      s.name, s.street, s.city, s.state, s.zip, fullAddress(s), s.panelManufacturer, s.panelModel, s.lat, s.lng,
      s.visits.length, s.tasks.length, s.deficiencies.length, s.docs.length
    ].map(csvEscape).join(",");
  });
  downloadBlob("firevault-sites-export.csv", [headers.map(csvEscape).join(","), ...rows].join("\n"), "text/csv");
}

function exportVisitsCSV(){
  const headers = ["Date","Site","Address","Started","Ended","Summary","Tags"];
  const rows = [];
  data.sites.forEach(s => {
    ensureSite(s);
    s.visits.forEach(v => rows.push([v.date, s.name, fullAddress(s), v.startedAt||"", v.endedAt||"", v.summary||"", (v.tags||[]).join("; ")]));
  });
  downloadBlob("firevault-visits-export.csv", [headers.map(csvEscape).join(","), ...rows.map(r=>r.map(csvEscape).join(","))].join("\n"), "text/csv");
}

function parseImportText(){
  const raw = val("importText");
  return raw.split(/\n+/).map(line => line.trim()).filter(Boolean).map(line => {
    const parts = line.split(",").map(x => x.trim());
    return {
      id: uid(),
      name: parts[0] || "Unnamed Site",
      street: parts[1] || "",
      city: parts[2] || "",
      state: parts[3] || "",
      zip: parts[4] || "",
      address: parts[1] || "",
      panelManufacturer: parts[5] || "",
      panelModel: parts[6] || "",
      notes: "Imported account",
      createdAt: new Date().toISOString(),
      visits:[], knownIssues:[], equipment:[], contacts:[], docs:[], deficiencies:[], tasks:[]
    };
  });
}

function importer(){
  html(`<div class="screen">
    <div class="row"><button class="back ghost" id="importBack">←</button><h1>Import Accounts</h1></div>
    <div class="card">
      <p>Paste one customer per line.</p>
      <p class="smallNote">Format: Name, Street, City, State, ZIP, Manufacturer, Model</p>
      <textarea id="importText" placeholder="ABC Apartments, 123 Main St, Casper, WY, 82601, Fire-Lite, ES-200X"></textarea>
      <div class="grid2"><button class="ghost" id="previewImport">Preview</button><button class="primary" id="runImport">Import Sites</button></div>
    </div>
    <div id="importPreview" class="importPreview grow"></div>
  </div>`);
  document.getElementById("importBack").onclick = () => route("sites");
  document.getElementById("previewImport").onclick = () => {
    const rows = parseImportText();
    document.getElementById("importPreview").innerHTML = rows.length ? rows.map(r => `<div class="card tight"><strong>${esc(r.name)}</strong><p>${esc([r.street,r.city,r.state,r.zip].filter(Boolean).join(", "))}</p><span class="pill">${esc(r.panelManufacturer||"Panel TBD")}</span></div>`).join("") : `<div class="empty">Paste accounts first.</div>`;
  };
  document.getElementById("runImport").onclick = () => {
    const rows = parseImportText();
    if(!rows.length){ alert("Paste account lines first."); return; }
    if(!confirm("Import " + rows.length + " sites?")) return;
    rows.reverse().forEach(r => data.sites.unshift(r));
    save();
    alert(rows.length + " sites imported.");
    route("sites");
  };
}

function importJsonFile(e){
  const file = e.target.files[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try{
      const imported = JSON.parse(reader.result);
      if(!confirm("Replace current FireVault data with imported backup? Export a backup first if unsure.")) return;
      data = imported;
      save();
      alert("JSON backup imported.");
      route("home");
    }catch(err){
      alert("Import failed: " + err.message);
    }
  };
  reader.readAsText(file);
}


function buildSiteReport(s){
  ensureSite(s);
  const cfg = data.settings.reports || {};
  const tech = data.settings.technician || {};
  const lines = [];
  lines.push(cfg.title || "FireVault Service Report");
  lines.push("");
  if(cfg.includeTechnician !== false){
    lines.push("TECHNICIAN");
    lines.push("Name: " + (tech.name || ""));
    if(tech.company) lines.push("Company: " + tech.company);
    if(tech.phone) lines.push("Phone: " + tech.phone);
    if(tech.email) lines.push("Email: " + tech.email);
    if(tech.license) lines.push("License/Cert: " + tech.license);
    lines.push("");
  }

  lines.push("SITE");
  lines.push("Name: " + (s.name || ""));
  lines.push("Address: " + fullAddress(s));
  lines.push("Panel: " + [s.panelManufacturer, s.panelModel].filter(Boolean).join(" "));
  if(s.facpLocation) lines.push("FACP Location: " + s.facpLocation);
  if(s.monitoring) lines.push("Monitoring: " + s.monitoring);
  lines.push("GPS: " + (s.lat && s.lng ? s.lat + ", " + s.lng : "Not set"));
  if(cfg.includeMapLink !== false) lines.push("Map: https://maps.apple.com/?q=" + encodeURIComponent(s.lat&&s.lng ? s.lat+","+s.lng : fullAddress(s)));
  lines.push("");

  lines.push("SITE NOTES");
  lines.push(s.notes || "No site notes recorded.");
  lines.push("");

  if(cfg.includeTasks !== false){
    lines.push("FOLLOW-UP TASKS (" + s.tasks.length + ")");
    if(s.tasks.length){
      s.tasks.forEach((t,i)=>lines.push(`${i+1}. [${t.status||"Open"} / ${t.priority||"Normal"}] ${t.title||""}${t.due ? " - Due " + t.due : ""}${t.notes ? " - " + t.notes : ""}`));
    }else lines.push("None recorded.");
    lines.push("");
  }

  if(cfg.includeDeficiencies !== false){
    lines.push("DEFICIENCIES (" + s.deficiencies.length + ")");
    if(s.deficiencies.length){
      s.deficiencies.forEach((d,i)=>lines.push(`${i+1}. [${d.status||"Open"} / ${d.severity||"Needs Review"}] ${d.description||""}${d.location ? " - " + d.location : ""}${d.recommendation ? " - " + d.recommendation : ""}`));
    }else lines.push("None recorded.");
    lines.push("");
  }

  lines.push("EQUIPMENT (" + s.equipment.length + ")");
  if(s.equipment.length){
    s.equipment.forEach((e,i)=>lines.push(`${i+1}. ${e.type||""} ${e.make||""} ${e.model||""} ${e.location ? "- " + e.location : ""}`));
  }else lines.push("None recorded.");
  lines.push("");

  lines.push("DOCS / PHOTOS (" + s.docs.length + ")");
  if(s.docs.length){
    s.docs.forEach((d,i)=>lines.push(`${i+1}. ${d.type||"File"} - ${d.title||"Untitled"}${d.location ? " - " + d.location : ""}${d.imageData ? " - Photo attached" : ""}${d.url ? " - " + d.url : ""}`));
  }else lines.push("None recorded.");
  lines.push("");

  lines.push("RECENT VISITS (" + s.visits.length + ")");
  if(s.visits.length){
    const limit = cfg.format === "summary" ? 3 : 10;
    s.visits.slice(0,limit).forEach((v,i)=>{
      lines.push(`${i+1}. ${v.date || ""} ${v.startedAt ? fmtTime(v.startedAt) : ""}`);
      lines.push((v.summary || "").split("\\n").slice(0, cfg.format === "summary" ? 2 : 12).join("\\n"));
      lines.push("");
    });
  }else lines.push("No visit history recorded.");

  return lines.join("\\n");
}

function report(){
  const s = getSite();
  if(!s) return route("sites");
  const text = buildSiteReport(s);
  html(`<div class="screen">
    <div class="row"><button class="back ghost" id="reportBack">←</button><h1>Site Report</h1></div>
    <div class="card">
      <h2>${esc(s.name || "Site")}</h2>
      <p>Copy this report into a ticket, email, or service notes.</p>
      <div class="reportActions"><button class="primary" id="copyReport">Copy Report</button><button class="ghost" id="downloadReport">Download TXT</button></div>
    </div>
    <textarea id="reportText" class="grow reportBox">${esc(text)}</textarea>
  </div>`);
  document.getElementById("reportBack").onclick = () => route("siteDetail");
  document.getElementById("copyReport").onclick = copyReport;
  document.getElementById("downloadReport").onclick = downloadReport;
}

function copyReport(){
  const el = document.getElementById("reportText");
  el.focus();
  el.select();
  el.setSelectionRange(0,999999);
  document.execCommand("copy");
  alert("Report copied.");
}

function downloadReport(){
  const s = getSite();
  const blob = new Blob([document.getElementById("reportText").value], {type:"text/plain"});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "firevault-" + (s.name || "site").replace(/[^a-z0-9]+/gi,"-").toLowerCase() + "-report.txt";
  a.click();
}


function library(){
  html(`<div class="screen">
    <div class="row"><div><h1>Library</h1><p>Manufacturer resources, panel notes, links, and cheat sheets.</p></div><button class="primary" id="addResource">＋ Add</button></div>
    <input id="resourceSearch" placeholder="Search manufacturer, panel, trouble code, note, link...">
    <div id="resourceList" class="list grow"></div>
  </div>`);
  document.getElementById("addResource").onclick = () => { mode=null; view="resourceForm"; render(); };
  document.getElementById("resourceSearch").oninput = drawResourceList;
  drawResourceList();
}

function drawResourceList(){
  const q = (document.getElementById("resourceSearch")?.value || "").toLowerCase();
  const list = (data.resources || []).map((r,idx)=>({...r,idx})).filter(r => JSON.stringify(r).toLowerCase().includes(q));
  const box = document.getElementById("resourceList");
  box.innerHTML = list.length ? list.map(r => `<div class="card docLine">
    <div class="row"><h2>${esc(r.m || r.manufacturer || "Resource")}</h2><button class="ghost editResource" data-idx="${r.idx}">Edit</button></div>
    <p><strong>${esc(r.panel || r.t || "General")}</strong></p>
    <p>${esc(r.n || r.notes || "")}</p>
    ${r.url ? `<a class="btn ghost" href="${esc(r.url)}" target="_blank">Open Link</a>` : ""}
  </div>`).join("") : `<div class="empty">No resources yet. Add a manufacturer or panel note.</div>`;
  document.querySelectorAll(".editResource").forEach(btn => btn.onclick = () => {
    mode = Number(btn.dataset.idx);
    view = "resourceForm";
    render();
  });
}

function resourceForm(){
  const editing = Number.isInteger(mode);
  const r = editing ? (data.resources[mode] || {}) : {};
  html(`<div class="screen">
    <div class="row"><button class="back ghost" id="backLibrary">←</button><h1>${editing ? "Edit Resource" : "Add Resource"}</h1></div>
    <div class="form grow">
      <label>Manufacturer</label><input id="resMake" value="${esc(r.m || r.manufacturer)}" placeholder="Fire-Lite, Notifier, EST...">
      <label>Panel / Topic</label><input id="resPanel" value="${esc(r.panel || r.t)}" placeholder="ES-200X, EST4, Ground Faults...">
      <label>URL / Manual Link</label><input id="resUrl" value="${esc(r.url)}" placeholder="Optional link to manual or reference">
      <label>Notes / Cheat Sheet</label><textarea id="resNotes" placeholder="Programming notes, reset steps, trouble code tips...">${esc(r.n || r.notes)}</textarea>
    </div>
    <div class="grid2"><button class="primary" id="saveResource">Save Resource</button>${editing ? `<button class="danger" id="deleteResource">Delete</button>` : `<button class="ghost" id="cancelResource">Cancel</button>`}</div>
  </div>`);
  document.getElementById("backLibrary").onclick = () => route("library");
  document.getElementById("cancelResource")?.addEventListener("click", () => route("library"));
  document.getElementById("saveResource").onclick = () => {
    const obj = {m:val("resMake") || "Unknown Manufacturer", panel:val("resPanel"), url:val("resUrl"), n:val("resNotes"), updatedAt:new Date().toISOString()};
    data.resources = Array.isArray(data.resources) ? data.resources : [];
    if(editing){
      data.resources[mode] = {...data.resources[mode], ...obj};
    }else{
      data.resources.unshift({...obj, id:uid(), createdAt:new Date().toISOString()});
    }
    save(); mode=null; route("library");
  };
  document.getElementById("deleteResource")?.addEventListener("click", () => {
    if(confirm("Delete this resource?")){
      data.resources.splice(mode,1);
      save(); mode=null; route("library");
    }
  });
}

function settings(){
  const s = data.settings;
  const tabNames = [
    ["tech","👷","Tech"],
    ["photo","📷","Photo"],
    ["notify","🔔","Alerts"],
    ["report","📄","Reports"],
    ["pdf","🧾","PDF"],
    ["email","✉️","Email"],
    ["app","⚙️","App"],
    ["advanced","⭐","Advanced"],
    ["backup","💾","Backup"]
  ];

  html(`<div class="screen">
    <div class="row">
      <div><h1>Settings</h1><p>Customize FireVault by section.</p></div>
      <button class="ghost" id="saveSettingsTop">Save</button>
    </div>
    <div class="tabs">
      ${tabNames.map(([key,icon,label]) => `<button class="tabBtn ${settingsTab===key?"active":""}" data-tab="${key}">${icon}<br>${label}</button>`).join("")}
    </div>
    <div id="settingsPanel" class="form grow"></div>
    <button class="primary" id="saveSettings">Save Settings</button>
  </div>`);

  document.querySelectorAll(".tabBtn").forEach(btn => btn.onclick = () => {
    settingsTab = btn.dataset.tab;
    settings();
  });
  document.getElementById("saveSettings").onclick = saveSettingsFromVisibleTab;
  document.getElementById("saveSettingsTop").onclick = saveSettingsFromVisibleTab;
  drawSettingsTab();
}

function drawSettingsTab(){
  const s = data.settings;
  const o = s.overlay, t=s.technician, n=s.notifications, r=s.reports, pdf=s.pdf, e=s.email, a=s.app;
  const field = name => (o.fields||[]).includes(name) ? "checked" : "";
  const panel = document.getElementById("settingsPanel");

  if(settingsTab === "tech"){
    panel.innerHTML = `<div class="card">
      <div class="sectionTitle"><h2>Technician Information</h2><span class="pill">Reports</span></div>
      <p class="settingHint">Used later for reports, PDFs, email signatures, and technician identification.</p>
      <label>Name</label><input id="techName" value="${esc(t.name)}">
      <label>Company</label><input id="techCompany" value="${esc(t.company)}">
      <label>Phone</label><input id="techPhone" value="${esc(t.phone)}">
      <label>Email</label><input id="techEmail" value="${esc(t.email)}">
      <label>License / Certification</label><input id="techLicense" value="${esc(t.license)}">
    </div>`;
  }

  if(settingsTab === "photo"){
    panel.innerHTML = `<div class="card">
      <div class="sectionTitle"><h2>Photo Overlay</h2><span class="pill">Active</span></div>
      <p class="settingHint">Controls the FireVault stamp added to new uploaded photos.</p>
      <label><input type="checkbox" id="f_site" ${field("site")}> Site</label>
      <label><input type="checkbox" id="f_date" ${field("date")}> Date</label>
      <label><input type="checkbox" id="f_time" ${field("time")}> Time</label>
      <label><input type="checkbox" id="f_panel" ${field("panel")}> Panel</label>
      <label><input type="checkbox" id="f_address" ${field("address")}> Address</label>
      <label><input type="checkbox" id="f_gps" ${field("gps")}> GPS</label>
      <label>Alignment</label><select id="ovAlign"><option value="bottom" ${o.alignment==="bottom"?"selected":""}>Bottom</option><option value="top" ${o.alignment==="top"?"selected":""}>Top</option></select>
      <label>Font Size</label><select id="ovFont"><option value="small" ${o.fontSize==="small"?"selected":""}>Small</option><option value="medium" ${o.fontSize==="medium"?"selected":""}>Medium</option><option value="large" ${o.fontSize==="large"?"selected":""}>Large</option></select>
      <label>Text Color</label><input id="ovText" type="color" value="${esc(o.textColor)}">
      <label>Accent Color</label><input id="ovAccent" type="color" value="${esc(o.accentColor)}">
      <label><input type="checkbox" id="ovLogo" ${o.showLogo!==false?"checked":""}> Show Logo</label>
      <label><input type="checkbox" id="ovTagline" ${o.showTagline!==false?"checked":""}> Show Tagline</label>
    </div>`;
  }

  if(settingsTab === "notify"){
    panel.innerHTML = `<div class="card">
      <div class="sectionTitle"><h2>Notifications</h2><span class="pill">Planned</span></div>
      <p class="settingHint">iPhone PWA notification support may vary. These settings prepare app behavior.</p>
      <label><input type="checkbox" id="dailyReminder" ${n.dailyReminder?"checked":""}> Daily reminder</label>
      <label>Reminder Time</label><input id="reminderTime" type="time" value="${esc(n.reminderTime)}">
      <label><input type="checkbox" id="taskAlerts" ${n.taskAlerts?"checked":""}> Task alerts</label>
      <label><input type="checkbox" id="inspectionAlerts" ${n.inspectionAlerts?"checked":""}> Inspection alerts</label>
      <label><input type="checkbox" id="gpsPrompts" ${n.gpsPrompts?"checked":""}> GPS prompts</label>
    </div>`;
  }

  if(settingsTab === "report"){
    panel.innerHTML = `<div class="card">
      <div class="sectionTitle"><h2>Report Formatting</h2><span class="pill">Reports</span></div>
      <label>Report Title</label><input id="reportTitle" value="${esc(r.title)}">
      <label>Report Style</label><select id="reportFormat"><option value="summary" ${r.format==="summary"?"selected":""}>Summary</option><option value="detailed" ${r.format==="detailed"?"selected":""}>Detailed</option><option value="timecard" ${r.format==="timecard"?"selected":""}>Timecard Friendly</option></select>
      <label><input type="checkbox" id="includeTechnician" ${r.includeTechnician?"checked":""}> Include technician</label>
      <label><input type="checkbox" id="includePhotos" ${r.includePhotos?"checked":""}> Include photos</label>
      <label><input type="checkbox" id="includeMapLink" ${r.includeMapLink?"checked":""}> Include map link</label>
      <label><input type="checkbox" id="includeDeficiencies" ${r.includeDeficiencies?"checked":""}> Include deficiencies</label>
      <label><input type="checkbox" id="includeTasks" ${r.includeTasks?"checked":""}> Include tasks</label>
    </div>`;
  }

  if(settingsTab === "pdf"){
    panel.innerHTML = `<div class="card">
      <div class="sectionTitle"><h2>PDF Settings</h2><span class="pill">Future</span></div>
      <label>Paper Size</label><select id="paperSize"><option ${pdf.paperSize==="Letter"?"selected":""}>Letter</option><option ${pdf.paperSize==="A4"?"selected":""}>A4</option></select>
      <label>Orientation</label><select id="pdfOrientation"><option ${pdf.orientation==="Portrait"?"selected":""}>Portrait</option><option ${pdf.orientation==="Landscape"?"selected":""}>Landscape</option></select>
      <label>Photo Size</label><select id="photoSize"><option ${pdf.photoSize==="Small"?"selected":""}>Small</option><option ${pdf.photoSize==="Medium"?"selected":""}>Medium</option><option ${pdf.photoSize==="Large"?"selected":""}>Large</option></select>
      <label><input type="checkbox" id="pdfLogo" ${pdf.includeLogo?"checked":""}> Include logo/header</label>
      <label>Footer Text</label><input id="footerText" value="${esc(pdf.footerText)}">
    </div>`;
  }

  if(settingsTab === "email"){
    panel.innerHTML = `<div class="card">
      <div class="sectionTitle"><h2>Email Defaults</h2><span class="pill">Future</span></div>
      <label>Default To</label><input id="emailTo" value="${esc(e.defaultTo)}">
      <label>Default CC</label><input id="emailCc" value="${esc(e.cc)}">
      <label>Subject Prefix</label><input id="emailPrefix" value="${esc(e.subjectPrefix)}">
      <label>Signature</label><textarea id="emailSig">${esc(e.signature)}</textarea>
    </div>`;
  }

  if(settingsTab === "app"){
    panel.innerHTML = `<div class="card">
      <div class="sectionTitle"><h2>App Behavior</h2><span class="pill">Core</span></div>
      <label>Default Screen</label><select id="defaultScreen"><option value="home" ${a.defaultScreen==="home"?"selected":""}>Today</option><option value="sites" ${a.defaultScreen==="sites"?"selected":""}>Sites</option><option value="library" ${a.defaultScreen==="library"?"selected":""}>Library</option></select>
      <label>Distance Unit</label><select id="distanceUnit"><option value="feet" ${a.distanceUnit==="feet"?"selected":""}>Feet</option><option value="miles" ${a.distanceUnit==="miles"?"selected":""}>Miles</option></select>
      <label><input type="checkbox" id="confirmDeletes" ${a.confirmDeletes?"checked":""}> Confirm Deletes</label>
      <label><input type="checkbox" id="backupReminder" ${a.autoBackupReminder?"checked":""}> Backup reminders</label>
    </div>`;
  }

  if(settingsTab === "advanced"){
    const adv = data.settings.advanced || {};
    panel.innerHTML = `<div class="card">
      <div class="sectionTitle"><h2>Advanced Features</h2><span class="pill">External Services *</span></div>
      <p class="settingHint">Features marked with * may require external services, subscriptions, APIs, or cloud connections later.</p>
      <label><input type="checkbox" id="advAi" ${adv.aiTechnician?"checked":""}> AI Technician *</label>
      <label><input type="checkbox" id="advReverseAddress" ${adv.reverseAddressLookup?"checked":""}> Reverse Address Lookup *</label>
      <label><input type="checkbox" id="advCloud" ${adv.cloudBackup?"checked":""}> Cloud Backup / Sync *</label>
      <label><input type="checkbox" id="advVoice" ${adv.voiceTranscription?"checked":""}> Voice Transcription *</label>
      <label><input type="checkbox" id="advOcr" ${adv.ocrReader?"checked":""}> OCR Document Reader *</label>
      <label><input type="checkbox" id="advEmail" ${adv.emailGateway?"checked":""}> Email Gateway *</label>
      <label><input type="checkbox" id="advWeather" ${adv.weather?"checked":""}> Weather with Visits *</label>
      <label><input type="checkbox" id="advTraffic" ${adv.traffic?"checked":""}> Traffic / Route Services *</label>
    </div>`;
  }

  if(settingsTab === "backup"){
    panel.innerHTML = `<div class="card">
      <div class="sectionTitle"><h2>App Icon / Branding</h2><span class="pill">New</span></div>
      <p class="settingHint">This is the icon used when FireVault is saved to the iPhone Home Screen.</p>
      <img class="brandIconPreview" src="assets/apple-touch-icon.png" alt="FireVault icon">
    </div>
    <div class="card">
      <div class="sectionTitle"><h2>Backup / Export</h2><span class="pill">Important</span></div>
      <p class="settingHint">Export JSON often. CSV files are useful for spreadsheets.</p>
      <button class="primary" id="exportJson">Export JSON Backup</button>
      <div class="grid2"><button class="ghost" id="exportSitesCsv">Sites CSV</button><button class="ghost" id="exportVisitsCsv">Visits CSV</button></div>
      <label>Import JSON Backup</label><input id="jsonImportFile" type="file" accept="application/json">
    </div>
    <div class="card">
      <h2>Reset</h2>
      <button class="danger" id="clearData">Clear Local Data</button>
    </div>`;
    document.getElementById("exportJson").onclick = exportJson;
    document.getElementById("exportSitesCsv").onclick = exportSitesCSV;
    document.getElementById("exportVisitsCsv").onclick = exportVisitsCSV;
    document.getElementById("jsonImportFile").onchange = importJsonFile;
    document.getElementById("clearData").onclick = () => {
      if(confirm("Clear all FireVault local data?")){
        localStorage.removeItem("firevault_vault_build_030");
        location.reload();
      }
    };
  }
}

function saveSettingsFromVisibleTab(){
  const s = data.settings;
  if(settingsTab === "tech"){
    s.technician = {...s.technician,name:val("techName"),company:val("techCompany"),phone:val("techPhone"),email:val("techEmail"),license:val("techLicense")};
  }
  if(settingsTab === "photo"){
    const fields = ["site","date","time","panel","address","gps"].filter(k => checked("f_"+k));
    s.overlay = {fields:fields.length?fields:["site","date","time"],alignment:val("ovAlign"),fontSize:val("ovFont"),textColor:val("ovText"),accentColor:val("ovAccent"),showLogo:checked("ovLogo"),showTagline:checked("ovTagline")};
  }
  if(settingsTab === "notify"){
    s.notifications = {...s.notifications,dailyReminder:checked("dailyReminder"),reminderTime:val("reminderTime"),taskAlerts:checked("taskAlerts"),inspectionAlerts:checked("inspectionAlerts"),gpsPrompts:checked("gpsPrompts")};
  }
  if(settingsTab === "report"){
    s.reports = {...s.reports,title:val("reportTitle"),format:val("reportFormat"),includeTechnician:checked("includeTechnician"),includePhotos:checked("includePhotos"),includeMapLink:checked("includeMapLink"),includeDeficiencies:checked("includeDeficiencies"),includeTasks:checked("includeTasks")};
  }
  if(settingsTab === "pdf"){
    s.pdf = {...s.pdf,paperSize:val("paperSize"),orientation:val("pdfOrientation"),photoSize:val("photoSize"),includeLogo:checked("pdfLogo"),footerText:val("footerText")};
  }
  if(settingsTab === "email"){
    s.email = {...s.email,defaultTo:val("emailTo"),cc:val("emailCc"),subjectPrefix:val("emailPrefix"),signature:val("emailSig")};
  }
  if(settingsTab === "app"){
    s.app = {...s.app,defaultScreen:val("defaultScreen"),distanceUnit:val("distanceUnit"),confirmDeletes:checked("confirmDeletes"),autoBackupReminder:checked("backupReminder")};
  }
  if(settingsTab === "advanced"){
    s.advanced = {
      aiTechnician:checked("advAi"),
      reverseAddressLookup:checked("advReverseAddress"),
      cloudBackup:checked("advCloud"),
      voiceTranscription:checked("advVoice"),
      ocrReader:checked("advOcr"),
      emailGateway:checked("advEmail"),
      weather:checked("advWeather"),
      traffic:checked("advTraffic")
    };
  }
  save();
  alert("Settings saved.");
}

function diagnostics(){
  html(`<div class="screen"><div class="row"><button class="back ghost" id="backHome">←</button><h1>Diagnostics</h1></div><div class="card grow errorBox"><p>Build: ${BUILD}</p><p>Sites: ${data.sites.length}</p><p>Sites with GPS: ${data.sites.filter(s=>s.lat&&s.lng).length}</p><p>Active Job: ${activeJob ? activeJob.siteName : "None"}</p><p>Total Tasks: ${data.sites.reduce((n,s)=>n+(s.tasks||[]).length,0)}</p><p>Total Deficiencies: ${data.sites.reduce((n,s)=>n+(s.deficiencies||[]).length,0)}</p><p>Report Title: ${esc(data.settings.reports.title)}</p><p>Import/Export: Ready</p><p>Advanced AI Enabled: ${data.settings.advanced?.aiTechnician ? "Yes" : "No"}</p><p>Breadcrumbs: ${(data.breadcrumbs||[]).length}</p><p>Storage key: ${KEY}</p><p>Modules loaded successfully.</p></div></div>`);
  document.getElementById("backHome").onclick = () => route("home");
}

function exportJson(){
  downloadBlob("firevault-backup-build-0.38.0.json", JSON.stringify(data,null,2), "application/json");
}

function showChangelog(){
  alert(`FireVault Build ${BUILD}

- Daily Summary / Breadcrumbs module
- Daily visited-sites list
- Manual Drop Crumb GPS capture
- Route points timeline
- Apple Maps and Google Maps route helpers
- Copy daily summary
- Breadcrumb count in Diagnostics`);
}

render();
