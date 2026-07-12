import { BUILD, KEY, ACTIVE_JOB_KEY, loadData, saveData, ensureSite, fullAddress, esc, uid, downloadBlob, syncSummary, syncQueue, syncConflicts, syncActivity, createSyncPackage, importSyncPackage, resolveSyncConflict, notePackageExport, deviceIdentity, recordSyncActivity, autoBackupInfo, latestAutoBackup, restoreAutoBackup, isDemoMode, setDemoMode, resetDemoData } from "./storage.js?v=0.75.0";
window.__FIREVAULT_MODULE_READY = true;

function fvPreferenceStore0739(){
  if(isDemoMode()){
    try{return sessionStorage;}catch{}
  }
  try{return localStorage;}catch{return null;}
}
function fvSafeSet0739(key,value){
  const text=String(value);
  const preferred=fvPreferenceStore0739();
  try{preferred?.setItem(key,text);return true;}catch(err){
    try{sessionStorage.setItem(key,text);return true;}catch{}
    console.warn("FireVault preference could not be saved",key,err);
    return false;
  }
}
function fvSafeRemove0739(key){
  try{localStorage.removeItem(key);}catch{}
  try{sessionStorage.removeItem(key);}catch{}
}
function fvSafeGet0739(key,fallback=""){
  if(isDemoMode()){
    try{const v=sessionStorage.getItem(key);if(v!==null)return v;}catch{}
  }
  try{const v=localStorage.getItem(key);return v===null?fallback:v;}catch{return fallback;}
}
function demoStorageLabel0739(){return isDemoMode()?"Temporary in-memory demo workspace":KEY;}

const DEMO_ACTIVE_JOB_KEY_0738 = `${ACTIVE_JOB_KEY}_demo`;
const DEMO_ACTIVE_ROUTE_KEY_0738 = "firevault_active_route_day_demo";

let data = loadData();
if(typeof window.fireVaultSplashDatabaseReady0732 === "function") window.fireVaultSplashDatabaseReady0732(Array.isArray(data?.sites)?data.sites.length:0);
let view = new URLSearchParams(location.search).get("route") || data.settings.app?.defaultScreen || "home";
let selectedSiteId = null;
let mode = null;
let settingsTab = "tech";
let settingsGroup067 = "";
let settingsRailScroll = 0;
const SETTINGS_SCROLL_KEY_576 = "firevault_settings_scroll_05076";
let settingsSubmenuReturn576 = false;
let customerImportState065 = {fileName:"",headers:[],rows:[],summary:null,error:"",includeFlagged:false,requireCoordinates:true,filter:"all",lastResult:null,geocoding:{active:false,total:0,complete:0,matched:0,noMatch:0,error:0},geocodeError:""};
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
const NEARBY_STATE_KEY_0652 = "firevault_nearby_state_0652";
let nearbyState = loadNearbyState0652();
let nearbyScanStatus0652 = {state:"idle",message:"",attempt:"",at:""};
let siteSearch = "";
let sitesFilter0736 = "all";
let dailySummaryDate569 = fvSafeGet0739("firevault_daily_summary_date","");
let dailyPickerMonth571 = localDateString().slice(0,7);
let libraryFolder = "all";
let docVaultFilter516 = "all";
let docVaultSearch521 = "";
let docVaultSort522 = "recent";
let routeReviewId = "";
let routeHistorySearch = "";
let simpleToolsOpen = false;
let accountDetailTab0735 = "overview";
let accountDetailSite0735 = "";
let nearbyMapGroups0735 = [];
let homeInstallTipHidden = fvSafeGet0739("firevault_home_install_tip_hidden","") === "1";
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
function fvIcon073(name, extraClass=""){
  const icons={
    home:'<path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10.5V20h13v-9.5"/><path d="M9.5 20v-6h5v6"/>',
    nearby:'<circle cx="12" cy="12" r="6"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/><circle cx="12" cy="12" r="1.4"/>',
    accounts:'<rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><rect x="14" y="14" width="6" height="6" rx="1"/>',
    library:'<path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3z"/><path d="M8 4v16M8 17h11"/>',
    tools:'<path d="M4 9h16v10H4z"/><path d="M9 9V6h6v3M4 13h16M10 13v2h4v-2"/>',
    settings:'<path d="M4 6h10M18 6h2M4 12h3M11 12h9M4 18h8M16 18h4"/><circle cx="16" cy="6" r="2"/><circle cx="9" cy="12" r="2"/><circle cx="14" cy="18" r="2"/>',
    map:'<path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3z"/><path d="M9 3v15M15 6v15"/>',
    list:'<path d="M8 6h13M8 12h13M8 18h13"/><circle cx="4" cy="6" r="1"/><circle cx="4" cy="12" r="1"/><circle cx="4" cy="18" r="1"/>',
    route:'<path d="M5 19 19 5M10 5h9v9"/><path d="M5 8v11h11"/>',
    call:'<path d="M7 4 4.8 6.2c-.8.8-.9 2-.4 3 2 4.2 5.4 7.6 9.6 9.6 1 .5 2.2.4 3-.4L19.2 16l-4-3-1.7 1.7a13.5 13.5 0 0 1-4.2-4.2L11 8.8z"/>',
    note:'<path d="M5 4h14v16H5z"/><path d="M8 8h8M8 12h8M8 16h5"/>',
    visit:'<circle cx="12" cy="8" r="3"/><path d="M6 21v-2a6 6 0 0 1 12 0v2"/><path d="M19 4v4M17 6h4"/>',
    photo:'<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="10" r="2"/><path d="m21 15-5-5L5 19"/>'
  };
  return `<svg class="fvIcon073 ${esc(extraClass)}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${icons[name]||icons.home}</svg>`;
}

const HOME_LAYOUT_CARDS_550 = [
  {key:"pinnedSites", label:"Pinned Sites", note:"Fast shortcuts to high-use customer accounts.", tone:"violet", module:"pinnedSites"},
  {key:"fieldFocus", label:"Field Focus", note:"Open tasks, deficiencies, photos, and urgent field work.", tone:"red", module:"fieldFocus"},
  {key:"nearbyAccounts", label:"Nearby Accounts", note:"GPS-based customer accounts near your current location.", tone:"cyan", module:"advancedGps"},
  {key:"recentAccounts", label:"Recent Accounts", note:"Quick access to the accounts you opened most recently.", tone:"amber", module:""}
];
const HOME_LAYOUT_PRESETS_550 = {
  clean:{label:"Clean Home", icon:"◯", note:"Show only Recent Accounts for the lightest everyday Home screen.", cards:{pinnedSites:[false,"remember"],fieldFocus:[false,"remember"],nearbyAccounts:[false,"remember"],recentAccounts:[true,"expanded"]}},
  field:{label:"Field Ready", icon:"▣", note:"Prioritize pinned accounts, Field Focus, and nearby work.", cards:{pinnedSites:[true,"remember"],fieldFocus:[true,"expanded"],nearbyAccounts:[true,"remember"],recentAccounts:[false,"remember"]}},
  compact:{label:"Compact Cards", icon:"▤", note:"Keep every card available but start each one collapsed.", cards:{pinnedSites:[true,"collapsed"],fieldFocus:[true,"collapsed"],nearbyAccounts:[true,"collapsed"],recentAccounts:[true,"collapsed"]}},
  full:{label:"Full Home", icon:"◆", note:"Show every optional Home card and remember your open/closed choices.", cards:{pinnedSites:[true,"remember"],fieldFocus:[true,"remember"],nearbyAccounts:[true,"remember"],recentAccounts:[true,"remember"]}}
};
function homeLayoutSettings550(){
  data.settings.homeLayout=data.settings.homeLayout||{};
  data.settings.homeLayout.cards=data.settings.homeLayout.cards||{};
  HOME_LAYOUT_CARDS_550.forEach(card=>{
    const current=data.settings.homeLayout.cards[card.key]||{};
    const behavior=["remember","expanded","collapsed"].includes(current.behavior)?current.behavior:"remember";
    data.settings.homeLayout.cards[card.key]={visible:current.visible!==false,behavior};
  });
  data.settings.homeLayout.preset=data.settings.homeLayout.preset||"custom";
  return data.settings.homeLayout;
}
function homeLayoutCard550(key){ return homeLayoutSettings550().cards[key]||{visible:true,behavior:"remember"}; }
function homeLayoutModuleAvailable550(key){
  const card=HOME_LAYOUT_CARDS_550.find(x=>x.key===key);
  return !card?.module || featureOn(card.module);
}
function homeCardVisible550(key){ return homeLayoutCard550(key).visible!==false && homeLayoutModuleAvailable550(key); }
function homeLayoutPresetMatch550(name){
  const preset=HOME_LAYOUT_PRESETS_550[name];
  if(!preset) return false;
  return Object.entries(preset.cards).every(([key,[visible,behavior]])=>{
    const card=homeLayoutCard550(key);
    return card.visible===visible && card.behavior===behavior;
  });
}
function activeHomeLayoutPreset550(){ return Object.keys(HOME_LAYOUT_PRESETS_550).find(homeLayoutPresetMatch550)||""; }
function applyHomeLayoutPreset550(name){
  const preset=HOME_LAYOUT_PRESETS_550[name];
  if(!preset){ toast("Home preset unavailable."); return; }
  captureSettingsScroll576();
  const layout=homeLayoutSettings550();
  Object.entries(preset.cards).forEach(([key,[visible,behavior]])=>layout.cards[key]={visible,behavior});
  layout.preset=name;
  homeCardState5100={};
  persistHomeCardState5100();
  save();
  settings();
  toast(`${preset.label} applied.`);
}
function resetHomeLayout550(){
  captureSettingsScroll576();
  data.settings.homeLayout={preset:"custom",cards:{}};
  homeLayoutSettings550();
  homeCardState5100={};
  persistHomeCardState5100();
  save();
  settings();
  toast("Home layout reset.");
}
function setAllHomeCardState550(collapsed){
  captureSettingsScroll576();
  const layout=homeLayoutSettings550();
  HOME_LAYOUT_CARDS_550.forEach(card=>{
    homeCardState5100[card.key]=collapsed;
    layout.cards[card.key]={...layout.cards[card.key],behavior:collapsed?"collapsed":"expanded"};
  });
  layout.preset="custom";
  persistHomeCardState5100();
  save();
  settings();
  toast(collapsed?"All optional Home cards set to collapsed.":"All optional Home cards set to open.");
}

/* Build 0.55.0 Home card layout controls */
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
function homeCardCollapsed5100(key){
  const behavior=homeLayoutCard550(key).behavior;
  if(behavior==="expanded") return false;
  if(behavior==="collapsed") return true;
  return homeCardState5100[key]===true;
}
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
  const home=document.querySelector(".settingsTabItems0736, .settingsHomeScreen488.settingsStable573");
  if(home) settingsScrollState576.home=Math.max(0,Number(home.scrollTop)||0);
  const detail=document.querySelector(".settingsDetailBody488, .settingsDetailBody451");
  if(detail) settingsScrollState576.details[settingsTab]=Math.max(0,Number(detail.scrollTop)||0);
  settingsRailScroll=settingsScrollState576.home;
  persistSettingsScrollState576();
}
function restoreSettingsScroll576(inDetail){
  const selector=inDetail ? ".settingsDetailBody488, .settingsDetailBody451" : ".settingsTabItems0736, .settingsHomeScreen488.settingsStable573";
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
  const appNav=document.getElementById("appNav");
  if(appNav) appNav.classList.remove("fvNavThree0733");
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

queueMicrotask(()=>{ try{ normalizeAllSiteGps0652(); }catch{} });

function finiteGpsNumber0652(value,min,max){
  if(value===null || value===undefined || value==="") return null;
  const n=Number(value);
  return Number.isFinite(n) && n>=min && n<=max ? n : null;
}
function alternateGpsPair0652(s){
  if(!s || typeof s!=="object") return null;
  const candidates=[
    [s.gps?.lat,s.gps?.lng],
    [s.latitude,s.longitude],
    [s.lat,s.lng],
    [s.location?.latitude,s.location?.longitude],
    [s.location?.lat,s.location?.lng],
    [s.coordinates?.latitude,s.coordinates?.longitude],
    [s.coordinates?.lat,s.coordinates?.lng],
    [s.importMetadata?.latitude,s.importMetadata?.longitude]
  ];
  for(const [latRaw,lngRaw] of candidates){
    const lat=finiteGpsNumber0652(latRaw,-90,90),lng=finiteGpsNumber0652(lngRaw,-180,180);
    if(lat!==null && lng!==null) return {lat:Number(lat.toFixed(6)),lng:Number(lng.toFixed(6))};
  }
  return null;
}
function normalizeSiteGps0652(s){
  const pair=alternateGpsPair0652(s);
  if(!pair) return false;
  const currentLat=finiteGpsNumber0652(s?.gps?.lat,-90,90),currentLng=finiteGpsNumber0652(s?.gps?.lng,-180,180);
  if(currentLat!==null && currentLng!==null) return false;
  s.gps={
    ...(s.gps&&typeof s.gps==="object"?s.gps:{}),
    lat:pair.lat,lng:pair.lng,
    accuracy:Number(s?.gps?.accuracy||0),
    capturedAt:s?.gps?.capturedAt||s?.geocodedAt||s?.modifiedAt||new Date().toISOString(),
    source:s?.gps?.source||s?.geocodeSource||"Recovered imported coordinates"
  };
  return true;
}
function normalizeAllSiteGps0652(){
  let changed=0;
  (data.sites||[]).forEach(s=>{if(normalizeSiteGps0652(s)) changed++;});
  if(changed){ saveData(data); data=loadData(); }
  return changed;
}
function nearbyStateStorageKey0738(){ return isDemoMode()?`${NEARBY_STATE_KEY_0652}_demo`:NEARBY_STATE_KEY_0652; }
function loadNearbyState0652(){
  if(isDemoMode()) return {lat:43.6150,lng:-116.2023,accuracy:25,at:new Date().toISOString(),source:"Demo Boise location"};
  try{
    const parsed=JSON.parse(sessionStorage.getItem(nearbyStateStorageKey0738())||"null");
    if(parsed && finiteGpsNumber0652(parsed.lat,-90,90)!==null && finiteGpsNumber0652(parsed.lng,-180,180)!==null) return parsed;
  }catch{}
  return null;
}
function saveNearbyState0652(state){
  nearbyState=state;
  try{ const key=nearbyStateStorageKey0738(); state?sessionStorage.setItem(key,JSON.stringify(state)):sessionStorage.removeItem(key); }catch{}
}
function gpsInventory0652(){
  normalizeAllSiteGps0652();
  const total=(data.sites||[]).length;
  const ready=(data.sites||[]).filter(hasGps).length;
  const imported=(data.sites||[]).filter(s=>s.importSource==="Customer CSV"||s.externalAccountId).length;
  return {total,ready,missing:Math.max(0,total-ready),imported};
}
function geolocationErrorMessage0652(err){
  const code=Number(err?.code||0);
  if(code===1) return "Location permission is blocked. Allow location access for FireVault/Safari, then scan again.";
  if(code===2) return "The phone could not determine its location. Move where GPS or cellular service is available and retry.";
  if(code===3) return "The location request timed out. FireVault will retry once using standard accuracy.";
  return `Location check failed${err?.message?`: ${err.message}`:"."}`;
}
function setNearbyScanStatus0652(state,message,attempt=""){
  nearbyScanStatus0652={state,message,attempt,at:new Date().toISOString()};
}
function requestCurrentLocation0652(onSuccess,onFailure,options){
  navigator.geolocation.getCurrentPosition(pos=>{
    const lat=finiteGpsNumber0652(pos?.coords?.latitude,-90,90),lng=finiteGpsNumber0652(pos?.coords?.longitude,-180,180);
    if(lat===null || lng===null){ onFailure({code:2,message:"Invalid coordinates were returned."}); return; }
    onSuccess({lat:Number(lat.toFixed(6)),lng:Number(lng.toFixed(6)),accuracy:Math.round(Number(pos.coords.accuracy||0)),at:new Date().toISOString()});
  },onFailure,options);
}
function runNearbyScan0652(destination="nearbySites"){
  if(isDemoMode()){
    const state={lat:43.6150,lng:-116.2023,accuracy:25,at:new Date().toISOString(),source:"Demo Boise location"};
    saveNearbyState0652(state);
    setNearbyScanStatus0652("success","Demo Mode is using a simulated location in downtown Boise.","demo");
    destination==="home"?home():nearbySites();
    return;
  }
  if(data.settings.gps?.enabled===false){
    setNearbyScanStatus0652("error","GPS tools are disabled in Settings → GPS / Maps.");
    destination==="home"?home():nearbySites(); return;
  }
  if(!navigator.geolocation){
    setNearbyScanStatus0652("error","GPS is not available in this browser or app session.");
    destination==="home"?home():nearbySites(); return;
  }
  const inventory=gpsInventory0652();
  if(!inventory.ready){
    setNearbyScanStatus0652("no-sites",`${inventory.total} sites are saved, but none currently contain usable latitude and longitude.`);
    destination==="home"?home():nearbySites(); return;
  }
  setNearbyScanStatus0652("scanning","Requesting your current location…","high");
  destination==="home"?home():nearbySites();
  const success=state=>{
    saveNearbyState0652(state);
    setNearbyScanStatus0652("success",`Location updated with ±${state.accuracy||0} m accuracy.`);
    destination==="home"?home():nearbySites();
  };
  const firstFailure=err=>{
    if(Number(err?.code)===2 || Number(err?.code)===3){
      setNearbyScanStatus0652("scanning","High-accuracy GPS did not respond. Retrying with standard accuracy…","standard");
      destination==="home"?home():nearbySites();
      requestCurrentLocation0652(success,finalErr=>{
        setNearbyScanStatus0652("error",geolocationErrorMessage0652(finalErr),"standard");
        destination==="home"?home():nearbySites();
      },{enableHighAccuracy:false,timeout:20000,maximumAge:300000});
      return;
    }
    setNearbyScanStatus0652("error",geolocationErrorMessage0652(err),"high");
    destination==="home"?home():nearbySites();
  };
  requestCurrentLocation0652(success,firstFailure,gpsOptions());
}

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
const PLUS_CODE_ALPHABET_071="23456789CFGHJMPQRVWX";
const PLUS_CODE_RESOLUTIONS_071=[20,1,.05,.0025,.000125];
const LOCATION_POINT_TYPES_071=["Main Entrance","Parking","Exterior Door","Riser Room","Fire Alarm Panel","FDC","Sprinkler Room","Other"];
function encodePlusCode071(latitude,longitude){
  let lat=Number(latitude),lng=Number(longitude);
  if(!Number.isFinite(lat)||!Number.isFinite(lng)) return "";
  lat=Math.min(90,Math.max(-90,lat));
  if(lat===90) lat=90-1e-12;
  while(lng<-180) lng+=360; while(lng>=180) lng-=360;
  lat+=90; lng+=180;
  let code="";
  for(const resolution of PLUS_CODE_RESOLUTIONS_071){
    const latDigit=Math.floor(lat/resolution),lngDigit=Math.floor(lng/resolution);
    code+=PLUS_CODE_ALPHABET_071[latDigit]+PLUS_CODE_ALPHABET_071[lngDigit];
    lat-=latDigit*resolution; lng-=lngDigit*resolution;
    if(code.length===8) code+="+";
  }
  return code;
}
function sitePlusCode071(s){
  if(!s) return "";
  if(hasGps(s)){
    const code=encodePlusCode071(s.gps.lat,s.gps.lng);
    if(code&&s.plusCode!==code) s.plusCode=code;
    return code;
  }
  return String(s.plusCode||"").trim();
}
function locationPoints071(s){
  if(!s) return [];
  s.locationPoints=Array.isArray(s.locationPoints)?s.locationPoints:[];
  s.locationPoints.forEach(p=>{
    if(!p.id)p.id=uid();
    if(!p.plusCode&&Number.isFinite(Number(p.lat))&&Number.isFinite(Number(p.lng)))p.plusCode=encodePlusCode071(p.lat,p.lng);
  });
  return s.locationPoints;
}
function preferredLocation071(s){
  const points=locationPoints071(s);
  return points.find(p=>p.id===s.preferredLocationPointId)||null;
}
function navigationPlusCode071(s){ return preferredLocation071(s)?.plusCode||sitePlusCode071(s); }
function mapRouteUrl071(s){
  const destination=navigationPlusCode071(s)||(hasGps(s)?`${s.gps.lat},${s.gps.lng}`:fullAddress(s));
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`;
}
function updateGlobalToday071(){
  const el=document.getElementById('globalToday071'); if(!el)return;
  const now=new Date();
  el.innerHTML=`<span>${esc(now.toLocaleDateString(undefined,{weekday:'long'}))}</span><b>${esc(now.toLocaleDateString(undefined,{month:'long',day:'numeric'}))}</b>`;
}
function ensureAllPlusCodes071(){
  let changed=false;
  (data.sites||[]).forEach(s=>{
    const before=s.plusCode||""; const code=sitePlusCode071(s); locationPoints071(s);
    if(code!==before)changed=true;
  });
  if(changed) saveData(data);
}
function copyText071(text,label="Copied"){
  if(navigator.clipboard?.writeText) navigator.clipboard.writeText(String(text||"")).then(()=>toast(label),()=>toast("Clipboard unavailable."));
  else toast("Clipboard unavailable.");
}
function plusCodePointNote071(point){ return `[Location: ${point.label||point.type||'Saved Point'}] Plus Code: ${point.plusCode}${point.notes?` — ${point.notes}`:''}`; }
function addLocationPoint071(){
  const s=site(); if(!s)return;
  if(!navigator.geolocation){toast("GPS is not available in this browser.");return;}
  const type=prompt(`Location type:\n${LOCATION_POINT_TYPES_071.join(', ')}`,"Main Entrance"); if(type===null)return;
  const label=prompt("Location name",type||"Saved Location"); if(label===null)return;
  const notes=prompt("Optional location notes (parking instructions, door description, access details)","")||"";
  toast("Capturing precise location…");
  navigator.geolocation.getCurrentPosition(pos=>{
    const lat=Number(pos.coords.latitude.toFixed(7)),lng=Number(pos.coords.longitude.toFixed(7));
    const point={id:uid(),type:type||"Other",label:(label||type||"Saved Location").trim(),notes:notes.trim(),lat,lng,accuracy:Math.round(pos.coords.accuracy||0),plusCode:encodePlusCode071(lat,lng),createdAt:new Date().toISOString()};
    locationPoints071(s).push(point);
    s.notes=[String(s.notes||"").trim(),plusCodePointNote071(point)].filter(Boolean).join("\n");
    if(!s.preferredLocationPointId)s.preferredLocationPointId=point.id;
    save(); toast(`${point.label} saved.`); siteDetail();
  },err=>toast("GPS failed: "+(err.message||"permission denied")),{enableHighAccuracy:true,timeout:20000,maximumAge:0});
}
function setPreferredLocation071(id){ const s=site();if(!s)return;s.preferredLocationPointId=id||"";save();toast("Route destination updated.");siteDetail(); }
function deleteLocationPoint071(id){ const s=site();if(!s)return;const p=locationPoints071(s).find(x=>x.id===id);if(!p||!confirm(`Delete ${p.label||'this location'}?`))return;s.locationPoints=s.locationPoints.filter(x=>x.id!==id);if(s.preferredLocationPointId===id)s.preferredLocationPointId="";save();siteDetail(); }
function routeLocationPoint071(id){ const s=site();const p=locationPoints071(s).find(x=>x.id===id);if(p)window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(p.plusCode||`${p.lat},${p.lng}`)}`,'_blank'); }
function plusCodeSection071(s){
  const code=sitePlusCode071(s),points=locationPoints071(s),preferred=preferredLocation071(s);
  return `<details class="accountSection067 tone-cyan plusCodes071" open><summary><span>＋</span><div><strong>Plus Codes & Site Locations</strong><small>Exact entrances, parking, exterior doors, riser rooms, and field access points</small></div><b>⌄</b></summary><div class="accountSectionBody067">
    <div class="primaryPlus071"><div><span>Account Plus Code</span><strong>${esc(code||'GPS required')}</strong><small>${preferred?`Route currently targets ${esc(preferred.label)}`:'Route targets the account location'}</small></div><div>${code?`<button class="ghost" id="copyPrimaryPlus071">Copy</button>`:''}<button class="primary" id="addLocationPoint071">＋ Drop Pin</button></div></div>
    ${points.length?`<div class="locationPointList071">${points.map(p=>`<article class="locationPoint071 ${s.preferredLocationPointId===p.id?'preferred':''}"><div><span>${esc(p.type||'Saved Location')}</span><strong>${esc(p.label||'Saved Location')}</strong><b>${esc(p.plusCode||'')}</b>${p.notes?`<small>${esc(p.notes)}</small>`:''}</div><div><button class="ghost" data-copy-plus071="${esc(p.id)}">Copy</button><button class="ghost" data-route-plus071="${esc(p.id)}">Route</button><button class="${s.preferredLocationPointId===p.id?'primary':'ghost'}" data-prefer-plus071="${esc(p.id)}">${s.preferredLocationPointId===p.id?'Default':'Use'}</button><button class="danger" data-delete-plus071="${esc(p.id)}">×</button></div></article>`).join('')}</div>`:`<p class="accountEmpty067">Drop pins at the main entrance, preferred parking, exterior access door, riser room, FDC, or another exact field location.</p>`}
  </div></details>`;
}
function mapQuery(s){ return hasGps(s) ? `${Number(s.gps.lat).toFixed(6)},${Number(s.gps.lng).toFixed(6)}` : fullAddress(s); }
function mapUrl(s, provider){
  const plus=navigationPlusCode071(s);
  const q=encodeURIComponent(plus||mapQuery(s));
  return provider === "google" ? `https://www.google.com/maps/search/?api=1&query=${q}` : `https://maps.apple.com/?q=${encodeURIComponent(mapQuery(s))}`;
}
ensureAllPlusCodes071();
updateGlobalToday071();
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
  const parts=[s.name, fullAddress(s), s.panelManufacturer, s.panelModel, s.notes, s.externalAccountId, s.sitePhone, s.devicePhone, s.deviceType, s.siteId1, s.siteId2, s.siteLanguage, s.devicePhoneComment, s.sourceGroupNumber, ...accountTags0737(s).map(tag=>tag.name)];
  (s.contacts||[]).forEach(c=>parts.push(c.name,c.company,c.role,c.phone,c.email,c.type,c.accessNotes,c.notes));
  (s.equipment||[]).forEach(e=>parts.push(e.type,e.status,e.location,e.make,e.model,e.serial,e.notes));
  (s.docs||[]).forEach(d=>parts.push(d.type,d.title,d.ref,d.url,d.notes));
  (s.tasks||[]).forEach(t=>parts.push(t.title,t.status,t.notes,t.source));
  (s.deficiencies||[]).forEach(d=>parts.push(d.title,d.priority,d.status,d.notes));
  (s.checklist||[]).forEach(i=>parts.push(i.category,i.label,i.status,i.notes));
  return parts.filter(Boolean).join(" ").toLowerCase();
}
function detectNearbySites(){
  if(!featureOn("advancedGps")){ toast("Advanced GPS is hidden in Simple View."); return; }
  route("nearbySites");
  setTimeout(()=>runNearbyScan0652("nearbySites"),30);
}

