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
    const routes = {home, sites, siteDetail, siteForm, docs, docForm, imageViewer, library, resourceForm, jobMode, visits, visitDetail, settings, diagnostics};
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
  const section = ["siteDetail","siteForm","docs","docForm","imageViewer","jobMode","visits","visitDetail"].includes(view) ? "sites" : view;
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
      <button class="ghost tile" id="addSiteBtn"><strong>＋ Add Site</strong><span>Create customer vault</span></button>
    </div>
    <div id="nearbyBox"></div>
    ${activeJob ? `<div class="card activeJobMini"><div class="row"><div><h2>Service Call Active</h2><p>${esc(activeJob.siteName)} • <span id="jobElapsed">${elapsedText(activeJob.startedAt)}</span></p></div><button class="primary" id="resumeJobBtn">Open</button></div></div>` : ""}
    <div class="card grow"><h2>Job Mode Module</h2><p>Start live service calls, timestamp events, and finish calls into visit history.</p><button class="ghost" id="diagBtn">Diagnostics</button></div>
  </div>`);
  document.getElementById("sitesCard").onclick = () => route("sites");
  document.getElementById("visitsCard").onclick = () => route("visits");
  document.getElementById("tasksCard").onclick = openTasksPlaceholder;
  document.getElementById("addSiteBtn").onclick = () => { selectedSiteId=null; view="siteForm"; render(); };
  document.getElementById("diagBtn").onclick = () => { view="diagnostics"; render(); };
  document.getElementById("nearbyBtn").onclick = scanNearbySites;
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

function sites(){
  html(`<div class="screen">
    <div class="row"><div><h1>Sites</h1><p>Customer vaults.</p></div><button class="primary" id="addSite">＋ Add</button></div>
    <input id="siteSearch" placeholder="Search sites, city, panel, notes...">
    <div id="siteList" class="list grow"></div>
  </div>`);
  document.getElementById("addSite").onclick = () => { selectedSiteId=null; view="siteForm"; render(); };
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
      <button class="tile"><strong>Tasks</strong><span>${s.tasks.length} items</span></button>
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

  if(settingsTab === "backup"){
    panel.innerHTML = `<div class="card">
      <div class="sectionTitle"><h2>App Icon / Branding</h2><span class="pill">New</span></div>
      <p class="settingHint">This is the icon used when FireVault is saved to the iPhone Home Screen.</p>
      <img class="brandIconPreview" src="assets/apple-touch-icon.png" alt="FireVault icon">
    </div>
    <div class="card">
      <div class="sectionTitle"><h2>Backup / Export</h2><span class="pill">Important</span></div>
      <p class="settingHint">Export JSON often. CSV export will be restored in an upcoming modular build.</p>
      <button class="primary" id="exportJson">Export JSON Backup</button>
    </div>
    <div class="card">
      <h2>Reset</h2>
      <button class="danger" id="clearData">Clear Local Data</button>
    </div>`;
    document.getElementById("exportJson").onclick = exportJson;
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
  save();
  alert("Settings saved.");
}

function diagnostics(){
  html(`<div class="screen"><div class="row"><button class="back ghost" id="backHome">←</button><h1>Diagnostics</h1></div><div class="card grow errorBox"><p>Build: ${BUILD}</p><p>Sites: ${data.sites.length}</p><p>Sites with GPS: ${data.sites.filter(s=>s.lat&&s.lng).length}</p><p>Active Job: ${activeJob ? activeJob.siteName : "None"}</p><p>Storage key: ${KEY}</p><p>Modules loaded successfully.</p></div></div>`);
  document.getElementById("backHome").onclick = () => route("home");
}

function exportJson(){
  const blob = new Blob([JSON.stringify(data,null,2)], {type:"application/json"});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "firevault-backup-build-0.33.0.json";
  a.click();
}

function showChangelog(){
  alert(`FireVault Build ${BUILD}

- Job Mode module restored
- Start Service Call button on site vault
- Live elapsed timer
- Quick event buttons and custom notes
- Job Mode photo capture
- Finish Call saves visit history
- Compact visit list with detail view`);
}

render();
