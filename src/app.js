import { BUILD, KEY, ACTIVE_JOB_KEY, loadData, saveData, ensureSite, fullAddress, esc, uid, downloadBlob } from "./storage.js";
window.__FIREVAULT_MODULE_READY = true;

let data = loadData();
let view = new URLSearchParams(location.search).get("route") || data.settings.app?.defaultScreen || "home";
let selectedSiteId = null;
let mode = null;
let settingsTab = "tech";
let settingsRailScroll = 0;
const SETTINGS_SCROLL_KEY_576 = "firevault_settings_scroll_05076";
let settingsSubmenuReturn576 = false;
let settingsScrollState576 = loadSettingsScrollState576();
const HOME_CARD_STATE_KEY_5100 = "firevault_home_card_state_05100";
let homeCardState5100 = loadHomeCardState5100();
let lastEmailTemplateField = "emailSubject";
let overlayLogoDraftDataUrl = "";
let docPhotoDraftDataUrl512 = "";
let docPhotoDraftName512 = "";
let docPhotoClearRequested512 = false;
let taskFilter = "open";
let deficiencyFilter = "open";
let actionCenterFilter562 = "all";
let activeJob = loadActiveJob();
let nearbyState = null;
let siteSearch = "";
let dailySummaryDate569 = localStorage.getItem("firevault_daily_summary_date") || "";
let dailyPickerMonth571 = localDateString().slice(0,7);
let libraryFolder = "all";
let docVaultFilter516 = "all";
let docVaultSearch521 = "";
let docVaultSort522 = "recent";
let routeReviewId = "";
let routeHistorySearch = "";
let simpleToolsOpen = false;
let homeInstallTipHidden = localStorage.getItem("firevault_home_install_tip_hidden") === "1";
let jobTimer = null;
const ACTIVE_ROUTE_KEY = "firevault_active_route_day";
let activeRoute = loadActiveRoute();
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
const NOTE_TEMPLATES_503 = [
  ["System","Panel Normal","Panel checked and left normal. No active alarms, troubles, or supervisory conditions observed."],
  ["System","Trouble Found","Trouble condition found on site. Further troubleshooting / follow-up required."],
  ["System","Ground Fault","Ground fault indication present. Circuit isolation / wiring investigation required."],
  ["Customer","Customer Notified","Customer was notified of current fire alarm system status and next steps."],
  ["Customer","Access Issue","Access issue encountered. Add door, room, contact, key, or escort details."],
  ["Follow-Up","Parts Needed","Parts or material are needed for completion. Add item details and quantity."],
  ["Testing","Device Tested","Device tested and verified. Add device type, location, and result."],
  ["Testing","Inspection Note","Inspection-related note. Add test area, device sample, or documentation details."]
];

const EMAIL_TAGS = [
  ["{site_name}","Site"], ["{date}","Date"], ["{technician}","Tech"],
  ["{company}","Company"], ["{phone}","Phone"], ["{email}","Email"]
];
const OVERLAY_TAGS_510 = [
  ["{site_name}","Site Name","Customer / site record name"],
  ["{address}","Address","Full site address"],
  ["{city}","City","Site city"],
  ["{state}","State","Site state"],
  ["{zip}","ZIP","Site ZIP code"],
  ["{date}","Date","Current date"],
  ["{time}","Time","Current time"],
  ["{technician}","Technician","Technician profile name"],
  ["{company}","Company","Technician profile company"],
  ["{phone}","Phone","Technician profile phone"],
  ["{email}","Email","Technician profile email"],
  ["{license}","License","Technician license / ID"],
  ["{gps}","GPS","Sample saved GPS coordinates"],
  ["{build}","Build","Current FireVault build number"]
];
const PHOTO_CATEGORIES_524 = ["Panel","NAC","Device","Communicator","Battery","Deficiency","Before","After","Other"];
const PHOTO_CATEGORY_HINTS_524 = {
  Panel:"Panel cabinet, display, trouble state, or wiring overview.",
  NAC:"Horn/strobe circuit, EOL, module, or notification appliance wiring.",
  Device:"Smoke, pull station, duct detector, module, tamper, flow, or other field device.",
  Communicator:"Cellular/IP communicator, antenna, signal screen, or wiring.",
  Battery:"Batteries, date codes, charger readings, or cabinet condition.",
  Deficiency:"Problem condition, damage, missing device, access issue, or failed test evidence.",
  Before:"Before repair or before cleanup documentation.",
  After:"After repair, restore, cleanup, or completion documentation.",
  Other:"General site photo."
};
const REPORT_SECTION_KEY = "firevault_report_section_prefs";
let reportSectionPrefs = loadReportSectionPrefs();
const appEl = document.getElementById("app");
function fireVaultBrand575(extraClass=""){
  return `<span class="fireVaultWordmark575 ${esc(extraClass)}"><span>FIRE</span><b>VAULT</b></span>`;
}

/* Build 0.51.0 Home card collapse memory */
function loadHomeCardState5100(){
  try{
    const parsed=JSON.parse(localStorage.getItem(HOME_CARD_STATE_KEY_5100)||"{}");
    return parsed && typeof parsed==="object" ? parsed : {};
  }catch{
    return {};
  }
}
function persistHomeCardState5100(){
  try{ localStorage.setItem(HOME_CARD_STATE_KEY_5100, JSON.stringify(homeCardState5100)); }catch{}
}
function homeCardCollapsed5100(key){ return homeCardState5100[key]===true; }
function homeCollapseButton5100(key,label){
  const collapsed=homeCardCollapsed5100(key);
  return `<button class="ghost smallBtn homeCollapseBtn5100" type="button" data-home-collapse="${esc(key)}" data-home-label="${esc(label)}" aria-expanded="${collapsed?"false":"true"}" aria-label="${collapsed?"Expand":"Collapse"} ${esc(label)}"><span aria-hidden="true">${collapsed?"⌄":"⌃"}</span></button>`;
}
function wireHomeCollapsibles5100(){
  document.querySelectorAll("[data-home-collapse]").forEach(btn=>{
    btn.onclick=e=>{
      e.preventDefault();
      e.stopPropagation();
      const key=btn.dataset.homeCollapse||"";
      if(!key) return;
      const collapsed=!homeCardCollapsed5100(key);
      homeCardState5100[key]=collapsed;
      persistHomeCardState5100();
      const card=btn.closest("[data-home-collapsible]");
      const body=card?.querySelector("[data-home-collapse-body]");
      if(card) card.classList.toggle("homeCollapsed5100",collapsed);
      if(body) body.hidden=collapsed;
      btn.setAttribute("aria-expanded",collapsed?"false":"true");
      btn.setAttribute("aria-label",`${collapsed?"Expand":"Collapse"} ${btn.dataset.homeLabel||"Home card"}`);
      const icon=btn.querySelector("span");
      if(icon) icon.textContent=collapsed?"⌄":"⌃";
    };
  });
}

/* Build 0.50.76 Settings scroll-position recovery */
function loadSettingsScrollState576(){
  try{
    const parsed=JSON.parse(sessionStorage.getItem(SETTINGS_SCROLL_KEY_576)||"{}");
    return {home:Number(parsed.home)||0,details:{...(parsed.details||{})}};
  }catch{
    return {home:0,details:{}};
  }
}
function persistSettingsScrollState576(){
  try{ sessionStorage.setItem(SETTINGS_SCROLL_KEY_576, JSON.stringify(settingsScrollState576)); }catch{}
}
function captureSettingsScroll576(){
  const home=document.querySelector(".settingsHomeScreen488.settingsStable573");
  if(home) settingsScrollState576.home=Math.max(0,Number(home.scrollTop)||0);
  const detail=document.querySelector(".settingsDetailBody488, .settingsDetailBody451");
  if(detail) settingsScrollState576.details[settingsTab]=Math.max(0,Number(detail.scrollTop)||0);
  settingsRailScroll=settingsScrollState576.home;
  persistSettingsScrollState576();
}
function restoreSettingsScroll576(inDetail){
  const selector=inDetail ? ".settingsDetailBody488, .settingsDetailBody451" : ".settingsHomeScreen488.settingsStable573";
  const target=inDetail ? Number(settingsScrollState576.details[settingsTab])||0 : Number(settingsScrollState576.home)||0;
  const restore=()=>{
    const el=document.querySelector(selector);
    if(!el) return;
    const max=Math.max(0,el.scrollHeight-el.clientHeight);
    el.scrollTop=Math.min(Math.max(0,target),max);
  };
  requestAnimationFrame(()=>{ restore(); requestAnimationFrame(restore); });
  setTimeout(restore,80);
}
function openSettingsSubmenu576(target){
  captureSettingsScroll576();
  settingsSubmenuReturn576=true;
  route(target);
}
function returnFromSettingsSubmenu576(fallback="home"){
  if(settingsSubmenuReturn576){
    settingsSubmenuReturn576=false;
    openSettingsHome572();
    return;
  }
  route(fallback);
}
const themePresets = {
  "firevault-dark": {label:"FireVault Dark", accentColor:"#ef4444"},
  "fire-red": {label:"Fire Red", accentColor:"#ef4444"},
  "industrial-blue": {label:"Industrial Blue", accentColor:"#38bdf8"},
  "night-shift": {label:"Night Shift", accentColor:"#f59e0b"},
  "high-contrast": {label:"High Contrast", accentColor:"#facc15", highContrast:true},
  "amoled-black": {label:"AMOLED Black", accentColor:"#ef4444"}
};

