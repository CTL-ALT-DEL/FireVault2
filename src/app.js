import { BUILD, KEY, ACTIVE_JOB_KEY, loadData, saveData, ensureSite, fullAddress, esc, uid, downloadBlob } from "./storage.js";

let data = loadData();
let view = new URLSearchParams(location.search).get("route") || data.settings.app?.defaultScreen || "home";
let selectedSiteId = null;
let mode = null;
let settingsTab = "tech";
let activeJob = loadActiveJob();
let jobTimer = null;
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
function startJobTimer(){ stopJobTimer(); jobTimer=setInterval(()=>{ const el=document.getElementById("jobElapsed"); if(el && activeJob) el.textContent=elapsedText(activeJob.startedAt); },1000); }
function stopJobTimer(){ if(jobTimer){ clearInterval(jobTimer); jobTimer=null; } }
function setActiveNav(){ document.querySelectorAll("nav button").forEach(b=>b.classList.remove("active")); const section=["siteDetail","siteForm","tasks","taskForm","deficiencies","deficiencyForm","report","jobMode"].includes(view)?"sites":view; document.getElementById("nav-"+section)?.classList.add("active"); }

function render(){
  try{
    const routes = {home, sites, siteDetail, siteForm, tasks, taskForm, deficiencies, deficiencyForm, report, library, resourceForm, jobMode, settings, diagnostics};
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
  const now = new Date();
  html(`<div class="screen">
    <div><div class="todayDay"><h1>${now.toLocaleDateString([], {weekday:"long"})}</h1></div><p>${fmtDate(now)} • Modular field dashboard</p></div>
    <div class="grid3">
      <div class="card tile metricCard" id="sitesCard"><strong>${data.sites.length}</strong><span>Sites</span></div>
      <div class="card tile metricCard" id="tasksCard"><strong>${openTasks}</strong><span>Open Tasks</span></div>
      <div class="card tile metricCard" id="defCard"><strong>${def}</strong><span>Deficiencies</span></div>
    </div>
    <div class="grid2">
      <button class="primary tile" id="addSiteBtn"><strong>＋ Add Site</strong><span>Create customer vault</span></button>
      <button class="ghost tile" id="settingsBtn"><strong>⚙ Settings</strong><span>Theme engine live</span></button>
      <button class="ghost tile" id="libraryBtn"><strong>▣ Library</strong><span>Panel resources</span></button>
      <button class="ghost tile" id="diagBtn"><strong>Diagnostics</strong><span>Build status</span></button>
    </div>
    ${activeJob ? `<div class="card activeJobMini"><div class="row"><div><h2>Service Call Active</h2><p>${esc(activeJob.siteName)} • <span id="jobElapsed">${elapsedText(activeJob.startedAt)}</span></p></div><button class="primary" id="resumeJobBtn">Open</button></div></div>` : ""}
    <div class="card grow"><h2>Build 0.40.0</h2><p>Theme selections now affect the actual app layout, buttons, cards, accent color, text size, and iPhone status color.</p><p>Home-screen icons were refreshed for a stronger FireVault look.</p></div>
  </div>`);
  document.getElementById("sitesCard").onclick=()=>route("sites");
  document.getElementById("tasksCard").onclick=()=>{selectedSiteId=null; route("tasks");};
  document.getElementById("defCard").onclick=()=>{selectedSiteId=null; route("deficiencies");};
  document.getElementById("addSiteBtn").onclick=()=>{selectedSiteId=null; mode=null; route("siteForm");};
  document.getElementById("settingsBtn").onclick=()=>route("settings");
  document.getElementById("libraryBtn").onclick=()=>route("library");
  document.getElementById("diagBtn").onclick=()=>route("diagnostics");
  const rb=document.getElementById("resumeJobBtn"); if(rb) rb.onclick=()=>{selectedSiteId=activeJob.siteId; route("jobMode");};
}

function sites(){
  html(`<div class="screen"><div class="row"><h1>Sites</h1><button class="primary" id="addBtn">＋</button></div>
    <div class="list grow">${data.sites.length?data.sites.map(s=>`<div class="card siteItem redline" data-id="${s.id}"><div class="row"><div><h2>${esc(s.name||"Unnamed Site")}</h2><p>${esc(fullAddress(s))}</p><p>${esc([s.panelManufacturer,s.panelModel].filter(Boolean).join(" ")||"Panel not entered")}</p></div><span class="pill">${(s.tasks||[]).length} tasks</span></div></div>`).join(""):`<div class="empty">No sites yet. Add your first customer vault.</div>`}</div></div>`);
  document.getElementById("addBtn").onclick=()=>{selectedSiteId=null; mode=null; route("siteForm");};
  document.querySelectorAll(".siteItem").forEach(el=>el.onclick=()=>{selectedSiteId=el.dataset.id; route("siteDetail");});
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
    <div class="card grow"><h2>Site Notes</h2><p>${esc(s.notes || "No notes entered.")}</p><div class="mapActions"><button id="appleBtn" class="ghost">Apple Maps</button><button id="googleBtn" class="ghost">Google Maps</button></div></div>
  </div>`);
  document.getElementById("backBtn").onclick=()=>route("sites");
  document.getElementById("editBtn").onclick=()=>{mode="edit"; route("siteForm");};
  document.getElementById("taskBtn").onclick=()=>route("tasks");
  document.getElementById("defBtn").onclick=()=>route("deficiencies");
  document.getElementById("reportBtn").onclick=()=>route("report");
  document.getElementById("jobBtn").onclick=startJob;
  document.getElementById("appleBtn").onclick=()=>window.open("https://maps.apple.com/?q="+encodeURIComponent(fullAddress(s)),"_blank");
  document.getElementById("googleBtn").onclick=()=>window.open("https://www.google.com/maps/search/?api=1&query="+encodeURIComponent(fullAddress(s)),"_blank");
}

function siteForm(){
  const s = mode==="edit" ? site() : {};
  html(`<div class="screen"><div class="row"><button class="back ghost" id="backBtn">←</button><h1>${mode==="edit"?"Edit":"Add"} Site</h1></div><div class="form grow">
    <div class="card"><label>Name</label><input id="name" value="${esc(s.name||"")}"><label>Street</label><input id="street" value="${esc(s.street||"")}"><div class="compactField"><div><label>City</label><input id="city" value="${esc(s.city||"")}"></div><div><label>State</label><input id="state" value="${esc(s.state||"")}"></div></div><label>ZIP</label><input id="zip" value="${esc(s.zip||"")}"></div>
    <div class="card"><div class="compactField"><div><label>Panel Make</label><input id="pm" value="${esc(s.panelManufacturer||"")}"></div><div><label>Panel Model</label><input id="model" value="${esc(s.panelModel||"")}"></div></div><label>Notes</label><textarea id="notes">${esc(s.notes||"")}</textarea></div>
    <button class="primary" id="saveBtn">Save Site</button>${mode==="edit"?`<button class="danger" id="delBtn">Delete Site</button>`:""}
  </div></div>`);
  document.getElementById("backBtn").onclick=()=>{route(mode==="edit"?"siteDetail":"sites")};
  document.getElementById("saveBtn").onclick=()=>{
    const obj={name:val("name")||"Unnamed Site",street:val("street"),city:val("city"),state:val("state"),zip:val("zip"),panelManufacturer:val("pm"),panelModel:val("model"),notes:raw("notes")};
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
  return `${set.reports.title}\nGenerated: ${new Date().toLocaleString()}\n\nSITE\n${s.name}\n${fullAddress(s)}\nPanel: ${[s.panelManufacturer,s.panelModel].filter(Boolean).join(" ")||"Not entered"}\n\nTECHNICIAN\n${tech.name||""}\n${tech.company||""}\n${tech.phone||""}\n${tech.email||""}\n\nTASKS\n${(s.tasks||[]).map(t=>`- ${t.status||"Open"}: ${t.title}${t.due?` due ${t.due}`:""}`).join("\n")||"No tasks"}\n\nDEFICIENCIES\n${(s.deficiencies||[]).map(d=>`- ${d.status||"Open"}: ${d.priority||"Normal"} - ${d.title}`).join("\n")||"No deficiencies"}\n\nNOTES\n${s.notes||"No notes"}\n\nEMAIL SUBJECT\n${renderTemplate(set.email.defaultSubject,s)}\n\nSIGNATURE\n${renderTemplate(set.email.signature,s)}`;
}
function renderTemplate(t,s){ const tech=data.settings.technician||{}; return String(t||"").replaceAll("{site_name}",s.name||"").replaceAll("{date}",fmtDate()).replaceAll("{technician}",tech.name||"").replaceAll("{company}",tech.company||"").replaceAll("{phone}",tech.phone||"").replaceAll("{email}",tech.email||""); }
function report(){ const s=site(); if(!s){route("sites"); return;} const txt=reportText(s); html(`<div class="screen"><div class="row"><button class="back ghost" id="backBtn">←</button><h1>Report</h1></div><div class="reportActions"><button class="primary" id="copyBtn">Copy Report</button><button class="ghost" id="downloadBtn">Download TXT</button></div><div class="card reportBox grow">${esc(txt)}</div></div>`); document.getElementById("backBtn").onclick=()=>route("siteDetail"); document.getElementById("copyBtn").onclick=async()=>{await navigator.clipboard.writeText(txt); toast("Report copied.");}; document.getElementById("downloadBtn").onclick=()=>downloadBlob(`firevault-report-${(s.name||"site").replace(/\W+/g,"-")}.txt`,txt); }

function library(){ html(`<div class="screen"><div class="row"><h1>Library</h1><button class="primary" id="addBtn">＋</button></div><div class="list grow">${data.resources.length?data.resources.map(r=>`<div class="card docLine siteItem" data-id="${r.id}"><h2>${esc(r.m||"Resource")}</h2><p>${esc(r.n||"")}</p><p>${esc(r.url||"")}</p></div>`).join(""):`<div class="empty">No resources yet.</div>`}</div></div>`); document.getElementById("addBtn").onclick=()=>{mode=null; route("resourceForm");}; document.querySelectorAll(".siteItem").forEach(el=>el.onclick=()=>{mode=el.dataset.id; route("resourceForm");}); }
function resourceForm(){ const r=mode?data.resources.find(x=>x.id===mode):{}; html(`<div class="screen"><div class="row"><button class="back ghost" id="backBtn">←</button><h1>${mode?"Edit":"Add"} Resource</h1></div><div class="form grow"><div class="card"><label>Manufacturer</label><input id="m" value="${esc(r.m||"")}"><label>Name / Model</label><input id="n" value="${esc(r.n||"")}"><label>URL / Notes</label><textarea id="url">${esc(r.url||"")}</textarea></div><button class="primary" id="saveBtn">Save Resource</button>${mode?`<button class="danger" id="delBtn">Delete Resource</button>`:""}</div></div>`); document.getElementById("backBtn").onclick=()=>route("library"); document.getElementById("saveBtn").onclick=()=>{const obj={m:val("m"),n:val("n"),url:raw("url")}; if(mode) Object.assign(r,obj); else data.resources.unshift({...obj,id:uid()}); save(); route("library");}; const del=document.getElementById("delBtn"); if(del) del.onclick=()=>{data.resources=data.resources.filter(x=>x.id!==mode); save(); route("library");}; }

function startJob(){ const s=site(); activeJob={siteId:s.id,siteName:s.name,startedAt:new Date().toISOString(),events:[{time:new Date().toISOString(),note:"Job started"}]}; saveActiveJob(); route("jobMode"); }
function jobMode(){ const s=site(); if(!s||!activeJob){route("siteDetail"); return;} html(`<div class="screen"><div class="row"><button class="back ghost" id="backBtn">←</button><h1>Job Mode</h1></div><div class="card"><h2>${esc(s.name)}</h2><div class="timer" id="jobElapsed">${elapsedText(activeJob.startedAt)}</div></div><div class="grid2"><button class="ghost" id="noteBtn">Add Event</button><button class="primary" id="finishBtn">Finish Visit</button></div><div class="list grow">${(activeJob.events||[]).map(e=>`<div class="card visit"><strong>${new Date(e.time).toLocaleTimeString([], {hour:"numeric",minute:"2-digit"})}</strong><p>${esc(e.note)}</p></div>`).join("")}</div></div>`); document.getElementById("backBtn").onclick=()=>route("siteDetail"); document.getElementById("noteBtn").onclick=()=>{const note=prompt("Event note:","Checked panel"); if(note){activeJob.events.unshift({time:new Date().toISOString(),note}); saveActiveJob(); render();}}; document.getElementById("finishBtn").onclick=()=>{s.visits=s.visits||[]; s.visits.unshift({id:uid(),date:todayIso(),startedAt:activeJob.startedAt,endedAt:new Date().toISOString(),notes:(activeJob.events||[]).map(e=>`${new Date(e.time).toLocaleTimeString([], {hour:"numeric",minute:"2-digit"})} - ${e.note}`).join("\n")}); activeJob=null; saveActiveJob(); save(); toast("Visit saved."); route("siteDetail");}; }

function settings(){
  const tabs=[["tech","Technician"],["reports","Reports"],["email","Email"],["overlay","Photos"],["themes","Themes"],["advanced","Advanced"],["backup","Backup"],["about","About"]];
  html(`<div class="screen"><div class="card settingsHero"><div class="row"><div><h1>Settings</h1><p>Professional settings, live themes, reports, and service options.</p></div><button class="ghost" id="diagBtn">Diagnostics</button></div></div><div class="tabs">${tabs.map(t=>`<button class="tabBtn ${settingsTab===t[0]?"active":""}" data-tab="${t[0]}">${t[1]}</button>`).join("")}</div><div class="form grow">${settingsPanel()}</div></div>`);
  document.querySelectorAll(".tabBtn").forEach(b=>b.onclick=()=>{settingsTab=b.dataset.tab; settings();});
  document.getElementById("diagBtn").onclick=()=>route("diagnostics");
  wireSettingsPanel();
}
function settingsPanel(){
  const s=data.settings, t=s.theme, tech=s.technician, email=s.email, r=s.reports, o=s.overlay, a=s.advanced;
  if(settingsTab==="tech") return `<div class="card settingGroup"><h2>Technician Profile</h2><label>Name</label><input id="techName" value="${esc(tech.name)}"><label>Company</label><input id="techCompany" value="${esc(tech.company)}"><div class="compactField"><div><label>Phone</label><input id="techPhone" value="${esc(tech.phone)}"></div><div><label>Email</label><input id="techEmail" value="${esc(tech.email)}"></div></div><label>License</label><input id="techLicense" value="${esc(tech.license)}"><button class="primary" id="saveSettings">Save Technician</button></div>`;
  if(settingsTab==="reports") return `<div class="card settingGroup"><h2>Report Defaults</h2><label>Report Title</label><input id="reportTitle" value="${esc(r.title)}"><label>Format</label><select id="reportFormat"><option ${r.format==="detailed"?"selected":""}>detailed</option><option ${r.format==="compact"?"selected":""}>compact</option></select><label><input type="checkbox" id="repTech" ${r.includeTechnician?"checked":""}> Include technician</label><label><input type="checkbox" id="repTasks" ${r.includeTasks?"checked":""}> Include tasks</label><label><input type="checkbox" id="repDef" ${r.includeDeficiencies?"checked":""}> Include deficiencies</label><button class="primary" id="saveSettings">Save Reports</button></div>`;
  if(settingsTab==="email") return `<div class="card settingGroup"><h2>Email Defaults</h2><label>Default To</label><input id="emailTo" value="${esc(email.defaultTo)}"><label>CC</label><input id="emailCc" value="${esc(email.cc)}"><label>Default Subject</label><input id="emailSubject" value="${esc(email.defaultSubject)}"><label>Signature Tag</label><textarea id="emailSig">${esc(email.signature)}</textarea><div class="tagHelp">Tags: {site_name}, {date}, {technician}, {company}, {phone}, {email}</div><button class="primary" id="saveSettings">Save Email</button></div>`;
  if(settingsTab==="overlay") return `<div class="card settingGroup"><h2>Photo Overlay</h2><div class="previewPanel"><div class="previewOverlay ${o.alignment==="top"?"top":""}">FIREVAULT • Site • Date • Time</div></div><label>Alignment</label><select id="ovAlign"><option ${o.alignment==="bottom"?"selected":""}>bottom</option><option ${o.alignment==="top"?"selected":""}>top</option></select><label>Font Size</label><select id="ovSize"><option ${o.fontSize==="small"?"selected":""}>small</option><option ${o.fontSize==="medium"?"selected":""}>medium</option><option ${o.fontSize==="large"?"selected":""}>large</option></select><label>Accent Color</label><input id="ovAccent" type="color" value="${esc(o.accentColor)}"><label><input type="checkbox" id="ovLogo" ${o.showLogo?"checked":""}> Show logo</label><button class="primary" id="saveSettings">Save Overlay</button></div>`;
  if(settingsTab==="themes") return `<div class="card settingGroup"><h2>Theme Engine</h2><p>These controls now apply to the live app, not just backup data.</p><div class="grid2">${Object.entries(themePresets).map(([key,p])=>`<button class="ghost presetBtn" data-preset="${key}"><span class="themeSwatch" style="background:${p.accentColor}"></span>${p.label}</button>`).join("")}</div><label>Theme</label><select id="themeName">${Object.entries(themePresets).map(([key,p])=>`<option value="${key}" ${t.name===key?"selected":""}>${p.label}</option>`).join("")}</select><label>Accent Color</label><input id="themeAccent" type="color" value="${esc(t.accentColor||"#ef4444")}"><div class="compactField"><div><label>Buttons</label><select id="buttonStyle"><option value="rounded" ${t.buttonStyle!=="squared"?"selected":""}>rounded</option><option value="squared" ${t.buttonStyle==="squared"?"selected":""}>squared</option></select></div><div><label>Cards</label><select id="cardStyle"><option value="glass" ${t.cardStyle!=="solid"?"selected":""}>glass</option><option value="solid" ${t.cardStyle==="solid"?"selected":""}>solid</option></select></div></div><label><input type="checkbox" id="themeHighContrast" ${t.highContrast?"checked":""}> High contrast support</label><label><input type="checkbox" id="themeLargeText" ${t.largeText?"checked":""}> Larger text</label><label><input type="checkbox" id="themeCompact" ${t.compactLayout?"checked":""}> Compact layout</label><button class="primary" id="saveSettings">Apply Theme</button></div>`;
  if(settingsTab==="advanced") return `<div class="card settingGroup"><h2>Advanced Features</h2><p><span class="featureStar">*</span> Requires outside service, permission, API, or future backend.</p>${[["advAi","aiTechnician","AI Technician"],["advReverse","reverseAddressLookup","Reverse Address Lookup *"],["advCloud","cloudBackup","Cloud Backup *"],["advVoice","voiceTranscription","Voice Transcription *"],["advOcr","ocrReader","OCR Reader *"],["advEmail","emailGateway","Email Gateway *"],["advWeather","weather","Weather Context *"],["advTraffic","traffic","Traffic / Routing *"]].map(x=>`<label><input type="checkbox" id="${x[0]}" ${a[x[1]]?"checked":""}> ${x[2]}</label>`).join("")}<button class="primary" id="saveSettings">Save Advanced</button></div>`;
  if(settingsTab==="backup") return `<div class="card settingGroup"><h2>Import / Export</h2><p>Export before replacing files in GitHub Pages.</p><button class="primary" id="exportBtn">Export Backup</button><br><br><label>Import Backup</label><input type="file" id="importFile" accept="application/json"><br><br><button class="danger" id="resetBtn">Clear Local Data</button></div>`;
  return `<div class="card settingGroup"><h2>About FireVault</h2><p>FireVault is a modular field knowledge system for fire alarm technicians. It keeps customer sites, panels, tasks, deficiencies, reports, and field preferences together on your iPhone or desktop browser.</p><p>Build: ${BUILD}</p><p>Storage key: ${KEY}</p><p>Current roadmap lane: modular foundation, settings, themes, iPhone PWA polish, then deeper service-call modules.</p></div>`;
}
function wireSettingsPanel(){
  const saveBtn=document.getElementById("saveSettings"); if(saveBtn) saveBtn.onclick=saveSettings;
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
  if(settingsTab==="themes") s.theme={name:val("themeName"),accentColor:val("themeAccent"),highContrast:checked("themeHighContrast"),largeText:checked("themeLargeText"),compactLayout:checked("themeCompact"),buttonStyle:val("buttonStyle"),cardStyle:val("cardStyle")};
  if(settingsTab==="advanced") s.advanced={aiTechnician:checked("advAi"),reverseAddressLookup:checked("advReverse"),cloudBackup:checked("advCloud"),voiceTranscription:checked("advVoice"),ocrReader:checked("advOcr"),emailGateway:checked("advEmail"),weather:checked("advWeather"),traffic:checked("advTraffic")};
  save(); toast("Settings saved."); settings();
}

function diagnostics(){ const totalTasks=data.sites.reduce((n,s)=>n+(s.tasks||[]).length,0); const totalDef=data.sites.reduce((n,s)=>n+(s.deficiencies||[]).length,0); html(`<div class="screen"><div class="row"><button class="back ghost" id="backHome">←</button><h1>Diagnostics</h1></div><div class="card grow errorBox"><p>Build: ${BUILD}</p><p>Sites: ${data.sites.length}</p><p>Total Tasks: ${totalTasks}</p><p>Total Deficiencies: ${totalDef}</p><p>Active Job: ${activeJob ? esc(activeJob.siteName) : "None"}</p><p>Current Theme: ${esc(data.settings.theme.name)}</p><p>Accent: ${esc(data.settings.theme.accentColor)}</p><p>Advanced AI Enabled: ${data.settings.advanced?.aiTechnician ? "Yes" : "No"}</p><p>Import/Export: Ready</p><p>Storage key: ${KEY}</p><p>Modules loaded successfully.</p></div></div>`); document.getElementById("backHome").onclick=()=>route("home"); }
function showChangelog(){ alert(`FireVault Build ${BUILD}\n\n- Live Theme Engine: saved themes now apply to the app\n- Preset theme buttons added\n- Large text, compact layout, button shape, and card style modes\n- Refreshed iPhone/PWA icons\n- Manifest polish for Add to Home Screen\n- Advanced features remain clearly marked with *\n- Preserves modular storage key`); }
render();