function applyTheme(){
  const t = data.settings.theme || {};
  const body = document.body;
  body.className = "";
  if(isDemoMode()) body.classList.add("demoMode0738");
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

function activeJobStorageKey0738(){ return isDemoMode()?DEMO_ACTIVE_JOB_KEY_0738:ACTIVE_JOB_KEY; }
function loadActiveJob(){ try{ const raw=fvSafeGet0739(activeJobStorageKey0738(),""); return raw ? JSON.parse(raw) : null; } catch{ return null; } }
function saveActiveJob(){ const key=activeJobStorageKey0738(); activeJob ? fvSafeSet0739(key,JSON.stringify(activeJob)) : fvSafeRemove0739(key); }

function activeRouteStorageKey0738(){ return isDemoMode()?DEMO_ACTIVE_ROUTE_KEY_0738:ACTIVE_ROUTE_KEY; }
function loadActiveRoute(){ try{ const raw=fvSafeGet0739(activeRouteStorageKey0738(),""); return raw ? JSON.parse(raw) : null; } catch{ return null; } }
function saveActiveRoute(){ const key=activeRouteStorageKey0738(); activeRoute ? fvSafeSet0739(key,JSON.stringify(activeRoute)) : fvSafeRemove0739(key); }
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
  fvSafeSet0739("firevault_daily_summary_date",dailySummaryDate569);
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
function setActiveNav(){
  document.querySelectorAll("#appNav button").forEach(b=>{b.classList.remove("active");b.removeAttribute("aria-current");});
  const section=["routeLog","dailySummary","actionCenter","pinnedSites","dashboard068"].includes(view)?"home":(["siteDetail","visits","visitDetail","checklist","siteForm","contactsList","contactForm","siteDocs","siteDocForm","equipmentList","equipmentForm","tasks","taskForm","deficiencies","deficiencyForm","report","jobMode","serviceVisit","nearbySites","attention"].includes(view)?"sites":view);
  const active=document.getElementById("nav-"+section);
  if(active){active.classList.add("active");active.setAttribute("aria-current","page");}
}
function wireGlobalHeader537(){ updateGlobalToday071(); }
function showGlobalChrome537(){ const h=document.getElementById("appHeader"); const n=document.getElementById("appNav"); if(h){ h.style.display="flex"; h.style.visibility="visible"; h.style.opacity="1"; } if(n){ n.style.display="grid"; n.style.visibility="visible"; n.style.opacity="1"; } wireGlobalHeader537(); }

function contextualHelpInfo060(){
  if(view!=="settings") return CONTEXT_HELP_060[view]||null;
  if(settingsTab==="manual") return null;
  const tabMap={tech:["settings","Technician Profile"],gps:["route","GPS / Maps"],reports:["reports","Report Settings"],email:["reports","Email Settings"],overlay:["photos","Photo Overlay"],themes:["settings","Theme Settings"],homeLayout:["home","Home Layout"],visibility:["settings","Modules / Simple View"],advanced:["settings","Advanced Settings"],customerImport:["sites","Customer Import"],categories:["sites","Categories"],backup:["backup","Backup & Restore"],about:["release","About FireVault"]};
  const item=tabMap[settingsTab]||["settings","Settings"];
  return {chapter:item[0],label:item[1],suggestions:settingsTab==="email"?["Recipients","Subject tags","Signature preview"]:settingsTab==="backup"?["Export backup","Restore safely","Clean update"]:["What this controls","Recommended setup","Related features"]};
}
function openContextualHelp060(chapter,label){
  contextualHelpReturn060={view,mode,settingsTab,selectedSiteId,label:label||contextualHelpInfo060()?.label||"Previous screen"};
  settingsTab="manual"; manualView058="chapter"; manualChapter058=chapter||"start"; mode="settingsDetail"; view="settings"; render();
}
function returnFromContextualHelp060(){
  const back=contextualHelpReturn060; contextualHelpReturn060=null;
  if(!back){ openSettingsHome572(); return; }
  view=back.view; mode=back.mode; settingsTab=back.settingsTab; selectedSiteId=back.selectedSiteId; render();
}
function injectContextualHelp060(){
  /* Build 0.71.1: the floating blue Help circle is retired. Help remains available in Settings → Data, Sync & Support → FireVault Academy. */
  document.getElementById("contextHelp060")?.remove();
}
function render(){
  try{
    if(view!=="home") restoreAppChrome572();
    const routes = {home, tools:tools0734, dashboard068, dailySummary, routeLog, actionCenter, pinnedSites:pinnedSitesManager567, sites, nearbySites, attention:attentionQueue, siteDetail, visits, visitDetail, checklist, siteForm, contactsList, contactForm, siteDocs, siteDocForm, equipmentList, equipmentForm, tasks, taskForm, deficiencies, deficiencyForm, report, library, resourceForm, jobMode, serviceVisit, settings, diagnostics, dataTools};
    (routes[view] || home)();
    document.body.classList.toggle("homeFullscreen480", view === "home");
    document.body.classList.toggle("homeLayoutFixed570", view === "home");
    document.body.classList.toggle("settingsChrome572", view === "settings");
    if(view !== "settings") document.body.classList.remove("settingsChrome572");
    stopJobTimer();
    applyFeatureVisibility();
    setActiveNav();
    injectContextualHelp060();
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
  return [s.name,fullAddress(s),s.panelManufacturer,s.panelModel,s.notes,s.externalAccountId,s.sitePhone,s.devicePhone,s.deviceType,s.siteId1,s.siteId2,s.siteLanguage,s.devicePhoneComment,s.sourceGroupNumber,(s.contacts||[]).map(c=>[c.name,c.role,c.phone,c.email,c.accessNotes].join(' ')).join(' '),(s.equipment||[]).map(e=>[e.type,e.model,e.location,e.notes].join(' ')).join(' ')].join(' ').toLowerCase();
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
  const inv=gpsInventory0652();
  if(!inv.ready) return `${inv.total} saved • ${inv.missing} missing coordinates`;
  if(nearbyScanStatus0652.state==="scanning") return nearbyScanStatus0652.message;
  if(nearbyScanStatus0652.state==="error") return "Location check needs attention";
  if(nearbyState) return `${inv.ready} GPS-ready • checked ${new Date(nearbyState.at).toLocaleTimeString([], {hour:"numeric",minute:"2-digit"})}`;
  return `${inv.ready} GPS-ready account${inv.ready===1?'':'s'} • ${inv.missing} missing`;
}
function homeNearbyMarkup476(){
  if(!featureOn('advancedGps')) return '';
  const inv=gpsInventory0652();
  if(!inv.ready) return `<div class="homeNearbyEmpty476 nearbyHomeMessage0652"><p>${esc(inv.total?`${inv.total} sites are saved, but none have usable latitude and longitude yet.`:"No customer sites are saved yet.")}</p><button class="ghost smallBtn" id="nearbyOpenImportHome0652">Open Customer Import</button></div>`;
  if(nearbyScanStatus0652.state==="scanning") return `<div class="nearbyScanMessage0652 scanning"><strong>Locating phone…</strong><p>${esc(nearbyScanStatus0652.message)}</p></div>`;
  if(nearbyScanStatus0652.state==="error") return `<div class="nearbyScanMessage0652 error"><strong>Nearby scan stopped</strong><p>${esc(nearbyScanStatus0652.message)}</p><button class="ghost smallBtn" id="nearbyRetryHome0652">Try Again</button></div>`;
  if(!nearbyState) return `<div class="homeNearbyEmpty476"><p>Tap Check to compare your phone location with ${inv.ready} GPS-ready customer account${inv.ready===1?'':'s'}.</p></div>`;
  const rows=gpsSiteDistances(nearbyState.lat, nearbyState.lng).slice(0,4);
  return rows.length?rows.map(r=>`<button class="nearbyAccountCard476" data-home-site="${esc(r.s.id)}"><span>⌖</span><strong>${esc(r.s.name||'Unnamed Site')}</strong><small>${esc(distanceLabel(r.meters))} away • ${esc(fullAddress(r.s))}</small></button>`).join(''):`<div class="homeNearbyEmpty476"><p>No GPS-ready customer accounts could be compared.</p></div>`;
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
  runNearbyScan0652("home");
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


/* Build 0.56.0 Field Dashboard Quick Capture */
const QUICK_CAPTURE_TYPES_560 = {
  note:{label:"Site Note", short:"Note", icon:"✎", accent:"blue", help:"Save a timestamped note to the selected account and today’s Daily Report."},
  task:{label:"Follow-Up Task", short:"Task", icon:"✓", accent:"amber", help:"Create an open task for the selected account without leaving Home."},
  deficiency:{label:"Deficiency", short:"Deficiency", icon:"!", accent:"red", help:"Record an open deficiency and optionally create a matching follow-up task."}
};
function quickCaptureDefaultSite560(){
  const ids=[activeJob?.siteId,selectedSiteId,...todayAccounts500().map(r=>r.s.id),...recentAccounts476(8).map(s=>s.id)];
  return ids.map(id=>(data.sites||[]).find(s=>s.id===id)).find(Boolean) || data.sites?.[0] || null;
}
function quickCaptureSiteOptions560(activeId=""){
  const rows=[...(data.sites||[])].sort((a,b)=>{
    const ap=a.id===activeId?1:0, bp=b.id===activeId?1:0;
    if(ap!==bp) return bp-ap;
    return recentSiteTime476(b)-recentSiteTime476(a) || String(a.name||"").localeCompare(String(b.name||""));
  });
  return rows.map(s=>`<option value="${esc(s.id)}" ${s.id===activeId?"selected":""}>${esc(s.name||"Unnamed Account")}${fullAddress(s)?` — ${esc(fullAddress(s))}`:""}</option>`).join("");
}
function quickCaptureSiteContext560(siteId){
  const s=(data.sites||[]).find(x=>x.id===siteId);
  if(!s) return "Choose an account to continue.";
  const open=(s.tasks||[]).filter(t=>!taskIsDone(t)).length;
  const defs=(s.deficiencies||[]).filter(d=>(d.status||"Open")!=="Closed").length;
  return `${fullAddress(s)||"No address saved"} • ${open} open task${open===1?"":"s"} • ${defs} open deficienc${defs===1?"y":"ies"}`;
}
function openQuickCapture560(defaultType="note", initialSiteId=""){
  if(!(data.sites||[]).length){
    toast("Add an account before using Quick Capture.");
    selectedSiteId=null; mode=null; route("siteForm");
    return;
  }
  document.querySelector(".quickCaptureOverlay560")?.remove();
  const fallback=quickCaptureDefaultSite560();
  const siteId=(data.sites||[]).some(s=>s.id===initialSiteId)?initialSiteId:(fallback?.id||data.sites[0].id);
  let captureType=QUICK_CAPTURE_TYPES_560[defaultType]?defaultType:"note";
  const overlay=document.createElement("div");
  overlay.className="quickCaptureOverlay560";
  overlay.innerHTML=`<div class="quickCaptureSheet560 tone-${esc(QUICK_CAPTURE_TYPES_560[captureType].accent)}" role="dialog" aria-modal="true" aria-labelledby="quickCaptureTitle560">
    <div class="quickCaptureHead560"><div><span>FIELD WORKFLOW</span><h2 id="quickCaptureTitle560">Quick Capture</h2><p>Record field information without navigating away from Today.</p></div><button class="ghost iconBtn" id="closeQuickCapture560" aria-label="Close Quick Capture">×</button></div>
    <div class="quickCaptureTypeGrid560" role="tablist" aria-label="Capture type">${Object.entries(QUICK_CAPTURE_TYPES_560).map(([key,item])=>`<button type="button" class="quickCaptureType560 ${key===captureType?"active":""}" data-quick-capture-type="${key}" aria-selected="${key===captureType?"true":"false"}"><span>${esc(item.icon)}</span><strong>${esc(item.short)}</strong></button>`).join("")}</div>
    <div class="quickCaptureBody560">
      <label class="quickCaptureField560"><span>Account</span><select id="quickCaptureSite560">${quickCaptureSiteOptions560(siteId)}</select><small id="quickCaptureSiteContext560">${esc(quickCaptureSiteContext560(siteId))}</small></label>
      <div class="quickCaptureHelp560" id="quickCaptureHelp560">${esc(QUICK_CAPTURE_TYPES_560[captureType].help)}</div>
      <label class="quickCaptureField560" id="quickCaptureTitleWrap560" hidden><span id="quickCaptureTitleLabel560">Title</span><input id="quickCaptureEntryTitle560" autocomplete="off" placeholder="Short field description"></label>
      <label class="quickCaptureField560"><span id="quickCaptureDetailsLabel560">Site note</span><textarea id="quickCaptureDetails560" rows="5" placeholder="What happened on site?"></textarea></label>
      <div class="quickCaptureOptions560">
        <label class="quickCaptureField560" id="quickCaptureDueWrap560" hidden><span>Due date</span><input id="quickCaptureDue560" type="date"></label>
        <label class="quickCaptureField560" id="quickCapturePriorityWrap560" hidden><span>Priority</span><select id="quickCapturePriority560"><option>Normal</option><option>High</option><option>Critical</option></select></label>
      </div>
      <label class="quickCaptureFollow560" id="quickCaptureFollowWrap560" hidden><input id="quickCaptureFollow560" type="checkbox" checked><span><strong>Create matching follow-up task</strong><small>Keeps the deficiency visible in the task workflow.</small></span></label>
    </div>
    <div class="quickCaptureActions560"><button class="ghost" type="button" id="cancelQuickCapture560">Cancel</button><button class="primary" type="button" id="saveQuickCapture560">Save Site Note</button></div>
  </div>`;
  document.body.appendChild(overlay);
  const close=()=>overlay.remove();
  const setType=(type)=>{
    captureType=QUICK_CAPTURE_TYPES_560[type]?type:"note";
    const cfg=QUICK_CAPTURE_TYPES_560[captureType];
    const sheet=overlay.querySelector(".quickCaptureSheet560");
    sheet.className=`quickCaptureSheet560 tone-${cfg.accent}`;
    overlay.querySelectorAll("[data-quick-capture-type]").forEach(b=>{
      const on=b.dataset.quickCaptureType===captureType;
      b.classList.toggle("active",on); b.setAttribute("aria-selected",on?"true":"false");
    });
    document.getElementById("quickCaptureHelp560").textContent=cfg.help;
    document.getElementById("quickCaptureTitleWrap560").hidden=captureType==="note";
    document.getElementById("quickCaptureDueWrap560").hidden=captureType!=="task";
    document.getElementById("quickCapturePriorityWrap560").hidden=captureType!=="deficiency";
    document.getElementById("quickCaptureFollowWrap560").hidden=captureType!=="deficiency";
    document.getElementById("quickCaptureDetailsLabel560").textContent=captureType==="note"?"Site note":"Details / notes";
    const details=document.getElementById("quickCaptureDetails560");
    details.placeholder=captureType==="note"?"What happened on site?":captureType==="task"?"Parts, access, customer request, or next steps…":"Location, device, circuit, symptoms, and customer impact…";
    document.getElementById("quickCaptureTitleLabel560").textContent=captureType==="task"?"Task title":"Deficiency title";
    document.getElementById("quickCaptureEntryTitle560").placeholder=captureType==="task"?"Return with batteries, verify signal, order part…":"NAC open, ground fault, device failed…";
    document.getElementById("saveQuickCapture560").textContent=`Save ${cfg.label}`;
    requestAnimationFrame(()=>{ (captureType==="note"?details:document.getElementById("quickCaptureEntryTitle560"))?.focus({preventScroll:true}); });
  };
  overlay.querySelectorAll("[data-quick-capture-type]").forEach(b=>b.onclick=()=>setType(b.dataset.quickCaptureType));
  document.getElementById("quickCaptureSite560").onchange=e=>{ document.getElementById("quickCaptureSiteContext560").textContent=quickCaptureSiteContext560(e.target.value); };
  document.getElementById("closeQuickCapture560").onclick=close;
  document.getElementById("cancelQuickCapture560").onclick=close;
  overlay.addEventListener("click",e=>{ if(e.target===overlay) close(); });
  document.getElementById("saveQuickCapture560").onclick=()=>{
    const s=(data.sites||[]).find(x=>x.id===document.getElementById("quickCaptureSite560").value);
    if(!s){ toast("Choose an account."); return; }
    ensureSite(s);
    const title=(document.getElementById("quickCaptureEntryTitle560").value||"").trim();
    const details=(document.getElementById("quickCaptureDetails560").value||"").trim();
    const now=new Date().toISOString();
    if(captureType==="note"){
      if(!details){ toast("Enter a site note."); document.getElementById("quickCaptureDetails560").focus(); return; }
      appendSiteNote491(s,details);
      toast(`Note saved to ${s.name||"account"}.`);
    }else if(captureType==="task"){
      if(!title){ toast("Enter a task title."); document.getElementById("quickCaptureEntryTitle560").focus(); return; }
      s.tasks.unshift({id:uid(),title,status:"Open",due:document.getElementById("quickCaptureDue560").value||"",notes:details,source:"Quick Capture",createdAt:now});
      s.updatedAt=now; save();
      toast(`Task added to ${s.name||"account"}.`);
    }else{
      if(!title){ toast("Enter a deficiency title."); document.getElementById("quickCaptureEntryTitle560").focus(); return; }
      const priority=document.getElementById("quickCapturePriority560").value||"Normal";
      s.deficiencies.unshift({id:uid(),title,priority,status:"Open",notes:details,source:"Quick Capture",createdAt:now});
      if(document.getElementById("quickCaptureFollow560").checked){
        s.tasks.unshift({id:uid(),title:`Resolve: ${title}`,status:"Open",due:"",notes:details,source:"Quick Capture Deficiency",createdAt:now});
      }
      s.updatedAt=now; save();
      toast(`Deficiency added to ${s.name||"account"}.`);
    }
    selectedSiteId=s.id;
    close();
    if(view==="home") home(); else render();
  };
  setType(captureType);
}
function wireFieldDashboard560(){
  const note=document.getElementById("quickAccountNote500"); if(note) note.onclick=()=>openQuickCapture560("note");
  const notes=document.getElementById("dashNotes500"); if(notes) notes.onclick=()=>{ setDailySummaryDay569(localDateString()); route("dailySummary"); };
  const accounts=document.getElementById("dashAccounts500"); if(accounts) accounts.onclick=()=>{ setDailySummaryDay569(localDateString()); route("dailySummary"); };
  const routePoints=document.getElementById("dashRoute500"); if(routePoints) routePoints.onclick=()=>route("routeLog");
  const routeBtn=document.getElementById("openRoute500"); if(routeBtn) routeBtn.onclick=()=>route("routeLog");
  const copy=document.getElementById("copySummary500"); if(copy) copy.onclick=copyDailySummary499;
  const all=document.getElementById("allTodayAccounts500"); if(all) all.onclick=()=>route("sites");
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



function tools0734(){
  html(`<div class="screen toolsScreen0734">
    <div class="toolsHero0734">
      <div><span>FIELD UTILITIES</span><h1>Tools</h1><p>FireVault utilities for route records, reference material, backups, and diagnostics.</p></div>
      <button class="homeBuildPill481 toolsBuild0734" id="toolsRelease0734" aria-label="Release notes">${BUILD}</button>
    </div>

    <div class="toolsSectionTitle0734"><strong>FireVault Utilities</strong><span>Quick access</span></div>
    <div class="toolsGrid0734 toolsGridClean0735">
      <button class="card toolTile0734" id="toolsRoute0734">${fvIcon073("nearby","toolIcon0734")}<span><strong>Daily Route</strong><small>Waypoints, stops, and travel history</small></span></button>
      <button class="card toolTile0734" id="toolsData0734">${fvIcon073("settings","toolIcon0734")}<span><strong>Backup &amp; Data</strong><small>Snapshots, restore, imports, and updates</small></span></button>
      ${featureOn("library")?`<button class="card toolTile0734" id="toolsLibrary0734">${fvIcon073("library","toolIcon0734")}<span><strong>Library</strong><small>Manuals, documents, and reference files</small></span></button>`:""}
      ${featureOn("diagnostics")?`<button class="card toolTile0734" id="toolsDiagnostics0734">${fvIcon073("tools","toolIcon0734")}<span><strong>Diagnostics</strong><small>Startup, storage, and vault health</small></span></button>`:""}
    </div>
    <section class="card toolsSafety0735"><span>DATA SAFETY</span><strong>Automatic snapshots are active</strong><p>Download an external backup before deleting or reinstalling the Home Screen app.</p><button class="ghost" id="toolsBackup0735">Open Backup Controls</button></section>
    <div class="buildRevisionSpacer475" aria-hidden="true"></div>
  </div>`);
  document.getElementById("toolsRoute0734")?.addEventListener("click",()=>route("routeLog"));
  document.getElementById("toolsData0734")?.addEventListener("click",()=>route("dataTools"));
  document.getElementById("toolsLibrary0734")?.addEventListener("click",()=>route("library"));
  document.getElementById("toolsDiagnostics0734")?.addEventListener("click",()=>route("diagnostics"));
  document.getElementById("toolsBackup0735")?.addEventListener("click",()=>{settingsTab="backup";mode="settingsDetail";view="settings";render();});
  document.getElementById("toolsRelease0734")?.addEventListener("click",showChangelog);
}

function dashboard068(){
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

    ${!siteSearch && homeCardVisible550("pinnedSites")?pinnedSitesMarkup566():""}
    ${!siteSearch && homeCardVisible550("fieldFocus")?fieldFocusMarkup561():""}

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

    <div class="homeUtilityGrid5100 ${homeCardVisible550("nearbyAccounts")?"":"homeUtilityNoGps5100"}">
      ${homeCardVisible550("nearbyAccounts")?`<div class="card nearbyAccountsHero476 nearbyAccountsHero478 homeCollapsible5100 ${homeCardCollapsed5100("nearbyAccounts")?"homeCollapsed5100":""}" data-home-collapsible="nearbyAccounts">
        <div class="nearbyHead476 nearbyHead478"><div><h2>Nearby Accounts</h2><p>${homeNearbyTitle486()}</p></div><div class="homeHeaderActions5100"><button class="smallBtn nearbyCount478" id="checkNearbyHomeBtn476">${nearbyState?"Refresh":"Check"}</button>${homeCollapseButton5100("nearbyAccounts","Nearby Accounts")}</div></div>
        <div class="nearbyList476 nearbyList478 homeCollapseBody5100" data-home-collapse-body ${homeCardCollapsed5100("nearbyAccounts")?"hidden":""}>${homeNearbyMarkup476()}</div>
      </div>`:""}

      <div class="grid2 appleStats478">
        <button class="card tile statTile478" id="visitsCard478"><strong>${recentVisits}</strong><span>Recent Visits</span><em>This Week</em></button>
        <button class="card tile statTile478" id="tasksCard"><strong>${openTasks}</strong><span>Open Tasks</span><em>${taskCounts.overdue ? `${taskCounts.overdue} overdue` : taskCounts.today ? `${taskCounts.today} due soon` : "Due Soon"}</em></button>
      </div>
    </div>

    ${activeRoute ? `<div class="card activeRouteMini468 activeRouteMini476 activeRouteMini478 ${activeRoute.paused?"activeRoutePaused470":""}"><div class="activeRouteHead468"><div><h2><span class="${activeRoute.paused?"routeLed470 routeLedPaused470":"routeLed463"} miniLed468"></span>${activeRoute.paused?"Daily Route Paused":"Daily Route Recording"}</h2><p>${esc(routeSummaryLine(activeRoute))}</p></div><button class="primary smallBtn" id="openRouteMiniBtn">Open</button></div><div class="activeRouteStats468"><div><strong>${(activeRoute.events||[]).length}</strong><span>Waypoints</span></div><div><strong>${routeDuration(activeRoute.startedAt)}</strong><span>Time</span></div><div><strong>${esc(routeDistanceLabel(activeRoute))}</strong><span>Distance</span></div></div><div class="activeRouteActions468"><button class="ghost smallBtn" id="homeRoutePointBtn" ${activeRoute.paused?"disabled":""}>Waypoint</button><button class="ghost smallBtn" id="homeRouteNearestBtn" ${activeRoute.paused?"disabled":""}>Nearest</button><button class="${activeRoute.paused?"primary":"ghost"} smallBtn" id="homeRoutePauseBtn">${activeRoute.paused?"Resume":"Pause"}</button><button class="danger smallBtn" id="homeRouteEndBtn">End / Save</button></div></div>` : ""}
    ${activeJob ? `<div class="card activeJobMini activeJobMini478"><div class="row"><div><h2>Service Call Active</h2><p>${esc(activeJob.siteName)} • <span id="jobElapsed">${elapsedText(activeJob.startedAt)}</span></p></div><button class="primary" id="resumeJobBtn">Open</button></div></div>` : ""}

    ${homeCardVisible550("recentAccounts")?`<div class="recentAccountsPanel478 homeCollapsible5100 ${homeCardCollapsed5100("recentAccounts")?"homeCollapsed5100":""}" data-home-collapsible="recentAccounts">
      <div class="recentHead478"><div><strong>Recent Accounts</strong><span>${recentAccounts476(5).length} account${recentAccounts476(5).length===1?"":"s"}</span></div><div class="homeHeaderActions5100"><button class="ghost smallBtn" id="allAccountsBtn478">See All</button>${homeCollapseButton5100("recentAccounts","Recent Accounts")}</div></div>
      <div class="recentList478 recentList486 homeCollapseBody5100" data-home-collapse-body ${homeCardCollapsed5100("recentAccounts")?"hidden":""}>${homeRecentRowsOnly486()}</div>
    </div>`:""}

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
  const nearbyRetryHome0652=document.getElementById("nearbyRetryHome0652"); if(nearbyRetryHome0652) nearbyRetryHome0652.onclick=checkNearbyHome476;
  const nearbyOpenImportHome0652=document.getElementById("nearbyOpenImportHome0652"); if(nearbyOpenImportHome0652) nearbyOpenImportHome0652.onclick=()=>{settingsTab="customerImport";mode="settingsDetail";route("settings");};
  document.getElementById('modulesTopBtn476').onclick=()=>{mode=null; route('settings');};
  const bell=document.getElementById('homeBell478'); if(bell) bell.onclick=showChangelog;
  const installHow=document.getElementById('homeInstallHow482'); if(installHow) installHow.onclick=()=>alert('To get the clean full-screen FireVault view on iPhone: tap Share, choose Add to Home Screen, then open FireVault from the new Home Screen icon.');
  const installHide=document.getElementById('homeInstallHide482'); if(installHide) installHide.onclick=()=>{homeInstallTipHidden=true; fvSafeSet0739('firevault_home_install_tip_hidden','1'); home();};
  const todayDateBtn569=document.getElementById('todayDatePickerBtn569'); if(todayDateBtn569) todayDateBtn569.onclick=openHomeDailyDatePicker569;
  wireFieldDashboard560();
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
  const rb=document.getElementById('resumeJobBtn'); if(rb) rb.onclick=()=>{selectedSiteId=activeJob.siteId; route('serviceVisit');};
}



const HOME_NEARBY_VIEW_KEY_069="firevault_home_nearby_view_069";
const NEARBY_LIST_MAX_MILES_069=25;
const NEARBY_CATEGORY_META_070={
  all:{label:"All",color:"#e5e7eb"},
  basic:{label:"Basic",color:"#94a3b8"},
  clss:{label:"CLSS",color:"#38bdf8"},
  alarmnet:{label:"AlarmNet",color:"#f59e0b"},
  ipdact:{label:"IPDACT",color:"#a78bfa"}
};
let homeNearbyView069=fvSafeGet0739(HOME_NEARBY_VIEW_KEY_069,"map")||"map";
let nearbyCategoryFilter070="all";
let homeNearbySelected069="";
let nearbyScrollLock069=false;
let nearbySnapTimer069=null;
let nearbyTouching069=false;
let nearbyStaticVisibleMiles069=null;
let nearbyStaticCurrentBounds069=null;
let nearbyMapPopupSite069="";
let nearbyScrollActivated069=false;
let nearbyStaticCenter069=null;
let nearbyAdaptiveRadiusMiles069=null;
let nearbyStreetFocusSite069="";
let nearbyTouchStartScroll069=0;
let nearbyTouchMoved069=false;

function accountId069(s){ return String(s?.externalAccountId||s?.accountId||"").trim(); }
function accountCategory070(s){
  const id=accountId069(s).toUpperCase();
  if(id.startsWith("G7C")) return "clss";
  if(id.startsWith("AN")) return "alarmnet";
  if(id.startsWith("VA1")) return "ipdact";
  return "basic";
}

/* Build 0.73.7 — rule-driven account categories that behave as multi-value tags. */
const ACCOUNT_CATEGORY_FIELDS_0737 = [
  ["accountId","Account ID"],["name","Account name"],["address","Full address"],["city","City"],["state","State"],["zip","ZIP code"],["deviceType","Device type"],["sourceGroup","Source group"],["panel","Panel"],["phone","Phone"]
];
const ACCOUNT_CATEGORY_OPERATORS_0737 = [
  ["startsWith","starts with"],["contains","contains"],["equals","equals"],["endsWith","ends with"],["notContains","does not contain"],["present","is present"],["empty","is empty"]
];
function safeCategoryColor0737(value){ return /^#[0-9a-f]{6}$/i.test(String(value||""))?String(value):"#22c55e"; }
function accountCategoryConfig0737(){
  const cfg=data?.settings?.accountCategories;
  return cfg&&Array.isArray(cfg.definitions)?cfg.definitions:[];
}
function accountCategoryFieldValue0737(s,field){
  const panel=[s?.panelManufacturer,s?.panelModel].filter(Boolean).join(" ");
  const values={
    accountId:accountId069(s), name:s?.name, address:fullAddress(s), city:s?.city, state:s?.state, zip:s?.zip,
    deviceType:s?.deviceType, sourceGroup:s?.sourceGroupNumber, panel, phone:s?.sitePhone||s?.devicePhone||primaryContact477(s)?.phone
  };
  let value=String(values[field]??"").trim();
  if(field==="accountId") value=canonicalAccountId0731(value);
  return value.toLowerCase();
}
function accountCategoryRuleMatches0737(s,rule={}){
  const actual=accountCategoryFieldValue0737(s,rule.field||"accountId");
  let expected=String(rule.value??"").trim();
  if((rule.field||"accountId")==="accountId") expected=canonicalAccountId0731(expected);
  expected=expected.toLowerCase();
  switch(rule.operator){
    case "startsWith": return !!expected&&actual.startsWith(expected);
    case "equals": return !!expected&&actual===expected;
    case "endsWith": return !!expected&&actual.endsWith(expected);
    case "notContains": return !!expected&&!actual.includes(expected);
    case "present": return actual.length>0;
    case "empty": return actual.length===0;
    default: return !!expected&&actual.includes(expected);
  }
}
function accountCategoryMatches0737(s,category={}){
  if(category.enabled===false) return false;
  const rules=Array.isArray(category.rules)?category.rules:[];
  if(!rules.length) return false;
  return category.match==="any"?rules.some(rule=>accountCategoryRuleMatches0737(s,rule)):rules.every(rule=>accountCategoryRuleMatches0737(s,rule));
}
function accountTags0737(s){ return accountCategoryConfig0737().filter(category=>accountCategoryMatches0737(s,category)); }
function accountTagChips0737(s,limit=4){
  const tags=accountTags0737(s);
  if(!tags.length) return "";
  const shown=tags.slice(0,limit);
  return `<div class="accountTags0737">${shown.map(tag=>`<span style="--tag-color:${safeCategoryColor0737(tag.color)}">${esc(tag.name)}</span>`).join("")}${tags.length>limit?`<span class="accountTagMore0737">+${tags.length-limit}</span>`:""}</div>`;
}
function phone069(s){ const c=primaryContact477(s); return String(s?.sitePhone||c?.phone||"").trim(); }
function todayHeader070(){
  const now=new Date();
  const day=now.toLocaleDateString(undefined,{weekday:"long"});
  const date=now.toLocaleDateString(undefined,{month:"long",day:"numeric"});
  return `<div class="nearbyToday070"><span>${esc(day)}</span><b>${esc(date)}</b></div>`;
}
function cssEscape069(value){
  const raw=String(value??"");
  if(window.CSS&&typeof CSS.escape==="function") return CSS.escape(raw);
  return raw.replace(/[^a-zA-Z0-9_-]/g,ch=>`\\${ch}`);
}
function nearbyAllRows069(){
  const rows=nearbyState?gpsSiteDistances(nearbyState.lat,nearbyState.lng):[];
  const maxMeters=NEARBY_LIST_MAX_MILES_069*1609.344;
  return rows.filter(r=>Number.isFinite(Number(r.meters))&&Number(r.meters)<=maxMeters);
}
function nearbyRows069(){
  const rows=nearbyAllRows069();
  return nearbyCategoryFilter070==="all"?rows:rows.filter(r=>accountCategory070(r.s)===nearbyCategoryFilter070);
}
function nearbyCategoryCounts070(rows=nearbyAllRows069()){
  const counts={all:rows.length,basic:0,clss:0,alarmnet:0,ipdact:0};
  rows.forEach(r=>{const key=accountCategory070(r.s);counts[key]=(counts[key]||0)+1;});
  return counts;
}
function nearbySummary069(){
  const inv=gpsInventory0652(), allRows=nearbyAllRows069(), rows=nearbyRows069();
  return {inv,allRows,rows,nearby:rows.length};
}
function nearbyAccountCard069(r,index){
  const s=r.s,id=accountId069(s),category=accountCategory070(s);
  const categoryLabel=NEARBY_CATEGORY_META_070[category]?.label||'Basic';
  return `<article class="nearbyAccount069 category-${category} ${homeNearbySelected069===s.id?'selected':''}" data-nearby-card069="${esc(s.id)}" data-nearby-index069="${index}" data-nearby-category070="${category}">
    <span class="nearbyNumber069">${index+1}</span>
    <div class="nearbyInfo069">
      <strong>${esc(s.name||'Unnamed Account')}</strong>
      <div class="nearbyAddress0712"><span>${esc(fullAddress(s)||'No address saved')}</span></div>
      <small class="nearbyMeta0712">${id?`<b>${esc(id)}</b>`:''}<em class="nearbyCategoryBadge0712 category-${category}">${esc(categoryLabel)}</em></small>
    </div>
    <span class="nearbyDistance069">${esc(distanceLabel(r.meters))}<i class="gpsDot069"></i></span>
  </article>`;
}
function homeNearbyMapShell069(){
  return `<div class="nearbyMapShell069 staticMapShell069">
    <iframe id="nearbyStaticBase069" class="nearbyStaticBase069" title="Nearby accounts map" loading="eager" tabindex="-1" aria-hidden="true"></iframe>
    <div id="nearbyStaticOverlay069" class="nearbyStaticOverlay069"></div>
    <div id="nearbyStaticPopup069" class="nearbyStaticPopup069" hidden></div>
    <div id="nearbyMapCount069" class="nearbyMapCount069" hidden></div>
    <div class="nearbyMapControlMask0717" aria-hidden="true"></div>
    <div id="nearbySelectedOverlay0712" class="nearbySelectedOverlay0712" hidden></div>
    <div id="nearbyMapActions0711" class="nearbyMapActions0711" hidden>
      <button id="nearbyMapRoute0711" aria-label="Route to selected account">${fvIcon073("route","fvMapActionIcon073")}<b>Route</b></button>
      <button id="nearbyMapCall0711" aria-label="Call selected account">${fvIcon073("call","fvMapActionIcon073")}<b>Call</b></button>
    </div>
  </div>`;
}
function setHomeChrome069(hidden){
  const h=document.getElementById('appHeader'),n=document.getElementById('appNav');
  if(h) h.style.display=hidden?'none':'flex';
  if(n) n.style.display=hidden?'none':'grid';
}
function home(){
  setHomeChrome069(true);
  const {inv,allRows,rows,nearby}=nearbySummary069(), status=nearbyScanStatus0652.state;
  if(rows.length&&!rows.some(r=>r.s.id===homeNearbySelected069)) homeNearbySelected069=rows[0].s.id;
  if(!rows.length) homeNearbySelected069="";
  const selectedRow069=rows.find(r=>r.s.id===homeNearbySelected069)||rows[0]||null;
  if(selectedRow069&&!Number.isFinite(nearbyAdaptiveRadiusMiles069)) nearbyAdaptiveRadiusMiles069=adaptiveRadiusForRow069(selectedRow069);
  const gpsText=nearbyState?`Updated ${new Date(nearbyState.at).toLocaleTimeString([], {hour:'numeric',minute:'2-digit'})}`:'GPS not refreshed';
  const categoryCounts070=nearbyCategoryCounts070(allRows);
  const categoryOptions070=Object.entries(NEARBY_CATEGORY_META_070).map(([key,item])=>`<option value="${key}" ${nearbyCategoryFilter070===key?'selected':''}>${esc(item.label)} (${categoryCounts070[key]||0})</option>`).join('');
  html(`<div class="screen nearbyHome069">
    <section class="nearbyTop069"><div class="nearbyLogo069"><img src="assets/favicon.png?v=${BUILD}" alt=""><strong>${fireVaultBrand575()}</strong></div>${todayHeader070()}</section>
    <section class="nearbyCompactHead069">
      <div class="nearbyCompactTitle069"><h1>Nearby Accounts</h1><span><i></i>${esc(gpsText)}</span></div>
      <div class="nearbyCompactActions069"><button class="nearbyViewToggle069" id="nearbyViewToggle069" aria-label="Switch between map and list">${fvIcon073(homeNearbyView069==='map'?'map':'list','fvToggleIcon073')}<b>${homeNearbyView069==='map'?'MAP':'LIST'}</b></button><label class="nearbyCategoryFilter070 category-${nearbyCategoryFilter070}" aria-label="Filter nearby accounts by communicator category" title="Filter: ${esc(NEARBY_CATEGORY_META_070[nearbyCategoryFilter070]?.label||'All')}"><span class="nearbyFilterGlyph0714" aria-hidden="true"></span><select id="nearbyCategoryFilter070" aria-label="Nearby account category filter">${categoryOptions070}</select></label></div>
    </section>
    ${status==='error'?`<div class="nearbyNotice069"><strong>Location problem:</strong> ${esc(nearbyScanStatus0652.message)}</div>`:''}
    <section class="nearbyWorkspace069 ${homeNearbyView069}">
      ${homeNearbyView069==='map'?homeNearbyMapShell069():''}
      <div class="nearbyListHead069"><strong>${rows.length} ${nearbyCategoryFilter070==='all'?'account':NEARBY_CATEGORY_META_070[nearbyCategoryFilter070].label+' account'}${rows.length===1?'':'s'} within ${NEARBY_LIST_MAX_MILES_069} miles</strong><span>Sorted by distance</span></div>
      <div class="nearbyCards069" id="nearbyCards069">${rows.length?rows.map(nearbyAccountCard069).join(''):`<div class="nearbyEmpty069">${nearbyState?'No nearby accounts found.':'Refreshing GPS…'}</div>`}</div>
    </section>
    <nav class="nearbyBottomNav069"><button class="active" id="homeNearbyNav069" aria-label="Refresh nearby accounts using current GPS">${fvIcon073("nearby","fvNavIcon073")}<span>Nearby</span></button><button id="homeAccounts069">${fvIcon073("accounts","fvNavIcon073")}<span>Accounts</span></button><button id="homeToolsNav069">${fvIcon073("tools","fvNavIcon073")}<span>Tools</span></button><button id="homeSettingsNav069">${fvIcon073("settings","fvNavIcon073")}<span>Settings</span></button></nav>
  </div>`);
  document.getElementById('homeAccounts069').onclick=()=>route('sites');
  document.getElementById('homeToolsNav069').onclick=()=>route('tools');
  document.getElementById('homeSettingsNav069').onclick=()=>route('settings');
  const refreshNearbyHome0714=()=>{resetNearbyMapOverview069(false);runNearbyScan0652('home');};
  document.getElementById('homeNearbyNav069').onclick=refreshNearbyHome0714;
  document.getElementById('nearbyViewToggle069').onclick=()=>{homeNearbyView069=homeNearbyView069==='map'?'list':'map';fvSafeSet0739(HOME_NEARBY_VIEW_KEY_069,homeNearbyView069);home();};
  document.getElementById('nearbyCategoryFilter070').onchange=e=>{
    nearbyCategoryFilter070=e.target.value in NEARBY_CATEGORY_META_070?e.target.value:"all";
    homeNearbySelected069="";
    nearbyMapPopupSite069="";
    nearbyStaticVisibleMiles069=null;
    nearbyAdaptiveRadiusMiles069=null;
    nearbyStreetFocusSite069="";
    nearbyStaticCenter069=null;
    home();
  };
  document.querySelectorAll('[data-nearby-call069]').forEach(b=>b.onclick=e=>{e.stopPropagation();const s=(data.sites||[]).find(x=>x.id===b.dataset.nearbyCall069);const ph=phone069(s);if(ph) location.href=`tel:${ph.replace(/[^+\\d]/g,'')}`;});
  const mapRoute0711=document.getElementById('nearbyMapRoute0711');
  if(mapRoute0711) mapRoute0711.onclick=e=>{e.stopPropagation();const row=mapRow069(homeNearbySelected069);if(row)window.open(mapRouteUrl071(row.s),'_blank');};
  const mapCall0711=document.getElementById('nearbyMapCall0711');
  if(mapCall0711) mapCall0711.onclick=e=>{e.stopPropagation();const row=mapRow069(homeNearbySelected069),ph=phone069(row?.s);if(ph)location.href=`tel:${ph.replace(/[^+\d]/g,'')}`;};
  document.querySelectorAll('[data-nearby-card069]').forEach(c=>c.onclick=e=>{
    if(e.target.closest('button'))return;
    nearbyScrollActivated069=false;
    clearTimeout(nearbySnapTimer069);
    selectNearby069(c.dataset.nearbyCard069,true,false,true);
  });
  const list=document.getElementById('nearbyCards069');
  if(list){
    nearbyScrollActivated069=false;
    list.scrollTop=0;
    list.addEventListener('touchstart',()=>{
      nearbyTouching069=true;
      nearbyTouchStartScroll069=list.scrollTop;
      nearbyTouchMoved069=false;
      clearTimeout(nearbySnapTimer069);
      nearbyMapPopupSite069="";
      updateNearbyMapSelection069();
    },{passive:true});
    list.addEventListener('touchend',()=>{
      nearbyTouching069=false;
      if(nearbyTouchMoved069){nearbyScrollActivated069=true;scheduleNearbySnap069(list,260);}
    },{passive:true});
    list.addEventListener('wheel',()=>{
      nearbyScrollActivated069=true;
      nearbyTouchMoved069=true;
      clearTimeout(nearbySnapTimer069);
      if(nearbyStreetFocusSite069) resetNearbyMapOverview069(true);
    },{passive:true});
    list.addEventListener('scroll',()=>{
      if(nearbyTouching069&&Math.abs(list.scrollTop-nearbyTouchStartScroll069)>4){
        if(!nearbyTouchMoved069&&nearbyStreetFocusSite069) resetNearbyMapOverview069(true);
        nearbyTouchMoved069=true;
        nearbyScrollActivated069=true;
      }
      syncNearbyScroll069(list);
    },{passive:true});
    requestAnimationFrame(()=>{prepareNearbyScrollTail069(list);list.scrollTop=0;});
    window.addEventListener('resize',()=>prepareNearbyScrollTail069(list),{once:true});
  }
  if(rows[0]&&!homeNearbySelected069) homeNearbySelected069=rows[0].s.id;
  if(homeNearbyView069==='map') setTimeout(()=>initNearbyMap069(),60);
}
function mapRow069(siteId){ return nearbyRows069().find(r=>r.s.id===siteId)||null; }
function nearbyGps069(site){
  if(!site||!hasGps(site)) return null;
  const lat=Number(site.gps?.lat),lng=Number(site.gps?.lng);
  return Number.isFinite(lat)&&Number.isFinite(lng)?{lat,lng}:null;
}
function streetVisibleMiles069(){ return .14; }
function distanceMiles069(row){
  const miles=Number(row?.meters||0)/1609.344;
  return Number.isFinite(miles)?Math.max(0,miles):0;
}
function adaptiveRadiusForRow069(row){
  const miles=distanceMiles069(row);
  return Math.max(.25,Math.min(NEARBY_LIST_MAX_MILES_069,miles?miles*1.08:.25));
}
function adaptiveVisibleMiles069(row){
  return Math.max(.32,Math.min(NEARBY_LIST_MAX_MILES_069*1.1,adaptiveRadiusForRow069(row)*1.1));
}
function resetNearbyMapOverview069(redraw=true){
  const rows=nearbyRows069();
  const row=rows.find(r=>r.s.id===homeNearbySelected069)||rows[0]||null;
  nearbyStreetFocusSite069="";
  nearbyStaticCenter069=null;
  nearbyMapPopupSite069="";
  nearbyAdaptiveRadiusMiles069=row?adaptiveRadiusForRow069(row):Math.max(.25,Math.min(NEARBY_LIST_MAX_MILES_069,Number(nearbyRadiusMiles())||1));
  nearbyStaticVisibleMiles069=row?adaptiveVisibleMiles069(row):Math.max(.55,nearbyAdaptiveRadiusMiles069*1.1);
  if(redraw&&homeNearbyView069==="map"&&document.getElementById('nearbyStaticOverlay069')) drawStaticNearbyMap069();
}
function focusNearbyAccountMap069(row,showPopup=false){
  const g=nearbyGps069(row?.s);
  if(!g)return false;
  nearbyAdaptiveRadiusMiles069=adaptiveRadiusForRow069(row);
  nearbyStreetFocusSite069=row.s.id;
  nearbyStaticCenter069={lat:g.lat,lng:g.lng};
  nearbyStaticVisibleMiles069=streetVisibleMiles069();
  nearbyMapPopupSite069=showPopup?row.s.id:"";
  if(homeNearbyView069==="map"&&document.getElementById('nearbyStaticOverlay069')) drawStaticNearbyMap069();
  else updateNearbyMapSelection069();
  return true;
}
function initialVisibleMiles069(rows){
  if(!rows.length) return .75;
  const selected=rows.find(r=>r.s.id===homeNearbySelected069)||rows[0];
  nearbyAdaptiveRadiusMiles069=adaptiveRadiusForRow069(selected);
  return adaptiveVisibleMiles069(selected);
}
function maxVisibleMiles069(rows){
  const farthest=Math.min(NEARBY_LIST_MAX_MILES_069,rows.length?distanceMiles069(rows[rows.length-1]):0);
  return Math.max(1,Math.min(NEARBY_LIST_MAX_MILES_069*1.1,farthest*1.12));
}
function ensureSelectedVisible069(row){
  if(!row||homeNearbyView069!=="map") return false;
  const nextRadius=adaptiveRadiusForRow069(row);
  const nextVisible=adaptiveVisibleMiles069(row);
  const changed=nearbyStreetFocusSite069!==""||nearbyStaticCenter069!==null||!Number.isFinite(nearbyStaticVisibleMiles069)||Math.abs(nearbyStaticVisibleMiles069-nextVisible)>.015||Math.abs((nearbyAdaptiveRadiusMiles069||0)-nextRadius)>.015;
  nearbyStreetFocusSite069="";
  nearbyStaticCenter069=null;
  nearbyAdaptiveRadiusMiles069=nextRadius;
  nearbyStaticVisibleMiles069=nextVisible;
  return changed;
}
function updateNearbyMapSelection069(){
  const siteId=homeNearbySelected069;
  const row=mapRow069(siteId);
  const streetFocused=Boolean(row&&nearbyStreetFocusSite069===siteId);
  const actions=document.getElementById('nearbyMapActions0711');
  if(actions){
    const ph=phone069(row?.s);
    actions.hidden=!streetFocused;
    const call=document.getElementById('nearbyMapCall0711');
    if(call)call.disabled=!ph;
  }
  const selectedOverlay0712=document.getElementById('nearbySelectedOverlay0712');
  if(selectedOverlay0712){
    selectedOverlay0712.hidden=!streetFocused;
    if(streetFocused){
      selectedOverlay0712.innerHTML=`<strong>${esc(row.s.name||'Unnamed Account')}</strong><span>${esc(fullAddress(row.s)||'No address saved')}</span>`;
    }else{
      selectedOverlay0712.innerHTML='';
    }
  }
  document.querySelectorAll('[data-static-marker069]').forEach(m=>m.classList.toggle('selected',markerContainsSite0735(m,siteId)));
  const popup=document.getElementById('nearbyStaticPopup069');
  if(!popup)return;
  if(!nearbyMapPopupSite069||nearbyMapPopupSite069!==siteId){popup.hidden=true;return;}
  const popupRow=mapRow069(siteId);
  if(!popupRow){popup.hidden=true;return;}
  const marker=[...document.querySelectorAll('[data-static-marker069]')].find(m=>markerContainsSite0735(m,siteId));
  if(!marker){popup.hidden=true;return;}
  const group=popupGroupForSite0735(siteId);
  const id=accountId069(popupRow.s);
  if(group&&group.rows.length>1){
    const ids=group.rows.map(r=>accountId069(r.s)||r.s.name||"Account").slice(0,5);
    popup.innerHTML=`<strong>${group.rows.length} accounts at this address</strong><b>${esc(ids.join(" • "))}${group.rows.length>5?` • +${group.rows.length-5} more`:""}</b><span>${esc(distanceLabel(popupRow.meters))}</span><small>${esc(fullAddress(popupRow.s))}</small>`;
  }else{
    popup.innerHTML=`<strong>${esc(popupRow.s.name||'Unnamed Account')}</strong>${id?`<b>${esc(id)}</b>`:''}<span>${esc(distanceLabel(popupRow.meters))}</span><small>${esc(fullAddress(popupRow.s))}</small>`;
  }
  const shell=marker.closest('.nearbyMapShell069');
  const mr=marker.getBoundingClientRect(),sr=shell.getBoundingClientRect();
  popup.style.left=Math.max(8,Math.min(sr.width-218,mr.left-sr.left-86))+'px';
  popup.style.top=Math.max(8,mr.top-sr.top-104)+'px';
  popup.hidden=false;
}
function selectNearby069(siteId,fromList=false,showPopup=false,streetFocus=false){
  homeNearbySelected069=siteId;
  if(fromList||!showPopup) nearbyMapPopupSite069="";
  else nearbyMapPopupSite069=siteId;
  document.querySelectorAll('[data-nearby-card069]').forEach(c=>c.classList.toggle('selected',c.dataset.nearbyCard069===siteId));
  const row=mapRow069(siteId);
  if(row&&streetFocus&&focusNearbyAccountMap069(row,showPopup)) return;
  if(row&&ensureSelectedVisible069(row)){drawStaticNearbyMap069();return;}
  updateNearbyMapSelection069();
}
function scheduleNearbySnap069(list,delay=180){
  clearTimeout(nearbySnapTimer069);
  nearbySnapTimer069=setTimeout(()=>{if(!nearbyTouching069)settleNearbyList069(list);},delay);
}
function nearbyCardTop069(list,card){
  if(!list||!card)return 0;
  const lr=list.getBoundingClientRect(),cr=card.getBoundingClientRect();
  return Math.max(0,list.scrollTop+(cr.top-lr.top));
}
function closestNearbyCard069(list){
  const cards=[...list.querySelectorAll('[data-nearby-card069]')];
  if(!cards.length)return null;
  const lr=list.getBoundingClientRect();
  let best=cards[0],dist=Infinity;
  for(const c of cards){
    const cr=c.getBoundingClientRect();
    const d=Math.abs(cr.top-lr.top);
    if(d<dist){dist=d;best=c;}
  }
  return best;
}
function syncNearbyScroll069(list){
  if(nearbyScrollLock069||!nearbyScrollActivated069) return;
  nearbyMapPopupSite069="";
  const best=closestNearbyCard069(list);
  if(best&&best.dataset.nearbyCard069!==homeNearbySelected069){
    homeNearbySelected069=best.dataset.nearbyCard069;
    document.querySelectorAll('[data-nearby-card069]').forEach(c=>c.classList.toggle('selected',c===best));
    updateNearbyMapSelection069();
  }
  scheduleNearbySnap069(list,230);
}
function settleNearbyList069(list){
  if(nearbyScrollLock069||nearbyTouching069||!nearbyScrollActivated069) return;
  const best=closestNearbyCard069(list); if(!best)return;
  const target=nearbyCardTop069(list,best);
  const maxTop=Math.max(0,list.scrollHeight-list.clientHeight);
  const safeTarget=Math.min(maxTop,target);
  if(Math.abs(list.scrollTop-safeTarget)<2){
    selectNearby069(best.dataset.nearbyCard069,true,false);
    return;
  }
  nearbyScrollLock069=true;
  selectNearby069(best.dataset.nearbyCard069,true,false);
  list.scrollTo({top:safeTarget,behavior:'smooth'});
  setTimeout(()=>nearbyScrollLock069=false,320);
}
function prepareNearbyScrollTail069(list){
  if(!list)return;
  let tail=list.querySelector('.nearbyScrollTail069');
  if(!tail){tail=document.createElement('div');tail.className='nearbyScrollTail069';tail.setAttribute('aria-hidden','true');list.appendChild(tail);}
  const first=list.querySelector('[data-nearby-card069]');
  const h=Math.max(0,list.clientHeight-(first?.offsetHeight||54)-6);
  tail.style.flexBasis=h+'px';
}
function staticMapBounds069(visibleMiles,aspect=1,centerLat=nearbyState?.lat,centerLng=nearbyState?.lng){
  const lat=Number(centerLat),lng=Number(centerLng);
  if(!Number.isFinite(lat)||!Number.isFinite(lng)) return null;
  const verticalMiles=Math.max(.06,Number(visibleMiles)||1);
  const safeAspect=Math.max(.55,Math.min(2.4,Number(aspect)||1));
  const horizontalMiles=verticalMiles*safeAspect;
  const latDelta=verticalMiles/69;
  const lngDelta=horizontalMiles/(69*Math.max(.25,Math.cos(lat*Math.PI/180)));
  return {south:lat-latDelta,north:lat+latDelta,west:lng-lngDelta,east:lng+lngDelta,verticalMiles,horizontalMiles};
}
function staticPoint069(lat,lng,b){
  lat=Number(lat); lng=Number(lng);
  if(!b||!Number.isFinite(lat)||!Number.isFinite(lng)) return null;
  const width=b.east-b.west,height=b.north-b.south;
  if(!Number.isFinite(width)||!Number.isFinite(height)||width===0||height===0) return null;
  return {x:((lng-b.west)/width)*100,y:((b.north-lat)/height)*100};
}
function normalizedMapAddress0735(s={}){
  const raw=String(fullAddress(s)||"").trim();
  if(!raw || /no address/i.test(raw)) return "";
  return raw.toLowerCase().replace(/[^a-z0-9]/g,"");
}
function nearbyLocationGroups0735(rows,b){
  const groups=new Map();
  rows.forEach((r,index)=>{
    const g=nearbyGps069(r.s); if(!g)return;
    const p=staticPoint069(g.lat,g.lng,b); if(!p||p.x<1||p.x>99||p.y<1||p.y>99)return;
    const addr=normalizedMapAddress0735(r.s);
    const key=addr?`a:${addr}`:`g:${g.lat.toFixed(5)},${g.lng.toFixed(5)}`;
    if(!groups.has(key))groups.set(key,{key,rows:[],lat:0,lng:0,p,index});
    const group=groups.get(key);group.rows.push(r);group.lat+=g.lat;group.lng+=g.lng;group.index=Math.min(group.index,index);
  });
  return [...groups.values()].map(group=>{
    group.lat/=group.rows.length;group.lng/=group.rows.length;group.p=staticPoint069(group.lat,group.lng,b);
    group.selected=group.rows.some(r=>r.s.id===homeNearbySelected069);
    group.primary=group.rows.find(r=>r.s.id===homeNearbySelected069)||group.rows[0];
    return group;
  }).sort((a,b)=>a.index-b.index);
}
function markerContainsSite0735(marker,siteId){
  const ids=String(marker?.dataset?.staticGroup0735||marker?.dataset?.staticMarker069||"").split("|");
  return ids.includes(siteId);
}
function popupGroupForSite0735(siteId){
  return nearbyMapGroups0735.find(g=>g.rows.some(r=>r.s.id===siteId))||null;
}
function drawStaticNearbyMap069(){
  try{
    const shell=document.querySelector('.staticMapShell069'),base=document.getElementById('nearbyStaticBase069'),overlay=document.getElementById('nearbyStaticOverlay069'),count=document.getElementById('nearbyMapCount069');
    if(!shell||!base||!overlay||!nearbyState)return;
    const userLat=Number(nearbyState.lat),userLng=Number(nearbyState.lng);
    if(!Number.isFinite(userLat)||!Number.isFinite(userLng)){overlay.innerHTML='<div class="staticMapMessage069">Waiting for a valid GPS location…</div>';return;}
    const mapLat=Number(nearbyStaticCenter069?.lat ?? userLat),mapLng=Number(nearbyStaticCenter069?.lng ?? userLng);
    if(!Number.isFinite(mapLat)||!Number.isFinite(mapLng)){overlay.innerHTML='<div class="staticMapMessage069">Map center is unavailable.</div>';return;}
    const rows=nearbyRows069();
    if(!Number.isFinite(nearbyStaticVisibleMiles069)) nearbyStaticVisibleMiles069=initialVisibleMiles069(rows);
    const aspect=Math.max(.55,shell.clientWidth/Math.max(1,shell.clientHeight));
    const b=staticMapBounds069(nearbyStaticVisibleMiles069,aspect,mapLat,mapLng);
    if(!b){overlay.innerHTML='<div class="staticMapMessage069">Map coordinates are unavailable.</div>';return;}
    nearbyStaticCurrentBounds069=b;
    const bbox=[b.west,b.south,b.east,b.north].map(n=>Number(n).toFixed(6)).join('%2C');
    const nextSrc=`https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik`;
    if(base.dataset.mapSrc!==nextSrc){base.dataset.mapSrc=nextSrc;base.src=nextSrc;}
    const userPoint=staticPoint069(userLat,userLng,b);
    const userVisible=userPoint&&userPoint.x>=0&&userPoint.x<=100&&userPoint.y>=0&&userPoint.y<=100;
    const selectedRow=rows.find(r=>r.s.id===homeNearbySelected069)||rows[0]||null;
    const activeRadius=Math.max(.1,Math.min(NEARBY_LIST_MAX_MILES_069,Number(nearbyAdaptiveRadiusMiles069)||adaptiveRadiusForRow069(selectedRow)));
    nearbyAdaptiveRadiusMiles069=activeRadius;
    const radiusPx=Math.max(8,Math.min(shell.clientWidth,shell.clientHeight)*(activeRadius/Math.max(.01,b.verticalMiles))/2);
    let html='';
    if(userVisible&&!nearbyStreetFocusSite069) html+=`<span class="staticRadius069" style="left:${userPoint.x}%;top:${userPoint.y}%;width:${radiusPx*2}px;height:${radiusPx*2}px"></span>`;
    if(userVisible) html+=`<span class="staticUser069" style="left:${userPoint.x}%;top:${userPoint.y}%"></span>`;
    const groups=nearbyLocationGroups0735(rows,b);
    nearbyMapGroups0735=groups;
    const rendered=groups.reduce((n,g)=>n+g.rows.length,0);
    groups.forEach((group,groupIndex)=>{
      const r=group.primary,p=group.p;if(!r||!p)return;
      const categories=[...new Set(group.rows.map(x=>accountCategory070(x.s)))];
      const category=categories.length===1?categories[0]:"multi";
      const ids=group.rows.map(x=>x.s.id).join("|");
      const countLabel=group.rows.length>1?group.rows.length:group.index+1;
      const aria=group.rows.length>1?`${group.rows.length} accounts at ${fullAddress(r.s)}`:(r.s.name||"Account");
      html+=`<button class="staticMarker069 category-${category} ${group.selected?'selected':''} ${group.rows.length>1?'multiAccountMarker0735':''}" style="left:${p.x}%;top:${p.y}%" data-static-marker069="${esc(r.s.id)}" data-static-group0735="${esc(ids)}" data-marker-category070="${category}" aria-label="${esc(aria)}"><span>${countLabel}</span>${group.rows.length>1?`<b>ACCTS</b>`:""}</button>`;
    });
    overlay.innerHTML=html||'<div class="staticMapMessage069">No mapped accounts are inside the current view.</div>';
    if(count){count.textContent=`${rendered} account${rendered===1?'':'s'} • ${groups.length} location${groups.length===1?'':'s'} • ${nearbyAdaptiveRadiusMiles069.toFixed(1)} mi radius`;count.hidden=false;}
    overlay.querySelectorAll('[data-static-marker069]').forEach(m=>m.onclick=e=>{
      e.stopPropagation();
      const ids=String(m.dataset.staticGroup0735||m.dataset.staticMarker069).split("|");
      const id=ids.includes(homeNearbySelected069)?homeNearbySelected069:ids[0];
      selectNearby069(id,false,true,true);
      const card=document.querySelector(`[data-nearby-card069="${cssEscape069(id)}"]`);
      if(card){nearbyScrollLock069=true;const list=document.getElementById('nearbyCards069');if(list){prepareNearbyScrollTail069(list);const target=Math.min(Math.max(0,list.scrollHeight-list.clientHeight),nearbyCardTop069(list,card));list.scrollTo({top:target,behavior:'smooth'});}setTimeout(()=>nearbyScrollLock069=false,380);}
    });
    updateNearbyMapSelection069();
  }catch(err){
    console.error('Nearby static map render failed',err);
    const overlay=document.getElementById('nearbyStaticOverlay069');
    if(overlay)overlay.innerHTML='<div class="staticMapMessage069">The account list is available, but the map could not be drawn. Tap Refresh to retry.</div>';
  }
}
function initNearbyMap069(){
  if(!nearbyState)return;
  drawStaticNearbyMap069();
  const shell=document.querySelector('.staticMapShell069');
  if(shell)shell.onclick=e=>{if(!e.target.closest('[data-static-marker069]')){nearbyMapPopupSite069="";updateNearbyMapSelection069();}};
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

function siteAccountRow0736(s){
  const id=accountId069(s);
  const category=accountCategory070(s);
  const categoryLabel=NEARBY_CATEGORY_META_070[category]?.label||"Basic";
  const health=siteHealth(s);
  const openTasks=siteOpenTasks556(s).length;
  const openDef=siteOpenDeficiencies556(s).length;
  const panel=[s.panelManufacturer,s.panelModel].filter(Boolean).join(" ");
  const contact=primaryContact477(s);
  const status=[];
  if(openDef) status.push(`${openDef} deficienc${openDef===1?"y":"ies"}`);
  if(openTasks) status.push(`${openTasks} task${openTasks===1?"":"s"}`);
  if(!status.length) status.push("No open work");
  return `<article class="accountRow0736 category-${category}" data-id="${esc(s.id)}" data-search="${esc(siteSearchBlob(s))}" data-attention="${health.cls==='healthWarn'?'1':'0'}" data-open="${openTasks||openDef?'1':'0'}" data-gps="${hasGps(s)?'1':'0'}">
    <span class="accountAccent0736" aria-hidden="true"></span>
    <div class="accountBody0736">
      <div class="accountTitleLine0736"><strong>${esc(s.name||"Unnamed Account")}</strong><span class="accountType0736 category-${category}">${esc(categoryLabel)}</span></div>
      ${id?`<b class="accountId0736">${esc(id)}</b>`:""}
      <p class="accountAddress0736">${esc(fullAddress(s)||"No address saved")}</p>
      <small class="accountDetail0736">${esc(panel||contact?.name||"Account details not entered")}</small>
      ${accountTagChips0737(s,3)}
    </div>
    <div class="accountRight0736">
      <span class="accountWork0736 ${openDef?'hasDeficiency':openTasks?'hasTasks':'clear'}">${esc(status.join(" • "))}</span>
      <span class="accountGps0736 ${hasGps(s)?'ready':'missing'}">${hasGps(s)?'GPS':'No GPS'}</span>
      <b aria-hidden="true">›</b>
    </div>
  </article>`;
}

function sites(){
  const accounts=[...(data.sites||[])].sort((a,b)=>String(a.name||"").localeCompare(String(b.name||""),undefined,{sensitivity:"base"}));
  const attentionCount=accounts.filter(s=>siteHealth(s).cls==="healthWarn").length;
  const openWorkCount=accounts.filter(s=>siteOpenTasks556(s).length||siteOpenDeficiencies556(s).length).length;
  const missingGpsCount=accounts.filter(s=>!hasGps(s)).length;
  html(`<div class="screen accountsPage0736">
    <header class="accountsHeader0736">
      <div><span>Customer vault</span><h1>Accounts</h1><p>${accounts.length} saved account${accounts.length===1?"":"s"}</p></div>
      <div class="accountsHeaderActions0736"><button class="ghost" id="nearBtn" aria-label="Find nearby accounts">${fvIcon073("nearby","accountsHeaderIcon0736")}</button><button class="primary" id="addBtn" aria-label="Add account">＋</button></div>
    </header>
    <section class="accountSearch0736">
      <span aria-hidden="true">⌕</span><input id="siteSearch" type="search" placeholder="Search names, addresses, IDs, panels…" value="${esc(siteSearch)}" autocomplete="off"><button id="clearSiteSearch" aria-label="Clear search">×</button>
    </section>
    <section class="accountStats0736" aria-label="Account summary">
      <button data-sites-filter0736="all" class="${sitesFilter0736==='all'?'active':''}"><strong>${accounts.length}</strong><span>All</span></button>
      <button data-sites-filter0736="attention" class="${sitesFilter0736==='attention'?'active':''}"><strong>${attentionCount}</strong><span>Attention</span></button>
      <button data-sites-filter0736="open" class="${sitesFilter0736==='open'?'active':''}"><strong>${openWorkCount}</strong><span>Open Work</span></button>
      <button data-sites-filter0736="missingGps" class="${sitesFilter0736==='missingGps'?'active':''}"><strong>${missingGpsCount}</strong><span>No GPS</span></button>
    </section>
    <div class="accountListHead0736"><strong id="siteSearchCount">${accounts.length} account${accounts.length===1?"":"s"}</strong><span>Tap an account to open</span></div>
    <div class="accountList0736 grow" id="accountList0736">${accounts.length?accounts.map(siteAccountRow0736).join(""):`<div class="accountEmpty0736"><span>＋</span><strong>No accounts yet</strong><p>Add your first customer account to begin.</p><button class="primary" id="emptyAdd0736">Add Account</button></div>`}</div>
  </div>`);
  const openAdd=()=>{selectedSiteId=null;mode=null;route("siteForm");};
  document.getElementById("addBtn")?.addEventListener("click",openAdd);
  document.getElementById("emptyAdd0736")?.addEventListener("click",openAdd);
  document.getElementById("nearBtn")?.addEventListener("click",detectNearbySites);
  const searchEl=document.getElementById("siteSearch");
  const clearBtn=document.getElementById("clearSiteSearch");
  const countEl=document.getElementById("siteSearchCount");
  const applySiteSearch=()=>{
    siteSearch=(searchEl?.value||"").trim().toLowerCase();
    let shown=0;
    document.querySelectorAll(".accountRow0736").forEach(el=>{
      const searchOk=!siteSearch||(el.dataset.search||"").includes(siteSearch);
      const filterOk=sitesFilter0736==="all" ||
        (sitesFilter0736==="attention"&&el.dataset.attention==="1") ||
        (sitesFilter0736==="open"&&el.dataset.open==="1") ||
        (sitesFilter0736==="missingGps"&&el.dataset.gps!=="1");
      const ok=searchOk&&filterOk;
      el.hidden=!ok;
      if(ok) shown++;
    });
    if(countEl) countEl.textContent=`${shown} account${shown===1?"":"s"}`;
    if(clearBtn) clearBtn.hidden=!siteSearch;
  };
  searchEl?.addEventListener("input",applySiteSearch);
  clearBtn?.addEventListener("click",()=>{if(searchEl){searchEl.value="";searchEl.focus();}applySiteSearch();});
  document.querySelectorAll("[data-sites-filter0736]").forEach(btn=>btn.onclick=()=>{sitesFilter0736=btn.dataset.sitesFilter0736||"all";sites();});
  document.querySelectorAll(".accountRow0736").forEach(el=>el.onclick=()=>{selectedSiteId=el.dataset.id;route("siteDetail");});
  applySiteSearch();
}

function nearbySites(){
  const radius=nearbyRadiusMiles();
  const inv=gpsInventory0652();
  const rows=nearbyState ? gpsSiteDistances(nearbyState.lat, nearbyState.lng) : [];
  const nearby=rows.filter(r=>r.meters <= radius*1609.344);
  const shown=nearby.length ? nearby : rows.slice(0,8);
  const isScanning=nearbyScanStatus0652.state==="scanning";
  const hasError=nearbyScanStatus0652.state==="error";
  const noSites=!inv.ready;
  const status=nearbyState ? `${nearby.length} within ${radius} mi • nearest ${rows[0]?distanceLabel(rows[0].meters):"unavailable"} • phone accuracy ±${nearbyState.accuracy||0} m` : `${inv.ready} GPS-ready • ${inv.missing} missing coordinates • radius ${radius} mi`;
  const message=noSites
    ? `<div class="card nearbyScanMessage0652 warning"><strong>No GPS-ready sites</strong><p>${esc(nearbyScanStatus0652.message||`${inv.total} sites are saved, but none contain usable latitude and longitude.`)}</p><button class="primary" id="nearbyOpenImport0652">Open Customer Import</button></div>`
    : isScanning
      ? `<div class="card nearbyScanMessage0652 scanning"><strong>Locating your phone</strong><p>${esc(nearbyScanStatus0652.message)}</p><span class="nearbySpinner0652" aria-hidden="true"></span></div>`
      : hasError
        ? `<div class="card nearbyScanMessage0652 error"><strong>Nearby scan could not finish</strong><p>${esc(nearbyScanStatus0652.message)}</p><div class="nearbyMessageActions0652"><button class="primary" id="nearbyRetry0652">Try Again</button><button class="ghost" id="nearbyGpsSettings0652">GPS Settings</button></div></div>`
        : nearbyState
          ? `<div class="card nearbyScanMessage0652 success"><strong>Location comparison complete</strong><p>${esc(nearbyScanStatus0652.message||"The nearest GPS-ready customer accounts are shown below.")}</p></div>`
          : `<div class="card nearbyScanMessage0652"><strong>Ready to scan</strong><p>Tap Scan to compare your current phone location with ${inv.ready} GPS-ready customer account${inv.ready===1?"":"s"}.</p></div>`;
  html(`<div class="screen nearbyScreen nearbyScreen0652"><div class="row nearbyTop0652"><button class="back ghost" id="backBtn">←</button><button class="primary smallBtn" id="scanNearbyBtn" ${isScanning||noSites?'disabled':''}>${isScanning?"Scanning…":nearbyState?"Refresh":"Scan"}</button></div>
    <div class="card nearbyHero"><h1>Nearby Sites</h1><p>${esc(status)}</p><div class="nearbyInventory0652"><span><b>${inv.total}</b>Total</span><span><b>${inv.ready}</b>GPS Ready</span><span><b>${inv.missing}</b>Missing GPS</span></div></div>
    ${message}
    <div class="list grow nearbyResults0652">${nearbyState && shown.length ? `${nearby.length?"":`<div class="nearbyFallbackNote0652">No account is inside the ${radius}-mile radius. Showing the nearest saved sites instead.</div>`}${shown.map(r=>`<div class="card siteItem nearbyItem ${r.meters <= radius*1609.344 ? "nearMatch" : "nearFallback"}" data-id="${r.s.id}"><div class="row"><div><h2>${esc(r.s.name||"Unnamed Site")}</h2><p>${esc(fullAddress(r.s))}</p><p>${esc(gpsLine(r.s))}</p></div><span class="pill gpsPill">${distanceLabel(r.meters)}</span></div></div>`).join("")}` : !nearbyState?`<div class="empty">Run a scan to display nearest sites.</div>`:""}</div>
  </div>`);
  document.getElementById("backBtn").onclick=()=>route("home");
  const scan=document.getElementById("scanNearbyBtn"); if(scan) scan.onclick=()=>runNearbyScan0652("nearbySites");
  const retry=document.getElementById("nearbyRetry0652"); if(retry) retry.onclick=()=>runNearbyScan0652("nearbySites");
  const gpsSettings=document.getElementById("nearbyGpsSettings0652"); if(gpsSettings) gpsSettings.onclick=()=>{settingsTab="gps";mode="settingsDetail";route("settings");};
  const openImport=document.getElementById("nearbyOpenImport0652"); if(openImport) openImport.onclick=()=>{settingsTab="customerImport";mode="settingsDetail";route("settings");};
  document.querySelectorAll(".nearbyItem").forEach(el=>el.onclick=()=>{selectedSiteId=el.dataset.id; route("siteDetail");});
}


function primaryContact477(s){
  const contacts=Array.isArray(s?.contacts)?s.contacts:[];
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
    `GPS: ${gpsLine(s)}`,
    s.externalAccountId?`External Account ID: ${s.externalAccountId}`:"",
    s.deviceType?`Device Type: ${s.deviceType}`:"",
    s.devicePhone?`Device Phone: ${s.devicePhone}`:""
  ].filter(Boolean);
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


function accountCategoryLabel0735(s={}){
  const category=accountCategory070(s);
  return ({clss:"CLSS",alarmnet:"AlarmNet",ipdact:"IPDACT",basic:"Basic"})[category]||"Basic";
}
function accountSince0735(s={}){
  const value=s.createdAt||s.importMetadata?.lastImportedAt||s.updatedAt;
  if(!value) return "Not recorded";
  const d=new Date(value); if(Number.isNaN(d.getTime())) return "Not recorded";
  return d.toLocaleDateString([], {month:"short",day:"numeric",year:"numeric"});
}
function accountNextDue0735(s={}){
  const dates=(s.tasks||[]).filter(t=>!taskIsDone(t)&&t.due).map(t=>({raw:t.due,time:new Date(`${t.due}T12:00:00`).getTime()})).filter(x=>Number.isFinite(x.time)).sort((a,b)=>a.time-b.time);
  if(!dates.length) return "None";
  return new Date(dates[0].time).toLocaleDateString([], {month:"short",day:"numeric"});
}
function accountMapPreview0735(s={}){
  if(!hasGps(s)) return `<div class="accountMapEmpty0735"><span>⌖</span><strong>No GPS location saved</strong><small>Capture GPS from the Details tab when you are on site.</small></div>`;
  const lat=Number(s.gps.lat),lng=Number(s.gps.lng),d=.0032;
  const bbox=[lng-d,lat-d,lng+d,lat+d].map(n=>n.toFixed(6)).join("%2C");
  const src=`https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat.toFixed(6)}%2C${lng.toFixed(6)}`;
  return `<div class="accountMapPreview0735"><iframe src="${esc(src)}" title="Map preview for ${esc(s.name||"account")}" loading="lazy" tabindex="-1"></iframe><span class="accountMapPin0735" aria-hidden="true"></span><button id="accountMapRoute0735">Route</button></div>`;
}
function accountRecentActivity0735(s={},limit=5){
  const rows=[];
  const add=(at,kind,title,detail,routeName)=>{const t=new Date(at||0).getTime();if(Number.isFinite(t)&&t>0)rows.push({t,kind,title,detail,routeName});};
  (s.visits||[]).forEach(v=>add(v.endedAt||v.startedAt||v.date,"visit","Service visit",visitNotesPreview(v,1),"visits"));
  (s.deficiencies||[]).forEach(d=>add(d.createdAt||d.updatedAt,"deficiency",d.title||"Deficiency",`${d.priority||"Normal"} • ${d.status||"Open"}`,"deficiencies"));
  (s.tasks||[]).forEach(t=>add(t.createdAt||t.updatedAt,"task",t.title||"Task",t.status||"Open","tasks"));
  (s.docs||[]).forEach(d=>add(d.createdAt||d.updatedAt,"document",d.title||d.imageName||"Document",docHasPhoto512(d)?"Photo added":"Document added","siteDocs"));
  return rows.sort((a,b)=>b.t-a.t).slice(0,limit);
}
function accountRecentMarkup0735(s={}){
  const rows=accountRecentActivity0735(s,6);
  if(!rows.length) return `<div class="accountEmptyState0735"><strong>No recent activity</strong><span>Visits, tasks, deficiencies, photos, and documents will appear here.</span></div>`;
  const icons={visit:"✓",deficiency:"!",task:"□",document:"▣"};
  return `<div class="accountRecentList0735">${rows.map(r=>`<button data-account-activity0735="${esc(r.routeName)}"><span class="kind-${esc(r.kind)}">${icons[r.kind]||"•"}</span><div><strong>${esc(r.title)}</strong><small>${esc(new Date(r.t).toLocaleDateString([], {month:"short",day:"numeric",year:"numeric"}))}${r.detail?` • ${esc(r.detail)}`:""}</small></div><b>›</b></button>`).join("")}</div>`;
}
function accountOverviewTab0735(s,ctx){
  const {health,primary,lastVisit,def,open}=ctx;
  const status=health.label;
  const contactName=primary?contactTitle(primary):"No contact saved";
  const contactPhone=primary?.phone||s.sitePhone||"";
  return `<div class="accountTabPanel0735 accountOverview0735">
    <section class="accountLocationCard0735">
      <div class="accountAddress0735"><span>LOCATION</span><strong>${esc(fullAddress(s)||"No address saved")}</strong>${hasGps(s)?`<small>${esc(gpsLine(s))}</small>`:""}</div>
      
    </section>
    <section class="accountInfoCard0735">
      <button><span>Status</span><strong class="accountStatus0735 status-${esc(health.cls)}">${esc(status)}</strong></button>
      <button><span>Category</span><strong>${esc(accountCategoryLabel0735(s))}</strong></button>
      <button><span>Account Since</span><strong>${esc(accountSince0735(s))}</strong></button>
      <button id="contactsQuick477"><span>Contact</span><strong>${esc(contactName)}</strong>${contactPhone?`<small>${esc(contactPhone)}</small>`:""}</button>
      ${primary?.email?`<a href="mailto:${esc(primary.email)}"><span>Email</span><strong>${esc(primary.email)}</strong></a>`:""}
    </section>
    <section class="accountMetricCards0735">
      <button id="visitsMini477"><span>LAST VISIT</span><strong>${esc(lastVisit?visitDateLabel(lastVisit):"None")}</strong></button>
      <button id="defBtn" class="metricDanger0735"><span>DEFICIENCIES</span><strong>${def} Open</strong></button>
      <button id="taskBtn" class="metricBlue0735"><span>NEXT DUE</span><strong>${esc(accountNextDue0735(s))}</strong><small>${open} open task${open===1?"":"s"}</small></button>
    </section>
    <section class="accountQuickBar0735 technicianActionBar075" aria-label="Primary account actions">
      <button id="callPrimary477" ${contactPhone?"":"disabled"}>${fvIcon073("call","technicianActionIcon075")}<strong>Call</strong><small>${contactPhone?"Primary contact":"No phone"}</small></button>
      <button id="navigateBtn477" ${hasGps(s)?"":"disabled"}>${fvIcon073("route","technicianActionIcon075")}<strong>Route</strong><small>${hasGps(s)?"Open directions":"No GPS"}</small></button>
      <button id="qaAddNote544">${fvIcon073("note","technicianActionIcon075")}<strong>Note</strong><small>Add site note</small></button>
      <button id="qaStartVisit610">${fvIcon073("visit","technicianActionIcon075")}<strong>${ctx.activeHere?"Resume":"Visit"}</strong><small>${ctx.activeHere?"Continue work":"Start service"}</small></button>
    </section>
    <section class="accountPanel0735"><div class="accountPanelHead0735"><div><span>RECENT ACTIVITY</span><h2>Account Timeline</h2></div><button class="ghost" id="allVisitsBtn">View All</button></div>${accountRecentMarkup0735(s)}</section>
  </div>`;
}
function accountDetailsTab0735(s,ctx){
  const {panel,primary,access}=ctx;
  const primaryMeta=primary?[primary.phone,primary.email].filter(Boolean).join(" • "):"";
  return `<div class="accountTabPanel0735">
    <section class="accountPanel0735"><div class="accountPanelHead0735"><div><span>SITE DETAILS</span><h2>System &amp; Access</h2></div><button class="ghost" id="editDetails0735">Edit</button></div>
      <div class="accountDetailGrid0735">
        <div><span>Panel</span><strong>${esc(panel)}</strong></div>
        <div><span>Primary Contact</span><strong>${esc(primary?contactTitle(primary):"No contact saved")}</strong>${primaryMeta?`<small>${esc(primaryMeta)}</small>`:""}</div>
        <div><span>Access</span><strong>${esc(access||"No access notes")}</strong></div>
        <div><span>Account ID</span><strong>${esc(accountId069(s)||"Not assigned")}</strong></div>
        <div><span>Site Phone</span><strong>${esc(s.sitePhone||"Not entered")}</strong></div>
        <div><span>Health</span><strong>${esc(siteHealthLine(s))}</strong></div>
      </div>
      <div class="accountInlineActions067"><button class="ghost" id="copyImportantInfo568">Copy Site Info</button><button class="ghost" id="snapshotBtn">Copy Snapshot</button><button class="ghost" id="contactsQuick477">Contacts</button></div>
    </section>
    ${importedAccountCard065(s)}
    <section class="accountPanel0735"><div class="accountPanelHead0735"><div><span>LOCATION</span><h2>GPS &amp; Navigation</h2></div></div>
      <div class="accountGpsCard0735"><div><span>Saved Coordinates</span><strong>${esc(gpsLine(s))}</strong></div>${data.settings.gps?.enabled===false?"":`<button class="primary" id="captureGpsBtn">Capture GPS</button>`}</div>
      <div class="accountInlineActions067"><button class="ghost" id="navigateBtn477" ${hasGps(s)?"":"disabled"}>Navigate</button><button class="ghost" id="appleBtn" ${hasGps(s)?"":"disabled"}>Apple Maps</button><button class="ghost" id="googleBtn" ${hasGps(s)?"":"disabled"}>Google Maps</button></div>
    </section>
    ${plusCodeSection071(s)}
  </div>`;
}
function accountEquipmentTab0735(s){
  const equipment=Array.isArray(s.equipment)?s.equipment:[];
  return `<div class="accountTabPanel0735">
    <section class="accountPanel0735"><div class="accountPanelHead0735"><div><span>EQUIPMENT</span><h2>${equipment.length} Saved Item${equipment.length===1?"":"s"}</h2></div><div><button class="ghost" id="openEquipment0735">Open Vault</button><button class="primary" id="addEquipment0735">＋ Add</button></div></div>
      ${equipment.length?`<div class="accountEquipmentList0735">${equipment.slice(0,10).map(e=>`<button data-account-equipment0735="${esc(e.id)}"><span class="equipmentState0735 ${esc(equipmentStatusClass(e))}"></span><div><strong>${esc(equipmentTitle(e))}</strong><small>${esc(equipmentMeta(e))}</small></div><em>${esc(e.status||"Active")}</em><b>›</b></button>`).join("")}</div>`:`<div class="accountEmptyState0735"><strong>No equipment saved</strong><span>Add the fire alarm panel, communicator, power supplies, and other serviceable equipment.</span><button class="primary" id="addEquipmentEmpty0735">Add First Item</button></div>`}
    </section>
  </div>`;
}
function accountDocsTab0735(s){
  const docs=Array.isArray(s.docs)?s.docs:[];
  const photos=docs.filter(docHasPhoto512);
  return `<div class="accountTabPanel0735">
    <section class="accountPanel0735"><div class="accountPanelHead0735"><div><span>PHOTOS</span><h2>${photos.length} Account Photo${photos.length===1?"":"s"}</h2></div><div><button class="ghost" id="openPhotoVaultBtn523">Open Vault</button><button class="primary" id="addAccountPhotoBtn523">＋ Photo</button></div></div>
      ${photos.length?`<div class="accountPhotoGrid0735">${photos.slice(0,8).map(d=>`<button class="accountPhotoThumb523" data-doc="${esc(d.id)}">${docPhotoThumb512(d)}<span>${esc(d.title||d.imageName||"Photo")}</span></button>`).join("")}</div>`:`<div class="accountEmptyState0735"><strong>No photos saved</strong><span>Add panel, device, wiring, deficiency, or completed-work photos.</span></div>`}
    </section>
    <section class="accountPanel0735"><div class="accountPanelHead0735"><div><span>DOCUMENTS</span><h2>${docs.length} Total File${docs.length===1?"":"s"}</h2></div><button class="ghost" id="manageDocsBtn">Manage</button></div>
      <div class="accountDocActions0735"><button id="reportBtn"><span>▤</span><strong>Report</strong><small>Customer closeout</small></button><button id="checklistBtn"><span>✓</span><strong>Checklist</strong><small>Inspection workflow</small></button><button id="qaCloseout544"><span>↗</span><strong>Copy Closeout</strong><small>Customer packet</small></button></div>
    </section>
  </div>`;
}
function accountNotesTab0735(s,ctx){
  const {health,lastVisit,def,open}=ctx;
  return `<div class="accountTabPanel0735">
    <section class="accountPanel0735"><div class="accountPanelHead0735"><div><span>SITE NOTES</span><h2>Technician Notes</h2></div><button class="primary" id="addSiteNoteBtn491">＋ Add Note</button></div><div class="accountNotesBody0735">${esc(s.notes||"No notes entered.")}</div><button class="ghost accountWideButton0735" id="openSiteNotesBtn494">Open Full Notes Workspace</button></section>
    <section class="accountMetricCards0735 accountWorkMetrics0735"><button id="taskBtn"><span>OPEN TASKS</span><strong>${open}</strong></button><button id="defBtn" class="metricDanger0735"><span>DEFICIENCIES</span><strong>${def}</strong></button><button id="visitsMini477"><span>LAST VISIT</span><strong>${esc(lastVisit?visitDateLabel(lastVisit):"None")}</strong></button></section>
    <section class="accountQuickBar0735 accountWorkActions0735"><button id="qaAddTask544"><span>□</span><strong>Task</strong></button><button id="qaAddDef544"><span>!</span><strong>Deficiency</strong></button><button id="qaAddPhoto544"><span>▣</span><strong>Photo</strong></button><button id="qaReport544"><span>▤</span><strong>Report</strong></button></section>
    <section class="accountPanel0735"><div class="accountPanelHead0735"><div><span>RECENT VISIT</span><h2>${esc(lastVisit?visitDateLabel(lastVisit):"No completed visits")}</h2></div>${lastVisit?`<button class="ghost" id="allVisitsBtn">History</button>`:""}</div>${lastVisit?`<p class="accountVisitPreview0735">${esc(visitNotesPreview(lastVisit,3))}</p>`:`<div class="accountEmptyState0735"><span>Start a service visit to create an account history.</span></div>`}</section>
    ${featureOn("siteTimeline")?siteActivityTimelineMarkup557(s):""}
  </div>`;
}
function siteDetail(){
  const s=site(); if(!s){ route("sites"); return; }
  if(accountDetailSite0735!==s.id){accountDetailSite0735=s.id;accountDetailTab0735="overview";}
  s.lastOpenedAt=new Date().toISOString(); saveData(data);
  const open=(s.tasks||[]).filter(t=>(t.status||"Open")!=="Done").length;
  const def=(s.deficiencies||[]).filter(d=>(d.status||"Open")!=="Closed").length;
  const siteVisits=Array.isArray(s.visits)?s.visits:[];
  const equipment=Array.isArray(s.equipment)?s.equipment:[];
  const docs=Array.isArray(s.docs)?s.docs:[];
  const health=siteHealth(s);
  const lastVisit=siteVisits[0];
  const panel=[s.panelManufacturer,s.panelModel].filter(Boolean).join(" ")||"Panel not entered";
  const primary=primaryContact477(s);
  const access=accessSummary477(s);
  const activeHere=activeJob&&activeJob.siteId===s.id;
  const ctx={open,def,siteVisits,equipment,docs,health,lastVisit,panel,primary,access,activeHere};
  const accountId=accountId069(s)||"No Account ID";
  const tabs=[["overview","Overview"],["details","Details"],["equipment","Equipment"],["docs","Docs"],["notes","Notes"]];
  const panelMarkup=accountDetailTab0735==="details"?accountDetailsTab0735(s,ctx):accountDetailTab0735==="equipment"?accountEquipmentTab0735(s):accountDetailTab0735==="docs"?accountDocsTab0735(s):accountDetailTab0735==="notes"?accountNotesTab0735(s,ctx):accountOverviewTab0735(s,ctx);

  html(`<div class="screen siteDetail0735">
    <header class="accountHeader0735 technicianHeader075"><button class="accountBack0735" id="backBtn" aria-label="Back to Accounts">‹</button><div class="technicianIdentity075"><span class="technicianEyebrow075">ACCOUNT</span><strong>${esc(s.name||"Unnamed Account")}</strong><span>${esc(accountId)}${fullAddress(s)?` • ${esc(fullAddress(s))}`:""}</span></div><button class="accountPin0735 ${isPinnedSite566(s)?"pinned":""}" id="pinSiteBtn566" aria-label="Pin account">${isPinnedSite566(s)?"★":"☆"}</button><button class="accountEdit0735" id="editBtn">Edit</button></header>
    <section class="technicianStatus075"><span class="status-${esc(health.cls)}">${esc(health.label)}</span><span>${esc(accountCategoryLabel0735(s))}</span>${open?`<span>${open} task${open===1?"":"s"}</span>`:""}${def?`<span class="hasDef075">${def} deficienc${def===1?"y":"ies"}</span>`:""}</section>
    ${accountTagChips0737(s,8)?`<div class="accountTagRail0737">${accountTagChips0737(s,8)}</div>`:""}
    <nav class="accountTabs0735" aria-label="Account sections">${tabs.map(([key,label])=>`<button class="${accountDetailTab0735===key?"active":""}" data-account-tab0735="${key}">${label}</button>`).join("")}</nav>
    <div class="accountTabScroll0735">${panelMarkup}</div>
  </div>`);

  document.getElementById("backBtn")?.addEventListener("click",()=>route("sites"));
  document.getElementById("editBtn")?.addEventListener("click",()=>{mode="edit";route("siteForm");});
  document.getElementById("pinSiteBtn566")?.addEventListener("click",toggleSitePinned566);
  document.querySelectorAll("[data-account-tab0735]").forEach(b=>b.onclick=()=>{accountDetailTab0735=b.dataset.accountTab0735;siteDetail();});
  document.getElementById("editDetails0735")?.addEventListener("click",()=>{mode="edit";route("siteForm");});
  document.getElementById("qaStartVisit610")?.addEventListener("click",startServiceVisit610);
  document.getElementById("qaAddNote544")?.addEventListener("click",addSiteNotePrompt);
  document.getElementById("qaAddPhoto544")?.addEventListener("click",()=>{mode="newPhoto";route("siteDocForm");});
  document.getElementById("qaAddDef544")?.addEventListener("click",()=>{mode=null;route("deficiencyForm");});
  document.getElementById("qaAddTask544")?.addEventListener("click",()=>{mode=null;route("taskForm");});
  document.getElementById("taskBtn")?.addEventListener("click",()=>route("tasks"));
  document.getElementById("defBtn")?.addEventListener("click",()=>route("deficiencies"));
  document.getElementById("visitsMini477")?.addEventListener("click",()=>route("visits"));
  document.getElementById("contactsQuick477")?.addEventListener("click",()=>route("contactsList"));
  const contactPhone=primary?.phone||s.sitePhone||"";
  if(contactPhone) document.getElementById("callPrimary477")?.addEventListener("click",()=>{location.href=`tel:${contactPhone.replace(/[^+\d]/g,"")}`;});
  document.getElementById("navigateBtn477")?.addEventListener("click",()=>{if(hasGps(s))window.open(mapRouteUrl071(s),"_blank");});
  document.getElementById("accountMapRoute0735")?.addEventListener("click",()=>window.open(mapRouteUrl071(s),"_blank"));
  document.getElementById("allVisitsBtn")?.addEventListener("click",()=>route("visits"));
  document.querySelectorAll("[data-account-activity0735]").forEach(b=>b.onclick=()=>route(b.dataset.accountActivity0735));
  document.getElementById("snapshotBtn")?.addEventListener("click",shareSiteSnapshot);
  document.getElementById("captureGpsBtn")?.addEventListener("click",captureGpsForSite);
  document.getElementById("appleBtn")?.addEventListener("click",()=>{if(hasGps(s))window.open(mapUrl(s,"apple"),"_blank");});
  document.getElementById("googleBtn")?.addEventListener("click",()=>{if(hasGps(s))window.open(mapUrl(s,"google"),"_blank");});
  document.getElementById("copyPrimaryPlus071")?.addEventListener("click",()=>copyText071(sitePlusCode071(s),"Plus Code copied."));
  document.getElementById("addLocationPoint071")?.addEventListener("click",addLocationPoint071);
  document.querySelectorAll("[data-copy-plus071]").forEach(b=>b.onclick=()=>{const p=locationPoints071(s).find(x=>x.id===b.dataset.copyPlus071);if(p)copyText071(p.plusCode,"Plus Code copied.");});
  document.querySelectorAll("[data-route-plus071]").forEach(b=>b.onclick=()=>routeLocationPoint071(b.dataset.routePlus071));
  document.querySelectorAll("[data-prefer-plus071]").forEach(b=>b.onclick=()=>setPreferredLocation071(b.dataset.preferPlus071));
  document.querySelectorAll("[data-delete-plus071]").forEach(b=>b.onclick=()=>deleteLocationPoint071(b.dataset.deletePlus071));
  document.getElementById("openEquipment0735")?.addEventListener("click",()=>route("equipmentList"));
  const addEquipment=()=>{mode=null;route("equipmentForm");};
  document.getElementById("addEquipment0735")?.addEventListener("click",addEquipment);
  document.getElementById("addEquipmentEmpty0735")?.addEventListener("click",addEquipment);
  document.querySelectorAll("[data-account-equipment0735]").forEach(b=>b.onclick=()=>{mode=b.dataset.accountEquipment0735;route("equipmentForm");});
  document.getElementById("openPhotoVaultBtn523")?.addEventListener("click",()=>{docVaultFilter516="photos";route("siteDocs");});
  document.getElementById("addAccountPhotoBtn523")?.addEventListener("click",()=>{mode="newPhoto";route("siteDocForm");});
  document.querySelectorAll(".accountPhotoThumb523").forEach(b=>b.onclick=()=>{const d=(site()?.docs||[]).find(x=>x.id===b.dataset.doc);if(d)photoPreviewModal524(d);});
  document.getElementById("manageDocsBtn")?.addEventListener("click",()=>route("siteDocs"));
  document.getElementById("reportBtn")?.addEventListener("click",()=>route("report"));
  document.getElementById("checklistBtn")?.addEventListener("click",()=>route("checklist"));
  document.getElementById("qaCloseout544")?.addEventListener("click",copyCustomerCloseoutPacket539);
  document.getElementById("addSiteNoteBtn491")?.addEventListener("click",addSiteNotePrompt);
  document.getElementById("openSiteNotesBtn494")?.addEventListener("click",()=>route("jobMode"));
  document.getElementById("qaReport544")?.addEventListener("click",()=>route("report"));
  wireImportantSiteInfo568(); wireSiteBrief556(); wireSiteActivity557();
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
  document.getElementById("startVisitBtn").onclick=startServiceVisit610;
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


function startServiceVisit610(){
  const s=site();
  if(!s){ route("sites"); return; }
  if(activeJob && activeJob.siteId!==s.id){
    const other=data.sites.find(x=>x.id===activeJob.siteId);
    if(!confirm(`A service visit is already active for ${other?.name||activeJob.siteName||"another site"}. End or discard that visit before starting a new one?`)) return;
    activeJob=null; saveActiveJob();
  }
  if(!activeJob){
    const now=new Date().toISOString();
    activeJob={siteId:s.id,siteName:s.name||"Customer Account",startedAt:now,events:[{time:now,note:"Service visit started"}],draft:""};
    saveActiveJob();
    toast("Service visit started.");
  }
  selectedSiteId=s.id;
  route("serviceVisit");
}
function serviceVisitEventRows610(){
  return (activeJob?.events||[]).slice().reverse().map(e=>`<div class="serviceVisitEvent610"><span>${esc(eventTime(e.time))}</span><p>${esc(e.note||"Visit event")}</p></div>`).join("");
}
function saveServiceVisitDraft610(value){
  if(!activeJob) return;
  activeJob.draft=value||"";
  saveActiveJob();
}
function addServiceVisitEvent610(defaultText=""){
  if(!activeJob) return;
  const note=prompt("Visit timeline note:",defaultText);
  if(!note?.trim()) return;
  addJobEvent(note.trim());
  toast("Timeline note added.");
  serviceVisit();
}
function endServiceVisit610(){
  const s=site();
  if(!s || !activeJob) return;
  const draft=(document.getElementById("serviceVisitNotes610")?.value||activeJob.draft||"").trim();
  const defaultSummary=draft || "Service visit completed. Site status and follow-up items documented in FireVault.";
  const summary=prompt("Final visit summary:",defaultSummary);
  if(summary===null) return;
  const endedAt=new Date().toISOString();
  const events=(activeJob.events||[]).slice();
  events.push({time:endedAt,note:"Service visit completed"});
  const timeline=events.map(e=>`${eventTime(e.time)} — ${e.note}`).join("\n");
  const notes=[summary.trim()||defaultSummary, timeline?`\nService Timeline\n${timeline}`:""].filter(Boolean).join("\n");
  s.visits=Array.isArray(s.visits)?s.visits:[];
  const visit={id:uid(),type:"Service Visit",startedAt:activeJob.startedAt,endedAt,notes,events,createdAt:endedAt};
  s.visits.unshift(visit);
  mode=visit.id;
  activeJob=null;
  saveActiveJob();
  save();
  stopJobTimer();
  toast("Service visit saved.");
  route("visitDetail");
}
function discardServiceVisit610(){
  if(!activeJob) return;
  if(!confirm("Discard this active service visit? Unsaved timer and timeline information will be removed.")) return;
  activeJob=null; saveActiveJob(); stopJobTimer(); toast("Active visit discarded."); route("siteDetail");
}
function serviceVisit(){
  if(!activeJob){ route("siteDetail"); return; }
  selectedSiteId=activeJob.siteId;
  const s=site();
  if(!s){ activeJob=null; saveActiveJob(); route("sites"); return; }
  html(`<div class="screen serviceVisitScreen610">
    <div class="row serviceVisitTop610"><button class="back ghost" id="backBtn">←</button><div><h1>Service Visit</h1><p>${esc(s.name||"Customer Account")}</p></div><button class="ghost smallBtn contextHelp537" data-help="workflow">Help</button></div>
    <div class="card serviceVisitHero610"><div><span>ACTIVE VISIT</span><strong id="jobElapsed">${elapsedText(activeJob.startedAt)}</strong><p>Started ${esc(eventTime(activeJob.startedAt))} • ${esc(fullAddress(s)||"No address entered")}</p></div><button class="primary" id="endVisit610">End & Save</button></div>
    <div class="card serviceVisitComposer610"><div class="row"><div><h2>Work Summary</h2><p>Keep a running description of testing, repairs, customer updates, and site status.</p></div><button class="ghost smallBtn" id="addTimeline610">＋ Timeline</button></div><textarea id="serviceVisitNotes610" rows="7" placeholder="Work performed, findings, devices tested, repairs, system status, parts needed...">${esc(activeJob.draft||"")}</textarea><div class="serviceVisitSaveState610">Draft saves automatically on this device.</div></div>
    <div class="serviceVisitActionGrid610">
      <button class="card" id="visitCustomer610"><strong>Customer Update</strong><span>Add timeline note</span></button>
      <button class="card" id="visitTesting610"><strong>Testing</strong><span>Add testing note</span></button>
      <button class="card" id="visitParts610"><strong>Parts Needed</strong><span>Create follow-up task</span></button>
      <button class="card" id="visitDef610"><strong>Deficiency</strong><span>Document problem</span></button>
      <button class="card" id="visitPhoto610"><strong>Photo</strong><span>Add site photo</span></button>
      <button class="card" id="visitReport610"><strong>Report</strong><span>Review account report</span></button>
    </div>
    <div class="card serviceVisitTimeline610"><div class="row"><div><h2>Visit Timeline</h2><p>${(activeJob.events||[]).length} saved event${(activeJob.events||[]).length===1?"":"s"}</p></div></div><div>${serviceVisitEventRows610()||'<div class="empty">No timeline entries yet.</div>'}</div></div>
    <button class="danger" id="discardVisit610">Discard Active Visit</button>
  </div>`);
  document.getElementById("backBtn").onclick=()=>route("siteDetail");
  document.getElementById("endVisit610").onclick=endServiceVisit610;
  document.getElementById("discardVisit610").onclick=discardServiceVisit610;
  document.getElementById("addTimeline610").onclick=()=>addServiceVisitEvent610();
  document.getElementById("visitCustomer610").onclick=()=>addServiceVisitEvent610("Customer update: ");
  document.getElementById("visitTesting610").onclick=()=>addServiceVisitEvent610("Testing performed: ");
  document.getElementById("visitParts610").onclick=()=>addServiceFollowUp("Parts Needed");
  document.getElementById("visitDef610").onclick=()=>{mode=null; route("deficiencyForm");};
  document.getElementById("visitPhoto610").onclick=()=>{mode="newPhoto"; route("siteDocForm");};
  document.getElementById("visitReport610").onclick=()=>route("report");
  const notes=document.getElementById("serviceVisitNotes610");
  if(notes) notes.addEventListener("input",()=>saveServiceVisitDraft610(notes.value));
  wireContextHelp537();
  startJobTimer();
}

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


/* Build 0.65.2 Customer CSV Importer + coordinate calculation */
const CUSTOMER_IMPORT_HEADERS_065 = ["Account Id","Account Name","SiteID1","SiteID2","SiteLanguage","DeviceType","Site Phone","Device Phone","Device Phone Comment","Address","City","State","ZipCode","SiteGroupNum"];
const CUSTOMER_GEOCODE_CACHE_KEY_0651 = "firevault_customer_geocode_cache_0651";
let customerGeocodeRunToken0651 = 0;
function cleanImportValue065(value){ return String(value??"").replace(/^\uFEFF/,"").trim(); }
/* Build 0.73.1: account identity is the only customer-import deduplication key.
   Normalize formatting without removing meaningful building suffixes such as G7C1234-01. */
function canonicalAccountId0731(value){
  return cleanImportValue065(value)
    .replace(/^'+/,"")
    .toUpperCase()
    .replace(/[\u2010-\u2015\u2212\uFE58\uFE63\uFF0D]/g,"-")
    .replace(/\s+/g,"");
}
function isClssBuildingAccount0731(value){ return /^G7C[A-Z0-9]+-[A-Z0-9]+$/.test(canonicalAccountId0731(value)); }
function normalizeImportHeader065(value){ return cleanImportValue065(value).toLowerCase().replace(/[^a-z0-9]/g,""); }
function optionalImportIndex065(normalized,labels){
  for(const label of labels){ const index=normalized.get(normalizeImportHeader065(label)); if(index!==undefined) return index; }
  return -1;
}
function parseCsvText065(text){
  const matrix=[]; let row=[], field="", quoted=false;
  const source=String(text??"").replace(/^\uFEFF/,"");
  for(let i=0;i<source.length;i++){
    const ch=source[i];
    if(ch==='"'){
      if(quoted && source[i+1]==='"'){ field+='"'; i++; }
      else quoted=!quoted;
    }else if(ch===',' && !quoted){ row.push(field); field=""; }
    else if((ch==='\n' || ch==='\r') && !quoted){
      if(ch==='\r' && source[i+1]==='\n') i++;
      row.push(field); field="";
      if(row.some(x=>String(x).trim()!=="")) matrix.push(row);
      row=[];
    }else field+=ch;
  }
  row.push(field); if(row.some(x=>String(x).trim()!=="")) matrix.push(row);
  if(!matrix.length) throw new Error("The CSV file is empty.");
  const headers=matrix.shift().map(cleanImportValue065);
  const normalized=new Map(headers.map((h,i)=>[normalizeImportHeader065(h),i]));
  const missing=CUSTOMER_IMPORT_HEADERS_065.filter(h=>!normalized.has(normalizeImportHeader065(h)));
  if(missing.length) throw new Error(`Missing required columns: ${missing.join(", ")}`);
  const latIndex=optionalImportIndex065(normalized,["Latitude","Lat"]);
  const lngIndex=optionalImportIndex065(normalized,["Longitude","Lng","Lon","Long"]);
  const rows=matrix.map((cells,index)=>{
    const get=label=>cleanImportValue065(cells[normalized.get(normalizeImportHeader065(label))]??"");
    const getOptional=index=>index>=0?cleanImportValue065(cells[index]??""):"";
    return {
      sourceRow:index+2,
      accountId:canonicalAccountId0731(get("Account Id")), name:get("Account Name"), siteId1:get("SiteID1"), siteId2:get("SiteID2"),
      siteLanguage:get("SiteLanguage"), deviceType:get("DeviceType"), sitePhone:get("Site Phone"), devicePhone:get("Device Phone"),
      devicePhoneComment:get("Device Phone Comment"), street:get("Address"), city:get("City"), state:get("State").toUpperCase(),
      zip:get("ZipCode"), sourceGroupNumber:get("SiteGroupNum"), latitude:getOptional(latIndex), longitude:getOptional(lngIndex),
      coordinateSource:(latIndex>=0&&lngIndex>=0)?"Customer CSV":"", geocodeStatus:(latIndex>=0&&lngIndex>=0)?"provided":"",
      geocodedAt:"", matchedAddress:"", geocodeBenchmark:""
    };
  });
  return {headers,rows};
}
function importDigits065(value){ return cleanImportValue065(value).replace(/\D/g,""); }
function finiteCoordinate065(value,min,max){ const raw=cleanImportValue065(value); if(raw==="") return null; const number=Number(raw); return Number.isFinite(number)&&number>=min&&number<=max?number:null; }
function rowCoordinatePair065(row){
  const lat=finiteCoordinate065(row?.latitude,-90,90),lng=finiteCoordinate065(row?.longitude,-180,180);
  return lat===null||lng===null?null:{lat:Number(lat.toFixed(6)),lng:Number(lng.toFixed(6))};
}
function siteCoordinatePair065(site){
  const lat=finiteCoordinate065(site?.gps?.lat,-90,90),lng=finiteCoordinate065(site?.gps?.lng,-180,180);
  return lat===null||lng===null?null:{lat:Number(lat.toFixed(6)),lng:Number(lng.toFixed(6))};
}
function normalizedAddressKey065(row){ return [row.street,row.city,row.state,row.zip].map(v=>cleanImportValue065(v).toUpperCase()).join("|"); }
function addressCanGeocode065(row){
  const street=cleanImportValue065(row.street);
  return !!(street && street.toLowerCase()!=="new" && row.state && (row.zip || row.city));
}
function loadGeocodeCache0651(){ try{return JSON.parse(sessionStorage.getItem(CUSTOMER_GEOCODE_CACHE_KEY_0651)||"{}")||{};}catch{return{};} }
function saveGeocodeCache0651(cache){ try{sessionStorage.setItem(CUSTOMER_GEOCODE_CACHE_KEY_0651,JSON.stringify(cache));}catch{} }
function customerManagedFields065(row,existing=null){
  const fields={
    externalAccountId:canonicalAccountId0731(row.accountId),
    name:row.name||"Unnamed Site",
    street:row.street,
    city:row.city,
    state:row.state,
    zip:row.zip,
    sitePhone:row.sitePhone,
    devicePhone:row.devicePhone,
    deviceType:row.deviceType,
    siteId1:row.siteId1,
    siteId2:row.siteId2,
    siteLanguage:row.siteLanguage,
    devicePhoneComment:row.devicePhoneComment,
    sourceGroupNumber:row.sourceGroupNumber,
    importSource:"Customer CSV"
  };
  const pair=rowCoordinatePair065(row);
  if(pair){
    const existingPair=siteCoordinatePair065(existing);
    const sameExisting=existingPair && existingPair.lat===pair.lat && existingPair.lng===pair.lng;
    fields.gps={
      ...(sameExisting&&existing?.gps?existing.gps:{}),lat:pair.lat,lng:pair.lng,
      accuracy:Number(existing?.gps?.accuracy||0),
      capturedAt:(sameExisting&&existing?.gps?.capturedAt)||row.geocodedAt||new Date().toISOString(),
      source:row.coordinateSource||"US Census Geocoder",
      matchedAddress:row.matchedAddress||"",
      benchmark:row.geocodeBenchmark||""
    };
    fields.geocodeStatus=row.geocodeStatus||"matched";
    fields.geocodeSource=row.coordinateSource||"US Census Geocoder";
    fields.geocodeMatchedAddress=row.matchedAddress||"";
    fields.geocodedAt=row.geocodedAt||fields.gps.capturedAt;
  }
  return fields;
}
function gpsManagedChanged065(existingGps,nextGps){
  const a=siteCoordinatePair065({gps:existingGps}),b=siteCoordinatePair065({gps:nextGps});
  if(!a&&!b) return false;
  if(!a||!b) return true;
  return a.lat!==b.lat || a.lng!==b.lng || cleanImportValue065(existingGps?.source)!==cleanImportValue065(nextGps?.source) || cleanImportValue065(existingGps?.matchedAddress)!==cleanImportValue065(nextGps?.matchedAddress);
}
function managedFieldsChanged065(site,row){
  const next=customerManagedFields065(row,site);
  const metadataOnly=new Set(["geocodedAt","geocodeStatus","geocodeSource","geocodeMatchedAddress"]);
  return Object.keys(next).some(key=>metadataOnly.has(key)?false:key==="gps"?gpsManagedChanged065(site?.gps,next.gps):cleanImportValue065(site?.[key])!==cleanImportValue065(next[key]));
}
function analyzeCustomerImport065(parsed,fileName="Customers.csv"){
  const idCounts=new Map(), nameCounts=new Map(), addressCounts=new Map();
  parsed.rows.forEach(r=>{
    const id=canonicalAccountId0731(r.accountId), name=r.name.toLowerCase(), addr=normalizedAddressKey065(r).toLowerCase();
    if(id) idCounts.set(id,(idCounts.get(id)||0)+1);
    if(name) nameCounts.set(name,(nameCounts.get(name)||0)+1);
    if(addr.replace(/\|/g,"")) addressCounts.set(addr,(addressCounts.get(addr)||0)+1);
  });
  const existingById=new Map();
  (data.sites||[]).forEach(site=>{
    const key=canonicalAccountId0731(site.externalAccountId);
    if(!key) return;
    const list=existingById.get(key)||[]; list.push(site); existingById.set(key,list);
  });
  const rows=parsed.rows.map(row=>{
    const issues=[], notices=[];
    const id=canonicalAccountId0731(row.accountId);
    row.accountId=id;
    const addrKey=normalizedAddressKey065(row).toLowerCase();
    if(!row.accountId) issues.push("Missing Account Id");
    if(!row.name) issues.push("Missing Account Name");
    if(!row.street || row.street.toLowerCase()==="new" || !row.city || !row.state || !row.zip) issues.push("Incomplete or placeholder address");
    const phoneDigits=importDigits065(row.devicePhone);
    if(row.devicePhone && (/e\+?/i.test(row.devicePhone) || ![7,10,11].includes(phoneDigits.length))) issues.push("Device Phone has an unusual value");
    if((idCounts.get(id)||0)>1) issues.push(`Duplicate Account Id in file (${idCounts.get(id)})`);
    if((existingById.get(id)||[]).length>1) issues.push("Multiple FireVault sites already use this Account Id");
    const sameAddressCount=addressCounts.get(addrKey)||0;
    if(sameAddressCount>1){
      notices.push(`Multiple building accounts at this address (${sameAddressCount}) — each unique Account ID imports separately`);
      if(isClssBuildingAccount0731(id)) notices.push(`CLSS building suffix preserved: ${id}`);
    }
    if((nameCounts.get(row.name.toLowerCase())||0)>1) notices.push(`Repeated account name (${nameCounts.get(row.name.toLowerCase())} records) — Account ID remains the identity key`);
    const existing=(existingById.get(id)||[])[0]||null;
    const rowPair=rowCoordinatePair065(row),existingPair=siteCoordinatePair065(existing);
    const coordinateStatus=rowPair?(row.coordinateSource==="Customer CSV"?"provided":"matched"):(existingPair?"existing":(row.geocodeStatus==="no-match"?"no-match":row.geocodeStatus==="error"?"error":addressCanGeocode065(row)?"needed":"unavailable"));
    if(!rowPair&&!existingPair&&addressCanGeocode065(row)) notices.push("Coordinates not calculated yet");
    if(row.geocodeStatus==="no-match") notices.push("No Census address match");
    if(row.geocodeStatus==="error") notices.push("Coordinate lookup error");
    let action="new";
    if(!row.accountId || !row.name || (idCounts.get(id)||0)>1 || (existingById.get(id)||[]).length>1) action="skip";
    else if(existing) action=managedFieldsChanged065(existing,row)?"update":"unchanged";
    return {...row,issues,notices,flagged:issues.length>0,action,existingId:existing?.id||"",existingCoordinates:existingPair,coordinateStatus,sameAddressCount};
  });
  const summary={total:rows.length,new:0,update:0,unchanged:0,review:0,skip:0,ready:0,coordinatesReady:0,needsCoordinates:0,geocodeFailed:0,coordinatesUnavailable:0,sharedAddressGroups:[...addressCounts.values()].filter(n=>n>1).length,repeatedNameGroups:[...nameCounts.values()].filter(n=>n>1).length};
  rows.forEach(r=>{
    summary[r.action]=(summary[r.action]||0)+1;
    if(r.flagged) summary.review++; else if(r.action!=="skip") summary.ready++;
    if(["provided","matched","existing"].includes(r.coordinateStatus)) summary.coordinatesReady++;
    else if(r.coordinateStatus==="needed") summary.needsCoordinates++;
    else if(["no-match","error"].includes(r.coordinateStatus)) summary.geocodeFailed++;
    else summary.coordinatesUnavailable++;
  });
  return {fileName,headers:parsed.headers,rows,summary,parsedAt:new Date().toISOString()};
}
function importRowsForReanalysis065(){
  return (customerImportState065.rows||[]).map(r=>({
    accountId:r.accountId,name:r.name,siteId1:r.siteId1,siteId2:r.siteId2,siteLanguage:r.siteLanguage,deviceType:r.deviceType,sitePhone:r.sitePhone,devicePhone:r.devicePhone,devicePhoneComment:r.devicePhoneComment,street:r.street,city:r.city,state:r.state,zip:r.zip,sourceGroupNumber:r.sourceGroupNumber,sourceRow:r.sourceRow,
    latitude:r.latitude,longitude:r.longitude,coordinateSource:r.coordinateSource,geocodeStatus:r.geocodeStatus,geocodedAt:r.geocodedAt,matchedAddress:r.matchedAddress,geocodeBenchmark:r.geocodeBenchmark
  }));
}
function reanalyzeCustomerImport065(extra={}){
  const parsed={headers:customerImportState065.headers,rows:importRowsForReanalysis065()};
  const refreshed=analyzeCustomerImport065(parsed,customerImportState065.fileName||"Customers.csv");
  customerImportState065={...customerImportState065,...refreshed,...extra};
}
function loadCustomerCsv065(file){
  if(!file) return;
  customerGeocodeRunToken0651++;
  const reader=new FileReader();
  reader.onload=()=>{
    try{
      const parsed=parseCsvText065(reader.result);
      const cache=loadGeocodeCache0651();
      parsed.rows.forEach(row=>{
        if(rowCoordinatePair065(row)) return;
        const cached=cache[normalizedAddressKey065(row)];
        if(cached?.lat!==undefined&&cached?.lng!==undefined){
          row.latitude=cached.lat; row.longitude=cached.lng; row.coordinateSource=cached.source||"US Census Geocoder"; row.geocodeStatus="matched"; row.geocodedAt=cached.at||""; row.matchedAddress=cached.matchedAddress||""; row.geocodeBenchmark=cached.benchmark||"Public_AR_Current";
        }
      });
      const analysis=analyzeCustomerImport065(parsed,file.name||"Customers.csv");
      customerImportState065={...customerImportState065,...analysis,error:"",includeFlagged:false,requireCoordinates:true,filter:"all",lastResult:null,geocoding:{active:false,total:0,complete:0,matched:0,noMatch:0,error:0},geocodeError:""};
      settings(); toast(`${analysis.summary.total} customer records ready for review.`);
    }catch(err){ customerImportState065={fileName:file.name||"",headers:[],rows:[],summary:null,error:err?.message||"CSV parsing failed.",includeFlagged:false,requireCoordinates:true,filter:"all",lastResult:null,geocoding:{active:false,total:0,complete:0,matched:0,noMatch:0,error:0},geocodeError:""}; settings(); }
  };
  reader.onerror=()=>{ customerImportState065.error="The CSV file could not be read."; settings(); };
  reader.readAsText(file);
}
function rowCoordinatesReady065(row){ return !!(rowCoordinatePair065(row)||row.existingCoordinates); }
function selectedCustomerImportRows065(){
  return (customerImportState065.rows||[]).filter(r=>r.action!=="skip" && r.action!=="unchanged" && (!r.flagged || customerImportState065.includeFlagged) && (!customerImportState065.requireCoordinates || rowCoordinatesReady065(r)));
}
function customerImportFilterRows065(){
  const filter=customerImportState065.filter||"all";
  const rows=customerImportState065.rows||[];
  if(filter==="review") return rows.filter(r=>r.flagged);
  if(filter==="new") return rows.filter(r=>r.action==="new");
  if(filter==="update") return rows.filter(r=>r.action==="update");
  if(filter==="unchanged") return rows.filter(r=>r.action==="unchanged");
  if(filter==="coordinates") return rows.filter(r=>!rowCoordinatesReady065(r));
  return rows;
}
function customerImportStatus065(row){
  if(row.action==="skip") return ["Skipped","skip"];
  if(row.flagged) return ["Review","review"];
  if(row.action==="update") return ["Update","update"];
  if(row.action==="unchanged") return ["No change","same"];
  return ["New","new"];
}
function coordinateLabel065(row){
  if(row.coordinateStatus==="provided") return ["CSV coordinates","ready"];
  if(row.coordinateStatus==="matched") return ["Coordinates ready","ready"];
  if(row.coordinateStatus==="existing") return ["Existing GPS","existing"];
  if(row.coordinateStatus==="no-match") return ["No match","failed"];
  if(row.coordinateStatus==="error") return ["Lookup error","failed"];
  if(row.coordinateStatus==="unavailable") return ["Address required","failed"];
  return ["Needs coordinates","needed"];
}
function geocodeProgressText065(){
  const geo=customerImportState065.geocoding||{};
  if(!geo.total) return "";
  return `${Number(geo.complete||0)} of ${Number(geo.total||0)} unique addresses checked · ${Number(geo.matched||0)} matched · ${Number(geo.noMatch||0)} no match · ${Number(geo.error||0)} errors`;
}
function customerImportPanel065(){
  const state=customerImportState065, summary=state.summary;
  const filtered=customerImportFilterRows065();
  const shown=filtered.slice(0,120);
  const selectedCount=selectedCustomerImportRows065().length;
  const last=data.syncState?.lastCustomerCsvImport;
  const geo=state.geocoding||{};
  const geocodeEligible=summary?state.rows.filter(r=>!rowCoordinatesReady065(r)&&addressCanGeocode065(r)&&r.action!=="skip").length:0;
  const progress=geo.total?Math.round((Number(geo.complete||0)/Math.max(1,Number(geo.total||0)))*100):0;
  return `<div class="settingsStack settingsStack540 customerImportStack065">
    ${settingsSection540("Customer database","Customer CSV Import","Import customer and monitoring-account information without replacing visits, photos, notes, tasks, or deficiencies.",`
      <div class="customerImportHero065">
        <div><strong>${(data.sites||[]).length}</strong><span>sites currently in FireVault</span></div>
        <label class="primary customerFileButton065">Choose Customer CSV<input id="customerCsvFile065" type="file" accept=".csv,text/csv" hidden></label>
      </div>
      <div class="settingsInfo540"><strong>Building-safe Account ID matching</strong><span>FireVault never merges customer records because they share an address or name. The complete Account ID is the identity key, so IDs such as G7C1234-01 and G7C1234-02 import as separate buildings.</span></div>
      ${last?`<div class="customerLastImport065"><strong>Last import</strong><span>${esc(new Date(last.at).toLocaleString())} · ${esc(last.fileName||"Customer CSV")}</span><em>${Number(last.added||0)} added · ${Number(last.updated||0)} updated · ${Number(last.geocoded||0)} with calculated coordinates</em></div>`:""}
    `,"blue")}
    ${state.error?settingsSection540("File problem","CSV could not be prepared","Correct the file and choose it again.",`<div class="customerImportError065">${esc(state.error)}</div>`,"red"):""}
    ${summary?settingsSection540("Address coordinates","Calculate Latitude and Longitude",`${summary.coordinatesReady} of ${summary.total} records already have usable coordinates.`,`
      <div class="geocodeMetrics0651"><div class="ready"><strong>${summary.coordinatesReady}</strong><span>Coordinates ready</span></div><div class="needed"><strong>${summary.needsCoordinates}</strong><span>Need lookup</span></div><div class="failed"><strong>${summary.geocodeFailed+summary.coordinatesUnavailable}</strong><span>Need review</span></div></div>
      <div class="geocodeNotice0651"><strong>Online address calculation</strong><span>FireVault sends only the street address, city, state, and ZIP to the U.S. Census Geocoder. Results are calculated along an address range and may not represent the exact building entrance.</span></div>
      ${geo.active||geo.total?`<div class="geocodeProgress0651"><div><span style="width:${progress}%"></span></div><p id="customerGeocodeProgressText0651">${esc(geocodeProgressText065())}</p></div>`:""}
      ${state.geocodeError?`<div class="customerImportError065">${esc(state.geocodeError)}</div>`:""}
      <div class="geocodeActions0651"><button class="primary" id="calculateCoordinates0651" ${geo.active||!geocodeEligible?"disabled":""}>${geo.active?"Calculating…":`Calculate ${geocodeEligible} Address${geocodeEligible===1?"":"es"}`}</button>${geo.active?`<button class="danger" id="stopCoordinates0651">Stop</button>`:""}</div>
      <p class="fieldNote">Coordinates already present in a CSV are used directly. Existing manually captured site GPS is preserved. Failed matches stay visible for correction or manual GPS capture.</p>
    `,"cyan"):""}
    ${summary?settingsSection540("Import preview",state.fileName||"Customer CSV",`${summary.total} rows were read. Calculate coordinates and review flagged records before importing them.`,`
      <div class="customerImportMetrics065">
        <div><strong>${summary.total}</strong><span>Rows</span></div><div class="new"><strong>${summary.new}</strong><span>New</span></div><div class="update"><strong>${summary.update}</strong><span>Updates</span></div><div class="review"><strong>${summary.review}</strong><span>Review</span></div><div><strong>${summary.unchanged}</strong><span>No change</span></div>
      </div>
      ${summary.sharedAddressGroups?`<div class="settingsInfo540"><strong>${summary.sharedAddressGroups} multi-building address group${summary.sharedAddressGroups===1?"":"s"} detected</strong><span>These rows will remain separate. FireVault matches only the complete Account ID and does not combine records by street address, name, or shared GPS coordinates.</span></div>`:""}
      <div class="customerImportChecks065"><label><input id="requireCoordinates0651" type="checkbox" ${state.requireCoordinates!==false?"checked":""}><span><strong>Require coordinates before import</strong><small>Recommended. Records without calculated or existing GPS coordinates remain in the preview instead of being imported.</small></span></label><label><input id="includeFlagged065" type="checkbox" ${state.includeFlagged?"checked":""}><span><strong>Include flagged records</strong><small>Leave off to import only records that passed validation. Flagged rows remain available for a later corrected import.</small></span></label></div>
      <div class="customerImportActions065"><button class="primary" id="runCustomerImport065" ${selectedCount||geo.active?geo.active?"disabled":"":"disabled"}>Import ${selectedCount} Record${selectedCount===1?"":"s"}</button><button class="ghost" id="clearCustomerImport065" ${geo.active?"disabled":""}>Clear Preview</button></div>
      <p class="fieldNote">The importer preserves FireVault-created history and adds changed records to the pending synchronization queue. Same-address buildings remain separate as long as their complete Account IDs are different.</p>
    `,"green"):""}
    ${state.lastResult?settingsSection540("Import complete","Customer records saved","The local database and synchronization queue were updated.",`<div class="customerImportResult065"><div><strong>${state.lastResult.added}</strong><span>Added</span></div><div><strong>${state.lastResult.updated}</strong><span>Updated</span></div><div><strong>${state.lastResult.geocoded||0}</strong><span>Coordinates</span></div><div><strong>${state.lastResult.skipped}</strong><span>Skipped</span></div></div><button class="ghost" id="openImportedSites065">Open Customer Database</button>`,"violet"):""}
    ${summary?settingsSection540("Row review","Customer records","Use the filters to inspect new, changed, unchanged, questionable, or ungeocoded rows before importing.",`
      <div class="customerImportFilters065">${[["all",`All ${summary.total}`],["new",`New ${summary.new}`],["update",`Updates ${summary.update}`],["review",`Review ${summary.review}`],["coordinates",`No GPS ${summary.total-summary.coordinatesReady}`],["unchanged",`No change ${summary.unchanged}`]].map(([key,label])=>`<button class="ghost ${state.filter===key?"active":""}" data-customer-import-filter="${key}">${label}</button>`).join("")}</div>
      <div class="customerImportRows065">${shown.length?shown.map(row=>{const [label,cls]=customerImportStatus065(row);const [geoLabel,geoClass]=coordinateLabel065(row);const pair=rowCoordinatePair065(row)||row.existingCoordinates;return `<article class="customerImportRow065 ${cls}"><span class="customerImportState065">${label}</span><div><strong>${esc(row.name||"Unnamed account")}</strong><small>${esc(row.accountId||"No Account Id")} · ${esc([row.street,row.city,row.state,row.zip].filter(Boolean).join(", ")||"No complete address")}</small><span class="coordinateState0651 ${geoClass}">${esc(geoLabel)}${pair?` · ${pair.lat.toFixed(6)}, ${pair.lng.toFixed(6)}`:""}</span>${row.matchedAddress?`<small class="coordinateMatch0651">Matched: ${esc(row.matchedAddress)}</small>`:""}${row.deviceType||row.devicePhone?`<em>${esc([row.deviceType,row.devicePhone].filter(Boolean).join(" · "))}</em>`:""}${row.issues.length?`<p>${row.issues.map(esc).join(" · ")}</p>`:""}${row.notices.length?`<p class="notice">${row.notices.map(esc).join(" · ")}</p>`:""}</div><b>Row ${row.sourceRow}</b></article>`}).join(""):`<div class="syncEmpty063"><strong>No matching rows</strong><span>Choose another preview filter.</span></div>`}</div>
      ${filtered.length>shown.length?`<p class="fieldNote">Showing the first ${shown.length} of ${filtered.length} matching rows.</p>`:""}
    `,"slate"):""}
  </div>`;
}
function censusGeocodeJsonp0651(row){
  return new Promise((resolve,reject)=>{
    const callback=`__firevaultCensus_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    const script=document.createElement("script");
    let finished=false;
    const cleanup=()=>{ if(finished) return; finished=true; clearTimeout(timer); try{delete window[callback];}catch{window[callback]=undefined;} script.remove(); };
    const timer=setTimeout(()=>{cleanup(); reject(new Error("Coordinate lookup timed out."));},25000);
    window[callback]=payload=>{
      const match=payload?.result?.addressMatches?.[0];
      if(match?.coordinates && Number.isFinite(Number(match.coordinates.y)) && Number.isFinite(Number(match.coordinates.x))){
        const result={lat:Number(Number(match.coordinates.y).toFixed(6)),lng:Number(Number(match.coordinates.x).toFixed(6)),matchedAddress:match.matchedAddress||"",source:"US Census Geocoder",benchmark:payload?.result?.input?.benchmark?.benchmarkName||"Public_AR_Current",at:new Date().toISOString()};
        cleanup(); resolve(result);
      }else{ cleanup(); resolve(null); }
    };
    script.onerror=()=>{cleanup(); reject(new Error("The coordinate service could not be reached."));};
    const params=new URLSearchParams({street:row.street,city:row.city,state:row.state,zip:row.zip,benchmark:"Public_AR_Current",format:"jsonp",callback});
    script.src=`https://geocoding.geo.census.gov/geocoder/locations/address?${params.toString()}`;
    script.async=true;
    document.head.appendChild(script);
  });
}
function updateCustomerGeocodeProgressDom0651(){
  const text=document.getElementById("customerGeocodeProgressText0651"); if(text) text.textContent=geocodeProgressText065();
  const bar=document.querySelector(".geocodeProgress0651>div>span"); const geo=customerImportState065.geocoding||{}; if(bar) bar.style.width=`${Math.round((Number(geo.complete||0)/Math.max(1,Number(geo.total||0)))*100)}%`;
}
async function calculateCustomerCoordinates0651(){
  if(customerImportState065.geocoding?.active) return;
  const candidates=(customerImportState065.rows||[]).filter(r=>!rowCoordinatesReady065(r)&&addressCanGeocode065(r)&&r.action!=="skip");
  if(!candidates.length){toast("No addresses need coordinate calculation.");return;}
  const groups=new Map();
  candidates.forEach(row=>{const key=normalizedAddressKey065(row);const rows=groups.get(key)||[];rows.push(row);groups.set(key,rows);});
  const tasks=[...groups.entries()].map(([key,rows])=>({key,rows,representative:rows[0]}));
  const token=++customerGeocodeRunToken0651;
  customerImportState065.geocoding={active:true,total:tasks.length,complete:0,matched:0,noMatch:0,error:0,startedAt:new Date().toISOString()};
  customerImportState065.geocodeError="";
  settings();
  const cache=loadGeocodeCache0651();
  let cursor=0;
  const worker=async()=>{
    while(token===customerGeocodeRunToken0651){
      const index=cursor++; if(index>=tasks.length) return;
      const task=tasks[index]; let result=cache[task.key]||null; let status="matched";
      try{
        if(!result) result=await censusGeocodeJsonp0651(task.representative);
        if(token!==customerGeocodeRunToken0651) return;
        if(result){
          cache[task.key]=result;
          task.rows.forEach(row=>{row.latitude=result.lat;row.longitude=result.lng;row.coordinateSource=result.source;row.geocodeStatus="matched";row.geocodedAt=result.at;row.matchedAddress=result.matchedAddress;row.geocodeBenchmark=result.benchmark;});
          customerImportState065.geocoding.matched++;
        }else{
          status="no-match"; task.rows.forEach(row=>{row.geocodeStatus="no-match";}); customerImportState065.geocoding.noMatch++;
        }
      }catch(err){
        status="error"; task.rows.forEach(row=>{row.geocodeStatus="error";}); customerImportState065.geocoding.error++;
        customerImportState065.geocodeError="Some addresses could not be checked. You can run coordinate calculation again to retry them.";
      }
      customerImportState065.geocoding.complete++;
      if(status==="matched" && customerImportState065.geocoding.complete%10===0) saveGeocodeCache0651(cache);
      updateCustomerGeocodeProgressDom0651();
      await new Promise(resolve=>setTimeout(resolve,120));
    }
  };
  await Promise.all([worker(),worker(),worker()]);
  saveGeocodeCache0651(cache);
  if(token!==customerGeocodeRunToken0651) return;
  const finalGeo={...customerImportState065.geocoding,active:false,finishedAt:new Date().toISOString()};
  reanalyzeCustomerImport065({geocoding:finalGeo});
  settings();
  toast(`${finalGeo.matched} addresses matched. ${finalGeo.noMatch+finalGeo.error} need review.`);
}
function stopCustomerCoordinates0651(){
  customerGeocodeRunToken0651++;
  customerImportState065.geocoding={...(customerImportState065.geocoding||{}),active:false,stopped:true};
  reanalyzeCustomerImport065({geocoding:customerImportState065.geocoding});
  settings(); toast("Coordinate calculation stopped. Completed matches were kept.");
}
function performCustomerImport065(){
  const selected=selectedCustomerImportRows065();
  if(!selected.length){ toast(customerImportState065.requireCoordinates?"No new or changed records with coordinates are selected.":"No new or changed records are selected."); return; }
  if(!confirm(`Import ${selected.length} customer record${selected.length===1?"":"s"}? Existing FireVault notes, photos, visits, tasks, and deficiencies will be preserved. Same-address buildings will remain separate by complete Account ID.`)) return;
  const existingById=new Map((data.sites||[]).filter(s=>s.externalAccountId).map(s=>[canonicalAccountId0731(s.externalAccountId),s]));
  const now=new Date().toISOString();
  const stats={added:0,updated:0,unchanged:customerImportState065.summary?.unchanged||0,skipped:(customerImportState065.rows||[]).filter(r=>r.action==="skip" || (r.flagged&&!customerImportState065.includeFlagged) || (customerImportState065.requireCoordinates&&!rowCoordinatesReady065(r))).length,flagged:selected.filter(r=>r.flagged).length,geocoded:selected.filter(r=>!!rowCoordinatePair065(r)).length};
  selected.forEach(row=>{
    const key=canonicalAccountId0731(row.accountId);
    row.accountId=key;
    const existing=existingById.get(key);
    const fields=customerManagedFields065(row,existing);
    if(existing){
      if(managedFieldsChanged065(existing,row)){
        Object.assign(existing,fields);
        existing.importMetadata={source:"Customer CSV",fileName:customerImportState065.fileName||"Customers.csv",sourceRow:row.sourceRow,lastImportedAt:now};
        stats.updated++;
      }else stats.unchanged++;
    }else{
      const created=ensureSite({...fields,id:uid(),createdAt:now,importMetadata:{source:"Customer CSV",fileName:customerImportState065.fileName||"Customers.csv",sourceRow:row.sourceRow,lastImportedAt:now}});
      data.sites.push(created); existingById.set(key,created); stats.added++;
    }
  });
  recordSyncActivity(data,"customer-csv-import",{fileName:customerImportState065.fileName||"Customers.csv",workspace:data.settings?.sync?.workspace||"FireVault Shared Vault",stats:{...stats}});
  data.syncState={...(data.syncState||{}),lastCustomerCsvImport:{at:now,fileName:customerImportState065.fileName||"Customers.csv",...stats}};
  saveData(data); data=loadData();
  reanalyzeCustomerImport065({lastResult:stats,error:""});
  settings(); toast(`${stats.added} added and ${stats.updated} updated with ${stats.geocoded} calculated coordinate records.`);
}
function wireCustomerImport065(){
  const file=document.getElementById("customerCsvFile065"); if(file) file.onchange=e=>loadCustomerCsv065(e.target.files?.[0]);
  const requireCoordinates=document.getElementById("requireCoordinates0651"); if(requireCoordinates) requireCoordinates.onchange=()=>{customerImportState065.requireCoordinates=requireCoordinates.checked; settings();};
  const include=document.getElementById("includeFlagged065"); if(include) include.onchange=()=>{customerImportState065.includeFlagged=include.checked; settings();};
  const calculate=document.getElementById("calculateCoordinates0651"); if(calculate) calculate.onclick=calculateCustomerCoordinates0651;
  const stop=document.getElementById("stopCoordinates0651"); if(stop) stop.onclick=stopCustomerCoordinates0651;
  const run=document.getElementById("runCustomerImport065"); if(run) run.onclick=performCustomerImport065;
  const clear=document.getElementById("clearCustomerImport065"); if(clear) clear.onclick=()=>{customerGeocodeRunToken0651++;customerImportState065={fileName:"",headers:[],rows:[],summary:null,error:"",includeFlagged:false,requireCoordinates:true,filter:"all",lastResult:null,geocoding:{active:false,total:0,complete:0,matched:0,noMatch:0,error:0},geocodeError:""}; settings();};
  document.querySelectorAll("[data-customer-import-filter]").forEach(btn=>btn.onclick=()=>{customerImportState065.filter=btn.dataset.customerImportFilter; settings();});
  const open=document.getElementById("openImportedSites065"); if(open) open.onclick=()=>{mode=null;route("sites");};
}
function importedAccountCard065(s={}){
  if(!s.externalAccountId && !s.deviceType && !s.sitePhone && !s.devicePhone) return "";
  const gps=siteCoordinatePair065(s);
  const items=[["Account ID",s.externalAccountId],["Site Phone",s.sitePhone],["Device Type",s.deviceType],["Device Phone",s.devicePhone],["Site ID 1",s.siteId1],["Site ID 2",s.siteId2],["Language",s.siteLanguage],["Source Group",s.sourceGroupNumber],["Latitude",gps?.lat?.toFixed(6)],["Longitude",gps?.lng?.toFixed(6)],["Coordinate Source",s.geocodeSource||s.gps?.source]].filter(x=>x[1]!==undefined&&x[1]!==null&&x[1]!=="");
  return `<div class="card importedAccountCard065"><div class="siteCardHead477"><div><h2>Monitoring Account</h2><p>Imported customer, communicator, and coordinate information.</p></div><span class="pill">CSV</span></div><div class="importedAccountGrid065">${items.map(([label,value])=>`<div><strong>${esc(label)}</strong><span>${esc(value)}</span></div>`).join("")}</div>${s.geocodeMatchedAddress?`<p class="fieldNote">Matched address: ${esc(s.geocodeMatchedAddress)}</p>`:""}${s.devicePhoneComment?`<p class="fieldNote">${esc(s.devicePhoneComment)}</p>`:""}</div>`;
}



const SETTINGS_GROUPS_067 = [
  {key:"profile",icon:"👤",title:"Profile & Organization",note:"Technician identity and company details.",tone:"blue",tabs:["tech"]},
  {key:"appearance",icon:"◐",title:"App & Home",note:"Demo Mode, theme, Home layout, and visible modules.",tone:"violet",tabs:["demo","themes","homeLayout","visibility"]},
  {key:"field",icon:"🧰",title:"Field Tools",note:"GPS, photo overlays, and optional field services.",tone:"cyan",tabs:["gps","overlay","advanced"]},
  {key:"reports",icon:"▤",title:"Reports & Communication",note:"Report content, email delivery, and customer closeout.",tone:"amber",tabs:["reports","email"]},
  {key:"data",icon:"☁",title:"Data, Sync & Support",note:"Categories, imports, backup, team sync, Help, About, and diagnostics.",tone:"red",tabs:["sync","customerImport","categories","backup","updates","manual","about","diagnostics"]}
];
function settingsGroupForTab067(tab){ return SETTINGS_GROUPS_067.find(g=>g.tabs.includes(tab))?.key || "data"; }
function settingsGroup067ByKey(key){ return SETTINGS_GROUPS_067.find(g=>g.key===key) || SETTINGS_GROUPS_067[0]; }
function openSettingsGroup067(key){ settingsGroup067=key||"profile"; mode=null; view="settings"; render(); }
function settingsGroupSummary067(group,tabs){
  const labels=group.tabs.filter(x=>x!=="diagnostics").map(id=>tabs.find(t=>t[0]===id)?.[1]).filter(Boolean);
  if(group.tabs.includes("diagnostics")) labels.push("Diagnostics");
  return labels.slice(0,4).join(" • ") + (labels.length>4?` • +${labels.length-4}`:"");
}

function settingsTabs(){
  return [
    ["tech","Technician","Name, company, phone, email, and license information used in reports."],
    ["gps","GPS / Maps","Location capture, map provider, nearby radius, and GPS report visibility."],
    ["reports","Reports","Default report title, format, and included report sections."],
    ["email","Email","Default recipients, subject template, signature template, and tag tools."],
    ["overlay","Photo Overlay","Photo stamp preview, template fields, alignment, colors, and logo visibility."],
    ["demo","Demo Mode","Use a separate fictional Boise account database to demonstrate FireVault without showing real customer information."],
    ["themes","Theme","Theme presets, accent color, 3D controls, text size, and haptics."],
    ["homeLayout","Home Layout","Choose which optional Home cards appear and how they open."],
    ["visibility","Modules","Enable or disable FireVault modules for a cleaner field interface."],
    ["advanced","Advanced","Optional integrations and field services. An asterisk marks controls that require an outside service."],
    ["sync","Team Sync","Technician identity, shared-vault packages, pending changes, and conflict review."],
    ["customerImport","Customer Import","Preview and safely import customer records from a CSV export using Account Id."],
    ["categories","Categories","Create rule-driven account tags. Multiple categories can be assigned to the same account."],
    ["backup","Backup","Export, import, data safety snapshot, restore tools, and danger zone."],
    ["updates","App Updates","Check for a new build, clear cached app files, and reload FireVault."],
    ["manual","Help & Manual","Searchable instructions for using FireVault, field workflows, settings, reports, photos, GPS, and troubleshooting."],
    ["about","About","Installed version, local storage details, and application information."]
  ];
}
function settingsTabLabel0736(key){
  return ({profile:"General",appearance:"App",field:"Field",reports:"Reports",data:"Data"})[key]||"Settings";
}
function settingsTopTabs0736(activeKey){
  return `<div class="settingsTopTabs0736" role="tablist" aria-label="Settings categories">${SETTINGS_GROUPS_067.map(g=>`<button role="tab" aria-selected="${g.key===activeKey?'true':'false'}" class="${g.key===activeKey?'active':''}" data-settings-top-tab0736="${g.key}"><span>${g.icon}</span><b>${esc(settingsTabLabel0736(g.key))}</b></button>`).join("")}</div>`;
}
function wireSettingsTopTabs0736(){
  document.querySelectorAll("[data-settings-top-tab0736]").forEach(btn=>btn.onclick=()=>{settingsGroup067=btn.dataset.settingsTopTab0736||"profile";mode=null;render();});
}
function settingsGroupItems0736(group,tabs){
  return group.tabs.map(id=>id==="diagnostics"?["diagnostics","Diagnostics","Check build, storage, GPS, database, and module health."]:tabs.find(t=>t[0]===id)).filter(Boolean);
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
  settingsGroup067=settingsGroup067||"profile";
  mode=null;
  view="settings";
  restoreAppChrome572();
  render();
}
function leaveSettingsHome572(){
  settingsGroup067="";
  mode=null;
  settingsTab="tech";
  route("home");
}

function settingsIcon550(tab){
  return ({tech:"👤",gps:"⌖",reports:"▤",email:"✉",overlay:"▧",demo:"D",themes:"◐",homeLayout:"⌂",visibility:"☰",advanced:"⚡",sync:"☁",customerImport:"⇩",categories:"◇",backup:"⇅",updates:"↻",manual:"?",about:"ⓘ"})[tab]||"•";
}
function settings(){
  captureSettingsScroll576();
  restoreAppChrome572();
  const tabs=settingsTabs();
  const active=tabs.find(t=>t[0]===settingsTab)||tabs[0];
  const inDetail=mode==="settingsDetail";
  settingsGroup067=settingsGroup067||settingsGroupForTab067(settingsTab)||"profile";
  const group=settingsGroup067ByKey(settingsGroup067);

  if(!inDetail){
    const groupItems=settingsGroupItems0736(group,tabs);
    html(`<div class="screen settingsTabsPage0736 settingsStable573 tone-${group.tone}">
      <header class="settingsTabsHeader0736">
        <div><span>FireVault preferences</span><h1>Settings</h1><p>Choose a tab, then open the setting you need.</p></div>
        <button class="ghost" id="settingsHomeBtn572">Done</button>
      </header>
      ${settingsTopTabs0736(group.key)}
      <section class="settingsTabSummary0736"><span>${group.icon}</span><div><strong>${esc(group.title)}</strong><p>${esc(group.note)}</p></div></section>
      <div class="settingsTabItems0736 grow">
        ${groupItems.map(t=>`<button class="settingsTabItem0736" ${t[0]==="diagnostics"?'data-settings-route067="diagnostics"':`data-tab="${t[0]}"`}><span class="settingsItemIcon0736">${settingsIcon550(t[0])}</span><div><strong>${esc(t[1])}</strong><small>${esc(t[2])}</small></div><b>›</b></button>`).join("")}
      </div>
    </div>`);
    document.getElementById("settingsHomeBtn572")?.addEventListener("click",leaveSettingsHome572);
    wireSettingsTopTabs0736();
    document.querySelectorAll(".settingsTabItem0736[data-tab]").forEach(b=>b.onclick=()=>{settingsTab=b.dataset.tab;settingsGroup067=settingsGroupForTab067(settingsTab);if(settingsTab==="manual"){contextualHelpReturn060=null;manualView058="home";manualQuery058="";}mode="settingsDetail";render();});
    document.querySelectorAll("[data-settings-route067]").forEach(b=>b.onclick=()=>openSettingsSubmenu576(b.dataset.settingsRoute067));
    restoreSettingsScroll576(false);
    return;
  }

  settingsGroup067=settingsGroupForTab067(settingsTab);
  const detailGroup=settingsGroup067ByKey(settingsGroup067);
  const saveable=!['demo','customerImport','categories','backup','updates','manual','about'].includes(settingsTab);

  if(settingsTab==="manual"){
    html(`<div class="screen settingsTabbedDetail0736 settingsManualScreen067 settingsStable573">
      <header class="settingsDetailHeader0736">
        <button class="ghost" id="settingsManualBack067" aria-label="Back to Data settings">←</button>
        <div><span>${detailGroup.icon} ${esc(settingsTabLabel0736(detailGroup.key))}</span><h1>Help & Manual</h1></div>
        <button class="ghost" id="settingsManualHome067">Done</button>
      </header>
      ${settingsTopTabs0736(detailGroup.key)}
      <div class="settingsManualBody067 settingsDetailBody488 settingsTabbedBody0736">${manualPanel058()}</div>
    </div>`);
    document.getElementById("settingsManualBack067")?.addEventListener("click",()=>openSettingsGroup067("data"));
    document.getElementById("settingsManualHome067")?.addEventListener("click",leaveSettingsHome572);
    wireSettingsTopTabs0736();
    wireSettingsPanel();
    restoreSettingsScroll576(true);
    return;
  }

  html(`<div class="screen settingsTabbedDetail0736 settingsDetailScreen067 settingsScreen settingsStable573 settingsTab-${settingsTab}" data-settings-tab="${settingsTab}">
    <header class="settingsDetailHeader0736 tone-${detailGroup.tone}">
      <button class="ghost" id="settingsBackBtn" aria-label="Back to ${esc(settingsTabLabel0736(detailGroup.key))} settings">←</button>
      <div><span>${detailGroup.icon} ${esc(settingsTabLabel0736(detailGroup.key))}</span><h1>${esc(active[1])}</h1></div>
      <div class="settingsDetailActions0736">${saveable?`<button class="primary" id="saveSettingsTop">Save</button>`:`<button class="ghost" id="settingsDoneBtn">Done</button>`}</div>
    </header>
    ${settingsTopTabs0736(detailGroup.key)}
    <p class="settingsDetailNote0736">${esc(active[2])}</p>
    <div class="settingsDetailBody067 settingsDetailBody488 settingsContent448 settingsTabbedBody0736">${settingsPanel()}</div>
  </div>`);
  document.getElementById("settingsBackBtn")?.addEventListener("click",()=>openSettingsGroup067(detailGroup.key));
  document.getElementById("settingsDoneBtn")?.addEventListener("click",()=>openSettingsGroup067(detailGroup.key));
  document.getElementById("saveSettingsTop")?.addEventListener("click",saveSettings);
  wireSettingsTopTabs0736();
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
    `Storage key: ${demoStorageLabel0739()}`,
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
  const auto=autoBackupInfo();
  const autoLast=auto.last?.createdAt ? new Date(auto.last.createdAt).toLocaleString() : "No automatic snapshot yet";
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
    <div class="card compactPane autoBackupPane0722">
      <div class="paneHead"><div><h2>Automatic Safety Snapshots</h2><p class="paneNote">FireVault keeps up to 3 rolling snapshots before and after vault changes.</p></div><span class="pill">${auto.count} saved</span></div>
      <div class="settingsInfo540"><strong>Latest snapshot</strong><span>${esc(autoLast)}</span></div>
      <div class="backupActionGrid449">
        <button class="primary" id="downloadAutoBackup0722" ${auto.count?'':'disabled'}>Download Latest</button>
        <button class="ghost" id="restoreAutoBackup0722" ${auto.count?'':'disabled'}>Restore Latest</button>
      </div>
      <p class="fieldNote">Snapshots protect against accidental edits and failed migrations on this installation. A downloaded backup is still required before deleting or reinstalling the Home Screen app.</p>
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
  const renderedSubject=renderTemplate(subject || "", sample).trim() || "FireVault Report - Acme Fire Panel - Today";
  const signatureValue=renderTemplate(signature || "", sample);
  const renderedSig=signatureValue.trim() ? signatureValue : "FireVault Technician\nExample Fire Protection\n(307) 555-0100\ntech@example.com";
  return `<div class="emailPreviewLine"><strong>Subject</strong><span id="emailPreviewSubject">${esc(renderedSubject)}</span></div><div class="emailPreviewSignature" id="emailPreviewSignature">${esc(renderedSig).replaceAll("\n","<br>")}</div>`;
}
function emailSettingsPanel(email){
  return `<div class="settingsStack emailSettingsRedesign530 emailSettings540">
    <section class="card compactPane settingsSection530 emailEditor530 settingsSection540 tone-email">
      <div class="settingsSectionHead530">
        <div><span class="settingsEyebrow530">Outgoing reports</span><h2>Email Setup</h2><p>Set the defaults FireVault uses when you prepare a customer report email.</p></div>
        <button class="primary saveMini" id="saveSettings">Save Changes</button>
      </div>

      <div class="emailBlock530">
        <div class="emailBlockHead530"><span class="emailStep530">1</span><div><h3>Recipients</h3><p>Leave these blank when recipients change from job to job.</p></div></div>
        <div class="emailRowGrid530">
          <div class="emailControl530"><label for="emailTo">Default recipient</label><input id="emailTo" autocomplete="email" inputmode="email" placeholder="customer@example.com" value="${esc(email.defaultTo)}"></div>
          <div class="emailControl530"><label for="emailCc">Default CC</label><input id="emailCc" autocomplete="email" inputmode="email" placeholder="office@example.com" value="${esc(email.cc)}"></div>
        </div>
      </div>

      <div class="emailBlock530">
        <div class="emailBlockHead530"><span class="emailStep530">2</span><div><h3>Subject line</h3><p>Tap the subject field, then insert tags where you want account information to appear.</p></div></div>
        <div class="emailControl530"><label for="emailSubject">Subject template</label><input id="emailSubject" class="templateInput" value="${esc(email.defaultSubject)}" placeholder="FireVault Report - {site_name} - {date}"></div>
      </div>

      <div class="emailBlock530">
        <div class="emailBlockHead530"><span class="emailStep530">3</span><div><h3>Signature</h3><p>This appears at the bottom of the prepared email.</p></div></div>
        <div class="emailControl530"><label for="emailSig">Signature template</label><textarea id="emailSig" class="emailSignatureTextarea" placeholder="{technician}\n{company}\n{phone}\n{email}">${esc(email.signature)}</textarea></div>
      </div>

      <div class="emailBlock530 emailTagsBlock530">
        <div class="emailBlockHead530"><span class="emailStep530">+</span><div><h3>Insert information</h3><p>Choose a tag to insert it into the active subject or signature field.</p></div></div>
        <div class="emailTagGrid530">${emailTagButtons()}</div>
      </div>
    </section>

    <aside class="card compactPane settingsSection530 emailPreviewPanel530 settingsSection540 tone-preview">
      <div class="settingsSectionHead530 emailPreviewHead530"><div><span class="settingsEyebrow530">Live preview</span><h2>Example Email</h2><p>Sample account information shows how your saved templates will read.</p></div></div>
      <div class="emailMock530">
        <div class="emailMockRow530"><strong>To</strong><span id="emailPreviewTo530">${esc(email.defaultTo || 'Customer email added when sending')}</span></div>
        <div class="emailMockRow530"><strong>CC</strong><span id="emailPreviewCc530">${esc(email.cc || 'None')}</span></div>
        ${emailPreviewHtml(email.defaultSubject, email.signature)}
      </div>
    </aside>
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
  if(subjectPreview && subject){
    const renderedSubject=renderTemplate(subject.value, emailSampleSite()).trim();
    subjectPreview.textContent=renderedSubject || "FireVault Report";
  }
  if(sigPreview && sig){
    const renderedSignature=renderTemplate(sig.value, emailSampleSite());
    const previewSignature=renderedSignature.trim() ? renderedSignature : "FireVault Technician\nExample Fire Protection\n(307) 555-0100\ntech@example.com";
    sigPreview.innerHTML=esc(previewSignature).replaceAll("\n","<br>");
  }
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



function settingsSection540(kicker,title,note,content,tone="blue",action=""){
  return `<section class="card settingGroup compactPane settingsSection540 tone-${tone}">
    <div class="paneHead settingsPaneHead540"><div><span class="settingsKicker540">${esc(kicker)}</span><h2>${esc(title)}</h2><p class="paneNote">${esc(note)}</p></div>${action}</div>
    <div class="settingsSectionBody540">${content}</div>
  </section>`;
}

function homeLayoutPanel550(){
  const active=activeHomeLayoutPreset550();
  const cards=HOME_LAYOUT_CARDS_550.map(card=>{
    const set=homeLayoutCard550(card.key);
    const available=homeLayoutModuleAvailable550(card.key);
    return `<div class="homeLayoutCardRow550 tone-${card.tone} ${available?"":"moduleUnavailable550"}" data-home-layout-row="${card.key}">
      <label class="homeLayoutVisibility550" for="homeVisible_${card.key}">
        <input type="checkbox" id="homeVisible_${card.key}" ${set.visible?"checked":""}>
        <span class="homeLayoutColor550" aria-hidden="true"></span>
        <span><strong>${esc(card.label)}</strong><small>${esc(card.note)}</small></span>
      </label>
      <div class="homeLayoutBehavior550"><label for="homeBehavior_${card.key}">Open behavior</label><select id="homeBehavior_${card.key}"><option value="remember" ${set.behavior==="remember"?"selected":""}>Remember last choice</option><option value="expanded" ${set.behavior==="expanded"?"selected":""}>Always start open</option><option value="collapsed" ${set.behavior==="collapsed"?"selected":""}>Always start collapsed</option></select>${available?"":`<em>Enable ${esc(card.module==="advancedGps"?"GPS / Nearby":card.label)} in Modules to show this card.</em>`}</div>
    </div>`;
  }).join("");
  return `<div class="settingsStack settingsStack540 homeLayoutSettings550">
    ${settingsSection540("Home workspace","Quick Home Presets","Change only the optional cards on the Home screen. Site, report, and account data are not affected.",`<div class="homeLayoutPresetGrid550">${Object.entries(HOME_LAYOUT_PRESETS_550).map(([key,p])=>`<button class="ghost homeLayoutPreset550 ${active===key?"presetActive575":""}" type="button" data-home-layout-preset="${key}" aria-pressed="${active===key?"true":"false"}"><span>${esc(p.icon)}</span><strong>${esc(p.label)}</strong><small>${esc(p.note)}</small>${active===key?`<em class="presetActiveBadge575">✓ Active</em>`:""}</button>`).join("")}</div>`,"red",`<button class="primary saveMini" id="saveSettings">Save</button>`)}
    ${settingsSection540("Individual cards","Home Card Controls","Show or hide each optional card and decide how it opens when Home is rendered.",`<div class="homeLayoutCardList550">${cards}</div>`,"cyan")}
    <section class="card settingGroup compactPane settingsSection540 tone-violet homeLayoutPreviewPanel550">
      <div class="paneHead settingsPaneHead540"><div><span class="settingsKicker540">Preview</span><h2>Home Card Stack</h2><p class="paneNote">A compact preview of the optional cards that will appear on Home.</p></div></div>
      <div class="homeLayoutPreview550" id="homeLayoutPreview550">${HOME_LAYOUT_CARDS_550.map(card=>`<div data-home-preview-card="${card.key}" class="tone-${card.tone}"><span></span><strong>${esc(card.label)}</strong><em></em></div>`).join("")}</div>
      <div class="homeLayoutActionGrid550"><button class="ghost" type="button" data-home-card-state="expand">Set All Open</button><button class="ghost" type="button" data-home-card-state="collapse">Set All Collapsed</button><button class="danger" type="button" id="resetHomeLayout550">Reset Home Layout</button></div>
    </section>
  </div>`;
}
function updateHomeLayoutPreview550(){
  HOME_LAYOUT_CARDS_550.forEach(card=>{
    const row=document.querySelector(`[data-home-preview-card="${card.key}"]`);
    if(!row) return;
    const input=document.getElementById(`homeVisible_${card.key}`);
    const select=document.getElementById(`homeBehavior_${card.key}`);
    const visible=input?input.checked:homeLayoutCard550(card.key).visible;
    const behavior=select?.value||homeLayoutCard550(card.key).behavior;
    const available=homeLayoutModuleAvailable550(card.key);
    row.classList.toggle("previewHidden550",!visible);
    row.classList.toggle("previewUnavailable550",!available);
    const status=row.querySelector("em");
    if(status) status.textContent=!available?"Module off":!visible?"Hidden":behavior==="expanded"?"Starts open":behavior==="collapsed"?"Starts closed":"Remembers";
  });
}


const FIREVAULT_MANUAL_058 = [
  {id:"start",title:"Getting Started",icon:"▶",status:"Current",summary:"Install FireVault, understand local storage, and learn the main navigation.",topics:[
    ["What FireVault does","FireVault keeps customer sites, contacts, equipment, notes, tasks, deficiencies, photos, documents, visits, routes, and reports together in one field-focused application."],
    ["Installing on iPhone or iPad","Open the deployed FireVault address in Safari, confirm the build number, tap Share, then choose Add to Home Screen. Open the new Home Screen icon for the full-screen app experience."],
    ["Local-first storage","Your working vault is stored locally in the browser on the current device. Export a backup regularly—especially before installing a new build, clearing browser data, or changing devices."],
    ["Main navigation","Today opens the field dashboard. Sites opens the customer database. Library holds manuals, forms, links, and codes when enabled. Settings controls the app layout, modules, reports, email, GPS, backups, and appearance."],
    ["Recommended first setup","Enter your Technician Profile, review GPS permissions, set Report and Email defaults, choose a Home Layout, and export a test backup before entering production data."]
  ]},
  {id:"home",title:"Today / Home Screen",icon:"⌂",status:"Current",summary:"Use the daily dashboard, account cards, Field Focus, Quick Capture, and route controls.",topics:[
    ["Home cards","Pinned Sites, Field Focus, Nearby Accounts, and Recent Accounts can be shown, hidden, expanded, or collapsed. Their behavior is controlled in Settings → Home Layout."],
    ["Search","Use the Home search field to locate an account by site name, address, panel information, contacts, notes, or equipment."],
    ["Quick Capture","Tap Site Note to create a timestamped note, follow-up task, or deficiency without leaving Today. Confirm the selected account before saving."],
    ["Field Dashboard","Notes Today opens the Daily Report, Route Points opens Daily Route, Copy Summary copies the day summary, and All Sites opens the full customer list."],
    ["Pinned Sites","Pin frequently used or high-priority customer accounts for one-tap access from Today."]
  ]},
  {id:"sites",title:"Customer Database",icon:"▦",status:"Current",summary:"Create, find, edit, and organize customer accounts.",topics:[
    ["Create a site","Open Sites and tap the add control. Enter the customer name, complete address, panel information, notes, and any available GPS coordinates, then save."],
    ["Open and edit","Tap an account to open Site Detail. Use Edit for core customer information. Changes are saved to the local vault."],
    ["Contacts","Store customer contacts, roles, phone numbers, email addresses, and access notes under the account."],
    ["GPS","Capture GPS while physically at the site for the best nearby-account results. Location permission and HTTPS are required."],
    ["Search and recent use","FireVault searches multiple account fields, including imported Account Id and monitoring information, and tracks recently opened sites for faster daily access."],
    ["Customer CSV Import","Open Settings → Customer Import, choose a compatible CSV file, review New, Update, Review, and No Change counts, then import ready records. The complete Account Id is the duplicate-safe update key. Shared addresses and repeated names do not merge separate buildings. Flagged rows can be left out until corrected."],
    ["Repeat imports","Reimporting the same source file does not duplicate an exact Account ID. Different Account IDs at the same address—including CLSS IDs with different dash suffixes—remain separate buildings. Changed source fields are updated while visits, photos, notes, tasks, deficiencies, contacts, documents, and other FireVault-created history are preserved."]
  ]},
  {id:"detail",title:"Site Detail",icon:"▤",status:"Current",summary:"Understand every card and action on an individual customer account.",topics:[
    ["Important Site Info","Provides fast access to contact, access, panel, and GPS information. Use it before beginning work."],
    ["Site Brief","Summarizes open tasks, deficiencies, photos, visits, panel information, contact data, access notes, and last activity."],
    ["Activity Timeline","Shows recent visits, photos, documents, tasks, and deficiencies in chronological order."],
    ["Field Card","Use the Field Card for important condensed site information needed during testing or service."],
    ["Quick Actions","Open notes, visits, tasks, deficiencies, contacts, equipment, documents, reports, maps, and service-call tools from the account."],
    ["Collapsible sections","Site Detail cards keep their natural height and may be opened or closed without compressing their contents."]
  ]},
  {id:"workflow",title:"Daily Field Workflow",icon:"✓",status:"Current",summary:"A recommended start-to-finish process for a normal service day.",topics:[
    ["1. Start the day","Open Today, review Field Focus, open tasks, deficiencies, and the Daily Route status."],
    ["2. Select the customer","Use Nearby Accounts, Recent Accounts, Pinned Sites, or Search to open the correct site."],
    ["3. Review history","Read Important Site Info, Site Brief, recent activity, open tasks, previous visits, and access notes before beginning work."],
    ["4. Document work","Add a service visit, notes, photos, tasks, deficiencies, equipment updates, and documents as work is performed."],
    ["5. Complete reporting","Generate or review the site report, confirm recipients and email formatting, then record delivery or follow-up work."],
    ["6. End the day","Review the Daily Report and route, copy or export required information, then make a current backup."]
  ]},
  {id:"notes",title:"Notes, Tasks & Deficiencies",icon:"✎",status:"Current",summary:"Document observations and track work that remains open.",topics:[
    ["Site notes","Use notes for permanent account information or timestamped field observations. Write enough context for another technician to understand the situation later."],
    ["Tasks","Create follow-up tasks with a clear title, status, notes, and due information when applicable. Mark tasks done only after verification."],
    ["Deficiencies","Record the condition, location, impact, and recommended correction. A deficiency can also create a matching follow-up task."],
    ["Quick Capture","For fast field entry, use Site Note on Today and choose Note, Task, or Deficiency."],
    ["Daily Report connection","New entries can appear in the day summary and account history, providing a chronological record of field activity."]
  ]},
  {id:"photos",title:"Photos & Photo Overlay",icon:"▧",status:"Current",summary:"Capture, label, organize, and preserve site photographs.",topics:[
    ["Add a photo","Open the account photo or document area and choose the camera or photo library. Confirm the correct account before saving."],
    ["Useful photo notes","Describe the device, room, floor, circuit, condition, and reason the photo matters. Avoid relying on an image alone."],
    ["Overlay settings","Settings → Photo Overlay controls the template fields, alignment, font size, colors, background, opacity, logo, and tagline."],
    ["Storage caution","Photos can increase local browser storage quickly. Export backups and remove unnecessary duplicates."],
    ["Photo review","Confirm the saved photo, caption, and overlay are readable before leaving the account."]
  ]},
  {id:"route",title:"GPS, Nearby Sites & Daily Route",icon:"⌖",status:"Current",summary:"Capture site coordinates and document the technician's daily route.",topics:[
    ["GPS permission","Allow location access when prompted. GPS features require a secure HTTPS deployment and may be limited by device privacy settings."],
    ["Save site coordinates","Capture GPS while at the customer site. FireVault stores latitude, longitude, accuracy, and capture time."],
    ["Imported address coordinates","Settings → Customer Import can calculate latitude and longitude from a usable U.S. street address. Review unmatched addresses and verify critical sites on the map or while on location."],
    ["Nearby Accounts","FireVault compares the current location to saved site coordinates using the radius selected in Settings → GPS / Maps."],
    ["Daily Route","Start route logging at the beginning of the workday, add or review waypoints, pause when appropriate, and finish the route at day end."],
    ["Background limitation","Browser and PWA location tracking can be paused by iOS when the app is closed, suspended, or the phone sleeps. Route records should be reviewed for completeness."]
  ]},
  {id:"reports",title:"Reports & Email",icon:"✉",status:"Current",summary:"Configure report content, preview email formatting, and document delivery.",topics:[
    ["Report defaults","Settings → Reports controls the default report title, format, technician profile, tasks, and deficiencies."],
    ["Generate a site report","Open a customer account and use Report when the Reports module is enabled. Review the report before sharing."],
    ["Email Setup","Settings → Email separates recipients, subject, signature, information tags, and a live message preview."],
    ["Template tags","Insert supported tags such as site name, date, technician, company, phone, and email. The values are filled when the report is prepared."],
    ["Final verification","Always verify customer recipients, CC addresses, subject, attachment/report content, signature, and sensitive site information before sending."]
  ]},
  {id:"settings",title:"Settings Reference",icon:"⚙",status:"Current",summary:"Understand each Settings area and the effect it has on FireVault.",topics:[
    ["Technician","Stores the technician name, company, phone, email, and license or employee identifier reused in reports and templates."],
    ["Demo Mode","Settings → App → Demo Mode switches FireVault to a separate fictional Boise dataset with 20 accounts, simulated Nearby GPS, and sample field history. Exit Demo Mode to return to the untouched real vault."],
    ["GPS / Maps","Controls the map provider, accuracy preference, nearby radius, GPS capture buttons, and report coordinates."],
    ["Reports and Email","Sets report defaults, recipients, subject templates, signature templates, and email preview behavior."],
    ["Photo Overlay","Controls the information and branding stamped onto exported or saved field photos."],
    ["Theme","Controls the theme preset, accent, card and button appearance, contrast, text size, compact layout, and haptics."],
    ["Home Layout","Shows or hides optional Home cards and chooses whether each remembers, opens, or collapses by default."],
    ["Modules","Simple, Advanced, and Power modes determine which optional FireVault tools are visible. Disabling a module does not delete its data."],
    ["Advanced","Controls optional integrations that may require permissions, APIs, subscriptions, or external services."],
    ["Team Sync","Shows technician identity, device identity, shared-vault package activity, pending record changes, and conflict policy. Automatic cloud synchronization is not currently connected."],
    ["Customer Import","Previews supported CSV files, calculates missing latitude and longitude from U.S. addresses, flags questionable or unmatched rows, matches repeat imports by Account Id, preserves FireVault-created history, and records changes in Sync Activity."],
    ["Backup","Exports and imports the local vault, previews restore files, and provides repair and safety tools."],
    ["About and Diagnostics","Confirm the installed build, storage key, startup health, data counts, and app stability information."]
  ]},
  {id:"backup",title:"Backup, Restore & Updates",icon:"⇅",status:"Current",summary:"Protect the local vault before upgrades or device changes.",topics:[
    ["Export regularly","Go to Settings → Backup and export a JSON backup. Store copies outside the browser, preferably in more than one safe location."],
    ["Before an update","FireVault creates local safety snapshots automatically. Download an external backup before major updates or device changes, then verify the installed build and account count afterward."],
    ["Restore safely","Import a recognized FireVault JSON backup, review the preview counts and build information, then confirm restore. Restore overwrites the current local vault."],
    ["Update safely","Use Settings → App Updates → Check for Updates or Reload FireVault. Do not delete the Home Screen app unless a current external backup has been downloaded and verified."],
    ["Do not assume cloud sync","Until cloud synchronization is explicitly released, each browser/device has its own local copy of the vault."]
  ]},
  {id:"trouble",title:"Troubleshooting",icon:"!",status:"Current",summary:"Resolve common loading, saving, GPS, layout, and deployment problems.",topics:[
    ["Wrong build number","The deployed repository or browser cache is still serving an older release. Verify the root index files, GitHub Pages deployment, and the build badge."],
    ["App does not load","Reload once, confirm network access for the initial deployment, inspect the startup error message, then clear only the FireVault site data if necessary."],
    ["Changes do not save","Confirm browser storage is available, the device is not in private browsing, and storage has not been cleared or exhausted."],
    ["GPS does not work","Confirm HTTPS, iOS location permission, FireVault GPS settings, and that precise location is enabled when accurate nearby results are needed."],
    ["Layout is clipped or compressed","Confirm the correct build is installed. Capture a screenshot with the build badge and identify the exact page, card, and action that produced the issue."],
    ["Restore fails","Use an unmodified FireVault JSON backup, verify the file is readable, and compare its preview details before confirming restore."]
  ]},
  {id:"release",title:"App Information",icon:"ⓘ",status:"Current",summary:"Find version details, documentation notes, and information needed when reporting a problem.",topics:[
    ["Installed version","Open Settings → App Updates or About to confirm the build currently installed on the device."],
    ["Documentation","Help chapters describe the controls and workflows available in the installed app."],
    ["Release notes","Tap the build number where available to review recent changes."],
    ["Problem reports","Include the build number, page name, device, screenshot, exact action, and what happened instead."]
  ]}
];

const MANUAL_SYNONYMS_058={pictures:"photos",picture:"photos",mail:"email",location:"gps latitude longitude coordinates geocode",map:"gps route coordinates",customer:"site account import csv",client:"site account",spreadsheet:"csv customer import",excel:"csv customer import",import:"customer csv account id coordinates",latitude:"gps coordinates customer import",longitude:"gps coordinates customer import",geocode:"address coordinates customer import",backup:"export restore",problem:"troubleshooting",reporting:"reports email"};
const MANUAL_BOOKMARKS_KEY_058="firevault_manual_bookmarks_058";
let manualQuery058="";
let manualView058="home";
let manualChapter058="";
let contextualHelpReturn060=null;
const CONTEXT_HELP_060={
  home:{chapter:"home",label:"Today / Home",suggestions:["Quick Capture","Home cards","Field Dashboard"]},
  sites:{chapter:"sites",label:"Customer Database",suggestions:["Create a site","Search accounts","Save GPS"]},
  nearbySites:{chapter:"route",label:"Nearby Sites",suggestions:["GPS permission","Nearby radius","Save coordinates"]},
  siteDetail:{chapter:"detail",label:"Site Detail",suggestions:["Important Site Info","Quick Actions","Activity Timeline"]},
  siteDocs:{chapter:"photos",label:"Photos & Documents",suggestions:["Add a photo","Photo notes","Storage caution"]},
  siteDocForm:{chapter:"photos",label:"Add Photo / Document",suggestions:["Photo categories","Overlay settings","Useful notes"]},
  jobMode:{chapter:"notes",label:"Site Notes",suggestions:["Save notes","Templates","Daily Report"]},
  tasks:{chapter:"notes",label:"Task Center",suggestions:["Create tasks","Due dates","Mark complete"]},
  taskForm:{chapter:"notes",label:"Task Editor",suggestions:["Task title","Status","Follow-up notes"]},
  deficiencies:{chapter:"notes",label:"Deficiency Center",suggestions:["Document condition","Create follow-up","Close deficiency"]},
  deficiencyForm:{chapter:"notes",label:"Deficiency Editor",suggestions:["Location","Impact","Recommended correction"]},
  report:{chapter:"reports",label:"Site Report",suggestions:["Report defaults","Email report","Final verification"]},
  dailySummary:{chapter:"reports",label:"Daily Report",suggestions:["Daily summary","Copy report","Email settings"]},
  routeLog:{chapter:"route",label:"Daily Route",suggestions:["Start route","Waypoints","iPhone limitations"]},
  settings:{chapter:"settings",label:"Settings",suggestions:["Recommended settings","Modules","Backup"]}
};
function loadManualBookmarks058(){ try{return JSON.parse(localStorage.getItem(MANUAL_BOOKMARKS_KEY_058)||"[]")}catch{return []} }
let manualBookmarks058=loadManualBookmarks058();
function saveManualBookmarks058(){ fvSafeSet0739(MANUAL_BOOKMARKS_KEY_058,JSON.stringify(manualBookmarks058)); }
function manualSearchText058(ch){ return [ch.title,ch.summary,...ch.topics.flat()].join(" ").toLowerCase(); }
function manualExpandedQuery058(q){ const parts=q.toLowerCase().trim().split(/\s+/).filter(Boolean); return [...parts,...parts.map(x=>MANUAL_SYNONYMS_058[x]||"")].join(" "); }
function manualStatus058(ch){ if(["start","home","sites","detail","workflow","notes","photos","gps","reports","settings","backup","trouble"].includes(ch.id)) return "Complete"; return "Needs Review"; }
function manualMinutes058(ch){ return Math.max(2,Math.ceil(ch.topics.length*0.8)); }
function manualTile058(icon,title,note,view,tone="blue",badge=""){ return `<button class="academyTile058 tone-${tone}" data-manual-view="${view}"><span>${icon}</span><div><strong>${esc(title)}</strong><small>${esc(note)}</small></div>${badge?`<em>${esc(badge)}</em>`:""}</button>`; }
function manualHome058(){
  const bookmarked=FIREVAULT_MANUAL_058.filter(ch=>manualBookmarks058.includes(ch.id));
  return `<div class="academyHome067">
    <header class="academyWelcome067"><div><span>FireVault Academy</span><h2>Help that is easy to read</h2><p>Search the manual or choose one of four simple starting points.</p></div><em>Build ${BUILD}</em></header>
    <div class="academySearch067"><span>⌕</span><input id="manualSearch058" type="search" value="${esc(manualQuery058)}" placeholder="Search Help…"><button class="primary" id="manualSearchGo058">Search</button></div>
    <div class="academyPrimary067">
      <button data-manual-view="manual"><span>📘</span><div><strong>User Manual</strong><small>Browse every feature and workflow</small></div><b>›</b></button>
      <button data-manual-view="quick"><span>🚀</span><div><strong>Quick Start</strong><small>Set up FireVault and begin a visit</small></div><b>›</b></button>
      <button data-manual-view="trouble"><span>?</span><div><strong>Troubleshooting</strong><small>GPS, storage, photos, and updates</small></div><b>›</b></button>
      <button data-manual-view="new"><span>🆕</span><div><strong>What’s New</strong><small>Changes in Build ${BUILD}</small></div><b>›</b></button>
    </div>
    ${bookmarked.length?`<section class="academySaved067"><div><span>Saved pages</span><strong>Bookmarks</strong></div>${bookmarked.map(ch=>`<button data-manual-chapter="${ch.id}"><span>${ch.icon}</span><strong>${esc(ch.title)}</strong><b>›</b></button>`).join('')}</section>`:''}
    <details class="academyMore067"><summary><span>More learning tools</span><b>⌄</b></summary><div><button data-manual-view="tutorials">Interactive Tutorials</button><button data-manual-view="tips">Field Tips</button><button data-manual-view="tour">Show Me Around</button><button data-manual-view="revisions">Revision History</button><button data-manual-view="tracker">Documentation Tracker</button></div></details>
    ${pinnedLearning059()}
    <p class="academyReviewNote067">Manual revision 0.67.0 · Reviewed July 2026. Documentation must be checked with every feature release.</p>
  </div>`;
}
function manualList058(){
  const expanded=manualExpandedQuery058(manualQuery058);
  const terms=expanded.split(/\s+/).filter(Boolean);
  const chapters=FIREVAULT_MANUAL_058.filter(ch=>!terms.length||terms.some(t=>manualSearchText058(ch).includes(t)));
  return `<div class="academyReader067"><header class="academyReaderHead067"><button class="ghost" data-manual-view="home">←</button><div><span>User Manual</span><h2>FireVault Chapters</h2><p>Choose a topic. Articles open as one continuous page.</p></div></header><div class="academySearch067"><span>⌕</span><input id="manualSearch058" type="search" value="${esc(manualQuery058)}" placeholder="Search chapters…"><button class="ghost" id="manualClear058" ${manualQuery058?'':'disabled'}>Clear</button></div><div class="academyChapterList067">${chapters.length?chapters.map(ch=>`<button data-manual-chapter="${ch.id}"><span>${ch.icon}</span><div><strong>${esc(ch.title)}</strong><small>${esc(ch.summary)}</small></div><b>›</b></button>`).join(''):`<div class="manualEmpty057"><strong>No matching topics</strong><p>Try email, GPS, pictures, customer, backup, reports, or troubleshooting.</p></div>`}</div></div>`;
}
function manualChapterView058(){
  const ch=FIREVAULT_MANUAL_058.find(x=>x.id===manualChapter058)||FIREVAULT_MANUAL_058[0];
  const idx=FIREVAULT_MANUAL_058.indexOf(ch),prev=FIREVAULT_MANUAL_058[idx-1],next=FIREVAULT_MANUAL_058[idx+1];
  return `<article class="academyArticle067">
    ${contextualHelpReturn060?`<div class="contextReturn067"><div><span>Help opened from</span><strong>${esc(contextualHelpReturn060.label)}</strong></div><button class="primary" id="contextHelpReturn060">Return</button></div>`:''}
    <header class="academyArticleHead067"><button class="ghost" data-manual-view="manual">← Chapters</button><div><span>${ch.icon} User Manual</span><h2>${esc(ch.title)}</h2><p>${esc(ch.summary)}</p><small>Reviewed July 2026 · Build ${BUILD}</small></div><button class="academyBookmark067 ${manualBookmarks058.includes(ch.id)?'active':''}" data-manual-bookmark="${ch.id}" aria-label="Bookmark chapter">★</button></header>
    <main class="academyArticleBody067">${ch.topics.map(([title,body])=>`<section><h3>${esc(title)}</h3><p>${esc(body)}</p></section>`).join('')}</main>
    ${contextualHelpReturn060?`<section class="contextSuggestions067"><strong>Related topics</strong><div>${(CONTEXT_HELP_060[contextualHelpReturn060.view]?.suggestions||['Related settings','Common workflow','Troubleshooting']).map(q=>`<button class="ghost" data-context-search060="${esc(q)}">${esc(q)}</button>`).join('')}</div></section>`:''}
    <footer class="academyArticleNav067">${prev?`<button class="ghost" data-manual-chapter="${prev.id}"><span>Previous</span><strong>← ${esc(prev.title)}</strong></button>`:'<span></span>'}${next?`<button class="ghost" data-manual-chapter="${next.id}"><span>Next</span><strong>${esc(next.title)} →</strong></button>`:`<button class="ghost" data-manual-view="home"><span>Finished</span><strong>Academy Home →</strong></button>`}</footer>
  </article>`;
}
function manualSimplePage058(type){
 const pages={
  quick:["🚀","Quick Start Guide","Get FireVault ready for a normal field day.",[["1. Verify the build","Confirm the green build badge shows 0.67.0 before entering production information."],["2. Complete Technician Profile","Enter your name, company, phone, email, and license or employee identification."],["3. Review permissions","Allow location and photo access only when FireVault requests them and the feature is needed."],["4. Create or open a site","Add the customer name, full address, panel details, contacts, access notes, and GPS location."],["5. Document the visit","Record notes, photos, tasks, deficiencies, equipment changes, and a service visit."],["6. Finish and protect the data","Review the report, send or copy the required summary, then export a current backup."]]],
  new:["🆕","What’s New in 0.67.0","Account View, Settings navigation, and FireVault Academy redesign.",[["Unified visual system","Standardized typography, spacing, card surfaces, borders, controls, and responsive behavior across FireVault."],["Settings cleanup","Improved Settings home cards and every submenu while preserving the preferred Email setup workflow."],["Help readability","Converted contextual Help and Academy articles into one uninterrupted scrolling reading column with no floating metadata."],["Site Detail stability","Reinforced natural-height cards, readable text, and scroll-safe account sections."],["Operational screens","Simplified Customer Import, Team Sync, Conflict Center, and Nearby Sites presentation without changing their workflows."],["Phone and iPad layouts","Added consistent narrow-phone and tablet behavior, bottom-navigation clearance, and overflow protection."],["Nearby scan diagnostics","Nearby Sites now shows total sites, GPS-ready records, missing coordinates, phone-location progress, and persistent error messages."],["Coordinate recovery","FireVault recovers valid latitude and longitude stored in compatible legacy or imported fields and normalizes them into the site GPS record."],["Location retry","If high-accuracy location times out or is unavailable, FireVault retries once using standard accuracy."],["Nearest-site fallback","When no site is inside the selected radius, the nearest GPS-ready sites remain visible instead of presenting an empty result."],["Latitude and longitude","Customer Import can calculate missing coordinates from each usable U.S. street address before saving records."],["Coordinate requirement","The importer requires calculated, supplied, or existing GPS coordinates by default. Unmatched addresses remain in review."],["Census address matching","Only address fields are sent to the U.S. Census Geocoder. The returned point is an address-range calculation, not a guaranteed building entrance."],["Account Id matching","Repeat imports update the matching FireVault site instead of creating duplicates or deleting field history."],["CSV coordinate columns","Files that already contain Latitude and Longitude columns use those values directly."],["Sync-ready changes","Added and updated customer records enter the pending synchronization queue and create a Sync Activity entry."]]],
  tips:["🧰","Field Tips","Short practices that improve the usefulness of FireVault records.",[["Write for the next technician","Include the exact panel, circuit, device, location, symptom, test result, and next action instead of relying on memory."],["Photograph context first","Take one wide photo showing the equipment location before close-up terminal, label, or damage photos."],["Separate facts from follow-up","Use notes for what occurred, deficiencies for code or system problems, and tasks for work that still needs completion."],["Confirm the account","Before using Quick Capture, verify the selected customer site to prevent records from being stored under the wrong account."],["Back up before updates","Download an external backup before a major update or device change and after completing significant field documentation."]]],
  revisions:["📋","Revision History","Application and documentation checkpoints.",[["0.67.0","Redesigned Account View around service actions and grouped information, consolidated Settings into five folders, and simplified FireVault Academy and contextual Help for continuous reading."],["0.65.2","Repaired Nearby Sites with GPS inventory counts, imported-coordinate recovery, persistent permission and timeout messages, a standard-accuracy retry, and nearest-site fallback results."],["0.65.1","Added online latitude/longitude calculation, coordinate validation, geocoding progress, unmatched-address review, optional CSV coordinates, and coordinate-safe repeat importing."],["0.65.0","Added preview-first customer CSV importing, Account Id update matching, validation warnings, imported monitoring details, and sync activity tracking."],["0.64.1","Simplified Academy article headers, removed floating metadata badges, and improved continuous scrolling and readability."],["0.64.0","Added Sync Activity, a conflict review center, export/import audit entries, and an automatic OneDrive connection-readiness checklist."],["0.63.1","Overhauled contextual Help and Academy reader formatting, removed overlapping sticky article headers, and restored full scrolling on phones and tablets."],["0.63.0","Added permanent record IDs, audit metadata, local version tracking, pending-sync states, conflict readiness, device identity, and a Team Sync settings workspace."],["0.60.0","Connected major screens and Settings areas directly to matching Academy chapters with return-to-screen navigation."],["0.59.0","Added interactive tutorials, guided orientation, pinned learning, field tips, and documentation tracking."],["0.58.0","Expanded Help & Manual into FireVault Academy with bookmarks, smart search, Quick Start, and reader navigation."],["0.57.0","Added the first complete searchable in-app FireVault User Manual."],["Ongoing review rule","Any change to navigation, labels, storage, workflows, permissions, or supported layouts requires the related manual chapter to be checked."]]],
  trouble:["❓","Troubleshooting","Common problems and safe first checks.",FIREVAULT_MANUAL_058.find(x=>x.id==="trouble")?.topics||[]]
 };
 const [icon,title,note,items]=pages[type]||["ⓘ","Unavailable","This Help section is not available in the installed version.",[["Current status","Return to Help and choose an available chapter or tutorial."]]];
 return `<div class="academySimple058"><div class="academyReaderTop058"><button class="ghost" data-manual-view="home">‹ Academy</button><div><span>${icon} FireVault Academy</span><h2>${esc(title)}</h2><p>${esc(note)}</p></div></div><div class="academySimpleCards058">${items.map(([a,b],i)=>`<article><span>${String(i+1).padStart(2,'0')}</span><div><h3>${esc(a)}</h3><p>${esc(b)}</p></div></article>`).join("")}</div></div>`;
}

const ACADEMY_PROGRESS_KEY_059="firevault_academy_progress_059";
const ACADEMY_PINS_KEY_059="firevault_academy_pins_059";
let academyProgress059=(()=>{try{return JSON.parse(localStorage.getItem(ACADEMY_PROGRESS_KEY_059)||"{}")||{}}catch{return {}}})();
let academyPins059=(()=>{try{return JSON.parse(localStorage.getItem(ACADEMY_PINS_KEY_059)||"[]")||[]}catch{return []}})();
let activeTutorial059="";
let activeTourStep059=0;
const ACADEMY_TUTORIALS_059=[
 {id:"first-setup",icon:"⚙",title:"First-Time Setup",time:"5 min",level:"Beginner",summary:"Configure identity, permissions, reports, email, Home layout, and backups.",steps:["Open Settings and complete Technician Profile.","Review GPS permissions and choose the nearby-site radius.","Set Report and Email defaults.","Choose a Home Layout preset that fits your workflow.","Export a test backup and confirm the file downloads."]},
 {id:"first-site",icon:"▦",title:"Create Your First Customer",time:"4 min",level:"Beginner",summary:"Create a complete customer account and confirm Site Detail information.",steps:["Open Sites and tap Add Site.","Enter the customer name and complete address.","Add panel, contact, access, and GPS information.","Save and reopen the account.","Review Site Brief and Important Site Info for accuracy."]},
 {id:"visit",icon:"✓",title:"Document a Site Visit",time:"6 min",level:"Beginner",summary:"Record work performed and leave a useful history for the next technician.",steps:["Open the correct customer account.","Review recent activity and open work.","Create a visit and record arrival details.","Add notes, photos, tasks, deficiencies, and equipment updates.","Review the report before ending the visit."]},
 {id:"notes",icon:"✎",title:"Notes, Tasks & Deficiencies",time:"5 min",level:"Beginner",summary:"Choose the correct record type and create actionable documentation.",steps:["Use a note for observations or permanent context.","Use a task for work that must be completed later.","Use a deficiency for an impaired or noncompliant condition.","Add location, device, cause, and recommended action.","Close tasks and deficiencies only after resolution is documented."]},
 {id:"photos",icon:"▧",title:"Use Photos Effectively",time:"4 min",level:"Intermediate",summary:"Capture useful evidence and apply consistent photo overlays.",steps:["Confirm the correct account before taking the photo.","Frame labels, wiring, device location, and surrounding context.","Add a descriptive caption.","Apply the configured overlay when required.","Verify the saved image appears under the correct site."]},
 {id:"email",icon:"✉",title:"Email a Report",time:"5 min",level:"Intermediate",summary:"Prepare recipients, subject, signature, and report content before sending.",steps:["Open Settings → Email and verify defaults.","Open the site report or Daily Report.","Confirm To and CC recipients.","Review subject, signature, and included sections.","Open the device mail composer and verify attachments before sending."]},
 {id:"route",icon:"⌖",title:"GPS & Route Tracking",time:"5 min",level:"Intermediate",summary:"Record a route day and review saved stops and waypoints.",steps:["Allow location access while FireVault is in use.","Start Daily Route before leaving the first location.","Add manual waypoints when a meaningful stop is not detected.","Pause recording when appropriate.","End the route and review the daily timeline before reporting."]}
];
const ACADEMY_TOUR_059=[
 ["Today Dashboard","Your daily starting point for Field Focus, Quick Capture, nearby sites, recent accounts, and route activity."],
 ["Global Search","Find accounts using customer name, address, panel details, contacts, equipment, or notes."],
 ["Bottom Navigation","Move between Nearby, Accounts, Library, and Settings without losing stored data."],
 ["Sites","Create, search, and open customer accounts. Each account contains its own field history and documentation."],
 ["Site Detail","Review important information, recent activity, photos, visits, tasks, deficiencies, contacts, equipment, and reports."],
 ["Settings","Control technician information, GPS, reports, email, photo overlays, appearance, Home layout, modules, backups, and the Academy."],
 ["Backups","Export a current backup before major updates, browser-data changes, or device replacement."]
];
const ACADEMY_TIPS_059=[
 ["📷","Take evidence, not decoration","Capture a wide context image and a close-up of labels, terminals, addresses, or damage."],
 ["✎","Write for the next technician","Include device location, observed condition, tests performed, result, and next action."],
 ["⚠","Make deficiencies actionable","State what is wrong, why it matters, exact location, and recommended correction."],
 ["✓","Close the loop","When resolving a task, document the repair, verification test, date, and final system status."],
 ["⇅","Back up before updating","Export the vault before installing a new build or clearing browser storage."]
];
function saveAcademy059(){fvSafeSet0739(ACADEMY_PROGRESS_KEY_059,JSON.stringify(academyProgress059));fvSafeSet0739(ACADEMY_PINS_KEY_059,JSON.stringify(academyPins059));}
function tutorialProgress059(t){const done=academyProgress059[t.id]||[];return Math.round((done.length/t.steps.length)*100)}
function academyPinToggle059(key){academyPins059=academyPins059.includes(key)?academyPins059.filter(x=>x!==key):[...academyPins059,key];saveAcademy059();settings();}
function tutorialList059(){return `<div class="academyReader058 academyTutorials059"><div class="academyReaderTop058"><button class="ghost" data-manual-view="home">‹ Academy</button><div><span>🎓 Guided Learning</span><h2>Interactive Tutorials</h2><p>Complete practical walkthroughs at your own pace. Progress is saved on this device.</p></div></div><div class="tutorialGrid059">${ACADEMY_TUTORIALS_059.map(t=>{const p=tutorialProgress059(t);return `<article class="tutorialCard059"><button class="tutorialOpen059" data-tutorial-open="${t.id}"><span>${t.icon}</span><div><div class="tutorialMeta059"><em>${t.level}</em><small>${t.time}</small></div><h3>${esc(t.title)}</h3><p>${esc(t.summary)}</p><div class="tutorialBar059"><i style="width:${p}%"></i></div><small>${p}% complete</small></div></button><button class="academyPin059 ${academyPins059.includes('tutorial:'+t.id)?'active':''}" data-academy-pin="tutorial:${t.id}" aria-label="Pin tutorial">★</button></article>`}).join("")}</div></div>`}
function tutorialView059(){const t=ACADEMY_TUTORIALS_059.find(x=>x.id===activeTutorial059)||ACADEMY_TUTORIALS_059[0];const done=academyProgress059[t.id]||[];const p=tutorialProgress059(t);return `<div class="academyArticle058 academyTutorialView059"><header class="academyArticleHead058"><button class="ghost" data-manual-view="tutorials">‹ Tutorials</button><div><span>${t.icon} ${t.level} · ${t.time}</span><h2>${esc(t.title)}</h2><p>${esc(t.summary)}</p><p class="academyArticleInfo0641">${p}% complete · Build ${BUILD}</p></div><button class="academyPin059 ${academyPins059.includes('tutorial:'+t.id)?'active':''}" data-academy-pin="tutorial:${t.id}">★</button></header><div class="academyProgress058"><span style="width:${p}%"></span></div><main class="tutorialSteps059">${t.steps.map((step,i)=>`<label class="tutorialStep059 ${done.includes(i)?'complete':''}"><input type="checkbox" data-tutorial-step="${i}" ${done.includes(i)?'checked':''}><span>${i+1}</span><div><h3>Step ${i+1}</h3><p>${esc(step)}</p></div></label>`).join("")}</main><div class="tutorialFinish059"><strong>${p===100?'✓ Tutorial complete':'Continue when ready'}</strong><p>${p===100?'Your completion is saved on this device. You may repeat any step at any time.':'Check each step as you complete it. FireVault saves your progress automatically.'}</p><button class="ghost" id="resetTutorial059">Reset tutorial</button></div></div>`}
function tourView059(){const [title,body]=ACADEMY_TOUR_059[activeTourStep059];const pct=Math.round(((activeTourStep059+1)/ACADEMY_TOUR_059.length)*100);return `<div class="academyArticle058 academyTour059"><div class="academyReaderTop058"><button class="ghost" data-manual-view="home">‹ Academy</button><div><span>🧭 New User Orientation</span><h2>Show Me Around FireVault</h2><p>A short guided overview of the primary work areas.</p></div></div><div class="tourStage059"><div class="tourNumber059">${activeTourStep059+1}</div><span>Tour stop ${activeTourStep059+1} of ${ACADEMY_TOUR_059.length}</span><h2>${esc(title)}</h2><p>${esc(body)}</p><div class="academyProgress058"><span style="width:${pct}%"></span></div><div class="tourNav059"><button class="ghost" id="tourPrev059" ${activeTourStep059===0?'disabled':''}>‹ Previous</button><button class="primary" id="tourNext059">${activeTourStep059===ACADEMY_TOUR_059.length-1?'Finish Tour':'Next ›'}</button></div></div></div>`}
function tipsView059(){return `<div class="academySimple058"><div class="academyReaderTop058"><button class="ghost" data-manual-view="home">‹ Academy</button><div><span>🧰 Practical Guidance</span><h2>Field Tips Library</h2><p>Short reminders that improve documentation quality and consistency.</p></div></div><div class="tipGrid059">${ACADEMY_TIPS_059.map((t,i)=>`<article class="tipCard059"><span>${t[0]}</span><div><h3>${esc(t[1])}</h3><p>${esc(t[2])}</p></div><button class="academyPin059 ${academyPins059.includes('tip:'+i)?'active':''}" data-academy-pin="tip:${i}">★</button></article>`).join("")}</div></div>`}
function trackerView059(){const rows=[...FIREVAULT_MANUAL_058.map(ch=>[ch.title,manualStatus058(ch),"Manual chapter"]),...ACADEMY_TUTORIALS_059.map(t=>[t.title,tutorialProgress059(t)===100?"Complete":"Not completed","Tutorial"])];return `<div class="academyReader058"><div class="academyReaderTop058"><button class="ghost" data-manual-view="home">‹ Academy</button><div><span>📋 Learning Progress</span><h2>Documentation & Tutorials</h2><p>Review available Help chapters and your saved tutorial progress.</p></div></div><div class="docTracker059">${rows.map(r=>`<div><strong>${esc(r[0])}</strong><small>${r[2]}</small><em class="status-${r[1].toLowerCase().replace(/\s+/g,'-')}">${r[1]}</em></div>`).join("")}</div></div>`}
function pinnedLearning059(){if(!academyPins059.length)return "";const cards=academyPins059.map(key=>{if(key.startsWith('tutorial:')){const t=ACADEMY_TUTORIALS_059.find(x=>x.id===key.slice(9));return t?`<button data-tutorial-open="${t.id}"><span>${t.icon}</span><strong>${esc(t.title)}</strong><small>Tutorial · ${tutorialProgress059(t)}%</small></button>`:""}if(key.startsWith('tip:')){const i=Number(key.slice(4)),t=ACADEMY_TIPS_059[i];return t?`<button data-manual-view="tips"><span>${t[0]}</span><strong>${esc(t[1])}</strong><small>Field tip</small></button>`:""}return ""}).join("");return cards?`<section class="academyBookmarks058"><div class="academySectionHead058"><div><span>Saved learning</span><h3>Pinned Tutorials & Tips</h3></div></div><div class="academyBookmarkGrid058">${cards}</div></section>`:""}
function manualPanel058(){ if(manualView058==="home")return manualHome058(); if(manualView058==="manual")return manualList058(); if(manualView058==="chapter")return manualChapterView058(); if(manualView058==="tutorials")return tutorialList059(); if(manualView058==="tutorial")return tutorialView059(); if(manualView058==="tour")return tourView059(); if(manualView058==="tips")return tipsView059(); if(manualView058==="tracker")return trackerView059(); return manualSimplePage058(manualView058); }
function wireManual058(){
  const contextReturn=document.getElementById("contextHelpReturn060"); if(contextReturn) contextReturn.onclick=returnFromContextualHelp060;
  document.querySelectorAll("[data-context-search060]").forEach(b=>b.onclick=()=>{ manualQuery058=b.dataset.contextSearch060||""; manualView058="manual"; settings(); });
 document.querySelectorAll("[data-manual-view]").forEach(b=>b.onclick=()=>{manualView058=b.dataset.manualView;settings();});
 document.querySelectorAll("[data-manual-chapter]").forEach(b=>b.onclick=()=>{manualChapter058=b.dataset.manualChapter;manualView058="chapter";settings();requestAnimationFrame(()=>document.querySelector('.settingsDetailBody488')?.scrollTo({top:0}));});
 document.querySelectorAll("[data-manual-bookmark]").forEach(b=>b.onclick=e=>{e.stopPropagation();const id=b.dataset.manualBookmark;manualBookmarks058=manualBookmarks058.includes(id)?manualBookmarks058.filter(x=>x!==id):[...manualBookmarks058,id];saveManualBookmarks058();settings();});
 document.querySelectorAll("[data-academy-pin]").forEach(b=>b.onclick=e=>{e.stopPropagation();academyPinToggle059(b.dataset.academyPin)});
 document.querySelectorAll("[data-tutorial-open]").forEach(b=>b.onclick=()=>{activeTutorial059=b.dataset.tutorialOpen;manualView058="tutorial";settings();requestAnimationFrame(()=>document.querySelector('.settingsDetailBody488')?.scrollTo({top:0}));});
 document.querySelectorAll("[data-tutorial-step]").forEach(b=>b.onchange=()=>{const t=ACADEMY_TUTORIALS_059.find(x=>x.id===activeTutorial059)||ACADEMY_TUTORIALS_059[0];let done=academyProgress059[t.id]||[];const i=Number(b.dataset.tutorialStep);done=b.checked?[...new Set([...done,i])]:done.filter(x=>x!==i);academyProgress059[t.id]=done;saveAcademy059();settings();});
 const reset=document.getElementById('resetTutorial059');if(reset)reset.onclick=()=>{const t=ACADEMY_TUTORIALS_059.find(x=>x.id===activeTutorial059)||ACADEMY_TUTORIALS_059[0];delete academyProgress059[t.id];saveAcademy059();settings();};
 const prev=document.getElementById('tourPrev059');if(prev)prev.onclick=()=>{activeTourStep059=Math.max(0,activeTourStep059-1);settings();};
 const next=document.getElementById('tourNext059');if(next)next.onclick=()=>{if(activeTourStep059>=ACADEMY_TOUR_059.length-1){activeTourStep059=0;manualView058='home'}else activeTourStep059++;settings();};
 const input=document.getElementById("manualSearch058"); if(input) input.oninput=()=>{manualQuery058=input.value; if(manualView058!=="home"){settings();requestAnimationFrame(()=>{const n=document.getElementById('manualSearch058');if(n){n.focus();n.setSelectionRange(n.value.length,n.value.length)}})}};
 const go=document.getElementById("manualSearchGo058"); if(go) go.onclick=()=>{manualQuery058=document.getElementById('manualSearch058')?.value||"";manualView058="manual";settings();};
 const clear=document.getElementById("manualClear058"); if(clear) clear.onclick=()=>{manualQuery058="";settings();};
}

function accountCategoryOptions0737(items,current){ return items.map(([value,label])=>`<option value="${value}" ${value===current?"selected":""}>${esc(label)}</option>`).join(""); }
function accountCategoryCount0737(category){ return (data.sites||[]).filter(site=>accountCategoryMatches0737(site,category)).length; }
function accountCategoryPreview0737(category){
  const matches=(data.sites||[]).filter(site=>accountCategoryMatches0737(site,category));
  if(!matches.length) return "No accounts currently match these rules.";
  const names=matches.slice(0,4).map(site=>site.name||accountId069(site)||"Unnamed account");
  return `${names.join(" • ")}${matches.length>4?` • +${matches.length-4} more`:""}`;
}
function accountCategoryRuleEditor0737(rule={},categoryId=""){
  const operator=rule.operator||"contains";
  return `<div class="categoryRule0737" data-category-rule0737 data-rule-id="${esc(rule.id||uid())}">
    <select data-category-rule-field0737 aria-label="Rule field">${accountCategoryOptions0737(ACCOUNT_CATEGORY_FIELDS_0737,rule.field||"accountId")}</select>
    <select data-category-rule-operator0737 aria-label="Rule operator">${accountCategoryOptions0737(ACCOUNT_CATEGORY_OPERATORS_0737,operator)}</select>
    <input data-category-rule-value0737 value="${esc(rule.value||"")}" placeholder="Value" ${(operator==="present"||operator==="empty")?"disabled":""}>
    <button class="danger" data-delete-category-rule0737 aria-label="Delete rule">×</button>
  </div>`;
}
function accountCategoryEditor0737(category,index){
  const rules=Array.isArray(category.rules)?category.rules:[];
  const count=accountCategoryCount0737(category);
  return `<article class="categoryEditorCard0737" data-category-card0737 data-category-id="${esc(category.id||uid())}">
    <header class="categoryEditorHead0737">
      <input type="color" data-category-color0737 value="${safeCategoryColor0737(category.color)}" aria-label="Category color">
      <input class="categoryName0737" data-category-name0737 value="${esc(category.name||`Category ${index+1}`)}" aria-label="Category name">
      <label class="categoryEnabled0737"><input type="checkbox" data-category-enabled0737 ${category.enabled!==false?"checked":""}><span>Enabled</span></label>
      <strong>${count} match${count===1?"":"es"}</strong>
    </header>
    <div class="categoryMatch0737"><span>Match</span><select data-category-match0737><option value="all" ${category.match!=="any"?"selected":""}>all</option><option value="any" ${category.match==="any"?"selected":""}>any</option></select><span>of these rules</span></div>
    <div class="categoryRules0737">${rules.length?rules.map(rule=>accountCategoryRuleEditor0737(rule,category.id)).join(""):`<div class="categoryNoRules0737">No rules yet. Add a rule to begin assigning this tag.</div>`}</div>
    <p class="categoryPreview0737"><b>Matches:</b> ${esc(accountCategoryPreview0737(category))}</p>
    <footer><button class="ghost" data-add-category-rule0737>＋ Add Rule</button><button class="danger" data-delete-category0737>Delete Category</button></footer>
  </article>`;
}
function accountCategoriesPanel0737(){
  const categories=accountCategoryConfig0737();
  const taggedAccounts=new Set();
  (data.sites||[]).forEach(site=>{if(accountTags0737(site).length)taggedAccounts.add(site.id);});
  return `<div class="settingsStack categoriesSettings0737">
    <section class="categoryHero0737">
      <div><span>ACCOUNT TAGGING</span><h2>Categories</h2><p>Categories behave like tags. Every category has its own rules, and one account may match several categories at the same time.</p></div>
      <div class="categoryHeroStats0737"><strong>${categories.length}</strong><span>Categories</span><strong>${taggedAccounts.size}</strong><span>Tagged Accounts</span></div>
    </section>
    <div class="categoryToolbar0737"><button class="ghost" id="addAccountCategory0737">＋ New Category</button><button class="primary" id="saveAccountCategories0737">Save &amp; Apply Rules</button></div>
    <div class="categoryRuleHelp0737"><strong>Example</strong><span>Account ID starts with G7C + City equals Casper. Choose <b>all</b> when every rule must match, or <b>any</b> when one rule is enough.</span></div>
    <div class="categoryEditorList0737">${categories.length?categories.map(accountCategoryEditor0737).join(""):`<div class="categoryEmpty0737"><strong>No categories saved</strong><span>Create a category to begin automatically tagging accounts.</span></div>`}</div>
  </div>`;
}
function captureAccountCategoriesEditor0737(){
  const definitions=[...document.querySelectorAll("[data-category-card0737]")].map((card,index)=>({
    id:card.dataset.categoryId||uid(),
    name:(card.querySelector("[data-category-name0737]")?.value||`Category ${index+1}`).trim()||`Category ${index+1}`,
    color:safeCategoryColor0737(card.querySelector("[data-category-color0737]")?.value),
    enabled:!!card.querySelector("[data-category-enabled0737]")?.checked,
    match:card.querySelector("[data-category-match0737]")?.value==="any"?"any":"all",
    rules:[...card.querySelectorAll("[data-category-rule0737]")].map((row,ruleIndex)=>({
      id:row.dataset.ruleId||uid(),field:row.querySelector("[data-category-rule-field0737]")?.value||"accountId",operator:row.querySelector("[data-category-rule-operator0737]")?.value||"contains",value:(row.querySelector("[data-category-rule-value0737]")?.value||"").trim()
    }))
  }));
  data.settings.accountCategories={version:1,definitions};
  return definitions;
}
function saveAccountCategories0737(){
  const definitions=captureAccountCategoriesEditor0737();
  const names=definitions.map(category=>category.name.toLowerCase());
  const duplicate=names.find((name,index)=>names.indexOf(name)!==index);
  if(duplicate){alert("Each category needs a unique name.");return;}
  saveData(data);data=loadData();toast("Category rules saved and applied.");settings();
}
function wireAccountCategories0737(){
  document.getElementById("saveAccountCategories0737")?.addEventListener("click",saveAccountCategories0737);
  document.getElementById("addAccountCategory0737")?.addEventListener("click",()=>{
    captureAccountCategoriesEditor0737();
    const colors=["#22c55e","#38bdf8","#f59e0b","#a78bfa","#f43f5e","#14b8a6"];
    data.settings.accountCategories.definitions.push({id:uid(),name:`Category ${data.settings.accountCategories.definitions.length+1}`,color:colors[data.settings.accountCategories.definitions.length%colors.length],enabled:true,match:"all",rules:[{id:uid(),field:"accountId",operator:"contains",value:""}]});
    saveData(data);data=loadData();settings();
  });
  document.querySelectorAll("[data-add-category-rule0737]").forEach(button=>button.onclick=()=>{
    const card=button.closest("[data-category-card0737]");captureAccountCategoriesEditor0737();
    const category=data.settings.accountCategories.definitions.find(item=>item.id===card?.dataset.categoryId);if(!category)return;
    category.rules.push({id:uid(),field:"accountId",operator:"contains",value:""});saveData(data);data=loadData();settings();
  });
  document.querySelectorAll("[data-delete-category-rule0737]").forEach(button=>button.onclick=()=>{
    const card=button.closest("[data-category-card0737]");const row=button.closest("[data-category-rule0737]");captureAccountCategoriesEditor0737();
    const category=data.settings.accountCategories.definitions.find(item=>item.id===card?.dataset.categoryId);if(!category)return;
    category.rules=category.rules.filter(rule=>rule.id!==row?.dataset.ruleId);saveData(data);data=loadData();settings();
  });
  document.querySelectorAll("[data-delete-category0737]").forEach(button=>button.onclick=()=>{
    const card=button.closest("[data-category-card0737]");const name=card?.querySelector("[data-category-name0737]")?.value||"this category";
    if(!confirm(`Delete ${name}? Accounts will keep their data; only this automatic tag rule will be removed.`))return;
    captureAccountCategoriesEditor0737();data.settings.accountCategories.definitions=data.settings.accountCategories.definitions.filter(item=>item.id!==card?.dataset.categoryId);saveData(data);data=loadData();settings();
  });
  document.querySelectorAll("[data-category-rule-operator0737]").forEach(select=>select.onchange=()=>{const input=select.closest("[data-category-rule0737]")?.querySelector("[data-category-rule-value0737]");if(input)input.disabled=["present","empty"].includes(select.value);});
}

function demoModePanel0738(){
  const active=isDemoMode();
  const siteCount=Array.isArray(data?.sites)?data.sites.length:0;
  return `<div class="settingsStack demoModeSettings0738">
    <section class="card demoModeHero0738 ${active?'active':''}">
      <div class="demoModeHeroHead0738"><span class="demoModeShield0738">D</span><div><span>SAFE PRESENTATION WORKSPACE</span><h2>${active?'Demo Mode is Active':'Demo Mode'}</h2><p>${active?'FireVault is showing only fictional Boise-area customer information. Your real vault is not loaded into this workspace.':'Switch to a completely separate fictional dataset before showing FireVault to customers, managers, or other technicians.'}</p></div></div>
      <div class="demoModeStats0738"><div><strong>${active?siteCount:20}</strong><span>Demo Accounts</span></div><div><strong>Boise</strong><span>Simulated Area</span></div><div><strong>Protected</strong><span>Master Dataset</span></div></div>
      <div class="demoModeActions0738">${active?`<button class="primary" id="exitDemoMode0738">Exit Demo Mode</button><button class="ghost" id="resetDemoMode0738">Restore Demo Defaults</button>`:`<button class="primary" id="enterDemoMode0738">Enter Demo Mode</button>`}</div>
    </section>
    <section class="card demoModeInfo0738">
      <h3>What Demo Mode includes</h3>
      <div class="demoModeFeatureGrid0738">
        <div><b>20 fictional accounts</b><span>Boise, Garden City, Eagle, Meridian, and Kuna locations within about 15 miles of downtown Boise.</span></div>
        <div><b>Every communicator type</b><span>Sample CLSS, AlarmNet, IPDACT, and Basic account IDs.</span></div>
        <div><b>Complete account records</b><span>Contacts, panels, communicators, batteries, notes, visits, tasks, deficiencies, documents, and checklists without consuming vault storage.</span></div>
        <div><b>Map grouping</b><span>Two fictional campuses contain multiple accounts at one address.</span></div>
        <div><b>Automatic tags</b><span>Healthcare, Education, Priority Service, Multi-Building Campus, and Boise Metro.</span></div>
        <div><b>Simulated GPS</b><span>Nearby Accounts centers on downtown Boise so the demonstration works from any location.</span></div>
      </div>
    </section>
    <div class="settingsInfo540 warning"><strong>Real data protection</strong><span>The 20-account demo master is protected in the app and cannot be deleted. Changes are made only to a temporary working copy. Exiting Demo Mode discards those changes and reloads your real FireVault database exactly as it was. When no real vault exists, FireVault safely starts in Demo Mode by default.</span></div>
  </div>`;
}
function switchDemoMode0738(enabled,reset=false){
  const message=enabled?"Enter Demo Mode and temporarily hide the real customer vault?":"Exit Demo Mode and return to the real customer vault?";
  if(!confirm(message)) return;
  if(reset) resetDemoData();
  const changed=setDemoMode(enabled);
  if(enabled && !changed){toast("Demo Mode could not be activated because browser storage is unavailable.");return;}
  try{sessionStorage.removeItem(NEARBY_STATE_KEY_0652);sessionStorage.removeItem(`${NEARBY_STATE_KEY_0652}_demo`);sessionStorage.removeItem(DEMO_ACTIVE_JOB_KEY_0738);sessionStorage.removeItem(DEMO_ACTIVE_ROUTE_KEY_0738);}catch{}
  location.reload();
}
function wireDemoMode0738(){
  document.getElementById("enterDemoMode0738")?.addEventListener("click",()=>switchDemoMode0738(true,false));
  document.getElementById("exitDemoMode0738")?.addEventListener("click",()=>switchDemoMode0738(false,false));
  document.getElementById("resetDemoMode0738")?.addEventListener("click",()=>{if(!confirm("Discard all temporary demo changes and restore the protected 20-account Boise dataset?"))return;resetDemoData();location.reload();});
}

function settingsPanel(){
  const s=data.settings, t=s.theme, tech=s.technician, email=s.email, r=s.reports, o=s.overlay, a=s.advanced, gps=s.gps||{};
  const saveButton=(label="Save")=>`<button class="primary saveMini" id="saveSettings">${esc(label)}</button>`;

  if(settingsTab==="tech") return `<div class="settingsStack settingsStack540">
    ${settingsSection540("Identity","Technician Profile","This information is reused throughout reports, email templates, and photo stamps.",`<div class="settingsGrid settingsGrid540">${fieldBlock("Technician name",`<input id="techName" autocomplete="name" value="${esc(tech.name)}">`)}${fieldBlock("Company",`<input id="techCompany" autocomplete="organization" value="${esc(tech.company)}">`)}</div>`,"blue",saveButton())}
    ${settingsSection540("Contact","Contact & Credentials","Keep customer-facing contact details and your license or employee identifier together.",`<div class="settingsGrid settingsGrid540">${fieldBlock("Phone",`<input id="techPhone" autocomplete="tel" inputmode="tel" value="${esc(tech.phone)}">`)}${fieldBlock("Email",`<input id="techEmail" autocomplete="email" inputmode="email" value="${esc(tech.email)}">`)}${fieldBlock("License / ID",`<input id="techLicense" value="${esc(tech.license)}">`,`Optional identifier shown on reports`)}</div>`,"cyan")}
  </div>`;

  if(settingsTab==="reports") return `<div class="settingsStack settingsStack540">
    ${settingsSection540("Document setup","Report Defaults","Choose the title and level of detail FireVault uses for new service reports.",`<div class="settingsGrid settingsGrid540">${fieldBlock("Report title",`<input id="reportTitle" value="${esc(r.title)}">`)}${fieldBlock("Report format",`<select id="reportFormat"><option value="detailed" ${r.format==="detailed"?"selected":""}>Detailed</option><option value="compact" ${r.format==="compact"?"selected":""}>Compact</option></select>`,`Detailed includes more site history; Compact is faster to review.`)}</div>`,"violet",saveButton())}
    ${settingsSection540("Included content","Report Sections","Control which information is added automatically when a report is generated.",`<div class="settingsList settingsToggleList540">${checkBlock("repTech","Include technician profile",r.includeTechnician)}${checkBlock("repTasks","Include open and completed tasks",r.includeTasks)}${checkBlock("repDef","Include deficiencies",r.includeDeficiencies)}</div>`,"purple")}
  </div>`;

  if(settingsTab==="email") return emailSettingsPanel(email);
  if(settingsTab==="overlay") return overlaySettingsPanel510(o);

  if(settingsTab==="gps") return `<div class="settingsStack settingsStack540">
    ${settingsSection540("Navigation","Map Preferences","Set the map service, GPS accuracy, and distance used for nearby-account detection.",`<div class="settingsGrid settingsGrid540">${fieldBlock("Default map",`<select id="gpsMapProvider"><option value="apple" ${gps.mapProvider!=="google"?"selected":""}>Apple Maps</option><option value="google" ${gps.mapProvider==="google"?"selected":""}>Google Maps</option></select>`)}${fieldBlock("GPS accuracy",`<select id="gpsHighAccuracy"><option value="true" ${gps.highAccuracy!==false?"selected":""}>High accuracy</option><option value="false" ${gps.highAccuracy===false?"selected":""}>Standard</option></select>`)}${fieldBlock("Nearby radius",`<input id="gpsNearbyRadius" inputmode="decimal" value="${esc(gps.nearbyRadiusMiles||1)}">`,`Distance in miles used by Nearby Sites`)}</div>`,"green",saveButton())}
    ${settingsSection540("Availability","GPS Tools","Choose where location controls and saved coordinates are available.",`<div class="settingsList settingsToggleList540">${checkBlock("gpsEnabled","Show GPS capture buttons on site pages",gps.enabled!==false)}${checkBlock("gpsReports","Include GPS coordinates in reports",gps.includeInReports!==false)}</div><div class="settingsInfo540"><strong>Location permission required</strong><span>Browser GPS works only when FireVault is served over HTTPS and location access is allowed on the device.</span></div>`,"teal")}
  </div>`;

  if(settingsTab==="demo") return demoModePanel0738();

  if(settingsTab==="themes") return `<div class="settingsStack settingsStack540">
    ${settingsSection540("One-tap styles","Quick Themes","Apply a coordinated accent and contrast preset without changing your stored field data.",`<div class="presetGrid settingsPresetGrid540">${Object.entries(themePresets).map(([key,p])=>`<button class="ghost presetBtn" data-preset="${key}"><span class="themeSwatch" style="background:${p.accentColor}"></span><span>${p.label}</span></button>`).join("")}</div>`,"violet",saveButton("Apply"))}
    ${settingsSection540("Appearance","Interface Style","Fine-tune the color and shape of FireVault controls.",`<div class="settingsGrid settingsGrid540">${fieldBlock("Theme",`<select id="themeName">${Object.entries(themePresets).map(([key,p])=>`<option value="${key}" ${t.name===key?"selected":""}>${p.label}</option>`).join("")}</select>`)}${fieldBlock("Accent color",`<input id="themeAccent" type="color" value="${esc(t.accentColor||"#ef4444")}">`)}${fieldBlock("Button shape",`<select id="buttonStyle"><option value="rounded" ${t.buttonStyle!=="squared"?"selected":""}>Rounded</option><option value="squared" ${t.buttonStyle==="squared"?"selected":""}>Squared</option></select>`)}${fieldBlock("Card style",`<select id="cardStyle"><option value="glass" ${t.cardStyle!=="solid"?"selected":""}>Glass</option><option value="solid" ${t.cardStyle==="solid"?"selected":""}>Solid</option></select>`)}</div>`,"pink")}
    ${settingsSection540("Comfort","Readability & Feedback","Adjust contrast, text density, and tactile feedback for field use.",`<div class="settingsList settingsToggleList540 twoCol">${checkBlock("themeHighContrast","High contrast support",t.highContrast)}${checkBlock("themeLargeText","Larger text",t.largeText)}${checkBlock("themeCompact","Compact layout",t.compactLayout)}${checkBlock("themeHaptics","Haptic button feedback",s.app?.haptics!==false)}</div>`,"blue")}
  </div>`;

  if(settingsTab==="homeLayout") return homeLayoutPanel550();

  if(settingsTab==="visibility") {
    const mode=appMode(); const v=visibility();
    return `<div class="settingsStack simpleSettings472 settingsStack540">
      <div class="card settingGroup compactPane simpleHero472 settingsSection540 tone-red"><div class="paneHead settingsPaneHead540"><div><span class="settingsKicker540">Workspace</span><h2>Modules / Simple View</h2><p class="paneNote">Choose how much of FireVault appears during everyday field work.</p></div>${saveButton()}</div><div class="settingsSectionBody540"><div class="settingsGrid settingsGrid540">${fieldBlock("App mode",`<select id="viewMode"><option value="simple" ${mode==="simple"?"selected":""}>Simple View</option><option value="advanced" ${mode==="advanced"?"selected":""}>Advanced View</option><option value="power" ${mode==="power"?"selected":""}>Technician Power Mode</option></select>`,`Simple keeps the interface clean. Advanced shows enabled modules. Power shows everything.`)}</div><div class="viewModeQuick472"><button class="ghost" data-view-mode="simple">Simple</button><button class="ghost" data-view-mode="advanced">Advanced</button><button class="ghost" data-view-mode="power">Power</button></div></div></div>
      ${visibilityPresetCards474()}
      ${layoutPresetCards565()}
      <div class="card settingGroup compactPane settingsSection540 tone-amber modulesList540"><div class="paneHead settingsPaneHead540"><div><span class="settingsKicker540">Individual controls</span><h2>Module Visibility</h2><p class="paneNote">Turn off anything you do not use. Hidden modules remain available to enable again here.</p></div></div><div class="settingsSectionBody540"><div class="settingsList featureList472">${FEATURE_LABELS.map(([key,label,note])=>`<label class="checkRow featureCheck472"><input type="checkbox" id="vis_${key}" ${v[key]?"checked":""}><span><strong>${esc(label)}</strong><small>${esc(note)}</small></span></label>`).join("")}</div></div></div>
    </div>`;
  }

  if(settingsTab==="advanced") return `<div class="settingsStack settingsStack540">
    ${settingsSection540("Optional services","Advanced Features","Enable only the integrations used in your workflow. Some require permissions, APIs, subscriptions, or external services.",`<div class="settingsInfo540 warning"><strong><span class="featureStar">*</span> External service required</strong><span>Enabling a control does not connect or purchase an outside service.</span></div><div class="settingsList twoCol advancedGrid540">${[["advAi","aiTechnician","AI Technician"],["advReverse","reverseAddressLookup","Reverse Address Lookup *"],["advCloud","cloudBackup","Cloud Backup *"],["advVoice","voiceTranscription","Voice Transcription *"],["advOcr","ocrReader","OCR Reader *"],["advEmail","emailGateway","Email Gateway *"],["advWeather","weather","Weather Context *"],["advTraffic","traffic","Traffic / Routing *"]].map(x=>checkBlock(x[0],x[2],a[x[1]])).join("")}</div>`,"amber",saveButton())}
  </div>`;

  if(settingsTab==="sync") {
    const cfg=data.settings.sync||{};
    const sum=syncSummary(data);
    const queue=syncQueue(data).slice(0,12);
    const conflicts=syncConflicts(data);
    const activity=syncActivity(data).slice(0,12);
    const connected=!!data.syncState?.lastSuccessfulSync;
    const activityLabel={"package-export":"Package exported","package-import":"Package imported","conflict-resolved":"Conflict resolved","customer-csv-import":"Customer CSV imported"};
    return `<div class="settingsStack settingsStack540 syncStack062">
      ${settingsSection540("Shared-vault activity","Team & Sync Status","FireVault tracks technician identity, record changes, package transfers, and conflicts on this device.",`
        <div class="syncStatusGrid062">
          <div class="syncMetric062 red"><strong>${sum.pending}</strong><span>Pending changes</span></div>
          <div class="syncMetric062 green"><strong>${sum.synced}</strong><span>Synchronized</span></div>
          <div class="syncMetric062 amber"><strong>${sum.conflicts}</strong><span>Conflicts</span></div>
          <div class="syncMetric062 blue"><strong>${sum.total}</strong><span>Tracked records</span></div>
        </div>
        <div class="syncReadiness062"><span class="syncDot062 ${connected?'online':'local'}"></span><div><strong>${connected?'Package exchange active':'Local package mode'}</strong><small>${connected?`Last package import ${esc(data.syncState.lastSuccessfulSync)}`:'No Microsoft account is connected. Data remains safely local on this device.'}</small></div></div>
      `,"blue")}
      ${settingsSection540("Technician identity","Who is making changes","Record history uses the Technician Profile. Complete the profile before multiple technicians begin sharing a vault.",`
        <div class="syncIdentity062"><div><span>Technician</span><strong>${esc(data.settings.technician?.name||'Not assigned')}</strong></div><div><span>Email / identity</span><strong>${esc(data.settings.technician?.email||'Not assigned')}</strong></div><div class="wide"><span>Device ID</span><code>${esc(deviceIdentity())}</code></div></div>
      `,"slate")}
      ${settingsSection540("Package identity","Shared Vault Settings","These names are written into exported packages and the local transfer history.",`
        <div class="settingsGrid settingsGrid540">
          ${fieldBlock("Storage location",`<select id="syncProvider"><option value="onedrive" selected>Microsoft OneDrive / SharePoint</option></select>`,`Choose where Shared Vault Package files are stored manually.`)}
          ${fieldBlock("Organization or team",`<input id="syncOrganization" value="${esc(cfg.organization||'')}" placeholder="Company or department">`)}
          ${fieldBlock("Shared vault name",`<input id="syncWorkspace" value="${esc(cfg.workspace||'FireVault Shared Vault')}" placeholder="FireVault Shared Vault">`)}
          ${fieldBlock("Conflict handling",`<select id="syncConflict"><option value="review" ${cfg.conflictPolicy==='review'?'selected':''}>Require review</option><option value="newest" ${cfg.conflictPolicy==='newest'?'selected':''}>Newest change wins</option><option value="server" ${cfg.conflictPolicy==='server'?'selected':''}>Imported copy wins</option></select>`,`Require review is safest for site information and service records.`)}
        </div>
      `,"blue",saveButton())}
      ${settingsSection540("Controlled handoff","Shared Vault Package","Export a package to your selected storage location, then import it on another FireVault device.",`
        <div class="syncPackageActions063"><button class="primary" id="exportSyncPackage063">Export Shared Vault Package</button><label class="ghost fileAction063">Import Shared Vault Package<input id="importSyncPackage063" type="file" accept="application/json,.json" hidden></label></div>
        <div class="settingsInfo540"><strong>Package handoff is recorded</strong><span>Exports and imports are added to Sync Activity for accountability between devices.</span></div>
      `,"green")}
      ${settingsSection540("Review required","Conflict Center",conflicts.length?`${conflicts.length} competing edit${conflicts.length===1?'':'s'} need a decision.`:"No unresolved conflicts are currently stored.",`
        <div class="conflictCenter064">${conflicts.length?conflicts.map(c=>`<article><div class="conflictHead064"><span>Conflict</span><div><strong>${esc(c.title)}</strong><small>${esc(c.siteName)} · Local v${c.version} / Imported v${c.remoteVersion}</small></div></div><p>Choose which copy FireVault should keep. Keeping this device creates a new pending version; using the imported copy marks it synchronized.</p><div class="conflictActions064"><button class="ghost" data-resolve-conflict="local" data-record-id="${esc(c.id)}">Keep this device</button><button class="primary" data-resolve-conflict="remote" data-record-id="${esc(c.id)}">Use imported copy</button></div></article>`).join(""):`<div class="syncEmpty063"><strong>No conflicts</strong><span>Competing equal-version edits will appear here instead of being silently overwritten.</span></div>`}</div>
      `,"red")}
      ${settingsSection540("Recent handoffs","Sync Activity","A local audit timeline of package transfers and conflict decisions on this device.",`
        <div class="syncActivity064">${activity.length?activity.map(a=>`<div><span class="activityIcon064">${a.type==='package-import'||a.type==='customer-csv-import'?'↓':a.type==='package-export'?'↑':'✓'}</span><div><strong>${esc(activityLabel[a.type]||a.type)}</strong><small>${esc(new Date(a.at).toLocaleString())} · ${esc(a.technician||'Unassigned technician')}</small>${a.type==='customer-csv-import'?`<em>${esc(a.fileName||'Customer CSV')} · ${Number(a.stats?.added||0)} added · ${Number(a.stats?.updated||0)} updated · ${Number(a.stats?.geocoded||0)} coordinates</em>`:a.workspace?`<em>${esc(a.workspace)}</em>`:''}</div></div>`).join(""):`<div class="syncEmpty063"><strong>No activity yet</strong><span>Exports, imports, and conflict decisions will be recorded here.</span></div>`}</div>
      `,"amber")}
      ${settingsSection540("Pending work","Synchronization Queue",queue.length?`${queue.length} recent record changes are waiting for shared-vault package transfer.`:"No pending changes are waiting.",`
        <div class="syncQueue063">${queue.length?queue.map(q=>`<div class="syncQueueRow063"><span class="syncQueueState063 ${esc(q.status)}">${esc(q.status)}</span><div><strong>${esc(q.title)}</strong><small>${esc(q.siteName)} · v${q.version} · ${esc(q.modifiedBy)}${q.modifiedAt?` · ${esc(new Date(q.modifiedAt).toLocaleString())}`:''}</small></div></div>`).join(""):`<div class="syncEmpty063"><strong>Queue is clear</strong><span>New edits will appear here automatically.</span></div>`}</div>
      `,"slate")}
      <div class="settingsInfo540 warning"><strong>Automatic OneDrive synchronization is not connected</strong><span>Use Shared Vault Package export and import for controlled handoff. FireVault does not store Microsoft credentials.</span></div>
    </div>`;
  }

  if(settingsTab==="customerImport") return customerImportPanel065();
  if(settingsTab==="categories") return accountCategoriesPanel0737();
  if(settingsTab==="backup") return backupSettingsPanel();
  if(settingsTab==="manual") return manualPanel058();

  if(settingsTab==="updates") return `<div class="settingsStack settingsStack540 updateCenter072">
    ${settingsSection540("Installed version","FireVault Updates","FireVault checks the published site for newer app files while preserving your locally stored vault.",`<div class="updateBuild072"><div><strong>${BUILD}</strong><span>Installed build</span></div><div id="updateState072"><strong>Ready</strong><span>Automatic checks enabled</span></div></div>`,"green")}
    ${settingsSection540("Update controls","Maintenance","Use Check for Updates first. Clear App Cache removes only downloaded app files—it does not delete sites, notes, photos, or settings stored in FireVault.",`<div class="updateActions072"><button class="primary" id="checkUpdates072">Check for Updates</button><button class="ghost" id="reloadApp072">Reload FireVault</button><button class="ghost" id="clearAppCache072">Clear App Cache</button></div><p class="fieldNote">Home Screen PWAs still require an internet connection to receive a newly published build. Offline startup continues using the last successfully installed version.</p>`,"cyan")}
  </div>`;

  return `<div class="settingsStack settingsStack540">
    ${settingsSection540("Fire alarm field system",`About FireVault`,`A modular field knowledge system built to keep account history, service notes, and technician tools together.`,`<div class="aboutBrand540">${fireVaultBrand575()}<span>Field Vault System</span></div><p class="aboutCopy540">FireVault is designed for fast field reference, local-first reliability, and a simple interface that can reveal advanced tools only when they are needed.</p>`,"red")}
    ${settingsSection540("Application details","Build Information","Use these details when reporting a problem or confirming which version is installed.",`<div class="aboutGrid aboutGrid540"><div><strong>Build</strong><span>${BUILD}</span></div><div><strong>Storage key</strong><span>${demoStorageLabel0739()}</span></div><div class="wide"><strong>Data location</strong><span>Local vault on this device with rolling safety snapshots. Download an external backup before deleting or reinstalling the Home Screen app.</span></div></div>`,"slate")}
  </div>`;
}
function wireSettingsPanel(){
  const saveBtn=document.getElementById("saveSettings"); if(saveBtn) saveBtn.onclick=saveSettings;
  if(settingsTab==="overlay") wireOverlaySettings510();
  if(settingsTab==="demo") wireDemoMode0738();
  if(settingsTab==="manual") wireManual058();
  if(settingsTab==="customerImport") wireCustomerImport065();
  if(settingsTab==="categories") wireAccountCategories0737();
  if(settingsTab==="updates"){
    const state=document.getElementById("updateState072");
    const setState=(title,note)=>{if(state)state.innerHTML=`<strong>${esc(title)}</strong><span>${esc(note)}</span>`;};
    document.getElementById("checkUpdates072")?.addEventListener("click",async()=>{setState("Checking…","Contacting the published FireVault site");try{const result=await window.fireVaultCheckForUpdates?.({reloadWhenNew:false});if(result?.newer)setState("Update found",`Build ${result.remote} is being prepared`);else setState("Up to date",`Build ${BUILD} is current`);}catch(err){setState("Check failed",err?.message||"Internet connection unavailable");}});
    document.getElementById("reloadApp072")?.addEventListener("click",()=>location.reload());
    document.getElementById("clearAppCache072")?.addEventListener("click",async()=>{if(!confirm("Clear downloaded FireVault app files and reload? Your saved vault data will not be deleted."))return;setState("Clearing…","Removing cached app files");try{await window.fireVaultClearAppCache?.();location.reload();}catch(err){setState("Could not clear",err?.message||"Cache operation failed");}});
  }
  ["emailSubject","emailSig"].forEach(id=>{ const el=document.getElementById(id); if(el){ el.addEventListener("focus",()=>lastEmailTemplateField=id); el.addEventListener("input",updateEmailPreview); } });
  [["emailTo","emailPreviewTo530","Customer email added when sending"],["emailCc","emailPreviewCc530","None"]].forEach(([inputId,previewId,fallback])=>{ const input=document.getElementById(inputId); const preview=document.getElementById(previewId); if(input&&preview) input.addEventListener("input",()=>preview.textContent=input.value.trim()||fallback); });
  document.querySelectorAll(".emailTagChip").forEach(b=>b.onclick=()=>{ const target=document.getElementById(lastEmailTemplateField) || document.getElementById("emailSubject"); insertAtCursor(target, b.dataset.emailTag || ""); });
  document.querySelectorAll(".presetBtn").forEach(b=>b.onclick=()=>{ const p=themePresets[b.dataset.preset]; data.settings.theme.name=b.dataset.preset; data.settings.theme.accentColor=p.accentColor; if(p.highContrast) data.settings.theme.highContrast=true; save(); settings(); toast("Theme applied."); });
  document.querySelectorAll("[data-view-mode]").forEach(b=>b.onclick=()=>setViewMode(b.dataset.viewMode));
  document.querySelectorAll("[data-feature-preset]").forEach(b=>b.onclick=()=>applyFeaturePreset474(b.dataset.featurePreset));
  document.querySelectorAll("[data-layout-preset]").forEach(b=>b.onclick=()=>applyLayoutPreset565(b.dataset.layoutPreset));
  document.querySelectorAll("[data-home-layout-preset]").forEach(b=>b.onclick=()=>applyHomeLayoutPreset550(b.dataset.homeLayoutPreset));
  document.querySelectorAll("[data-home-card-state]").forEach(b=>b.onclick=()=>setAllHomeCardState550(b.dataset.homeCardState==="collapse"));
  const resetHome550=document.getElementById("resetHomeLayout550"); if(resetHome550) resetHome550.onclick=()=>{ if(confirm("Reset optional Home cards to their default visibility and remember-last behavior?")) resetHomeLayout550(); };
  if(settingsTab==="homeLayout"){
    document.querySelectorAll('[id^="homeVisible_"], [id^="homeBehavior_"]').forEach(el=>el.addEventListener("change",()=>{ captureSettingsScroll576(); updateHomeLayoutPreview550(); }));
    updateHomeLayoutPreview550();
  }
  if(settingsTab==="visibility"){
    document.querySelectorAll(".featureCheck472 input[type=checkbox], #viewMode").forEach(el=>el.addEventListener("change",captureSettingsScroll576));
  }
  if(settingsTab==="sync"){
    const exportPackage=document.getElementById("exportSyncPackage063");
    if(exportPackage) exportPackage.onclick=()=>{ const pkg=createSyncPackage(data); const stamp=new Date().toISOString().slice(0,10); downloadBlob(`firevault-shared-vault-${stamp}.json`,JSON.stringify(pkg,null,2),"application/json"); notePackageExport(data,pkg); data=loadData(); settings(); toast("Shared Vault package exported and recorded."); };
    const importPackage=document.getElementById("importSyncPackage063");
    if(importPackage) importPackage.onchange=e=>{ const file=e.target.files?.[0]; if(!file)return; const reader=new FileReader(); reader.onload=()=>{ try{ const stats=importSyncPackage(data,JSON.parse(reader.result)); data=loadData(); settings(); alert(`Shared Vault package imported.\n\nAdded: ${stats.added}\nUpdated: ${stats.updated}\nMatched: ${stats.matched}\nConflicts: ${stats.conflicts}\nLocal newer: ${stats.localNewer}`); }catch(err){ alert(err?.message||"Shared Vault import failed."); } }; reader.readAsText(file); };
    document.querySelectorAll("[data-resolve-conflict]").forEach(btn=>btn.onclick=()=>{ const choice=btn.dataset.resolveConflict; const id=btn.dataset.recordId; const label=choice==="remote"?"use the imported copy":"keep this device copy"; if(!confirm(`Resolve this conflict and ${label}?`)) return; try{ resolveSyncConflict(data,id,choice); data=loadData(); settings(); toast("Conflict resolved."); }catch(err){ alert(err?.message||"Conflict resolution failed."); } });
  }
  const exportBtn=document.getElementById("exportBtn"); if(exportBtn) exportBtn.onclick=()=>{ const stamp=new Date().toISOString().slice(0,10); fvSafeSet0739("firevault_last_backup_export",new Date().toLocaleString()); downloadBlob(`firevault-backup-${stamp}-build-${BUILD}.json`, JSON.stringify(data,null,2), "application/json"); toast("Backup exported."); settings(); };
  const downloadAuto=document.getElementById("downloadAutoBackup0722"); if(downloadAuto) downloadAuto.onclick=()=>{ const snapshot=latestAutoBackup(); if(!snapshot){toast("No automatic snapshot available.");return;} const stamp=new Date(snapshot.createdAt||Date.now()).toISOString().slice(0,19).replace(/[:T]/g,"-"); downloadBlob(`firevault-auto-backup-${stamp}-build-${snapshot.build||BUILD}.json`,JSON.stringify(snapshot,null,2),"application/json"); toast("Automatic snapshot downloaded."); };
  const restoreAuto=document.getElementById("restoreAutoBackup0722"); if(restoreAuto) restoreAuto.onclick=()=>{ const info=autoBackupInfo(); const latest=info.last; if(!latest){toast("No automatic snapshot available.");return;} if(!confirm(`Restore the latest automatic snapshot from ${new Date(latest.createdAt).toLocaleString()}? FireVault will preserve the current vault as another safety snapshot first.`)) return; try{ data=restoreAutoBackup(latest.key); applyTheme(); toast("Automatic snapshot restored."); route("home"); }catch(err){alert(err?.message||"Snapshot restore failed.");} };
  const copyBackupSummaryBtn=document.getElementById("copyBackupSummaryBtn"); if(copyBackupSummaryBtn) copyBackupSummaryBtn.onclick=async()=>{ try{ await navigator.clipboard.writeText(backupSummaryText()); toast("Backup summary copied."); }catch{ toast("Clipboard unavailable."); } };
  const importFile=document.getElementById("importFile"); if(importFile) importFile.onchange=e=>{ const f=e.target.files[0]; if(!f)return; const r=new FileReader(); r.onload=()=>{try{const parsed=JSON.parse(r.result); const incoming=parsed?.data && Array.isArray(parsed.data.sites) ? parsed.data : parsed; if(!incoming || !Array.isArray(incoming.sites)) throw new Error("Invalid FireVault backup."); data=loadData(); Object.assign(data,incoming); saveData(data); data=loadData(); applyTheme(); toast("Backup imported."); route("home");}catch(err){alert(err?.message||"Import failed.");}}; r.readAsText(f); };
  const resetBtn=document.getElementById("resetBtn"); if(resetBtn) resetBtn.onclick=()=>{ const demo=isDemoMode(); const promptText=demo?"Reset the fictional Demo Mode database to its original 20 Boise accounts?":"Clear FireVault local data on this browser? Export a backup first if you need this vault later."; if(confirm(promptText)){ if(demo) resetDemoData(); else localStorage.removeItem(KEY); data=loadData(); applyTheme(); route("home");} };
}
function saveSettings(){
  const s=data.settings;
  if(settingsTab==="tech") s.technician={name:val("techName"),company:val("techCompany"),phone:val("techPhone"),email:val("techEmail"),license:val("techLicense"),defaultRole:"Fire Alarm Technician"};
  if(settingsTab==="reports") s.reports={...s.reports,title:val("reportTitle")||"FireVault Service Report",format:val("reportFormat"),includeTechnician:checked("repTech"),includeTasks:checked("repTasks"),includeDeficiencies:checked("repDef")};
  if(settingsTab==="email") s.email={...s.email,defaultTo:val("emailTo"),cc:val("emailCc"),defaultSubject:val("emailSubject"),signature:raw("emailSig")};
  if(settingsTab==="overlay") s.overlay={...s.overlay,...collectOverlayFromInputs510()};
  if(settingsTab==="gps") s.gps={enabled:checked("gpsEnabled"),mapProvider:val("gpsMapProvider")||"apple",highAccuracy:val("gpsHighAccuracy")!=="false",includeInReports:checked("gpsReports"),nearbyRadiusMiles:Number(val("gpsNearbyRadius"))||1};
  if(settingsTab==="themes") { s.theme={name:val("themeName"),accentColor:val("themeAccent"),highContrast:checked("themeHighContrast"),largeText:checked("themeLargeText"),compactLayout:checked("themeCompact"),buttonStyle:val("buttonStyle"),cardStyle:val("cardStyle")}; s.app={...(s.app||{}),haptics:checked("themeHaptics"),viewMode:s.app?.viewMode||"simple"}; }
  if(settingsTab==="homeLayout") {
    const cards={};
    HOME_LAYOUT_CARDS_550.forEach(card=>cards[card.key]={visible:checked(`homeVisible_${card.key}`),behavior:val(`homeBehavior_${card.key}`)||"remember"});
    s.homeLayout={preset:"custom",cards};
  }
  if(settingsTab==="visibility") { s.app={...(s.app||{}),viewMode:val("viewMode")||"simple",activeFeaturePreset575:"",activeLayoutPreset575:""}; const next={...visibility()}; FEATURE_LABELS.forEach(([key])=>next[key]=checked("vis_"+key)); s.visibility=next; }
  if(settingsTab==="advanced") s.advanced={aiTechnician:checked("advAi"),reverseAddressLookup:checked("advReverse"),cloudBackup:checked("advCloud"),voiceTranscription:checked("advVoice"),ocrReader:checked("advOcr"),emailGateway:checked("advEmail"),weather:checked("advWeather"),traffic:checked("advTraffic")};
  if(settingsTab==="sync") s.sync={...(s.sync||{}),provider:val("syncProvider")||"onedrive",organization:val("syncOrganization"),workspace:val("syncWorkspace")||"FireVault Shared Vault",conflictPolicy:val("syncConflict")||"review",enabled:false};
  save(); toast("Settings saved."); view="settings"; mode="settingsDetail"; render();
}


function stabilityReport(){
  const issues=[];
  const pass=[];
  const routeNames=["home","dailySummary","routeLog","actionCenter","pinnedSites","sites","nearbySites","attention","siteDetail","visits","visitDetail","checklist","siteForm","contactsList","contactForm","siteDocs","siteDocForm","equipmentList","equipmentForm","tasks","taskForm","deficiencies","deficiencyForm","report","library","resourceForm","jobMode","serviceVisit","settings","diagnostics","dataTools"];
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
    `Storage Key: ${demoStorageLabel0739()}`,
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
  fvSafeSet0739("firevault_last_stability_check",new Date().toLocaleString());
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
    fvSafeSet0739("firevault_last_restore_build",String(p.build||"Unknown"));
    fvSafeSet0739("firevault_last_restore_time",new Date().toISOString());
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
      <div class="card errorBox"><p>Build: ${BUILD}</p><p>Total Tasks: ${totalTasks}</p><p>Due Today: ${taskCounts.today}</p><p>Site Follow-Ups: ${serviceTasks}</p><p>Total Deficiencies: ${totalDef}</p><p>Closed Deficiencies: ${closedDefTotal}</p><p>Total Contacts: ${totalContacts}</p><p>Total Documents: ${totalDocs}</p><p>Report Deliveries: ${totalReportDeliveries}</p><p>Report Follow-Ups: ${reportFollowUps}</p><p>Checklist Items: ${totalChecklist}</p><p>Checklist Issues: ${checklistIssues}</p><p>Completed Inspections: ${completedInspections}</p><p>Attention Sites: ${healthWarn}</p><p>Watch Sites: ${healthWatch}</p><p>Old Job Record: ${activeJob ? esc(activeJob.siteName) : "None"}</p><p>Current Theme: ${esc(data.settings.theme.name)}</p><p>Accent: ${esc(data.settings.theme.accentColor)}</p><p>Route Days: ${(data.routeLogs||[]).length}</p><p>GPS Tools: ${data.settings.gps?.enabled !== false ? "Enabled" : "Hidden"}</p><p>Nearby Radius: ${nearbyRadiusMiles()} mi</p><p>Haptics: ${data.settings.app?.haptics !== false ? "Enabled" : "Off"}</p><p>Last Stability Check: ${esc(lastCheck)}</p><p>Storage key: ${demoStorageLabel0739()}</p><p>Modules loaded successfully.</p></div>
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
    "Build 0.73.9 repairs the Demo Mode QuotaExceededError by keeping the 20-account Boise workspace in temporary memory and making noncritical startup preference writes fail safely when device storage is full.",
    "Build 0.73.7 adds rule-driven multi-category account tags, repairs Settings tab spacing, and blends the global logo header into page content.",
    "Build 0.73.6 removes Plus Code text from Nearby cards, redesigns the Accounts directory, and replaces Settings folders with direct category tabs.",
    "Build 0.73.5 redesigns Account Detail with five information tabs, groups same-address accounts on the Nearby map, and removes the cellular coverage tool.",
    "Build 0.73.4 adds the Tools hub and global navigation structure.",
    "Build 0.73.2 restores the brighter selected-account green and adds an old-school terminal typing sequence for database and latest-version checks on the splash screen.",
    "Build 0.73.1 keeps different buildings at the same address as separate customer records by matching the complete Account ID, including CLSS dash suffixes such as G7C1234-01 and G7C1234-02.",
    "Build 0.73.0 introduced the unified FireVault design system and consistent dynamic navigation controls.",
    "Build 0.71.6 fixes a Nearby startup crash by making the selected-account phone/contact lookup safe when no account is selected yet.",
    "Build 0.71.5 removes the selected-account map box and displays the account name and address as clean white text with a strong black shadow.",
    "Build 0.71.4 keeps MAP / LIST visible on narrow screens, replaces the category dropdown with a compact filter icon, moves the selected account overlay to the map’s top-left, and refreshes GPS/map from the bottom Nearby button.",
    "Build 0.71.3 repairs the Nearby module startup error while preserving the improved account metadata layout, selected-account map overlay, and header spacing.",
    "Build 0.69.9 enlarges Nearby Open, Route, and Call controls, changes selected accounts to a glowing green treatment, extends the account list to 25 miles, and adapts the overview radius to the selected account distance.",
    "Build 0.69.8 makes Nearby list taps select the tapped account reliably, zooms the map to street level around that account, and forces all account markers to render as true circles.",
    "Build 0.69.6 hides map details until a marker is tapped, stabilizes momentum list settling, and moves the map closer to the top with a simpler header.",
    "Manual chapters document installation, Today, Sites, Site Detail, field workflow, notes, tasks, deficiencies, photos, GPS, route tracking, reports, email, settings, backups, updates, and troubleshooting.",
    "Added living-documentation revision metadata and a release-state review requirement.",
    "Added Quick Capture for timestamped site notes, follow-up tasks, and deficiencies without leaving Today.",
    "Quick Capture defaults to the active or most recently used account and can create a matching task from a deficiency.",
    "Field Dashboard counters now open the correct Daily Report and Daily Route workspaces.",
    "Daily Route, Copy Summary, and Today’s Accounts controls are now fully connected.",
    "Preserved the 0.55.0 Home Layout controls, scoped Settings design, Email composer, responsive layouts, and all existing data."
  ];
  const overlay=document.createElement("div");
  overlay.className="releaseOverlay";
  overlay.innerHTML=`<div class="releaseSheet" role="dialog" aria-modal="true" aria-label="FireVault release notes">
    <div class="releaseHead"><div><strong>${fireVaultBrand575()}</strong><span>Build ${BUILD}</span></div><button class="ghost iconBtn" id="closeRelease" aria-label="Close release notes">×</button></div>
    <div class="releaseBody"><h2>Release Notes</h2><p class="releaseIntro">Quota-safe Demo Mode with 20 fictional Boise-area accounts.</p><ul>${notes.map(n=>`<li>${esc(n)}</li>`).join("")}</ul></div>
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
    const autoGpsKey069="firevault_auto_gps_refresh_0691";
    let autoGpsAlready069=false;
    try{autoGpsAlready069=sessionStorage.getItem(autoGpsKey069)==="1";}catch{}
    if((view||"home")==="home" && (isDemoMode() || navigator.geolocation) && data.settings.gps?.enabled!==false && !autoGpsAlready069){
      try{sessionStorage.setItem(autoGpsKey069,"1");}catch{}
      setTimeout(()=>runNearbyScan0652("home"),350);
    }
    document.body.classList.add("app-chrome-ready536");
    if((view||"home")==="home"){
      setHomeChrome069(true);
    }else{
      showGlobalChrome537();
      document.getElementById("appHeader")?.removeAttribute("style");
      document.getElementById("appNav")?.removeAttribute("style");
    }
    window.__FIREVAULT_BOOTED = true;
    fvSafeSet0739("firevault_last_boot_ok",new Date().toLocaleString());
    fvSafeSet0739("firevault_last_boot_build",BUILD);
    fvSafeSet0739("firevault_last_boot_route",view||"home");
    fvSafeRemove0739("firevault_last_boot_error");
  }catch(err){
    window.__FIREVAULT_LAST_ERROR = err && err.message ? err.message : String(err);
    try{
      fvSafeSet0739("firevault_last_boot_error",window.__FIREVAULT_LAST_ERROR);
      fvSafeSet0739("firevault_last_boot_build",BUILD);
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