const FEATURE_DEFAULTS = {dailyRoute:true, fieldFocus:true, dataSafeHome:true, siteBrief:true, siteTimeline:true, pinnedSites:true, importantSiteInfo:true, library:false, reports:false, equipment:false, diagnostics:false, advancedGps:true, attention:false, routeReview:false, csvExports:false, backupRepair:false};
const FEATURE_LABELS = [
  ["dailyRoute","Daily Route","Route day logging, active route card, waypoint tools, and saved route days."],
  ["fieldFocus","Field Focus","Home dashboard for attention sites, open tasks, deficiencies, photos, due-today items, overdue items, and Action Center shortcuts."],
  ["dataSafeHome","Data Safe Home Card","Compact Home card that opens Data Tools for backup, restore, diagnostics, and repair."],
  ["siteBrief","Site Brief","Compact account summary with tasks, deficiencies, photos, visits, panel, contact, access, and last visit."],
  ["siteTimeline","Site Activity Timeline","Recent account activity list with filters for visits, photos/documents, tasks, and deficiencies."],
  ["pinnedSites","Pinned Sites","Home shortcut row for high-use or important customer accounts."],
  ["importantSiteInfo","Important Site Info","Account-screen strip for contact, access notes, panel info, GPS status, and quick copy."],
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
  minimal:{label:"Minimal Daily", mode:"simple", icon:"◯", note:"Clean dashboard for basic sites and today’s route.", features:{dailyRoute:true, fieldFocus:true, dataSafeHome:true, siteBrief:true, siteTimeline:true, pinnedSites:true, importantSiteInfo:true, advancedGps:false, attention:false, library:false, reports:false, equipment:false, routeReview:false, csvExports:false, diagnostics:false, backupRepair:false}},
  route:{label:"Route Logger", mode:"simple", icon:"◇", note:"Daily Route plus GPS / nearby tools.", features:{dailyRoute:true, fieldFocus:true, dataSafeHome:true, siteBrief:true, siteTimeline:true, pinnedSites:true, importantSiteInfo:true, advancedGps:true, attention:false, library:false, reports:false, equipment:false, routeReview:true, csvExports:false, diagnostics:false, backupRepair:false}},
  service:{label:"Service Tech", mode:"advanced", icon:"▣", note:"Sites, reports, equipment, GPS, and attention tools.", features:{dailyRoute:true, fieldFocus:true, dataSafeHome:true, siteBrief:true, siteTimeline:true, pinnedSites:true, importantSiteInfo:true, advancedGps:true, attention:true, library:false, reports:true, equipment:true, routeReview:false, csvExports:false, diagnostics:false, backupRepair:false}},
  inspection:{label:"Inspector", mode:"advanced", icon:"▤", note:"Reports, equipment, route review, library, and export tools.", features:{dailyRoute:true, fieldFocus:true, dataSafeHome:true, siteBrief:true, siteTimeline:true, pinnedSites:true, importantSiteInfo:true, advancedGps:true, attention:true, library:true, reports:true, equipment:true, routeReview:true, csvExports:true, diagnostics:false, backupRepair:false}},
  power:{label:"Power Mode", mode:"power", icon:"⚡", note:"Show every FireVault module and advanced control.", features:{dailyRoute:true, fieldFocus:true, dataSafeHome:true, siteBrief:true, siteTimeline:true, pinnedSites:true, importantSiteInfo:true, advancedGps:true, attention:true, library:true, reports:true, equipment:true, routeReview:true, csvExports:true, diagnostics:true, backupRepair:true}}
};
function activeFeaturePresetKey575(){
  const mode=appMode();
  const v=visibility();
  const keys=Object.keys(FEATURE_DEFAULTS);
  return Object.entries(FEATURE_PRESETS_474).find(([,p])=>p.mode===mode && keys.every(k=>(p.features[k]===true)===(v[k]===true)))?.[0] || "";
}
function visibilityPresetCards474(){
  const active=activeFeaturePresetKey575();
  return `<div class="card settingGroup compactPane featurePresets474"><div class="paneHead"><div><h2>Quick View Presets</h2><p class="paneNote">One tap changes the app mode and visible features. The active preset stays highlighted.</p></div></div><div class="presetGrid474">${Object.entries(FEATURE_PRESETS_474).map(([key,p])=>`<button class="ghost presetFeatureBtn474 ${active===key?"presetActive575":""}" data-feature-preset="${esc(key)}" aria-pressed="${active===key?"true":"false"}"><span>${esc(p.icon)}</span><strong>${esc(p.label)}</strong><small>${esc(p.note)}</small>${active===key?`<em class="presetActiveBadge575">✓ Active</em>`:""}</button>`).join("")}</div></div>`;
}
function applyFeaturePreset474(name){
  const p=FEATURE_PRESETS_474[name];
  if(!p){ toast("Preset unavailable."); return; }
  data.settings.app={...(data.settings.app||{}),viewMode:p.mode,activeFeaturePreset575:name};
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

const LAYOUT_PRESETS_565 = {
  clean:{label:"Clean Home", icon:"◯", note:"Hide priority and backup cards; keep account screens compact.", values:{fieldFocus:false,dataSafeHome:false,siteBrief:true,siteTimeline:false,pinnedSites:true,importantSiteInfo:true}},
  field:{label:"Field Focused", icon:"▣", note:"Show field priorities and data safety, keep site screens useful.", values:{fieldFocus:true,dataSafeHome:true,siteBrief:true,siteTimeline:true,pinnedSites:true,importantSiteInfo:true}},
  site:{label:"Site Detail", icon:"▤", note:"Home stays clean while account screens show brief and timeline.", values:{fieldFocus:false,dataSafeHome:false,siteBrief:true,siteTimeline:true,pinnedSites:true,importantSiteInfo:true}},
  minimal:{label:"Minimal", icon:"—", note:"Hide optional Home and site-detail cards for the simplest view.", values:{fieldFocus:false,dataSafeHome:false,siteBrief:false,siteTimeline:false,pinnedSites:false,importantSiteInfo:false}}
};
function activeLayoutPresetKey575(){
  const v=visibility();
  return Object.entries(LAYOUT_PRESETS_565).find(([,p])=>Object.keys(p.values).every(k=>(v[k]!==false)===(p.values[k]!==false)))?.[0] || "";
}
function layoutPresetName565(){
  const key=activeLayoutPresetKey575();
  return key ? LAYOUT_PRESETS_565[key].label : "Custom Layout";
}
function layoutPresetCards565(){
  const active=activeLayoutPresetKey575();
  return `<div class="card settingGroup compactPane layoutPresets565">
    <div class="paneHead"><div><h2>Quick Layout Presets</h2><p class="paneNote">One tap changes only the Home and account-screen layout cards. The active preset stays highlighted.</p></div><span class="layoutPresetBadge565">${esc(layoutPresetName565())}</span></div>
    <div class="layoutPresetGrid565">${Object.entries(LAYOUT_PRESETS_565).map(([key,p])=>`<button class="ghost layoutPresetBtn565 ${active===key?"presetActive575":""}" data-layout-preset="${esc(key)}" aria-pressed="${active===key?"true":"false"}"><span>${esc(p.icon)}</span><strong>${esc(p.label)}</strong><small>${esc(p.note)}</small>${active===key?`<em class="presetActiveBadge575">✓ Active</em>`:""}</button>`).join("")}</div>
  </div>`;
}
function applyLayoutPreset565(name){
  const p=LAYOUT_PRESETS_565[name];
  if(!p){ toast("Layout preset unavailable."); return; }
  const v=visibility();
  data.settings.visibility={...v,...p.values};
  data.settings.app={...(data.settings.app||{}),activeLayoutPreset575:name};
  save();
  toast(`${p.label} layout applied.`);
  settings();
}


function ensureModuleBaseline476(){
  data.settings.app = data.settings.app || {};
  if(data.settings.app.modulesBaseline476) return;
  const v=visibility();
  v.dailyRoute=true;
  v.advancedGps=true;
  if(v.fieldFocus !== false) v.fieldFocus=true;
  if(v.dataSafeHome !== false) v.dataSafeHome=true;
  if(v.siteBrief !== false) v.siteBrief=true;
  if(v.siteTimeline !== false) v.siteTimeline=true;
  if(v.pinnedSites !== false) v.pinnedSites=true;
  if(v.importantSiteInfo !== false) v.importantSiteInfo=true;
  data.settings.visibility=v;
  data.settings.app.modulesBaseline476=true;
  saveData(data);
}
ensureModuleBaseline476();


applyTheme();
document.getElementById("buildButton").addEventListener("click", showChangelog);
document.querySelectorAll("nav button").forEach(btn => btn.addEventListener("click", () => {
  const target=btn.dataset.route;
  if(target==="settings"){
    openSettingsHome572();
    return;
  }
  mode=null;
  restoreAppChrome572();
  route(target);
}));
window.addEventListener("error", e => showError(e.error || e.message));
window.addEventListener("unhandledrejection", e => showError(e.reason || e));

function save(){ saveData(data); applyTheme(); }
function site(){ return data.sites.find(s => s.id === selectedSiteId); }
function val(id){ return document.getElementById(id)?.value?.trim() || ""; }
function raw(id){ return document.getElementById(id)?.value || ""; }
function checked(id){ return !!document.getElementById(id)?.checked; }
function route(v){
  if(view === "settings") captureSettingsScroll576();
  if(settingsSubmenuReturn576 && ["diagnostics","dataTools"].includes(view) && !["diagnostics","dataTools","settings"].includes(v)) settingsSubmenuReturn576=false;
  if(v === "library" && !featureOn("library")){ toast("Library is hidden in Simple View. Turn it on in Settings → Modules."); v="home"; }
  if(v === "diagnostics" && !featureOn("diagnostics")){ toast("Diagnostics is hidden in Simple View. Turn it on in Settings → Modules."); v="settings"; }
  if((v === "report") && !featureOn("reports")){ toast("Reports are hidden in Simple View."); v="siteDetail"; }
  if(["equipmentList","equipmentForm"].includes(v) && !featureOn("equipment")){ toast("Equipment Vault is hidden in Simple View."); v="siteDetail"; }
  if((v === "nearbySites") && !featureOn("advancedGps")){ toast("Advanced GPS is hidden in Simple View."); v="home"; }
  if((v === "routeLog") && !activeRoute && !featureOn("dailyRoute")){ toast("Daily Route is hidden in Simple View."); v="home"; }
  if(settingsSubmenuReturn576 && v === "settings") settingsSubmenuReturn576=false;
  view = v; render();
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
  document.getElementById("backBtn").onclick=()=>route("siteDetail"); wireNoteTemplates503();
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
function localDayDate569(day=localDateString()){
  const parts=String(day||localDateString()).split("-").map(Number);
  if(parts.length!==3 || parts.some(n=>!Number.isFinite(n))) return new Date();
  return new Date(parts[0], parts[1]-1, parts[2]);
}
function selectedDailySummaryDay569(){
  return dailySummaryDate569 || localDateString();
}
function dailySummaryDateLabel569(day=selectedDailySummaryDay569(), opts={weekday:"long",month:"long",day:"numeric",year:"numeric"}){
  try{return localDayDate569(day).toLocaleDateString([], opts);}catch{return String(day||"Today");}
}
function setDailySummaryDay569(day){
  dailySummaryDate569 = day || localDateString();
  localStorage.setItem("firevault_daily_summary_date", dailySummaryDate569);
}
function shiftDailySummaryDay569(delta){
  const d=localDayDate569(selectedDailySummaryDay569());
  d.setDate(d.getDate()+delta);
  setDailySummaryDay569(localDateString(d));
  dailySummary();
}
function dailySummaryActivityDates571(){
  const days=new Set();
  (data.sites||[]).forEach(s=>{
    ensureSite(s);
    (s.notes||[]).forEach(n=>{ if(n?.at) days.add(localDateString(new Date(n.at))); });
    (s.tasks||[]).forEach(t=>{ if(t?.createdAt) days.add(localDateString(new Date(t.createdAt))); });
    (s.deficiencies||[]).forEach(d=>{ if(d?.createdAt) days.add(localDateString(new Date(d.createdAt))); });
  });
  (data.routeLogs||[]).forEach(r=>{
    if(r?.date) days.add(r.date);
    else if(r?.startedAt) days.add(localDateString(new Date(r.startedAt)));
  });
  if(activeRoute?.startedAt) days.add(localDateString(new Date(activeRoute.startedAt)));
  return days;
}
function dailySummaryHasActivity571(day){
  return dailySummaryActivityDates571().has(day);
}
function dailyPickerMonthLabel571(month=dailyPickerMonth571){
  const [y,m]=String(month||localDateString().slice(0,7)).split("-").map(Number);
  try{return new Date(y,m-1,1).toLocaleDateString([], {month:"long",year:"numeric"});}catch{return month;}
}
function shiftDailyPickerMonth571(delta){
  const [y,m]=String(dailyPickerMonth571||localDateString().slice(0,7)).split("-").map(Number);
  const d=new Date(y,m-1,1);
  d.setMonth(d.getMonth()+delta);
  dailyPickerMonth571=localDateString(d).slice(0,7);
  renderDailyPickerCalendar571();
}
function dailyPickerCalendarMarkup571(){
  const selected=selectedDailySummaryDay569();
  const activity=dailySummaryActivityDates571();
  const [year,month]=String(dailyPickerMonth571||selected.slice(0,7)).split("-").map(Number);
  const first=new Date(year,month-1,1);
  const startDow=first.getDay();
  const daysInMonth=new Date(year,month,0).getDate();
  const cells=[];
  for(let i=0;i<startDow;i++) cells.push(`<span class="dailyPickBlank571"></span>`);
  for(let day=1;day<=daysInMonth;day++){
    const date=`${year}-${String(month).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
    const has=activity.has(date);
    const isSelected=date===selected;
    const isToday=date===localDateString();
    cells.push(`<button class="dailyPickDay571 ${has?"hasSummary":""} ${isSelected?"selected":""} ${isToday?"today":""}" data-daily-pick="${esc(date)}"><strong>${day}</strong>${has?`<span>•</span>`:""}</button>`);
  }
  return `<div class="dailyPickCalendar571">
    <div class="dailyPickWeek571"><span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span></div>
    <div class="dailyPickGrid571">${cells.join("")}</div>
  </div>`;
}
function renderDailyPickerCalendar571(){
  const title=document.getElementById("dailyPickMonthTitle571");
  const body=document.getElementById("dailyPickBody571");
  if(title) title.textContent=dailyPickerMonthLabel571();
  if(body) body.innerHTML=dailyPickerCalendarMarkup571();
  wireDailyPickerDays571();
}
function closeDailyPicker571(){
  document.querySelector(".dailyPickOverlay571")?.remove();
}
function wireDailyPickerDays571(){
  document.querySelectorAll("[data-daily-pick]").forEach(b=>b.onclick=()=>{
    setDailySummaryDay569(b.dataset.dailyPick || localDateString());
    closeDailyPicker571();
    route("dailySummary");
  });
}
function openHomeDailyDatePicker569(){
  dailyPickerMonth571=selectedDailySummaryDay569().slice(0,7);
  document.querySelector(".dailyPickOverlay571")?.remove();
  const overlay=document.createElement("div");
  overlay.className="dailyPickOverlay571";
  overlay.innerHTML=`<div class="dailyPickSheet571" role="dialog" aria-modal="true" aria-label="Daily Summary date picker">
    <div class="dailyPickHead571">
      <div><strong>Daily Summary Date</strong><span>Bold dates have saved daily activity.</span></div>
      <button class="ghost iconBtn" id="closeDailyPick571" aria-label="Close date picker">×</button>
    </div>
    <div class="dailyPickMonthRow571">
      <button class="ghost smallBtn" id="prevDailyPickMonth571">‹</button>
      <h2 id="dailyPickMonthTitle571">${esc(dailyPickerMonthLabel571())}</h2>
      <button class="ghost smallBtn" id="nextDailyPickMonth571">›</button>
    </div>
    <div id="dailyPickBody571">${dailyPickerCalendarMarkup571()}</div>
    <div class="dailyPickActions571">
      <button class="ghost" id="dailyPickToday571">Today</button>
      <button class="ghost" id="dailyPickSelected571">Selected Date</button>
    </div>
  </div>`;
  document.body.appendChild(overlay);
  document.getElementById("closeDailyPick571").onclick=closeDailyPicker571;
  document.getElementById("prevDailyPickMonth571").onclick=()=>shiftDailyPickerMonth571(-1);
  document.getElementById("nextDailyPickMonth571").onclick=()=>shiftDailyPickerMonth571(1);
  document.getElementById("dailyPickToday571").onclick=()=>{ setDailySummaryDay569(localDateString()); closeDailyPicker571(); route("dailySummary"); };
  document.getElementById("dailyPickSelected571").onclick=()=>{ closeDailyPicker571(); route("dailySummary"); };
  overlay.addEventListener("click",e=>{ if(e.target===overlay) closeDailyPicker571(); });
  wireDailyPickerDays571();
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
function setActiveNav(){ document.querySelectorAll("nav button").forEach(b=>b.classList.remove("active")); const section=["routeLog","dailySummary","actionCenter","pinnedSites"].includes(view)?"home":(["siteDetail","visits","visitDetail","checklist","siteForm","contactsList","contactForm","siteDocs","siteDocForm","equipmentList","equipmentForm","tasks","taskForm","deficiencies","deficiencyForm","report","jobMode","nearbySites","attention"].includes(view)?"sites":view); document.getElementById("nav-"+section)?.classList.add("active"); }
function wireGlobalHeader537(){ const b=document.getElementById("headerSettingsBtn537"); if(b) b.onclick=openSettingsHome572; }
function showGlobalChrome537(){ const h=document.getElementById("appHeader"); const n=document.getElementById("appNav"); if(h){ h.style.display="flex"; h.style.visibility="visible"; h.style.opacity="1"; } if(n){ n.style.display="grid"; n.style.visibility="visible"; n.style.opacity="1"; } wireGlobalHeader537(); }

function render(){
  try{
    if(view!=="home") restoreAppChrome572();
    const routes = {home, dailySummary, routeLog, actionCenter, pinnedSites:pinnedSitesManager567, sites, nearbySites, attention:attentionQueue, siteDetail, visits, visitDetail, checklist, siteForm, contactsList, contactForm, siteDocs, siteDocForm, equipmentList, equipmentForm, tasks, taskForm, deficiencies, deficiencyForm, report, library, resourceForm, jobMode, settings, diagnostics, dataTools};
    (routes[view] || home)();
    document.body.classList.toggle("homeFullscreen480", view === "home");
    document.body.classList.toggle("homeLayoutFixed570", view === "home");
    document.body.classList.toggle("settingsChrome572", view === "settings");
    if(view !== "settings") document.body.classList.remove("settingsChrome572");
    stopJobTimer();
    applyFeatureVisibility();
    setActiveNav();
  }catch(err){ showError(err); }
}

function showError(err){
  console.error(err);
  html(`<div class="screen"><div class="card errorBox"><h1>${fireVaultBrand575()} Diagnostics</h1><p>The app caught an error instead of going black.</p><p>${esc(err?.stack || err?.message || err)}</p><button class="primary" onclick="location.reload()">Reload App</button></div></div>`);
}


function recentAccounts476(limit=5){
  return [...(data.sites||[])].sort((a,b)=>recentSiteTime476(b)-recentSiteTime476(a)).slice(0,limit);
}
function recentSiteTime476(s){
  const visits=Array.isArray(s.visits)?s.visits:[];
  const times=[s.lastOpenedAt,s.updatedAt,s.createdAt].concat(visits.flatMap(v=>[v.endedAt,v.startedAt,v.date])).filter(Boolean).map(x=>new Date(x).getTime()).filter(Number.isFinite);
  return times.length ? Math.max(...times) : 0;
}
function siteSearchText476(s){
  ensureSite(s);
  return [s.name,fullAddress(s),s.panelManufacturer,s.panelModel,s.notes,(s.contacts||[]).map(c=>[c.name,c.role,c.phone,c.email,c.accessNotes].join(' ')).join(' '),(s.equipment||[]).map(e=>[e.type,e.model,e.location,e.notes].join(' ')).join(' ')].join(' ').toLowerCase();
}
function homeSearchMatches476(){
  const q=(siteSearch||'').trim().toLowerCase();
  if(!q) return recentAccounts476(5);
  return (data.sites||[]).filter(s=>siteSearchText476(s).includes(q)).slice(0,8);
}
function siteSubline476(s){
  const parts=[];
  const addr=fullAddress(s); if(addr && addr!=="No address entered") parts.push(addr);
  const panel=[s.panelManufacturer,s.panelModel].filter(Boolean).join(' '); if(panel) parts.push(panel);
  if(hasGps(s)) parts.push('GPS saved');
  return parts.join(' • ') || 'No address or panel entered';
}
function siteActivityLine476(s){
  const open=(s.tasks||[]).filter(t=>!taskIsDone(t)).length;
  const def=(s.deficiencies||[]).filter(d=>(d.status||'Open')!=='Closed').length;
  const visits=(s.visits||[]).length;
  const bits=[];
  if(open) bits.push(`${open} open task${open===1?'':'s'}`);
  if(def) bits.push(`${def} deficienc${def===1?'y':'ies'}`);
  if(visits) bits.push(`${visits} visit${visits===1?'':'s'}`);
  return bits.join(' • ') || 'Ready';
}
function homeAccountRowsMarkup476(){
  const q=(siteSearch||'').trim();
  const rows=homeSearchMatches476();
  const title=q?'Search Results':'Recent Accounts';
  const empty=q?'No matching accounts found.':'No recent accounts yet.';
  return `<div class="homeAccountSection476"><div class="homeSectionHead476"><strong>${title}</strong><span>${rows.length} account${rows.length===1?'':'s'}</span></div>${rows.length?rows.map(s=>`<button class="homeAccountCard476" data-home-site="${esc(s.id)}"><span class="accountInitial476">${esc((s.name||'?').slice(0,1).toUpperCase())}</span><span><strong>${esc(s.name||'Unnamed Site')}</strong><small>${esc(siteSubline476(s))}</small><em>${esc(siteActivityLine476(s))}</em></span></button>`).join(''):`<div class="empty homeEmpty476">${empty}</div>`}</div>`;
}

function homeRecentRowsOnly486(){
  const rows=recentAccounts476(5);
  return rows.length?rows.map(s=>`<button class="homeAccountCard476 homeRecentRow486" data-home-site="${esc(s.id)}"><span class="accountInitial476">${esc((s.name||'?').slice(0,1).toUpperCase())}</span><span><strong>${esc(s.name||'Unnamed Site')}</strong><small>${esc(siteSubline476(s))}</small><em>${esc(siteActivityLine476(s))}</em></span></button>`).join(''):`<div class="empty homeEmpty476">No recent accounts yet. Open a customer account and it will appear here.</div>`;
}
function homeNearbyTitle486(){
  if(!featureOn('advancedGps')) return 'GPS module disabled';
  if(!data.sites.some(hasGps)) return 'No GPS accounts saved';
  if(nearbyState) return `Last check ${new Date(nearbyState.at).toLocaleTimeString([], {hour:"numeric",minute:"2-digit"})} • GPS ±${nearbyState.accuracy||0}m`;
  return `${data.sites.filter(hasGps).length} GPS-ready account${data.sites.filter(hasGps).length===1?'':'s'}`;
}
function homeNearbyMarkup476(){
  if(!featureOn('advancedGps')) return '';
  if(!data.sites.some(hasGps)) return `<div class="homeNearbyEmpty476"><p>No GPS-saved accounts yet. Open a customer account and capture GPS first.</p></div>`;
  if(!nearbyState) return `<div class="homeNearbyEmpty476"><p>Check your current location and FireVault will surface nearby customer accounts.</p></div>`;
  const rows=gpsSiteDistances(nearbyState.lat, nearbyState.lng).slice(0,4);
  return rows.length?rows.map(r=>`<button class="nearbyAccountCard476" data-home-site="${esc(r.s.id)}"><span>⌖</span><strong>${esc(r.s.name||'Unnamed Site')}</strong><small>${esc(distanceLabel(r.meters))} away • ${esc(fullAddress(r.s))}</small></button>`).join(''):`<div class="homeNearbyEmpty476"><p>No saved GPS accounts found near this location.</p></div>`;
}
function renderHomeSearch476(){
  const box=document.getElementById('homeSearchResults476');
  const root=document.querySelector('.homeScreen476');
  const q=(siteSearch||'').trim();
  if(root) root.classList.toggle('homeSearchMode484', !!q);
  if(!box) return;
  box.classList.toggle('hiddenSearchResults478', !q);
  box.classList.toggle('card', !!q);
  box.innerHTML=q?homeAccountRowsMarkup476():'';
}
function checkNearbyHome476(){
  if(data.settings.gps?.enabled===false){ toast('GPS tools are hidden in Settings.'); return; }
  if(!navigator.geolocation){ toast('GPS is not available in this browser.'); return; }
  if(!data.sites.some(hasGps)){ toast('No GPS-saved accounts yet.'); return; }
  toast('Checking nearby accounts...');
  navigator.geolocation.getCurrentPosition(pos=>{
    nearbyState={lat:Number(pos.coords.latitude.toFixed(6)),lng:Number(pos.coords.longitude.toFixed(6)),accuracy:Math.round(pos.coords.accuracy||0),at:new Date().toISOString()};
    home();
  },err=>toast('Nearby check failed: ' + (err.message || 'permission denied')),gpsOptions());
}
function moduleStatus476(){
  const visible=FEATURE_LABELS.filter(([k])=>featureOn(k)).length;
  return `${visible} module${visible===1?'':'s'} visible`;
}

function isHomeScreenMode482(){
  return window.matchMedia?.("(display-mode: standalone)")?.matches || window.navigator.standalone === true;
}
function homeInstallTip482(){
  if(isHomeScreenMode482() || homeInstallTipHidden) return "";
  return `<div class="homeInstallTip482"><div><strong>Full-screen mode</strong><span>Open FireVault from your iPhone Home Screen to remove Safari bars.</span></div><button class="ghost smallBtn" id="homeInstallHow482">How</button><button class="ghost smallBtn" id="homeInstallHide482">Hide</button></div>`;
}


function todayNoteRows500(){
  const today=localDateString();
  const rows=[];
  (data.sites||[]).forEach(s=>{
    ensureSite(s);
    const notes=todaySiteNoteEntries506(s,today);
    if(notes.length) rows.push({s,notes});
  });
  return rows.sort((a,b)=>String(a.s.name||"").localeCompare(String(b.s.name||"")));
}
function todayAccounts500(){
  const map=new Map();
  todayNoteRows500().forEach(r=>map.set(r.s.id,{s:r.s,reason:`${r.notes.length} note${r.notes.length===1?"":"s"}`}));
  const today=localDateString();
  const routeEvents=[...(activeRoute?.events||[]), ...((data.routeLogs||[]).filter(l=>(l.date||"")===today || (l.startedAt||"").slice(0,10)===today).flatMap(l=>l.events||[]))];
  routeEvents.forEach(e=>{
    if(e.siteId){
      const s=data.sites.find(x=>x.id===e.siteId);
      if(s && !map.has(s.id)) map.set(s.id,{s,reason:"Route stop"});
    }
  });
  return [...map.values()].slice(0,5);
}
function dashboardSummary500(){
  const notes=todayNoteRows500();
  const noteCount=notes.reduce((n,r)=>n+r.notes.length,0);
  const routeCount=(activeRoute?.events||[]).length;
  const openTasks=allTaskRows().filter(r=>!taskIsDone(r.t)).length;
  const openDef=data.sites.reduce((n,s)=>n+(s.deficiencies||[]).filter(d=>(d.status||"Open")!=="Closed").length,0);
  return {notes:noteCount,noteSites:notes.length,route:routeCount,tasks:openTasks,def:openDef};
}
function todayAccountsMarkup500(){
  const rows=todayAccounts500();
  if(!rows.length) return `<div class="empty todayAccountsEmpty500">No account activity yet today.</div>`;
  return rows.map(({s,reason})=>`<button class="todayAccountRow500" data-home-site="${esc(s.id)}"><span>${esc((s.name||"?").slice(0,1).toUpperCase())}</span><div><strong>${esc(s.name||"Unnamed Account")}</strong><small>${esc(fullAddress(s)||"No address saved")}</small></div><em>${esc(reason)}</em></button>`).join("");
}

function legacyNoteBlocks506(s){
  return String(s?.notes || "").split(/\n\s*\n/).map(n=>n.trim()).filter(Boolean);
}
function parseLegacyNoteBlock506(block, index=0, fallbackAt=""){
  const match=String(block||"").match(/^\[([^\]]+)\]\s*([\s\S]*)$/);
  return {
    id:`legacy-${index}`,
    at:index===0 ? fallbackAt : "",
    label:match ? match[1] : (fallbackAt ? new Date(fallbackAt).toLocaleString([], {month:"short",day:"numeric",hour:"numeric",minute:"2-digit"}) : "Saved note"),
    text:(match ? match[2] : block || "Note saved.").trim()
  };
}
function siteNoteEntries506(s){
  ensureSite(s);
  const entries=Array.isArray(s.noteEntries) ? s.noteEntries.filter(n=>String(n?.text||"").trim()).map(n=>({
    id:n.id || uid(),
    at:n.at || n.createdAt || n.date || "",
    label:n.at ? new Date(n.at).toLocaleString([], {month:"short",day:"numeric",hour:"numeric",minute:"2-digit"}) : "Saved note",
    text:String(n.text||"").trim()
  })) : [];
  if(entries.length) return entries.sort((a,b)=>String(b.at||"").localeCompare(String(a.at||"")));
  return legacyNoteBlocks506(s).map((block,i)=>parseLegacyNoteBlock506(block,i,s.lastNoteAt||""));
}
function todaySiteNoteEntries506(s, day=localDateString()){
  ensureSite(s);
  const entries=siteNoteEntries506(s).filter(n=>n.at && sameLocalDay499(n.at,day));
  if(entries.length) return entries;
  if(sameLocalDay499(s.lastNoteAt,day)) return siteNoteEntries506(s).slice(0,1);
  return [];
}
function siteNotePreview506(s, day=localDateString()){
  const notes=todaySiteNoteEntries506(s,day);
  const entry=notes[0] || siteNoteEntries506(s)[0];
  return entry ? entry.text.replaceAll("\n"," / ") : "Note saved.";
}
function noteEntryTimeLabel506(entry){
  if(entry?.at){
    try{return new Date(entry.at).toLocaleTimeString([], {hour:"numeric",minute:"2-digit"});}catch{}
  }
  return entry?.label || "Saved note";
}
function siteNotesCopyText506(s){
  const notes=siteNoteEntries506(s);
  const body=notes.length ? notes.map(n=>`[${n.label || noteEntryTimeLabel506(n)}] ${n.text}`).join("\n\n") : "No notes entered.";
  return `${s.name||"Site"}\n${fullAddress(s)||""}\n\nSITE NOTES\n\n${body}`.trim();
}
function setSiteNoteDraft506(prefix=""){
  const target=document.getElementById("siteNoteText");
  if(!target) return;
  const current=target.value.trim();
  if(prefix && !current) target.value=prefix;
  else if(prefix && current && !current.endsWith(prefix.trim())) target.value=`${current}\n${prefix}`;
  target.dispatchEvent(new Event("input", {bubbles:true}));
  target.focus({preventScroll:false});
  try{ target.setSelectionRange(target.value.length,target.value.length); }catch{}
}


function siteNoteDraftKey508(s){
  return `firevault_site_note_draft_${s?.id || selectedSiteId || "current"}`;
}
function loadSiteNoteDraft508(s){
  try{return localStorage.getItem(siteNoteDraftKey508(s)) || "";}catch{return "";}
}
function saveSiteNoteDraft508(s,text){
  try{
    const key=siteNoteDraftKey508(s);
    const clean=String(text||"");
    if(clean.trim()) localStorage.setItem(key,clean);
    else localStorage.removeItem(key);
  }catch{}
}
function clearSiteNoteDraft508(s){
  try{localStorage.removeItem(siteNoteDraftKey508(s));}catch{}
}
function siteNoteDraftRows508(){
  return (data.sites||[]).map(s=>({s,draft:loadSiteNoteDraft508(s).trim()})).filter(r=>r.draft);
}
function siteNoteDraftStatus508(s){
  const draft=loadSiteNoteDraft508(s).trim();
  return draft ? `Draft autosaved • ${draft.length} character${draft.length===1?"":"s"}` : "Draft autosaves while you type";
}

function noteTemplatesMarkup503(){
  const groups={};
  NOTE_TEMPLATES_503.forEach(t=>{
    const cat=t.length===3?t[0]:"General";
    const name=t.length===3?t[1]:t[0];
    const text=t.length===3?t[2]:t[1];
    groups[cat]=groups[cat]||[];
    groups[cat].push({name,text});
  });
  return `<div class="noteTemplateGroups504">${Object.entries(groups).map(([cat,items])=>`<div class="noteTemplateGroup504"><div class="noteTemplateGroupTitle504">${esc(cat)}</div><div class="noteTemplateGrid503">${items.map(item=>`<button class="ghost noteTemplateBtn503 noteTemplateBtn504" data-template="${esc(item.text)}"><strong>${esc(item.name)}</strong><span>＋</span></button>`).join("")}</div></div>`).join("")}</div>`;
}
function wireNoteTemplates503(targetId="siteNoteText"){
  document.querySelectorAll(".noteTemplateBtn503").forEach(btn=>{
    btn.onclick=()=>{
      const target=document.getElementById(targetId) || document.querySelector("#noteText") || document.querySelector("#notes") || document.querySelector("textarea");
      if(!target){ toast("Open the note composer first."); return; }
      const text=btn.dataset.template || "";
      const current=target.value.trim();
      target.value=current ? `${current}\n${text}` : text;
      target.dispatchEvent(new Event("input", {bubbles:true}));
      target.focus({preventScroll:true});
      try{ target.setSelectionRange(target.value.length, target.value.length); }catch{}
      toast("Template added.");
    };
  });
}


/* Build 0.50.75 Pinned Sites helpers */
function isPinnedSite566(s){ return !!s?.pinnedAt; }
function pinnedSites566(limit=5){
  return [...(data.sites||[])].filter(isPinnedSite566).sort((a,b)=>{
    const pa=new Date(b.pinnedAt||0).getTime();
    const pb=new Date(a.pinnedAt||0).getTime();
    return (Number.isFinite(pa)?pa:0)-(Number.isFinite(pb)?pb:0) || (a.name||"").localeCompare(b.name||"");
  }).slice(0,limit);
}
function pinnedSitesText566(){
  const rows=pinnedSites566(20);
  const lines=[
    "FireVault Pinned Sites",
    `Build: ${BUILD}`,
    `Date: ${new Date().toLocaleString()}`,
    "",
    rows.length ? "Pinned Accounts:" : "No pinned accounts yet."
  ];
  rows.forEach((s,i)=>{
    lines.push(`${i+1}. ${s.name||"Unnamed Account"}`);
    const addr=fullAddress(s);
    if(addr && addr!=="No address entered") lines.push(`   ${addr}`);
    const activity=siteActivityLine476(s);
    if(activity) lines.push(`   ${activity}`);
  });
  return lines.join("\n");
}
async function copyPinnedSites566(){
  try{
    await navigator.clipboard.writeText(pinnedSitesText566());
    toast("Pinned sites copied.");
  }catch{
    toast("Clipboard unavailable.");
  }
}
function pinnedSitesMarkup566(){
  const all=[...(data.sites||[])].filter(isPinnedSite566);
  const rows=pinnedSites566(5);
  if(!rows.length) return "";
  const collapsed=homeCardCollapsed5100("pinnedSites");
  return `<div class="card pinnedSites566 homeCollapsible5100 ${collapsed?"homeCollapsed5100":""}" data-home-collapsible="pinnedSites">
    <div class="pinnedSitesHead566"><div><strong>Pinned Sites</strong><span>${all.length} pinned • ${rows.length} shown</span></div><div class="pinnedHeadActions567 homeHeaderActions5100"><button class="ghost smallBtn" id="openPinnedSites567">All</button><button class="ghost smallBtn" id="copyPinnedSites566">Copy</button>${homeCollapseButton5100("pinnedSites","Pinned Sites")}</div></div>
    <div class="pinnedSitesList566 homeCollapseBody5100" data-home-collapse-body ${collapsed?"hidden":""}>${rows.map(s=>`<button class="pinnedSite566" data-home-site="${esc(s.id)}"><span>★</span><div><strong>${esc(s.name||"Unnamed Account")}</strong><small>${esc(siteSubline476(s))}</small><em>${esc(siteActivityLine476(s))}</em></div></button>`).join("")}</div>
  </div>`;
}
function toggleSitePinned566(){
  const s=site(); if(!s) return;
  if(s.pinnedAt){
    delete s.pinnedAt;
    toast("Site unpinned.");
  }else{
    s.pinnedAt=new Date().toISOString();
    toast("Site pinned to Home.");
  }
  s.updatedAt=new Date().toISOString();
  save();
  siteDetail();
}

/* Build 0.50.75 Pinned Sites Manager */
function unpinSiteById567(id){
  const s=(data.sites||[]).find(x=>x.id===id);
  if(!s) return;
  delete s.pinnedAt;
  s.updatedAt=new Date().toISOString();
  save();
  toast("Site unpinned.");
  pinnedSitesManager567();
}
function unpinAllSites567(){
  const rows=(data.sites||[]).filter(isPinnedSite566);
  if(!rows.length){ toast("No pinned sites."); return; }
  if(!confirm(`Unpin ${rows.length} site${rows.length===1?"":"s"} from Home?`)) return;
  rows.forEach(s=>{ delete s.pinnedAt; s.updatedAt=new Date().toISOString(); });
  save();
  toast("Pinned sites cleared.");
  pinnedSitesManager567();
}
function pinnedSiteManagerRow567(s){
  const health=siteHealth(s);
  return `<div class="card pinnedManagerRow567">
    <button class="pinnedManagerOpen567" data-pinned-open="${esc(s.id)}">
      <span>★</span>
      <div><strong>${esc(s.name||"Unnamed Account")}</strong><small>${esc(siteSubline476(s))}</small><em>${esc(siteActivityLine476(s))}</em></div>
    </button>
    <div class="pinnedManagerMeta567">
      <span class="${esc(health.cls)}">${health.score}%</span>
      <small>${s.pinnedAt?`Pinned ${new Date(s.pinnedAt).toLocaleDateString([], {month:"short",day:"numeric"})}`:"Pinned"}</small>
    </div>
    <div class="pinnedManagerActions567">
      <button class="ghost smallBtn" data-pinned-open="${esc(s.id)}">Open</button>
      <button class="ghost smallBtn" data-pinned-navigate="${esc(s.id)}">Map</button>
      <button class="danger smallBtn" data-pinned-unpin="${esc(s.id)}">Unpin</button>
    </div>
  </div>`;
}
function pinnedSitesManager567(){
  const rows=pinnedSites566(100);
  const withGps=rows.filter(hasGps).length;
  const openTasks=rows.reduce((n,s)=>n+(s.tasks||[]).filter(t=>!taskIsDone(t)).length,0);
  const openDef=rows.reduce((n,s)=>n+(s.deficiencies||[]).filter(d=>(d.status||"Open")!=="Closed").length,0);
  html(`<div class="screen pinnedManagerScreen567">
    <div class="row pinnedManagerTop567"><button class="back ghost" id="backHome567">←</button><div><h1>Pinned Sites</h1><p>High-use customer account shortcuts.</p></div><button class="ghost smallBtn" id="copyPinsManager567">Copy</button></div>
    <div class="card pinnedManagerHero567">
      <div><h2>${rows.length} pinned account${rows.length===1?"":"s"}</h2><p>${withGps} GPS-ready • ${openTasks} open task${openTasks===1?"":"s"} • ${openDef} open deficienc${openDef===1?"y":"ies"}</p></div>
      <span>★</span>
    </div>
    ${rows.length?`<div class="pinnedManagerList567">${rows.map(pinnedSiteManagerRow567).join("")}</div><button class="danger pinnedClear567" id="clearPinnedSites567">Unpin All</button>`:`<div class="card empty pinnedEmpty567"><h2>No pinned sites yet</h2><p>Open any account and tap the star in the account header to pin it to Home.</p><button class="primary" id="openSitesFromPins567">Open Accounts</button></div>`}
  </div>`);
  document.getElementById("backHome567").onclick=()=>route("home");
  const copy=document.getElementById("copyPinsManager567"); if(copy) copy.onclick=copyPinnedSites566;
  const clear=document.getElementById("clearPinnedSites567"); if(clear) clear.onclick=unpinAllSites567;
  const openSites=document.getElementById("openSitesFromPins567"); if(openSites) openSites.onclick=()=>route("sites");
  document.querySelectorAll("[data-pinned-open]").forEach(b=>b.onclick=()=>{ selectedSiteId=b.dataset.pinnedOpen; route("siteDetail"); });
  document.querySelectorAll("[data-pinned-unpin]").forEach(b=>b.onclick=()=>unpinSiteById567(b.dataset.pinnedUnpin));
  document.querySelectorAll("[data-pinned-navigate]").forEach(b=>b.onclick=()=>{
    const s=(data.sites||[]).find(x=>x.id===b.dataset.pinnedNavigate);
    if(!s) return;
    window.open(mapUrl(s, data.settings.gps?.mapProvider || "apple"), "_blank");
  });
}


function home(){
  const taskRows = allTaskRows();
  const taskCounts = taskFilterCounts(taskRows);
  const openTasks = taskCounts.open;
  const def = data.sites.reduce((n,s)=>n+(s.deficiencies||[]).filter(d => (d.status||"Open") !== "Closed").length,0);
  const gpsSites = data.sites.filter(hasGps).length;
  const visits = data.sites.flatMap(s => (s.visits||[]).map(v => ({...v, site:s.name})));
  const weekAgo = Date.now() - 7*24*60*60*1000;
  const recentVisits = visits.filter(v=>new Date(v.endedAt||v.startedAt||v.date||0).getTime() >= weekAgo).length;
  const now = new Date();
  const dateLine = now.toLocaleDateString([], {weekday:"long", month:"long", day:"numeric"});
  html(`<div class="screen homeScreen476 homeScreen478 homeMilestone5100 ${siteSearch?"homeSearchMode484":""}">
    <div class="homeChrome478 homeChrome493">
      <div class="brand478 brand493"><img src="assets/favicon.png?v=${BUILD}" alt="FireVault"><strong>${fireVaultBrand575("homeWordmark575")}</strong></div>
      <button class="homeBuildPill481 homeBuildPill493" id="homeBell478" aria-label="Release notes"><span></span>${BUILD}</button>
      <button class="homeIcon478 settingsIcon493 stackedMenu553" id="modulesTopBtn476" aria-label="Settings">☰</button>
    </div>

    ${homeInstallTip482()}

    <div class="todayBlock478 todayBlock551 todayBlock569">
      <button class="todayRouteWrap478 todayDateButton569" id="todayDatePickerBtn569" aria-label="Open Daily Summary date picker">${activeRoute?`<span class="${activeRoute.paused?"routeLed470 routeLedPaused470":"routeLed463"}" aria-label="${activeRoute.paused?"Daily route paused":"Daily route recording"}"></span>`:""}<div><h1>Today</h1><p>${esc(dateLine)}</p><em>Tap for past daily reports</em></div></button>
      <button class="todayAddSite551" id="addSiteBtn" aria-label="Add Site">＋</button>
    </div>

    <div class="appleSearchCard478">
      <div class="homeSearchBox476 homeSearchBox478 homeSearchConcept501"><span class="searchGlass478" aria-hidden="true">⌕</span><input id="homeCustomerSearch476" type="search" value="${esc(siteSearch)}" placeholder="" autocomplete="off"><span class="searchDivider501" aria-hidden="true"></span><button class="ghost smallBtn searchClear478 clearConcept501" id="clearHomeSearch476" type="button">Clear</button></div>
    </div>

    ${siteSearch?`<div class="card searchResultsPanel478" id="homeSearchResults476">${homeAccountRowsMarkup476()}</div>`:`<div id="homeSearchResults476" class="searchResultsPanel478 hiddenSearchResults478"></div>`}

    ${!siteSearch && featureOn("pinnedSites")?pinnedSitesMarkup566():""}
    ${!siteSearch && featureOn("fieldFocus")?fieldFocusMarkup561():""}

    ${!siteSearch?`<div class="fieldDashboard500">
      <div class="fieldDashHead500"><div><strong>Field Dashboard</strong><span>Site notes, route, and daily summary</span></div><button class="ghost smallBtn" id="dailySummaryBtn500">Summary</button></div>
      <div class="fieldDashStats500">
        <button class="fieldStat500" id="dashNotes500"><strong>${dashboardSummary500().notes}</strong><span>Notes Today</span></button>
        <button class="fieldStat500" id="dashAccounts500"><strong>${dashboardSummary500().noteSites}</strong><span>Note Sites</span></button>
        <button class="fieldStat500" id="dashRoute500"><strong>${dashboardSummary500().route}</strong><span>Route Points</span></button>
      </div>
      <div class="fieldDashActions500">
        <button class="primary" id="quickAccountNote500">＋ Site Note</button>
        <button class="ghost" id="openRoute500">Daily Route</button>
        <button class="ghost" id="copySummary500">Copy Summary</button>
      </div>
    </div>
    <div class="todayAccountsPanel500">
      <div class="recentHead478"><div><strong>Today’s Accounts</strong><span>Notes and route activity</span></div><button class="ghost smallBtn" id="allTodayAccounts500">All Sites</button></div>
      <div class="todayAccountsList500">${todayAccountsMarkup500()}</div>
    </div>`:""}

    <div class="homeUtilityGrid5100 ${featureOn("advancedGps")?"":"homeUtilityNoGps5100"}">
      <div class="card nearbyAccountsHero476 nearbyAccountsHero478 homeCollapsible5100 ${homeCardCollapsed5100("nearbyAccounts")?"homeCollapsed5100":""} ${featureOn("advancedGps")?"":"featureHidden472"}" data-home-collapsible="nearbyAccounts">
        <div class="nearbyHead476 nearbyHead478"><div><h2>Nearby Accounts</h2><p>${homeNearbyTitle486()}</p></div><div class="homeHeaderActions5100"><button class="smallBtn nearbyCount478" id="checkNearbyHomeBtn476">${nearbyState?"Refresh":"Check"}</button>${homeCollapseButton5100("nearbyAccounts","Nearby Accounts")}</div></div>
        <div class="nearbyList476 nearbyList478 homeCollapseBody5100" data-home-collapse-body ${homeCardCollapsed5100("nearbyAccounts")?"hidden":""}>${homeNearbyMarkup476()}</div>
      </div>

      <div class="grid2 appleStats478">
        <button class="card tile statTile478" id="visitsCard478"><strong>${recentVisits}</strong><span>Recent Visits</span><em>This Week</em></button>
        <button class="card tile statTile478" id="tasksCard"><strong>${openTasks}</strong><span>Open Tasks</span><em>${taskCounts.overdue ? `${taskCounts.overdue} overdue` : taskCounts.today ? `${taskCounts.today} due soon` : "Due Soon"}</em></button>
      </div>
    </div>

    ${activeRoute ? `<div class="card activeRouteMini468 activeRouteMini476 activeRouteMini478 ${activeRoute.paused?"activeRoutePaused470":""}"><div class="activeRouteHead468"><div><h2><span class="${activeRoute.paused?"routeLed470 routeLedPaused470":"routeLed463"} miniLed468"></span>${activeRoute.paused?"Daily Route Paused":"Daily Route Recording"}</h2><p>${esc(routeSummaryLine(activeRoute))}</p></div><button class="primary smallBtn" id="openRouteMiniBtn">Open</button></div><div class="activeRouteStats468"><div><strong>${(activeRoute.events||[]).length}</strong><span>Waypoints</span></div><div><strong>${routeDuration(activeRoute.startedAt)}</strong><span>Time</span></div><div><strong>${esc(routeDistanceLabel(activeRoute))}</strong><span>Distance</span></div></div><div class="activeRouteActions468"><button class="ghost smallBtn" id="homeRoutePointBtn" ${activeRoute.paused?"disabled":""}>Waypoint</button><button class="ghost smallBtn" id="homeRouteNearestBtn" ${activeRoute.paused?"disabled":""}>Nearest</button><button class="${activeRoute.paused?"primary":"ghost"} smallBtn" id="homeRoutePauseBtn">${activeRoute.paused?"Resume":"Pause"}</button><button class="danger smallBtn" id="homeRouteEndBtn">End / Save</button></div></div>` : ""}
    ${activeJob ? `<div class="card activeJobMini activeJobMini478"><div class="row"><div><h2>Service Call Active</h2><p>${esc(activeJob.siteName)} • <span id="jobElapsed">${elapsedText(activeJob.startedAt)}</span></p></div><button class="primary" id="resumeJobBtn">Open</button></div></div>` : ""}

    <div class="recentAccountsPanel478 homeCollapsible5100 ${homeCardCollapsed5100("recentAccounts")?"homeCollapsed5100":""}" data-home-collapsible="recentAccounts">
      <div class="recentHead478"><div><strong>Recent Accounts</strong><span>${recentAccounts476(5).length} account${recentAccounts476(5).length===1?"":"s"}</span></div><div class="homeHeaderActions5100"><button class="ghost smallBtn" id="allAccountsBtn478">See All</button>${homeCollapseButton5100("recentAccounts","Recent Accounts")}</div></div>
      <div class="recentList478 recentList486 homeCollapseBody5100" data-home-collapse-body ${homeCardCollapsed5100("recentAccounts")?"hidden":""}>${homeRecentRowsOnly486()}</div>
    </div>

    <button class="card dailySummaryCard499" id="dailySummaryBtn499"><div><strong>Daily Summary</strong><span>${dailySummaryLine499()}</span></div><em>Open</em></button>
    ${featureOn("dataSafeHome")?dataSafeCard560():""}
    <div class="homeModuleSummary476 homeModuleSummary478"><button class="ghost" id="manageModulesBtn476"><strong>Modules</strong><span>${esc(moduleStatus476())}</span></button><button class="ghost" id="defCard"><strong>${def}</strong><span>Deficiencies</span></button></div>
    <div class="buildRevisionSpacer475" aria-hidden="true"></div>
  </div>`);

  const homeRoot=document.querySelector('.homeScreen476');
  if(homeRoot) homeRoot.onclick=e=>{ const card=e.target.closest('[data-home-site]'); if(card){ selectedSiteId=card.dataset.homeSite; route('siteDetail'); } };
  wireHomeCollapsibles5100();
  const search=document.getElementById('homeCustomerSearch476');
  if(search){ search.oninput=()=>{ siteSearch=search.value; renderHomeSearch476(); }; }
  const clear=document.getElementById('clearHomeSearch476'); if(clear) clear.onclick=()=>{ siteSearch=''; const search=document.getElementById('homeCustomerSearch476'); if(search){ search.value=''; search.focus({preventScroll:true}); } renderHomeSearch476(); };
  const checkNearby=document.getElementById('checkNearbyHomeBtn476'); if(checkNearby) checkNearby.onclick=checkNearbyHome476;
  document.getElementById('modulesTopBtn476').onclick=()=>{mode=null; route('settings');};
  const bell=document.getElementById('homeBell478'); if(bell) bell.onclick=showChangelog;
  const installHow=document.getElementById('homeInstallHow482'); if(installHow) installHow.onclick=()=>alert('To get the clean full-screen FireVault view on iPhone: tap Share, choose Add to Home Screen, then open FireVault from the new Home Screen icon.');
  const installHide=document.getElementById('homeInstallHide482'); if(installHide) installHide.onclick=()=>{homeInstallTipHidden=true; localStorage.setItem('firevault_home_install_tip_hidden','1'); home();};
  const todayDateBtn569=document.getElementById('todayDatePickerBtn569'); if(todayDateBtn569) todayDateBtn569.onclick=openHomeDailyDatePicker569;
  requestAnimationFrame(()=>{ const hs=document.querySelector('.homeScreen476'); if(hs){ try{ hs.scrollTop=0; hs.scrollTo(0,0); }catch{} } try{ window.scrollTo(0,0); }catch{} });
  const dailySummaryBtn499=document.getElementById('dailySummaryBtn499'); if(dailySummaryBtn499) dailySummaryBtn499.onclick=()=>{ setDailySummaryDay569(localDateString()); route('dailySummary'); };
  document.getElementById('manageModulesBtn476').onclick=()=>{settingsTab='visibility'; mode='settingsDetail'; route('settings');};
  const allAccounts=document.getElementById('allAccountsBtn478'); if(allAccounts) allAccounts.onclick=()=>route('sites');
  const visitsCard=document.getElementById('visitsCard478'); if(visitsCard) visitsCard.onclick=()=>{selectedSiteId=null; route('sites');};
  document.getElementById('tasksCard').onclick=()=>{selectedSiteId=null; route('tasks');};
  document.getElementById('defCard').onclick=()=>{selectedSiteId=null; route('deficiencies');};
  document.getElementById('addSiteBtn').onclick=()=>{selectedSiteId=null; mode=null; route('siteForm');};
  const dataToolsHome560=document.getElementById('dataToolsHome560'); if(dataToolsHome560) dataToolsHome560.onclick=()=>route('dataTools');
  const copyPins566=document.getElementById('copyPinnedSites566'); if(copyPins566) copyPins566.onclick=copyPinnedSites566;
  const openPins567=document.getElementById('openPinnedSites567'); if(openPins567) openPins567.onclick=()=>route('pinnedSites');
  wireFieldFocus561();
  const openRouteMini=document.getElementById('openRouteMiniBtn'); if(openRouteMini) openRouteMini.onclick=()=>route('routeLog');
  const homeRoutePoint=document.getElementById('homeRoutePointBtn'); if(homeRoutePoint) homeRoutePoint.onclick=()=>{ const note=prompt('Waypoint note', 'Manual waypoint')||'Manual waypoint'; addRouteEvent('Waypoint', note); };
  const homeRouteNearest=document.getElementById('homeRouteNearestBtn'); if(homeRouteNearest) homeRouteNearest.onclick=checkRouteNearestSite;
  const homeRoutePause=document.getElementById('homeRoutePauseBtn'); if(homeRoutePause) homeRoutePause.onclick=()=> activeRoute?.paused ? resumeRouteDay() : pauseRouteDay();
  const homeRouteEnd=document.getElementById('homeRouteEndBtn'); if(homeRouteEnd) homeRouteEnd.onclick=()=>{ if(confirm('End and save today’s route?')) endRouteDay(); };
  const rb=document.getElementById('resumeJobBtn'); if(rb) rb.onclick=()=>{selectedSiteId=activeJob.siteId; route('jobMode');};
}


function sameLocalDay499(iso, day=localDateString()){
  if(!iso) return false;
  try{return localDateString(new Date(iso))===day;}catch{return false;}
}
function todayRouteLogs499(day=localDateString()){
  const saved=(data.routeLogs||[]).filter(log=>(log.date===day)||sameLocalDay499(log.startedAt,day));
  return (activeRoute && day===localDateString()) ? [activeRoute, ...saved.filter(log=>log.id!==activeRoute.id)] : saved;
}
function dailySummaryStats499(day=selectedDailySummaryDay569()){
  const noteRows=(data.sites||[]).map(s=>({s,notes:todaySiteNoteEntries506(s,day)})).filter(r=>r.notes.length);
  const notesSites=noteRows.map(r=>r.s);
  const noteCount=noteRows.reduce((n,r)=>n+r.notes.length,0);
  const openTasks=allTaskRows().filter(r=>!taskIsDone(r.t));
  const tasksToday=allTaskRows().filter(r=>sameLocalDay499(r.t.createdAt,day));
  const defsToday=(data.sites||[]).flatMap(s=>(s.deficiencies||[]).map(d=>({s,d}))).filter(r=>sameLocalDay499(r.d.createdAt,day));
  const routes=todayRouteLogs499(day);
  const routePoints=routes.reduce((n,r)=>n+(r.events||[]).length,0);
  const routeSites=[...new Set(routes.flatMap(r=>(r.events||[]).map(e=>e.siteName).filter(Boolean)))];
  return {day,noteRows,noteCount,notesSites,openTasks,tasksToday,defsToday,routes,routePoints,routeSites};
}
function dailyReportReadyItems508(st){
  const drafts=siteNoteDraftRows508();
  const items=[];
  if(st.noteCount) items.push({kind:"ok",label:"Site notes saved",detail:`${st.noteCount} note${st.noteCount===1?"":"s"} across ${st.notesSites.length} site${st.notesSites.length===1?"":"s"}.`});
  else items.push({kind:"warn",label:"No site notes yet",detail:"Add quick site notes before copying the final daily report."});
  if(drafts.length) items.push({kind:"warn",label:"Unsaved note drafts",detail:`${drafts.length} site draft${drafts.length===1?"":"s"} should be saved or cleared.`});
  else items.push({kind:"ok",label:"No unsaved drafts",detail:"Site note composer drafts are clear."});
  if(activeRoute) items.push({kind:"warn",label:"Route still active",detail:"Save the Daily Route when the day is complete."});
  else if(st.routes.length) items.push({kind:"ok",label:"Route activity captured",detail:`${st.routePoints} route point${st.routePoints===1?"":"s"} available for the report.`});
  else items.push({kind:"info",label:"No route activity",detail:"Daily Report can still be copied with site notes only."});
  if(st.defsToday.length) items.push({kind:"info",label:"Deficiencies added",detail:`Review ${st.defsToday.length} new deficienc${st.defsToday.length===1?"y":"ies"} before sending a customer copy.`});
  return items;
}
function dailyReportReadyMarkup508(st){
  const items=dailyReportReadyItems508(st);
  return `<div class="card dailyReportReady508"><div class="routeSectionTitle462"><strong>Report Ready Check</strong><span>${items.filter(i=>i.kind==="warn").length?"Review":"Ready"}</span></div><div class="dailyReadyGrid508">${items.map(i=>`<div class="dailyReadyItem508 ${esc(i.kind)}"><strong>${esc(i.label)}</strong><small>${esc(i.detail)}</small></div>`).join("")}</div></div>`;
}
function dailyDraftsMarkup508(){
  const drafts=siteNoteDraftRows508();
  if(!drafts.length) return "";
  return `<div class="card dailyDrafts508"><div class="routeSectionTitle462"><strong>Unsaved Note Drafts</strong><span>${drafts.length}</span></div>${drafts.map(({s,draft})=>`<button class="dailyDraftRow508" data-draft-site="${esc(s.id)}"><span class="accountInitial476">${esc((s.name||"?").slice(0,1).toUpperCase())}</span><div><strong>${esc(s.name||"Unnamed Site")}</strong><small>${esc(fullAddress(s)||"No address saved")}</small><p>${esc(draft.replaceAll("\n"," / ").slice(0,180))}</p></div><em>Open</em></button>`).join("")}</div>`;
}

function dailySummaryLine499(day=selectedDailySummaryDay569()){
  const st=dailySummaryStats499(day);
  const parts=[];
  parts.push(`${st.noteCount} site note${st.noteCount===1?"":"s"}`);
  if(st.notesSites.length) parts.push(`${st.notesSites.length} site${st.notesSites.length===1?"":"s"}`);
  if(st.routePoints) parts.push(`${st.routePoints} route point${st.routePoints===1?"":"s"}`);
  if(st.tasksToday.length) parts.push(`${st.tasksToday.length} new task${st.tasksToday.length===1?"":"s"}`);
  if(st.defsToday.length) parts.push(`${st.defsToday.length} deficienc${st.defsToday.length===1?"y":"ies"}`);
  return parts.join(" • ") || "No site notes yet today";
}
function dailySummaryText499(day=selectedDailySummaryDay569()){
  const st=dailySummaryStats499(day);
  const date=dailySummaryDateLabel569(day);
  const lines=[
    `FIREVAULT DAILY REPORT`,
    `Date: ${date}`,
    ``,
    `DAY SNAPSHOT`,
    `- Site notes: ${st.noteCount}`,
    `- Sites with notes: ${st.notesSites.length}`,
    `- Route points: ${st.routePoints}`,
    `- New tasks: ${st.tasksToday.length}`,
    `- Deficiencies added: ${st.defsToday.length}`,
    ``,
    `SITE NOTES TODAY (${st.noteCount})`
  ];
  if(st.noteRows.length){
    st.noteRows.forEach(({s,notes})=>{
      lines.push(`- ${s.name||"Unnamed Site"} (${notes.length} note${notes.length===1?"":"s"})`);
      notes.slice(0,4).forEach(n=>lines.push(`  • ${noteEntryTimeLabel506(n)} - ${n.text.replaceAll("\n"," / ")}`));
      if(notes.length>4) lines.push(`  • +${notes.length-4} more note${notes.length-4===1?"":"s"}`);
    });
  }else lines.push(`- No site notes saved today.`);
  lines.push(``, `ROUTE ACTIVITY`);
  if(st.routes.length){
    st.routes.forEach(r=>lines.push(`- ${r.endedAt?"Saved":"Active"}: ${routeSummaryLine(r)}${routeOdometerMiles(r)?` • Odometer ${routeOdometerMiles(r).toFixed(1)} mi`:""}`));
  }else lines.push(`- No route activity recorded today.`);
  lines.push(``, `TASKS / DEFICIENCIES`);
  lines.push(`- Open tasks: ${st.openTasks.length}`);
  lines.push(`- New tasks today: ${st.tasksToday.length}`);
  lines.push(`- Deficiencies added today: ${st.defsToday.length}`);
  if(st.tasksToday.length){
    lines.push(``, `NEW TASKS TODAY`);
    st.tasksToday.slice(0,12).forEach(r=>lines.push(`- ${r.s.name||"Site"}: ${r.t.title||"Task"}`));
  }
  if(st.defsToday.length){
    lines.push(``, `DEFICIENCIES ADDED TODAY`);
    st.defsToday.slice(0,12).forEach(r=>lines.push(`- ${r.s.name||"Site"}: ${r.d.title||"Deficiency"}${r.d.priority?` (${r.d.priority})`:""}`));
  }
  lines.push(``, `Generated by FireVault ${BUILD} on ${new Date().toLocaleString()}`);
  return lines.join("\n");
}

function dailySiteNotesOnlyText509(day=selectedDailySummaryDay569()){
  const st=dailySummaryStats499(day);
  const date=dailySummaryDateLabel569(day);
  const drafts=siteNoteDraftRows508();
  const lines=[`FIREVAULT SITE NOTES ONLY`, `Date: ${date}`, ``];
  if(drafts.length){
    lines.push(`UNSAVED DRAFT WARNING`);
    drafts.forEach(({s,draft})=>lines.push(`- ${s.name||"Unnamed Site"}: ${draft.replaceAll("\n"," / ").slice(0,160)}`));
    lines.push(``);
  }
  lines.push(`SAVED SITE NOTES TODAY (${st.noteCount})`);
  if(st.noteRows.length){
    st.noteRows.forEach(({s,notes})=>{
      lines.push(``, `${s.name||"Unnamed Site"}`);
      const addr=fullAddress(s);
      if(addr) lines.push(addr);
      notes.forEach(n=>lines.push(`- ${noteEntryTimeLabel506(n)} - ${n.text.replaceAll("\n"," / ")}`));
    });
  }else{
    lines.push(`- No site notes saved today.`);
  }
  lines.push(``, `Generated by FireVault ${BUILD}`);
  return lines.join("\n");
}
function copyDailyNotesOnly509(){
  const text=dailySiteNotesOnlyText509(selectedDailySummaryDay569());
  if(navigator.clipboard?.writeText){ navigator.clipboard.writeText(text).then(()=>toast("Site notes only copied."),()=>toast("Clipboard unavailable.")); }
  else toast("Clipboard unavailable.");
}

function dailyCustomerSummaryText505(day=selectedDailySummaryDay569()){
  const st=dailySummaryStats499(day);
  const date=dailySummaryDateLabel569(day);
  const lines=[
    `DAILY SERVICE SUMMARY`,
    `Date: ${date}`,
    ``,
    `Sites with notes: ${st.notesSites.length}`,
    `Site notes: ${st.noteCount}`,
    `Route points: ${st.routePoints}`,
    `New deficiencies: ${st.defsToday.length}`,
    ``
  ];
  if(st.noteRows.length){
    lines.push(`SITE NOTES`);
    st.noteRows.forEach(({s,notes})=>{
      const first=notes[0]?.text || "Note saved.";
      lines.push(`- ${s.name||"Unnamed Site"}: ${first.replaceAll("\n"," / ")}`);
    });
    lines.push(``);
  }
  if(st.defsToday.length){
    lines.push(`DEFICIENCIES / FOLLOW-UP`);
    st.defsToday.slice(0,12).forEach(r=>lines.push(`- ${r.s.name||"Site"}: ${r.d.title||"Deficiency"}${r.d.priority?` (${r.d.priority})`:""}`));
    lines.push(``);
  }
  lines.push(`Generated by FireVault.`);
  return lines.join("\n");
}
function copyCustomerDailySummary505(){
  const text=dailyCustomerSummaryText505(selectedDailySummaryDay569());
  if(navigator.clipboard?.writeText){ navigator.clipboard.writeText(text).then(()=>toast("Customer summary copied."),()=>toast("Clipboard unavailable.")); }
  else toast("Clipboard unavailable.");
}
function downloadDailySummary505(){
  const day=selectedDailySummaryDay569();
  const blob=new Blob([dailySummaryText499(day)],{type:"text/plain;charset=utf-8"});
  const a=document.createElement("a");
  a.href=URL.createObjectURL(blob);
  a.download=`firevault-daily-report-${localDateString()}.txt`;
  document.body.appendChild(a);
  a.click();
  setTimeout(()=>{ URL.revokeObjectURL(a.href); a.remove(); },500);
  toast("Daily report TXT downloaded.");
}
function dailyReportPreview505(day=selectedDailySummaryDay569()){
  const full=dailySummaryText499(day);
  return full.split("\n").slice(0,18).join("\n");
}

function copyDailySummary499(){
  const text=dailySummaryText499(selectedDailySummaryDay569());
  if(navigator.clipboard?.writeText){ navigator.clipboard.writeText(text).then(()=>toast("Daily report copied."),()=>toast("Clipboard unavailable.")); }
  else toast("Clipboard unavailable.");
}
function dailySummary(){
  const day=selectedDailySummaryDay569();
  const isToday=day===localDateString();
  const st=dailySummaryStats499(day);
  const followUps=st.tasksToday.length+st.defsToday.length;
  html(`<div class="screen dailySummaryScreen499 dailySummaryScreen505 dailyReportScreen506 dailyReportScreen508 dailyReportScreen509 dailySummaryScreen569">
    <div class="row dailySummaryTop499 dailySummaryTop505 dailySummaryTop569"><button class="back ghost" id="backBtn">←</button><div><h1>Daily Report</h1><p>${esc(dailySummaryDateLabel569(day,{weekday:"long",month:"long",day:"numeric",year:"numeric"}))}${isToday?" • Today":""}</p></div></div>
    <div class="card dailyDatePickerCard569">
      <div><strong>Report Date</strong><span>Pick any past day with saved notes, route activity, tasks, or deficiencies.</span></div>
      <div class="dailyDateControls569">
        <button class="ghost smallBtn" id="prevDailyDate569">‹ Previous</button>
        <input id="dailySummaryDateInput569" type="date" value="${esc(day)}">
        <button class="ghost smallBtn" id="nextDailyDate569" ${isToday?"disabled":""}>Next ›</button>
        <button class="ghost smallBtn" id="todayDailyDate569" ${isToday?"disabled":""}>Today</button>
      </div>
    </div>
    <div class="card dailySummaryHero499 dailyReportHero505 dailyReportHero506"><div><strong>${esc(dailySummaryLine499(day))}</strong><span>${isToday?"End-of-day site notes report":"Past Daily Summary report"}</span></div><p>Review the selected day’s notes first, then copy an internal report, copy a customer summary, or download TXT.</p></div>
    <div class="dailyReportActions505 dailyReportActions506 dailyReportActions509">
      <button class="primary" id="copyDailySummaryBtn499">Copy Full Report</button>
      <button class="ghost" id="copyCustomerSummaryBtn505">Customer Copy</button>
      <button class="ghost" id="copyDailyNotesOnlyBtn509">Notes Only</button>
      <button class="ghost" id="downloadDailySummaryBtn505">TXT</button>
    </div>
    <div class="dailySummaryGrid499 dailySummaryGrid505 dailySummaryGrid506">
      <div class="card"><strong>${st.noteCount}</strong><span>Site Notes</span></div>
      <div class="card"><strong>${st.notesSites.length}</strong><span>Note Sites</span></div>
      <div class="card"><strong>${st.routePoints}</strong><span>Route Points</span></div>
      <div class="card"><strong>${followUps}</strong><span>Follow-Ups</span></div>
    </div>
    ${isToday?dailyReportReadyMarkup508(st):""}
    ${isToday?dailyDraftsMarkup508():""}
    <div class="card dailyReportReview506 dailyReportReview508">
      <div class="routeSectionTitle462"><strong>Note Review Queue</strong><span>${st.noteCount}</span></div>
      ${st.noteRows.length?st.noteRows.map(({s,notes})=>`<button class="dailyNoteReviewRow506" data-summary-site="${esc(s.id)}"><span class="accountInitial476">${esc((s.name||"?").slice(0,1).toUpperCase())}</span><div><strong>${esc(s.name||"Unnamed Site")}</strong><small>${notes.length} note${notes.length===1?"":"s"} on selected day • ${esc(fullAddress(s)||"No address saved")}</small><p>${esc((notes[0]?.text||"Note saved.").replaceAll("\n"," / "))}</p></div><em>Open</em></button>`).join(""):`<div class="empty">No site notes saved for this day.</div>`}
    </div>
    <div class="card dailyReportPreview505"><div class="routeSectionTitle462"><strong>Report Preview</strong><span>TXT</span></div><pre>${esc(dailyReportPreview505(day))}</pre></div>
    <div class="list grow dailySummaryList499 dailySummaryList505 dailySummaryList506">
      <div class="routeSectionTitle462"><strong>Route Activity</strong><span>${st.routes.length}</span></div>
      ${st.routes.length?st.routes.map(r=>`<div class="card dailySummaryRoute499 dailySummaryRoute505"><h2>${r.endedAt?"Saved Route":"Active Route"}</h2><p>${esc(routeSummaryLine(r))}</p></div>`).join(""):`<div class="empty">No route activity recorded for this day.</div>`}
      <div class="routeSectionTitle462"><strong>Tasks / Deficiencies</strong><span>${followUps}</span></div>
      <div class="card dailySummaryText499 dailySummaryText505"><p>Open tasks: ${st.openTasks.length}</p><p>New tasks on selected day: ${st.tasksToday.length}</p><p>Deficiencies added on selected day: ${st.defsToday.length}</p></div>
    </div>
  </div>`);
  document.getElementById("backBtn").onclick=()=>route("home");
  document.getElementById("copyDailySummaryBtn499").onclick=copyDailySummary499;
  document.getElementById("copyCustomerSummaryBtn505").onclick=copyCustomerDailySummary505;
  document.getElementById("copyDailyNotesOnlyBtn509").onclick=copyDailyNotesOnly509;
  document.getElementById("downloadDailySummaryBtn505").onclick=downloadDailySummary505;
  const input=document.getElementById("dailySummaryDateInput569");
  if(input) input.onchange=()=>{ setDailySummaryDay569(input.value || localDateString()); dailySummary(); };
  document.getElementById("prevDailyDate569").onclick=()=>shiftDailySummaryDay569(-1);
  const next=document.getElementById("nextDailyDate569"); if(next) next.onclick=()=>shiftDailySummaryDay569(1);
  const today=document.getElementById("todayDailyDate569"); if(today) today.onclick=()=>{ setDailySummaryDay569(localDateString()); dailySummary(); };
  document.querySelectorAll("[data-summary-site]").forEach(b=>b.onclick=()=>{selectedSiteId=b.dataset.summarySite; route("jobMode");});
  document.querySelectorAll("[data-draft-site]").forEach(b=>b.onclick=()=>{selectedSiteId=b.dataset.draftSite; route("jobMode");});
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


function primaryContact477(s){
  const contacts=Array.isArray(s.contacts)?s.contacts:[];
  return contacts.find(c=>c.afterHours) || contacts.find(c=>c.phone) || contacts.find(c=>c.email) || contacts[0] || null;
}
function accessSummary477(s){
  const contacts=Array.isArray(s.contacts)?s.contacts:[];
  const access=contacts.find(c=>c.accessNotes || String(c.type||'').toLowerCase().includes('access'));
  if(access?.accessNotes) return access.accessNotes;
  if(s.notes) return String(s.notes).split('\n').slice(0,2).join(' ');
  return 'No access notes entered.';
}
function fieldValue477(label,value,extra=''){
  return `<div class="fieldValue477"><span>${esc(label)}</span><strong>${esc(value||'Not entered')}</strong>${extra}</div>`;
}
function siteToolCount477(){
  const mode=appMode();
  let n=0;
  if(featureOn('reports')) n++;
  if(mode!=='simple' || featureOn('reports')) n++;
  if(featureOn('library')) n++;
  if(featureOn('equipment')) n++;
  if(featureOn('advancedGps')) n++;
  return n;
}


/* Build 0.50.75 Site Screen Cleanup helpers */
function siteOpenTasks556(s={}){
  return (s.tasks||[]).filter(t=>String(t.status||"Open").toLowerCase()!=="done" && String(t.status||"Open").toLowerCase()!=="complete");
}
function siteOpenDeficiencies556(s={}){
  return (s.deficiencies||[]).filter(d=>String(d.status||"Open").toLowerCase()!=="closed");
}
function siteBriefText556(s={}){
  const openTasks=siteOpenTasks556(s);
  const openDef=siteOpenDeficiencies556(s);
  const docs=Array.isArray(s.docs)?s.docs:[];
  const photos=docs.filter(docHasPhoto512);
  const visits=Array.isArray(s.visits)?s.visits:[];
  const primary=primaryContact477(s);
  const panel=[s.panelManufacturer,s.panelModel].filter(Boolean).join(" ") || "Panel not entered";
  const last=visits[0];
  const health=siteHealth(s);
  const lines=[
    "FireVault Site Brief",
    `Build: ${BUILD}`,
    "",
    `Site: ${s.name || "Unnamed Account"}`,
    `Address: ${fullAddress(s) || "No address saved"}`,
    `Panel: ${panel}`,
    `Primary Contact: ${primary ? contactTitle(primary) : "No contact saved"}`,
    `Access: ${accessSummary477(s)}`,
    "",
    `Health: ${health.score}% - ${health.label}`,
    `Open Tasks: ${openTasks.length}`,
    `Open Deficiencies: ${openDef.length}`,
    `Photos: ${photos.length}`,
    `Visits: ${visits.length}`,
    `Last Visit: ${last ? `${visitDateLabel(last)} • ${durationText(last.startedAt,last.endedAt)}` : "No completed visits"}`,
    "",
    `Priority: ${health.details.length ? health.details.join(" • ") : "Ready for service"}`
  ];
  return lines.join("\n");
}
async function copySiteBrief556(){
  const s=site(); if(!s) return;
  try{
    await navigator.clipboard.writeText(siteBriefText556(s));
    toast("Site brief copied.");
  }catch{
    toast("Clipboard unavailable.");
  }
}
function siteBriefMarkup556(s={}){
  const openTasks=siteOpenTasks556(s);
  const openDef=siteOpenDeficiencies556(s);
  const docs=Array.isArray(s.docs)?s.docs:[];
  const photos=docs.filter(docHasPhoto512);
  const visits=Array.isArray(s.visits)?s.visits:[];
  const health=siteHealth(s);
  const primary=primaryContact477(s);
  const panel=[s.panelManufacturer,s.panelModel].filter(Boolean).join(" ") || "Panel not entered";
  const last=visits[0];
  const priority=health.details.length ? health.details.join(" • ") : "Ready for service";
  return `<div class="card siteBrief556">
    <div class="siteBriefHead556">
      <div><h2>Site Brief</h2><p>${esc(priority)}</p></div>
      <button class="ghost smallBtn" id="copySiteBrief556">Copy Brief</button>
    </div>
    <div class="siteBriefStats556">
      <button id="briefTasks556"><strong>${openTasks.length}</strong><span>Open Tasks</span></button>
      <button id="briefDef556"><strong>${openDef.length}</strong><span>Deficiencies</span></button>
      <button id="briefPhotos556"><strong>${photos.length}</strong><span>Photos</span></button>
      <button id="briefVisits556"><strong>${visits.length}</strong><span>Visits</span></button>
    </div>
    <div class="siteBriefGrid556">
      <div><strong>Panel</strong><span>${esc(panel)}</span></div>
      <div><strong>Contact</strong><span>${esc(primary ? contactTitle(primary) : "No contact saved")}</span></div>
      <div><strong>Access</strong><span>${esc(accessSummary477(s))}</span></div>
      <div><strong>Last Visit</strong><span>${esc(last ? `${visitDateLabel(last)} • ${durationText(last.startedAt,last.endedAt)}` : "No completed visits")}</span></div>
    </div>
  </div>`;
}
function wireSiteBrief556(){
  const copy=document.getElementById("copySiteBrief556");
  if(copy) copy.onclick=copySiteBrief556;
  const tasks=document.getElementById("briefTasks556");
  if(tasks) tasks.onclick=()=>route("tasks");
  const defs=document.getElementById("briefDef556");
  if(defs) defs.onclick=()=>route("deficiencies");
  const photos=document.getElementById("briefPhotos556");
  if(photos) photos.onclick=()=>{docVaultFilter516="photos"; route("siteDocs");};
  const visits=document.getElementById("briefVisits556");
  if(visits) visits.onclick=()=>route("visits");
}




/* Build 0.50.75 Site Activity Timeline filters */
let siteTimelineFilter558 = "all";
let siteTimelineExpanded559 = false;
function siteTimelineFilterCounts558(s={}){
  const rows=siteActivityRows557(s);
  return {
    all: rows.length,
    visits: rows.filter(r=>r.type==="Visit").length,
    media: rows.filter(r=>r.type==="Photo" || r.type==="Doc").length,
    tasks: rows.filter(r=>r.type==="Task").length,
    deficiencies: rows.filter(r=>r.type==="Deficiency").length
  };
}
function filteredSiteActivityRows558(s={}){
  const rows=siteActivityRows557(s);
  if(siteTimelineFilter558==="visits") return rows.filter(r=>r.type==="Visit");
  if(siteTimelineFilter558==="media") return rows.filter(r=>r.type==="Photo" || r.type==="Doc");
  if(siteTimelineFilter558==="tasks") return rows.filter(r=>r.type==="Task");
  if(siteTimelineFilter558==="deficiencies") return rows.filter(r=>r.type==="Deficiency");
  return rows;
}
function siteTimelineFilterButton558(key,label,count){
  return `<button class="timelineFilter558 ${siteTimelineFilter558===key?"active":""}" data-filter="${esc(key)}"><strong>${esc(label)}</strong><span>${count}</span></button>`;
}
function siteTimelineFiltersMarkup558(s={}){
  const c=siteTimelineFilterCounts558(s);
  return `<div class="timelineFilters558">
    ${siteTimelineFilterButton558("all","All",c.all)}
    ${siteTimelineFilterButton558("visits","Visits",c.visits)}
    ${siteTimelineFilterButton558("media","Photos / Docs",c.media)}
    ${siteTimelineFilterButton558("tasks","Tasks",c.tasks)}
    ${siteTimelineFilterButton558("deficiencies","Def.",c.deficiencies)}
  </div>`;
}
function wireSiteTimelineFilters558(){
  document.querySelectorAll(".timelineFilter558").forEach(b=>{
    b.onclick=()=>{
      siteTimelineFilter558=b.dataset.filter || "all";
      siteTimelineExpanded559=false;
      siteDetail();
    };
  });
}

/* Build 0.50.75 Site Activity Timeline helpers */
function activityDateMs557(value){
  const t=new Date(value || 0).getTime();
  return Number.isFinite(t) ? t : 0;
}
function activityDateLabel557(value){
  const ms=activityDateMs557(value);
  if(!ms) return "No date";
  try{return new Date(ms).toLocaleDateString([], {month:"short", day:"numeric", year:"numeric"});}
  catch{return "No date";}
}
function activityTimeLabel557(value){
  const ms=activityDateMs557(value);
  if(!ms) return "";
  try{return new Date(ms).toLocaleTimeString([], {hour:"numeric", minute:"2-digit"});}
  catch{return "";}
}
function siteActivityRows557(s={}){
  const rows=[];
  (s.visits||[]).forEach(v=>{
    const when=v.endedAt||v.startedAt||v.date||v.createdAt;
    rows.push({
      type:"Visit",
      icon:"✓",
      date:when,
      sort:activityDateMs557(when),
      title:v.type||"Visit",
      detail:[durationText(v.startedAt,v.endedAt), v.notes||v.summary||""].filter(Boolean).join(" • "),
      route:"visits"
    });
  });
  (s.docs||[]).forEach(d=>{
    const when=d.updatedAt||d.createdAt||d.date;
    const isPhoto=typeof docHasPhoto512==="function" ? docHasPhoto512(d) : !!(d.imageData||d.photoData);
    rows.push({
      type:isPhoto?"Photo":"Doc",
      icon:isPhoto?"▣":"▤",
      date:when,
      sort:activityDateMs557(when),
      title:d.title||d.imageName||d.name||(isPhoto?"Photo":"Document"),
      detail:[d.photoCategory||d.kind||d.type||"", d.customerCaption||d.notes||""].filter(Boolean).join(" • "),
      route:"siteDocs",
      photo:isPhoto
    });
  });
  (s.tasks||[]).forEach(t=>{
    const when=t.updatedAt||t.createdAt||t.due||t.date;
    rows.push({
      type:"Task",
      icon:"□",
      date:when,
      sort:activityDateMs557(when),
      title:t.title||t.name||"Task",
      detail:[t.status||"Open", t.due?`Due ${t.due}`:"", t.notes||""].filter(Boolean).join(" • "),
      route:"tasks"
    });
  });
  (s.deficiencies||[]).forEach(d=>{
    const when=d.updatedAt||d.createdAt||d.date;
    rows.push({
      type:"Deficiency",
      icon:"!",
      date:when,
      sort:activityDateMs557(when),
      title:d.title||d.name||"Deficiency",
      detail:[d.status||"Open", d.priority||d.severity||"", d.customerNote||d.resolutionNotes||d.notes||""].filter(Boolean).join(" • "),
      route:"deficiencies"
    });
  });
  return rows.sort((a,b)=>b.sort-a.sort);
}
function siteActivityText557(s={}){
  const rows=filteredSiteActivityRows558(s).slice(0,12);
  const lines=[
    "FireVault Site Activity Timeline",
    `Build: ${BUILD}`,
    "",
    `Site: ${s.name||"Unnamed Account"}`,
    `Address: ${fullAddress(s)||"No address saved"}`,
    "",
    rows.length ? `Recent Activity (${siteTimelineFilter558}):` : "No recent activity saved yet."
  ];
  rows.forEach((r,i)=>{
    lines.push(`${i+1}. ${activityDateLabel557(r.date)} ${activityTimeLabel557(r.date)} - ${r.type}: ${r.title}`);
    if(r.detail) lines.push(`   ${r.detail}`);
  });
  return lines.join("\n");
}
async function copySiteActivity557(){
  const s=site(); if(!s) return;
  try{
    await navigator.clipboard.writeText(siteActivityText557(s));
    toast("Activity timeline copied.");
  }catch{
    toast("Clipboard unavailable.");
  }
}
async function copyFullSiteActivity559(){
  const s=site(); if(!s) return;
  const current=siteTimelineFilter558;
  const rows=filteredSiteActivityRows558(s);
  const lines=[
    "FireVault Full Site Activity Timeline",
    `Build: ${BUILD}`,
    "",
    `Site: ${s.name||"Unnamed Account"}`,
    `Address: ${fullAddress(s)||"No address saved"}`,
    `Filter: ${current}`,
    `Items: ${rows.length}`,
    ""
  ];
  rows.forEach((r,i)=>{
    lines.push(`${i+1}. ${activityDateLabel557(r.date)} ${activityTimeLabel557(r.date)} - ${r.type}: ${r.title}`);
    if(r.detail) lines.push(`   ${r.detail}`);
  });
  try{
    await navigator.clipboard.writeText(lines.join("\n"));
    toast("Full timeline copied.");
  }catch{
    toast("Clipboard unavailable.");
  }
}
function toggleSiteTimelineExpanded559(){
  siteTimelineExpanded559=!siteTimelineExpanded559;
  siteDetail();
}

function siteActivityTimelineMarkup557(s={}){
  const rows=filteredSiteActivityRows558(s);
  const limit=siteTimelineExpanded559 ? 20 : 6;
  const shown=rows.slice(0,limit);
  const remaining=Math.max(0, rows.length-shown.length);
  const labelMap={all:"all activity",visits:"visits",media:"photos / docs",tasks:"tasks",deficiencies:"deficiencies"};
  return `<div class="card siteTimeline557 siteTimeline558 siteTimeline559">
    <div class="siteTimelineHead557">
      <div><h2>Activity Timeline</h2><p>${shown.length ? `${shown.length} of ${rows.length} ${labelMap[siteTimelineFilter558]||"items"}` : `No ${labelMap[siteTimelineFilter558]||"activity"} saved yet`}</p></div>
      <button class="ghost smallBtn" id="copySiteActivity557">Copy Timeline</button>
    </div>
    ${siteTimelineFiltersMarkup558(s)}
    <div class="timelineTools559">
      <button class="ghost smallBtn" id="toggleTimeline559">${siteTimelineExpanded559?"Collapse":"Show More"}</button>
      <button class="ghost smallBtn" id="copyFullTimeline559">Copy Full</button>
      <span>${remaining ? `${remaining} more` : "All shown"}</span>
    </div>
    <div class="siteTimelineList557">
      ${shown.length ? shown.map((r,i)=>`<button class="siteActivityRow557" data-route="${esc(r.route)}">
        <span class="siteActivityIcon557">${esc(r.icon)}</span>
        <div><strong>${esc(r.title)}</strong><small>${esc(r.type)} • ${esc(activityDateLabel557(r.date))}${activityTimeLabel557(r.date)?` • ${esc(activityTimeLabel557(r.date))}`:""}</small>${r.detail?`<em>${esc(r.detail)}</em>`:""}</div>
      </button>`).join("") : `<div class="empty">No ${esc(labelMap[siteTimelineFilter558]||"activity")} saved yet.</div>`}
    </div>
  </div>`;
}
function wireSiteActivity557(){
  wireSiteTimelineFilters558();
  const copy=document.getElementById("copySiteActivity557");
  if(copy) copy.onclick=copySiteActivity557;
  const full=document.getElementById("copyFullTimeline559");
  if(full) full.onclick=copyFullSiteActivity559;
  const toggle=document.getElementById("toggleTimeline559");
  if(toggle) toggle.onclick=toggleSiteTimelineExpanded559;
  document.querySelectorAll(".siteActivityRow557").forEach(b=>{
    b.onclick=()=>{
      const r=b.dataset.route;
      if(r==="siteDocs") docVaultFilter516="all";
      if(r) route(r);
    };
  });
}


/* Build 0.50.75 Important Site Info helpers */
function primaryContact568(s={}){
  const contacts=s.contacts||[];
  return contacts.find(c=>/primary|main|manager|owner|contact/i.test([c.role,c.notes,c.accessNotes].filter(Boolean).join(" "))) || contacts[0] || {};
}
function accessLine568(s={}){
  const c=primaryContact568(s);
  return s.accessNotes || c.accessNotes || c.notes || s.notes || "";
}
function panelLine568(s={}){
  return [s.panelManufacturer,s.panelModel].filter(Boolean).join(" ") || s.panel || s.panelLocation || "";
}
function importantSiteInfoText568(s={}){
  const c=primaryContact568(s);
  const lines=[
    "FireVault Important Site Info",
    `Build: ${BUILD}`,
    "",
    `Site: ${s.name||"Unnamed Account"}`,
    `Address: ${fullAddress(s)||"No address saved"}`,
    `Contact: ${[c.name,c.role].filter(Boolean).join(" - ") || "No contact saved"}`,
    `Phone: ${c.phone||"No phone saved"}`,
    `Email: ${c.email||"No email saved"}`,
    `Access: ${accessLine568(s)||"No access notes saved"}`,
    `Panel: ${panelLine568(s)||"No panel info saved"}`,
    `GPS: ${gpsLine(s)}`
  ];
  return lines.join("\n");
}
async function copyImportantSiteInfo568(){
  const s=site(); if(!s) return;
  try{
    await navigator.clipboard.writeText(importantSiteInfoText568(s));
    toast("Important site info copied.");
  }catch{
    toast("Clipboard unavailable.");
  }
}
function importantSiteInfoMarkup568(s={}){
  const c=primaryContact568(s);
  const contact=[c.name,c.role].filter(Boolean).join(" • ") || "No contact saved";
  const phone=c.phone || c.email || "No phone/email";
  const access=accessLine568(s) || "No access notes";
  const panel=panelLine568(s) || "No panel info";
  const gps=hasGps(s) ? "GPS saved" : "No GPS";
  return `<div class="card importantInfo568">
    <div class="importantInfoHead568">
      <div><h2>Important Site Info</h2><p>Fast contact, access, panel, and GPS reference.</p></div>
      <button class="ghost smallBtn" id="copyImportantInfo568">Copy</button>
    </div>
    <div class="importantInfoGrid568">
      <div class="infoContact574"><strong>Contact</strong><span>${esc(contact)}</span><em>${esc(phone)}</em></div>
      <div class="infoAccess574"><strong>Access</strong><span>${esc(access)}</span></div>
      <div class="infoPanel574"><strong>Panel</strong><span>${esc(panel)}</span></div>
      <div class="infoGps574"><strong>GPS</strong><span>${esc(gps)}</span><em>${esc(hasGps(s)?gpsLine(s):"Capture GPS when on site")}</em></div>
    </div>
  </div>`;
}
function wireImportantSiteInfo568(){
  const copy=document.getElementById("copyImportantInfo568");
  if(copy) copy.onclick=copyImportantSiteInfo568;
}


function siteDetail(){
  const s=site(); if(!s){ route('sites'); return; }
  s.lastOpenedAt=new Date().toISOString();
  saveData(data);
  const open=(s.tasks||[]).filter(t=>(t.status||'Open')!=='Done').length;
  const def=(s.deficiencies||[]).filter(d=>(d.status||'Open')!=='Closed').length;
  const siteVisits=Array.isArray(s.visits) ? s.visits : [];
  const equipment=Array.isArray(s.equipment) ? s.equipment : [];
  const contacts=Array.isArray(s.contacts) ? s.contacts : [];
  const docs=Array.isArray(s.docs) ? s.docs : [];
  const photoDocs=docs.filter(docHasPhoto512);
  const checklistItems=Array.isArray(s.checklist) ? s.checklist : [];
  const checkStats=checklistStats(s);
  const health=siteHealth(s);
  const lastVisit=siteVisits[0];
  const panel=[s.panelManufacturer,s.panelModel].filter(Boolean).join(' ')||'Panel not entered';
  const primary=primaryContact477(s);
  const access=accessSummary477(s);
  const showChecklistTool=appMode()!=='simple' || featureOn('reports');
  const toolCount=siteToolCount477();
  const nextAction = def ? `${def} deficiency${def===1?'':'ies'} need review` : open ? `${open} open task${open===1?'':'s'}` : 'Ready for service';
  html(`<div class="screen siteDetailScreen477 siteDetailScreen489 siteDetailScreen574"><div class="row siteTopBar siteTopBar477 siteTopBar489"><button class="back ghost" id="backBtn">←</button><div class="siteTopTitle477"><strong>Account</strong><span>${esc(appMode()==='simple'?'Simple tools':'Modules on')}</span></div><button class="ghost" id="editBtn">Edit</button></div>

    <div class="card siteHero477 siteHero489 siteHero566"><div class="siteHeroMain477"><span class="accountInitialLarge477">${esc((s.name||'?').slice(0,1).toUpperCase())}</span><div><h1>${esc(s.name||'Unnamed Account')}</h1><p>${esc(fullAddress(s))}</p><em>${esc(nextAction)}</em></div></div><div class="siteHeroActions566"><button class="pinSiteBtn566 ${isPinnedSite566(s)?"pinned":""}" id="pinSiteBtn566">${isPinnedSite566(s)?"★":"☆"}</button><div class="siteHealthDot477 ${health.cls}">${health.score}%</div></div></div>

    ${featureOn("importantSiteInfo")?importantSiteInfoMarkup568(s):""}
    ${featureOn("siteBrief")?siteBriefMarkup556(s):""}
    ${featureOn("siteTimeline")?siteActivityTimelineMarkup557(s):""}

    <div class="card siteQuickActions544"><div class="siteCardHead477"><div><h2>Site Quick Actions</h2><p>Fast access to the field tasks used most on this account.</p></div><span class="quickActionBadge544">${open+def+photoDocs.length}</span></div><div class="quickActionGrid544">
      <button class="primary quickAction544" id="qaAddNote544"><strong>＋ Site Note</strong><span>Timestamped note</span></button>
      <button class="ghost quickAction544" id="qaAddPhoto544"><strong>＋ Photo</strong><span>Panel, device, deficiency</span></button>
      <button class="ghost quickAction544" id="qaAddDef544"><strong>＋ Deficiency</strong><span>Document a problem</span></button>
      <button class="ghost quickAction544" id="qaAddTask544"><strong>＋ Task</strong><span>Follow-up item</span></button>
      <button class="ghost quickAction544" id="qaPhotoVault544"><strong>Photo Vault</strong><span>${photoDocs.length} saved photo${photoDocs.length===1?'':'s'}</span></button>
      <button class="ghost quickAction544" id="qaReport544"><strong>Report Center</strong><span>Customer closeout</span></button>
      <button class="ghost quickAction544 wideAction544" id="qaCloseout544"><strong>Copy Closeout Packet</strong><span>Customer-facing summary</span></button>
    </div></div>

    <div class="grid2 sitePrimaryActions477 sitePrimaryActions489 compactPrimaryActions544"><button class="ghost tile" id="snapshotBtn"><strong>Snapshot</strong><span>Copy field summary</span></button>${featureOn('advancedGps')?`<button class="ghost tile" id="navigateBtn477"><strong>Navigate</strong><span>Open maps</span></button>`:''}</div>

    <div class="card fieldCard477 fieldCard489"><div class="siteCardHead477"><div><h2>Field Card</h2><p>Most-used account information first.</p></div><button class="ghost smallBtn" id="contactsQuick477">Contacts</button></div><div class="fieldGrid477">
      ${fieldValue477('Panel', panel)}
      ${fieldValue477('Primary Contact', primary ? contactTitle(primary) : 'No contact saved', primary?.phone?`<button class="ghost microBtn477" id="callPrimary477">Call</button>`:'')}
      ${fieldValue477('Access', access)}
      ${fieldValue477('Last Visit', lastVisit ? `${visitDateLabel(lastVisit)} • ${durationText(lastVisit.startedAt,lastVisit.endedAt)}` : 'No completed visits')}
    </div></div>

    <div class="grid3 siteQuickStats477 siteQuickStats489"><button class="card tile" id="taskBtn"><strong>${open}</strong><span>Open Tasks</span></button><button class="card tile" id="defBtn"><strong>${def}</strong><span>Deficiencies</span></button><button class="card tile" id="visitsMini477"><strong>${siteVisits.length}</strong><span>Visits</span></button></div>

    <div class="card accountPhotoCard523 siteSimpleCard477"><div class="row"><div><h2>Account Photos</h2><p>${photoDocs.length ? `${photoDocs.length} saved photo${photoDocs.length===1?'':'s'} for this account.` : 'Add panel, device, wiring, deficiency, and site condition photos here.'}</p></div><div class="photoCardActions523"><button class="ghost smallBtn" id="openPhotoVaultBtn523">Photo Vault</button><button class="primary smallBtn" id="addAccountPhotoBtn523">＋ Add Photo</button></div></div>${photoDocs.length?`<div class="accountPhotoStrip523 accountPhotoStrip524">${photoDocs.slice(0,3).map(d=>`<button class="accountPhotoThumb523 accountPhotoThumb524" data-doc="${esc(d.id)}">${docPhotoThumb512(d)}<span>${esc(d.title||d.imageName||'Photo')}</span><em>${esc(photoCategory524(d)||'Photo')}</em></button>`).join('')}</div>`:`<p class="fieldNote">This is now visible directly on the account screen so photos are not hidden under Documents.</p>`}</div>

    <div class="card siteNow477 siteNow489"><div class="siteNowHead477"><div><h2>Today’s Priority</h2><p>${esc(health.details.join(' • '))}</p></div><span>${health.score}%</span></div><div class="siteNowGrid477"><button id="openTasksMini476"><strong>${open}</strong><small>Open Tasks</small></button><button id="openDefMini476"><strong>${def}</strong><small>Deficiencies</small></button><button id="addDefQuick477"><strong>＋</strong><small>Add Deficiency</small></button></div></div>

    <div class="card contactsMiniCard477 siteSimpleCard477"><div class="row"><div><h2>Contacts & Access</h2><p>${contacts.length ? `${contacts.length} saved contact${contacts.length===1?'':'s'}` : 'Customer, access, gate, and after-hours details.'}</p></div><button class="ghost smallBtn" id="manageContactsBtn">Manage</button></div>${contacts.length?contacts.slice(0,2).map(c=>`<button class="contactLine contactLine477" data-contact="${esc(c.id)}"><strong>${esc(contactTitle(c))}</strong><span>${esc(contactMeta(c))}</span>${c.accessNotes?`<em>${esc(c.accessNotes)}</em>`:''}</button>`).join(''):`<p class="fieldNote">Add customer contacts, access codes, lockbox notes, or monitoring center details here.</p>`}</div>

    <div class="card recentVisitsCard477 siteSimpleCard477"><div class="row"><div><h2>Recent Visit</h2><p>${lastVisit ? `${visitDateLabel(lastVisit)} • ${durationText(lastVisit.startedAt,lastVisit.endedAt)}` : 'No completed visits yet.'}</p></div>${siteVisits.length?`<button class="ghost smallBtn" id="allVisitsBtn">All</button>`:''}</div>${lastVisit?`<button class="visitMini visitMiniButton" data-visit="${esc(lastVisit.id)}"><strong>${esc(visitNotesPreview(lastVisit,1))}</strong><span>Open visit detail</span></button>`:`<p class="fieldNote">Use Add Note to keep timestamped site notes for this account.</p>`}</div>

    ${toolCount?`<div class="card siteModulesCard477 siteModulesCard489"><div class="siteModulesHead477"><h2>More Site Tools</h2><p>Disabled modules are removed from this account screen.</p></div><div class="grid2 siteModuleGrid477">
      ${featureOn('reports')?`<button class="ghost tile" id="reportBtn"><strong>Report</strong><span>Copy / download</span></button>`:''}
      ${showChecklistTool?`<button class="ghost tile" id="checklistBtn"><strong>${checklistItems.length ? checkStats.progress + '%' : 'New'}</strong><span>Checklist</span></button>`:''}
      ${featureOn('library')?`<button class="ghost tile" id="manageDocsBtn"><strong>${docs.length}</strong><span>Documents</span></button>`:''}
      ${featureOn('equipment')?`<button class="ghost tile" id="equipmentBtn"><strong>${equipment.length}</strong><span>Equipment</span></button>`:''}
      ${featureOn('advancedGps')?`<button class="ghost tile" id="gpsToolsBtn"><strong>GPS</strong><span>${hasGps(s)?'Saved':'Capture'}</span></button>`:''}
    </div></div>`:''}

    ${featureOn('advancedGps')?`<div class="card gpsCard siteGpsCard477"><div class="row"><div><h2>GPS / Maps</h2><p>${esc(gpsLine(s))}</p></div>${data.settings.gps?.enabled===false?'':`<button id="captureGpsBtn" class="primary smallBtn">Capture GPS</button>`}</div><div class="mapActions"><button id="appleBtn" class="ghost">Apple Maps</button><button id="googleBtn" class="ghost">Google Maps</button></div></div>`:''}

    ${featureOn('equipment') && equipment.length?`<div class="card equipmentMiniCard477 siteSimpleCard477"><div class="row"><div><h2>Equipment Snapshot</h2><p>${equipment.length} saved equipment item${equipment.length===1?'':'s'}</p></div><button class="ghost smallBtn" id="manageEquipmentBtn">Manage</button></div>${equipment.slice(0,2).map(e=>`<button class="equipmentLine" data-eq="${esc(e.id)}"><strong>${esc(equipmentTitle(e))}</strong><span>${esc(e.location||e.type||'No location entered')}</span></button>`).join('')}</div>`:''}

    ${featureOn('library') && docs.length?`<div class="card docsMiniCard477 siteSimpleCard477"><div class="row"><div><h2>Documents / Links</h2><p>${docs.length} saved document${docs.length===1?'':'s'}</p></div><button class="ghost smallBtn" id="manageDocsBtn2">Manage</button></div>${docs.slice(0,2).map(d=>`<button class="docLineMini" data-doc="${esc(d.id)}"><strong>${esc(docTitle(d))}</strong><span>${esc(docMeta(d))}</span></button>`).join('')}</div>`:''}

    <div class="card grow siteNotes477 siteNotes491 siteNotes494"><div class="row"><div><h2>Site Notes</h2><p>Timestamped notes for this account.</p></div><div class="noteCardActions494"><button class="ghost smallBtn" id="openSiteNotesBtn494">Open</button><button class="primary smallBtn" id="addSiteNoteBtn491">＋ Note</button></div></div><pre>${esc(s.notes || 'No notes entered.')}</pre></div>
  </div>`);
  document.getElementById('backBtn').onclick=()=>route('sites');
  document.getElementById('editBtn').onclick=()=>{mode='edit'; route('siteForm');};
  const pinBtn566=document.getElementById('pinSiteBtn566'); if(pinBtn566) pinBtn566.onclick=toggleSitePinned566;
  document.getElementById('taskBtn').onclick=()=>route('tasks');
  document.getElementById('defBtn').onclick=()=>route('deficiencies');
  document.getElementById('visitsMini477').onclick=()=>route('visits');
  const openPhotoVault523=document.getElementById('openPhotoVaultBtn523'); if(openPhotoVault523) openPhotoVault523.onclick=()=>{docVaultFilter516='photos'; route('siteDocs');};
  const addAccountPhoto523=document.getElementById('addAccountPhotoBtn523'); if(addAccountPhoto523) addAccountPhoto523.onclick=()=>{mode='newPhoto'; route('siteDocForm');};
  document.querySelectorAll('.accountPhotoThumb523').forEach(b=>b.onclick=()=>{ const d=(site()?.docs||[]).find(x=>x.id===b.dataset.doc); if(d) photoPreviewModal524(d); });
  document.getElementById('openTasksMini476').onclick=()=>route('tasks');
  document.getElementById('openDefMini476').onclick=()=>route('deficiencies');
  document.getElementById('snapshotBtn').onclick=shareSiteSnapshot;
  wireImportantSiteInfo568();
  wireSiteBrief556();
  wireSiteActivity557();
  const qaNote544=document.getElementById('qaAddNote544'); if(qaNote544) qaNote544.onclick=()=>addSiteNotePrompt();
  const qaPhoto544=document.getElementById('qaAddPhoto544'); if(qaPhoto544) qaPhoto544.onclick=()=>{mode='newPhoto'; route('siteDocForm');};
  const qaDef544=document.getElementById('qaAddDef544'); if(qaDef544) qaDef544.onclick=()=>{mode=null; route('deficiencyForm');};
  const qaTask544=document.getElementById('qaAddTask544'); if(qaTask544) qaTask544.onclick=()=>{mode=null; route('taskForm');};
  const qaVault544=document.getElementById('qaPhotoVault544'); if(qaVault544) qaVault544.onclick=()=>{docVaultFilter516='photos'; route('siteDocs');};
  const qaReport544=document.getElementById('qaReport544'); if(qaReport544) qaReport544.onclick=()=>route('report');
  const qaCloseout544=document.getElementById('qaCloseout544'); if(qaCloseout544) qaCloseout544.onclick=copyCustomerCloseoutPacket539;
  const siteNoteBtn491=document.getElementById('addSiteNoteBtn491'); if(siteNoteBtn491) siteNoteBtn491.onclick=()=>addSiteNotePrompt();
  const openNotes494=document.getElementById('openSiteNotesBtn494'); if(openNotes494) openNotes494.onclick=()=>route('jobMode');
  const addTask=document.getElementById('addTaskQuick477'); if(addTask) addTask.onclick=()=>{mode=null; route('taskForm');};
  const addDef=document.getElementById('addDefQuick477'); if(addDef) addDef.onclick=()=>{mode=null; route('deficiencyForm');};
  const nav=document.getElementById('navigateBtn477'); if(nav) nav.onclick=()=>window.open(mapUrl(s,(data.settings.gps&&data.settings.gps.mapProvider)||'apple'),'_blank');
  const call=document.getElementById('callPrimary477'); if(call && primary?.phone) call.onclick=()=>{location.href=`tel:${primary.phone}`;};
  const contactQuick=document.getElementById('contactsQuick477'); if(contactQuick) contactQuick.onclick=()=>route('contactsList');
  const report=document.getElementById('reportBtn'); if(report) report.onclick=()=>route('report');
  const checklist=document.getElementById('checklistBtn'); if(checklist) checklist.onclick=()=>route('checklist');
  const equipmentBtn=document.getElementById('equipmentBtn'); if(equipmentBtn) equipmentBtn.onclick=()=>route('equipmentList');
  const gpsTools=document.getElementById('gpsToolsBtn'); if(gpsTools) gpsTools.onclick=()=>{ const gps=document.querySelector('.siteGpsCard477'); if(gps) gps.scrollIntoView({behavior:'smooth',block:'center'}); };
  const gpsBtn=document.getElementById('captureGpsBtn'); if(gpsBtn) gpsBtn.onclick=captureGpsForSite;
  const apple=document.getElementById('appleBtn'); if(apple) apple.onclick=()=>window.open(mapUrl(s,'apple'),'_blank');
  const google=document.getElementById('googleBtn'); if(google) google.onclick=()=>window.open(mapUrl(s,'google'),'_blank');
  const manageContacts=document.getElementById('manageContactsBtn'); if(manageContacts) manageContacts.onclick=()=>route('contactsList');
  document.querySelectorAll('.contactLine').forEach(b=>b.onclick=()=>{mode=b.dataset.contact; route('contactForm');});
  const manageEq=document.getElementById('manageEquipmentBtn'); if(manageEq) manageEq.onclick=()=>route('equipmentList');
  document.querySelectorAll('.equipmentLine').forEach(b=>b.onclick=()=>{mode=b.dataset.eq; route('equipmentForm');});
  const manageDocs=document.getElementById('manageDocsBtn'); if(manageDocs) manageDocs.onclick=()=>route('siteDocs');
  const manageDocs2=document.getElementById('manageDocsBtn2'); if(manageDocs2) manageDocs2.onclick=()=>route('siteDocs');
  document.querySelectorAll('.docLineMini').forEach(b=>b.onclick=()=>{mode=b.dataset.doc; route('siteDocForm');});
  const allVisits=document.getElementById('allVisitsBtn'); if(allVisits) allVisits.onclick=()=>route('visits');
  document.querySelectorAll('.visitMiniButton').forEach(b=>b.onclick=()=>{mode=b.dataset.visit; route('visitDetail');});
}

function photoCategory524(d={}){ return d.photoCategory || (docHasPhoto512(d) ? "Panel" : ""); }
function photoReportSelected526(d={}){ return !!(d && d.imageData && d.includeInCustomerReport === true); }
function reportPhotos526(s={}){ return (s.docs||[]).filter(photoReportSelected526); }
function reportPhotoLabel526(d={}){ return [photoCategory524(d)||"Photo", d.title||d.imageName||"Account Photo"].filter(Boolean).join(" • "); }
function toggleReportPhoto526(docId){
  const s=site(); if(!s) return;
  const d=(s.docs||[]).find(x=>x.id===docId);
  if(!d || !docHasPhoto512(d)){ toast("Photo not found."); return; }
  d.includeInCustomerReport = !photoReportSelected526(d);
  d.updatedAt = new Date().toISOString();
  save();
  toast(d.includeInCustomerReport ? "Photo selected for customer report." : "Photo removed from customer report.");
  report();
}
function setAllReportPhotos527(include=true){
  const s=site(); if(!s) return;
  const photos=(s.docs||[]).filter(docHasPhoto512);
  photos.forEach(d=>{ d.includeInCustomerReport=!!include; d.updatedAt=new Date().toISOString(); });
  save();
  toast(include ? `${photos.length} photo${photos.length===1?"":"s"} selected.` : "Customer report photos cleared.");
  report();
}
function reportPhotoSummary527(s={}){
  const photos=(s.docs||[]).filter(docHasPhoto512);
  const selected=photos.filter(photoReportSelected526);
  const deficiency=selected.filter(d=>d.linkedDeficiencyId || photoCategory524(d)==="Deficiency").length;
  const beforeAfter=selected.filter(d=>["Before","After"].includes(photoCategory524(d))).length;
  const captioned=selected.filter(d=>String(d.customerCaption||"").trim()).length;
  return {photos, selected, deficiency, beforeAfter, captioned};
}
function reportPhotoCopyText527(s={}){
  const {photos,selected}=reportPhotoSummary527(s);
  const lines=[`FireVault Customer Report Photos - ${s.name||"Site"}`, `${selected.length} selected of ${photos.length} saved photo${photos.length===1?"":"s"}`];
  if(!selected.length){
    lines.push("No photos selected.");
    return lines.join("\n");
  }
  selected.forEach((d,i)=>{
    lines.push(`${i+1}. ${reportPhotoLabel526(d)}`);
    if(d.linkedDeficiencyTitle) lines.push(`   Deficiency: ${d.linkedDeficiencyTitle}`);
    if(d.customerCaption) lines.push(`   Customer caption: ${String(d.customerCaption).replaceAll("\n","\n   ")}`);
    if(d.notes) lines.push(`   Internal notes: ${String(d.notes).replaceAll("\n","\n   ")}`);
  });
  return lines.join("\n");
}

async function copyReportPhotoList527(){
  const s=site(); if(!s) return;
  try{ await navigator.clipboard.writeText(reportPhotoCopyText527(s)); toast("Customer photo list copied."); }
  catch{ toast("Clipboard unavailable."); }
}
function customerPhotoSummary529(s={}){
  const selected=reportPhotos526(s);
  const tech=data.settings.technician||{};
  const lines=[
    `FireVault Customer Photo Summary`,
    `Site: ${s.name||"Unnamed Site"}`,
    `Address: ${fullAddress(s)}`,
    `Date: ${fmtDate()}`,
    tech.company?`Company: ${tech.company}`:"",
    ""
  ].filter(x=>x!=="");
  if(!selected.length){
    lines.push("No photos are selected for the customer report yet.");
    return lines.join("\n");
  }
  lines.push(`${selected.length} photo${selected.length===1?"":"s"} selected for customer report:`);
  selected.forEach((d,i)=>{
    const label=reportPhotoLabel526(d);
    lines.push(`${i+1}. ${label}`);
    if(d.customerCaption) lines.push(`   ${String(d.customerCaption).replaceAll("\n","\n   ")}`);
    if(d.linkedDeficiencyTitle) lines.push(`   Related deficiency: ${d.linkedDeficiencyTitle}`);
  });
  lines.push("", "Generated by FireVault", `Build: ${BUILD}`);
  return lines.join("\n");
}
async function copyCustomerPhotoSummary529(){
  const s=site(); if(!s) return;
  try{ await navigator.clipboard.writeText(customerPhotoSummary529(s)); toast("Customer photo summary copied."); }
  catch{ toast("Clipboard unavailable."); }
}

function customerCloseoutEmail538(s={}){
  const tech=data.settings.technician||{};
  const subject=renderTemplate(data.settings.email.defaultSubject||"FireVault Report - {site_name} - {date}", s) || `FireVault Report - ${s.name||"Site"}`;
  const selected=reportPhotos526(s);
  const ready=customerReportPhotoReady530(s);
  const lines=[
    `Subject: ${subject}`,
    "",
    `Hello,`,
    "",
    `Attached / included is the FireVault service summary for ${s.name||"the site"}.`,
    fullAddress(s)?`Site address: ${fullAddress(s)}`:"",
    "",
    selected.length?`Customer report photos: ${selected.length} selected${ready.issues.length?` (${ready.issues.join("; ")})`:" and ready"}.`:"No customer report photos are selected yet.",
    ""
  ].filter(x=>x!=="");
  if(selected.length){
    lines.push("Photo summary:");
    selected.forEach((d,i)=>{
      lines.push(`${i+1}. ${d.customerCaption ? String(d.customerCaption).replaceAll("\n"," ") : reportPhotoLabel526(d)}`);
    });
    lines.push("");
  }
  lines.push("Please let me know if you have any questions.");
  if(tech.name || tech.company || tech.phone || tech.email){
    lines.push("", [tech.name, tech.company, tech.phone, tech.email].filter(Boolean).join("\n"));
  }
  lines.push("", `Generated by FireVault Build ${BUILD}`);
  return lines.join("\n");
}
async function copyCustomerCloseoutEmail538(){
  const s=site(); if(!s) return;
  try{ await navigator.clipboard.writeText(customerCloseoutEmail538(s)); toast("Customer closeout email copied."); }
  catch{ toast("Clipboard unavailable."); }
}

function customerCloseoutPacket539(s={}){
  const stats=reportPhotoSummary527(s);
  const ready=customerReportPhotoReady530(s);
  const blocks=[
    customerCloseoutEmail538(s),
    "",
    "---",
    "CUSTOMER PHOTO READY CHECK",
    ready.issues.length ? ready.issues.map(x=>`- ${x}`).join("\n") : "- Ready: selected customer photos have captions.",
    `- Selected photos: ${stats.selected.length}`,
    `- Captioned photos: ${stats.captioned}`,
    "",
    "---",
    customerPhotoSummary529(s)
  ];
  return blocks.join("\n");
}
async function copyCustomerCloseoutPacket539(){
  const s=site(); if(!s) return;
  try{ await navigator.clipboard.writeText(customerCloseoutPacket539(s)); toast("Customer closeout packet copied."); }
  catch{ toast("Clipboard unavailable."); }
}

function technicianCloseoutPacket540(s={}){
  const stats=reportPhotoSummary527(s);
  const ready=customerReportPhotoReady530(s);
  const openTasks=(s.tasks||[]).filter(t=>String(t.status||"Open").toLowerCase()!=="complete");
  const openDef=(s.deficiencies||[]).filter(d=>String(d.status||"Open").toLowerCase()!=="complete");
  const lines=[
    `FireVault Technician Closeout Packet`,
    `Site: ${s.name||"Unnamed Site"}`,
    `Address: ${fullAddress(s)}`,
    `Date: ${fmtDate()}`,
    `Build: ${BUILD}`,
    "",
    "CUSTOMER REPORT PHOTOS",
    `Selected: ${stats.selected.length} of ${stats.photos.length}`,
    `Captioned: ${stats.captioned}`,
    `Ready Check: ${ready.label}`
  ];
  if(ready.issues.length) ready.issues.forEach(x=>lines.push(`- ${x}`));
  if(stats.selected.length){
    lines.push("", "SELECTED PHOTOS");
    stats.selected.forEach((d,i)=>{
      lines.push(`${i+1}. ${reportPhotoLabel526(d)}`);
      if(d.customerCaption) lines.push(`   Customer caption: ${String(d.customerCaption).replaceAll("\n","\n   ")}`);
      if(d.notes) lines.push(`   Internal notes: ${String(d.notes).replaceAll("\n","\n   ")}`);
      if(d.linkedDeficiencyTitle) lines.push(`   Linked deficiency: ${d.linkedDeficiencyTitle}`);
    });
  }
  lines.push("", "OPEN TASKS");
  if(openTasks.length) openTasks.slice(0,20).forEach((t,i)=>lines.push(`${i+1}. ${t.title||"Open task"}${t.due?` — Due ${t.due}`:""}`)); else lines.push("None listed.");
  lines.push("", "OPEN DEFICIENCIES");
  if(openDef.length) openDef.slice(0,20).forEach((d,i)=>lines.push(`${i+1}. ${d.title||"Open deficiency"}${d.priority?` — ${d.priority}`:""}`)); else lines.push("None listed.");
  return lines.join("\n");
}
async function copyTechnicianCloseoutPacket540(){
  const s=site(); if(!s) return;
  try{ await navigator.clipboard.writeText(technicianCloseoutPacket540(s)); toast("Technician closeout packet copied."); }
  catch{ toast("Clipboard unavailable."); }
}

function fullCloseoutBundle542(s={}){
  return [
    `FireVault Full Closeout Bundle`,
    `Site: ${s.name||"Unnamed Site"}`,
    `Address: ${fullAddress(s)}`,
    `Date: ${fmtDate()}`,
    `Build: ${BUILD}`,
    "",
    "===== CUSTOMER CLOSEOUT =====",
    customerCloseoutPacket539(s),
    "",
    "===== TECHNICIAN CLOSEOUT =====",
    technicianCloseoutPacket540(s)
  ].join("\n");
}
async function copyFullCloseoutBundle542(){
  const s=site(); if(!s) return;
  try{ await navigator.clipboard.writeText(fullCloseoutBundle542(s)); toast("Full closeout bundle copied."); }
  catch{ toast("Clipboard unavailable."); }
}

function closeoutActionItems543(s={}){
  const ready=customerReportPhotoReady530(s);
  const stats=reportPhotoSummary527(s);
  const openTasks=(s.tasks||[]).filter(t=>String(t.status||"Open").toLowerCase()!=="complete" && String(t.status||"Open").toLowerCase()!=="done");
  const openDef=(s.deficiencies||[]).filter(d=>String(d.status||"Open").toLowerCase()!=="complete" && String(d.status||"Open").toLowerCase()!=="closed");
  const lines=[
    "FireVault Closeout Action Items",
    `Site: ${s.name||"Unnamed Site"}`,
    `Address: ${fullAddress(s)}`,
    `Date: ${fmtDate()}`,
    `Build: ${BUILD}`,
    "",
    "CUSTOMER PHOTO READINESS",
    `- Status: ${ready.label}`,
    `- Selected photos: ${stats.selected.length} of ${stats.photos.length}`,
    `- Captioned photos: ${stats.captioned}`
  ];
  if(ready.issues.length) ready.issues.forEach(x=>lines.push(`- Review: ${x}`));
  else lines.push("- Customer photo section is ready.");
  lines.push("", "OPEN TASKS");
  if(openTasks.length) openTasks.slice(0,25).forEach((t,i)=>lines.push(`${i+1}. ${t.title||"Open task"}${t.due?` — Due ${t.due}`:""}${t.notes?` — ${String(t.notes).split("\n")[0]}`:""}`));
  else lines.push("None listed.");
  lines.push("", "OPEN DEFICIENCIES");
  if(openDef.length) openDef.slice(0,25).forEach((d,i)=>lines.push(`${i+1}. ${d.title||"Open deficiency"}${d.priority?` — ${d.priority}`:""}${d.location?` — ${d.location}`:""}`));
  else lines.push("None listed.");
  lines.push("", "NEXT CLOSEOUT STEP");
  if(ready.issues.length) lines.push("- Finish customer photo captions or adjust selected photos before sending customer copy.");
  else if(openDef.length) lines.push("- Review open deficiencies and decide what should be sent to the customer.");
  else if(openTasks.length) lines.push("- Review remaining open tasks for follow-up.");
  else lines.push("- No open closeout action items detected.");
  return lines.join("\n");
}
async function copyCloseoutActionItems543(){
  const s=site(); if(!s) return;
  try{ await navigator.clipboard.writeText(closeoutActionItems543(s)); toast("Closeout action items copied."); }
  catch{ toast("Clipboard unavailable."); }
}

function defaultCustomerCaption530(d={}){
  const cat=photoCategory524(d)||"Photo";
  const title=d.title||d.imageName||"site photo";
  if(d.linkedDeficiencyTitle) return `Photo documenting deficiency: ${d.linkedDeficiencyTitle}.`;
  if(cat==="Before") return `Before photo: ${title}.`;
  if(cat==="After") return `After photo: ${title}.`;
  if(cat==="Deficiency") return `Deficiency photo: ${title}.`;
  if(cat==="Battery") return `Battery condition photo: ${title}.`;
  if(cat==="Communicator") return `Communicator photo: ${title}.`;
  if(cat==="NAC") return `Notification circuit photo: ${title}.`;
  if(cat==="Device") return `Device photo: ${title}.`;
  if(cat==="Panel") return `Panel photo: ${title}.`;
  return `${cat} photo: ${title}.`;
}
function fillMissingCustomerCaptions530(){
  const s=site(); if(!s) return;
  const selected=reportPhotos526(s);
  let count=0;
  selected.forEach(d=>{
    if(!String(d.customerCaption||"").trim()){
      d.customerCaption=defaultCustomerCaption530(d);
      d.updatedAt=new Date().toISOString();
      count++;
    }
  });
  if(!count){ toast("All selected photos already have captions."); return; }
  save();
  toast(`${count} customer caption${count===1?"":"s"} added.`);
  report();
}
function customerReportPhotoReady530(s={}){
  const {photos,selected,captioned}=reportPhotoSummary527(s);
  const missing=Math.max(0, selected.length-captioned);
  const issues=[];
  if(photos.length && !selected.length) issues.push("No customer photos selected");
  if(missing) issues.push(`${missing} selected photo${missing===1?"":"s"} missing customer captions`);
  return {missing, issues, label:issues.length?"Needs Review":"Ready"};
}
function reportPhotoSelector526(s={}){
  const {photos,selected,deficiency,beforeAfter,captioned}=reportPhotoSummary527(s);
  const ready=customerReportPhotoReady530(s);
  if(!photos.length) return `<div class="card reportPhotos526 reportPhotos527"><div class="reportPhotosHead526"><div><h2>Customer Report Photos</h2><p>No account photos saved yet. Add photos from the account screen or Photo Vault.</p></div><button class="ghost smallBtn" id="reportAddPhoto526">＋ Add Photo</button></div></div>`;
  const selectedSet = selected.slice(0,6).map(d=>`<button type="button" class="reportIncludedThumb527" data-doc="${esc(d.id)}">${docPhotoThumb512(d)}<span>${esc(reportPhotoLabel526(d))}</span></button>`).join("");
  return `<div class="card reportPhotos526 reportPhotos527 reportPhotos530"><div class="reportPhotosHead526"><div><h2>Customer Report Photos</h2><p>${selected.length} of ${photos.length} photo${photos.length===1?"":"s"} selected for the customer package.</p></div><button class="ghost smallBtn" id="reportAddPhoto526">＋ Add Photo</button></div><div class="reportPhotoStats527 reportPhotoStats530"><span><strong>${selected.length}</strong> Included</span><span><strong>${deficiency}</strong> Deficiency</span><span><strong>${beforeAfter}</strong> Before / After</span><span><strong>${captioned}</strong> Captioned</span><span class="${ready.issues.length?"needsReview530":"ready530"}"><strong>${ready.issues.length?ready.missing:0}</strong> ${ready.label}</span></div>${ready.issues.length?`<div class="customerPhotoReady530"><strong>Customer photo check</strong><span>${esc(ready.issues.join(" • "))}</span></div>`:`<div class="customerPhotoReady530 good"><strong>Customer photo check</strong><span>Selected photos are ready for customer summary.</span></div>`}<div class="reportPhotoActions527 reportPhotoActions529"><button type="button" class="ghost smallBtn" id="reportSelectAllPhotos527">Select All</button><button type="button" class="ghost smallBtn" id="reportClearPhotos527">Clear Selected</button><button type="button" class="ghost smallBtn" id="reportFillCaptions530">Auto-Caption Missing</button><button type="button" class="ghost smallBtn" id="reportCopyPhotoList527">Copy Photo List</button><button type="button" class="ghost smallBtn" id="reportCopyCustomerSummary529">Copy Customer Summary</button></div>${selected.length?`<div class="reportIncludedStrip527">${selectedSet}${selected.length>6?`<em>+${selected.length-6} more selected</em>`:""}</div>`:`<p class="fieldNote">No photos selected yet. Tap photos below or use Select All.</p>`}<div class="reportPhotoGrid526 reportPhotoGrid527">${photos.map(d=>`<button type="button" class="reportPhotoPick526 ${photoReportSelected526(d)?"selected":""}" data-doc="${esc(d.id)}">${docPhotoThumb512(d)}<span>${esc(reportPhotoLabel526(d))}</span>${d.customerCaption?`<small class="photoCaptionReady528">Caption ready</small>`:photoReportSelected526(d)?`<small class="photoCaptionMissing530">Needs caption</small>`:""}<em>${photoReportSelected526(d)?"Included":"Tap to include"}</em></button>`).join("")}</div><p class="fieldNote">Auto-Caption Missing creates customer-facing captions from category, title, and linked deficiency info. You can edit them any time in the photo form.</p></div>`;
}
function selectedReportPhotosText526(s={}){
  const photos=reportPhotos526(s);
  if(!photos.length) return "No photos selected for customer report";
  return photos.map((d,i)=>{
    const lines=[`- Photo ${i+1}: ${reportPhotoLabel526(d)}`];
    if(d.linkedDeficiencyTitle) lines.push(`  Deficiency: ${d.linkedDeficiencyTitle}`);
    if(d.customerCaption) lines.push(`  Customer caption: ${String(d.customerCaption).replaceAll("\n","\n  ")}`);
    if(d.notes) lines.push(`  Internal notes: ${String(d.notes).replaceAll("\n","\n  ")}`);
    return lines.join("\n");
  }).join("\n");
}

function photoCategoryHint524(cat){ return PHOTO_CATEGORY_HINTS_524[cat] || PHOTO_CATEGORY_HINTS_524.Other; }
function photoCategoryChips524(active="Panel"){
  return `<div class="photoCategoryGrid524">${PHOTO_CATEGORIES_524.map(cat=>`<button type="button" class="photoCategoryChip524 ${active===cat?"active":""}" data-photo-category="${esc(cat)}"><strong>${esc(cat)}</strong><span>${esc(photoCategoryHint524(cat))}</span></button>`).join("")}</div>`;
}
function selectedPhotoCategory524(){ return document.querySelector(".photoCategoryChip524.active")?.dataset.photoCategory || val("docPhotoCategory524") || "Panel"; }
function setPhotoCategory524(cat){
  const hidden=document.getElementById("docPhotoCategory524");
  if(hidden) hidden.value=cat;
  document.querySelectorAll(".photoCategoryChip524").forEach(b=>b.classList.toggle("active", b.dataset.photoCategory===cat));
}
function photoPreviewModal524(d){
  if(!d || !d.imageData){ toast("No photo to preview."); return; }
  const s=site()||{};
  const overlay=document.createElement("div");
  overlay.className="photoModalOverlay524";
  overlay.innerHTML=`<div class="photoModalSheet524">
    <div class="photoModalHead524"><div><strong>${esc(d.title||d.imageName||"Account Photo")}</strong><span>${esc(photoCategory524(d)||"Photo")} • ${esc(s.name||"Account")}</span></div><button class="ghost smallBtn" id="closePhotoPreview524">Close</button></div>
    <div class="photoModalImage524"><img src="${esc(d.imageData)}" alt="Full account photo preview"></div>
    ${d.customerCaption?`<p class="photoModalCaption528"><strong>Customer Caption</strong>${esc(d.customerCaption)}</p>`:""}
    ${d.notes?`<p class="photoModalNotes524">${esc(d.notes)}</p>`:""}
    <div class="photoModalActions524"><button class="primary" id="modalOverlayPhoto524">Download With Overlay</button><button class="ghost" id="modalOriginalPhoto524">Download Original</button><button class="ghost" id="modalEditPhoto524">Edit Photo</button></div>
  </div>`;
  document.body.appendChild(overlay);
  const close=()=>overlay.remove();
  overlay.addEventListener("click", e=>{ if(e.target===overlay) close(); });
  document.getElementById("closePhotoPreview524").onclick=close;
  document.getElementById("modalOverlayPhoto524").onclick=()=>downloadPhotoWithOverlay512(d);
  document.getElementById("modalOriginalPhoto524").onclick=()=>downloadOriginalPhoto513(d);
  document.getElementById("modalEditPhoto524").onclick=()=>{ close(); mode=d.id; route("siteDocForm"); };
}
function docTitle(d){ return [d.type,d.title].filter(Boolean).join(" • ") || "Document / Link"; }
function docMeta(d){
  const parts=[];
  if(docHasPhoto512(d) && photoCategory524(d)) parts.push(photoCategory524(d));
  if(d.ref) parts.push(d.ref);
  if(d.url) parts.push("Link saved");
  if(d.date) parts.push(d.date);
  return parts.join(" • ") || "No reference details entered";
}
function docReportLine(d){
  const main=`- ${docTitle(d)}${d.ref?` | Ref ${d.ref}`:""}${d.date?` | ${d.date}`:""}${d.url?` | ${d.url}`:""}`;
  const caption=d.customerCaption ? `\n  Customer Caption: ${String(d.customerCaption).replaceAll("\n","\n  ")}` : "";
  const notes=d.notes ? `\n  Notes: ${String(d.notes).replaceAll("\n","\n  ")}` : "";
  return main + caption + notes;
}

function docHasPhoto512(d){ return !!(d && d.imageData); }
function docPhotoThumb512(d){
  return docHasPhoto512(d) ? `<div class="docPhotoThumb512"><img src="${esc(d.imageData)}" alt="Saved site photo thumbnail"></div>` : "";
}
function photoDocSummary512(d){
  const bits=[];
  if(d.imageName) bits.push(d.imageName);
  if(d.imageStampedAt) bits.push("Overlay exported");
  return bits.join(" • ") || "Saved photo available";
}
function safePhotoFileBase512(s,d){
  return `${s?.name||"firevault-site"}-${d?.title||"photo"}`.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"").slice(0,70) || "firevault-photo";
}
function docPhotoPreviewMarkup512(d={}){
  const src=docPhotoDraftDataUrl512 || d.imageData || "";
  const currentCategory=photoCategory524(d)||"Panel";
  const useOverlay = d.useOverlayOnSave !== false;
  return `<div class="docPhotoManager512 docPhotoManager513 docPhotoManager524">
    <div class="docPhotoHead512 docPhotoHead524"><div><strong>Account Photo</strong><span>Take Photo / Upload Photo, choose a category, add notes, then save it to this account.</span></div><button type="button" class="ghost smallBtn" id="openOverlaySettings512">Overlay Settings</button></div>
    <div class="photoQuickLayout524">
      <div class="photoPickerPanel524">
        <label>Take Photo / Upload Photo</label><input id="docPhotoFile512" type="file" accept="image/*" capture="environment">
        <div id="docPhotoPreview512" class="docPhotoPreview512 docPhotoPreview524">${src?`<img src="${esc(src)}" alt="Photo preview">`:`<div><b>No photo selected</b><span>On iPhone / iPad, choose Take Photo or Photo Library when prompted.</span></div>`}</div>
      </div>
      <div class="photoNotesPanel524">
        <label>Photo Category</label><input type="hidden" id="docPhotoCategory524" value="${esc(currentCategory)}">${photoCategoryChips524(currentCategory)}
        <label class="checkRow inlineCheck photoOverlayToggle524"><input type="checkbox" id="docUseOverlay524" ${useOverlay?"checked":""}> Use overlay for this photo</label>
        <label class="checkRow inlineCheck photoReportToggle526"><input type="checkbox" id="docIncludeReport526" ${d.includeInCustomerReport===true?"checked":""}> Include in customer report</label>
        <p class="fieldNote">The overlay setting controls Download With Overlay. Customer report selection controls which photos are listed from Report Center.</p>
      </div>
    </div>
    <div id="docPhotoOverlayPreview513" class="docPhotoOverlayPreview513"></div>
    <div class="docPhotoActions512 docPhotoActions513"><button type="button" class="primary" id="previewOverlayPhoto513">Preview Overlay</button><button type="button" class="primary" id="downloadOverlayPhoto512">Download With Overlay</button><button type="button" class="ghost" id="downloadOriginalPhoto513">Download Original</button><button type="button" class="ghost" id="clearDocPhoto512">Clear Photo</button></div>
  </div>`;
}
function docPhotoOverlayPreviewMarkup513(d={}){
  const src=docPhotoDraftDataUrl512 || d.imageData || "";
  if(!src) return `<div class="empty overlayEmpty513">No photo selected for overlay preview.</div>`;
  const set=overlayCleanSetting510(data.settings.overlay||{});
  const lines=esc(renderTemplate(set.template, site()||{}) || "FireVault Field Photo").replaceAll("\n","<br>");
  const style=`--ovAccent:${esc(set.accentColor)};--ovText:${esc(set.textColor)};--ovAlpha:${Math.max(20,Math.min(100,Number(set.opacity)||85))/100}`;
  const logoSrc=overlayLogoSrc510(set);
  return `<div class="docOverlayCard513" style="${style}">
    <div class="docOverlayHead513"><strong>Overlay Preview</strong><span>This is the stamp layout that will be used for Download With Overlay.</span></div>
    <div class="docPhotoOverlayScene513">
      <img src="${esc(src)}" alt="Photo with overlay preview">
      <div class="photoStamp510 align-${esc(set.alignment)} size-${esc(set.fontSize)} style-${esc(set.backgroundStyle)}">
        ${set.showLogo?`<div class="photoStampLogo510">${logoSrc?`<img src="${esc(logoSrc)}" alt="Overlay logo">`:`<span class="photoStampLogoPlaceholder511">Logo</span>`}</div>`:""}
        <div class="photoStampText510"><div>${lines}</div>${set.showTagline?`<small>FireVault Field Photo Overlay</small>`:""}</div>
      </div>
    </div>
  </div>`;
}
function showDocOverlayPreview513(d={}){
  const holder=document.getElementById("docPhotoOverlayPreview513");
  if(!holder) return;
  holder.innerHTML=docPhotoOverlayPreviewMarkup513(d);
}
function clearDocOverlayPreview513(){
  const holder=document.getElementById("docPhotoOverlayPreview513");
  if(holder) holder.innerHTML="";
}
function downloadOriginalPhoto513(doc={}){
  const s=site();
  const source=doc.imageData || docPhotoDraftDataUrl512;
  if(!source){ toast("Choose or save a photo first."); return; }
  const a=document.createElement("a");
  a.href=source;
  a.download=`${safePhotoFileBase512(s,doc)}-original-build-${BUILD}.jpg`;
  document.body.appendChild(a); a.click(); a.remove();
  toast("Original photo downloaded.");
}
function updateDocPhotoPreview512(){
  const holder=document.getElementById("docPhotoPreview512");
  if(!holder) return;
  const src=docPhotoDraftDataUrl512;
  holder.innerHTML = src ? `<img src="${esc(src)}" alt="Photo preview">` : `<div><b>No photo selected</b><span>Choose an image from camera roll or take a photo on iPhone / iPad.</span></div>`;
  clearDocOverlayPreview513();
}
function loadImage512(src){
  return new Promise((resolve,reject)=>{
    const img=new Image();
    img.onload=()=>resolve(img);
    img.onerror=()=>reject(new Error("Image failed to load"));
    img.src=src;
  });
}
function hexToRgb512(hex){
  const m=String(hex||"").replace("#","").match(/^([0-9a-f]{6})$/i);
  if(!m) return {r:239,g:68,b:68};
  const n=parseInt(m[1],16);
  return {r:(n>>16)&255,g:(n>>8)&255,b:n&255};
}
function roundRect512(ctx,x,y,w,h,r){
  const rr=Math.min(r,w/2,h/2);
  ctx.beginPath();
  ctx.moveTo(x+rr,y);
  ctx.arcTo(x+w,y,x+w,y+h,rr);
  ctx.arcTo(x+w,y+h,x,y+h,rr);
  ctx.arcTo(x,y+h,x,y,rr);
  ctx.arcTo(x,y,x+w,y,rr);
  ctx.closePath();
}
function wrapCanvasText512(ctx,text,maxWidth){
  const words=String(text||"").split(/\s+/).filter(Boolean);
  const lines=[];
  let line="";
  words.forEach(word=>{
    const test=line ? line+" "+word : word;
    if(ctx.measureText(test).width > maxWidth && line){ lines.push(line); line=word; }
    else line=test;
  });
  if(line) lines.push(line);
  return lines.length ? lines : [""];
}
async function downloadPhotoWithOverlay512(doc={}){
  const s=site();
  const source=doc.imageData || docPhotoDraftDataUrl512;
  if(!source){ toast("Choose or save a photo first."); return; }
  try{
    toast("Building overlay photo...");
    const photo=await loadImage512(source);
    const maxW=1800;
    const scale=Math.min(1, maxW/(photo.naturalWidth||photo.width||maxW));
    const w=Math.max(1,Math.round((photo.naturalWidth||photo.width)*scale));
    const h=Math.max(1,Math.round((photo.naturalHeight||photo.height)*scale));
    const canvas=document.createElement("canvas");
    canvas.width=w; canvas.height=h;
    const ctx=canvas.getContext("2d");
    ctx.drawImage(photo,0,0,w,h);
    const set=overlayCleanSetting510(data.settings.overlay||{});
    const accent=hexToRgb512(set.accentColor);
    const alpha=Math.max(.2,Math.min(1,(Number(set.opacity)||85)/100));
    const baseFont=set.fontSize==="large"?Math.round(w*0.032):set.fontSize==="small"?Math.round(w*0.022):Math.round(w*0.027);
    const fontSize=Math.max(18,Math.min(54,baseFont));
    const pad=Math.max(18,Math.round(w*0.018));
    const logoSize=set.showLogo?Math.max(48,Math.min(100,Math.round(w*0.065))):0;
    const rawLines=String(renderTemplate(set.template,s||{})||"FireVault Field Photo").split(/\n/);
    ctx.font=`800 ${fontSize}px Arial, sans-serif`;
    const textMax=set.backgroundStyle==="card"?Math.round(w*.68):w-(pad*5)-logoSize;
    const lines=rawLines.flatMap(line=>wrapCanvasText512(ctx,line,textMax));
    const tagline=set.showTagline ? "FireVault Field Photo Overlay" : "";
    const lineHeight=Math.round(fontSize*1.24);
    const tagHeight=tagline?Math.round(fontSize*.86):0;
    const textH=(lines.length*lineHeight)+tagHeight;
    let stampW=set.backgroundStyle==="card"?Math.min(w-pad*2,Math.max(Math.round(w*.42), Math.max(...lines.map(l=>ctx.measureText(l).width),0)+logoSize+pad*4)):w-pad*2;
    let stampH=Math.max(logoSize+pad*1.4, textH+pad*1.7);
    let x=pad;
    let y=set.alignment==="top"?pad:set.alignment==="middle"?Math.round((h-stampH)/2):h-stampH-pad;
    ctx.save();
    if(set.backgroundStyle==="minimal"){
      ctx.fillStyle=`rgba(0,0,0,${Math.min(.76,alpha)})`;
      ctx.fillRect(x,y,stampW,stampH);
      ctx.fillStyle=`rgba(${accent.r},${accent.g},${accent.b},.95)`;
      ctx.fillRect(x,y,Math.max(8,Math.round(w*.006)),stampH);
    }else{
      roundRect512(ctx,x,y,stampW,stampH,Math.max(18,Math.round(w*.012)));
      ctx.fillStyle=`rgba(0,0,0,${alpha})`;
      ctx.fill();
      ctx.strokeStyle=`rgba(${accent.r},${accent.g},${accent.b},.95)`;
      ctx.lineWidth=Math.max(3,Math.round(w*.003));
      ctx.stroke();
      if(set.backgroundStyle==="bar"){
        const grd=ctx.createLinearGradient(x,y,x+stampW,y);
        grd.addColorStop(0,`rgba(0,0,0,${alpha})`);
        grd.addColorStop(1,`rgba(${accent.r},${accent.g},${accent.b},${Math.min(.82,alpha*.72)})`);
        roundRect512(ctx,x,y,stampW,stampH,Math.max(18,Math.round(w*.012)));
        ctx.fillStyle=grd; ctx.fill();
      }else{
        ctx.fillStyle=`rgba(${accent.r},${accent.g},${accent.b},.95)`;
        ctx.fillRect(x,y,Math.max(8,Math.round(w*.006)),stampH);
      }
    }
    let tx=x+pad;
    if(set.showLogo){
      const logoSrc=overlayLogoSrc510(set);
      if(logoSrc){
        try{
          const logo=await loadImage512(logoSrc);
          const lx=x+pad, ly=y+(stampH-logoSize)/2;
          ctx.save();
          roundRect512(ctx,lx,ly,logoSize,logoSize,Math.round(logoSize*.22));
          ctx.clip();
          ctx.drawImage(logo,lx,ly,logoSize,logoSize);
          ctx.restore();
        }catch{}
      }
      tx+=logoSize+pad;
    }
    ctx.fillStyle=set.textColor||"#ffffff";
    ctx.textBaseline="top";
    ctx.font=`900 ${fontSize}px Arial, sans-serif`;
    let ty=y+Math.max(pad*.75,(stampH-textH)/2);
    lines.forEach(line=>{
      ctx.fillText(line,tx,ty);
      ty+=lineHeight;
    });
    if(tagline){
      ctx.font=`800 ${Math.max(12,Math.round(fontSize*.62))}px Arial, sans-serif`;
      ctx.fillStyle="rgba(255,255,255,.78)";
      ctx.fillText(tagline,tx,ty+Math.round(fontSize*.1));
    }
    ctx.restore();
    canvas.toBlob(blob=>{
      if(!blob){ toast("Could not create overlay photo."); return; }
      const a=document.createElement("a");
      a.href=URL.createObjectURL(blob);
      a.download=`${safePhotoFileBase512(s,doc)}-overlay-build-${BUILD}.jpg`;
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(()=>URL.revokeObjectURL(a.href),1500);
      if(doc && doc.id){ doc.imageStampedAt=new Date().toISOString(); save(); }
      toast("Overlay photo downloaded.");
    },"image/jpeg",0.92);
  }catch(err){
    console.error(err);
    toast("Overlay photo failed.");
  }
}
function wireDocPhotoControls512(d={}){
  const file=document.getElementById("docPhotoFile512");
  if(file) file.onchange=e=>{
    const f=e.target.files && e.target.files[0];
    if(!f) return;
    if(!f.type.startsWith("image/")){ toast("Choose an image file."); return; }
    const reader=new FileReader();
    reader.onload=()=>{
      docPhotoDraftDataUrl512=String(reader.result||"");
      docPhotoDraftName512=f.name || "Site photo";
      docPhotoClearRequested512=false;
      const title=document.getElementById("docTitle");
      if(title && !title.value.trim()) title.value=f.name.replace(/\.[^.]+$/,'');
      const type=document.getElementById("docType");
      if(type) type.value="Photo Set";
      updateDocPhotoPreview512();
      toast("Photo loaded. Save document to keep it.");
    };
    reader.readAsDataURL(f);
  };
  const clear=document.getElementById("clearDocPhoto512");
  if(clear) clear.onclick=()=>{
    docPhotoDraftDataUrl512="";
    docPhotoDraftName512="";
    docPhotoClearRequested512=true;
    const file=document.getElementById("docPhotoFile512");
    if(file) file.value="";
    updateDocPhotoPreview512();
  };
  const preview=document.getElementById("previewOverlayPhoto513");
  if(preview) preview.onclick=()=>showDocOverlayPreview513({...(d||{}),title:val("docTitle")||d.title||"Site Photo",imageData:docPhotoDraftDataUrl512||d.imageData});
  const down=document.getElementById("downloadOverlayPhoto512");
  if(down) down.onclick=()=>downloadPhotoWithOverlay512({...(d||{}),title:val("docTitle")||d.title||"Site Photo",imageData:docPhotoDraftDataUrl512||d.imageData});
  const original=document.getElementById("downloadOriginalPhoto513");
  if(original) original.onclick=()=>downloadOriginalPhoto513({...(d||{}),title:val("docTitle")||d.title||"Site Photo",imageData:docPhotoDraftDataUrl512||d.imageData});
  document.querySelectorAll(".photoCategoryChip524").forEach(b=>b.onclick=()=>setPhotoCategory524(b.dataset.photoCategory||"Panel"));
  const settingsBtn=document.getElementById("openOverlaySettings512");
  if(settingsBtn) settingsBtn.onclick=()=>{ settingsTab="overlay"; mode="settingsDetail"; route("settings"); };
}
function docVaultFilterLabel516(key){
  return key === "photos" ? "Photos" : key === "links" ? "Links" : key === "docs" ? "Docs" : "All";
}
function docMatchesVaultFilter516(d){
  if(docVaultFilter516 === "photos") return docHasPhoto512(d);
  if(docVaultFilter516 === "links") return !!d.url;
  if(docVaultFilter516 === "docs") return !docHasPhoto512(d) && !d.url;
  return true;
}
function docMatchesSearch521(d){
  const q=String(docVaultSearch521||"").trim().toLowerCase();
  if(!q) return true;
  const hay=[d.type,d.title,d.ref,d.url,d.notes,d.customerCaption,d.imageName,d.imageStampedAt,d.linkedDeficiencyTitle,d.linkedDeficiencyId].filter(Boolean).join(" ").toLowerCase();
  return hay.includes(q);
}
function docVaultSearchBar521(){
  return `<div class="docSearchBar521"><span>⌕</span><input id="docVaultSearch521" value="${esc(docVaultSearch521)}" placeholder="Search photos, documents, links, notes..." autocomplete="off"><button type="button" class="ghost smallBtn" id="clearDocSearch521">Clear</button></div>`;
}
function docSortTime522(d){
  const ts=Date.parse(d.imageUpdatedAt || d.createdAt || d.date || 0);
  return Number.isFinite(ts) ? ts : 0;
}
function sortedDocs522(docs){
  const rows=[...(docs||[])];
  if(docVaultSort522 === "title") return rows.sort((a,b)=>docTitle(a).localeCompare(docTitle(b)) || docSortTime522(b)-docSortTime522(a));
  if(docVaultSort522 === "type") return rows.sort((a,b)=>String(a.type||"").localeCompare(String(b.type||"")) || docTitle(a).localeCompare(docTitle(b)));
  if(docVaultSort522 === "photos") return rows.sort((a,b)=>(Number(docHasPhoto512(b))-Number(docHasPhoto512(a))) || docSortTime522(b)-docSortTime522(a));
  return rows.sort((a,b)=>docSortTime522(b)-docSortTime522(a));
}
function docVaultSortControls522(){
  return `<div class="docSortBar522"><label for="docVaultSort522">Sort</label><select id="docVaultSort522"><option value="recent" ${docVaultSort522==="recent"?"selected":""}>Newest first</option><option value="photos" ${docVaultSort522==="photos"?"selected":""}>Photos first</option><option value="title" ${docVaultSort522==="title"?"selected":""}>Title A-Z</option><option value="type" ${docVaultSort522==="type"?"selected":""}>Type</option></select><button type="button" class="ghost smallBtn" id="copyDocVaultList522">Copy List</button></div>`;
}
function docVaultListText522(s, docs){
  const rows=docs&&docs.length ? docs : [];
  return [`FireVault Document / Photo Vault`, `Site: ${s.name||"Site"}`, `Build: ${BUILD}`, `Records: ${rows.length}`, ``].concat(rows.map((d,i)=>`${i+1}. ${docTitle(d)}\n   ${docMeta(d)}${d.url?`\n   Link: ${d.url}`:""}${d.customerCaption?`\n   Customer Caption: ${String(d.customerCaption).replaceAll("\n"," ")}`:""}${d.notes?`\n   Notes: ${String(d.notes).replaceAll("\n"," ")}`:""}`)).join("\n");
}
function docVaultFilterBar516(docs){
  const counts={
    all:docs.length,
    photos:docs.filter(docHasPhoto512).length,
    links:docs.filter(d=>!!d.url).length,
    docs:docs.filter(d=>!docHasPhoto512(d) && !d.url).length
  };
  return `<div class="docFilterBar516">${["all","photos","links","docs"].map(key=>`<button type="button" class="docFilterBtn516 ${docVaultFilter516===key?"active":""}" data-doc-filter="${key}"><strong>${docVaultFilterLabel516(key)}</strong><span>${counts[key]}</span></button>`).join("")}</div>`;
}
function siteDocCard519(d){
  const notesPreview = d.notes ? esc(String(d.notes).split(/\r?\n/).slice(0,2).join(" • ")) : "";
  return `<div class="card docVaultItem docVaultItem512 docVaultItem516" data-doc="${esc(d.id)}">
    ${docPhotoThumb512(d)}
    <div class="docVaultText512">
      <div class="row"><div><h2>${esc(docTitle(d))}</h2><p>${esc(docMeta(d))}</p>${docHasPhoto512(d)?`<p class="docPhotoMeta512"><span class="photoCategoryPill524">${esc(photoCategory524(d)||"Photo")}</span> ${d.linkedDeficiencyTitle?`<span class="photoDefLink525">Deficiency: ${esc(d.linkedDeficiencyTitle)}</span>`:esc(photoDocSummary512(d))}</p>`:""}</div><span class="pill">${esc(d.type||"Doc")}</span></div>
      ${notesPreview?`<p class="docNotes">${notesPreview}</p>`:""}
      <div class="docQuickActions">
        ${d.url?`<button class="ghost smallBtn openDocLink" data-url="${esc(d.url)}">Open Link</button>`:""}
        ${docHasPhoto512(d)?`<button class="primary smallBtn previewDocPhotoBtn524" data-doc="${esc(d.id)}">Preview</button><button class="primary smallBtn overlayDocPhotoBtn512" data-doc="${esc(d.id)}">Overlay Photo</button><button class="ghost smallBtn originalDocPhotoBtn516" data-doc="${esc(d.id)}">Original</button>`:""}
        <button class="ghost smallBtn copyDocRef" data-doc="${esc(d.id)}">Copy</button>
      </div>
    </div>
  </div>`;
}
function siteDocs(){
  const s=site(); if(!s){ route("sites"); return; }
  s.docs=Array.isArray(s.docs) ? s.docs : [];
  const docs=s.docs;
  const linked=docs.filter(d=>d.url).length;
  const photos=docs.filter(docHasPhoto512).length;
  const filteredDocs=sortedDocs522(docs.filter(docMatchesVaultFilter516).filter(docMatchesSearch521));
  const docListHtml = filteredDocs.length ? filteredDocs.map(siteDocCard519).join("") : `<div class="empty">No ${esc(docVaultFilterLabel516(docVaultFilter516).toLowerCase())} records found${docVaultSearch521?` for “${esc(docVaultSearch521)}”`:""}. Tap + to add a document, link, or field photo.</div>`;
  html(`<div class="screen docsScreen docsScreen512 docsScreen516"><div class="row"><button class="back ghost" id="backBtn">←</button><div><h1>Documents / Photos</h1><p>${esc(s.name||"Site")}</p></div><button class="primary" id="addDocBtn">＋</button></div>
    <div class="card docsHero docsHero516 docsHero521"><h2>Site Documents / Photo Vault</h2><p>Keep customer-specific references, links, and field photos. Use the buttons below for the common actions.</p><div class="docHeroActions523"><button class="primary" id="addPhotoBtn523">＋ Add Photo</button><button class="ghost" id="addRegularDocBtn523">＋ Add Document / Link</button></div><div class="docStats"><span><strong>${docs.length}</strong>Total</span><span><strong>${photos}</strong>Photos</span><span><strong>${linked}</strong>Links</span></div>${docVaultSearchBar521()}${docVaultSortControls522()}${docVaultFilterBar516(docs)}</div>
    <div class="list grow docsList">${docListHtml}</div>
  </div>`);
  document.getElementById("backBtn").onclick=()=>route("siteDetail");
  document.getElementById("addDocBtn").onclick=()=>{mode="newPhoto"; route("siteDocForm");};
  const addPhotoBtn523=document.getElementById("addPhotoBtn523"); if(addPhotoBtn523) addPhotoBtn523.onclick=()=>{mode="newPhoto"; route("siteDocForm");};
  const addRegularDocBtn523=document.getElementById("addRegularDocBtn523"); if(addRegularDocBtn523) addRegularDocBtn523.onclick=()=>{mode=null; route("siteDocForm");};
  const docSearch=document.getElementById("docVaultSearch521"); if(docSearch) docSearch.oninput=()=>{docVaultSearch521=docSearch.value; siteDocs();};
  const clearDocSearch=document.getElementById("clearDocSearch521"); if(clearDocSearch) clearDocSearch.onclick=()=>{docVaultSearch521=""; siteDocs();};
  const docSort=document.getElementById("docVaultSort522"); if(docSort) docSort.onchange=()=>{docVaultSort522=docSort.value||"recent"; siteDocs();};
  const copyDocList=document.getElementById("copyDocVaultList522"); if(copyDocList) copyDocList.onclick=async()=>{try{await navigator.clipboard.writeText(docVaultListText522(s, filteredDocs)); toast("Document list copied.");}catch{toast("Clipboard unavailable.");}};
  document.querySelectorAll(".docFilterBtn516").forEach(b=>b.onclick=e=>{e.stopPropagation(); docVaultFilter516=b.dataset.docFilter||"all"; siteDocs();});
  document.querySelectorAll(".docVaultItem").forEach(b=>b.onclick=()=>{mode=b.dataset.doc; route("siteDocForm");});
  document.querySelectorAll(".openDocLink").forEach(b=>b.onclick=e=>{e.stopPropagation(); window.open(b.dataset.url,"_blank");});
  document.querySelectorAll(".copyDocRef").forEach(b=>b.onclick=async e=>{e.stopPropagation(); const d=docs.find(x=>x.id===b.dataset.doc); if(d){ await navigator.clipboard.writeText(`${docTitle(d)}
${d.url||""}
${d.customerCaption?`Customer Caption: ${d.customerCaption}`:""}
${d.notes||""}`.trim()); toast("Document reference copied."); }});
  document.querySelectorAll(".previewDocPhotoBtn524").forEach(b=>b.onclick=e=>{e.stopPropagation(); const d=docs.find(x=>x.id===b.dataset.doc); if(d) photoPreviewModal524(d);});
  document.querySelectorAll(".overlayDocPhotoBtn512").forEach(b=>b.onclick=e=>{e.stopPropagation(); const d=docs.find(x=>x.id===b.dataset.doc); if(d) downloadPhotoWithOverlay512(d);});
  document.querySelectorAll(".originalDocPhotoBtn516").forEach(b=>b.onclick=e=>{e.stopPropagation(); const d=docs.find(x=>x.id===b.dataset.doc); if(d) downloadOriginalPhoto513(d);});
}


function siteDocForm(){
  const s=site(); if(!s){ route("sites"); return; }
  s.docs=Array.isArray(s.docs) ? s.docs : [];
  const isDefPhoto525 = typeof mode === "string" && mode.startsWith("defPhoto:");
  const linkedDefId525 = isDefPhoto525 ? mode.slice("defPhoto:".length) : "";
  const linkedDef525 = linkedDefId525 ? (s.deficiencies||[]).find(x=>x.id===linkedDefId525) : null;
  const isNewPhoto523 = mode === "newPhoto" || isDefPhoto525;
  const d=(mode && !isNewPhoto523) ? s.docs.find(x=>x.id===mode) : {};
  docPhotoDraftDataUrl512 = d?.imageData || "";
  docPhotoDraftName512 = d?.imageName || "";
  docPhotoClearRequested512 = false;
  const types=["Panel Manual","Permit","Inspection Form","Monitoring Account","Contract","Photo Set","Map / Drawing","Code Reference","Other"];
  const formTitle523 = mode && !isNewPhoto523 ? "Edit Document / Photo" : isDefPhoto525 ? "Add Deficiency Photo" : isNewPhoto523 ? "Add Account Photo" : "Add Document / Link";
  const defaultType523 = isNewPhoto523 ? "Photo Set" : "Panel Manual";
  const defaultTitle523 = isDefPhoto525 ? `Deficiency Photo - ${linkedDef525?.title||"Issue"}` : isNewPhoto523 ? "Site Photo" : "";
  html(`<div class="screen"><div class="row"><button class="back ghost" id="backBtn">←</button><h1>${formTitle523}</h1></div><div class="form grow">
    ${isNewPhoto523?`<div class="card addPhotoHint523"><strong>${isDefPhoto525?"Add Photo to Deficiency":"Add Photo to Account"}</strong><span>${isDefPhoto525?`This photo will be linked directly to: ${esc(linkedDef525?.title||"Deficiency")}.`:"Choose a photo, add a title or notes, then save it to this account’s Photo Vault."}</span></div>`:""}
    <div class="card docFormCard docFormCard512"><div class="compactField"><div><label>Type</label><select id="docType">${types.map(x=>`<option value="${esc(x)}" ${((d.type||defaultType523)===x)?"selected":""}>${esc(x)}</option>`).join("")}</select></div><div><label>Date / Revision</label><input id="docDate" value="${esc(d.date||"")}" placeholder="Rev, date, or version"></div></div>
    <label>Title</label><input id="docTitle" value="${esc(d.title||defaultTitle523)}" placeholder="Panel cabinet photo, SLC module, NAC wiring, deficiency photo...">
    <label>Reference / Account / Permit #</label><input id="docRef" value="${esc(d.ref||"")}" placeholder="Account number, permit number, drawing ID...">
    <label>URL / Link</label><input id="docUrl" value="${esc(d.url||"")}" placeholder="https://...">
    ${docPhotoPreviewMarkup512(d)}
    <label>Photo / Document Notes</label><textarea id="docNotes" class="photoNotesField524" placeholder="Internal field notes: device address, circuit, problem found, parts needed...">${esc(d.notes||"")}</textarea>
    <label>Customer Photo Caption</label><textarea id="docCustomerCaption528" class="photoCaptionField528" placeholder="Short customer-facing caption for reports, for example: Battery dated 2019 and due for replacement.">${esc(d.customerCaption||"")}</textarea><p class="fieldNote">Customer captions appear in customer report photo lists. Internal notes stay available for technician detail.</p></div>
    <button class="primary" id="saveDocBtn">Save Document</button>${mode && !isNewPhoto523?`<button class="danger" id="deleteDocBtn">Delete Document</button>`:""}
  </div></div>`);
  document.getElementById("backBtn").onclick=()=>route("siteDocs");
  wireDocPhotoControls512(d||{});
  document.getElementById("saveDocBtn").onclick=()=>{
    const imageData=docPhotoClearRequested512 ? "" : (docPhotoDraftDataUrl512 || d?.imageData || "");
    const obj={type:val("docType"),title:val("docTitle")||"Untitled Reference",ref:isDefPhoto525?"Deficiency":val("docRef"),url:val("docUrl"),date:val("docDate"),notes:raw("docNotes"),customerCaption:raw("docCustomerCaption528"),imageData,imageName:imageData?(docPhotoDraftName512||d?.imageName||"Site photo"):"",photoCategory:imageData?(isDefPhoto525?"Deficiency":selectedPhotoCategory524()):"",useOverlayOnSave:checked("docUseOverlay524"),imageUpdatedAt:imageData?new Date().toISOString():"",updatedAt:new Date().toISOString(),linkedDeficiencyId:isDefPhoto525?linkedDefId525:(d?.linkedDeficiencyId||""),linkedDeficiencyTitle:isDefPhoto525?(linkedDef525?.title||""):(d?.linkedDeficiencyTitle||""),includeInCustomerReport:imageData?checked("docIncludeReport526"):false};
    if(mode && !isNewPhoto523 && d){ Object.assign(d,obj); }
    else s.docs.unshift({...obj,id:uid(),createdAt:new Date().toISOString()});
    save(); toast(isDefPhoto525?"Deficiency photo saved.":"Document saved."); if(isDefPhoto525){ mode=linkedDefId525; route("deficiencyForm"); } else route("siteDocs");
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
    <div class="list grow">${siteVisits.length?siteVisits.map(v=>`<button class="card visitLogItem" data-visit="${esc(v.id)}"><div class="row"><div><h2>${esc(visitDateLabel(v))}</h2><p>${esc(visitTimeRange(v))} • ${esc(durationText(v.startedAt,v.endedAt))}</p></div><span class="pill">${esc(v.type||"Visit")}</span></div><p>${esc(visitNotesPreview(v,3))}</p></button>`).join(""):`<div class="empty">Use Add Note on the customer screen to create site notes for this account.</div>`}</div>
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
function deficiencyPhotos525(s={}, d={}){
  const defId=d?.id || "";
  if(!defId) return [];
  return (s.docs||[]).filter(doc=>docHasPhoto512(doc) && doc.linkedDeficiencyId===defId);
}
function deficiencyPhotoStrip525(s,d,limit=3){
  const photos=deficiencyPhotos525(s,d);
  if(!photos.length) return "";
  return `<div class="defPhotoStrip525">${photos.slice(0,limit).map(doc=>`<button type="button" class="defPhotoThumb525" data-site="${esc(s.id)}" data-doc="${esc(doc.id)}">${docPhotoThumb512(doc)}<span>${esc(doc.title||doc.imageName||"Deficiency Photo")}</span></button>`).join("")}${photos.length>limit?`<em>+${photos.length-limit} more</em>`:""}</div>`;
}
function addDeficiencyPhoto525(siteId, defId){
  const s=ensureSite(data.sites.find(x=>x.id===siteId));
  const d=(s.deficiencies||[]).find(x=>x.id===defId);
  if(!s || !d){ toast("Save the deficiency first, then add a photo."); return; }
  selectedSiteId=s.id;
  mode=`defPhoto:${d.id}`;
  route("siteDocForm");
}
function saveDeficiencyFromForm525(openPhotoAfter=false){
  const target=ensureSite(data.sites.find(x=>x.id===val("sitePick")) || site());
  if(!target){ toast("Choose a site first."); return; }
  target.deficiencies=target.deficiencies||[];
  target.tasks=target.tasks||[];
  const obj={title:val("title")||"Untitled Deficiency",priority:val("priority"),status:val("status"),notes:raw("notes"),updatedAt:new Date().toISOString()};
  let savedDef=null;
  if(mode && !String(mode).startsWith("defPhoto:")){
    savedDef=target.deficiencies.find(x=>x.id===mode) || (site()?.deficiencies||[]).find(x=>x.id===mode);
    if(savedDef){
      const wasClosed=deficiencyClosed(savedDef);
      Object.assign(savedDef,obj);
      if(obj.status==="Closed" && !wasClosed) savedDef.resolvedAt=new Date().toISOString();
      if(obj.status!=="Closed") delete savedDef.resolvedAt;
    }
  }
  if(!savedDef){
    savedDef={...obj,id:uid(),createdAt:new Date().toISOString()};
    if(savedDef.status==="Closed") savedDef.resolvedAt=new Date().toISOString();
    target.deficiencies.unshift(savedDef);
    if(checked("makeTask")) target.tasks.unshift({id:uid(),title:"Resolve: "+obj.title,status:"Open",due:"",notes:obj.notes,createdAt:new Date().toISOString()});
  }
  selectedSiteId=target.id;
  save();
  if(openPhotoAfter){ toast("Deficiency saved. Add photo next."); addDeficiencyPhoto525(target.id,savedDef.id); return; }
  toast("Deficiency saved.");
  route("deficiencies");
}
function deficiencyCard(r){
  const d=r.d;
  const closed=deficiencyClosed(d);
  const sev=(d.priority||"Normal").toLowerCase();
  const photoCount=deficiencyPhotos525(r.s,d).length;
  return `<div class="card siteItem deficiencyCard439 deficiencyCard525 ${closed?"defClosed":""} def-${esc(sev)}" data-site="${esc(r.s.id)}" data-id="${esc(d.id)}">
    <div class="defCardTop"><div><h2>${esc(d.title||"Deficiency")}</h2><p>${esc(r.s.name||"Site")} • ${esc(deficiencyAgeLine(d))}</p></div><span class="pill ${closed?"defDonePill":sev==="critical"?"dangerPill":sev==="high"?"todayPill":""}">${esc(closed?"Closed":(d.priority||"Normal"))}</span></div>
    ${d.notes?`<p class="defNotes">${esc(d.notes)}</p>`:""}
    ${photoCount?`<p class="defPhotoCount525">${photoCount} linked deficiency photo${photoCount===1?"":"s"}</p>`:""}
    ${deficiencyPhotoStrip525(r.s,d)}
    <div class="defMeta">${d.checklistId?`<span>Checklist Issue</span>`:""}${d.resolvedAt?`<span>Closed ${esc(new Date(d.resolvedAt).toLocaleDateString())}</span>`:""}<span>${esc(d.status||"Open")}</span></div>
    <div class="defQuickActions"><button class="ghost smallBtn defSiteBtn" data-site="${esc(r.s.id)}">Site</button><button class="ghost smallBtn defAddPhotoBtn525" data-site="${esc(r.s.id)}" data-id="${esc(d.id)}">＋ Photo</button><button class="${closed?"ghost":"primary"} smallBtn defResolveBtn" data-site="${esc(r.s.id)}" data-id="${esc(d.id)}">${closed?"Reopen":"Close"}</button></div>
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
  document.querySelectorAll(".defAddPhotoBtn525").forEach(b=>b.onclick=e=>{e.stopPropagation(); addDeficiencyPhoto525(b.dataset.site,b.dataset.id);});
  document.querySelectorAll(".defPhotoThumb525").forEach(b=>b.onclick=e=>{e.stopPropagation(); const s=ensureSite(data.sites.find(x=>x.id===b.dataset.site)); const doc=(s.docs||[]).find(x=>x.id===b.dataset.doc); if(doc) photoPreviewModal524(doc);});
}
function deficiencyForm(){
  const s = selectedSiteId ? site() : data.sites[0]; if(!s){ alert("Add a site first."); route("sites"); return; }
  const d = mode ? (s.deficiencies||[]).find(x=>x.id===mode) : {};
  const linkedPhotos = d?.id ? deficiencyPhotos525(s,d) : [];
  html(`<div class="screen deficiencyForm525"><div class="row"><button class="back ghost" id="backBtn">←</button><h1>${mode?"Edit":"Add"} Deficiency</h1></div><div class="form grow"><div class="card deficiencyFormCard525"><label>Site</label><select id="sitePick">${data.sites.map(x=>`<option value="${x.id}" ${x.id===s.id?"selected":""}>${esc(x.name)}</option>`).join("")}</select><label>Title</label><input id="title" value="${esc(d.title||"")}" placeholder="Smoke detector trouble, NAC open, battery date, ground fault..."><div class="compactField"><div><label>Priority</label><select id="priority">${["Normal","High","Critical"].map(x=>`<option ${d.priority===x?"selected":""}>${x}</option>`).join("")}</select></div><div><label>Status</label><select id="status"><option ${d.status!=="Closed"?"selected":""}>Open</option><option ${d.status==="Closed"?"selected":""}>Closed</option></select></div></div><label>Notes</label><textarea id="notes" placeholder="Problem found, device location, circuit, parts needed, customer impact...">${esc(d.notes||"")}</textarea>${!mode?`<label><input type="checkbox" id="makeTask" checked> Create matching follow-up task</label>`:""}</div>
    <div class="card defPhotoPanel525"><div class="row"><div><h2>Deficiency Photos</h2><p>${linkedPhotos.length?`${linkedPhotos.length} photo${linkedPhotos.length===1?"":"s"} linked to this deficiency.`:"Attach proof photos, before/after photos, device photos, or wiring photos directly to this deficiency."}</p></div>${mode?`<button class="primary smallBtn" id="addDefPhoto525">＋ Add Photo</button>`:""}</div>${mode?deficiencyPhotoStrip525(s,d,6):`<p class="fieldNote">Save this deficiency first, or use Save + Add Photo below.</p>`}</div>
    <button class="primary" id="saveBtn">Save Deficiency</button><button class="ghost" id="saveAddPhotoBtn525">Save + Add Photo</button>${mode?`<button class="danger" id="delBtn">Delete Deficiency</button>`:""}</div></div>`);
  document.getElementById("backBtn").onclick=()=>route("deficiencies");
  document.getElementById("saveBtn").onclick=()=>saveDeficiencyFromForm525(false);
  document.getElementById("saveAddPhotoBtn525").onclick=()=>saveDeficiencyFromForm525(true);
  const addPhoto=document.getElementById("addDefPhoto525"); if(addPhoto) addPhoto.onclick=()=>addDeficiencyPhoto525(s.id,d.id);
  document.querySelectorAll(".defPhotoThumb525").forEach(b=>b.onclick=e=>{e.preventDefault(); const doc=(s.docs||[]).find(x=>x.id===b.dataset.doc); if(doc) photoPreviewModal524(doc);});
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
    photos:true,
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
    ["deficiencies","Deficiencies"], ["notes","Notes"], ["photos","Photos"], ["email","Email"]
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
  if(opts.photos) sections.push(["CUSTOMER REPORT PHOTOS", selectedReportPhotosText526(s)]);
  if(opts.email) sections.push(["EMAIL SUBJECT", renderTemplate(set.email.defaultSubject,s) || "FireVault Report"]), sections.push(["SIGNATURE", renderTemplate(set.email.signature,s) || "No signature template entered"]);
  return reportJoin(sections);
}
function renderTemplate(t,s={}){
  const tech=data.settings.technician||{};
  const now=new Date();
  const gps=hasGps(s) ? `${Number(s.gps.lat).toFixed(6)}, ${Number(s.gps.lng).toFixed(6)}` : "No GPS saved";
  const tokens={
    "{site_name}":s.name||"",
    "{address}":fullAddress(s),
    "{city}":s.city||"",
    "{state}":s.state||"",
    "{zip}":s.zip||"",
    "{date}":fmtDate(now),
    "{time}":now.toLocaleTimeString([], {hour:"numeric",minute:"2-digit"}),
    "{technician}":tech.name||"",
    "{company}":tech.company||"",
    "{phone}":tech.phone||"",
    "{email}":tech.email||"",
    "{license}":tech.license||"",
    "{gps}":gps,
    "{build}":BUILD
  };
  return Object.entries(tokens).reduce((out,[key,value])=>out.replaceAll(key,value), String(t||""));
}
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


/* Build 0.50.75 Customer Report Preview helpers */
function customerReportPreviewStats555(s={}){
  const selected=reportPhotos526(s);
  const ready=customerReportPhotoReady530(s);
  const stats=reportPhotoSummary527(s);
  return {
    selected:selected.length,
    captioned:stats.captioned || 0,
    issues:ready.issues || [],
    ready:(ready.issues || []).length===0
  };
}
function customerReportPreviewHtml555(s={}){
  const preview=customerCloseoutPacket539(s);
  const p=customerReportPreviewStats555(s);
  return `<div class="card customerPreview555">
    <div class="customerPreviewHead555">
      <div><h2>Customer Report Preview</h2><p>Review the customer-facing closeout before copying or sending it.</p></div>
      <span class="${p.ready?"previewReady555":"previewReview555"}">${p.ready?"Ready":"Review"}</span>
    </div>
    <div class="customerPreviewStats555">
      <div><strong>${p.selected}</strong><span>Selected Photos</span></div>
      <div><strong>${p.captioned}</strong><span>Captioned</span></div>
      <div><strong>${p.issues.length}</strong><span>Issues</span></div>
    </div>
    ${p.issues.length?`<div class="customerPreviewIssues555">${p.issues.map(x=>`<p>• ${esc(x)}</p>`).join("")}</div>`:`<div class="customerPreviewIssues555 ready"><p>• Customer report photos are ready.</p></div>`}
    <div class="customerPreviewText555">${esc(preview)}</div>
    <div class="customerPreviewActions555">
      <button class="primary" id="copyCustomerPreview555">Copy Preview</button>
      <button class="ghost" id="downloadCustomerPreview555">Download Preview</button>
      <button class="ghost" id="copyCustomerPacketFromPreview555">Copy Packet</button>
    </div>
  </div>`;
}
async function copyCustomerPreview555(){
  const s=site(); if(!s) return;
  try{
    await navigator.clipboard.writeText(customerCloseoutPacket539(s));
    toast("Customer preview copied.");
  }catch{
    toast("Clipboard unavailable.");
  }
}
function downloadCustomerPreview555(){
  const s=site(); if(!s) return;
  const name=(s.name||"site").replace(/\W+/g,"-").replace(/^-|-$/g,"") || "site";
  downloadBlob(`firevault-customer-preview-${name}.txt`, customerCloseoutPacket539(s));
  logReportDelivery(s,"Downloaded Customer Preview", renderTemplate(data.settings.email.defaultSubject,s));
  toast("Customer preview downloaded.");
}
function wireCustomerPreview555(){
  const copy=document.getElementById("copyCustomerPreview555");
  if(copy) copy.onclick=copyCustomerPreview555;
  const download=document.getElementById("downloadCustomerPreview555");
  if(download) download.onclick=downloadCustomerPreview555;
  const packet=document.getElementById("copyCustomerPacketFromPreview555");
  if(packet) packet.onclick=copyCustomerCloseoutPacket539;
}

function report(){
  const s=site(); if(!s){route("sites"); return;}
  const opts=reportSectionState();
  const txt=reportText(s, opts);
  const stats=reportStats(s);
  const subject=renderTemplate(data.settings.email.defaultSubject,s);
  html(`<div class="screen reportScreen440 reportScreen447"><div class="row reportTopRow"><button class="back ghost" id="backBtn">←</button><div><h1>Report Center</h1><p>${esc(s.name||"Site")}</p></div></div>
    <div class="card reportHero440 ${stats.h.cls}"><div><strong>${stats.h.score}%</strong><span>Health</span></div><div><strong>${stats.openTasks.length}</strong><span>Open Tasks</span></div><div><strong>${stats.openDef.length}</strong><span>Deficiencies</span></div><div><strong>${stats.equipmentIssues.length}</strong><span>Equip Issues</span></div></div>
    <div class="reportActionGrid440 reportActionGrid442 reportActionGrid447"><button class="primary" id="shareBtn">Share / Copy</button><button class="ghost" id="emailDraftBtn">Email Draft</button><button class="ghost" id="customerEmailBtn538">Copy Customer Email</button><button class="ghost" id="customerPreviewBtn555">Copy Customer Preview</button><button class="ghost" id="customerPacketBtn539">Copy Closeout Packet</button><button class="ghost" id="techPacketBtn540">Copy Tech Packet</button><button class="ghost" id="fullBundleBtn542">Copy Full Bundle</button><button class="ghost" id="actionItemsBtn543">Copy Action Items</button><button class="ghost" id="copyBtn">Copy TXT</button><button class="ghost" id="downloadBtn">Download</button><button class="ghost" id="subjectBtn">Copy Subject</button></div>
    <div class="card reportReadyCard reportReadyCard442 reportReadyCard447"><div><h2>Ready to Send</h2><p>${esc(subject || "FireVault Report")}</p><small>${esc((data.settings.email.defaultTo || "No default recipient") + (data.settings.email.cc ? ` • CC ${data.settings.email.cc}` : ""))}</small></div><span class="pill ${stats.h.cls}">${esc(stats.h.label)}</span></div>
    ${reportPhotoSelector526(s)}
    <div class="card reportDeliveryCard442 reportDeliveryCard444 reportDeliveryCard447"><div class="reportDeliveryHead"><div><h2>Delivery Log</h2><p>Tap a delivery item to copy a receipt. Add a follow-up task when a report needs customer confirmation.</p></div><div class="reportDeliveryHeadActions"><button class="ghost smallBtn" id="followReportBtn">Follow-Up</button><button class="ghost smallBtn" id="logSentBtn">Log Sent</button></div></div><div class="reportDeliveryList">${reportDeliveryHtml(s)}</div></div>
    <div class="card reportOptions441 reportOptions447"><div class="reportOptionsHead"><div><h2>Report Package</h2><p>Tap sections on/off before sharing, copying, or downloading.</p></div><button class="ghost smallBtn" id="resetReportSections">Reset</button></div><div class="reportSectionGrid441">${reportSectionControls(opts)}</div></div>
    <div class="reportPreviewGrid440 reportPreviewGrid447">${reportPreviewCards(s).map(card=>`<div class="card reportPreviewCard440"><span>${esc(card[0])}</span><h2>${esc(card[1])}</h2>${card[2].map(x=>`<p>${esc(x)}</p>`).join("")}</div>`).join("")}</div>
    ${customerReportPreviewHtml555(s)}
    <div class="card reportBox reportBox440 reportBox447 grow">${esc(txt)}</div></div>`);
  document.getElementById("backBtn").onclick=()=>route("siteDetail");
  const reportAddPhoto526=document.getElementById("reportAddPhoto526"); if(reportAddPhoto526) reportAddPhoto526.onclick=()=>{mode="newPhoto"; route("siteDocForm");};
  document.querySelectorAll(".reportPhotoPick526").forEach(b=>b.onclick=()=>toggleReportPhoto526(b.dataset.doc));
  document.querySelectorAll(".reportIncludedThumb527").forEach(b=>b.onclick=()=>{ const d=(s.docs||[]).find(x=>x.id===b.dataset.doc); if(d) photoPreviewModal524(d); });
  const selectAllPhotos527=document.getElementById("reportSelectAllPhotos527"); if(selectAllPhotos527) selectAllPhotos527.onclick=()=>setAllReportPhotos527(true);
  const clearPhotos527=document.getElementById("reportClearPhotos527"); if(clearPhotos527) clearPhotos527.onclick=()=>setAllReportPhotos527(false);
  const copyPhotoList527=document.getElementById("reportCopyPhotoList527"); if(copyPhotoList527) copyPhotoList527.onclick=copyReportPhotoList527;
  const copyCustomerSummary529=document.getElementById("reportCopyCustomerSummary529"); if(copyCustomerSummary529) copyCustomerSummary529.onclick=copyCustomerPhotoSummary529;
  const fillCaptions530=document.getElementById("reportFillCaptions530"); if(fillCaptions530) fillCaptions530.onclick=fillMissingCustomerCaptions530;
  document.getElementById("shareBtn").onclick=async()=>{ if(await shareReportText(s,txt)){ logReportDelivery(s,"Share / Copy",subject); report(); } };
  document.getElementById("emailDraftBtn").onclick=()=>openReportEmailDraft(s,txt,subject);
  const customerEmailBtn538=document.getElementById("customerEmailBtn538"); if(customerEmailBtn538) customerEmailBtn538.onclick=copyCustomerCloseoutEmail538;
  const customerPreviewBtn555=document.getElementById("customerPreviewBtn555"); if(customerPreviewBtn555) customerPreviewBtn555.onclick=copyCustomerPreview555;
  wireCustomerPreview555();
  const customerPacketBtn539=document.getElementById("customerPacketBtn539"); if(customerPacketBtn539) customerPacketBtn539.onclick=copyCustomerCloseoutPacket539;
  const techPacketBtn540=document.getElementById("techPacketBtn540"); if(techPacketBtn540) techPacketBtn540.onclick=copyTechnicianCloseoutPacket540;
  const fullBundleBtn542=document.getElementById("fullBundleBtn542"); if(fullBundleBtn542) fullBundleBtn542.onclick=copyFullCloseoutBundle542;
  const actionItemsBtn543=document.getElementById("actionItemsBtn543"); if(actionItemsBtn543) actionItemsBtn543.onclick=copyCloseoutActionItems543;
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


function appendSiteNote491(s, text){
  ensureSite(s);
  const now=new Date();
  const stamp=now.toLocaleString([], {month:"short",day:"numeric",year:"numeric",hour:"numeric",minute:"2-digit"});
  const clean=(text||"").trim();
  if(!clean) return false;
  const entry={id:uid(), at:now.toISOString(), text:clean};
  s.noteEntries = Array.isArray(s.noteEntries) ? s.noteEntries : [];
  s.noteEntries.unshift(entry);
  const line=`[${stamp}] ${clean}`;
  s.notes = s.notes ? `${line}\n\n${s.notes}` : line;
  s.lastNoteAt=entry.at;
  save();
  return true;
}
function addSiteNotePrompt(defaultText=""){
  const s=site();
  if(!s){ route("sites"); return; }
  mode="siteNoteDraft";
  route("jobMode");
  setTimeout(()=>setSiteNoteDraft506(defaultText),0);
}
function startJob(){ addSiteNotePrompt(); }

function jobMode(){
  const s=site();
  if(!s){ route("sites"); return; }
  ensureSite(s);
  const noteEntries=siteNoteEntries506(s);
  const draft508=loadSiteNoteDraft508(s);
  const lastNote=s.lastNoteAt ? new Date(s.lastNoteAt).toLocaleString([], {month:"short",day:"numeric",hour:"numeric",minute:"2-digit"}) : "No notes yet";
  html(`<div class="screen siteNotesScreen491 siteNotesScreen494 siteNotesScreen506 siteNotesScreen508 siteNotesScreen509">
    <div class="row jobTop490 siteNotesTop494"><button class="back ghost" id="backBtn">←</button><div><h1>Site Notes</h1><p>${esc(s.name||"Customer Account")}</p></div><button class="ghost smallBtn" id="copyNotesBtn494" ${noteEntries.length?"":"disabled"}>Copy</button></div>
    <div class="card jobHero490 idle siteNotesHero491 siteNotesHero494 siteNotesHero506"><div class="jobHeroHead490"><div><strong>Site Notes Only</strong><span>${noteEntries.length} note${noteEntries.length===1?"":"s"} • Last: ${esc(lastNote)}</span></div><button class="ghost smallBtn" id="openDailyReport506">Daily Report</button></div><p>${esc(fullAddress(s)||"No address entered.")}</p></div>
    <div class="card siteNoteComposer506">
      <div class="siteNoteComposerHead506 siteNoteComposerHead508 siteNoteComposerHead509"><div><h2>Quick Site Note</h2><p>Type once, use templates, then save it into today’s Daily Report.</p></div><div class="siteNoteHeadActions508 siteNoteHeadActions509"><button class="ghost smallBtn" id="clearSiteDraft508" ${draft508.trim()?"":"disabled"}>Clear Draft</button><button class="primary smallBtn" id="saveSiteNoteBtn506">Save Note</button><button class="ghost smallBtn" id="saveSiteNoteReportBtn509">Save + Report</button></div></div>
      <textarea id="siteNoteText" placeholder="Add what happened, what you found, customer update, parts needed, or follow-up..." rows="5">${esc(draft508)}</textarea>
      <div class="siteDraftStatus508" id="siteDraftStatus508">${esc(siteNoteDraftStatus508(s))}</div>
      <div class="grid2 jobQuickGrid490 siteNotesActions491 siteNotesActions494 siteNotesActions506">
        <button class="ghost" id="quickNoteBtn">New Blank Note</button>
        <button class="ghost" id="custUpdateBtn">Customer Update</button>
        <button class="ghost" id="partsBtn">Parts Needed</button>
        <button class="ghost" id="accessBtn494">Access Note</button>
        <button class="ghost" id="testingBtn494">Testing Note</button>
        <button class="ghost" id="defJobBtn">Add Deficiency</button>
      </div>
      <div class="noteTemplatePanel503 noteTemplatePanel506"><h2>Templates</h2><p>Tap a template to add clean report wording to the note box.</p>${noteTemplatesMarkup503()}</div>
    </div>
    <div class="list grow jobTimeline490 siteNotesList491 siteNotesList494 siteNotesList506">
      <div class="routeSectionTitle462"><strong>Saved Site Notes</strong><span>Newest first</span></div>
      ${noteEntries.length?noteEntries.map((n,i)=>`<div class="card jobEvent490 siteNoteItem491 siteNoteItem494 siteNoteItem506"><div class="siteNoteIndex494">${i+1}</div><div><strong>${esc(n.label || noteEntryTimeLabel506(n))}</strong><p>${esc(n.text)}</p></div></div>`).join(""):`<div class="empty">No notes yet. Type a quick note above and tap Save Note.</div>`}
    </div>
  </div>`);
  document.getElementById("backBtn").onclick=()=>route("siteDetail");
  document.getElementById("openDailyReport506").onclick=()=>route("dailySummary");
  document.getElementById("quickNoteBtn").onclick=()=>{ const target=document.getElementById("siteNoteText"); if(target){ target.value=""; target.dispatchEvent(new Event("input",{bubbles:true})); } clearSiteNoteDraft508(s); setSiteNoteDraft506(); };
  document.getElementById("custUpdateBtn").onclick=()=>setSiteNoteDraft506("Customer update: ");
  document.getElementById("partsBtn").onclick=()=>setSiteNoteDraft506("Parts needed: ");
  document.getElementById("accessBtn494").onclick=()=>setSiteNoteDraft506("Access note: ");
  document.getElementById("testingBtn494").onclick=()=>setSiteNoteDraft506("Testing note: ");
  document.getElementById("defJobBtn").onclick=()=>{ mode=null; route("deficiencyForm"); };
  const noteBox508=document.getElementById("siteNoteText");
  const draftStatus508=document.getElementById("siteDraftStatus508");
  if(noteBox508){
    noteBox508.addEventListener("input",()=>{
      saveSiteNoteDraft508(s,noteBox508.value);
      const clearBtn=document.getElementById("clearSiteDraft508");
      if(clearBtn) clearBtn.disabled=!noteBox508.value.trim();
      if(draftStatus508) draftStatus508.textContent=siteNoteDraftStatus508(s);
    });
  }
  const clearDraftBtn508=document.getElementById("clearSiteDraft508");
  if(clearDraftBtn508) clearDraftBtn508.onclick=()=>{ clearSiteNoteDraft508(s); if(noteBox508){noteBox508.value=""; noteBox508.focus();} if(draftStatus508) draftStatus508.textContent=siteNoteDraftStatus508(s); clearDraftBtn508.disabled=true; toast("Draft cleared."); };
  const saveCurrentNote509=(openReport=false)=>{
    const note=val("siteNoteText");
    if(appendSiteNote491(s,note)){
      clearSiteNoteDraft508(s);
      toast(openReport ? "Site note saved. Opening Daily Report." : "Site note saved to Daily Report.");
      route(openReport ? "dailySummary" : "jobMode");
    }else toast("Type a note before saving.");
  };
  document.getElementById("saveSiteNoteBtn506").onclick=()=>saveCurrentNote509(false);
  document.getElementById("saveSiteNoteReportBtn509").onclick=()=>saveCurrentNote509(true);
  wireNoteTemplates503("siteNoteText");
  const copy=document.getElementById("copyNotesBtn494");
  if(copy) copy.onclick=()=>{
    const text=siteNotesCopyText506(s);
    if(navigator.clipboard?.writeText){ navigator.clipboard.writeText(text).then(()=>toast("Site notes copied."),()=>toast("Clipboard unavailable.")); }
    else toast("Clipboard unavailable.");
  };
}

function settingsTabs(){
  return [
    ["tech","Technician","Name, company, phone, email, and license information used in reports."],
    ["gps","GPS / Maps","Location capture, map provider, nearby radius, and GPS report visibility."],
    ["reports","Reports","Default report title, format, and included report sections."],
    ["email","Email","Default recipients, subject template, signature template, and tag tools."],
    ["overlay","Photo Overlay","Photo stamp preview, template fields, alignment, colors, and logo visibility."],
    ["themes","Theme","Theme presets, accent color, 3D controls, text size, and haptics."],
    ["visibility","Modules","Enable or disable FireVault modules for a cleaner field interface."],
    ["advanced","Advanced","Optional future modules marked with an asterisk when services are required."],
    ["backup","Backup","Export, import, data safety snapshot, restore tools, and danger zone."],
    ["about","About","Build information, storage key, and FireVault roadmap notes."]
  ];
}


/* Build 0.50.75 Settings navigation recovery */
function restoreAppChrome572(){
  document.body.classList.remove("homeFullscreen480","homeLayoutFixed570");
  const header=document.getElementById("appHeader");
  const nav=document.getElementById("appNav");
  if(header){
    header.style.display="flex";
    header.style.visibility="visible";
    header.style.opacity="1";
    header.style.pointerEvents="auto";
  }
  if(nav){
    nav.style.display="grid";
    nav.style.visibility="visible";
    nav.style.opacity="1";
    nav.style.pointerEvents="auto";
  }
  document.body.classList.add("settingsChrome572");
  showGlobalChrome537();
}
function openSettingsHome572(){
  mode=null;
  view="settings";
  restoreAppChrome572();
  render();
}
function leaveSettingsHome572(){
  mode=null;
  settingsTab="tech";
  route("home");
}

function settings(){
  captureSettingsScroll576();
  restoreAppChrome572();
  const tabs=settingsTabs();
  const active=tabs.find(t=>t[0]===settingsTab)||tabs[0];
  const inDetail = mode === "settingsDetail";
  if(!inDetail){
    html(`<div class="screen settingsHomeScreen settingsHomeScreen451 settingsHomeScreen488 settingsStable573">
      <div class="settingsHeader488 settingsHeader572">
        <button class="ghost settingsHomeBtn572" id="settingsHomeBtn572" aria-label="Return to Home">⌂</button>
        <div class="settingsHeaderTitle572"><h1>Settings</h1><p>Modules, app setup, and maintenance.</p></div>
        <button class="ghost settingsModulesQuick488" id="modulesQuickBtn">Modules</button>
      </div>
      <div class="settingsChoiceGrid451 grow settingsChoiceGrid488" aria-label="Settings choices">
        ${tabs.map((t,i)=>`<button class="settingsChoice451 settingsChoice455 settingsChoice456" data-tab="${t[0]}"><span class="settingsChoiceIcon451">${["👤","⌖","▤","✉","▧","◐","☰","⚡","⇅","ⓘ"][i]}</span><span class="settingsChoiceText456"><strong>${t[1]}</strong><small>${t[2]}</small></span><span class="settingsChoiceArrow455">›</span></button>`).join("")}
        <button class="settingsChoice451 settingsChoice455 settingsChoice456 settingsChoiceUtility451" id="diagnosticsChoice"><span class="settingsChoiceIcon451">⌁</span><span class="settingsChoiceText456"><strong>Diagnostics</strong><small>Build, storage, GPS, module, task, report, and vault health details.</small></span><span class="settingsChoiceArrow455">›</span></button>
      </div>
    </div>`);
    const homeBtn572=document.getElementById("settingsHomeBtn572"); if(homeBtn572) homeBtn572.onclick=leaveSettingsHome572;
    document.querySelectorAll(".settingsChoice451[data-tab]").forEach(b=>b.onclick=()=>{ settingsTab=b.dataset.tab; mode="settingsDetail"; view="settings"; render(); });
    const mq=document.getElementById("modulesQuickBtn"); if(mq) mq.onclick=()=>{ settingsTab="visibility"; mode="settingsDetail"; view="settings"; render(); };
    document.getElementById("diagnosticsChoice").onclick=()=>openSettingsSubmenu576("diagnostics");
    const dataToolsChoice560=document.getElementById("dataToolsChoice560"); if(dataToolsChoice560) dataToolsChoice560.onclick=()=>openSettingsSubmenu576("dataTools");
    restoreSettingsScroll576(false);
    return;
  }
  const saveable=!['backup','about'].includes(settingsTab);
  html(`<div class="screen settingsDetailScreen451 settingsScreen settingsScreen448 settingsScreen449 settingsDetailScreen488 settingsStable573">
    <div class="settingsDetailTop451 settingsDetailTop488 settingsDetailTop572">
      <button class="ghost settingsBack451 settingsBack488" id="settingsBackBtn" aria-label="Back to Settings">←</button>
      <div class="settingsDetailTitle451 settingsDetailTitle488"><h1>${active[1]}</h1></div>
      <div class="settingsDetailActions572">
        <button class="ghost settingsDetailHome572" id="settingsDetailHome572" aria-label="Return to Home">⌂</button>
        ${saveable?`<button class="primary settingsTopSave451 settingsTopSave488" id="saveSettingsTop">Save</button>`:`<button class="ghost settingsTopSave451 settingsTopSave488" id="settingsDoneBtn">Done</button>`}
      </div>
    </div>
    <p class="settingsDetailSub488">${active[2]}</p>
    <div class="settingsDetailBody451 grow settingsContent448 settingsContent449 settingsDetailBody488">${settingsPanel()}</div>
  </div>`);
  document.getElementById("settingsBackBtn").onclick=openSettingsHome572;
  const homeDetail572=document.getElementById("settingsDetailHome572"); if(homeDetail572) homeDetail572.onclick=leaveSettingsHome572;
  const done=document.getElementById("settingsDoneBtn"); if(done) done.onclick=openSettingsHome572;
  const saveTop=document.getElementById("saveSettingsTop"); if(saveTop) saveTop.onclick=saveSettings;
  wireSettingsPanel();
  restoreSettingsScroll576(true);
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
function overlayDefaultTemplate510(){ return "{site_name} • {date} • {time}\n{technician} • {company}"; }
function overlaySampleSite510(){
  return {
    name:"Acme Fire Panel",
    street:"123 Main St",
    city:"Casper",
    state:"WY",
    zip:"82601",
    gps:{lat:42.8501,lng:-106.3252,accuracy:12,capturedAt:new Date().toISOString()}
  };
}
function overlayCleanSetting510(o={}){
  return {
    template:o.template || overlayDefaultTemplate510(),
    alignment:o.alignment || "bottom",
    fontSize:o.fontSize || "medium",
    accentColor:o.accentColor || "#ef4444",
    textColor:o.textColor || "#ffffff",
    backgroundStyle:o.backgroundStyle || "bar",
    opacity:String(o.opacity || "85"),
    showLogo:o.showLogo !== false,
    showTagline:o.showTagline !== false,
    logoMode:o.logoMode || "firevault",
    customLogoData:o.customLogoData || ""
  };
}
function overlayTagButtons510(){
  return OVERLAY_TAGS_510.map(([tag,label,note])=>`<button type="button" class="overlayFieldChip510" data-overlay-tag="${esc(tag)}"><strong>${esc(tag)}</strong><span>${esc(label)}</span><small>${esc(note)}</small></button>`).join("");
}
function overlayLogoSrc510(set){
  if(set.logoMode === "custom") return set.customLogoData || "";
  return `assets/firevault-logo-master.png?v=${BUILD}`;
}
function overlayLogoStatus510(set){
  if(set.logoMode === "custom" && set.customLogoData) return "Using custom logo";
  if(set.logoMode === "custom") return "Custom logo selected but no image uploaded yet";
  return "Using FireVault logo";
}
function overlayPreviewMarkup510(o){
  const set=overlayCleanSetting510(o);
  const lines=esc(renderTemplate(set.template, overlaySampleSite510()) || "FireVault overlay preview").replaceAll("\n","<br>");
  const style=`--ovAccent:${esc(set.accentColor)};--ovText:${esc(set.textColor)};--ovAlpha:${Math.max(20,Math.min(100,Number(set.opacity)||85))/100}`;
  const logoSrc=overlayLogoSrc510(set);
  return `<div class="photoOverlayPreview510" style="${style}">
    <div class="photoSampleScene510" aria-label="Sample field photo preview with overlay">
      <img class="photoSampleImg510" src="assets/overlay-sample-photo.jpg?v=${BUILD}" alt="Sample fire alarm field photo">
      <div id="overlayLivePreview510" class="photoStamp510 align-${esc(set.alignment)} size-${esc(set.fontSize)} style-${esc(set.backgroundStyle)}">
        ${set.showLogo?`<div class="photoStampLogo510">${logoSrc?`<img src="${esc(logoSrc)}" alt="Overlay logo">`:`<span class="photoStampLogoPlaceholder511">Logo</span>`}</div>`:""}
        <div class="photoStampText510"><div>${lines}</div>${set.showTagline?`<small>FireVault Field Photo Overlay</small>`:""}</div>
      </div>
    </div>
  </div>`;
}
function overlaySettingsPanel510(o){
  const set=overlayCleanSetting510(o);
  return `<div class="settingsStack overlaySettings510">
    <div class="card settingGroup compactPane overlayEditor510">
      <div class="paneHead"><div><h2>Photo Overlay</h2><p class="paneNote">Preview now uses a cleaner sample field photo and the real FireVault logo. You can also upload a custom logo for the overlay.</p></div><button class="primary saveMini" id="saveSettings">Save</button></div>
      ${overlayPreviewMarkup510(set)}
      <div class="overlayControlGrid510">
        ${fieldBlock("Overlay Text",`<textarea id="ovTemplate" class="overlayTemplate510" rows="4" placeholder="{site_name} • {date} • {time}">${esc(set.template)}</textarea>`,`Tap fields below to insert them into the overlay.`)}
        <div class="overlayMiniControls510">
          ${fieldBlock("Position",`<select id="ovAlign"><option value="bottom" ${set.alignment==="bottom"?"selected":""}>bottom</option><option value="top" ${set.alignment==="top"?"selected":""}>top</option><option value="middle" ${set.alignment==="middle"?"selected":""}>middle</option></select>`)}
          ${fieldBlock("Font Size",`<select id="ovSize"><option value="small" ${set.fontSize==="small"?"selected":""}>small</option><option value="medium" ${set.fontSize==="medium"?"selected":""}>medium</option><option value="large" ${set.fontSize==="large"?"selected":""}>large</option></select>`)}
          ${fieldBlock("Background",`<select id="ovBg"><option value="bar" ${set.backgroundStyle==="bar"?"selected":""}>bar</option><option value="card" ${set.backgroundStyle==="card"?"selected":""}>card</option><option value="minimal" ${set.backgroundStyle==="minimal"?"selected":""}>minimal</option></select>`)}
          ${fieldBlock("Opacity",`<input id="ovOpacity" type="range" min="35" max="100" value="${esc(set.opacity)}">`,`Stamp background strength`)}
          ${fieldBlock("Accent Color",`<input id="ovAccent" type="color" value="${esc(set.accentColor)}">`)}
          ${fieldBlock("Text Color",`<input id="ovText" type="color" value="${esc(set.textColor)}">`)}
          ${fieldBlock("Logo Source",`<select id="ovLogoMode"><option value="firevault" ${set.logoMode==="firevault"?"selected":""}>FireVault logo</option><option value="custom" ${set.logoMode==="custom"?"selected":""}>Custom logo</option></select>`,`Change which logo appears on the overlay.`)}
        </div>
      </div>
      <div class="overlayLogoManager511">
        <div class="overlayLogoCard511">
          <div class="overlayLogoPreview511">${set.showLogo ? (overlayLogoSrc510(set)?`<img src="${esc(overlayLogoSrc510(set))}" alt="Current overlay logo preview">`:`<span>No logo image</span>`) : `<span>Logo hidden</span>`}</div>
          <div class="overlayLogoMeta511">
            <strong>Overlay Logo</strong>
            <p id="ovLogoStatus">${esc(overlayLogoStatus510(set))}</p>
            <label class="overlayUploadLabel511">
              <span>Upload custom logo</span>
              <input id="ovCustomLogo" type="file" accept="image/*">
            </label>
            <div class="overlayLogoActions511">
              <button type="button" class="ghost" id="ovUseFireVault">Use FireVault Logo</button>
              <button type="button" class="ghost" id="ovClearCustomLogo">Clear Custom Logo</button>
            </div>
            <small class="fieldNote">Custom logo is saved locally on this device/browser. Best results: square PNG with transparent background.</small>
          </div>
        </div>
      </div>
      <div class="settingsList twoCol overlayToggles510">
        ${checkBlock("ovLogo","Show overlay logo",set.showLogo)}
        ${checkBlock("ovTagline","Show FireVault tagline",set.showTagline)}
      </div>
    </div>
    <div class="card compactPane overlayFieldsCard510">
      <div class="paneHead"><div><h2>Available Overlay Fields</h2><p class="paneNote">Tap a field to insert it into the overlay text box.</p></div></div>
      <div class="overlayFieldGrid510">${overlayTagButtons510()}</div>
    </div>
  </div>`;
}
function collectOverlayFromInputs510(){
  return overlayCleanSetting510({
    template:raw("ovTemplate") || overlayDefaultTemplate510(),
    alignment:val("ovAlign") || "bottom",
    fontSize:val("ovSize") || "medium",
    accentColor:val("ovAccent") || "#ef4444",
    textColor:val("ovText") || "#ffffff",
    backgroundStyle:val("ovBg") || "bar",
    opacity:val("ovOpacity") || "85",
    showLogo:checked("ovLogo"),
    showTagline:checked("ovTagline"),
    logoMode:val("ovLogoMode") || "firevault",
    customLogoData:overlayLogoDraftDataUrl || data.settings.overlay?.customLogoData || ""
  });
}
function updateOverlayPreview510(){
  const holder=document.querySelector(".photoOverlayPreview510");
  if(!holder) return;
  const nextSet=collectOverlayFromInputs510();
  const next=overlayPreviewMarkup510(nextSet);
  const wrap=document.createElement("div");
  wrap.innerHTML=next;
  holder.replaceWith(wrap.firstElementChild);
  const miniPreview=document.querySelector('.overlayLogoPreview511');
  if(miniPreview){
    const logoSrc=overlayLogoSrc510(nextSet);
    miniPreview.innerHTML = !nextSet.showLogo ? '<span>Logo hidden</span>' : (logoSrc ? `<img src="${esc(logoSrc)}" alt="Current overlay logo preview">` : '<span>No logo image</span>');
  }
  const stat=document.getElementById('ovLogoStatus');
  if(stat) stat.textContent=overlayLogoStatus510(nextSet);
}
function insertOverlayTag510(tag){
  const target=document.getElementById("ovTemplate");
  if(!target) return;
  const start=Number.isFinite(target.selectionStart) ? target.selectionStart : target.value.length;
  const end=Number.isFinite(target.selectionEnd) ? target.selectionEnd : target.value.length;
  target.setRangeText(tag, start, end, "end");
  target.focus();
  target.dispatchEvent(new Event("input",{bubbles:true}));
}
function wireOverlaySettings510(){
  overlayLogoDraftDataUrl = data.settings.overlay?.customLogoData || "";
  ["ovTemplate","ovAlign","ovSize","ovBg","ovOpacity","ovAccent","ovText","ovLogo","ovTagline","ovLogoMode"].forEach(id=>{
    const el=document.getElementById(id);
    if(el) el.addEventListener(el.type==="checkbox"?"change":"input", updateOverlayPreview510);
    if(el && el.tagName === "SELECT") el.addEventListener("change", updateOverlayPreview510);
  });
  document.querySelectorAll(".overlayFieldChip510").forEach(b=>b.onclick=()=>insertOverlayTag510(b.dataset.overlayTag||""));
  const upload=document.getElementById('ovCustomLogo');
  if(upload) upload.addEventListener('change', e=>{
    const file=e.target.files && e.target.files[0];
    if(!file) return;
    if(!file.type.startsWith('image/')){ toast('Please choose an image file.'); return; }
    const reader=new FileReader();
    reader.onload=()=>{
      overlayLogoDraftDataUrl=String(reader.result||'');
      const select=document.getElementById('ovLogoMode');
      if(select) select.value='custom';
      const showLogo=document.getElementById('ovLogo');
      if(showLogo) showLogo.checked=true;
      updateOverlayPreview510();
      toast('Custom overlay logo loaded. Save settings to keep it.');
    };
    reader.readAsDataURL(file);
  });
  const useFireVault=document.getElementById('ovUseFireVault');
  if(useFireVault) useFireVault.onclick=()=>{
    const select=document.getElementById('ovLogoMode');
    if(select) select.value='firevault';
    updateOverlayPreview510();
  };
  const clearCustom=document.getElementById('ovClearCustomLogo');
  if(clearCustom) clearCustom.onclick=()=>{
    overlayLogoDraftDataUrl='';
    const upload=document.getElementById('ovCustomLogo');
    if(upload) upload.value='';
    const select=document.getElementById('ovLogoMode');
    if(select && select.value==='custom') select.value='firevault';
    updateOverlayPreview510();
    toast('Custom overlay logo cleared.');
  };
}


function settingsPanel(){
  const s=data.settings, t=s.theme, tech=s.technician, email=s.email, r=s.reports, o=s.overlay, a=s.advanced, gps=s.gps||{};
  if(settingsTab==="tech") return `<div class="settingsStack"><div class="card settingGroup compactPane"><div class="paneHead"><h2>Technician Profile</h2><button class="primary saveMini" id="saveSettings">Save</button></div><p class="paneNote">Used on reports, email tags, and future photo stamps.</p><div class="settingsGrid">${fieldBlock("Name",`<input id="techName" value="${esc(tech.name)}">`)}${fieldBlock("Company",`<input id="techCompany" value="${esc(tech.company)}">`)}${fieldBlock("Phone",`<input id="techPhone" value="${esc(tech.phone)}">`)}${fieldBlock("Email",`<input id="techEmail" value="${esc(tech.email)}">`)}${fieldBlock("License / ID",`<input id="techLicense" value="${esc(tech.license)}">`)}</div></div></div>`;
  if(settingsTab==="reports") return `<div class="settingsStack"><div class="card settingGroup compactPane"><div class="paneHead"><h2>Report Defaults</h2><button class="primary saveMini" id="saveSettings">Save</button></div><p class="paneNote">Controls generated site reports.</p><div class="settingsGrid">${fieldBlock("Report Title",`<input id="reportTitle" value="${esc(r.title)}">`)}${fieldBlock("Format",`<select id="reportFormat"><option ${r.format==="detailed"?"selected":""}>detailed</option><option ${r.format==="compact"?"selected":""}>compact</option></select>`)}</div><div class="settingsList">${checkBlock("repTech","Include technician profile",r.includeTechnician)}${checkBlock("repTasks","Include open and completed tasks",r.includeTasks)}${checkBlock("repDef","Include deficiencies",r.includeDeficiencies)}</div></div></div>`;
  if(settingsTab==="email") return emailSettingsPanel(email);
  if(settingsTab==="overlay") return overlaySettingsPanel510(o);
  if(settingsTab==="gps") return `<div class="settingsStack"><div class="card settingGroup compactPane gpsSettingsPane"><div class="paneHead"><h2>GPS / Maps</h2><button class="primary saveMini" id="saveSettings">Save</button></div><p class="paneNote">Restored GPS tools. Coordinates are saved locally inside each site record.</p><div class="settingsGrid">${fieldBlock("Default Map",`<select id="gpsMapProvider"><option value="apple" ${gps.mapProvider!=="google"?"selected":""}>Apple Maps</option><option value="google" ${gps.mapProvider==="google"?"selected":""}>Google Maps</option></select>`)}${fieldBlock("GPS Accuracy",`<select id="gpsHighAccuracy"><option value="true" ${gps.highAccuracy!==false?"selected":""}>High accuracy</option><option value="false" ${gps.highAccuracy===false?"selected":""}>Standard</option></select>`)}${fieldBlock("Nearby Radius",`<input id="gpsNearbyRadius" inputmode="decimal" value="${esc(gps.nearbyRadiusMiles||1)}">`,`Miles for Nearby Sites detection`)}</div><div class="settingsList">${checkBlock("gpsEnabled","Show GPS capture buttons on site pages",gps.enabled!==false)}${checkBlock("gpsReports","Include GPS coordinates in reports",gps.includeInReports!==false)}</div><p class="fieldNote">Browser GPS works only when allowed by the phone/browser and served from HTTPS.</p></div></div>`;
  if(settingsTab==="themes") return `<div class="settingsStack"><div class="card settingGroup compactPane"><div class="paneHead"><h2>Theme Engine</h2><button class="primary saveMini" id="saveSettings">Apply</button></div><p class="paneNote">Quick presets and live UI controls.</p><div class="presetGrid">${Object.entries(themePresets).map(([key,p])=>`<button class="ghost presetBtn" data-preset="${key}"><span class="themeSwatch" style="background:${p.accentColor}"></span><span>${p.label}</span></button>`).join("")}</div><div class="settingsGrid">${fieldBlock("Theme",`<select id="themeName">${Object.entries(themePresets).map(([key,p])=>`<option value="${key}" ${t.name===key?"selected":""}>${p.label}</option>`).join("")}</select>`)}${fieldBlock("Accent Color",`<input id="themeAccent" type="color" value="${esc(t.accentColor||"#ef4444")}">`)}${fieldBlock("Buttons",`<select id="buttonStyle"><option value="rounded" ${t.buttonStyle!=="squared"?"selected":""}>rounded</option><option value="squared" ${t.buttonStyle==="squared"?"selected":""}>squared</option></select>`)}${fieldBlock("Cards",`<select id="cardStyle"><option value="glass" ${t.cardStyle!=="solid"?"selected":""}>glass</option><option value="solid" ${t.cardStyle==="solid"?"selected":""}>solid</option></select>`)}</div><div class="settingsList">${checkBlock("themeHighContrast","High contrast support",t.highContrast)}${checkBlock("themeLargeText","Larger text",t.largeText)}${checkBlock("themeCompact","Compact layout",t.compactLayout)}${checkBlock("themeHaptics","Haptic button feedback",s.app?.haptics!==false)}</div></div></div>`;
  if(settingsTab==="visibility") { const mode=appMode(); const v=visibility(); return `<div class="settingsStack simpleSettings472"><div class="card settingGroup compactPane simpleHero472"><div class="paneHead"><div><h2>Modules / Simple View</h2><p class="paneNote">Turn major FireVault modules on or off. Disabled modules disappear from the interface until you enable them again here.</p></div><button class="primary saveMini" id="saveSettings">Save</button></div><div class="settingsGrid">${fieldBlock("App Mode",`<select id="viewMode"><option value="simple" ${mode==="simple"?"selected":""}>Simple View</option><option value="advanced" ${mode==="advanced"?"selected":""}>Advanced View</option><option value="power" ${mode==="power"?"selected":""}>Technician Power Mode</option></select>`,`Simple keeps the field interface clean. Advanced shows enabled modules. Power shows everything.`)}</div><div class="viewModeQuick472"><button class="ghost" data-view-mode="simple">Simple</button><button class="ghost" data-view-mode="advanced">Advanced</button><button class="ghost" data-view-mode="power">Power</button></div></div>${visibilityPresetCards474()}${layoutPresetCards565()}<div class="card settingGroup compactPane"><div class="paneHead"><h2>Modules</h2></div><p class="paneNote">Turn off anything you do not need. Disabled modules are removed from the dashboard, site screens, bottom tabs, and tool menus until enabled again. Field Focus, Pinned Sites, Data Safe Home Card, Important Site Info, Site Brief, and Site Activity Timeline are layout controls; their underlying tools remain available from their full screens.</p><div class="settingsList featureList472">${FEATURE_LABELS.map(([key,label,note])=>`<label class="checkRow featureCheck472"><input type="checkbox" id="vis_${key}" ${v[key]?"checked":""}><span><strong>${esc(label)}</strong><small>${esc(note)}</small></span></label>`).join("")}</div></div></div>`; }
  if(settingsTab==="advanced") return `<div class="settingsStack"><div class="card settingGroup compactPane"><div class="paneHead"><h2>Advanced Features</h2><button class="primary saveMini" id="saveSettings">Save</button></div><p class="paneNote"><span class="featureStar">*</span> Requires outside services, permissions, APIs, or future backend modules.</p><div class="settingsList twoCol">${[["advAi","aiTechnician","AI Technician"],["advReverse","reverseAddressLookup","Reverse Address Lookup *"],["advCloud","cloudBackup","Cloud Backup *"],["advVoice","voiceTranscription","Voice Transcription *"],["advOcr","ocrReader","OCR Reader *"],["advEmail","emailGateway","Email Gateway *"],["advWeather","weather","Weather Context *"],["advTraffic","traffic","Traffic / Routing *"]].map(x=>checkBlock(x[0],x[2],a[x[1]])).join("")}</div></div></div>`;
  if(settingsTab==="backup") return backupSettingsPanel();
  return `<div class="settingsStack"><div class="card settingGroup compactPane"><div class="paneHead"><h2>About ${fireVaultBrand575()}</h2></div><p class="paneNote">A modular field knowledge system for fire alarm technicians.</p><div class="aboutGrid"><div><strong>Build</strong><span>${BUILD}</span></div><div><strong>Storage key</strong><span>${KEY}</span></div><div><strong>Roadmap lane</strong><span>Modular foundation, settings polish, iPhone PWA, deeper service-call modules.</span></div></div></div></div>`;
}
function wireSettingsPanel(){
  const saveBtn=document.getElementById("saveSettings"); if(saveBtn) saveBtn.onclick=saveSettings;
  if(settingsTab==="overlay") wireOverlaySettings510();
  ["emailSubject","emailSig"].forEach(id=>{ const el=document.getElementById(id); if(el){ el.addEventListener("focus",()=>lastEmailTemplateField=id); el.addEventListener("input",updateEmailPreview); } });
  document.querySelectorAll(".emailTagChip").forEach(b=>b.onclick=()=>{ const target=document.getElementById(lastEmailTemplateField) || document.getElementById("emailSubject"); insertAtCursor(target, b.dataset.emailTag || ""); });
  document.querySelectorAll(".presetBtn").forEach(b=>b.onclick=()=>{ const p=themePresets[b.dataset.preset]; data.settings.theme.name=b.dataset.preset; data.settings.theme.accentColor=p.accentColor; if(p.highContrast) data.settings.theme.highContrast=true; save(); settings(); toast("Theme applied."); });
  document.querySelectorAll("[data-view-mode]").forEach(b=>b.onclick=()=>setViewMode(b.dataset.viewMode));
  document.querySelectorAll("[data-feature-preset]").forEach(b=>b.onclick=()=>applyFeaturePreset474(b.dataset.featurePreset));
  document.querySelectorAll("[data-layout-preset]").forEach(b=>b.onclick=()=>applyLayoutPreset565(b.dataset.layoutPreset));
  if(settingsTab==="visibility"){
    document.querySelectorAll(".featureCheck472 input[type=checkbox], #viewMode").forEach(el=>el.addEventListener("change",captureSettingsScroll576));
  }
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
  if(settingsTab==="overlay") s.overlay={...s.overlay,...collectOverlayFromInputs510()};
  if(settingsTab==="gps") s.gps={enabled:checked("gpsEnabled"),mapProvider:val("gpsMapProvider")||"apple",highAccuracy:val("gpsHighAccuracy")!=="false",includeInReports:checked("gpsReports"),nearbyRadiusMiles:Number(val("gpsNearbyRadius"))||1};
  if(settingsTab==="themes") { s.theme={name:val("themeName"),accentColor:val("themeAccent"),highContrast:checked("themeHighContrast"),largeText:checked("themeLargeText"),compactLayout:checked("themeCompact"),buttonStyle:val("buttonStyle"),cardStyle:val("cardStyle")}; s.app={...(s.app||{}),haptics:checked("themeHaptics"),viewMode:s.app?.viewMode||"simple"}; }
  if(settingsTab==="visibility") { s.app={...(s.app||{}),viewMode:val("viewMode")||"simple",activeFeaturePreset575:"",activeLayoutPreset575:""}; const next={...visibility()}; FEATURE_LABELS.forEach(([key])=>next[key]=checked("vis_"+key)); s.visibility=next; }
  if(settingsTab==="advanced") s.advanced={aiTechnician:checked("advAi"),reverseAddressLookup:checked("advReverse"),cloudBackup:checked("advCloud"),voiceTranscription:checked("advVoice"),ocrReader:checked("advOcr"),emailGateway:checked("advEmail"),weather:checked("advWeather"),traffic:checked("advTraffic")};
  save(); toast("Settings saved."); view="settings"; mode="settingsDetail"; render();
}


function stabilityReport(){
  const issues=[];
  const pass=[];
  const routeNames=["home","dailySummary","routeLog","actionCenter","pinnedSites","sites","nearbySites","attention","siteDetail","visits","visitDetail","checklist","siteForm","contactsList","contactForm","siteDocs","siteDocForm","equipmentList","equipmentForm","tasks","taskForm","deficiencies","deficiencyForm","report","library","resourceForm","jobMode","settings","diagnostics","dataTools"];
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
  if(activeJob && !data.sites.some(s=>s.id===activeJob.siteId)) issues.push("Old active job record points to a site that no longer exists");
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
    `Old Job Record: ${activeJob ? activeJob.siteName : "None"}`,
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
function startupHealthText520(){
  const lastBoot=localStorage.getItem("firevault_last_boot_ok") || "Not recorded yet";
  const lastBuild=localStorage.getItem("firevault_last_boot_build") || "Unknown";
  const lastRoute=localStorage.getItem("firevault_last_boot_route") || "Unknown";
  const lastError=localStorage.getItem("firevault_last_boot_error") || window.__FIREVAULT_LAST_ERROR || "None";
  const minSplash=Number(window.__FIREVAULT_MIN_SPLASH_MS || 5000);
  const moduleReady=window.__FIREVAULT_MODULE_READY ? "Yes" : "No";
  const booted=window.__FIREVAULT_BOOTED ? "Yes" : "No";
  return [
    "FireVault Startup Health",
    `Build: ${BUILD}`,
    `Module Ready: ${moduleReady}`,
    `Booted: ${booted}`,
    `Last Good Boot: ${lastBoot}`,
    `Last Boot Build: ${lastBuild}`,
    `Last Route: ${lastRoute}`,
    `Splash Minimum: ${Math.round(minSplash/1000)} seconds`,
    `Last Boot Error: ${lastError}`,
    `Generated: ${new Date().toLocaleString()}`
  ].join("\n");
}
function startupHealthCard520(){
  const lastBoot=localStorage.getItem("firevault_last_boot_ok") || "Not recorded yet";
  const lastBuild=localStorage.getItem("firevault_last_boot_build") || "Unknown";
  const lastRoute=localStorage.getItem("firevault_last_boot_route") || "Unknown";
  const lastError=localStorage.getItem("firevault_last_boot_error") || window.__FIREVAULT_LAST_ERROR || "None";
  const minSplash=Number(window.__FIREVAULT_MIN_SPLASH_MS || 5000);
  const ok=window.__FIREVAULT_MODULE_READY && !window.__FIREVAULT_LAST_ERROR;
  return `<div class="card startupHealth520 ${ok?"passed":"needsReview"}">
    <div class="startupHealthHead520"><div><h2>Startup Health</h2><p>Boot confidence check for the splash screen, module load, and last successful app start.</p></div><span>${ok?"OK":"Review"}</span></div>
    <div class="startupHealthGrid520">
      <div><strong>${window.__FIREVAULT_MODULE_READY?"Yes":"No"}</strong><span>Module Ready</span></div>
      <div><strong>${window.__FIREVAULT_BOOTED?"Yes":"No"}</strong><span>Booted</span></div>
      <div><strong>${Math.round(minSplash/1000)} sec</strong><span>Splash Min</span></div>
      <div><strong>${esc(lastBuild)}</strong><span>Last Build</span></div>
    </div>
    <p class="fieldNote">Last good boot: ${esc(lastBoot)} • Last route: ${esc(lastRoute)}</p>
    <p class="fieldNote">Last startup error: ${esc(lastError)}</p>
    <button class="ghost smallBtn" id="copyStartupHealth520">Copy Startup Health</button>
  </div>`;
}
function copyStartupHealth520(){
  if(navigator.clipboard?.writeText){
    navigator.clipboard.writeText(startupHealthText520()).then(()=>toast("Startup health copied."),()=>toast("Clipboard unavailable."));
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





/* Build 0.50.75 Action Center helpers */
function actionPriorityClass562(rank){
  if(rank<=1) return "critical";
  if(rank===2) return "today";
  if(rank===3) return "review";
  return "normal";
}
function actionCenterRows562(){
  const rows=[];
  allTaskRows().forEach(r=>{
    if(taskIsDone(r.t)) return;
    if(r.state==="overdue" || r.state==="today"){
      rows.push({
        kind:r.state==="overdue"?"Overdue Task":"Due Today",
        filter:r.state,
        rank:r.state==="overdue"?1:2,
        siteId:r.s.id,
        siteName:r.s.name||"Unnamed Site",
        title:r.t.title||"Task",
        detail:[taskDueLabel(r.t), r.t.source||"", r.t.notes||""].filter(Boolean).join(" • "),
        target:"tasks"
      });
    }
  });
  allDeficiencyRows().forEach(r=>{
    if(deficiencyClosed(r.d)) return;
    const sev=String(r.d.priority||"Normal");
    rows.push({
      kind:"Deficiency",
      filter:"deficiencies",
      rank:sev==="Critical"?1:(sev==="High"?2:3),
      siteId:r.s.id,
      siteName:r.s.name||"Unnamed Site",
      title:r.d.title||r.d.name||"Open deficiency",
      detail:[sev, deficiencyAgeLine(r.d), r.d.notes||r.d.customerNote||""].filter(Boolean).join(" • "),
      target:"deficiencies"
    });
  });
  (data.sites||[]).forEach(s=>{
    const selected=reportPhotos526(s);
    if(selected.length){
      const ready=customerReportPhotoReady530(s);
      if(ready.issues && ready.issues.length){
        rows.push({
          kind:"Report Review",
          filter:"reports",
          rank:3,
          siteId:s.id,
          siteName:s.name||"Unnamed Site",
          title:`${selected.length} selected customer photo${selected.length===1?"":"s"}`,
          detail:ready.issues.join(" • "),
          target:"report"
        });
      }
    }
  });
  attentionRows().forEach(r=>{
    const already=rows.some(x=>x.siteId===r.s.id && x.rank<=2);
    if(already) return;
    rows.push({
      kind:"Attention Site",
      filter:"attention",
      rank:r.h.cls==="healthWarn"?2:4,
      siteId:r.s.id,
      siteName:r.s.name||"Unnamed Site",
      title:r.h.label||"Site needs review",
      detail:attentionActionLine(r)||fullAddress(r.s)||"Review site details",
      target:"site"
    });
  });
  return rows.sort((a,b)=>a.rank-b.rank || String(a.siteName).localeCompare(String(b.siteName)) || String(a.title).localeCompare(String(b.title)));
}
function actionCenterCounts562(rows=actionCenterRows562()){
  return {
    all:rows.length,
    overdue:rows.filter(r=>r.filter==="overdue").length,
    today:rows.filter(r=>r.filter==="today").length,
    deficiencies:rows.filter(r=>r.filter==="deficiencies").length,
    reports:rows.filter(r=>r.filter==="reports").length,
    attention:rows.filter(r=>r.filter==="attention").length
  };
}
function filteredActionCenterRows562(){
  const rows=actionCenterRows562();
  if(actionCenterFilter562==="all") return rows;
  return rows.filter(r=>r.filter===actionCenterFilter562);
}
function actionCenterFilterButton562(key,label,count){
  return `<button class="actionFilter562 ${actionCenterFilter562===key?"active":""}" data-filter="${esc(key)}"><strong>${esc(label)}</strong><span>${count}</span></button>`;
}
function actionCenterStatus562(){
  const c=actionCenterCounts562();
  if(c.overdue) return {label:"Overdue", cls:"critical", detail:`${c.overdue} overdue task${c.overdue===1?"":"s"} need attention`};
  if(c.deficiencies) return {label:"Deficiencies", cls:"review", detail:`${c.deficiencies} open deficienc${c.deficiencies===1?"y":"ies"}`};
  if(c.today) return {label:"Due Today", cls:"today", detail:`${c.today} task${c.today===1?"":"s"} due today`};
  if(c.reports) return {label:"Reports", cls:"review", detail:`${c.reports} report photo item${c.reports===1?"":"s"} need review`};
  if(c.attention) return {label:"Attention", cls:"review", detail:`${c.attention} site${c.attention===1?"":"s"} need review`};
  return {label:"Clear", cls:"ready", detail:"No priority action items"};
}
function actionCenterText562(){
  const rows=filteredActionCenterRows562();
  const status=actionCenterStatus562();
  const lines=[
    "FireVault Action Center",
    `Build: ${BUILD}`,
    `Date: ${new Date().toLocaleString()}`,
    `Filter: ${actionCenterFilter562}`,
    "",
    `Status: ${status.label} - ${status.detail}`,
    "",
    rows.length ? "Action Items:" : "No action items in this filter."
  ];
  rows.slice(0,50).forEach((r,i)=>{
    lines.push(`${i+1}. [${r.kind}] ${r.siteName} - ${r.title}`);
    if(r.detail) lines.push(`   ${r.detail}`);
  });
  return lines.join("\n");
}
async function copyActionCenter562(){
  try{
    await navigator.clipboard.writeText(actionCenterText562());
    toast("Action Center copied.");
  }catch{
    toast("Clipboard unavailable.");
  }
}
function openActionRow562(btn){
  const siteId=btn.dataset.site;
  const target=btn.dataset.target;
  if(siteId) selectedSiteId=siteId;
  if(target==="tasks"){
    taskFilter=btn.dataset.filter==="overdue" ? "overdue" : (btn.dataset.filter==="today" ? "today" : "open");
    route("tasks");
    return;
  }
  if(target==="deficiencies"){
    deficiencyFilter="open";
    route("deficiencies");
    return;
  }
  if(target==="report"){
    route("report");
    return;
  }
  route("siteDetail");
}
function actionCenter(){
  const rows=filteredActionCenterRows562();
  const counts=actionCenterCounts562();
  const status=actionCenterStatus562();
  html(`<div class="screen actionCenterScreen562">
    <div class="row actionCenterTop562"><button class="back ghost" id="backHome562">←</button><div><h1>Action Center</h1><p>Priority field items from every site.</p></div><button class="ghost smallBtn" id="copyActionCenter562">Copy</button></div>
    <div class="card actionHero562 ${status.cls}"><div><h2>${esc(status.label)}</h2><p>${esc(status.detail)}</p></div><strong>${counts.all}</strong></div>
    <div class="actionFilters562">
      ${actionCenterFilterButton562("all","All",counts.all)}
      ${actionCenterFilterButton562("overdue","Overdue",counts.overdue)}
      ${actionCenterFilterButton562("today","Today",counts.today)}
      ${actionCenterFilterButton562("deficiencies","Def.",counts.deficiencies)}
      ${actionCenterFilterButton562("reports","Reports",counts.reports)}
      ${actionCenterFilterButton562("attention","Attention",counts.attention)}
    </div>
    <div class="actionList562">
      ${rows.length ? rows.slice(0,40).map(r=>`<button class="card actionRow562 ${actionPriorityClass562(r.rank)}" data-site="${esc(r.siteId)}" data-target="${esc(r.target)}" data-filter="${esc(r.filter)}">
        <span>${esc(r.kind)}</span>
        <div><strong>${esc(r.title)}</strong><small>${esc(r.siteName)}${fullAddress((data.sites||[]).find(s=>s.id===r.siteId)||{})?` • ${esc(fullAddress((data.sites||[]).find(s=>s.id===r.siteId)||{}))}`:""}</small>${r.detail?`<em>${esc(r.detail)}</em>`:""}</div>
      </button>`).join("") : `<div class="card empty actionEmpty562"><h2>No action items</h2><p>This filter is clear right now.</p></div>`}
    </div>
  </div>`);
  document.getElementById("backHome562").onclick=()=>route("home");
  document.getElementById("copyActionCenter562").onclick=copyActionCenter562;
  document.querySelectorAll(".actionFilter562").forEach(b=>b.onclick=()=>{actionCenterFilter562=b.dataset.filter||"all"; actionCenter();});
  document.querySelectorAll(".actionRow562").forEach(b=>b.onclick=()=>openActionRow562(b));
}


/* Build 0.50.75 Field Focus dashboard helpers */
function fieldFocusStats561(){
  const sites=data.sites||[];
  const openTasks=allTaskRows().filter(r=>!taskIsDone(r.t));
  const overdue=openTasks.filter(r=>r.state==="overdue");
  const dueToday=openTasks.filter(r=>r.state==="today");
  const openDef=sites.reduce((arr,s)=>arr.concat((s.deficiencies||[]).filter(d=>String(d.status||"Open").toLowerCase()!=="closed").map(d=>({s,d}))),[]);
  const attention=attentionRows();
  const photos=sites.reduce((n,s)=>n+(s.docs||[]).filter(docHasPhoto512).length,0);
  const selectedPhotos=sites.reduce((n,s)=>n+reportPhotos526(s).length,0);
  const routeDays=(data.routeLogs||[]).length;
  return {sites,openTasks,overdue,dueToday,openDef,attention,photos,selectedPhotos,routeDays};
}
function fieldFocusStatus561(){
  const f=fieldFocusStats561();
  if(f.overdue.length) return {label:"Overdue", cls:"warn", detail:`${f.overdue.length} overdue task${f.overdue.length===1?"":"s"}`};
  if(f.openDef.length) return {label:"Deficiencies", cls:"danger", detail:`${f.openDef.length} open deficienc${f.openDef.length===1?"y":"ies"}`};
  if(f.dueToday.length) return {label:"Due Today", cls:"today", detail:`${f.dueToday.length} task${f.dueToday.length===1?"":"s"} due today`};
  if(f.attention.length) return {label:"Attention", cls:"watch", detail:`${f.attention.length} site${f.attention.length===1?"":"s"} need review`};
  return {label:"Ready", cls:"ready", detail:"No urgent field items"};
}
function fieldFocusMarkup561(){
  const f=fieldFocusStats561();
  const status=fieldFocusStatus561();
  const collapsed=homeCardCollapsed5100("fieldFocus");
  return `<div class="card fieldFocus561 homeCollapsible5100 ${status.cls} ${collapsed?"homeCollapsed5100":""}" data-home-collapsible="fieldFocus">
    <div class="fieldFocusHead561">
      <div><h2>Field Focus</h2><p>${esc(status.detail)}</p></div>
      <div class="homeHeaderActions5100"><button class="fieldFocusOpen562" id="openActionCenter562">${esc(status.label)} →</button>${homeCollapseButton5100("fieldFocus","Field Focus")}</div>
    </div>
    <div class="homeCollapseBody5100" data-home-collapse-body ${collapsed?"hidden":""}>
      <div class="fieldFocusGrid561">
        <button id="focusAttention561"><strong>${f.attention.length}</strong><span>Attention</span></button>
        <button id="focusTasks561"><strong>${f.openTasks.length}</strong><span>Open Tasks</span></button>
        <button id="focusDef561"><strong>${f.openDef.length}</strong><span>Deficiencies</span></button>
        <button id="focusPhotos561"><strong>${f.photos}</strong><span>Photos</span></button>
      </div>
      <div class="fieldFocusMini561">
        <button id="focusToday561"><strong>${f.dueToday.length}</strong><span>Due Today</span></button>
        <button id="focusOverdue561"><strong>${f.overdue.length}</strong><span>Overdue</span></button>
        <button id="focusReports561"><strong>${f.selectedPhotos}</strong><span>Report Photos</span></button>
        <button id="focusRoutes561"><strong>${f.routeDays}</strong><span>Route Days</span></button>
      </div>
    </div>
  </div>`;
}
function fieldFocusText561(){
  const f=fieldFocusStats561();
  const status=fieldFocusStatus561();
  const lines=[
    "FireVault Field Focus",
    `Build: ${BUILD}`,
    `Date: ${new Date().toLocaleString()}`,
    "",
    `Status: ${status.label} - ${status.detail}`,
    `Sites: ${f.sites.length}`,
    `Attention Sites: ${f.attention.length}`,
    `Open Tasks: ${f.openTasks.length}`,
    `Due Today: ${f.dueToday.length}`,
    `Overdue Tasks: ${f.overdue.length}`,
    `Open Deficiencies: ${f.openDef.length}`,
    `Photos: ${f.photos}`,
    `Selected Report Photos: ${f.selectedPhotos}`,
    `Route Days: ${f.routeDays}`
  ];
  return lines.join("\n");
}
async function copyFieldFocus561(){
  try{
    await navigator.clipboard.writeText(fieldFocusText561());
    toast("Field Focus copied.");
  }catch{
    toast("Clipboard unavailable.");
  }
}
function wireFieldFocus561(){
  const openAction=document.getElementById("openActionCenter562"); if(openAction) openAction.onclick=()=>route("actionCenter");
  const attention=document.getElementById("focusAttention561"); if(attention) attention.onclick=()=>{actionCenterFilter562="attention"; route("actionCenter");};
  const tasks=document.getElementById("focusTasks561"); if(tasks) tasks.onclick=()=>{actionCenterFilter562="all"; route("actionCenter");};
  const def=document.getElementById("focusDef561"); if(def) def.onclick=()=>{selectedSiteId=null; actionCenterFilter562="deficiencies"; route("actionCenter");};
  const photos=document.getElementById("focusPhotos561"); if(photos) photos.onclick=()=>route("sites");
  const today=document.getElementById("focusToday561"); if(today) today.onclick=()=>{actionCenterFilter562="today"; route("actionCenter");};
  const overdue=document.getElementById("focusOverdue561"); if(overdue) overdue.onclick=()=>{actionCenterFilter562="overdue"; route("actionCenter");};
  const reports=document.getElementById("focusReports561"); if(reports) reports.onclick=()=>{actionCenterFilter562="reports"; route("actionCenter");};
  const routes=document.getElementById("focusRoutes561"); if(routes) routes.onclick=()=>route("routeLog");
}


/* Build 0.50.75 Data Tools / Home cleanup helpers */
function dataSafeSummary560(){
  const s=backupSafetyStats552();
  const lastRestore=localStorage.getItem("firevault_last_restore_time");
  const lastRestoreBuild=localStorage.getItem("firevault_last_restore_build") || "";
  const kb=s.bytes ? `${Math.max(1,Math.round(s.bytes/1024))} KB` : "Size unknown";
  const restoreLine=lastRestore ? `Last restore: ${new Date(lastRestore).toLocaleDateString()}${lastRestoreBuild?` • ${lastRestoreBuild}`:""}` : "No restore recorded";
  return {stats:s,kb,restoreLine};
}
function dataSafeCard560(){
  const d=dataSafeSummary560();
  return `<button class="card dataSafeCard560" id="dataToolsHome560">
    <div class="dataSafeIcon560">↧</div>
    <div><strong>Data Safe</strong><span>${esc(d.stats.sites)} sites • ${esc(d.stats.docs)} docs • ${esc(d.kb)}</span><em>Backup, Restore, Diagnostics</em></div>
    <b>Open</b>
  </button>`;
}

function layoutControlSummary564(){
  const v=data.settings.visibility || {};
  const on = k => v[k] !== false;
  return [
    `Preset: ${layoutPresetName565()}`,
    `Field Focus: ${on("fieldFocus")?"On":"Off"}`,
    `Pinned Sites: ${on("pinnedSites")?"On":"Off"} (${pinnedSites566(99).length} pinned)`,
    `Data Safe Home Card: ${on("dataSafeHome")?"On":"Off"}`,
    `Important Site Info: ${on("importantSiteInfo")?"On":"Off"}`,
    `Site Brief: ${on("siteBrief")?"On":"Off"}`,
    `Site Activity Timeline: ${on("siteTimeline")?"On":"Off"}`
  ].join("\n");
}
async function copyLayoutControls564(){
  const txt=[
    "FireVault Layout Controls",
    `Build: ${BUILD}`,
    "",
    layoutControlSummary564(),
    "",
    "Settings path: Settings → Modules"
  ].join("\n");
  try{
    await navigator.clipboard.writeText(txt);
    toast("Layout controls copied.");
  }catch{
    toast("Clipboard unavailable.");
  }
}
function layoutControlsCard564(){
  const v=data.settings.visibility || {};
  const state=k=>v[k] !== false ? "On" : "Off";
  return `<div class="card layoutControls564">
    <div class="layoutControlsHead565"><div><h2>Layout Controls</h2><p>Current preset: ${esc(layoutPresetName565())}. Home and account-screen cards can be enabled or hidden from Settings → Modules.</p></div><span>${esc(layoutPresetName565())}</span></div>
    <div class="layoutControlGrid564">
      <div><strong>${esc(state("fieldFocus"))}</strong><span>Field Focus</span></div>
      <div><strong>${esc(state("pinnedSites"))}</strong><span>Pinned Sites</span></div>
      <div><strong>${esc(state("dataSafeHome"))}</strong><span>Data Safe Home</span></div>
      <div><strong>${esc(state("importantSiteInfo"))}</strong><span>Important Info</span></div>
      <div><strong>${esc(state("siteBrief"))}</strong><span>Site Brief</span></div>
      <div><strong>${esc(state("siteTimeline"))}</strong><span>Site Timeline</span></div>
    </div>
    <div class="layoutControlActions565"><button class="ghost" id="copyLayoutControls564">Copy Layout Controls</button><button class="ghost" id="openLayoutSettings565">Open Layout Settings</button></div>
  </div>`;
}

function dataToolsStatusGrid560(){
  const d=dataSafeSummary560();
  const s=d.stats;
  return `<div class="dataToolsGrid560">
    <div><strong>${s.sites}</strong><span>Sites</span></div>
    <div><strong>${s.visits}</strong><span>Visits</span></div>
    <div><strong>${s.docs}</strong><span>Docs</span></div>
    <div><strong>${s.photoDocs}</strong><span>Photos</span></div>
    <div><strong>${s.tasks}</strong><span>Tasks</span></div>
    <div><strong>${s.deficiencies}</strong><span>Def.</span></div>
    <div><strong>${s.routes}</strong><span>Route Days</span></div>
    <div><strong>${esc(d.kb)}</strong><span>Local Data</span></div>
  </div>`;
}
function dataTools(){
  const d=dataSafeSummary560();
  html(`<div class="screen dataToolsScreen560">
    <div class="row dataToolsTop560"><button class="back ghost" id="backHome560">←</button><div><h1>Data Tools</h1><p>Backup, restore, diagnostics, and build safety.</p></div></div>
    <div class="card dataToolsHero560">
      <div><h2>FireVault Data Safety</h2><p>${esc(d.restoreLine)}</p></div>
      <span>${esc(BUILD)}</span>
    </div>
    ${layoutControlsCard564()}
    ${dataToolsStatusGrid560()}
    ${backupSafetyMarkup552()}
    ${backupRestoreCenterMarkup554()}
    <div class="card dataToolsMaintenance560">
      <div class="dataToolsMaintenanceHead560"><div><h2>Maintenance</h2><p>Use these when troubleshooting, checking startup health, or preparing a support note.</p></div></div>
      <div class="dataToolsActions560">
        <button class="ghost" id="copyFieldFocus561">Copy Field Focus</button>
        <button class="ghost" id="openPinnedSitesData567">Open Pinned Sites</button>
        <button class="ghost" id="copyPinnedSitesData566">Copy Pinned Sites</button>
        <button class="ghost" id="copyActionCenterData562">Copy Action Center</button>
        <button class="ghost" id="copyDiagnostics560">Copy Diagnostics</button>
        <button class="ghost" id="copyStartupHealth560">Copy Startup Health</button>
        <button class="ghost" id="openDiagnostics560">Open Diagnostics</button>
        <button class="danger" id="repairVault560">Repair Vault</button>
      </div>
    </div>
    <div class="card dataToolsInfo560">
      <h2>Recommended update order</h2>
      <p>Download Backup → install / commit the new build → confirm FireVault opens → check one saved account → keep the backup file until the build is confirmed stable.</p>
    </div>
  </div>`);
  document.getElementById("backHome560").onclick=()=>returnFromSettingsSubmenu576("home");
  wireBackupSafety552();
  const layoutCopy=document.getElementById("copyLayoutControls564"); if(layoutCopy) layoutCopy.onclick=copyLayoutControls564;
  const openLayout=document.getElementById("openLayoutSettings565"); if(openLayout) openLayout.onclick=()=>{settingsTab="visibility"; mode="settingsDetail"; route("settings");};
  const focus=document.getElementById("copyFieldFocus561"); if(focus) focus.onclick=copyFieldFocus561;
  const actionCopy=document.getElementById("copyActionCenterData562"); if(actionCopy) actionCopy.onclick=copyActionCenter562;
  const pinnedOpen=document.getElementById("openPinnedSitesData567"); if(pinnedOpen) pinnedOpen.onclick=()=>route("pinnedSites");
  const pinnedCopy=document.getElementById("copyPinnedSitesData566"); if(pinnedCopy) pinnedCopy.onclick=copyPinnedSites566;
  const diag=document.getElementById("copyDiagnostics560"); if(diag) diag.onclick=copyDiagnostics;
  const startup=document.getElementById("copyStartupHealth560"); if(startup) startup.onclick=copyStartupHealth520;
  const openDiag=document.getElementById("openDiagnostics560"); if(openDiag) openDiag.onclick=()=>route("diagnostics");
  const repair=document.getElementById("repairVault560"); if(repair) repair.onclick=()=>{ if(confirm("Run Repair Vault? This checks and repairs FireVault's local data structure.")) repairVaultState(); };
}


/* Build 0.50.75 Backup Safety helpers */
function backupSafetyStats552(){
  const sites = (data.sites || []).length;
  const visits = (data.sites || []).reduce((n,s)=>n+((s.visits||[]).length),0);
  const docs = (data.sites || []).reduce((n,s)=>n+((s.docs||[]).length),0);
  const photoDocs = (data.sites || []).reduce((n,s)=>n+((s.docs||[]).filter(d=>{
    const kind=String(d.kind||d.type||"").toLowerCase();
    return kind==="photo" || !!d.photoData || !!d.imageData || /^image\//.test(String(d.mime||d.mimeType||""));
  }).length),0);
  const tasks = (data.sites || []).reduce((n,s)=>n+((s.tasks||[]).length),0);
  const deficiencies = (data.sites || []).reduce((n,s)=>n+((s.deficiencies||[]).length),0);
  const routes = (data.routeLogs || []).length;
  const resources = (data.resources || []).length;
  const bytes = (()=>{ try{return new Blob([JSON.stringify(data)]).size;}catch{return 0;} })();
  return {sites,visits,docs,photoDocs,tasks,deficiencies,routes,resources,bytes};
}
function backupFileName552(){
  const stamp = new Date().toISOString().slice(0,19).replace(/[:T]/g,"-");
  return `firevault-backup-${BUILD}-${stamp}.json`;
}
function downloadVaultBackup552(){
  try{
    const payload={app:"FireVault", build:BUILD, exportedAt:new Date().toISOString(), stats:backupSafetyStats552(), data};
    const blob=new Blob([JSON.stringify(payload,null,2)],{type:"application/json"});
    const url=URL.createObjectURL(blob);
    const a=document.createElement("a");
    a.href=url;
    a.download=backupFileName552();
    document.body.appendChild(a);
    a.click();
    setTimeout(()=>{URL.revokeObjectURL(url); a.remove();},450);
    toast("Backup downloaded.");
  }catch(err){
    console.error(err);
    toast("Backup failed.");
  }
}
async function copyBackupSummary552(){
  const s=backupSafetyStats552();
  const lines=[
    "FireVault Backup Summary",
    `Build: ${BUILD}`,
    `Date: ${new Date().toLocaleString()}`,
    `Sites: ${s.sites}`,
    `Visits: ${s.visits}`,
    `Documents: ${s.docs}`,
    `Photos: ${s.photoDocs}`,
    `Tasks: ${s.tasks}`,
    `Deficiencies: ${s.deficiencies}`,
    `Route Days: ${s.routes}`,
    `Resources: ${s.resources}`,
    `Approx. Backup Size: ${s.bytes ? Math.max(1,Math.round(s.bytes/1024))+" KB" : "Unknown"}`,
    "",
    "Recommended: download a backup before installing new FireVault builds or clearing browser data."
  ].join("\n");
  try{
    await navigator.clipboard.writeText(lines);
    toast("Backup summary copied.");
  }catch{
    toast("Clipboard unavailable.");
  }
}
function backupSafetyMarkup552(){
  const s=backupSafetyStats552();
  const kb=s.bytes ? `${Math.max(1,Math.round(s.bytes/1024))} KB` : "Size unknown";
  return `<div class="card backupSafety552">
    <div class="backupHead552"><div><h2>Backup Safety</h2><p>Save a copy before installing new builds or clearing browser data.</p></div><span>${esc(kb)}</span></div>
    <div class="backupStats552">
      <div><strong>${s.sites}</strong><span>Sites</span></div>
      <div><strong>${s.visits}</strong><span>Visits</span></div>
      <div><strong>${s.docs}</strong><span>Docs</span></div>
      <div><strong>${s.photoDocs}</strong><span>Photos</span></div>
      <div><strong>${s.tasks}</strong><span>Tasks</span></div>
      <div><strong>${s.deficiencies}</strong><span>Def.</span></div>
    </div>
    <div class="backupActions552">
      <button class="primary" id="downloadBackup552">Download Backup</button>
      <button class="ghost" id="copyBackupSummary552">Copy Summary</button>
      <button class="ghost" id="copyUpdateChecklist553">Copy Checklist</button>
    </div>
    <div class="backupChecklist553">
      <strong>Before updating:</strong>
      <span>Download Backup → commit/upload new build → verify app opens → keep the backup file.</span>
    </div>
  </div>`;
}

async function copyUpdateChecklist553(){
  const s=backupSafetyStats552();
  const lines=[
    "FireVault Update Checklist",
    `Current Build: ${BUILD}`,
    `Backup Size: ${s.bytes ? Math.max(1,Math.round(s.bytes/1024))+" KB" : "Unknown"}`,
    "",
    "1. Tap Download Backup and save the JSON file.",
    "2. Upload / commit the new FireVault build ZIP contents.",
    "3. Open the app and confirm the splash screen clears.",
    "4. Check Home, Add Site, Backup Safety, and one saved account.",
    "5. Keep the backup file until the new build is confirmed working.",
    "",
    "Data counts:",
    `Sites: ${s.sites}`,
    `Visits: ${s.visits}`,
    `Documents: ${s.docs}`,
    `Photos: ${s.photoDocs}`,
    `Tasks: ${s.tasks}`,
    `Deficiencies: ${s.deficiencies}`
  ].join("\n");
  try{
    await navigator.clipboard.writeText(lines);
    toast("Update checklist copied.");
  }catch{
    toast("Clipboard unavailable.");
  }
}


/* Build 0.50.75 Backup Restore Center */
let pendingRestoreBackup554 = null;

function normalizeBackupPayload554(raw){
  const payload = raw && typeof raw === "object" ? raw : null;
  if(!payload) return null;
  const restoredData = payload.data && typeof payload.data === "object" ? payload.data : payload;
  if(!restoredData || typeof restoredData !== "object") return null;
  if(!Array.isArray(restoredData.sites)) return null;
  if(!restoredData.settings || typeof restoredData.settings !== "object") restoredData.settings = data.settings || {};
  if(!Array.isArray(restoredData.resources)) restoredData.resources = [];
  if(!Array.isArray(restoredData.routeLogs)) restoredData.routeLogs = [];
  return {
    app: payload.app || "FireVault",
    build: payload.build || restoredData.build || "Unknown",
    exportedAt: payload.exportedAt || payload.date || payload.createdAt || "Unknown",
    data: restoredData
  };
}
function backupPreviewStats554(restoredData){
  const sites = (restoredData.sites || []).length;
  const visits = (restoredData.sites || []).reduce((n,s)=>n+((s.visits||[]).length),0);
  const docs = (restoredData.sites || []).reduce((n,s)=>n+((s.docs||[]).length),0);
  const photos = (restoredData.sites || []).reduce((n,s)=>n+((s.docs||[]).filter(d=>{
    const kind=String(d.kind||d.type||"").toLowerCase();
    return kind==="photo" || !!d.photoData || !!d.imageData || /^image\//.test(String(d.mime||d.mimeType||""));
  }).length),0);
  const tasks = (restoredData.sites || []).reduce((n,s)=>n+((s.tasks||[]).length),0);
  const deficiencies = (restoredData.sites || []).reduce((n,s)=>n+((s.deficiencies||[]).length),0);
  const routes = (restoredData.routeLogs || []).length;
  return {sites,visits,docs,photos,tasks,deficiencies,routes};
}
function restoreStatusMarkup554(){
  if(!pendingRestoreBackup554){
    return `<div class="restoreStatus554 empty"><strong>No backup loaded</strong><span>Choose a FireVault backup JSON file to preview it before restoring.</span></div>`;
  }
  const p=pendingRestoreBackup554;
  const s=backupPreviewStats554(p.data);
  return `<div class="restoreStatus554 ready">
    <div><strong>Backup Loaded / Ready to Restore</strong><span>Build ${esc(p.build)} • ${esc(p.exportedAt)}</span></div>
    <div class="restorePreviewGrid554">
      <div><b>${s.sites}</b><span>Sites</span></div>
      <div><b>${s.visits}</b><span>Visits</span></div>
      <div><b>${s.docs}</b><span>Docs</span></div>
      <div><b>${s.photos}</b><span>Photos</span></div>
      <div><b>${s.tasks}</b><span>Tasks</span></div>
      <div><b>${s.deficiencies}</b><span>Def.</span></div>
    </div>
    <p>This will overwrite the current FireVault local data only after you confirm restore.</p>
  </div>`;
}
function openBackupFilePicker554(){
  const input=document.getElementById("backupImportFile554");
  if(input) input.click();
}
function handleBackupFile554(file){
  if(!file){ toast("No backup selected."); return; }
  const reader=new FileReader();
  reader.onload=()=>{
    try{
      const raw=JSON.parse(String(reader.result || ""));
      const normalized=normalizeBackupPayload554(raw);
      if(!normalized){
        pendingRestoreBackup554=null;
        toast("Backup file not recognized.");
        render();
        return;
      }
      pendingRestoreBackup554=normalized;
      toast("Backup loaded for preview.");
      render();
    }catch(err){
      console.error(err);
      pendingRestoreBackup554=null;
      toast("Could not read backup JSON.");
      render();
    }
  };
  reader.onerror=()=>toast("Could not read file.");
  reader.readAsText(file);
}
function clearPendingRestore554(){
  pendingRestoreBackup554=null;
  toast("Restore preview cleared.");
  render();
}
function restorePendingBackup554(){
  if(!pendingRestoreBackup554){ toast("Load a backup first."); return; }
  const p=pendingRestoreBackup554;
  const s=backupPreviewStats554(p.data);
  const msg=[
    "Restore this FireVault backup?",
    "",
    `Backup build: ${p.build}`,
    `Backup date: ${p.exportedAt}`,
    `Sites: ${s.sites}`,
    `Visits: ${s.visits}`,
    `Docs/photos: ${s.docs}/${s.photos}`,
    "",
    "This will overwrite the current FireVault data on this device."
  ].join("\n");
  if(!confirm(msg)) return;
  try{
    Object.keys(data).forEach(k=>delete data[k]);
    Object.assign(data, p.data);
    save();
    localStorage.setItem("firevault_last_restore_build", String(p.build || "Unknown"));
    localStorage.setItem("firevault_last_restore_time", new Date().toISOString());
    pendingRestoreBackup554=null;
    toast("Backup restored.");
    route("home");
  }catch(err){
    console.error(err);
    toast("Restore failed.");
  }
}
function backupRestoreCenterMarkup554(){
  return `<div class="card restoreCenter554">
    <div class="restoreHead554"><div><h2>Restore Center</h2><p>Import a FireVault backup JSON, preview it, then restore only after confirmation.</p></div></div>
    <input id="backupImportFile554" type="file" accept=".json,application/json" hidden>
    ${restoreStatusMarkup554()}
    <div class="restoreActions554">
      <button class="ghost" id="chooseBackup554">Import Backup</button>
      <button class="primary" id="restoreBackup554" ${pendingRestoreBackup554?"":"disabled"}>Restore Backup</button>
      <button class="ghost" id="clearRestore554" ${pendingRestoreBackup554?"":"disabled"}>Clear Preview</button>
    </div>
    <p class="fieldNote">Restore keeps your current data untouched until you press Restore Backup and confirm the warning.</p>
  </div>`;
}
function wireRestoreCenter554(){
  const choose=document.getElementById("chooseBackup554");
  if(choose) choose.onclick=openBackupFilePicker554;
  const file=document.getElementById("backupImportFile554");
  if(file) file.onchange=e=>handleBackupFile554(e.target.files && e.target.files[0]);
  const restore=document.getElementById("restoreBackup554");
  if(restore) restore.onclick=restorePendingBackup554;
  const clear=document.getElementById("clearRestore554");
  if(clear) clear.onclick=clearPendingRestore554;
}

function wireBackupSafety552(){
  const dl=document.getElementById("downloadBackup552");
  if(dl) dl.onclick=downloadVaultBackup552;
  const copy=document.getElementById("copyBackupSummary552");
  if(copy) copy.onclick=copyBackupSummary552;
  const checklist=document.getElementById("copyUpdateChecklist553");
  if(checklist) checklist.onclick=copyUpdateChecklist553;
  wireRestoreCenter554();
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
    ${startupHealthCard520()}
    ${backupSafetyMarkup552()}
    ${backupRestoreCenterMarkup554()}
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
      <div class="card errorBox"><p>Build: ${BUILD}</p><p>Total Tasks: ${totalTasks}</p><p>Due Today: ${taskCounts.today}</p><p>Site Follow-Ups: ${serviceTasks}</p><p>Total Deficiencies: ${totalDef}</p><p>Closed Deficiencies: ${closedDefTotal}</p><p>Total Contacts: ${totalContacts}</p><p>Total Documents: ${totalDocs}</p><p>Report Deliveries: ${totalReportDeliveries}</p><p>Report Follow-Ups: ${reportFollowUps}</p><p>Checklist Items: ${totalChecklist}</p><p>Checklist Issues: ${checklistIssues}</p><p>Completed Inspections: ${completedInspections}</p><p>Attention Sites: ${healthWarn}</p><p>Watch Sites: ${healthWatch}</p><p>Old Job Record: ${activeJob ? esc(activeJob.siteName) : "None"}</p><p>Current Theme: ${esc(data.settings.theme.name)}</p><p>Accent: ${esc(data.settings.theme.accentColor)}</p><p>Route Days: ${(data.routeLogs||[]).length}</p><p>GPS Tools: ${data.settings.gps?.enabled !== false ? "Enabled" : "Hidden"}</p><p>Nearby Radius: ${nearbyRadiusMiles()} mi</p><p>Haptics: ${data.settings.app?.haptics !== false ? "Enabled" : "Off"}</p><p>Last Stability Check: ${esc(lastCheck)}</p><p>Storage key: ${KEY}</p><p>Modules loaded successfully.</p></div>
    </div>
  </div>`);
  document.getElementById("backHome").onclick=()=>returnFromSettingsSubmenu576("home");
  document.getElementById("repairVaultBtn").onclick=repairVaultState;
  document.getElementById("copyDiagBtn").onclick=copyDiagnostics;
  const startupBtn=document.getElementById("copyStartupHealth520");
  if(startupBtn) startupBtn.onclick=copyStartupHealth520;
  wireBackupSafety552();
}
function showChangelog(){
  const notes = [
    "Advanced to milestone Build 0.51.0 from the stable 0.50.76 baseline.",
    "Added collapsible Home cards for Pinned Sites, Field Focus, Nearby Accounts, and Recent Accounts.",
    "Each Home card remembers its open or closed state between app sessions while remaining open by default for existing users.",
    "Improved iPad portrait and landscape reflow so Home modules use available width without stretching phone layouts or hiding controls.",
    "Preserved Settings scroll recovery, active presets, all existing workflows, and FIRE-red / VAULT-white branding."
  ];
  const overlay=document.createElement("div");
  overlay.className="releaseOverlay";
  overlay.innerHTML=`<div class="releaseSheet" role="dialog" aria-modal="true" aria-label="FireVault release notes">
    <div class="releaseHead"><div><strong>${fireVaultBrand575()}</strong><span>Build ${BUILD}</span></div><button class="ghost iconBtn" id="closeRelease" aria-label="Close release notes">×</button></div>
    <div class="releaseBody"><h2>Release Notes</h2><p class="releaseIntro">A cleaner Home that adapts to phones and iPads.</p><ul>${notes.map(n=>`<li>${esc(n)}</li>`).join("")}</ul></div>
  </div>`;
  document.body.appendChild(overlay);
  const close=()=>overlay.remove();
  document.getElementById("closeRelease").onclick=close;
  overlay.addEventListener("click",e=>{ if(e.target===overlay) close(); });
}


function bootFireVault518(){
  try{
    window.__FIREVAULT_MODULE_READY = true;
    document.body.classList.remove("app-loading533");
    document.body.classList.add("app-booted533");
    render();
    document.body.classList.add("app-chrome-ready536");
    showGlobalChrome537();
    document.getElementById("appHeader")?.removeAttribute("style");
    document.getElementById("appNav")?.removeAttribute("style");
    window.__FIREVAULT_BOOTED = true;
    localStorage.setItem("firevault_last_boot_ok", new Date().toLocaleString());
    localStorage.setItem("firevault_last_boot_build", BUILD);
    localStorage.setItem("firevault_last_boot_route", view || "home");
    localStorage.removeItem("firevault_last_boot_error");
  }catch(err){
    window.__FIREVAULT_LAST_ERROR = err && err.message ? err.message : String(err);
    try{
      localStorage.setItem("firevault_last_boot_error", window.__FIREVAULT_LAST_ERROR);
      localStorage.setItem("firevault_last_boot_build", BUILD);
    }catch{}
    const app=document.getElementById("app");
    document.body.classList.remove("app-loading533");
    document.body.classList.add("app-boot-error533");
    document.getElementById("appHeader")?.removeAttribute("style");
    document.getElementById("appNav")?.removeAttribute("style");
    if(app){
      app.innerHTML=`<div class="screen"><div class="card errorBox"><h1>FireVault startup error</h1><p>The module loaded, but the app could not render.</p><p>${esc(window.__FIREVAULT_LAST_ERROR)}</p><button class="primary" onclick="location.reload()">Reload App</button></div></div>`;
    }
  }
}
const splashStarted518 = Number(window.__FIREVAULT_SPLASH_STARTED || Date.now());
const minSplashMs518 = Number(window.__FIREVAULT_MIN_SPLASH_MS || 5000);
const elapsedSplashMs518 = Date.now() - splashStarted518;
setTimeout(bootFireVault518, Math.max(0, minSplashMs518 - elapsedSplashMs518));
