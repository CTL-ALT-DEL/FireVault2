import { BUILD, loadData, saveData, ensureSite, fullAddress, esc, uid } from "./storage.js";
import { stampFireVaultPhoto } from "./photos.js";

let data = loadData();
let view = "home";
let selectedSiteId = null;
let mode = null;
let currentDocImageData = "";
let settingsTab = "tech";

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

function route(v){ view = v; mode = null; render(); }

function render(){
  try{
    const routes = {home, sites, siteDetail, siteForm, docs, docForm, imageViewer, library, settings, diagnostics};
    (routes[view] || home)();
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
  const section = ["siteDetail","siteForm","docs","docForm","imageViewer"].includes(view) ? "sites" : view;
  document.getElementById("nav-"+section)?.classList.add("active");
}

function home(){
  const visits = data.sites.flatMap(s => (s.visits||[]).map(v => ({...v, site:s.name})));
  const openTasks = data.sites.reduce((n,s)=>n+(s.tasks||[]).filter(t => (t.status||"Open") !== "Done").length,0);
  html(`<div class="screen">
    <div><h1>Today</h1><p>Modular recovery build. Stable core rebuilt from the last working version.</p></div>
    <div class="grid3">
      <div class="card tile"><strong>${data.sites.length}</strong><span>Sites</span></div>
      <div class="card tile"><strong>${visits.length}</strong><span>Visits</span></div>
      <div class="card tile"><strong>${openTasks}</strong><span>Open Tasks</span></div>
    </div>
    <div class="grid2">
      <button class="primary tile" id="addSiteBtn"><strong>＋ Add Site</strong><span>Create customer vault</span></button>
      <button class="ghost tile" id="diagBtn"><strong>Diagnostics</strong><span>Error tools</span></button>
    </div>
    <div class="card grow"><h2>Recovery Status</h2><p>The app is now split into modules: storage, photos, styles, and app logic. Future builds will patch smaller files instead of one giant HTML file.</p></div>
  </div>`);
  document.getElementById("addSiteBtn").onclick = () => { selectedSiteId=null; view="siteForm"; render(); };
  document.getElementById("diagBtn").onclick = () => { view="diagnostics"; render(); };
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
    <div class="grid2">
      <button class="tile" id="docsBtn"><strong>Docs / Photos</strong><span>${s.docs.length} records</span></button>
      <button class="tile" id="mapBtn"><strong>Map</strong><span>${s.lat&&s.lng?"GPS saved":"Address"}</span></button>
      <button class="tile"><strong>Visits</strong><span>${s.visits.length} records</span></button>
      <button class="tile"><strong>Tasks</strong><span>${s.tasks.length} items</span></button>
    </div>
    <div class="card grow"><h2>Site Notes</h2><p>${esc(s.notes || "No site notes yet.")}</p></div>
  </div>`);
  document.getElementById("backSites").onclick = () => route("sites");
  document.getElementById("editSite").onclick = () => { view="siteForm"; render(); };
  document.getElementById("docsBtn").onclick = () => { view="docs"; render(); };
  document.getElementById("mapBtn").onclick = () => window.open(`https://maps.apple.com/?q=${encodeURIComponent(s.lat&&s.lng ? s.lat+","+s.lng : fullAddress(s))}`,"_blank");
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
      <label>Notes</label><textarea id="notes">${esc(s.notes)}</textarea>
    </div>
    <button class="primary" id="saveSite">Save Site</button>
  </div>`);
  document.getElementById("cancelSite").onclick = () => selectedSiteId ? route("siteDetail") : route("sites");
  document.getElementById("saveSite").onclick = () => {
    const obj = {
      name: val("name") || "Unnamed Site", street: val("street"), city: val("city"), state: val("state"), zip: val("zip"),
      address: val("street"), panelManufacturer: val("panelManufacturer"), panelModel: val("panelModel"), notes: val("notes")
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

function library(){
  html(`<div class="screen"><h1>Library</h1><p>Resource Library module will be rebuilt next.</p><div class="card grow"><p>Existing resources are preserved in storage.</p></div></div>`);
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
  html(`<div class="screen"><div class="row"><button class="back ghost" id="backHome">←</button><h1>Diagnostics</h1></div><div class="card grow errorBox"><p>Build: ${BUILD}</p><p>Sites: ${data.sites.length}</p><p>Storage key: ${KEY}</p><p>Modules loaded successfully.</p></div></div>`);
  document.getElementById("backHome").onclick = () => route("home");
}

function exportJson(){
  const blob = new Blob([JSON.stringify(data,null,2)], {type:"application/json"});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "firevault-backup-build-0.29.0.json";
  a.click();
}

function showChangelog(){
  alert(`FireVault Build ${BUILD}

- Settings page cleaned up with section tabs
- Tech, Photo, Alerts, Reports, PDF, Email, App, Backup
- Smaller modular update
- Core photo/site features preserved
- JSON backup retained`);
}

render();
