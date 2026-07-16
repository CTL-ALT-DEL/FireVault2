import { BUILD, KEY, loadData, saveData, ensureSite, fullAddress, esc, uid, downloadBlob, syncSummary, syncQueue, syncConflicts, syncActivity, createSyncPackage, importSyncPackage, resolveSyncConflict, notePackageExport, deviceIdentity, recordSyncActivity, autoBackupInfo, latestAutoBackup, restoreAutoBackup, isDemoMode, setDemoMode, resetDemoData, securityFoundationSummary, securityAudit, recycleBinInfo, restoreRecycleRecord, purgeRecycleBin, recordSecurityEvent, validateVaultIntegrity } from "./storage.js?v=1.01.3";
import { backendAdapterSummary, runBackendAdapterDiagnostics, backendAdapterManifest, PROVIDER_CONTRACT_VERSION, FILE_STORAGE_CATALOG, fileStoragePlanSummary, cloudFileStorageManifest, MICROSOFT_STORAGE_TYPES, microsoftStorageAccounts, saveMicrosoftStorageAccounts, createMicrosoftStorageAccount, microsoftStorageAccountById, microsoftAppRegistration, saveMicrosoftAppRegistration, microsoftStorageSummary, microsoftStorageManifest } from "./providers.js?v=1.01.3";
import { encodePlusCode, isValidFullPlusCode, normalizePlusCode, plusCodePrecisionLabel } from "./open-location-code.js?v=1.01.3";
import { hydrateVaultMedia, stageVaultMedia, prepareVaultWithMedia, mediaStorageSummary, requestPersistentMediaStorage, pruneOrphanedMedia, flushMediaWrites } from "./media-store.js?v=1.01.3";
import { APP_PROFILE, APP_PROFILE_SCHEMA_VERSION, appTerm, appLabel, appNavigationLabel, appProfileExport } from "./app-profile.js?v=1.01.3";
import { MODULE_REGISTRY, MODULE_REGISTRY_VERSION, MODULE_CLASSIFICATIONS, FUTURE_APP_COLUMNS, moduleRegistrySummary, moduleMatrixRows, moduleRegistryExport } from "./module-registry.js?v=1.01.3";
import { MODULE_BINDINGS_VERSION, NAV_MODULE_REQUIREMENTS as NAV_MODULE_REQUIREMENTS_0955, ROUTE_MODULE_REQUIREMENTS as ROUTE_MODULE_REQUIREMENTS_0955, SETTINGS_MODULE_REQUIREMENTS as SETTINGS_MODULE_REQUIREMENTS_0955, ACCOUNT_TAB_BINDINGS, requirementsMet as moduleRequirementsMetFromBindings0955, moduleBindingsExport } from "./module-bindings.js?v=1.01.3";
import { RECORD_SCHEMA, RECORD_SCHEMA_VERSION, recordFieldById, activeRecordFields, recordFieldEnabled, recordFieldRequired, activeDetailSections, recordDetailSectionEnabled, recordPhotoCategories, recordSchemaSummary, recordSchemaExport } from "./record-schema.js?v=1.01.3";
import { WORKFLOW_SCHEMA, WORKFLOW_SCHEMA_VERSION, activeWorkflowActions, workflowActionEnabled, quickPhotoWorkflow, workflowSchemaSummary, workflowSchemaExport } from "./workflow-schema.js?v=1.01.3";
import { THEME_PROFILE_SCHEMA_VERSION, resolveThemeProfile, applyThemeProfile, themeBrandAsset, themeWordmarkMarkup, themeProfileSummary, themeProfileExport } from "./theme-profile.js?v=1.01.3";
import { CONTENT_PACK_SCHEMA_VERSION, CONTENT_SOURCE_TYPES, CONTENT_SOURCES, CONTENT_PACKS, resolveContentPackProfile, activeContentSources, activeContentPacks, contentPackLibraryFolders, contentPackSummary, contentPackRegistryExport } from "./content-pack-registry.js?v=1.01.3";
import { SYNC_STORAGE_PROFILE_SCHEMA_VERSION, STORAGE_PROVIDER_TYPES, STORAGE_PROVIDERS, STORAGE_ROLES, resolveSyncStorageProfile, activeStorageProviders, storageProviderEnabled, storageRoleProviders, syncStorageSettingsTabEnabled, syncStorageSummary, syncStorageProfileExport } from "./sync-storage-profile.js?v=1.01.3";
import { APP_FORGE_BLUEPRINT_SCHEMA_VERSION, appForgeReadinessSummary, validateAppForgeProfile, appForgeBlueprintExport } from "./app-forge-blueprint.js?v=1.01.3";
import { APP_FORGE_RECIPE_SCHEMA_VERSION, appForgeRecipes, appForgeRecipeSummary, appForgeRecipeBlueprintExport, appForgeRecipeCatalogExport } from "./app-forge-recipes.js?v=1.01.3";
import { APP_FORGE_FACTORY_SCHEMA_VERSION, createAppForgeGenerationRequest, appForgeFactoryManifest, appForgeFactorySummary, appForgeFactorySchemaExport } from "./app-forge-factory.js?v=1.01.3";
import { APP_FORGE_GENERATOR_SCHEMA_VERSION, appForgeGeneratorPlan, appForgeGeneratorSummary, generateAppForgePwaPackage, appForgeGeneratorSchemaExport } from "./app-forge-generator.js?v=1.01.3";
window.__FIREVAULT_MODULE_READY = true;
window.__FIREVAULT_BUILD = BUILD;
const ACTIVE_THEME_0958=resolveThemeProfile(APP_PROFILE);
const ACTIVE_CONTENT_PROFILE_0959=resolveContentPackProfile(APP_PROFILE);
const ACTIVE_SYNC_STORAGE_PROFILE_0960=resolveSyncStorageProfile(APP_PROFILE);
const ACTIVE_APP_FORGE_READINESS_0970=appForgeReadinessSummary(APP_PROFILE);
const ACTIVE_APP_FORGE_VALIDATION_0970=validateAppForgeProfile(APP_PROFILE);
const APP_FORGE_RECIPES_0980=appForgeRecipes();
const APP_FORGE_RECIPE_SUMMARY_0980=appForgeRecipeSummary();
const APP_FORGE_FACTORY_SUMMARY_0990=appForgeFactorySummary(BUILD);
const APP_FORGE_FACTORY_MANIFESTS_0990=APP_FORGE_RECIPES_0980.map(recipe=>appForgeFactoryManifest(recipe.id,BUILD)).filter(Boolean);
const APP_FORGE_GENERATOR_SUMMARY_1000=appForgeGeneratorSummary(BUILD);
const APP_FORGE_GENERATOR_PLANS_1000=APP_FORGE_RECIPES_0980.map(recipe=>appForgeGeneratorPlan(recipe.id,BUILD)).filter(Boolean);

function applyAppProfileFoundation0953(){
  applyThemeProfile(APP_PROFILE);
  document.title=APP_PROFILE.name;
  const navMap={"nav-home":"nearby","nav-sites":"search","nav-photo":"photo","nav-settings":"settings"};
  Object.entries(navMap).forEach(([id,key])=>{
    const button=document.getElementById(id);if(!button)return;
    const label=appNavigationLabel(key);const span=button.querySelector("span");if(span)span.textContent=label;
    const accessible=key==="nearby"?appLabel("nearbyRecords"):key==="search"?appLabel("searchRecords"):key==="photo"?`Take a photo for the selected ${appTerm("account",1,{lower:true})}`:label;
    button.setAttribute("aria-label",accessible);
  });
  const theme=document.querySelector('meta[name="theme-color"]');if(theme)theme.setAttribute("content",ACTIVE_THEME_0958.chrome.themeColor);
  applyModuleNavigation0955();
}
function recordTerm0954(count=1,lower=false){return appTerm("account",count,lower?{lower:true}:{});}
function recordIdLabel0954(){return APP_PROFILE.terminology.recordId||`${recordTerm0954()} ID`;}

/* Build 0.95.5 — module-aware navigation, routes, account tools, and Settings. */
const ENABLED_MODULES_0955=new Set(APP_PROFILE.enabledModules||[]);
function moduleEnabled0955(id){return ENABLED_MODULES_0955.has(String(id||""));}
function moduleRequirementsMet0955(ids=[]){return moduleRequirementsMetFromBindings0955(ENABLED_MODULES_0955,ids);}
function moduleAnyEnabled0955(ids=[]){return (ids||[]).some(moduleEnabled0955);}
function settingsTabEnabled0955(id){return moduleRequirementsMet0955(SETTINGS_MODULE_REQUIREMENTS_0955[id]||[])&&syncStorageSettingsTabEnabled(APP_PROFILE,id);}
function routeEnabled0955(name){return moduleRequirementsMet0955(ROUTE_MODULE_REQUIREMENTS_0955[name]||[]);}
function moduleRouteFallback0955(){
  if(moduleEnabled0955("core.search"))return "sites";
  if(moduleEnabled0955("core.nearby"))return "home";
  return "settings";
}
function resolveModuleRoute0955(name){
  if(routeEnabled0955(name))return name;
  if(["equipmentList","equipmentForm","tasks","taskForm","deficiencies","deficiencyForm","report","siteDocs","siteDocForm","jobMode"].includes(name) && moduleEnabled0955("core.records"))return "siteDetail";
  return moduleRouteFallback0955();
}
function applyModuleNavigation0955(){
  const controls=[
    ["nav-home","nearby"],["nav-sites","search"],["nav-photo","photo"],["nav-settings","settings"],
    ["homeNearbyNav069","nearby"],["homeAccounts069","search"],["homePhotoNav0950","photo"],["homeSettingsNav069","settings"]
  ];
  controls.forEach(([id,key])=>{const el=document.getElementById(id);if(!el)return;const enabled=moduleRequirementsMet0955(NAV_MODULE_REQUIREMENTS_0955[key]||[]);el.hidden=!enabled;el.toggleAttribute("aria-hidden",!enabled);});
  [document.getElementById("appNav"),document.querySelector(".nearbyBottomNav069")].filter(Boolean).forEach(nav=>{
    const count=Array.from(nav.children).filter(el=>!el.hidden).length||1;
    nav.classList.add("fvModuleNav0955");nav.style.setProperty("--fv-module-nav-count",String(count));nav.dataset.moduleNavCount=String(count);
  });
}
function recordFieldOn0956(id){return recordFieldEnabled(APP_PROFILE,id);}
function moduleAccountTabs0955(){
  return ACCOUNT_TAB_BINDINGS.filter(item=>recordDetailSectionEnabled(APP_PROFILE,item.key)&&moduleRequirementsMet0955(item.modules)).map(item=>[item.key,item.term?appTerm(item.term,2):item.label,item.modules]);
}
function normalizeAccountTabForModules0955(value){const tabs=moduleAccountTabs0955();return tabs.some(([key])=>key===value)?value:(tabs[0]?.[0]||"overview");}

/* Build 0.95.7 — profile-defined actions and capture workflow presets. */
const QUICK_PHOTO_WORKFLOW_0957=quickPhotoWorkflow(APP_PROFILE);
function workflowActions0957(surface){return activeWorkflowActions(APP_PROFILE,surface);}
function workflowActionOn0957(surface,id){return workflowActionEnabled(APP_PROFILE,surface,id);}
function workflowActionCount0957(surface){return Math.max(1,workflowActions0957(surface).length);}
function workflowActionStyle0957(surface){return `--fv-workflow-action-count:${workflowActionCount0957(surface)}`;}
function workflowPhotoCategories0957(){return RECORD_PHOTO_CATEGORIES_0956.map(category=>category.label);}
function workflowPhotoDefaultCategory0957(){
  const configured=String(APP_PROFILE.workflows?.quickPhoto?.defaultCategoryId||"");
  const match=RECORD_PHOTO_CATEGORIES_0956.find(category=>category.id===configured);
  return match?.label||DEFAULT_PHOTO_CATEGORY_0956;
}

applyAppProfileFoundation0953();

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


/* Build 0.79.1 — optional local privacy lock.
   This is a device-level privacy control, not cloud authentication or vault encryption. */
const PRIVACY_LOCK_KEY_0791 = "firevault_privacy_lock_v0791";
const PRIVACY_UNLOCKED_KEY_0791 = "firevault_privacy_unlocked_v0791";
const PRIVACY_EVENTS_KEY_0791 = "firevault_privacy_events_v0791";
const PRIVACY_FAILED_KEY_0791 = "firevault_privacy_failed_v0791";
const PRIVACY_COOLDOWN_KEY_0791 = "firevault_privacy_cooldown_v0791";
const PRIVACY_HASH_ITERATIONS_0791 = 120000;
let privacyTimer0791 = 0;
let privacyRuntimeInstalled0791 = false;
let privacyRecoveryMode0791 = false;

function privacyConfig0791(){
  try{
    const value=JSON.parse(localStorage.getItem(PRIVACY_LOCK_KEY_0791)||"null");
    return value&&value.enabled&&value.pinHash&&value.pinSalt?value:null;
  }catch{return null;}
}
function privacyWriteConfig0791(value){
  try{localStorage.setItem(PRIVACY_LOCK_KEY_0791,JSON.stringify(value));return true;}catch(err){console.error("Privacy lock settings could not be saved",err);return false;}
}
function privacySessionUnlocked0791(){
  try{return sessionStorage.getItem(PRIVACY_UNLOCKED_KEY_0791)==="1";}catch{return false;}
}
function privacySetSessionUnlocked0791(on){
  try{if(on)sessionStorage.setItem(PRIVACY_UNLOCKED_KEY_0791,"1");else sessionStorage.removeItem(PRIVACY_UNLOCKED_KEY_0791);}catch{}
}
function privacyNormalizeDigits0791(value,max=12){return String(value||"").replace(/\D/g,"").slice(0,max);}
function privacyBytesToBase640791(bytes){
  let binary=""; bytes.forEach(byte=>binary+=String.fromCharCode(byte)); return btoa(binary);
}
function privacyBase64ToBytes0791(value){
  const binary=atob(String(value||"")); const out=new Uint8Array(binary.length); for(let i=0;i<binary.length;i++)out[i]=binary.charCodeAt(i); return out;
}
function privacyRandomBytes0791(length=16){const bytes=new Uint8Array(length);crypto.getRandomValues(bytes);return bytes;}
function privacyRandomRecovery0791(){
  const bytes=privacyRandomBytes0791(12); return [...bytes].map(x=>String(x%10)).join("").replace(/(\d{4})(?=\d)/g,"$1-");
}
async function privacyHash0791(secret,saltBase64,iterations=PRIVACY_HASH_ITERATIONS_0791){
  if(!window.crypto?.subtle) throw new Error("Secure local hashing is unavailable in this browser.");
  const material=await crypto.subtle.importKey("raw",new TextEncoder().encode(String(secret)),"PBKDF2",false,["deriveBits"]);
  const bits=await crypto.subtle.deriveBits({name:"PBKDF2",salt:privacyBase64ToBytes0791(saltBase64),iterations:Number(iterations)||PRIVACY_HASH_ITERATIONS_0791,hash:"SHA-256"},material,256);
  return privacyBytesToBase640791(new Uint8Array(bits));
}
function privacySafeEqual0791(a,b){
  const left=String(a||""),right=String(b||""); let diff=left.length^right.length; const length=Math.max(left.length,right.length);
  for(let i=0;i<length;i++)diff|=(left.charCodeAt(i%Math.max(1,left.length))||0)^(right.charCodeAt(i%Math.max(1,right.length))||0);
  return diff===0;
}
async function privacyVerifyPin0791(value,config=privacyConfig0791()){
  if(!config)return false; const pin=privacyNormalizeDigits0791(value,6); if(pin.length!==6)return false;
  return privacySafeEqual0791(await privacyHash0791(pin,config.pinSalt,config.iterations),config.pinHash);
}
async function privacyVerifyRecovery0791(value,config=privacyConfig0791()){
  if(!config?.recoveryHash||!config?.recoverySalt)return false; const code=privacyNormalizeDigits0791(value,12); if(code.length!==12)return false;
  return privacySafeEqual0791(await privacyHash0791(code,config.recoverySalt,config.iterations),config.recoveryHash);
}
async function privacyCreateConfig0791(pin,base={}){
  const recovery=privacyRandomRecovery0791(); const pinSalt=privacyBytesToBase640791(privacyRandomBytes0791()); const recoverySalt=privacyBytesToBase640791(privacyRandomBytes0791());
  const config={version:1,enabled:true,iterations:PRIVACY_HASH_ITERATIONS_0791,pinSalt,pinHash:await privacyHash0791(pin,pinSalt),recoverySalt,recoveryHash:await privacyHash0791(privacyNormalizeDigits0791(recovery,12),recoverySalt),autoLockMinutes:Number(base.autoLockMinutes??5),lockOnBackground:base.lockOnBackground!==false,privacyScreen:base.privacyScreen!==false,updatedAt:new Date().toISOString()};
  return {config,recovery};
}
function privacyEvents0791(){try{const rows=JSON.parse(localStorage.getItem(PRIVACY_EVENTS_KEY_0791)||"[]");return Array.isArray(rows)?rows:[];}catch{return [];}}
function privacyLog0791(type,detail=""){
  try{const rows=[{id:`privacy-${Date.now()}-${Math.random().toString(16).slice(2)}`,type,detail:String(detail||""),at:new Date().toISOString()},...privacyEvents0791()].slice(0,50);localStorage.setItem(PRIVACY_EVENTS_KEY_0791,JSON.stringify(rows));}catch{}
}
function privacyEventLabel0791(type){return ({enabled:"Local lock enabled",disabled:"Local lock disabled",changed:"PIN changed",recovery:"Recovery code used",recoveryRegenerated:"Recovery code regenerated",locked:"App locked",unlocked:"App unlocked",failed:"Unlock attempt failed",cooldown:"Too many failed attempts",authorized:"Sensitive action authorized"})[type]||type;}
function privacyClearCooldown0791(){try{sessionStorage.removeItem(PRIVACY_FAILED_KEY_0791);sessionStorage.removeItem(PRIVACY_COOLDOWN_KEY_0791);}catch{}}
function privacyCooldownState0791(){
  try{return {failed:Number(sessionStorage.getItem(PRIVACY_FAILED_KEY_0791)||0),until:Number(sessionStorage.getItem(PRIVACY_COOLDOWN_KEY_0791)||0)};}catch{return {failed:0,until:0};}
}
function privacyRecordFailure0791(){
  const state=privacyCooldownState0791(); const failed=state.failed+1; let until=0;
  if(failed>=5)until=Date.now()+30000;
  try{sessionStorage.setItem(PRIVACY_FAILED_KEY_0791,String(until?0:failed));if(until)sessionStorage.setItem(PRIVACY_COOLDOWN_KEY_0791,String(until));}catch{}
  privacyLog0791(until?"cooldown":"failed",until?"30-second cooldown":"Incorrect PIN"); return {failed,until};
}
function privacyShouldLockOnBoot0791(){return !!privacyConfig0791()&&!privacySessionUnlocked0791();}
function privacyHideContent0791(on){
  document.documentElement.classList.toggle("fv-lock-pending0791",!!on);
  document.body?.classList.toggle("fv-privacy-locked0791",!!on);
}
function privacyRemoveCurtain0791(){document.getElementById("fvPrivacyCurtain0791")?.remove();document.body?.classList.remove("fv-privacy-curtain0791");}
function privacyShowCurtain0791(){
  if(document.getElementById("fvPrivacyCurtain0791")||document.getElementById("fvPrivacyLock0791"))return;
  const curtain=document.createElement("div");curtain.id="fvPrivacyCurtain0791";curtain.className="fvPrivacyCurtain0791";curtain.innerHTML=`<img src="${esc(themeBrandAsset(APP_PROFILE,"mark"))}?v=${BUILD}" alt=""><strong>${esc(APP_PROFILE.name.toUpperCase())}</strong><span>Private workspace</span>`;document.body.appendChild(curtain);document.body.classList.add("fv-privacy-curtain0791");
}
function privacyLockMessage0791(reason){return reason==="inactivity"?"FireVault locked after inactivity.":reason==="background"?"FireVault locked when the app left the foreground.":"Enter your local PIN to continue.";}
function privacyShowLock0791(reason="manual"){
  const config=privacyConfig0791(); if(!config)return;
  clearTimeout(privacyTimer0791); privacySetSessionUnlocked0791(false); privacyRemoveCurtain0791(); privacyHideContent0791(true);
  let overlay=document.getElementById("fvPrivacyLock0791");
  if(!overlay){overlay=document.createElement("div");overlay.id="fvPrivacyLock0791";overlay.className="fvPrivacyOverlay0791";document.body.appendChild(overlay);}
  privacyRecoveryMode0791=false;
  overlay.innerHTML=`<section class="fvPrivacyCard0791" role="dialog" aria-modal="true" aria-labelledby="fvPrivacyTitle0791">
    <div class="fvPrivacyBrand0791"><img src="${esc(themeBrandAsset(APP_PROFILE,"mark"))}?v=${BUILD}" alt=""><div><span>${esc(APP_PROFILE.name.toUpperCase())}</span><small>LOCAL PRIVACY LOCK</small></div></div>
    <div class="fvPrivacyShield0791" aria-hidden="true">⌾</div><h1 id="fvPrivacyTitle0791">${esc(APP_PROFILE.name)} Locked</h1><p id="fvPrivacyMessage0791">${esc(privacyLockMessage0791(reason))}</p>
    <label class="fvPrivacyInputLabel0791" for="fvPrivacyInput0791">6-digit PIN</label><input id="fvPrivacyInput0791" class="fvPrivacyInput0791" type="password" inputmode="numeric" autocomplete="off" maxlength="6" pattern="[0-9]*" aria-describedby="fvPrivacyError0791">
    <p id="fvPrivacyError0791" class="fvPrivacyError0791" role="alert"></p><button class="primary fvPrivacyUnlock0791" id="fvPrivacyUnlock0791">Unlock ${esc(APP_PROFILE.name)}</button>
    <button class="ghost fvPrivacyRecoveryToggle0791" id="fvPrivacyRecoveryToggle0791">Use recovery code</button><small class="fvPrivacyFoot0791">This local lock reduces casual access on this device. It is not cloud login, encryption, or server-enforced authorization.</small>
  </section>`;
  const input=document.getElementById("fvPrivacyInput0791"),button=document.getElementById("fvPrivacyUnlock0791"),toggle=document.getElementById("fvPrivacyRecoveryToggle0791");
  const submit=()=>privacyAttemptUnlock0791(); if(button)button.onclick=submit;if(input){input.oninput=()=>{input.value=privacyNormalizeDigits0791(input.value,privacyRecoveryMode0791?12:6);};input.onkeydown=e=>{if(e.key==="Enter")submit();};setTimeout(()=>input.focus(),80);}
  if(toggle)toggle.onclick=()=>{
    privacyRecoveryMode0791=!privacyRecoveryMode0791; const label=document.querySelector(".fvPrivacyInputLabel0791"); const message=document.getElementById("fvPrivacyMessage0791");
    if(input){input.value="";input.maxLength=privacyRecoveryMode0791?14:6;input.placeholder=privacyRecoveryMode0791?"0000-0000-0000":"";input.focus();}
    if(label)label.textContent=privacyRecoveryMode0791?"12-digit recovery code":"6-digit PIN";
    if(message)message.textContent=privacyRecoveryMode0791?"Enter the recovery code saved when Local Privacy Lock was enabled.":privacyLockMessage0791(reason);
    toggle.textContent=privacyRecoveryMode0791?"Use PIN instead":"Use recovery code";
    const error=document.getElementById("fvPrivacyError0791");if(error)error.textContent="";
  };
  if(reason!=="startup")privacyLog0791("locked",reason);
}
async function privacyAttemptUnlock0791(){
  const input=document.getElementById("fvPrivacyInput0791"),button=document.getElementById("fvPrivacyUnlock0791"),error=document.getElementById("fvPrivacyError0791"); if(!input||!button)return;
  const state=privacyCooldownState0791(); if(state.until>Date.now()){const seconds=Math.ceil((state.until-Date.now())/1000);if(error)error.textContent=`Too many attempts. Try again in ${seconds} seconds.`;return;}
  button.disabled=true;button.classList.add("isBusy0781");if(error)error.textContent="Checking…";
  try{
    const ok=privacyRecoveryMode0791?await privacyVerifyRecovery0791(input.value):await privacyVerifyPin0791(input.value);
    if(!ok){const next=privacyRecordFailure0791();if(error)error.textContent=next.until?"Too many attempts. FireVault is paused for 30 seconds.":`PIN not recognized. ${Math.max(0,5-next.failed)} attempt${5-next.failed===1?"":"s"} before a short cooldown.`;input.value="";input.focus();return;}
    privacyClearCooldown0791();privacySetSessionUnlocked0791(true);privacyHideContent0791(false);document.getElementById("fvPrivacyLock0791")?.remove();privacyLog0791(privacyRecoveryMode0791?"recovery":"unlocked",privacyRecoveryMode0791?"Recovery code accepted":"PIN accepted");privacyRecoveryMode0791=false;privacyResetTimer0791();
  }catch(err){if(error)error.textContent=err?.message||"FireVault could not verify the local lock.";}
  finally{button.disabled=false;button.classList.remove("isBusy0781");}
}
function privacyLockNow0791(reason="manual"){
  if(!privacyConfig0791())return;privacyShowLock0791(reason);
}
function privacyResetTimer0791(){
  clearTimeout(privacyTimer0791); const config=privacyConfig0791(); if(!config||!privacySessionUnlocked0791()||document.hidden)return;
  const minutes=Math.max(0,Number(config.autoLockMinutes||0)); if(!minutes)return;
  privacyTimer0791=setTimeout(()=>privacyLockNow0791("inactivity"),minutes*60*1000);
}
function privacyActivity0791(){if(privacySessionUnlocked0791()&&!document.getElementById("fvPrivacyLock0791"))privacyResetTimer0791();}
function privacyInstallRuntime0791(){
  if(privacyRuntimeInstalled0791)return;privacyRuntimeInstalled0791=true;
  ["pointerdown","keydown","touchstart"].forEach(name=>document.addEventListener(name,privacyActivity0791,{passive:true,capture:true}));
  document.addEventListener("visibilitychange",()=>{
    const config=privacyConfig0791();if(!config)return;
    if(document.hidden){clearTimeout(privacyTimer0791);if(config.lockOnBackground)privacyLockNow0791("background");else if(config.privacyScreen)privacyShowCurtain0791();}
    else{privacyRemoveCurtain0791();if(!privacySessionUnlocked0791())privacyShowLock0791("background");else privacyResetTimer0791();}
  });
  window.addEventListener("pageshow",()=>{if(privacyConfig0791()&&!privacySessionUnlocked0791())privacyShowLock0791("startup");else privacyResetTimer0791();});
}
function privacyInitialize0791(){
  privacyInstallRuntime0791(); const config=privacyConfig0791();
  if(!config){privacySetSessionUnlocked0791(false);privacyHideContent0791(false);document.getElementById("fvPrivacyLock0791")?.remove();return;}
  if(!privacySessionUnlocked0791())privacyShowLock0791("startup");else{privacyHideContent0791(false);privacyResetTimer0791();}
}
function privacyFormatRecovery0791(value){return privacyNormalizeDigits0791(value,12).replace(/(\d{4})(?=\d)/g,"$1-");}
function privacyShowRecoveryCode0791(code){
  const existing=document.getElementById("fvRecoverySheet0791");if(existing)existing.remove();
  const overlay=document.createElement("div");overlay.id="fvRecoverySheet0791";overlay.className="fvPrivacyRecoverySheet0791";overlay.innerHTML=`<section role="dialog" aria-modal="true" aria-label="Privacy recovery code"><span class="fvRecoveryKicker0791">SAVE THIS ONCE</span><h2>Local Lock Recovery Code</h2><p>This code can unlock FireVault if the PIN is forgotten. FireVault stores only a one-way hash and cannot show this code again.</p><code id="fvRecoveryCode0791">${esc(code)}</code><div class="fvRecoveryActions0791"><button class="primary" id="fvCopyRecovery0791">Copy Code</button><button class="ghost" id="fvDownloadRecovery0791">Download</button><button class="ghost" id="fvCloseRecovery0791">Done</button></div></section>`;document.body.appendChild(overlay);
  document.getElementById("fvCopyRecovery0791")?.addEventListener("click",async()=>{try{await navigator.clipboard.writeText(code);toast("Recovery code copied.","success");}catch{toast("Clipboard unavailable.","error");}});
  document.getElementById("fvDownloadRecovery0791")?.addEventListener("click",()=>downloadBlob(`firevault-local-lock-recovery-${new Date().toISOString().slice(0,10)}.txt`,`FireVault Local Privacy Lock Recovery Code\n\n${code}\n\nKeep this file private. This code unlocks only the local FireVault installation where it was created.`,`text/plain`));
  document.getElementById("fvCloseRecovery0791")?.addEventListener("click",()=>overlay.remove());
}

const ACCOUNTS_VIEW_STATE_KEY_0761 = "firevault_accounts_view_0761";
function loadAccountsViewState0761(){
  try{
    const raw=JSON.parse(sessionStorage.getItem(ACCOUNTS_VIEW_STATE_KEY_0761)||"null");
    if(!raw||typeof raw!=="object") return {};
    return raw;
  }catch{return {};}
}
const restoredAccountsView0761=loadAccountsViewState0761();
let accountsStateWriteTimer0761=0;
function persistAccountsViewState0761(immediate=false){
  const payload={
    search:String(siteSearch||""),
    filter:["all","attention","open","missingGps"].includes(sitesFilter0736)?sitesFilter0736:"all",
    sort:["az","favorites","recent","attention"].includes(accountsSort0760)?accountsSort0760:"az",
    scroll:Math.max(0,Number(accountsScroll0759)||0)
  };
  const write=()=>{
    accountsStateWriteTimer0761=0;
    try{sessionStorage.setItem(ACCOUNTS_VIEW_STATE_KEY_0761,JSON.stringify(payload));}catch{}
  };
  if(immediate){if(accountsStateWriteTimer0761)clearTimeout(accountsStateWriteTimer0761);write();return;}
  if(accountsStateWriteTimer0761)clearTimeout(accountsStateWriteTimer0761);
  accountsStateWriteTimer0761=setTimeout(write,120);
}
function resetAccountsViewState0761(){
  siteSearch="";
  sitesFilter0736="all";
  accountsSort0760="az";
  accountsScroll0759=0;
  try{sessionStorage.removeItem(ACCOUNTS_VIEW_STATE_KEY_0761);}catch{}
}


let data = loadData();
let mediaBootResult0910={migrated:0,hydrated:0,missing:0,failed:0,total:0};
let mediaStorageState0910={loading:true,count:0,bytes:0,usage:0,quota:0,persisted:false,orphans:0};
if(typeof window.fireVaultSplashDatabaseReady0732 === "function") window.fireVaultSplashDatabaseReady0732(Array.isArray(data?.sites)?data.sites.length:0);
let view = new URLSearchParams(location.search).get("route") || data.settings.app?.defaultScreen || "home";
let selectedSiteId = null;
let mode = null;
let settingsTab = "tech";
let settingsGroup067 = "";
let settingsSearch0874 = "";
let settingsRailScroll = 0;
const SETTINGS_SCROLL_KEY_576 = "firevault_settings_scroll_05076";
let settingsSubmenuReturn576 = false;
let customerImportState065 = {fileName:"",headers:[],rows:[],summary:null,error:"",includeFlagged:false,requireCoordinates:true,filter:"all",lastResult:null,geocoding:{active:false,total:0,complete:0,matched:0,noMatch:0,error:0},geocodeError:""};
let settingsScrollState576 = loadSettingsScrollState576();
let securityAuditFilter0792 = "all";
let securityAuditSearch0792 = "";
const HOME_CARD_STATE_KEY_5100 = "firevault_home_card_state_05100";
let homeCardState5100 = loadHomeCardState5100();
let lastEmailTemplateField = "emailSubject";
let overlayLogoDraftDataUrl = "";
let overlayPreviewRenderToken0890 = 0;
let overlayPreviewTimer0890 = 0;
let docPhotoDraftDataUrl512 = "";
let docPhotoDraftName512 = "";
let docPhotoClearRequested512 = false;

/* Build 0.95.6 — profile-defined record fields, sections, and photo categories. */
const RECORD_PHOTO_CATEGORIES_0956=recordPhotoCategories(APP_PROFILE);
const DEFAULT_PHOTO_CATEGORY_0956=RECORD_PHOTO_CATEGORIES_0956[0]?.label||"Other";

/* Build 0.95.0 — account-aware quick photo capture from bottom navigation. */
let quickPhotoInput0950=null;
let quickPhotoOverlay0950=null;
let quickPhotoPicker0950=null;
let quickPhotoDraft0950={dataUrl:"",name:"",accountId:"",category:DEFAULT_PHOTO_CATEGORY_0956,useOverlay:QUICK_PHOTO_WORKFLOW_0957.defaultUseOverlay,includeReport:QUICK_PHOTO_WORKFLOW_0957.defaultIncludeReport};
const QUICK_PHOTO_LAST_ACCOUNT_KEY0950="firevault_quick_photo_account_0950";
const QUICK_PHOTO_LAST_CATEGORY_KEY0950="firevault_quick_photo_category_0950";
let taskFilter = "open";
let deficiencyFilter = "open";
let actionCenterFilter562 = "all";
const NEARBY_STATE_KEY_0652 = "firevault_nearby_state_0652";
let nearbyState = loadNearbyState0652();
let nearbyScanStatus0652 = {state:"idle",message:"",attempt:"",at:""};
let siteSearch = String(restoredAccountsView0761.search||"");
let sitesFilter0736 = ["all","attention","open","missingGps"].includes(restoredAccountsView0761.filter)?restoredAccountsView0761.filter:"all";
let accountsScroll0759 = Math.max(0,Number(restoredAccountsView0761.scroll)||0);
let accountsSort0760 = ["az","favorites","recent","attention"].includes(restoredAccountsView0761.sort)?restoredAccountsView0761.sort:"az";
let accountsSnapTimer0796=0;
let accountsTouching0796=false;
let accountsTouchStart0796=0;
let accountsTouchMoved0796=false;
let accountsScrollLock0796=false;
let accountsScrollActivated0796=false;
let accountsLastScrollTop0876=accountsScroll0759;
let accountsScrollDirection0876=0;
let accountsScrollEndTimer0876=0;
let nearbyReturnView0877="home";
let accountDetailReturn0952="sites";
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
let homeInstallTipHidden = fvSafeGet0739("firevault_home_install_tip_hidden","") === "1";
try{localStorage.removeItem("firevault_active_route_day");sessionStorage.removeItem("firevault_active_route_day_demo");}catch{}
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
const OVERLAY_TECH_INFO_TAG_0949 = "{tech_info}";
const OVERLAY_TECH_LEGACY_TAGS_0949 = new Set(["{technician}","{company}","{phone}","{email}","{license}"]);
const OVERLAY_TAGS_510 = [
  ["{site_name}","Site Name","Customer / site record name"],
  ["{account_id}","Account ID","Imported or assigned account identifier"],
  ["{category}","Category","Basic, CLSS, AlarmNet, or IPDACT"],
  ["{address}","Address","Full site address"],
  ["{panel}","Panel","Panel manufacturer and model"],
  ["{date}","Date","Current date"],
  ["{time}","Time","Current time"],
  [OVERLAY_TECH_INFO_TAG_0949,"Tech Info","Uses the Technician Overlay Template from Profile"],
  ["{city}","City","Site city"],
  ["{state}","State","Site state"],
  ["{zip}","ZIP","Site ZIP code"],
  ["{gps}","GPS","Saved GPS coordinates"],
  ["{build}","Build","Current FireVault build number"]
];
const PHOTO_CATEGORIES_524 = RECORD_PHOTO_CATEGORIES_0956.map(category=>category.label);
const PHOTO_CATEGORY_HINTS_524 = Object.fromEntries(RECORD_PHOTO_CATEGORIES_0956.map(category=>[category.label,category.hint]));
const REPORT_SECTION_KEY = "firevault_report_section_prefs";
let reportSectionPrefs = loadReportSectionPrefs();
const appEl = document.getElementById("app");


/* Build 0.93.0 — interaction and field reliability. */
let formDirty0930=false;
let formDirtyContext0930="";
const DIRTY_ROUTES_0930=new Set(["siteForm","siteDocForm","contactForm","equipmentForm","taskForm","deficiencyForm","resourceForm","jobMode"]);
const NONSAVE_SETTINGS_0930=new Set(["privacy","cloudFiles","microsoftStorage","customerImport","categories","backup","webdav","updates","demo","about","architecture","security","overlay"]);
function screenCanBeDirty0930(){
  if(DIRTY_ROUTES_0930.has(view)) return true;
  return view==="settings" && mode==="settingsDetail" && !NONSAVE_SETTINGS_0930.has(settingsTab);
}
function dirtyScreenLabel0930(){
  if(view==="settings") return "settings changes";
  return ({siteForm:"account changes",siteDocForm:"document changes",contactForm:"contact changes",equipmentForm:"equipment changes",taskForm:"task changes",deficiencyForm:"deficiency changes",resourceForm:"library changes",jobMode:"site-note changes"})[view]||"changes";
}
function markDirty0930(target){
  if(!screenCanBeDirty0930() || !target?.matches?.('input:not([type="search"]):not([type="file"]), textarea, select')) return;
  if(target.closest('[data-fv-no-dirty="true"]') || target.id==="settingsSearchInput0874") return;
  formDirty0930=true;formDirtyContext0930=dirtyScreenLabel0930();
  document.body.classList.add("fv-unsaved0930");
}
function clearDirty0930(){formDirty0930=false;formDirtyContext0930="";document.body.classList.remove("fv-unsaved0930");}
function confirmDiscard0930(){
  if(!formDirty0930) return true;
  const ok=confirm(`Discard unsaved ${formDirtyContext0930||"changes"}?`);
  if(ok) clearDirty0930();
  return ok;
}
function settingsNavigate0930(callback){if(!confirmDiscard0930())return;clearDirty0930();callback();}
appEl.addEventListener("input",e=>markDirty0930(e.target),{passive:true});
appEl.addEventListener("change",e=>markDirty0930(e.target),{passive:true});
window.addEventListener("beforeunload",e=>{if(!formDirty0930)return;e.preventDefault();e.returnValue="";});
/* Prevent accidental duplicate saves and destructive actions from rapid double taps. */
document.addEventListener("click",e=>{
  const button=e.target.closest?.("button.primary,button.danger,[data-fv-single-action]");
  if(!button || button.disabled || button.dataset.fvNoLock==="true") return;
  if(button.dataset.fvTapLocked0930==="1"){e.preventDefault();e.stopImmediatePropagation();return;}
  button.dataset.fvTapLocked0930="1";
  setTimeout(()=>{delete button.dataset.fvTapLocked0930;},850);
},true);

/* Build 0.78.2 — navigation continuity and scroll memory. */
const ROUTE_SCROLL_KEY_0782 = "firevault_route_scroll_0782";
let lastRenderedScrollKey0782 = "";
let routeScrollRestoreFrame0782 = 0;
function routeTitle0782(routeName=view){
  const titles={
    home:appLabel("nearbyRecords"),dashboard068:"Dashboard",dailySummary:"Daily Summary",
    actionCenter:"Action Center",pinnedSites:`Pinned ${recordTerm0954(2)}`,sites:recordTerm0954(2),
    nearbySites:appLabel("nearbyRecords"),attention:"Attention Queue",siteDetail:appLabel("recordDetail"),visits:"Visits",
    visitDetail:"Visit Detail",checklist:"Checklist",siteForm:selectedSiteId?appLabel("editRecord"):appLabel("addRecord"),
    contactsList:"Contacts",contactForm:"Contact",siteDocs:"Documents",siteDocForm:"Document",
    equipmentList:appTerm("equipment",2),equipmentForm:`${appTerm("equipment",1)} Item`,tasks:appTerm("task",2),taskForm:appTerm("task",1),
    deficiencies:appTerm("deficiency",2),deficiencyForm:appTerm("deficiency",1),report:"Report",library:"Library",
    resourceForm:"Library Item",jobMode:"Site Notes",settings:"Settings",
  };
  return titles[routeName]||APP_PROFILE.name;
}
function routeScrollKey0782(){
  const parts=[String(view||"home")];
  if(selectedSiteId && ["siteDetail","visits","visitDetail","checklist","contactsList","contactForm","siteDocs","siteDocForm","equipmentList","equipmentForm","tasks","taskForm","deficiencies","deficiencyForm","report","jobMode","siteForm"].includes(view)) parts.push(String(selectedSiteId));
  if(view==="siteDetail") parts.push(String(accountDetailTab0735||"overview"));
  if(view==="settings") parts.push(String(mode||"home"),String(settingsTab||"tech"));
  return parts.join("|");
}
function loadRouteScrollMap0782(){
  try{const parsed=JSON.parse(sessionStorage.getItem(ROUTE_SCROLL_KEY_0782)||"{}");return parsed&&typeof parsed==="object"?parsed:{};}catch{return {};}
}
function saveRouteScroll0782(key,value){
  if(!key) return;
  const map=loadRouteScrollMap0782();
  map[key]=Math.max(0,Math.round(Number(value)||0));
  const entries=Object.entries(map).slice(-40);
  try{sessionStorage.setItem(ROUTE_SCROLL_KEY_0782,JSON.stringify(Object.fromEntries(entries)));}catch{}
}
function routeScrollCandidates0782(){
  const selectors=[
    ".accountsList0759",".accountTabScroll0735",".settingsTabbedBody0736",".settingsTabItems0736",
    ".settingsManualScreen067",".nearbyCards069",".accountForm0760",".toolsScreen0734",
    ".screen.grow",".grow",".list",".screen"
  ];
  const seen=new Set();
  return selectors.flatMap(sel=>Array.from(appEl.querySelectorAll(sel))).filter(el=>{
    if(seen.has(el)) return false;seen.add(el);return true;
  });
}
function primaryScrollContainer0782(){
  const candidates=routeScrollCandidates0782().filter(el=>{
    const style=getComputedStyle(el);
    const rect=el.getBoundingClientRect();
    return style.display!=="none" && style.visibility!=="hidden" && rect.width>0 && rect.height>0 && el.scrollHeight>el.clientHeight+5;
  });
  if(!candidates.length) return null;
  const preferred=candidates.find(el=>["accountsList0759","accountTabScroll0735","settingsTabbedBody0736","settingsManualScreen067","nearbyCards069","accountForm0760"].some(c=>el.classList.contains(c)));
  return preferred||candidates.sort((a,b)=>(b.scrollHeight-b.clientHeight)-(a.scrollHeight-a.clientHeight))[0];
}
function captureRouteScroll0782(key=routeScrollKey0782()){
  const scroller=primaryScrollContainer0782();
  if(scroller) saveRouteScroll0782(key,scroller.scrollTop);
}
function restoreRouteScroll0782(){
  cancelAnimationFrame(routeScrollRestoreFrame0782);
  const key=routeScrollKey0782();
  const saved=Number(loadRouteScrollMap0782()[key]||0);
  routeScrollRestoreFrame0782=requestAnimationFrame(()=>requestAnimationFrame(()=>{
    const scroller=primaryScrollContainer0782();
    if(!scroller) return;
    const max=Math.max(0,scroller.scrollHeight-scroller.clientHeight);
    scroller.scrollTop=Math.min(saved,max);
    wireRouteScrollState0782(scroller);
  }));
}
function wireRouteScrollState0782(scroller=primaryScrollContainer0782()){
  if(!scroller) return;
  const sync=()=>{
    appEl.classList.toggle("fvRouteScrolled0782",scroller.scrollTop>8);
    appEl.classList.toggle("fvRouteAtEnd0782",scroller.scrollTop>=scroller.scrollHeight-scroller.clientHeight-8);
  };
  if(scroller.dataset.fvScrollWire0782!=="1"){
    scroller.dataset.fvScrollWire0782="1";
    scroller.addEventListener("scroll",()=>{sync();saveRouteScroll0782(routeScrollKey0782(),scroller.scrollTop);},{passive:true});
  }
  sync();
}
function scrollCurrentRouteToTop0782(){
  const scroller=primaryScrollContainer0782();
  const smooth=!window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
  if(scroller) scroller.scrollTo({top:0,behavior:smooth?"smooth":"auto"});
  else window.scrollTo({top:0,behavior:smooth?"smooth":"auto"});
  saveRouteScroll0782(routeScrollKey0782(),0);
}
function updateRouteContext0782(){
  const title=routeTitle0782();
  document.title=title===APP_PROFILE.name?APP_PROFILE.name:`${title} — ${APP_PROFILE.name}`;
  appEl.setAttribute("aria-label",title);
  appEl.dataset.fvRouteTitle=title;
}
function fireVaultBrand575(extraClass=""){
  return themeWordmarkMarkup(APP_PROFILE,extraClass);
}
function fvIcon073(name, extraClass=""){
  const icons={
    home:'<path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10.5V20h13v-9.5"/><path d="M9.5 20v-6h5v6"/>',
    nearby:'<circle cx="12" cy="12" r="6"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/><circle cx="12" cy="12" r="1.4"/>',
    accounts:'<rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><rect x="14" y="14" width="6" height="6" rx="1"/>',
    library:'<path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3z"/><path d="M8 4v16M8 17h11"/>',
    tools:'<path d="M4 9h16v10H4z"/><path d="M9 9V6h6v3M4 13h16M10 13v2h4v-2"/>',
    settings:'<path d="M4 6h10M18 6h2M4 12h3M11 12h9M4 18h8M16 18h4"/><circle cx="16" cy="6" r="2"/><circle cx="9" cy="12" r="2"/><circle cx="14" cy="18" r="2"/>',
    search:'<circle cx="11" cy="11" r="7"/><path d="m16.5 16.5 4 4"/>',
    sort:'<path d="M4 7h10M18 7h2M4 12h4M12 12h8M4 17h8M16 17h4"/><circle cx="16" cy="7" r="2"/><circle cx="10" cy="12" r="2"/><circle cx="14" cy="17" r="2"/>',
    info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7h.01"/>',
    map:'<path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3z"/><path d="M9 3v15M15 6v15"/>',
    list:'<path d="M8 6h13M8 12h13M8 18h13"/><circle cx="4" cy="6" r="1"/><circle cx="4" cy="12" r="1"/><circle cx="4" cy="18" r="1"/>',
    route:'<path d="M5 19 19 5M10 5h9v9"/><path d="M5 8v11h11"/>',
    call:'<path d="M7 4 4.8 6.2c-.8.8-.9 2-.4 3 2 4.2 5.4 7.6 9.6 9.6 1 .5 2.2.4 3-.4L19.2 16l-4-3-1.7 1.7a13.5 13.5 0 0 1-4.2-4.2L11 8.8z"/>',
    note:'<path d="M5 4h14v16H5z"/><path d="M8 8h8M8 12h8M8 16h5"/>',
    visit:'<circle cx="12" cy="8" r="3"/><path d="M6 21v-2a6 6 0 0 1 12 0v2"/><path d="M19 4v4M17 6h4"/>',
    photo:'<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="10" r="2"/><path d="m21 15-5-5L5 19"/>',
    star:'<path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/>',
    edit:'<path d="m4 20 4.2-1 10.9-10.9a2.1 2.1 0 0 0-3-3L5.2 16z"/><path d="m14.8 6.4 3 3M4 20h6"/>',
    back:'<path d="m15 18-6-6 6-6"/>',
    up:'<path d="m6 15 6-6 6 6"/>',
    down:'<path d="m6 9 6 6 6-6"/>',
    remove:'<path d="M5 7h14M9 7V4h6v3M7 7l1 13h8l1-13M10 11v5M14 11v5"/>',
    add:'<path d="M12 5v14M5 12h14"/>',
    check:'<path d="m5 12 4 4 10-10"/>',
    drag:'<circle cx="8" cy="7" r="1"/><circle cx="16" cy="7" r="1"/><circle cx="8" cy="12" r="1"/><circle cx="16" cy="12" r="1"/><circle cx="8" cy="17" r="1"/><circle cx="16" cy="17" r="1"/>'
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

const FEATURE_DEFAULTS = {dailyRoute:false, fieldFocus:true, dataSafeHome:true, siteBrief:true, siteTimeline:true, pinnedSites:true, importantSiteInfo:true, library:false, reports:false, equipment:false, diagnostics:false, advancedGps:true, attention:false, routeReview:false, csvExports:false, backupRepair:false};
const FEATURE_LABELS = [
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
  if(appNav) appNav.classList.add("fvNavThree0733");
}
function setViewMode(mode){ data.settings.app={...(data.settings.app||{}),viewMode:mode}; save(); toast(`${mode === "power" ? "Technician Power Mode" : mode === "advanced" ? "Advanced View" : "Simple View"} enabled.`); route("home"); }

function hiddenFeatureCount473(){ return FEATURE_LABELS.filter(([key])=>!featureOn(key)).length; }
function simpleToolRows473(){
  return [
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
  minimal:{label:"Minimal Daily", mode:"simple", icon:"◯", note:"Clean dashboard for basic sites and today’s route.", features:{dailyRoute:false, fieldFocus:true, dataSafeHome:true, siteBrief:true, siteTimeline:true, pinnedSites:true, importantSiteInfo:true, advancedGps:false, attention:false, library:false, reports:false, equipment:false, routeReview:false, csvExports:false, diagnostics:false, backupRepair:false}},
  route:{label:"Route Logger", mode:"simple", icon:"◇", note:"Daily Route plus GPS / nearby tools.", features:{dailyRoute:false, fieldFocus:true, dataSafeHome:true, siteBrief:true, siteTimeline:true, pinnedSites:true, importantSiteInfo:true, advancedGps:true, attention:false, library:false, reports:false, equipment:false, routeReview:false, csvExports:false, diagnostics:false, backupRepair:false}},
  service:{label:"Service Tech", mode:"advanced", icon:"▣", note:"Sites, reports, equipment, GPS, and attention tools.", features:{dailyRoute:false, fieldFocus:true, dataSafeHome:true, siteBrief:true, siteTimeline:true, pinnedSites:true, importantSiteInfo:true, advancedGps:true, attention:true, library:false, reports:true, equipment:true, routeReview:false, csvExports:false, diagnostics:false, backupRepair:false}},
  inspection:{label:"Inspector", mode:"advanced", icon:"▤", note:"Reports, equipment, route review, library, and export tools.", features:{dailyRoute:false, fieldFocus:true, dataSafeHome:true, siteBrief:true, siteTimeline:true, pinnedSites:true, importantSiteInfo:true, advancedGps:true, attention:true, library:true, reports:true, equipment:true, routeReview:false, csvExports:true, diagnostics:false, backupRepair:false}},
  power:{label:"Power Mode", mode:"power", icon:"⚡", note:"Show every FireVault module and advanced control.", features:{dailyRoute:false, fieldFocus:true, dataSafeHome:true, siteBrief:true, siteTimeline:true, pinnedSites:true, importantSiteInfo:true, advancedGps:true, attention:true, library:true, reports:true, equipment:true, routeReview:false, csvExports:true, diagnostics:true, backupRepair:true}}
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
  site:{label:"Account Detail", icon:"▤", note:"Home stays clean while account screens show brief and timeline.", values:{fieldFocus:false,dataSafeHome:false,siteBrief:true,siteTimeline:true,pinnedSites:true,importantSiteInfo:true}},
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

document.querySelectorAll("#appNav button, .nearbyBottomNav069 button").forEach(btn => btn.addEventListener("click", () => {
  const target=btn.dataset.route;
  if(!target) return;
  if(target==="photo"){
    if(!moduleEnabled0955("core.photos")){toast("Photo capture is not enabled for this app profile.");return;}
    quickPhotoStart0950();
    return;
  }
  if(target===view){
    scrollCurrentRouteToTop0782();
    return;
  }
  if(target==="settings"){
    if(!confirmDiscard0930()) return;
    clearDirty0930();
    openSettingsHome572();
    return;
  }
  mode=null;
  restoreAppChrome572();
  route(target);
}));
window.addEventListener("error", e => showError(e.error || e.message));
window.addEventListener("unhandledrejection", e => showError(e.reason || e));

function phoneDigits0758(value=""){
  let digits=String(value??"").replace(/\D/g,"");
  if(digits.length===11 && digits.startsWith("1")) digits=digits.slice(1);
  return digits.slice(0,10);
}
function formatPhone0758(value="",partial=false){
  const digits=phoneDigits0758(value);
  if(!digits) return "";
  if(digits.length<4) return partial?`(${digits}`:digits;
  if(digits.length<7) return `(${digits.slice(0,3)})${digits.slice(3)}`;
  return `(${digits.slice(0,3)})${digits.slice(3,6)}-${digits.slice(6)}`;
}
function normalizePhoneValue0758(value=""){
  const digits=phoneDigits0758(value);
  return digits.length===10?formatPhone0758(digits):String(value??"").trim();
}
function normalizeAllPhoneData0758(){
  (data.sites||[]).forEach(site=>{
    if(site.sitePhone) site.sitePhone=normalizePhoneValue0758(site.sitePhone);
    if(site.devicePhone) site.devicePhone=normalizePhoneValue0758(site.devicePhone);
    (site.contacts||[]).forEach(contact=>{if(contact.phone) contact.phone=normalizePhoneValue0758(contact.phone);});
  });
  if(data.settings?.technician?.phone) data.settings.technician.phone=normalizePhoneValue0758(data.settings.technician.phone);
}
function bindPhoneInputs0758(scope=document){
  const inputs=scope.querySelectorAll('input[inputmode="tel"],input[type="tel"],input[id*="Phone"],input[id*="phone"]');
  inputs.forEach(input=>{
    if(input.dataset.fvPhone0758==="1") return;
    input.dataset.fvPhone0758="1";
    input.value=formatPhone0758(input.value,true)||input.value;
    input.setAttribute("inputmode","numeric");
    input.setAttribute("autocomplete",input.getAttribute("autocomplete")||"tel");
    input.addEventListener("input",()=>{
      const before=input.value;
      const end=input.selectionStart===before.length;
      input.value=formatPhone0758(before,true);
      if(end) input.setSelectionRange(input.value.length,input.value.length);
    });
    input.addEventListener("blur",()=>{input.value=normalizePhoneValue0758(input.value);});
  });
}
function save(){ normalizeAllPhoneData0758(); saveData(data); applyTheme(); clearDirty0930(); }
function site(){ return data.sites.find(s => s.id === selectedSiteId); }
function val(id){ return document.getElementById(id)?.value?.trim() || ""; }
function raw(id){ return document.getElementById(id)?.value || ""; }
function checked(id){ return !!document.getElementById(id)?.checked; }
function route(v){
  const requestedRoute0955=v;
  v=resolveModuleRoute0955(v);
  if(v!==requestedRoute0955) toast("That module is not enabled for this app profile.");
  const retiredRoutes0900=new Set(["tools","documentScanner","routeLog","serviceVisit","diagnostics","dataTools"]);
  if(retiredRoutes0900.has(v)){
    toast("That retired workspace is not included in FireVault 1.0.");
    v = selectedSiteId && ["serviceVisit","documentScanner"].includes(v) ? "siteDetail" : "home";
  }
  if(v!==view && !confirmDiscard0930()) return;
  captureRouteScroll0782();
  if(view === "settings") captureSettingsScroll576();
  if(v === "library" && !featureOn("library")){ toast("Library is hidden in Simple View. Turn it on in Settings → Modules."); v="home"; }
  if((v === "report") && !featureOn("reports")){ toast("Reports are hidden in Simple View."); v="siteDetail"; }
  if(["equipmentList","equipmentForm"].includes(v) && !featureOn("equipment")){ toast("Equipment Vault is hidden in Simple View."); v="siteDetail"; }
  if((v === "nearbySites") && !featureOn("advancedGps")){ toast("Advanced GPS is hidden in Simple View."); v="home"; }
  if(settingsSubmenuReturn576 && v === "settings") settingsSubmenuReturn576=false;
  const previousView=view;
  if(v === "siteDetail" && previousView !== "siteDetail") accountDetailSite0735="";
  clearDirty0930();
  view = v; render();
}
function html(content){ appEl.innerHTML = content; requestAnimationFrame(()=>bindPhoneInputs0758(appEl)); }

// Build 0.84.0: keep high-frequency UI work off the critical interaction path.
function debounce0830(fn,delay=90){
  let timer=0;
  return (...args)=>{clearTimeout(timer);timer=setTimeout(()=>fn(...args),delay);};
}
function idle0830(fn,timeout=1200){
  if("requestIdleCallback" in window) return requestIdleCallback(fn,{timeout});
  return setTimeout(fn,Math.min(timeout,700));
}

let routeAnimationFrame0781=0;
function animateRouteEntry0781(){
  const root=document.getElementById("app");
  if(!root || window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches) return;
  cancelAnimationFrame(routeAnimationFrame0781);
  root.classList.remove("fvRouteEnter0781");
  routeAnimationFrame0781=requestAnimationFrame(()=>{
    root.classList.add("fvRouteEnter0781");
    setTimeout(()=>root.classList.remove("fvRouteEnter0781"),260);
  });
}
function setButtonBusy0781(button,busy,label="Working…"){
  if(!button) return;
  if(busy){
    if(!button.dataset.fvOriginalLabel) button.dataset.fvOriginalLabel=button.textContent||"";
    button.disabled=true;button.setAttribute("aria-busy","true");button.classList.add("fvButtonBusy0781");button.textContent=label;
  }else{
    button.disabled=false;button.removeAttribute("aria-busy");button.classList.remove("fvButtonBusy0781");
    if(button.dataset.fvOriginalLabel!==undefined){button.textContent=button.dataset.fvOriginalLabel;delete button.dataset.fvOriginalLabel;}
  }
}
function toast(msg,type="info"){
  const stack=document.getElementById("fvToastStack0781")||(()=>{const el=document.createElement("div");el.id="fvToastStack0781";el.className="fvToastStack0781";el.setAttribute("aria-live","polite");el.setAttribute("aria-atomic","false");document.body.appendChild(el);return el;})();
  const t=document.createElement("div");t.className=`toast fvToast0781 ${type||"info"}`;t.setAttribute("role","status");
  t.innerHTML=`<span class="fvToastIcon0781" aria-hidden="true"></span><span>${esc(String(msg||""))}</span><i aria-hidden="true"></i>`;
  stack.appendChild(t);
  while(stack.children.length>3) stack.firstElementChild?.remove();
  const remove=()=>{t.classList.add("leaving");setTimeout(()=>t.remove(),180);};
  setTimeout(remove,2600);
}
function haptic(ms=12){
  if(data.settings.app?.haptics === false) return;
  try{ if(navigator.vibrate) navigator.vibrate(ms); }catch{}
}
document.addEventListener("pointerup", e=>{
  const target=e.target.closest?.("button,.btn,label.checkRow,input[type=checkbox],select");
  if(target) haptic(target.classList?.contains("primary") ? 18 : 10);
}, {passive:true});

normalizeAllPhoneData0758();
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
const LOCATION_POINT_TYPES_071=[
  "Fire Alarm Control Panel","Annunciator","Sprinkler Riser","Fire Pump","Fire Department Connection","Knox Box","Elevator Recall Panel","Generator","Electrical Room","Roof Access","Main Entrance","Secondary Entrance","Parking Area","Key Box","Other"
];
const LOCATION_TYPE_ICONS_07912={
  "Fire Alarm Control Panel":"🚨","Annunciator":"▣","Sprinkler Riser":"💧","Fire Pump":"🔥","Fire Department Connection":"🚒","Knox Box":"🔑","Elevator Recall Panel":"↕","Generator":"⚡","Electrical Room":"⚡","Roof Access":"⬆","Main Entrance":"🚪","Secondary Entrance":"↪","Parking Area":"P","Key Box":"🔐","Other":"⌖",
  "Parking":"P","Exterior Door":"🚪","Riser Room":"💧","FDC":"🚒","Sprinkler Room":"💧","Fire Alarm Panel":"🚨"
};
function plusCodeSettings0794(){
  const cfg=data?.settings?.plusCodes||{};
  return {
    enabled:cfg.enabled!==false,
    autoGenerate:cfg.autoGenerate!==false,
    accountLength:[10,11].includes(Number(cfg.accountLength))?Number(cfg.accountLength):10,
    locationLength:[10,11].includes(Number(cfg.locationLength))?Number(cfg.locationLength):11,
    includeInReports:cfg.includeInReports!==false,
    searchable:cfg.searchable!==false,
    verifyAfterDays:[90,180,365].includes(Number(cfg.verifyAfterDays))?Number(cfg.verifyAfterDays):180
  };
}
function encodePlusCode071(latitude,longitude,length){
  const cfg=plusCodeSettings0794();
  return encodePlusCode(latitude,longitude,Number(length||cfg.accountLength));
}
function sitePlusCode071(s){
  if(!s) return "";
  const cfg=plusCodeSettings0794();
  const saved=normalizePlusCode(s.plusCode||"");
  if(!cfg.enabled) return saved;
  if(hasGps(s)&&cfg.autoGenerate){
    const code=encodePlusCode071(s.gps.lat,s.gps.lng,cfg.accountLength);
    if(code&&s.plusCode!==code) s.plusCode=code;
    return code;
  }
  return isValidFullPlusCode(saved)?saved:"";
}
function normalizeLocationPoint07912(p,index=0){
  const cfg=plusCodeSettings0794();
  p=p&&typeof p==="object"?p:{};
  p.id=String(p.id||uid());
  const legacyType={"Fire Alarm Panel":"Fire Alarm Control Panel","FDC":"Fire Department Connection","Riser Room":"Sprinkler Riser","Sprinkler Room":"Sprinkler Riser","Parking":"Parking Area","Exterior Door":"Secondary Entrance"};
  p.type=legacyType[p.type]||p.type||"Other";
  if(!LOCATION_POINT_TYPES_071.includes(p.type))p.type="Other";
  p.label=String(p.label||p.name||p.type||`Location ${index+1}`).trim()||`Location ${index+1}`;
  p.floor=String(p.floor||"").trim();
  p.placement=["Indoor","Outdoor"].includes(p.placement)?p.placement:(p.indoor===false?"Outdoor":"Indoor");
  p.description=String(p.description||"").trim();
  p.notes=String(p.notes||"").trim();
  p.photoDocId=String(p.photoDocId||"");
  p.lat=p.lat!==null&&p.lat!==""&&Number.isFinite(Number(p.lat))?Number(p.lat):null;
  p.lng=p.lng!==null&&p.lng!==""&&Number.isFinite(Number(p.lng))?Number(p.lng):null;
  p.accuracy=Number.isFinite(Number(p.accuracy))?Math.max(0,Math.round(Number(p.accuracy))):0;
  p.createdAt=p.createdAt||new Date().toISOString();
  p.updatedAt=p.updatedAt||p.createdAt;
  p.lastVerifiedAt=String(p.lastVerifiedAt||"");
  p.verification=["verified","needs","unknown"].includes(p.verification)?p.verification:(p.lastVerifiedAt?"verified":"unknown");
  if(cfg.enabled&&cfg.autoGenerate&&Number.isFinite(p.lat)&&Number.isFinite(p.lng)){
    const code=encodePlusCode071(p.lat,p.lng,cfg.locationLength);
    if(code)p.plusCode=code;
  }else p.plusCode=normalizePlusCode(p.plusCode||"");
  return p;
}
function locationPoints071(s){
  if(!s)return [];
  s.locationPoints=(Array.isArray(s.locationPoints)?s.locationPoints:[]).map(normalizeLocationPoint07912);
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
  const cfg=plusCodeSettings0794();
  if(!cfg.enabled||!cfg.autoGenerate)return;
  let changed=false;
  (data.sites||[]).forEach(s=>{
    const before=s.plusCode||""; const beforePoints=JSON.stringify((s.locationPoints||[]).map(p=>p.plusCode||""));
    const code=sitePlusCode071(s); locationPoints071(s);
    if(code!==before||beforePoints!==JSON.stringify((s.locationPoints||[]).map(p=>p.plusCode||"")))changed=true;
  });
  if(changed) saveData(data);
}
function copyText071(text,label="Copied"){
  if(navigator.clipboard?.writeText) navigator.clipboard.writeText(String(text||"")).then(()=>toast(label),()=>toast("Clipboard unavailable."));
  else toast("Clipboard unavailable.");
}
function locationIcon07912(type){return LOCATION_TYPE_ICONS_07912[type]||"⌖";}
function locationVerification07912(p){
  if(p?.verification==="needs")return {key:"needs",label:"Needs Verification"};
  if(!p?.lastVerifiedAt)return {key:"unknown",label:"Unknown"};
  const age=(Date.now()-new Date(p.lastVerifiedAt).getTime())/86400000;
  if(!Number.isFinite(age)||age>plusCodeSettings0794().verifyAfterDays)return {key:"needs",label:"Needs Verification"};
  return {key:"verified",label:"Verified"};
}
function locationMeta07912(p){
  return [p.floor?`Floor ${p.floor}`:"",p.placement,p.accuracy?`±${p.accuracy} m`:""].filter(Boolean).join(" • ");
}
function locationTimeline07912(s,action,p){
  s.noteEntries=Array.isArray(s.noteEntries)?s.noteEntries:[];
  s.noteEntries.unshift({id:uid(),type:"Building Location",note:`${action}: ${p.label} (${p.type})${p.plusCode?` • ${p.plusCode}`:""}`,createdAt:new Date().toISOString(),technician:data.settings?.technician?.name||"Local technician",locationPointId:p.id});
}
function plusCodePointNote071(point){ return `[Location: ${point.label||point.type||'Saved Point'}] Plus Code: ${point.plusCode}${point.notes?` — ${point.notes}`:''}`; }
function locationPhoto07912(s,p){return (s.docs||[]).find(d=>d.id===p.photoDocId&&docHasPhoto512(d))||null;}
function locationTypeOptions07912(selected){return LOCATION_POINT_TYPES_071.map(type=>`<option value="${esc(type)}" ${type===selected?"selected":""}>${esc(type)}</option>`).join("");}
function openLocationEditor07912(pointId=""){
  const s=site();if(!s)return;
  const existing=locationPoints071(s).find(p=>p.id===pointId)||null;
  const p=existing?{...existing}:normalizeLocationPoint07912({type:"Fire Alarm Control Panel",label:"Fire Alarm Panel",placement:"Indoor",verification:"unknown",lat:hasGps(s)?s.gps.lat:null,lng:hasGps(s)?s.gps.lng:null,accuracy:hasGps(s)?s.gps.accuracy:0});
  const photos=(s.docs||[]).filter(docHasPhoto512);
  const overlay=document.createElement("div");overlay.className="buildingLocationOverlay07912";
  overlay.innerHTML=`<form class="buildingLocationSheet07912" id="buildingLocationForm07912">
    <div class="buildingLocationHead07912"><div><span>BUILDING NAVIGATOR</span><h2>${existing?"Edit Location":"Add Location"}</h2><p>Save the exact place a technician needs to find.</p></div><button type="button" class="ghost" id="closeLocationEditor07912">Close</button></div>
    <div class="buildingLocationGrid07912">
      <label><span>Location Type</span><select id="locationType07912">${locationTypeOptions07912(p.type)}</select></label>
      <label><span>Location Name</span><input id="locationLabel07912" value="${esc(p.label)}" maxlength="80" required></label>
      <label><span>Floor / Level</span><input id="locationFloor07912" value="${esc(p.floor)}" placeholder="1, B1, Roof"></label>
      <label><span>Placement</span><select id="locationPlacement07912"><option ${p.placement==="Indoor"?"selected":""}>Indoor</option><option ${p.placement==="Outdoor"?"selected":""}>Outdoor</option></select></label>
      <label class="wide"><span>Description</span><input id="locationDescription07912" value="${esc(p.description)}" placeholder="West lobby beside elevator bank"></label>
      <label class="wide"><span>Access Notes</span><textarea id="locationNotes07912" rows="3" placeholder="Door, key, escort, or access instructions">${esc(p.notes)}</textarea></label>
      <label><span>Latitude</span><input id="locationLat07912" inputmode="decimal" value="${Number.isFinite(p.lat)?p.lat:""}"></label>
      <label><span>Longitude</span><input id="locationLng07912" inputmode="decimal" value="${Number.isFinite(p.lng)?p.lng:""}"></label>
      <label><span>Verification</span><select id="locationVerification07912"><option value="unknown" ${p.verification==="unknown"?"selected":""}>Unknown</option><option value="verified" ${p.verification==="verified"?"selected":""}>Verified</option><option value="needs" ${p.verification==="needs"?"selected":""}>Needs Verification</option></select></label>
      <label><span>Location Photo</span><select id="locationPhoto07912"><option value="">No linked photo</option>${photos.map(d=>`<option value="${esc(d.id)}" ${p.photoDocId===d.id?"selected":""}>${esc(d.title||d.imageName||"Account Photo")}</option>`).join("")}</select></label>
    </div>
    <div class="buildingLocationGpsActions07912"><button type="button" class="ghost" id="useAccountGps07912" ${hasGps(s)?"":"disabled"}>Use Account GPS</button><button type="button" class="primary" id="captureLocationGps07912">Capture Current GPS</button><span id="locationPlusPreview07912">${p.plusCode?esc(p.plusCode):"Plus Code generated after GPS is saved"}</span></div>
    <div class="buildingLocationActions07912"><button type="button" class="ghost" id="cancelLocation07912">Cancel</button><button type="submit" class="primary">${existing?"Save Changes":"Add Location"}</button></div>
  </form>`;
  document.body.appendChild(overlay);
  const close=()=>overlay.remove();
  const updatePreview=()=>{const latRaw=String(document.getElementById("locationLat07912")?.value||"").trim(),lngRaw=String(document.getElementById("locationLng07912")?.value||"").trim();const lat=latRaw===""?null:Number(latRaw),lng=lngRaw===""?null:Number(lngRaw);const code=Number.isFinite(lat)&&Number.isFinite(lng)?encodePlusCode071(lat,lng,plusCodeSettings0794().locationLength):"";document.getElementById("locationPlusPreview07912").textContent=code||"Plus Code generated after GPS is saved";};
  overlay.addEventListener("click",e=>{if(e.target===overlay)close();});
  document.getElementById("closeLocationEditor07912").onclick=close;document.getElementById("cancelLocation07912").onclick=close;
  document.getElementById("locationLat07912").oninput=updatePreview;document.getElementById("locationLng07912").oninput=updatePreview;
  document.getElementById("useAccountGps07912").onclick=()=>{if(!hasGps(s))return;document.getElementById("locationLat07912").value=s.gps.lat;document.getElementById("locationLng07912").value=s.gps.lng;updatePreview();};
  document.getElementById("captureLocationGps07912").onclick=()=>{if(!navigator.geolocation){toast("GPS is not available.","error");return;}toast("Capturing precise location…");navigator.geolocation.getCurrentPosition(pos=>{document.getElementById("locationLat07912").value=Number(pos.coords.latitude.toFixed(7));document.getElementById("locationLng07912").value=Number(pos.coords.longitude.toFixed(7));p.accuracy=Math.round(pos.coords.accuracy||0);updatePreview();toast("Location captured.","success");},err=>toast(`GPS failed: ${err.message||"permission denied"}`,"error"),{enableHighAccuracy:true,timeout:20000,maximumAge:0});};
  document.getElementById("buildingLocationForm07912").onsubmit=e=>{
    e.preventDefault();
    const label=val("locationLabel07912").trim();if(!label){toast("Enter a location name.","error");return;}
    const latRaw=val("locationLat07912").trim(),lngRaw=val("locationLng07912").trim();
    const lat=latRaw===""?null:Number(latRaw),lng=lngRaw===""?null:Number(lngRaw);
    if((latRaw!==""||lngRaw!=="")&&(!Number.isFinite(lat)||!Number.isFinite(lng)||lat>90||lat< -90||lng>180||lng< -180)){toast("Enter valid latitude and longitude.","error");return;}
    const target=existing||p;
    Object.assign(target,{type:val("locationType07912"),label,floor:val("locationFloor07912").trim(),placement:val("locationPlacement07912"),description:val("locationDescription07912").trim(),notes:val("locationNotes07912").trim(),lat,lng,accuracy:p.accuracy||target.accuracy||0,verification:val("locationVerification07912"),photoDocId:val("locationPhoto07912"),updatedAt:new Date().toISOString()});
    if(target.verification==="verified"&&!target.lastVerifiedAt)target.lastVerifiedAt=new Date().toISOString();
    if(target.verification!=="verified"&&target.verification!=="needs")target.lastVerifiedAt="";
    target.plusCode=Number.isFinite(lat)&&Number.isFinite(lng)?encodePlusCode071(lat,lng,plusCodeSettings0794().locationLength):"";
    if(!existing){locationPoints071(s).push(target);if(!s.preferredLocationPointId)s.preferredLocationPointId=target.id;}
    locationTimeline07912(s,existing?"Location updated":"Location added",target);
    save();close();accountDetailTab0735="locations";rememberAccountTab0751("locations");toast(`${target.label} saved.`,"success");siteDetail();
  };
}
function addLocationPoint071(){openLocationEditor07912();}
function setPreferredLocation071(id){ const s=site();if(!s)return;s.preferredLocationPointId=id||"";const p=locationPoints071(s).find(x=>x.id===id);if(p)locationTimeline07912(s,"Default route changed",p);save();toast("Route destination updated.","success");siteDetail(); }
function deleteLocationPoint071(id){ const s=site();if(!s)return;const p=locationPoints071(s).find(x=>x.id===id);if(!p||!confirm(`Delete ${p.label||'this location'}?`))return;locationTimeline07912(s,"Location deleted",p);s.locationPoints=s.locationPoints.filter(x=>x.id!==id);if(s.preferredLocationPointId===id)s.preferredLocationPointId="";save();siteDetail(); }
function routeLocationPoint071(id){ const s=site();const p=locationPoints071(s).find(x=>x.id===id);if(p)window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(p.plusCode||`${p.lat},${p.lng}`)}`,'_blank'); }
function markLocationVerified07912(id){const s=site();const p=locationPoints071(s).find(x=>x.id===id);if(!p)return;p.verification="verified";p.lastVerifiedAt=new Date().toISOString();p.updatedAt=p.lastVerifiedAt;locationTimeline07912(s,"Location verified",p);save();toast(`${p.label} verified.`,"success");siteDetail();}
async function shareLocation07912(id){const s=site();const p=locationPoints071(s).find(x=>x.id===id);if(!p)return;const text=[`${s.name||"FireVault Account"} — ${p.label}`,p.type,locationMeta07912(p),p.plusCode?`Plus Code: ${p.plusCode}`:"",Number.isFinite(p.lat)&&Number.isFinite(p.lng)?`GPS: ${p.lat}, ${p.lng}`:"",p.notes].filter(Boolean).join("\n");if(navigator.share){try{await navigator.share({title:p.label,text});return;}catch(err){if(err?.name==="AbortError")return;}}copyText071(text,"Location copied.");}
function locationPlot07912(s,points){
  const valid=points.filter(p=>Number.isFinite(p.lat)&&Number.isFinite(p.lng));
  if(!valid.length)return `<div class="buildingPlotEmpty07912"><span>⌖</span><strong>No precise locations plotted</strong><small>Add GPS coordinates to place critical equipment on the site plot.</small></div>`;
  let minLat=Math.min(...valid.map(p=>p.lat)),maxLat=Math.max(...valid.map(p=>p.lat)),minLng=Math.min(...valid.map(p=>p.lng)),maxLng=Math.max(...valid.map(p=>p.lng));
  if(maxLat-minLat<0.00005){minLat-=0.00005;maxLat+=0.00005;}if(maxLng-minLng<0.00005){minLng-=0.00005;maxLng+=0.00005;}
  return `<div class="buildingLocationPlot07912" aria-label="Relative site location plot"><div class="buildingPlotGrid07912"></div>${valid.map((p,i)=>{let x=8+84*((p.lng-minLng)/(maxLng-minLng)),y=8+84*(1-(p.lat-minLat)/(maxLat-minLat));if(valid.length>1&&valid.every(q=>Math.abs(q.lat-p.lat)<1e-8&&Math.abs(q.lng-p.lng)<1e-8)){const a=(i/valid.length)*Math.PI*2;x=50+Math.cos(a)*18;y=50+Math.sin(a)*18;}return `<button class="buildingPlotPin07912 ${s.preferredLocationPointId===p.id?"preferred":""}" style="left:${x.toFixed(1)}%;top:${y.toFixed(1)}%" data-location-open07912="${esc(p.id)}" aria-label="${esc(p.label)}"><span>${locationIcon07912(p.type)}</span><b>${esc(p.label)}</b></button>`;}).join("")}<small>Relative GPS view • Tap a pin to edit</small></div>`;
}
function accountPlusCodeSummary07912(s){
  const code=sitePlusCode071(s),preferred=preferredLocation071(s),count=locationPoints071(s).length;
  return `<section class="accountPanel0735 accountPlusSummary07912"><div class="accountPanelHead0735"><div><span>GOOGLE PLUS CODE</span><h2>${esc(code||"GPS required")}</h2></div><button class="primary" id="openLocations07912">Locations ${count?`(${count})`:""}</button></div><p>${preferred?`Route currently targets ${esc(preferred.label)}.`:"Add exact entrances, panels, risers, FDCs, and other critical locations."}</p><div class="accountInlineActions067">${code?`<button class="ghost" id="copyPrimaryPlus071">Copy Code</button><button class="ghost" id="openPrimaryPlus0794">Google Maps</button>`:""}<button class="ghost" id="addLocationPoint071">＋ Add Location</button></div></section>`;
}
function accountLocationsTab07912(s){
  const points=locationPoints071(s),preferred=preferredLocation071(s),verified=points.filter(p=>locationVerification07912(p).key==="verified").length,needs=points.filter(p=>locationVerification07912(p).key!=="verified").length;
  return `<div class="accountTabPanel0735 buildingNavigator07912">
    <section class="accountPanel0735 buildingNavigatorHero07912"><div class="accountPanelHead0735"><div><span>BUILDING NAVIGATOR</span><h2>${points.length} Saved Location${points.length===1?"":"s"}</h2><p>Find the exact entrance, panel, riser, FDC, pump, or access point.</p></div><button class="primary" id="addLocationPoint071">＋ Add Location</button></div><div class="buildingNavigatorStats07912"><span><strong>${verified}</strong> Verified</span><span><strong>${needs}</strong> Review</span><span><strong>${preferred?esc(preferred.label):"Account"}</strong> Route target</span></div>${locationPlot07912(s,points)}</section>
    ${points.length?`<section class="buildingLocationList07912">${points.map(p=>{const status=locationVerification07912(p),photo=locationPhoto07912(s,p);return `<article class="buildingLocationCard07912 ${s.preferredLocationPointId===p.id?"preferred":""}">${photo?`<button class="buildingLocationPhoto07912" data-location-photo07912="${esc(p.id)}"><img src="${esc(photo.imageData)}" alt="${esc(p.label)}"></button>`:`<div class="buildingLocationIcon07912">${locationIcon07912(p.type)}</div>`}<div class="buildingLocationMain07912"><div class="buildingLocationTitle07912"><div><span>${esc(p.type)}</span><strong>${esc(p.label)}</strong></div><em class="locationVerify-${status.key}">${status.label}</em></div><p>${esc([p.description,p.notes].filter(Boolean).join(" • ")||"No access notes entered.")}</p><div class="buildingLocationMeta07912"><span>${esc(locationMeta07912(p)||"Location details not entered")}</span>${p.plusCode?`<b>${esc(p.plusCode)}</b>`:"<b>GPS required</b>"}</div><div class="buildingLocationActionsCard07912"><button class="primary" data-location-route07912="${esc(p.id)}" ${Number.isFinite(p.lat)&&Number.isFinite(p.lng)?"":"disabled"}>Route</button><button class="ghost" data-location-copy07912="${esc(p.id)}">Copy</button><button class="ghost" data-location-share07912="${esc(p.id)}">Share</button><button class="ghost" data-location-verify07912="${esc(p.id)}">Verify</button><button class="ghost" data-location-open07912="${esc(p.id)}">Edit</button><button class="${s.preferredLocationPointId===p.id?"primary":"ghost"}" data-location-default07912="${esc(p.id)}">${s.preferredLocationPointId===p.id?"Default":"Use"}</button><button class="danger" data-location-delete07912="${esc(p.id)}" aria-label="Delete ${esc(p.label)}">×</button></div></div></article>`;}).join("")}</section>`:`<section class="accountEmptyState0735 buildingNavigatorEmpty07912"><strong>No building locations saved</strong><span>Add the main entrance, fire alarm panel, riser room, FDC, Knox Box, parking area, or another exact point.</span><button class="primary" id="addLocationEmpty07912">Add First Location</button></section>`}
  </div>`;
}
function plusCodeSection071(s){return accountPlusCodeSummary07912(s);}

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
function updateAccountPlusPreview0794(){
  const box=document.getElementById("accountPlusPreview0794");if(!box)return;
  const lat=Number(document.getElementById("gpsLat")?.value),lng=Number(document.getElementById("gpsLng")?.value);
  const cfg=plusCodeSettings0794();
  const code=Number.isFinite(lat)&&Number.isFinite(lng)?encodePlusCode071(lat,lng,cfg.accountLength):"";
  box.innerHTML=code?`<span>Google Plus Code</span><strong>${esc(code)}</strong><small>${cfg.accountLength} digits • ${plusCodePrecisionLabel(cfg.accountLength)}</small>`:`<span>Google Plus Code</span><strong>GPS required</strong><small>Enter or capture latitude and longitude.</small>`;
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
    updateAccountPlusPreview0794();
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

function reportPlusCodeLine0794(s){
  const cfg=plusCodeSettings0794();
  if(!cfg.enabled||!cfg.includeInReports)return "";
  const code=navigationPlusCode071(s)||sitePlusCode071(s);
  return code?`Plus Code: ${code}`:"Plus Code: GPS required";
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
    ...(reportPlusCodeLine0794(s)?[reportPlusCodeLine0794(s)]:[]),
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
  const parts=[s.name, fullAddress(s), s.panelManufacturer, s.panelModel, s.notes, s.externalAccountId, s.sitePhone, s.devicePhone, s.deviceType, s.siteId1, s.siteId2, s.siteLanguage, s.devicePhoneComment, s.sourceGroupNumber, plusCodeSettings0794().searchable?sitePlusCode071(s):"", ...(plusCodeSettings0794().searchable?locationPoints071(s).map(p=>p.plusCode):[]), ...accountTags0737(s).map(tag=>tag.name)];
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
  nearbyReturnView0877=view==="sites"?"sites":"home";
  route("nearbySites");
  setTimeout(()=>runNearbyScan0652("nearbySites"),30);
}

function applyTheme(){
  const body=document.body;
  [...body.classList].forEach(cls=>{if(cls.startsWith("theme-") || ["large-text","compact-layout","square-buttons","solid-cards","demoMode0738"].includes(cls)) body.classList.remove(cls);});
  body.classList.add("theme-midnight");
  body.classList.toggle("demoMode0738",isDemoMode());
  body.style.removeProperty("--accent");
  const meta=document.querySelector('meta[name="theme-color"]');
  if(meta) meta.setAttribute("content","#07111f");
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
function setActiveNav(){
  document.querySelectorAll("#appNav button").forEach(b=>{b.classList.remove("active");b.removeAttribute("aria-current");});
  const section=(["dailySummary","actionCenter","pinnedSites","dashboard068","nearbySites"].includes(view)?"home":(["siteDetail","visits","visitDetail","checklist","siteForm","contactsList","contactForm","siteDocs","siteDocForm","equipmentList","equipmentForm","tasks","taskForm","deficiencies","deficiencyForm","report","jobMode","attention"].includes(view)?"sites":view));
  const active=document.getElementById("nav-"+section);
  if(active){active.classList.add("active");active.setAttribute("aria-current","page");}
}
function syncGlobalHeaderClearance0752(){
  const header=document.getElementById("appHeader");
  if(!header || getComputedStyle(header).display==="none") return;
  const measured=Math.ceil(header.getBoundingClientRect().height||0);
  if(measured>0) document.documentElement.style.setProperty("--fv-measured-header-h",`${measured}px`);
}
function wireGlobalHeader537(){ updateGlobalToday071(); requestAnimationFrame(syncGlobalHeaderClearance0752); }
function showGlobalChrome537(){ const h=document.getElementById("appHeader"); const n=document.getElementById("appNav"); if(h){ h.style.display="flex"; h.style.visibility="visible"; h.style.opacity="1"; } if(n){ n.style.display="grid"; n.style.visibility="visible"; n.style.opacity="1"; } wireGlobalHeader537(); requestAnimationFrame(()=>requestAnimationFrame(syncGlobalHeaderClearance0752)); }
window.addEventListener("resize",()=>requestAnimationFrame(syncGlobalHeaderClearance0752),{passive:true});
window.addEventListener("orientationchange",()=>setTimeout(syncGlobalHeaderClearance0752,120),{passive:true});

function contextualHelpInfo060(){
  if(view!=="settings") return CONTEXT_HELP_060[view]||null;
  if(settingsTab==="manual") return null;
  const tabMap={tech:["settings","Technician Profile"],gps:["route","GPS / Maps"],reports:["reports","Report Settings"],email:["reports","Email Settings"],overlay:["photos","Photo Overlay"],privacy:["settings","Privacy Lock"],security:["settings","Security Center"],customerImport:["sites","Customer Import"],categories:["sites","Categories"],backup:["backup","Backup & Restore"],about:["release","About FireVault"],architecture:["settings","Architecture & Modules"]};
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

function applyRoutePolishClass0780(){
  const safe=String(view||"home").replace(/[^a-zA-Z0-9_-]/g,"-");
  [...document.body.classList].forEach(cls=>{if(cls.startsWith("fv-route-"))document.body.classList.remove(cls);});
  document.body.classList.add(`fv-route-${safe}`);
  document.body.dataset.fvRoute=safe;
  const main=document.querySelector("main#app");
  if(main) main.dataset.fvRoute=safe;
}

function render(){
  try{
    view=resolveModuleRoute0955(view);
    const nextScrollKey0782=routeScrollKey0782();
    if(lastRenderedScrollKey0782 && lastRenderedScrollKey0782===nextScrollKey0782) captureRouteScroll0782(lastRenderedScrollKey0782);
    applyRoutePolishClass0780();
    const isHomeView=view === "home";
    /* Set the structural page mode before drawing the route. This prevents a
       route from briefly inheriting the previous screen's chrome geometry. */
    document.body.classList.toggle("homeFullscreen480", isHomeView);
    document.body.classList.toggle("homeLayoutFixed570", isHomeView);
    document.body.classList.toggle("settingsChrome572", view === "settings");
    if(!isHomeView) restoreAppChrome572();
    const routes = {home, dashboard068, dailySummary, actionCenter, pinnedSites:pinnedSitesManager567, sites, nearbySites, attention:attentionQueue, siteDetail, visits, visitDetail, checklist, siteForm, contactsList, contactForm, siteDocs, siteDocForm, equipmentList, equipmentForm, tasks, taskForm, deficiencies, deficiencyForm, report, library, resourceForm, jobMode, settings};
    (routes[view] || home)();
    document.body.classList.toggle("homeFullscreen480", isHomeView);
    document.body.classList.toggle("homeLayoutFixed570", isHomeView);
    document.body.classList.toggle("settingsChrome572", view === "settings");
    if(view !== "settings") document.body.classList.remove("settingsChrome572");
    applyFeatureVisibility();
    applyModuleNavigation0955();
    setActiveNav();
    injectContextualHelp060();
    applyRoutePolishClass0780();
    animateRouteEntry0781();
    installLayoutGuard0785();
    privacyInitialize0791();
  }catch(err){ showError(err); }
}

function showError(err){
  console.error(err);
  try{window.fireVaultRecordSupportError0900?.(err,"render");}catch{}
  html(`<div class="screen"><div class="card errorBox fvReleaseError0900"><h1>Something went wrong</h1><p>FireVault could not finish opening this screen. Your saved account data has not been removed.</p><div class="grid2"><button class="primary" id="fvReload0900">Reload</button><button class="ghost" id="fvHome0900">Return to Nearby</button></div></div></div>`);
  document.getElementById("fvReload0900")?.addEventListener("click",()=>location.reload());
  document.getElementById("fvHome0900")?.addEventListener("click",()=>{view="home";mode=null;render();});
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
  return todayNoteRows500().map(r=>({s:r.s,reason:`${r.notes.length} note${r.notes.length===1?"":"s"}`})).slice(0,5);
}
function dashboardSummary500(){
  const notes=todayNoteRows500();
  const noteCount=notes.reduce((n,r)=>n+r.notes.length,0);
  const openTasks=allTaskRows().filter(r=>!taskIsDone(r.t)).length;
  const openDef=data.sites.reduce((n,s)=>n+(s.deficiencies||[]).filter(d=>(d.status||"Open")!=="Closed").length,0);
  return {notes:noteCount,noteSites:notes.length,tasks:openTasks,def:openDef};
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
  const ids=[selectedSiteId,...todayAccounts500().map(r=>r.s.id),...recentAccounts476(8).map(s=>s.id)];
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
  const dashTasks=document.getElementById("dashTasks500"); if(dashTasks) dashTasks.onclick=()=>route("tasks");
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
  render();
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
  document.querySelectorAll("[data-pinned-open]").forEach(b=>b.onclick=()=>{selectedSiteId=b.dataset.pinnedOpen;accountDetailReturn0952="home";route("siteDetail");});
  document.querySelectorAll("[data-pinned-unpin]").forEach(b=>b.onclick=()=>unpinSiteById567(b.dataset.pinnedUnpin));
  document.querySelectorAll("[data-pinned-navigate]").forEach(b=>b.onclick=()=>{
    const s=(data.sites||[]).find(x=>x.id===b.dataset.pinnedNavigate);
    if(!s) return;
    window.open(mapUrl(s, data.settings.gps?.mapProvider || "apple"), "_blank");
  });
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
      <div class="brand478 brand493"><img src="${esc(themeBrandAsset(APP_PROFILE,"mark"))}?v=${BUILD}" alt="FireVault"><strong>${fireVaultBrand575("homeWordmark575")}</strong></div>
      <button class="homeBuildPill481 homeBuildPill493" id="homeBell478" aria-label="Release notes"><span></span>${BUILD}</button>
      <button class="homeIcon478 settingsIcon493 stackedMenu553" id="modulesTopBtn476" aria-label="Settings">☰</button>
    </div>

    ${homeInstallTip482()}

    <div class="todayBlock478 todayBlock551 todayBlock569">
      <button class="todayRouteWrap478 todayDateButton569" id="todayDatePickerBtn569" aria-label="Open Daily Summary date picker"><div><h1>Today</h1><p>${esc(dateLine)}</p><em>Tap for past daily reports</em></div></button>
      <button class="todayAddSite551" id="addSiteBtn" aria-label="Add Account">＋</button>
    </div>

    <div class="appleSearchCard478">
      <div class="homeSearchBox476 homeSearchBox478 homeSearchConcept501"><span class="searchGlass478" aria-hidden="true">⌕</span><input id="homeCustomerSearch476" type="search" value="${esc(siteSearch)}" placeholder="" autocomplete="off"><span class="searchDivider501" aria-hidden="true"></span><button class="ghost smallBtn searchClear478 clearConcept501" id="clearHomeSearch476" type="button">Clear</button></div>
    </div>

    ${siteSearch?`<div class="card searchResultsPanel478" id="homeSearchResults476">${homeAccountRowsMarkup476()}</div>`:`<div id="homeSearchResults476" class="searchResultsPanel478 hiddenSearchResults478"></div>`}

    ${!siteSearch && homeCardVisible550("pinnedSites")?pinnedSitesMarkup566():""}
    ${!siteSearch && homeCardVisible550("fieldFocus")?fieldFocusMarkup561():""}

    ${!siteSearch?`<div class="fieldDashboard500">
      <div class="fieldDashHead500"><div><strong>Field Dashboard</strong><span>Site notes, follow-ups, and daily summary</span></div><button class="ghost smallBtn" id="dailySummaryBtn500">Summary</button></div>
      <div class="fieldDashStats500">
        <button class="fieldStat500" id="dashNotes500"><strong>${dashboardSummary500().notes}</strong><span>Notes Today</span></button>
        <button class="fieldStat500" id="dashAccounts500"><strong>${dashboardSummary500().noteSites}</strong><span>Note Sites</span></button>
        <button class="fieldStat500" id="dashTasks500"><strong>${dashboardSummary500().tasks}</strong><span>Open Tasks</span></button>
      </div>
      <div class="fieldDashActions500">
        <button class="primary" id="quickAccountNote500">＋ Site Note</button>
        <button class="ghost" id="copySummary500">Copy Summary</button>
      </div>
    </div>
    <div class="todayAccountsPanel500">
      <div class="recentHead478"><div><strong>Today’s Accounts</strong><span>Notes saved today</span></div><button class="ghost smallBtn" id="allTodayAccounts500">Account Directory</button></div>
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
  if(homeRoot) homeRoot.onclick=e=>{const card=e.target.closest('[data-home-site]');if(card){selectedSiteId=card.dataset.homeSite;accountDetailReturn0952="home";route('siteDetail');}};
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
  const copyPins566=document.getElementById('copyPinnedSites566'); if(copyPins566) copyPins566.onclick=copyPinnedSites566;
  const openPins567=document.getElementById('openPinnedSites567'); if(openPins567) openPins567.onclick=()=>route('pinnedSites');
  wireFieldFocus561();
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
let nearbyStreetZoomTimer0840=null;

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
    <div id="nearbyMapCount069" class="nearbyMapCount069" hidden></div>
    <div class="nearbyMapControlMask0717" aria-hidden="true"></div>
    <div id="nearbySelectedOverlay0712" class="nearbySelectedOverlay0712" hidden></div>
    <div id="nearbyMapActions0711" class="nearbyMapActions0711" hidden>
      <button id="nearbyMapRoute0711" aria-label="Route to selected ${esc(recordTerm0954(1,true))}">${fvIcon073("route","fvMapActionIcon073")}<b>Route</b></button>
      <button id="nearbyMapCall0711" aria-label="Call selected ${esc(recordTerm0954(1,true))}">${fvIcon073("call","fvMapActionIcon073")}<b>Call</b></button>
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
    <section class="nearbyTop069"><div class="nearbyLogo069"><img src="${esc(themeBrandAsset(APP_PROFILE,"mark"))}?v=${BUILD}" alt=""><strong>${fireVaultBrand575()}</strong></div>${todayHeader070()}</section>
    <section class="nearbyCompactHead069">
      <div class="nearbyCompactTitle069"><h1>${esc(appLabel("nearbyRecords"))}</h1><span><i></i>${esc(gpsText)}</span></div>
      <div class="nearbyCompactActions069"><button class="nearbyViewToggle069" id="nearbyViewToggle069" aria-label="Switch between map and list">${fvIcon073(homeNearbyView069==='map'?'map':'list','fvToggleIcon073')}<b>${homeNearbyView069==='map'?'MAP':'LIST'}</b></button><label class="nearbyCategoryFilter070 category-${nearbyCategoryFilter070}" aria-label="Filter nearby accounts by communicator category" title="Filter: ${esc(NEARBY_CATEGORY_META_070[nearbyCategoryFilter070]?.label||'All')}"><span class="nearbyFilterGlyph0714" aria-hidden="true"></span><select id="nearbyCategoryFilter070" aria-label="Nearby account category filter">${categoryOptions070}</select></label></div>
    </section>
    ${status==='error'?`<div class="nearbyNotice069"><strong>Location problem:</strong> ${esc(nearbyScanStatus0652.message)}</div>`:''}
    <section class="nearbyWorkspace069 ${homeNearbyView069}">
      ${homeNearbyView069==='map'?homeNearbyMapShell069():''}
      <div class="nearbyListHead069"><strong>${rows.length} ${nearbyCategoryFilter070==='all'?'account':NEARBY_CATEGORY_META_070[nearbyCategoryFilter070].label+' account'}${rows.length===1?'':'s'} within ${NEARBY_LIST_MAX_MILES_069} miles</strong><span>Sorted by distance</span></div>
      <div class="nearbyCards069" id="nearbyCards069">${rows.length?rows.map(nearbyAccountCard069).join(''):`<div class="nearbyEmpty069">${nearbyState?'No nearby accounts found.':'Refreshing GPS…'}</div>`}</div>
    </section>
    <nav class="nearbyBottomNav069 fvNavThree0733"><button class="active" id="homeNearbyNav069" aria-label="Refresh nearby ${esc(recordTerm0954(2,true))} using current GPS">${fvIcon073("nearby","fvNavIcon073")}<span>Nearby</span></button><button id="homeAccounts069" aria-label="${esc(appLabel("searchRecords"))}">${fvIcon073("search","fvNavIcon073")}<span>Search</span></button><button id="homePhotoNav0950" aria-label="Take a photo for the selected ${esc(recordTerm0954(1,true))}">${fvIcon073("photo","fvNavIcon073")}<span>Photo</span></button><button id="homeSettingsNav069" aria-label="Open Settings">${fvIcon073("settings","fvNavIcon073")}<span>Settings</span></button></nav>
  </div>`);
  document.getElementById('homeAccounts069').onclick=()=>route('sites');
  document.getElementById('homePhotoNav0950').onclick=()=>{if(moduleEnabled0955("core.photos"))quickPhotoStart0950();};
  document.getElementById('homeSettingsNav069').onclick=()=>route('settings');
  const refreshNearbyHome0714=()=>{resetNearbyMapOverview069(false);runNearbyScan0652('home');};
  document.getElementById('homeNearbyNav069').onclick=refreshNearbyHome0714;
  document.getElementById('nearbyViewToggle069').onclick=()=>{homeNearbyView069=homeNearbyView069==='map'?'list':'map';fvSafeSet0739(HOME_NEARBY_VIEW_KEY_069,homeNearbyView069);home();};
  document.getElementById('nearbyCategoryFilter070').onchange=e=>{
    nearbyCategoryFilter070=e.target.value in NEARBY_CATEGORY_META_070?e.target.value:"all";
    homeNearbySelected069="";
    nearbyMapPopupSite069="";
    clearNearbyStreetZoom0840();
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
    clearNearbyStreetZoom0840();
    nearbyScrollActivated069=false;
    clearTimeout(nearbySnapTimer069);
    selectedSiteId=c.dataset.nearbyCard069;
    accountDetailReturn0952="home";
    route('siteDetail');
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
      clearNearbyStreetZoom0840();
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
      clearNearbyStreetZoom0840();
      if(nearbyStreetFocusSite069) resetNearbyMapOverview069(true);
    },{passive:true});
    list.addEventListener('scroll',()=>{
      clearNearbyStreetZoom0840();
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
function clearNearbyStreetZoom0840(){
  clearTimeout(nearbyStreetZoomTimer0840);
  nearbyStreetZoomTimer0840=null;
}
function scheduleNearbyStreetZoom0840(siteId,delay=5000){
  clearNearbyStreetZoom0840();
  if(homeNearbyView069!=="map"||!siteId)return;
  nearbyStreetZoomTimer0840=setTimeout(()=>{
    nearbyStreetZoomTimer0840=null;
    if(nearbyTouching069||nearbyScrollLock069||homeNearbySelected069!==siteId)return;
    const row=mapRow069(siteId);
    if(row)focusNearbyAccountMap069(row,false);
  },delay);
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
    selectedOverlay0712.hidden=!row;
    selectedOverlay0712.innerHTML=row?`<strong>${esc(row.s.name||'Unnamed Account')}</strong><span>${esc(fullAddress(row.s)||'No address saved')}</span>`:'';
  }
  document.querySelectorAll('[data-static-marker069]').forEach(m=>m.classList.toggle('selected',markerContainsSite0735(m,siteId)));
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
  clearNearbyStreetZoom0840();
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
    scheduleNearbyStreetZoom0840(best.dataset.nearbyCard069,5000);
    return;
  }
  nearbyScrollLock069=true;
  selectNearby069(best.dataset.nearbyCard069,true,false);
  list.scrollTo({top:safeTarget,behavior:'smooth'});
  setTimeout(()=>{
    nearbyScrollLock069=false;
    scheduleNearbyStreetZoom0840(best.dataset.nearbyCard069,5000);
  },320);
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
function markerContainsSite0735(marker,siteId){
  return String(marker?.dataset?.staticMarker069||"")===String(siteId||"");
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
    let rendered=0;
    rows.forEach((r,index)=>{
      const g=nearbyGps069(r.s); if(!g)return;
      const p=staticPoint069(g.lat,g.lng,b); if(!p||p.x<1||p.x>99||p.y<1||p.y>99)return;
      const category=accountCategory070(r.s);
      const selected=r.s.id===homeNearbySelected069;
      const number=index+1;
      rendered++;
      html+=`<button class="staticMarker069 category-${category} ${selected?'selected':''}" style="left:${p.x}%;top:${p.y}%" data-static-marker069="${esc(r.s.id)}" data-nearby-index069="${index}" data-marker-category070="${category}" aria-label="Nearby account ${number}: ${esc(r.s.name||'Unnamed Account')}"><span>${number}</span></button>`;
    });
    overlay.innerHTML=html||'<div class="staticMapMessage069">No mapped accounts are inside the current view.</div>';
    if(count){count.textContent=`${rendered} mapped account${rendered===1?'':'s'} • ${nearbyAdaptiveRadiusMiles069.toFixed(1)} mi radius`;count.hidden=false;}
    overlay.querySelectorAll('[data-static-marker069]').forEach(m=>m.onclick=e=>{
      e.stopPropagation();
      const id=m.dataset.staticMarker069;
      clearNearbyStreetZoom0840();
      selectNearby069(id,false,false,true);
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
  if(shell)shell.onclick=e=>{if(!e.target.closest('[data-static-marker069]'))updateNearbyMapSelection069();};
}

function sameLocalDay499(iso, day=localDateString()){
  if(!iso) return false;
  try{return localDateString(new Date(iso))===day;}catch{return false;}
}
function dailySummaryStats499(day=selectedDailySummaryDay569()){
  const noteRows=todaySiteNoteEntriesForAll506(day);
  const noteCount=noteRows.reduce((n,r)=>n+r.notes.length,0);
  const notesSites=[...new Set(noteRows.map(r=>r.s.id))];
  const tasksToday=allTaskRows().filter(r=>sameLocalDay499(r.t.createdAt||r.t.date,day));
  const defsToday=(data.sites||[]).flatMap(s=>(s.deficiencies||[]).map(d=>({s,d}))).filter(r=>sameLocalDay499(r.d.createdAt||r.d.date,day));
  const openTasks=allTaskRows().filter(r=>!taskIsDone(r.t));
  return {day,noteRows,noteCount,notesSites,tasksToday,defsToday,openTasks};
}
function dailyReportReadyItems508(st){
  const drafts=siteNoteDraftRows508();
  const items=[];
  if(st.noteCount) items.push({kind:"ok",label:"Site notes saved",detail:`${st.noteCount} note${st.noteCount===1?"":"s"} across ${st.notesSites.length} site${st.notesSites.length===1?"":"s"}.`});
  else items.push({kind:"warn",label:"No site notes yet",detail:"Add quick site notes before copying the final daily report."});
  if(drafts.length) items.push({kind:"warn",label:"Unsaved note drafts",detail:`${drafts.length} site draft${drafts.length===1?"":"s"} should be saved or cleared.`});
  else items.push({kind:"ok",label:"No unsaved drafts",detail:"Site note composer drafts are clear."});
  items.push({kind:"ok",label:"Daily report ready",detail:"Saved notes, tasks, and deficiencies are included automatically."});
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
      <div><strong>Report Date</strong><span>Pick any past day with saved notes, tasks, or deficiencies.</span></div>
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
      <div class="card"><strong>${st.tasksToday.length}</strong><span>New Tasks</span></div>
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

function accountDirectoryWork0759(s){
  const openTasks=siteOpenTasks556(s).length;
  const openDef=siteOpenDeficiencies556(s).length;
  if(openDef) return {label:`${openDef} open deficienc${openDef===1?"y":"ies"}`,cls:"danger",score:openDef*20+openTasks*4};
  if(openTasks) return {label:`${openTasks} open task${openTasks===1?"":"s"}`,cls:"warning",score:openTasks*5};
  return {label:"",cls:"",score:0};
}
function accountRecency0761(s){
  const stamp=new Date(s?.lastOpenedAt||0).getTime();
  if(!Number.isFinite(stamp)||stamp<=0) return "";
  const diff=Math.max(0,Date.now()-stamp);
  const minute=60*1000,hour=60*minute,day=24*hour;
  if(diff<minute) return "Opened now";
  if(diff<hour){const n=Math.max(1,Math.floor(diff/minute));return `Opened ${n} min ago`;}
  if(diff<day){const n=Math.max(1,Math.floor(diff/hour));return `Opened ${n} hr${n===1?"":"s"} ago`;}
  if(diff<7*day){const n=Math.max(1,Math.floor(diff/day));return `Opened ${n} day${n===1?"":"s"} ago`;}
  return `Opened ${new Date(stamp).toLocaleDateString([], {month:"short",day:"numeric"})}`;
}
function accountAddressKey0762(s){
  const key=normalizedAddressKey065(s).toLowerCase();
  return key.replace(/\|/g,"").trim()?key:"";
}
function accountAddressCounts0762(rows=[]){
  const counts=new Map();
  rows.forEach(s=>{const key=accountAddressKey0762(s);if(key)counts.set(key,(counts.get(key)||0)+1);});
  return counts;
}
function accountInitial0763(s){
  const first=String(s?.name||"").trim().charAt(0).toUpperCase();
  return /^[A-Z]$/.test(first)?first:"#";
}
function accountInitials0763(rows=[]){
  const initials=[...new Set(rows.map(accountInitial0763))];
  return initials.sort((a,b)=>a==="#"?-1:b==="#"?1:a.localeCompare(b));
}
function accountHealthBadge0762(health){
  if(health?.cls==="healthWarn") return {label:"Attention",cls:"danger"};
  if(health?.cls==="healthWatch") return {label:"Watch",cls:"warning"};
  return null;
}
function accountDirectoryRow0759(s,addressCount=1){
  const recordLower=recordTerm0954(1,true);
  const id=accountId069(s);
  const category=accountCategory070(s);
  const categoryLabel=NEARBY_CATEGORY_META_070[category]?.label||"Basic";
  const health=siteHealth(s);
  const healthBadge=accountHealthBadge0762(health);
  const work=accountDirectoryWork0759(s);
  const panel=[s.panelManufacturer,s.panelModel].filter(Boolean).join(" ");
  const contact=primaryContact477(s);
  const supporting=panel || contact?.name || "";
  const pinned=isPinnedSite566(s);
  const address=fullAddress(s)||"No address saved";
  const phone=phone069(s);
  const gpsReady=hasGps(s);
  const initial=accountInitial0763(s);
  const issueTags=[];
  if(healthBadge) issueTags.push(`<span class="${healthBadge.cls}">${esc(healthBadge.label)}</span>`);
  if(work.score>0&&work.label) issueTags.push(`<span class="${work.cls}">${esc(work.label)}</span>`);
  const issueMarkup=issueTags.length?`<div class="accountRowIssues0951">${issueTags.join("")}</div>`:"";
  const directoryActionIds=new Set(workflowActions0957("directory").map(action=>action.id));
  return `<article class="accountCard0871 accountRow0951 category-${category}" data-account-card0759 data-id="${esc(s.id)}" data-search="${esc(siteSearchBlob(s))}" data-letter0763="${esc(initial)}" role="button" tabindex="0" aria-label="Open ${esc(s.name||recordLower)}, ${esc(address)}">
    <div class="accountRowBody0951">
      <div class="accountRowMark0951" aria-hidden="true">${esc(initial)}</div>
      <div class="accountRowCopy0951">
        <div class="accountRowTitle0951"><h2>${esc(s.name||appLabel("unnamedRecord"))}</h2>${issueMarkup}</div>
        <p class="accountRowAddress0951">${esc(address)}</p>
        <div class="accountRowMeta0951">
          ${id?`<span class="accountRowId0951">${esc(id)}</span>`:""}
          <span class="accountRowCategory0951">${esc(categoryLabel)}</span>
          ${addressCount>1?`<span class="accountRowShared0951">${addressCount} here</span>`:""}
          ${supporting?`<span class="accountRowSupporting0951">${esc(supporting)}</span>`:""}
        </div>
      </div>
    </div>
    <div class="accountRowActions0951 workflowActions0957" style="${workflowActionStyle0957("directory")}" aria-label="${esc(appLabel("recordActions"))}">
      ${directoryActionIds.has("call")?`<button type="button" data-account-call0762="${esc(s.id)}" ${phone?"":"disabled"} aria-label="Call ${esc(s.name||recordLower)}">${fvIcon073("call","accountCardIcon0871")}<span>Call</span></button>`:""}
      ${directoryActionIds.has("route")?`<button type="button" data-account-route0762="${esc(s.id)}" ${gpsReady?"":"disabled"} aria-label="Route to ${esc(s.name||recordLower)}">${fvIcon073("route","accountCardIcon0871")}<span>Route</span></button>`:""}
      ${directoryActionIds.has("note")?`<button type="button" data-account-note0877="${esc(s.id)}" aria-label="Add note to ${esc(s.name||recordLower)}">${fvIcon073("note","accountCardIcon0871")}<span>Add Note</span></button>`:""}
      ${directoryActionIds.has("photo")?`<button type="button" data-account-photo0957="${esc(s.id)}" aria-label="Take photo for ${esc(s.name||recordLower)}">${fvIcon073("photo","accountCardIcon0871")}<span>Photo</span></button>`:""}
      ${directoryActionIds.has("favorite")?`<button type="button" class="accountFavorite0871 ${pinned?"active":""}" data-account-favorite0761="${esc(s.id)}" aria-pressed="${pinned?"true":"false"}" aria-label="${pinned?"Remove":"Add"} favorite">${pinned?"★":"☆"}<span>Favorite</span></button>`:""}
    </div>
  </article>`;
}
function accountDirectorySort0760(rows=[]){
  const nameSort=(a,b)=>String(a.name||"").localeCompare(String(b.name||""),undefined,{sensitivity:"base",numeric:true});
  return [...rows].sort((a,b)=>{
    if(accountsSort0760==="favorites"){
      const pinDiff=Number(isPinnedSite566(b))-Number(isPinnedSite566(a));
      if(pinDiff) return pinDiff;
    }
    if(accountsSort0760==="recent"){
      const recentDiff=new Date(b.lastOpenedAt||0).getTime()-new Date(a.lastOpenedAt||0).getTime();
      if(recentDiff) return recentDiff;
    }
    if(accountsSort0760==="attention"){
      const priority=s=>{
        const health=siteHealth(s);
        const healthScore=health.cls==="healthWarn"?100:health.cls==="healthWatch"?45:0;
        return healthScore+accountDirectoryWork0759(s).score;
      };
      const priorityDiff=priority(b)-priority(a);
      if(priorityDiff) return priorityDiff;
    }
    return nameSort(a,b);
  });
}
function accountsSortLabel0760(){
  return ({az:"Alphabetical",favorites:"Favorites",recent:"Recently opened",attention:"Priority"})[accountsSort0760]||"Alphabetical";
}
function accountsCardTop0796(list,card){
  if(!list||!card)return 0;
  const lr=list.getBoundingClientRect(),cr=card.getBoundingClientRect();
  return Math.max(0,list.scrollTop+(cr.top-lr.top));
}
function visibleAccountCards0876(list){
  return list?[...list.querySelectorAll("[data-account-card0759]")].filter(card=>!card.hidden):[];
}
function closestVisibleAccountCard0796(list){
  if(!list)return null;
  const listRect=list.getBoundingClientRect();
  const probeX=Math.min(listRect.right-8,listRect.left+Math.max(16,Math.min(48,listRect.width*.08)));
  const probeY=Math.min(listRect.bottom-2,listRect.top+3);
  let card=document.elementFromPoint(probeX,probeY)?.closest?.("[data-account-card0759]")||null;
  if(card&&(!list.contains(card)||card.hidden))card=null;
  const cards=visibleAccountCards0876(list);
  if(!cards.length)return null;
  if(!card){
    // Avoid measuring every card during momentum scrolling. offsetTop is already
    // maintained by layout, so a binary search finds the current card quickly.
    let low=0,high=cards.length-1,bestIndex=0;
    const current=Math.max(0,list.scrollTop);
    while(low<=high){
      const mid=(low+high)>>1;
      if(cards[mid].offsetTop<=current+2){bestIndex=mid;low=mid+1;}else high=mid-1;
    }
    card=cards[bestIndex]||cards[0];
  }
  const index=cards.indexOf(card);
  const candidates=[cards[index-1],card,cards[index+1]].filter(Boolean);
  const current=Math.max(0,list.scrollTop);
  let best=card,distance=Infinity;
  for(const candidate of candidates){
    const next=Math.abs(candidate.offsetTop-current);
    if(next<distance){distance=next;best=candidate;}
  }
  return best;
}
function prepareAccountsScrollTail0796(list){
  if(!list)return;
  let tail=list.querySelector(".accountsScrollTail0796");
  if(!tail){
    tail=document.createElement("div");
    tail.className="accountsScrollTail0796";
    tail.setAttribute("aria-hidden","true");
    list.appendChild(tail);
  }
  const visible=visibleAccountCards0876(list);
  const last=visible[visible.length-1];
  const height=last?Math.max(0,list.clientHeight-last.offsetHeight-8):0;
  tail.style.flexBasis=`${height}px`;
  tail.style.height=`${height}px`;
}
function scheduleAccountsSettle0796(list,delay=145){
  clearTimeout(accountsSnapTimer0796);
  accountsSnapTimer0796=setTimeout(()=>{
    if(!accountsTouching0796&&!accountsScrollLock0796)settleAccountsList0796(list);
  },delay);
}
function settleAccountsList0796(list){
  if(!list||accountsScrollLock0796||accountsTouching0796||!accountsScrollActivated0796)return;
  const card=closestVisibleAccountCard0796(list);
  if(!card)return;
  prepareAccountsScrollTail0796(list);
  const maxTop=Math.max(0,list.scrollHeight-list.clientHeight);
  const target=Math.min(maxTop,Math.max(0,card.offsetTop));
  accountsScrollLock0796=true;
  clearTimeout(accountsScrollEndTimer0876);
  // Do not animate the correction. The prior 430 ms smooth snap fought iOS
  // momentum and made the directory feel heavy. Wait for momentum to finish,
  // then make one small native-position correction at the card boundary.
  requestAnimationFrame(()=>{
    if(Math.abs(list.scrollTop-target)>1)list.scrollTop=target;
    accountsScroll0759=target;
    accountsLastScrollTop0876=target;
    requestAnimationFrame(()=>{
      accountsScrollLock0796=false;
      accountsScrollActivated0796=false;
      accountsScrollDirection0876=0;
      list.classList.remove("isScrolling0878");
      persistAccountsViewState0761(true);
    });
  });
}
function sites(){
  restoreAppChrome572();
  showGlobalChrome537();
  const recordSingular=recordTerm0954(),recordPlural=recordTerm0954(2),recordLower=recordTerm0954(1,true),recordsLower=recordTerm0954(2,true),recordIdLabel=recordIdLabel0954();
  const allAccounts=[...(data.sites||[])];
  const addressCounts=accountAddressCounts0762(allAccounts);
  const accounts=accountDirectorySort0760(allAccounts);
  sitesFilter0736="all";
  html(`<div class="screen accountDirectory0871 accountDirectory0951">
    <div class="accountDirectoryTop0940 accountDirectoryTop0951">
      <header class="accountDirectoryHeader0871 accountDirectoryHeader0940 accountDirectoryHeader0951">
        <div class="accountDirectoryHeading0951"><span>${esc(appNavigationLabel("search").toUpperCase())}</span><h1>${esc(appLabel("recordDirectory"))}</h1></div>
        <button type="button" class="accountAdd0871 accountAdd0940 accountAdd0951" id="addBtn0759" aria-label="${esc(appLabel("addRecord"))}"><span aria-hidden="true">＋</span><b>Add</b></button>
      </header>
      <section class="accountSearch0871 accountSearch0940 accountSearch0951" aria-label="${esc(appLabel("searchRecords"))}">
        ${fvIcon073("search","accountSearchIcon0871")}
        <input id="siteSearch0759" type="search" placeholder="Name, address, ${esc(recordIdLabel)}, panel, or phone" value="${esc(siteSearch)}" autocomplete="off" autocapitalize="none" spellcheck="false">
        <button type="button" id="clearSiteSearch0759" aria-label="Clear search" ${siteSearch?"":"hidden"}>×</button>
      </section>
      <section class="accountDirectoryTools0871 accountDirectoryTools0876 accountDirectoryTools0951">
        <p id="siteSearchCount0759" class="accountDirectoryCount0951">${accounts.length} ${accounts.length===1?recordLower:recordsLower}</p>
        <button type="button" class="accountDirectoryNear0951" id="nearBtn0759">${fvIcon073("nearby","accountToolIcon0871")}<span>Nearby</span></button>
        <label class="accountDirectorySort0951"><span>Sort: <b>${esc(accountsSortLabel0760())}</b></span><b>⌄</b><select id="accountsSort0871" aria-label="Sort ${esc(recordsLower)}"><option value="az" ${accountsSort0760==="az"?"selected":""}>A–Z</option><option value="favorites" ${accountsSort0760==="favorites"?"selected":""}>Favorites</option><option value="recent" ${accountsSort0760==="recent"?"selected":""}>Recent</option><option value="attention" ${accountsSort0760==="attention"?"selected":""}>Priority</option></select></label>
        <button type="button" class="accountDirectoryReset0876 accountDirectoryReset0951" id="resetAccounts0871" ${(!siteSearch&&accountsSort0760==="az")?"hidden":""}>Reset</button>
      </section>
    </div>
    <section class="accountDirectoryListShell0871">
      <div class="accountDirectoryList0871" id="accountsList0759">
        ${accounts.length?accounts.map(s=>accountDirectoryRow0759(s,addressCounts.get(accountAddressKey0762(s))||1)).join(""):`<div class="accountEmpty0871"><span>＋</span><strong>${esc(appLabel("noRecords"))}</strong><p>Add a ${esc(recordLower)} or import your customer list from Settings.</p><button class="primary" id="emptyAdd0759">${esc(appLabel("firstRecord"))}</button></div>`}
        <div class="accountNoResults0871" id="accountsNoResults0759" hidden><span>⌕</span><strong>${esc(appLabel("noMatchingRecords"))}</strong><p>Try a name, address, ${esc(recordIdLabel)}, panel, or contact.</p><button type="button" id="clearNoResults0871">Clear Search</button></div>
      </div>
    </section>
  </div>`);

  const list=document.getElementById("accountsList0759");
  const searchEl=document.getElementById("siteSearch0759");
  const clearBtn=document.getElementById("clearSiteSearch0759");
  const countEl=document.getElementById("siteSearchCount0759");
  const noResults=document.getElementById("accountsNoResults0759");
  const resetBtn=document.getElementById("resetAccounts0871");
  const openAdd=()=>{selectedSiteId=null;mode=null;route("siteForm");};
  document.getElementById("addBtn0759")?.addEventListener("click",openAdd);
  document.getElementById("emptyAdd0759")?.addEventListener("click",openAdd);
  document.getElementById("nearBtn0759")?.addEventListener("click",detectNearbySites);
  document.getElementById("accountsSort0871")?.addEventListener("change",event=>{accountsSort0760=event.target.value||"az";accountsScroll0759=0;persistAccountsViewState0761(true);sites();});
  const reset=()=>{siteSearch="";accountsSort0760="az";accountsScroll0759=0;persistAccountsViewState0761(true);sites();};
  resetBtn?.addEventListener("click",reset);

  let opening=false;
  const openAccount=id=>{
    if(opening)return;
    const target=(data.sites||[]).find(s=>s.id===id);
    if(!target){toast(`That ${recordLower} is no longer available.`);return;}
    opening=true;
    accountsScroll0759=list?.scrollTop||0;
    persistAccountsViewState0761(true);
    selectedSiteId=id;
    accountDetailReturn0952="sites";
    route("siteDetail");
  };
  const applySearch=()=>{
    siteSearch=(searchEl?.value||"").trim();
    const query=siteSearch.toLowerCase();
    let shown=0;
    list?.querySelectorAll("[data-account-card0759]").forEach(card=>{
      const visible=!query||(card.dataset.search||"").includes(query);
      card.hidden=!visible;
      if(visible)shown++;
    });
    if(countEl)countEl.textContent=query?`${shown} of ${allAccounts.length}`:`${shown} ${shown===1?recordLower:recordsLower}`;
    if(clearBtn)clearBtn.hidden=!query;
    if(noResults)noResults.hidden=shown!==0||allAccounts.length===0;
    if(resetBtn)resetBtn.hidden=!query&&accountsSort0760==="az";
    requestAnimationFrame(()=>prepareAccountsScrollTail0796(list));
    persistAccountsViewState0761();
  };
  const delayedSearch=debounce0830(applySearch,70);
  searchEl?.addEventListener("input",delayedSearch);
  searchEl?.addEventListener("search",applySearch);
  searchEl?.addEventListener("keydown",event=>{
    if(event.key==="Escape"){event.preventDefault();searchEl.value="";applySearch();}
    if(event.key==="Enter"){
      const first=[...list.querySelectorAll("[data-account-card0759]")].find(card=>!card.hidden);
      if(first){event.preventDefault();openAccount(first.dataset.id);}
    }
  });
  const clearSearch=()=>{if(searchEl){searchEl.value="";searchEl.focus();}applySearch();};
  clearBtn?.addEventListener("click",clearSearch);
  document.getElementById("clearNoResults0871")?.addEventListener("click",clearSearch);

  list?.addEventListener("click",event=>{
    const call=event.target.closest("[data-account-call0762]");
    if(call){event.preventDefault();event.stopPropagation();const target=(data.sites||[]).find(s=>s.id===call.dataset.accountCall0762);const phone=phone069(target);if(!phone){toast("No phone number is saved for this account.");return;}location.href=`tel:${phone.replace(/[^+\d]/g,"")}`;return;}
    const routeButton=event.target.closest("[data-account-route0762]");
    if(routeButton){event.preventDefault();event.stopPropagation();const target=(data.sites||[]).find(s=>s.id===routeButton.dataset.accountRoute0762);if(!target||!hasGps(target)){toast("GPS coordinates are not saved for this account.");return;}window.open(mapRouteUrl071(target),"_blank","noopener");return;}
    const noteButton=event.target.closest("[data-account-note0877]");
    if(noteButton){
      event.preventDefault();event.stopPropagation();
      const target=(data.sites||[]).find(s=>s.id===noteButton.dataset.accountNote0877);
      if(!target){toast(`That ${recordLower} is no longer available.`);return;}
      accountsScroll0759=list?.scrollTop||0;persistAccountsViewState0761(true);
      selectedSiteId=target.id;
      addSiteNotePrompt();
      return;
    }
    const photoButton=event.target.closest("[data-account-photo0957]");
    if(photoButton){
      event.preventDefault();event.stopPropagation();
      const target=(data.sites||[]).find(s=>s.id===photoButton.dataset.accountPhoto0957);
      if(!target){toast(`That ${recordLower} is no longer available.`);return;}
      selectedSiteId=target.id;quickPhotoStart0950(target.id);return;
    }
    const favorite=event.target.closest("[data-account-favorite0761]");
    if(favorite){
      event.preventDefault();event.stopPropagation();
      const target=(data.sites||[]).find(s=>s.id===favorite.dataset.accountFavorite0761);
      if(!target)return;
      if(isPinnedSite566(target))delete target.pinnedAt;else target.pinnedAt=new Date().toISOString();
      target.updatedAt=new Date().toISOString();save();
      accountsScroll0759=list?.scrollTop||0;persistAccountsViewState0761(true);sites();return;
    }
    const card=event.target.closest("[data-account-card0759]");
    if(card)openAccount(card.dataset.id);
  });
  list?.addEventListener("keydown",event=>{const card=event.target.closest("[data-account-card0759]");if(card&&(event.key==="Enter"||event.key===" ")){event.preventDefault();openAccount(card.dataset.id);}});
  if(list){
    accountsScrollActivated0796=false;
    accountsLastScrollTop0876=list.scrollTop;
    const finishAccountGesture0876=()=>{
      accountsTouching0796=false;
      if(accountsTouchMoved0796){
        accountsScrollActivated0796=true;
        scheduleAccountsSettle0796(list,135);
      }else list.classList.remove("isScrolling0878");
    };
    list.addEventListener("touchstart",()=>{
      accountsTouching0796=true;
      accountsTouchStart0796=list.scrollTop;
      accountsLastScrollTop0876=list.scrollTop;
      accountsTouchMoved0796=false;
      list.classList.add("isScrolling0878");
      clearTimeout(accountsSnapTimer0796);
      clearTimeout(accountsScrollEndTimer0876);
      // A new gesture must immediately interrupt a pending card correction.
      accountsScrollLock0796=false;
    },{passive:true});
    list.addEventListener("touchend",finishAccountGesture0876,{passive:true});
    list.addEventListener("touchcancel",finishAccountGesture0876,{passive:true});
    list.addEventListener("wheel",event=>{
      clearTimeout(accountsScrollEndTimer0876);
      accountsScrollLock0796=false;
      accountsScrollDirection0876=Math.sign(event.deltaY||0);
      accountsScrollActivated0796=true;
      accountsTouchMoved0796=true;
      list.classList.add("isScrolling0878");
      clearTimeout(accountsSnapTimer0796);
      scheduleAccountsSettle0796(list,105);
    },{passive:true});
    list.addEventListener("scroll",()=>{
      const current=list.scrollTop;
      const delta=current-accountsLastScrollTop0876;
      if(Math.abs(delta)>.5)accountsScrollDirection0876=Math.sign(delta);
      accountsLastScrollTop0876=current;
      accountsScroll0759=current;
      if(accountsTouching0796&&Math.abs(current-accountsTouchStart0796)>4){
        accountsTouchMoved0796=true;
        accountsScrollActivated0796=true;
      }
      if(accountsScrollActivated0796)list.classList.add("isScrolling0878");
      if(!accountsTouching0796&&!accountsScrollLock0796&&accountsScrollActivated0796)scheduleAccountsSettle0796(list,125);
      // Persist only after the gesture settles. Rebuilding and serializing the
      // view state during every scroll frame added avoidable main-thread work.
    },{passive:true});
    if("onscrollend" in list){
      list.addEventListener("scrollend",()=>{
        if(!accountsTouching0796&&!accountsScrollLock0796&&accountsScrollActivated0796)scheduleAccountsSettle0796(list,0);
      },{passive:true});
    }
  }
  applySearch();
  requestAnimationFrame(()=>{if(list){prepareAccountsScrollTail0796(list);list.scrollTop=Math.max(0,accountsScroll0759||0);}setActiveNav();});
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
  const status=nearbyState ? `${nearby.length} within ${radius} mi • nearest ${rows[0]?distanceLabel(rows[0].meters):"unavailable"} • phone accuracy ±${nearbyState.accuracy||0} m` : `Compare saved account locations within ${radius} miles.`;
  const message=noSites
    ? `<div class="card nearbyScanMessage0652 warning"><strong>No GPS-ready sites</strong><p>${esc(nearbyScanStatus0652.message||`${inv.total} sites are saved, but none contain usable latitude and longitude.`)}</p><button class="primary" id="nearbyOpenImport0652">Open Customer Import</button></div>`
    : isScanning
      ? `<div class="card nearbyScanMessage0652 scanning"><strong>Locating your phone</strong><p>${esc(nearbyScanStatus0652.message)}</p><span class="nearbySpinner0652" aria-hidden="true"></span></div>`
      : hasError
        ? `<div class="card nearbyScanMessage0652 error"><strong>Nearby scan could not finish</strong><p>${esc(nearbyScanStatus0652.message)}</p><div class="nearbyMessageActions0652"><button class="primary" id="nearbyRetry0652">Try Again</button><button class="ghost" id="nearbyGpsSettings0652">GPS Settings</button></div></div>`
        : nearbyState
          ? ``
          : `<div class="card nearbyScanMessage0652"><strong>Ready to scan</strong><p>Tap Scan to compare your current phone location with saved customer accounts.</p></div>`;
  html(`<div class="screen nearbyScreen nearbyScreen0652"><div class="row nearbyTop0652"><button class="back ghost" id="backBtn">←</button><button class="primary smallBtn" id="scanNearbyBtn" ${isScanning||noSites?'disabled':''}>${isScanning?"Scanning…":nearbyState?"Refresh":"Scan"}</button></div>
    <div class="card nearbyHero"><h1>Nearby Accounts</h1><p>${esc(status)}</p></div>
    ${message}
    <div class="list grow nearbyResults0652">${nearbyState && shown.length ? `${nearby.length?"":`<div class="nearbyFallbackNote0652">No account is inside the ${radius}-mile radius. Showing the nearest saved sites instead.</div>`}${shown.map(r=>`<div class="card siteItem nearbyItem ${r.meters <= radius*1609.344 ? "nearMatch" : "nearFallback"}" data-id="${r.s.id}"><div class="row"><div><h2>${esc(r.s.name||"Unnamed Site")}</h2><p>${esc(fullAddress(r.s))}</p><p>${esc(gpsLine(r.s))}</p></div><span class="pill gpsPill">${distanceLabel(r.meters)}</span></div></div>`).join("")}` : !nearbyState?`<div class="empty">Run a scan to display nearest sites.</div>`:""}</div>
  </div>`);
  document.getElementById("backBtn").onclick=()=>route(nearbyReturnView0877==="sites"?"sites":"home");
  const scan=document.getElementById("scanNearbyBtn"); if(scan) scan.onclick=()=>runNearbyScan0652("nearbySites");
  const retry=document.getElementById("nearbyRetry0652"); if(retry) retry.onclick=()=>runNearbyScan0652("nearbySites");
  const gpsSettings=document.getElementById("nearbyGpsSettings0652"); if(gpsSettings) gpsSettings.onclick=()=>{settingsTab="gps";mode="settingsDetail";route("settings");};
  const openImport=document.getElementById("nearbyOpenImport0652"); if(openImport) openImport.onclick=()=>{settingsTab="customerImport";mode="settingsDetail";route("settings");};
  document.querySelectorAll(".nearbyItem").forEach(el=>el.onclick=()=>{selectedSiteId=el.dataset.id;accountDetailReturn0952="nearbySites";route("siteDetail");});
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
    `Phone: ${formatPhone0758(c.phone)||"No phone saved"}`,
    `Email: ${c.email||"No email saved"}`,
    `Access: ${accessLine568(s)||"No access notes saved"}`,
    `Panel: ${panelLine568(s)||"No panel info saved"}`,
    `GPS: ${gpsLine(s)}`,
    s.externalAccountId?`External Account ID: ${s.externalAccountId}`:"",
    s.deviceType?`Device Type: ${s.deviceType}`:"",
    s.devicePhone?`Device Phone: ${formatPhone0758(s.devicePhone)||s.devicePhone}`:""
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
  const phone=formatPhone0758(c.phone)||c.email||"No phone/email";
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

/* Build 0.75.3 — persistent account workflow helpers */
function accountTabPreference0751(){
  try{
    const value=sessionStorage.getItem("firevault_account_tab_0751");
    return normalizeAccountTabForModules0955(value);
  }catch{return normalizeAccountTabForModules0955("overview");}
}
function rememberAccountTab0751(value){
  try{sessionStorage.setItem("firevault_account_tab_0751",value);}catch{}
}
function accountPersistentActions0751(s={},ctx={}){
  const phone=formatPhone0758(ctx.primary?.phone||s.sitePhone)||"";
  return `<section class="accountPersistentActions0751 accountActions0786" aria-label="${esc(appLabel("recordActions"))}">
    <button id="callPrimary477" ${phone?"":"disabled"} aria-label="Call account contact">${fvIcon073("call","accountPersistentIcon0751")}<strong>Call</strong><small>${phone?"Primary contact":"No phone"}</small></button>
    <button id="navigateBtn477" ${hasGps(s)?"":"disabled"} aria-label="Route to account">${fvIcon073("route","accountPersistentIcon0751")}<strong>Route</strong><small>${hasGps(s)?"Open navigation":"No GPS"}</small></button>
    <button id="qaAddNote544" aria-label="Add account note">${fvIcon073("note","accountPersistentIcon0751")}<strong>Note</strong><small>Quick entry</small></button>
  </section>`;
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
  if(moduleEnabled0955("optional.deficiencies"))(s.deficiencies||[]).forEach(d=>add(d.createdAt||d.updatedAt,"deficiency",d.title||appTerm("deficiency",1),`${d.priority||"Normal"} • ${d.status||"Open"}`,"deficiencies"));
  if(moduleEnabled0955("optional.tasks"))(s.tasks||[]).forEach(t=>add(t.createdAt||t.updatedAt,"task",t.title||appTerm("task",1),t.status||"Open","tasks"));
  if(moduleEnabled0955("core.files"))(s.docs||[]).forEach(d=>add(d.createdAt||d.updatedAt,"document",d.title||d.imageName||appTerm("file",1),docIsScan0800(d)?`${d.scanPageCount||d.scanPages.length}-page scan added`:docHasPhoto512(d)?"Photo added":"Document added","siteDocs"));
  if(moduleEnabled0955("core.locationNavigator"))(s.noteEntries||[]).filter(n=>n.type==="Building Location").forEach(n=>add(n.createdAt,"location",`${appTerm("location",1)} saved`,n.note||`${appTerm("location",1)} updated`,"locations"));
  return rows.sort((a,b)=>b.t-a.t).slice(0,limit);
}
function accountRecentMarkup0735(s={}){
  const rows=accountRecentActivity0735(s,6);
  if(!rows.length) return `<div class="accountEmptyState0735"><strong>No recent activity</strong><span>Activity from enabled modules will appear here.</span></div>`;
  const icons={visit:"✓",deficiency:"!",task:"□",document:"▣",location:"⌖"};
  return `<div class="accountRecentList0735">${rows.map(r=>`<button data-account-activity0735="${esc(r.routeName)}"><span class="kind-${esc(r.kind)}">${icons[r.kind]||"•"}</span><div><strong>${esc(r.title)}</strong><small>${esc(new Date(r.t).toLocaleDateString([], {month:"short",day:"numeric",year:"numeric"}))}${r.detail?` • ${esc(r.detail)}`:""}</small></div><b>›</b></button>`).join("")}</div>`;
}
function accountOverviewTab0735(s,ctx){
  const {health,primary,lastVisit,def,open}=ctx;
  const contactName=primary?contactTitle(primary):"No contact saved";
  const contactPhone=formatPhone0758(primary?.phone||s.sitePhone)||"";
  const address=fullAddress(s)||"No address saved";
  return `<div class="accountTabPanel0735 accountOverview0735 accountOverview0786">
    <section class="accountLocationCard0735 accountLocation0786">
      <div class="accountAddress0735">
        <div class="accountSectionHeading0786"><span>LOCATION</span><em class="${hasGps(s)?"gpsReady0786":"gpsMissing0786"}">${hasGps(s)?"GPS SAVED":"NO GPS"}</em></div>
        <strong>${esc(address)}</strong>
        ${hasGps(s)?`<small>${esc(gpsLine(s))}</small>`:`<small>Capture coordinates from the Details tab while on site.</small>`}
        <div class="accountLocationActions0786"><button class="ghost" id="copyAddress0786" ${address==="No address saved"?"disabled":""}>Copy Address</button><button class="ghost" id="locationDetails0786">Location Details</button></div>
      </div>
    </section>
    <section class="accountInfoCard0735 accountInfo0786">
      <button id="contactsQuick477"><span>Primary Contact</span><strong>${esc(contactName)}</strong>${contactPhone?`<small>${esc(contactPhone)}</small>`:""}</button>
      <button id="callSitePhone0786" ${contactPhone?"":"disabled"}><span>Phone</span><strong>${esc(contactPhone||"Not entered")}</strong></button>
      ${primary?.email?`<a href="mailto:${esc(primary.email)}"><span>Email</span><strong>${esc(primary.email)}</strong></a>`:""}
      <div><span>Category</span><strong>${esc(accountCategoryLabel0735(s))}</strong></div>
      <div><span>${esc(recordTerm0954())} Since</span><strong>${esc(accountSince0735(s))}</strong></div>
    </section>
    <section class="accountPanel0735 accountTimeline0786"><div class="accountPanelHead0735"><div><span>RECENT ACTIVITY</span><h2>${esc(recordTerm0954())} Timeline</h2></div><button class="ghost" id="allVisitsBtn">View All</button></div>${accountRecentMarkup0735(s)}</section>
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
        <div><span>${esc(recordIdLabel0954())}</span><strong>${esc(accountId069(s)||"Not assigned")}</strong></div>
        <div><span>Site Phone</span><strong>${esc(formatPhone0758(s.sitePhone)||s.sitePhone||"Not entered")}</strong></div>
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
    <section class="accountPanel0735"><div class="accountPanelHead0735"><div><span>PHOTOS</span><h2>${photos.length} ${esc(photos.length===1?appLabel("recordPhoto"):appLabel("recordPhotos"))}</h2></div><div><button class="ghost" id="openPhotoVaultBtn523">Open Vault</button><button class="primary" id="addAccountPhotoBtn523">＋ Photo</button></div></div>
      ${photos.length?`<div class="accountPhotoGrid0735">${photos.slice(0,8).map(d=>`<button class="accountPhotoThumb523" data-doc="${esc(d.id)}">${docPhotoThumb512(d)}<span>${esc(d.title||d.imageName||"Photo")}</span></button>`).join("")}</div>`:`<div class="accountEmptyState0735"><strong>No photos saved</strong><span>Add panel, device, wiring, deficiency, or completed-work photos.</span></div>`}
    </section>
    <section class="accountPanel0735"><div class="accountPanelHead0735"><div><span>FILES</span><h2>${docs.length} Saved Item${docs.length===1?"":"s"}</h2></div><button class="ghost" id="manageDocsBtn">Manage</button></div>
      ${moduleEnabled0955("optional.reports")?`<div class="accountDocActions0735"><button id="reportBtn"><span>▤</span><strong>Report</strong><small>Customer closeout</small></button><button id="checklistBtn"><span>✓</span><strong>Checklist</strong><small>Inspection workflow</small></button><button id="qaCloseout544"><span>↗</span><strong>Copy Closeout</strong><small>Customer packet</small></button></div>`:""}
    </section>
  </div>`;
}
function accountNotesTab0735(s,ctx){
  const {health,lastVisit,def,open}=ctx;
  const notesActionIds=new Set(workflowActions0957("notes").map(action=>action.id));
  return `<div class="accountTabPanel0735">
    <section class="accountPanel0735"><div class="accountPanelHead0735"><div><span>SITE NOTES</span><h2>Technician Notes</h2></div><button class="primary" id="addSiteNoteBtn491">＋ Add Note</button></div><div class="accountNotesBody0735">${esc(s.notes||"No notes entered.")}</div><div class="accountNoteDocActions0800"><button class="ghost accountWideButton0735" id="openSiteNotesBtn494">Open Full Notes Workspace</button></div></section>
    <section class="accountQuickBar0735 accountWorkActions0735 moduleActions0955 workflowActions0957" style="${workflowActionStyle0957("notes")}">${notesActionIds.has("task")?`<button id="qaAddTask544"><span>□</span><strong>${esc(appTerm("task",1))}</strong></button>`:""}${notesActionIds.has("deficiency")?`<button id="qaAddDef544"><span>!</span><strong>${esc(appTerm("deficiency",1))}</strong></button>`:""}${notesActionIds.has("photo")?`<button id="qaAddPhoto544"><span>▣</span><strong>Photo</strong></button>`:""}${notesActionIds.has("report")?`<button id="qaReport544"><span>▤</span><strong>Report</strong></button>`:""}</section>
    <section class="accountPanel0735"><div class="accountPanelHead0735"><div><span>RECENT VISIT</span><h2>${esc(lastVisit?visitDateLabel(lastVisit):"No completed visits")}</h2></div>${lastVisit?`<button class="ghost" id="allVisitsBtn">History</button>`:""}</div>${lastVisit?`<p class="accountVisitPreview0735">${esc(visitNotesPreview(lastVisit,3))}</p>`:`<div class="accountEmptyState0735"><span>Start a service visit to create an account history.</span></div>`}</section>
    ${featureOn("siteTimeline")?siteActivityTimelineMarkup557(s):""}
  </div>`;
}
function siteDetail(){
  restoreAppChrome572();
  showGlobalChrome537();
  const recordSingular=recordTerm0954(),recordLower=recordTerm0954(1,true),recordIdLabel=recordIdLabel0954();
  const s=site(); if(!s){route("sites");return;}
  if(accountDetailSite0735!==s.id){accountDetailSite0735=s.id;accountDetailTab0735=accountTabPreference0751();s.lastOpenedAt=new Date().toISOString();saveData(data);}
  const open=moduleEnabled0955("optional.tasks")?(s.tasks||[]).filter(t=>(t.status||"Open")!=="Done").length:0;
  const def=moduleEnabled0955("optional.deficiencies")?(s.deficiencies||[]).filter(d=>(d.status||"Open")!=="Closed").length:0;
  const siteVisits=Array.isArray(s.visits)?s.visits:[];
  const equipment=moduleEnabled0955("optional.equipment")&&Array.isArray(s.equipment)?s.equipment:[];
  const docs=moduleEnabled0955("core.files")&&Array.isArray(s.docs)?s.docs:[];
  const health=siteHealth(s);
  const lastVisit=siteVisits[0];
  const panel=[s.panelManufacturer,s.panelModel].filter(Boolean).join(" ")||"Panel not entered";
  const primary=primaryContact477(s);
  const access=accessSummary477(s);
  const ctx={open,def,siteVisits,equipment,docs,health,lastVisit,panel,primary,access};
  const accountId=accountId069(s)||`No ${recordIdLabel}`;
  const phone=formatPhone0758(primary?.phone||s.sitePhone)||"";
  const address=fullAddress(s)||"No address saved";
  const category=accountCategory070(s);
  const tabs=moduleAccountTabs0955();
  accountDetailTab0735=normalizeAccountTabForModules0955(accountDetailTab0735);
  const panelMarkup=accountDetailTab0735==="details"?accountDetailsTab0735(s,ctx):accountDetailTab0735==="locations"?accountLocationsTab07912(s):accountDetailTab0735==="equipment"?accountEquipmentTab0735(s):accountDetailTab0735==="docs"?accountDocsTab0735(s):accountDetailTab0735==="notes"?accountNotesTab0735(s,ctx):accountOverviewTab0735(s,ctx);
  const issueMarkup=(open||def)?`<div class="accountIssueStrip0952">${open?`<button type="button" id="taskBtn"><strong>${open}</strong><span>Open task${open===1?"":"s"}</span></button>`:""}${def?`<button type="button" class="danger" id="defBtn"><strong>${def}</strong><span>Deficienc${def===1?"y":"ies"}</span></button>`:""}</div>`:"";
  const tagMarkup=accountTagChips0737(s,6);
  const detailActionIds=new Set(workflowActions0957("detailPrimary").map(action=>action.id));
  const tabIcons1011={overview:"home",details:"list",locations:"map",equipment:"tools",docs:"library",notes:"note"};
  html(`<div class="screen accountDetail0871 accountDetail0952 accountDetail1011">
    <section class="accountDetailHeader0952 category-${category}">
      <header class="accountDetailTop0871 accountDetailTop0952">
        <button class="accountTopBack1011" id="backBtn" aria-label="Back"><span aria-hidden="true">‹</span><strong>Back</strong></button>
        <span>${esc(appLabel("recordDetail"))}</span>
        <div><button class="accountTopUtility1011 accountFavoriteUtility1013 ${isPinnedSite566(s)?"active":""}" id="pinSiteBtn566" aria-label="${isPinnedSite566(s)?"Remove from favorites":"Add to favorites"}" aria-pressed="${isPinnedSite566(s)?"true":"false"}" title="${isPinnedSite566(s)?"Remove from favorites":"Add to favorites"}">${fvIcon073("star","accountUtilityIcon1011")}</button><button class="accountTopUtility1011" id="editBtn" aria-label="${esc(appLabel("editRecord"))}">${fvIcon073("edit","accountUtilityIcon1011")}<small>Edit</small></button></div>
      </header>
      <div class="accountIdentity0871 accountIdentity0952">
        <div class="accountIdentityMain0952">
          <div class="accountIdentityMeta0871 accountIdentityMeta0952"><span>${esc(accountCategoryLabel0735(s))}</span><b>${esc(accountId)}</b></div>
          <h1>${esc(s.name||appLabel("unnamedRecord"))}</h1>
          <p>${esc(address)}</p>
        </div>
        ${issueMarkup}
        ${tagMarkup?`<div class="accountTags0871 accountTags0952">${tagMarkup}</div>`:""}
      </div>
      <section class="accountActionGrid0871 accountActionGrid0952 moduleActions0955 workflowActions0957" style="${workflowActionStyle0957("detailPrimary")}" aria-label="${esc(appLabel("recordActions"))}">
        ${detailActionIds.has("call")?`<button id="detailCall0871" ${phone?"":"disabled"}>${fvIcon073("call","accountActionIcon0871")}<strong>Call</strong></button>`:""}
        ${detailActionIds.has("route")?`<button id="detailRoute0871" ${hasGps(s)?"":"disabled"}>${fvIcon073("route","accountActionIcon0871")}<strong>Route</strong></button>`:""}
        ${detailActionIds.has("note")?`<button id="detailNote0871">${fvIcon073("note","accountActionIcon0871")}<strong>Add ${esc(appTerm("note",1))}</strong></button>`:""}
        ${detailActionIds.has("photo")?`<button id="detailPhoto0952">${fvIcon073("photo","accountActionIcon0871")}<strong>Photo</strong></button>`:""}
      </section>
      <nav class="accountTabs0871 accountTabs0952" aria-label="${esc(appLabel("recordSections"))}">${tabs.map(([key,label])=>`<button class="${accountDetailTab0735===key?"active":""}" data-account-tab0735="${key}" aria-current="${accountDetailTab0735===key?"page":"false"}">${fvIcon073(tabIcons1011[key]||"home","accountTabIcon1011")}<span>${label}</span></button>`).join("")}</nav>
    </section>
    <div class="accountDetailContent0871 accountDetailContent0952">${panelMarkup}</div>
  </div>`);

  document.getElementById("backBtn")?.addEventListener("click",()=>{const target=accountDetailReturn0952||"sites";route(target==="home"?"home":target==="nearbySites"?"nearbySites":"sites");});
  document.getElementById("editBtn")?.addEventListener("click",()=>{mode="edit";route("siteForm");});
  document.getElementById("pinSiteBtn566")?.addEventListener("click",toggleSitePinned566);
  document.getElementById("detailCall0871")?.addEventListener("click",()=>{if(phone)location.href=`tel:${phone.replace(/[^+\d]/g,"")}`;});
  document.getElementById("detailRoute0871")?.addEventListener("click",()=>{if(hasGps(s))window.open(mapRouteUrl071(s),"_blank","noopener");});
  document.getElementById("detailNote0871")?.addEventListener("click",addSiteNotePrompt);
  document.getElementById("detailPhoto0952")?.addEventListener("click",()=>quickPhotoStart0950());
  document.querySelectorAll("[data-account-tab0735]").forEach(b=>b.onclick=()=>{captureRouteScroll0782();accountDetailTab0735=b.dataset.accountTab0735;rememberAccountTab0751(accountDetailTab0735);render();});
  document.getElementById("editDetails0735")?.addEventListener("click",()=>{mode="edit";route("siteForm");});
  document.getElementById("qaAddNote544")?.addEventListener("click",addSiteNotePrompt);
  document.getElementById("qaAddPhoto544")?.addEventListener("click",()=>{mode="newPhoto";route("siteDocForm");});
  document.getElementById("qaAddDef544")?.addEventListener("click",()=>{mode=null;route("deficiencyForm");});
  document.getElementById("qaAddTask544")?.addEventListener("click",()=>{mode=null;route("taskForm");});
  document.getElementById("taskBtn")?.addEventListener("click",()=>route("tasks"));
  document.getElementById("defBtn")?.addEventListener("click",()=>route("deficiencies"));
  document.getElementById("visitsMini477")?.addEventListener("click",()=>route("visits"));
  document.getElementById("contactsQuick477")?.addEventListener("click",()=>route("contactsList"));
  document.getElementById("copyAddress0786")?.addEventListener("click",()=>copyText071(fullAddress(s),"Address copied."));
  document.getElementById("locationDetails0786")?.addEventListener("click",()=>{accountDetailTab0735="details";rememberAccountTab0751("details");render();});
  if(phone){document.getElementById("callPrimary477")?.addEventListener("click",()=>{location.href=`tel:${phone.replace(/[^+\d]/g,"")}`;});document.getElementById("callSitePhone0786")?.addEventListener("click",()=>{location.href=`tel:${phone.replace(/[^+\d]/g,"")}`;});}
  document.getElementById("navigateBtn477")?.addEventListener("click",()=>{if(hasGps(s))window.open(mapRouteUrl071(s),"_blank");});
  document.getElementById("accountMapRoute0735")?.addEventListener("click",()=>window.open(mapRouteUrl071(s),"_blank"));
  document.getElementById("allVisitsBtn")?.addEventListener("click",()=>route("visits"));
  document.querySelectorAll("[data-account-activity0735]").forEach(b=>b.onclick=()=>{const target=b.dataset.accountActivity0735;if(target==="locations"){accountDetailTab0735="locations";rememberAccountTab0751("locations");render();}else route(target);});
  document.getElementById("snapshotBtn")?.addEventListener("click",shareSiteSnapshot);
  document.getElementById("captureGpsBtn")?.addEventListener("click",captureGpsForSite);
  document.getElementById("appleBtn")?.addEventListener("click",()=>{if(hasGps(s))window.open(mapUrl(s,"apple"),"_blank");});
  document.getElementById("googleBtn")?.addEventListener("click",()=>{if(hasGps(s))window.open(mapUrl(s,"google"),"_blank");});
  document.getElementById("copyPrimaryPlus071")?.addEventListener("click",()=>copyText071(sitePlusCode071(s),"Plus Code copied."));
  document.getElementById("openPrimaryPlus0794")?.addEventListener("click",()=>{const code=sitePlusCode071(s);if(code)window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(code)}`,"_blank");});
  document.getElementById("openLocations07912")?.addEventListener("click",()=>{accountDetailTab0735="locations";rememberAccountTab0751("locations");render();});
  document.querySelectorAll("#addLocationPoint071,#addLocationEmpty07912").forEach(b=>b.addEventListener("click",addLocationPoint071));
  document.querySelectorAll("[data-location-open07912]").forEach(b=>b.onclick=()=>openLocationEditor07912(b.dataset.locationOpen07912));
  document.querySelectorAll("[data-location-route07912]").forEach(b=>b.onclick=()=>routeLocationPoint071(b.dataset.locationRoute07912));
  document.querySelectorAll("[data-location-copy07912]").forEach(b=>b.onclick=()=>{const p=locationPoints071(s).find(x=>x.id===b.dataset.locationCopy07912);if(p)copyText071([p.label,p.plusCode||"",Number.isFinite(p.lat)&&Number.isFinite(p.lng)?`${p.lat}, ${p.lng}`:""].filter(Boolean).join("\n"),"Location copied.");});
  document.querySelectorAll("[data-location-share07912]").forEach(b=>b.onclick=()=>shareLocation07912(b.dataset.locationShare07912));
  document.querySelectorAll("[data-location-verify07912]").forEach(b=>b.onclick=()=>markLocationVerified07912(b.dataset.locationVerify07912));
  document.querySelectorAll("[data-location-default07912]").forEach(b=>b.onclick=()=>setPreferredLocation071(b.dataset.locationDefault07912));
  document.querySelectorAll("[data-location-delete07912]").forEach(b=>b.onclick=()=>deleteLocationPoint071(b.dataset.locationDelete07912));
  document.querySelectorAll("[data-location-photo07912]").forEach(b=>b.onclick=()=>{const p=locationPoints071(s).find(x=>x.id===b.dataset.locationPhoto07912);const photo=p?locationPhoto07912(s,p):null;if(photo)photoPreviewModal524(photo);});
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
  wireImportantSiteInfo568();wireSiteBrief556();wireSiteActivity557();
  requestAnimationFrame(setActiveNav);
}
function photoCategory524(d={}){ return d.photoCategory || (docHasPhoto512(d) ? DEFAULT_PHOTO_CATEGORY_0956 : ""); }
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
function photoCategoryChips524(active=DEFAULT_PHOTO_CATEGORY_0956){
  return `<div class="photoCategoryGrid524">${PHOTO_CATEGORIES_524.map(cat=>`<button type="button" class="photoCategoryChip524 ${active===cat?"active":""}" data-photo-category="${esc(cat)}"><strong>${esc(cat)}</strong><span>${esc(photoCategoryHint524(cat))}</span></button>`).join("")}</div>`;
}
function selectedPhotoCategory524(){ return document.querySelector(".photoCategoryChip524.active")?.dataset.photoCategory || val("docPhotoCategory524") || DEFAULT_PHOTO_CATEGORY_0956; }
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
  if(docIsScan0800(d)) parts.push(`${d.scanPageCount||d.scanPages.length} page scanned PDF`);
  if(docHasPhoto512(d) && photoCategory524(d)) parts.push(photoCategory524(d));
  if(d.ref) parts.push(d.ref);
  if(d.url) parts.push("Link saved");
  if(d.date) parts.push(d.date);
  if(d.storageProvider && d.storageProvider!=="local") parts.push(`${fileStorageProviderLabel0794(d.storageProvider)} ${d.storageStatus==="pending"?"queued":"stored"}`);
  return parts.join(" • ") || "No reference details entered";
}
function docReportLine(d){
  const main=`- ${docTitle(d)}${d.ref?` | Ref ${d.ref}`:""}${d.date?` | ${d.date}`:""}${d.url?` | ${d.url}`:""}`;
  const caption=d.customerCaption ? `\n  Customer Caption: ${String(d.customerCaption).replaceAll("\n","\n  ")}` : "";
  const notes=d.notes ? `\n  Notes: ${String(d.notes).replaceAll("\n","\n  ")}` : "";
  return main + caption + notes;
}

function docHasPhoto512(d){ return !!(d && d.imageData && !docIsScan0800(d)); }
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
  const currentCategory=photoCategory524(d)||DEFAULT_PHOTO_CATEGORY_0956;
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
  return `<div class="docOverlayCard513">
    <div class="docOverlayHead513"><strong>Actual Overlay Preview</strong><span>Uses the same renderer as Download With Overlay.</span></div>
    <div class="docPhotoOverlayScene513 docPhotoOverlayCanvasScene0890"><canvas id="docOverlayCanvas0890" width="900" height="600" aria-label="Exact photo overlay preview"></canvas><div id="docOverlayStatus0890">Rendering overlay…</div></div>
  </div>`;
}
async function showDocOverlayPreview513(d={}){
  const holder=document.getElementById("docPhotoOverlayPreview513");
  if(!holder) return;
  const source=docPhotoDraftDataUrl512 || d.imageData || "";
  holder.innerHTML=docPhotoOverlayPreviewMarkup513(d);
  if(!source) return;
  const canvas=document.getElementById("docOverlayCanvas0890");
  const status=document.getElementById("docOverlayStatus0890");
  if(!canvas) return;
  try{
    const composed=await renderOverlayComposite0890(source,overlayCleanSetting510(data.settings.overlay||{}),site()||{},1200);
    if(!canvas.isConnected) return;
    canvas.width=composed.width;canvas.height=composed.height;
    canvas.getContext("2d").drawImage(composed,0,0);
    if(status)status.hidden=true;
  }catch(err){
    if(status)status.textContent="Preview unavailable";
  }
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
    const set=overlayCleanSetting510(data.settings.overlay||{});
    const canvas=await renderOverlayComposite0890(source,set,s||{},1800);
    canvas.toBlob(blob=>{
      if(!blob){ toast("Could not create overlay photo."); return; }
      const a=document.createElement("a");
      a.href=URL.createObjectURL(blob);
      a.download=`${safePhotoFileBase512(s,doc)}-overlay-build-${BUILD}.jpg`;
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(()=>URL.revokeObjectURL(a.href),1500);
      if(doc && doc.id){ doc.imageStampedAt=new Date().toISOString(); save(); }
      toast("Overlay photo downloaded.");
    },"image/jpeg",.92);
  }catch(err){
    console.error(err);
    toast("Could not create overlay photo.");
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
  document.querySelectorAll(".photoCategoryChip524").forEach(b=>b.onclick=()=>setPhotoCategory524(b.dataset.photoCategory||DEFAULT_PHOTO_CATEGORY_0956));
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
  const hay=[d.type,d.title,d.ref,d.url,d.notes,d.customerCaption,d.imageName,d.imageStampedAt,d.linkedDeficiencyTitle,d.linkedDeficiencyId,d.scanPageCount,docIsScan0800(d)?"scanned document pdf":""].filter(Boolean).join(" ").toLowerCase();
  return hay.includes(q);
}
function docVaultSearchBar521(){
  return `<div class="docSearchBar521"><span>⌕</span><input id="docVaultSearch521" value="${esc(docVaultSearch521)}" placeholder="Search photos, documents, links, notes..." autocomplete="off"><button type="button" class="ghost smallBtn" id="clearDocSearch521">Clear</button></div>`;
}
function docSortTime522(d){
  const ts=Date.parse(d.scanCreatedAt || d.imageUpdatedAt || d.updatedAt || d.createdAt || d.date || 0);
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
  return `<div class="card docVaultItem docVaultItem512 docVaultItem516 ${docIsScan0800(d)?"docVaultScan0800":""}" data-doc="${esc(d.id)}">
    ${docIsScan0800(d)?scannerThumb0800(d):docPhotoThumb512(d)}
    <div class="docVaultText512">
      <div class="row"><div><h2>${esc(docTitle(d))}</h2><p>${esc(docMeta(d))}</p>${docHasPhoto512(d)?`<p class="docPhotoMeta512"><span class="photoCategoryPill524">${esc(photoCategory524(d)||"Photo")}</span> ${d.linkedDeficiencyTitle?`<span class="photoDefLink525">Deficiency: ${esc(d.linkedDeficiencyTitle)}</span>`:esc(photoDocSummary512(d))}</p>`:""}</div><span class="pill">${docIsScan0800(d)?"PDF":esc(d.type||"Doc")}</span></div>
      ${notesPreview?`<p class="docNotes">${notesPreview}</p>`:""}
      <div class="docQuickActions">
        ${d.url?`<button class="ghost smallBtn openDocLink" data-url="${esc(d.url)}">Open Link</button>`:""}
        ${docHasPhoto512(d)?`<button class="primary smallBtn previewDocPhotoBtn524" data-doc="${esc(d.id)}">Preview</button><button class="primary smallBtn overlayDocPhotoBtn512" data-doc="${esc(d.id)}">Overlay Photo</button><button class="ghost smallBtn originalDocPhotoBtn516" data-doc="${esc(d.id)}">Original</button>`:""}
        ${docIsScan0800(d)?`<button class="primary smallBtn previewScan0800" data-doc="${esc(d.id)}">Open Scan</button><button class="primary smallBtn downloadScan0800" data-doc="${esc(d.id)}">PDF</button><button class="ghost smallBtn shareScan0800" data-doc="${esc(d.id)}">Share</button>`:""}
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
  const scans=docs.filter(docIsScan0800).length;
  const filteredDocs=sortedDocs522(docs.filter(docMatchesVaultFilter516).filter(docMatchesSearch521));
  const docListHtml = filteredDocs.length ? filteredDocs.map(siteDocCard519).join("") : `<div class="empty">No ${esc(docVaultFilterLabel516(docVaultFilter516).toLowerCase())} records found${docVaultSearch521?` for “${esc(docVaultSearch521)}”`:""}. Tap + to add a document, link, or field photo.</div>`;
  html(`<div class="screen docsScreen docsScreen512 docsScreen516"><div class="row"><button class="back ghost" id="backBtn">←</button><div><h1>Documents / Photos</h1><p>${esc(s.name||"Site")}</p></div><button class="primary" id="addDocBtn">＋</button></div>
    <div class="card docsHero docsHero516 docsHero521"><h2>Account Documents / Photo Vault</h2><p>Keep customer-specific references, links, field photos, and scanned paperwork stored with this account.</p><div class="docHeroActions523 docHeroActions0800"><button class="primary" id="addPhotoBtn523">＋ Add Photo</button><button class="ghost" id="addRegularDocBtn523">＋ Add Document / Link</button></div><div class="docStats docStats0800"><span><strong>${docs.length}</strong>Total</span><span><strong>${scans}</strong>Scans</span><span><strong>${photos}</strong>Photos</span><span><strong>${linked}</strong>Links</span></div>${docVaultSearchBar521()}${docVaultSortControls522()}${docVaultFilterBar516(docs)}</div>
    <div class="list grow docsList">${docListHtml}</div>
  </div>`);
  document.getElementById("backBtn").onclick=()=>route("siteDetail");
  document.getElementById("addDocBtn").onclick=()=>{mode="newPhoto";route("siteDocForm");};
  const addPhotoBtn523=document.getElementById("addPhotoBtn523"); if(addPhotoBtn523) addPhotoBtn523.onclick=()=>{mode="newPhoto"; route("siteDocForm");};
  const addRegularDocBtn523=document.getElementById("addRegularDocBtn523"); if(addRegularDocBtn523) addRegularDocBtn523.onclick=()=>{mode=null; route("siteDocForm");};
  const docSearch=document.getElementById("docVaultSearch521"); if(docSearch) docSearch.oninput=()=>{docVaultSearch521=docSearch.value; siteDocs();};
  const clearDocSearch=document.getElementById("clearDocSearch521"); if(clearDocSearch) clearDocSearch.onclick=()=>{docVaultSearch521=""; siteDocs();};
  const docSort=document.getElementById("docVaultSort522"); if(docSort) docSort.onchange=()=>{docVaultSort522=docSort.value||"recent"; siteDocs();};
  const copyDocList=document.getElementById("copyDocVaultList522"); if(copyDocList) copyDocList.onclick=async()=>{try{await navigator.clipboard.writeText(docVaultListText522(s, filteredDocs)); toast("Document list copied.");}catch{toast("Clipboard unavailable.");}};
  document.querySelectorAll(".docFilterBtn516").forEach(b=>b.onclick=e=>{e.stopPropagation(); docVaultFilter516=b.dataset.docFilter||"all"; siteDocs();});
  document.querySelectorAll(".docVaultItem").forEach(b=>b.onclick=()=>{const d=docs.find(x=>x.id===b.dataset.doc);if(docIsScan0800(d))scannedDocumentModal0800(d);else{mode=b.dataset.doc;route("siteDocForm");}});
  document.querySelectorAll(".openDocLink").forEach(b=>b.onclick=e=>{e.stopPropagation(); window.open(b.dataset.url,"_blank");});
  document.querySelectorAll(".copyDocRef").forEach(b=>b.onclick=async e=>{e.stopPropagation(); const d=docs.find(x=>x.id===b.dataset.doc); if(d){ await navigator.clipboard.writeText(`${docTitle(d)}
${d.url||""}
${d.customerCaption?`Customer Caption: ${d.customerCaption}`:""}
${d.notes||""}`.trim()); toast("Document reference copied."); }});
  document.querySelectorAll(".previewDocPhotoBtn524").forEach(b=>b.onclick=e=>{e.stopPropagation(); const d=docs.find(x=>x.id===b.dataset.doc); if(d) photoPreviewModal524(d);});
  document.querySelectorAll(".overlayDocPhotoBtn512").forEach(b=>b.onclick=e=>{e.stopPropagation(); const d=docs.find(x=>x.id===b.dataset.doc); if(d) downloadPhotoWithOverlay512(d);});
  document.querySelectorAll(".originalDocPhotoBtn516").forEach(b=>b.onclick=e=>{e.stopPropagation(); const d=docs.find(x=>x.id===b.dataset.doc); if(d) downloadOriginalPhoto513(d);});
  document.querySelectorAll(".previewScan0800").forEach(b=>b.onclick=e=>{e.stopPropagation();const d=docs.find(x=>x.id===b.dataset.doc);if(d)scannedDocumentModal0800(d);});
  document.querySelectorAll(".downloadScan0800").forEach(b=>b.onclick=e=>{e.stopPropagation();const d=docs.find(x=>x.id===b.dataset.doc);if(d)scannerDownloadPdf0800(d);});
  document.querySelectorAll(".shareScan0800").forEach(b=>b.onclick=e=>{e.stopPropagation();const d=docs.find(x=>x.id===b.dataset.doc);if(d)scannerSharePdf0800(d);});
}



function quickPhotoReadSafe0950(key,fallback=""){
  try{return localStorage.getItem(key)||fallback;}catch{return fallback;}
}
function quickPhotoWriteSafe0950(key,value){try{localStorage.setItem(key,String(value||""));}catch{}}
function quickPhotoAccountById0950(id){return (data.sites||[]).find(account=>account.id===id)||null;}
function quickPhotoCurrentAccount0950(){
  const ids=[selectedSiteId,view==="home"?homeNearbySelected069:"",QUICK_PHOTO_WORKFLOW_0957.rememberAccount?quickPhotoReadSafe0950(QUICK_PHOTO_LAST_ACCOUNT_KEY0950,""):""];
  for(const id of ids){const account=quickPhotoAccountById0950(id);if(account)return account;}
  return null;
}
function quickPhotoAccountMeta0950(account){
  if(!account)return "No account selected";
  return [account.externalAccountId||account.accountId||"",fullAddress(account)].filter(Boolean).join(" • ")||"Account information ready";
}
function quickPhotoEnsureInput0950(){
  if(quickPhotoInput0950?.isConnected)return quickPhotoInput0950;
  const input=document.createElement("input");
  input.type="file";input.accept="image/*";if(QUICK_PHOTO_WORKFLOW_0957.cameraFacing!=="none")input.setAttribute("capture",QUICK_PHOTO_WORKFLOW_0957.cameraFacing);input.hidden=true;input.id="quickPhotoInput0950";
  input.addEventListener("change",quickPhotoFileSelected0950);
  document.body.appendChild(input);quickPhotoInput0950=input;return input;
}
function quickPhotoStart0950(accountId=""){
  const account=quickPhotoAccountById0950(accountId)||quickPhotoCurrentAccount0950();
  if(!account){quickPhotoOpenAccountPicker0950(null,true);return;}
  const categories=workflowPhotoCategories0957();
  const fallbackCategory=workflowPhotoDefaultCategory0957();
  const rememberedCategory=QUICK_PHOTO_WORKFLOW_0957.rememberCategory?quickPhotoReadSafe0950(QUICK_PHOTO_LAST_CATEGORY_KEY0950,fallbackCategory):fallbackCategory;
  quickPhotoDraft0950={dataUrl:"",name:"",accountId:account.id,category:categories.includes(rememberedCategory)?rememberedCategory:fallbackCategory,useOverlay:Boolean(QUICK_PHOTO_WORKFLOW_0957.defaultUseOverlay),includeReport:Boolean(QUICK_PHOTO_WORKFLOW_0957.defaultIncludeReport)};
  if(QUICK_PHOTO_WORKFLOW_0957.rememberAccount)quickPhotoWriteSafe0950(QUICK_PHOTO_LAST_ACCOUNT_KEY0950,account.id);
  const input=quickPhotoEnsureInput0950();input.value="";input.click();
}
function quickPhotoLoadBitmap0950(file){
  if("createImageBitmap" in window)return createImageBitmap(file,{imageOrientation:"from-image"}).catch(()=>null);
  return Promise.resolve(null);
}
async function quickPhotoResize0950(file){
  let source=await quickPhotoLoadBitmap0950(file),cleanup=()=>{};
  if(!source){
    const url=URL.createObjectURL(file);cleanup=()=>URL.revokeObjectURL(url);
    source=await loadImage512(url);
  }
  try{
    const width=source.width||source.naturalWidth||1,height=source.height||source.naturalHeight||1,maxSide=QUICK_PHOTO_WORKFLOW_0957.maxImageDimension,scale=Math.min(1,maxSide/Math.max(width,height));
    const outW=Math.max(1,Math.round(width*scale)),outH=Math.max(1,Math.round(height*scale));
    const canvas=document.createElement("canvas");canvas.width=outW;canvas.height=outH;
    const ctx=canvas.getContext("2d",{alpha:false});ctx.fillStyle="#000";ctx.fillRect(0,0,outW,outH);ctx.drawImage(source,0,0,outW,outH);
    let quality=QUICK_PHOTO_WORKFLOW_0957.jpegQuality,result=canvas.toDataURL("image/jpeg",quality);
    while(result.length>4300000&&quality>.62){quality-=.06;result=canvas.toDataURL("image/jpeg",quality);}
    return {dataUrl:result,width:outW,height:outH};
  }finally{try{source.close?.();}catch{}cleanup();}
}
async function quickPhotoFileSelected0950(event){
  const file=event.target.files?.[0];if(!file)return;
  if(!file.type.startsWith("image/")){toast("Choose or take a photo.","error");return;}
  toast("Preparing field photo…");
  try{
    const resized=await quickPhotoResize0950(file);
    quickPhotoDraft0950.dataUrl=resized.dataUrl;quickPhotoDraft0950.name=file.name||`Field photo ${new Date().toLocaleString()}`;
    quickPhotoShowReview0950();
  }catch(err){console.error(err);toast("The photo could not be prepared. Try again.","error");}
}
function quickPhotoCloseReview0950(){quickPhotoOverlay0950?.remove();quickPhotoOverlay0950=null;}
function quickPhotoReviewAccountMarkup0950(account){
  const content=`<span>${esc(account?.name||appLabel("chooseRecord"))}</span><small>${esc(quickPhotoAccountMeta0950(account))}</small>`;
  return QUICK_PHOTO_WORKFLOW_0957.allowAccountChange
    ? `<button type="button" class="quickPhotoAccount0950" id="quickPhotoChangeAccount0950">${content}<b>Change</b></button>`
    : `<div class="quickPhotoAccount0950 quickPhotoAccountLocked0957">${content}<b>Selected</b></div>`;
}
function quickPhotoReviewMarkup0950(){
  const recordLower=recordTerm0954(1,true),account=quickPhotoAccountById0950(quickPhotoDraft0950.accountId),stamp=new Date();
  const title=`Field Photo - ${stamp.toLocaleDateString([], {month:"short",day:"numeric",year:"numeric"})} ${stamp.toLocaleTimeString([], {hour:"numeric",minute:"2-digit"})}`;
  const categories=workflowPhotoCategories0957();
  const optionRows=[
    QUICK_PHOTO_WORKFLOW_0957.showCategory?`<label><span>Category</span><select id="quickPhotoCategory0950">${categories.map(category=>`<option value="${esc(category)}" ${quickPhotoDraft0950.category===category?"selected":""}>${esc(category)}</option>`).join("")}</select></label>`:"",
    QUICK_PHOTO_WORKFLOW_0957.showOverlayToggle?`<label class="checkRow"><input type="checkbox" id="quickPhotoOverlayToggle0950" ${quickPhotoDraft0950.useOverlay?"checked":""}> <span>Show ${esc(recordLower)} overlay</span></label>`:"",
    QUICK_PHOTO_WORKFLOW_0957.showReportToggle&&moduleEnabled0955("optional.reports")?`<label class="checkRow"><input type="checkbox" id="quickPhotoReportToggle0950" ${quickPhotoDraft0950.includeReport?"checked":""}> <span>Include in customer report</span></label>`:""
  ].filter(Boolean).join("");
  const detailRows=[
    QUICK_PHOTO_WORKFLOW_0957.showTitle?`<label>Photo title<input id="quickPhotoTitleField0950" value="${esc(title)}"></label>`:"",
    QUICK_PHOTO_WORKFLOW_0957.showInternalNotes?`<label>Internal notes<textarea id="quickPhotoNotes0950" placeholder="Problem found, device address, circuit, or repair notes…"></textarea></label>`:"",
    QUICK_PHOTO_WORKFLOW_0957.showCustomerCaption?`<label>Customer caption<textarea id="quickPhotoCaption0950" placeholder="Optional customer-facing caption"></textarea></label>`:""
  ].filter(Boolean).join("");
  return `<section class="quickPhotoSheet0950" role="dialog" aria-modal="true" aria-labelledby="quickPhotoTitle0950">
    <header><div><span>QUICK CAPTURE</span><h2 id="quickPhotoTitle0950">Review Field Photo</h2></div><button type="button" class="ghost" id="quickPhotoClose0950" aria-label="Close photo review">×</button></header>
    <div class="quickPhotoPreview0950"><canvas id="quickPhotoPreviewCanvas0950" width="900" height="600" aria-label="Photo preview using selected ${esc(recordLower)} information"></canvas><div id="quickPhotoPreviewStatus0950">Building ${esc(recordLower)} overlay…</div></div>
    ${quickPhotoReviewAccountMarkup0950(account)}
    ${optionRows?`<div class="quickPhotoOptions0950">${optionRows}</div>`:""}
    ${detailRows?`<details class="quickPhotoDetails0950"><summary>Title and notes</summary>${detailRows}</details>`:""}
    <footer>${QUICK_PHOTO_WORKFLOW_0957.allowRetake?`<button type="button" class="ghost" id="quickPhotoRetake0950">Retake</button>`:""}<button type="button" class="primary" id="quickPhotoSave0950">Save Photo</button></footer>
  </section>`;
}
function quickPhotoShowReview0950(){
  quickPhotoCloseReview0950();
  const overlay=document.createElement("div");overlay.className="quickPhotoOverlay0950";overlay.innerHTML=quickPhotoReviewMarkup0950();document.body.appendChild(overlay);quickPhotoOverlay0950=overlay;
  overlay.addEventListener("click",event=>{if(event.target===overlay)quickPhotoCloseReview0950();});
  document.getElementById("quickPhotoClose0950")?.addEventListener("click",quickPhotoCloseReview0950);
  document.getElementById("quickPhotoRetake0950")?.addEventListener("click",()=>{quickPhotoCloseReview0950();const input=quickPhotoEnsureInput0950();input.value="";input.click();});
  document.getElementById("quickPhotoChangeAccount0950")?.addEventListener("click",()=>quickPhotoOpenAccountPicker0950(account=>{quickPhotoDraft0950.accountId=account.id;if(QUICK_PHOTO_WORKFLOW_0957.rememberAccount)quickPhotoWriteSafe0950(QUICK_PHOTO_LAST_ACCOUNT_KEY0950,account.id);quickPhotoShowReview0950();}));
  document.getElementById("quickPhotoCategory0950")?.addEventListener("change",event=>{quickPhotoDraft0950.category=event.target.value||workflowPhotoDefaultCategory0957();if(QUICK_PHOTO_WORKFLOW_0957.rememberCategory)quickPhotoWriteSafe0950(QUICK_PHOTO_LAST_CATEGORY_KEY0950,quickPhotoDraft0950.category);});
  document.getElementById("quickPhotoOverlayToggle0950")?.addEventListener("change",event=>{quickPhotoDraft0950.useOverlay=event.target.checked;quickPhotoRenderPreview0950();});
  document.getElementById("quickPhotoReportToggle0950")?.addEventListener("change",event=>{quickPhotoDraft0950.includeReport=event.target.checked;});
  document.getElementById("quickPhotoSave0950")?.addEventListener("click",quickPhotoSave0950);
  quickPhotoRenderPreview0950();
}
async function quickPhotoRenderPreview0950(){
  const recordLower=recordTerm0954(1,true);
  const canvas=document.getElementById("quickPhotoPreviewCanvas0950"),status=document.getElementById("quickPhotoPreviewStatus0950"),account=quickPhotoAccountById0950(quickPhotoDraft0950.accountId);
  if(!canvas||!quickPhotoDraft0950.dataUrl)return;
  const token=quickPhotoDraft0950.dataUrl+quickPhotoDraft0950.accountId+String(quickPhotoDraft0950.useOverlay);
  canvas.dataset.renderToken=token;if(status){status.hidden=false;status.textContent=quickPhotoDraft0950.useOverlay?`Building ${recordLower} overlay…`:"Preparing photo…";}
  try{
    const composed=quickPhotoDraft0950.useOverlay?await renderOverlayComposite0890(quickPhotoDraft0950.dataUrl,overlayCleanSetting510(data.settings.overlay||{}),account||{},1200):await loadImage512(quickPhotoDraft0950.dataUrl);
    if(!canvas.isConnected||canvas.dataset.renderToken!==token)return;
    canvas.width=composed.width||composed.naturalWidth;canvas.height=composed.height||composed.naturalHeight;canvas.getContext("2d").drawImage(composed,0,0,canvas.width,canvas.height);if(status)status.hidden=true;
  }catch(err){if(status)status.textContent="Preview unavailable";}
}
function quickPhotoOpenAccountPicker0950(onSelect=null,openCameraAfter=false){
  const recordSingular=recordTerm0954(),recordPlural=recordTerm0954(2),recordLower=recordTerm0954(1,true),recordsLower=recordTerm0954(2,true),recordIdLabel=recordIdLabel0954();
  quickPhotoPicker0950?.remove();
  const overlay=document.createElement("div");overlay.className="quickPhotoPickerOverlay0950";
  const accounts=[...(data.sites||[])].sort((a,b)=>String(a.name||"").localeCompare(String(b.name||""),undefined,{sensitivity:"base",numeric:true}));
  overlay.innerHTML=`<section class="quickPhotoPicker0950" role="dialog" aria-modal="true" aria-labelledby="quickPhotoPickerTitle0950"><header><div><span>PHOTO ${esc(recordSingular.toUpperCase())}</span><h2 id="quickPhotoPickerTitle0950">${esc(appLabel("chooseRecord"))}</h2></div><button type="button" class="ghost" id="quickPhotoPickerClose0950">×</button></header><div class="quickPhotoPickerSearch0950">${fvIcon073("search")}<input id="quickPhotoAccountSearch0950" type="search" placeholder="Search name, address, or ${esc(recordIdLabel)}" autocomplete="off"></div><div class="quickPhotoAccountList0950" id="quickPhotoAccountList0950">${accounts.map(account=>`<button type="button" data-quick-photo-account="${esc(account.id)}" data-search="${esc([account.name,account.externalAccountId,account.accountId,fullAddress(account)].filter(Boolean).join(" ").toLowerCase())}"><strong>${esc(account.name||appLabel("unnamedRecord"))}</strong><small>${esc(quickPhotoAccountMeta0950(account))}</small></button>`).join("")||`<div class="empty">No ${esc(recordsLower)} are available.</div>`}</div></section>`;
  document.body.appendChild(overlay);quickPhotoPicker0950=overlay;
  const close=()=>{overlay.remove();if(quickPhotoPicker0950===overlay)quickPhotoPicker0950=null;};
  overlay.addEventListener("click",event=>{if(event.target===overlay)close();});document.getElementById("quickPhotoPickerClose0950").onclick=close;
  document.getElementById("quickPhotoAccountSearch0950").oninput=event=>{const q=event.target.value.trim().toLowerCase();document.querySelectorAll("[data-quick-photo-account]").forEach(button=>button.hidden=Boolean(q)&&!button.dataset.search.includes(q));};
  document.querySelectorAll("[data-quick-photo-account]").forEach(button=>button.onclick=()=>{const account=quickPhotoAccountById0950(button.dataset.quickPhotoAccount);if(!account)return;close();quickPhotoDraft0950.accountId=account.id;if(QUICK_PHOTO_WORKFLOW_0957.rememberAccount)quickPhotoWriteSafe0950(QUICK_PHOTO_LAST_ACCOUNT_KEY0950,account.id);if(onSelect)onSelect(account);else if(openCameraAfter)quickPhotoStart0950(account.id);});
  setTimeout(()=>document.getElementById("quickPhotoAccountSearch0950")?.focus(),80);
}
async function quickPhotoSave0950(){
  const account=quickPhotoAccountById0950(quickPhotoDraft0950.accountId);if(!account){toast(`Choose a ${recordTerm0954(1,true)} before saving.`,"error");return;}
  if(!quickPhotoDraft0950.dataUrl){toast("Take a photo first.","error");return;}
  const button=document.getElementById("quickPhotoSave0950");setButtonBusy0781(button,true,"Saving photo…");
  const now=new Date(),title=val("quickPhotoTitleField0950")||`Field Photo - ${now.toLocaleDateString()}`;
  account.docs=Array.isArray(account.docs)?account.docs:[];
  const target=fileStorageTarget0794("photo");
  const record={id:uid(),type:"Photo Set",title,ref:"",url:"",date:now.toLocaleDateString(),notes:raw("quickPhotoNotes0950"),customerCaption:raw("quickPhotoCaption0950"),imageData:quickPhotoDraft0950.dataUrl,imageName:quickPhotoDraft0950.name||"Field photo",photoCategory:quickPhotoDraft0950.category||workflowPhotoDefaultCategory0957(),useOverlayOnSave:quickPhotoDraft0950.useOverlay,includeInCustomerReport:quickPhotoDraft0950.includeReport,imageUpdatedAt:now.toISOString(),createdAt:now.toISOString(),updatedAt:now.toISOString(),captureSource:"bottom-navigation",capturedAccountId:account.id,capturedAccountName:account.name||"",storageTargetId:`${target.provider||"local"}:photo`,storageProvider:target.provider||"local",storageFolder:target.folder||"FireVault/Photos",storageStatus:(target.provider||"local")==="local"?"local":"pending",remoteFileId:"",remoteRevision:"",remoteUrl:"",mediaRef:"",mediaStorage:""};
  account.docs.unshift(record);account.updatedAt=now.toISOString();
  try{const result=await stageVaultMedia(data);if(result.failed)throw new Error("The photo could not be protected in device media storage.");save();selectedSiteId=account.id;if(QUICK_PHOTO_WORKFLOW_0957.rememberAccount)quickPhotoWriteSafe0950(QUICK_PHOTO_LAST_ACCOUNT_KEY0950,account.id);if(QUICK_PHOTO_WORKFLOW_0957.rememberCategory)quickPhotoWriteSafe0950(QUICK_PHOTO_LAST_CATEGORY_KEY0950,record.photoCategory);quickPhotoCloseReview0950();toast(`Photo saved to ${account.name||recordTerm0954(1,true)}.`,`success`);}
  catch(err){account.docs=account.docs.filter(item=>item.id!==record.id);setButtonBusy0781(button,false);toast(err?.message||"Photo save failed. Try again.","error");}
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
  const storageKind0794=(isNewPhoto523||d?.imageData)?"photo":"document";
  const defaultStorage0794=fileStorageTarget0794(storageKind0794);
  const allowedStorageProviders0794=new Set(storageRoleProviders(APP_PROFILE,storageKind0794).map(provider=>provider.id));
  const requestedStorageProvider0794=d?.storageProvider||defaultStorage0794.provider||"local";
  const selectedStorageProvider0794=allowedStorageProviders0794.has(requestedStorageProvider0794)?requestedStorageProvider0794:(defaultStorage0794.provider||"local");
  const selectedStorageFolder0794=d?.storageFolder||defaultStorage0794.folder||`FireVault/${storageKind0794==="photo"?"Photos":"Documents"}`;
  html(`<div class="screen"><div class="row"><button class="back ghost" id="backBtn">←</button><h1>${formTitle523}</h1></div><div class="form grow">
    ${isNewPhoto523?`<div class="card addPhotoHint523"><strong>${isDefPhoto525?"Add Photo to Deficiency":"Add Photo to Account"}</strong><span>${isDefPhoto525?`This photo will be linked directly to: ${esc(linkedDef525?.title||"Deficiency")}.`:"Choose a photo, add a title or notes, then save it to this account’s Photo Vault."}</span></div>`:""}
    <div class="card docFormCard docFormCard512"><div class="compactField"><div><label>Type</label><select id="docType">${types.map(x=>`<option value="${esc(x)}" ${((d.type||defaultType523)===x)?"selected":""}>${esc(x)}</option>`).join("")}</select></div><div><label>Date / Revision</label><input id="docDate" value="${esc(d.date||"")}" placeholder="Rev, date, or version"></div></div>
    <label>Title</label><input id="docTitle" value="${esc(d.title||defaultTitle523)}" placeholder="Panel cabinet photo, SLC module, NAC wiring, deficiency photo...">
    <label>Reference / Account / Permit #</label><input id="docRef" value="${esc(d.ref||"")}" placeholder="Account number, permit number, drawing ID...">
    <label>URL / Link</label><input id="docUrl" value="${esc(d.url||"")}" placeholder="https://...">
    <div class="docStorageDestination0794"><div><label>Storage Destination</label><select id="docStorageProvider0794">${fileStorageOptions0794(selectedStorageProvider0794,storageKind0794)}</select></div><div><label>Destination Folder</label><input id="docStorageFolder0794" value="${esc(selectedStorageFolder0794)}" placeholder="FireVault/${storageKind0794==="photo"?"Photos":"Documents"}"></div><p>Remote providers remain queued until their OAuth or WebDAV connection is active. FireVault keeps the local record available.</p></div>
    ${docPhotoPreviewMarkup512(d)}
    <label>Photo / Document Notes</label><textarea id="docNotes" class="photoNotesField524" placeholder="Internal field notes: device address, circuit, problem found, parts needed...">${esc(d.notes||"")}</textarea>
    <label>Customer Photo Caption</label><textarea id="docCustomerCaption528" class="photoCaptionField528" placeholder="Short customer-facing caption for reports, for example: Battery dated 2019 and due for replacement.">${esc(d.customerCaption||"")}</textarea><p class="fieldNote">Customer captions appear in customer report photo lists. Internal notes stay available for technician detail.</p></div>
    <button class="primary" id="saveDocBtn">Save Document</button>${mode && !isNewPhoto523?`<button class="danger" id="deleteDocBtn">Delete Document</button>`:""}
  </div></div>`);
  document.getElementById("backBtn").onclick=()=>route("siteDocs");
  wireDocPhotoControls512(d||{});
  document.getElementById("saveDocBtn").onclick=async()=>{
    const imageData=docPhotoClearRequested512 ? "" : (docPhotoDraftDataUrl512 || d?.imageData || "");
    const storageKind0794=imageData?"photo":"document";
    const configuredTarget0794=fileStorageTarget0794(storageKind0794);
    const requestedProvider0794=val("docStorageProvider0794")||configuredTarget0794.provider||"local";
    const allowedProviders0794=new Set(storageRoleProviders(APP_PROFILE,storageKind0794).map(provider=>provider.id));
    const storageProvider0794=allowedProviders0794.has(requestedProvider0794)?requestedProvider0794:(configuredTarget0794.provider||"local");
    const storageFolder0794=val("docStorageFolder0794")||configuredTarget0794.folder||`FireVault/${storageKind0794==="photo"?"Photos":"Documents"}`;
    const obj={type:val("docType"),title:val("docTitle")||"Untitled Reference",ref:isDefPhoto525?"Deficiency":val("docRef"),url:val("docUrl"),date:val("docDate"),notes:raw("docNotes"),customerCaption:raw("docCustomerCaption528"),imageData,imageName:imageData?(docPhotoDraftName512||d?.imageName||"Site photo"):"",photoCategory:imageData?(isDefPhoto525?"Deficiency":selectedPhotoCategory524()):"",useOverlayOnSave:checked("docUseOverlay524"),imageUpdatedAt:imageData?new Date().toISOString():"",updatedAt:new Date().toISOString(),linkedDeficiencyId:isDefPhoto525?linkedDefId525:(d?.linkedDeficiencyId||""),linkedDeficiencyTitle:isDefPhoto525?(linkedDef525?.title||""):(d?.linkedDeficiencyTitle||""),includeInCustomerReport:imageData?checked("docIncludeReport526"):false,storageTargetId:`${storageProvider0794}:${storageKind0794}`,storageProvider:storageProvider0794,storageFolder:storageFolder0794,storageStatus:storageProvider0794==="local"?"local":"pending",remoteFileId:d?.remoteFileId||"",remoteRevision:d?.remoteRevision||"",remoteUrl:d?.remoteUrl||"",mediaRef:imageData?(d?.mediaRef||""):"",mediaStorage:imageData?(d?.mediaStorage||""):""};
    if(mode && !isNewPhoto523 && d){ Object.assign(d,obj); }
    else s.docs.unshift({...obj,id:uid(),createdAt:new Date().toISOString()});
    if(imageData){
      const button=document.getElementById("saveDocBtn");setButtonBusy0781(button,true,"Saving photo…");
      try{const result=await stageVaultMedia(data);if(result.failed)throw new Error("The photo could not be protected in device media storage.");}
      catch(err){setButtonBusy0781(button,false);toast(err?.message||"Photo storage failed. Try again.","error");return;}
    }
    save(); toast(isDefPhoto525?"Deficiency photo saved.":"Document saved."); if(isDefPhoto525){ mode=linkedDefId525; route("deficiencyForm"); } else route("siteDocs");
  };
  const del=document.getElementById("deleteDocBtn"); if(del) del.onclick=()=>{ if(confirm("Delete this document reference?")){ s.docs=s.docs.filter(x=>x.id!==mode); save(); toast("Document deleted."); route("siteDocs"); } };
}

/* Build 0.90.0 — retired scanner capture removed. Existing scans remain readable and exportable. */
function docIsScan0800(d={}){
  return d.isScannedDocument===true && Array.isArray(d.scanPages) && d.scanPages.length>0;
}
function scannerDataBytes0800(dataUrl){
  const base64=String(dataUrl||"").split(",")[1]||"";const binary=atob(base64),bytes=new Uint8Array(binary.length);for(let i=0;i<binary.length;i++)bytes[i]=binary.charCodeAt(i);return bytes;
}
function scannerConcatBytes0800(chunks){
  const length=chunks.reduce((sum,c)=>sum+c.length,0),out=new Uint8Array(length);let offset=0;chunks.forEach(c=>{out.set(c,offset);offset+=c.length;});return out;
}
async function scannerPdfBlob0800(d){
  const pages=(d.scanPages||[]).filter(p=>p.imageData);if(!pages.length)throw new Error("No scanned pages are available.");
  const enc=new TextEncoder(),chunks=[],offsets=[0];let length=0;
  const push=value=>{const bytes=typeof value==="string"?enc.encode(value):value;chunks.push(bytes);length+=bytes.length;};
  const objectCount=2+pages.length*3;
  push("%PDF-1.4\n% FireVault scanned document\n");
  const writeObject=(id,body)=>{offsets[id]=length;push(`${id} 0 obj\n`);if(Array.isArray(body))body.forEach(push);else push(body);push("\nendobj\n");};
  writeObject(1,"<< /Type /Catalog /Pages 2 0 R >>");
  const kids=pages.map((_,i)=>`${3+i*3} 0 R`).join(" ");writeObject(2,`<< /Type /Pages /Count ${pages.length} /Kids [ ${kids} ] >>`);
  pages.forEach((p,i)=>{
    const pageId=3+i*3,imageId=4+i*3,contentId=5+i*3,w=Number(p.width)||1200,h=Number(p.height)||1600,landscape=w>h*1.08,pageW=landscape?792:612,pageH=landscape?612:792,margin=18,scale=Math.min((pageW-margin*2)/w,(pageH-margin*2)/h),drawW=w*scale,drawH=h*scale,x=(pageW-drawW)/2,y=(pageH-drawH)/2;
    writeObject(pageId,`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageW} ${pageH}] /Resources << /XObject << /Im${i+1} ${imageId} 0 R >> >> /Contents ${contentId} 0 R >>`);
    const imageBytes=scannerDataBytes0800(p.imageData);writeObject(imageId,[enc.encode(`<< /Type /XObject /Subtype /Image /Width ${w} /Height ${h} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${imageBytes.length} >>\nstream\n`),imageBytes,enc.encode("\nendstream")]);
    const stream=`q\n${drawW.toFixed(3)} 0 0 ${drawH.toFixed(3)} ${x.toFixed(3)} ${y.toFixed(3)} cm\n/Im${i+1} Do\nQ\n`;const streamBytes=enc.encode(stream);writeObject(contentId,[enc.encode(`<< /Length ${streamBytes.length} >>\nstream\n`),streamBytes,enc.encode("endstream")]);
  });
  const xref=length;push(`xref\n0 ${objectCount+1}\n0000000000 65535 f \n`);for(let i=1;i<=objectCount;i++)push(`${String(offsets[i]||0).padStart(10,"0")} 00000 n \n`);push(`trailer\n<< /Size ${objectCount+1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`);
  return new Blob([scannerConcatBytes0800(chunks)],{type:"application/pdf"});
}
function scannerSafeName0800(d){return String(d.title||"scanned-document").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"").slice(0,70)||"scanned-document";}
async function scannerDownloadPdf0800(d){
  try{toast("Preparing PDF…");const blob=await scannerPdfBlob0800(d),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download=`${scannerSafeName0800(d)}.pdf`;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),2500);toast("PDF downloaded.");}catch(err){console.error(err);toast("PDF could not be created.");}
}
async function scannerSharePdf0800(d){
  try{const blob=await scannerPdfBlob0800(d),file=new File([blob],`${scannerSafeName0800(d)}.pdf`,{type:"application/pdf"});if(navigator.share&&(!navigator.canShare||navigator.canShare({files:[file]}))){await navigator.share({title:d.title||"Scanned Document",text:`${d.scanPageCount||d.scanPages?.length||0}-page document from FireVault`,files:[file]});return;}await scannerDownloadPdf0800(d);}catch(err){if(err?.name!=="AbortError"){console.error(err);toast("Sharing is unavailable. Use Download PDF instead.");}}
}
function scannerThumb0800(d){const first=d.scanPages?.[0];return first?.imageData?`<div class="docScanThumb0800"><img src="${esc(first.imageData)}" alt="First page of scanned document"><span>${d.scanPageCount||d.scanPages.length} pages</span></div>`:"";}
function scannedDocumentModal0800(d){
  if(!docIsScan0800(d)){toast("Scanned document not found.");return;}const overlay=document.createElement("div");overlay.className="scanModalOverlay0800";overlay.innerHTML=`<div class="scanModalSheet0800"><div class="scanModalHead0800"><div><span>SCANNED DOCUMENT</span><strong>${esc(d.title||"Scanned Document")}</strong><small>${d.scanPageCount||d.scanPages.length} pages • ${esc(d.date||new Date(d.scanCreatedAt||Date.now()).toLocaleDateString())}</small></div><button class="ghost" id="scanModalClose0800">Close</button></div>${d.notes?`<p class="scanModalNotes0800">${esc(d.notes)}</p>`:""}<div class="scanModalPages0800">${d.scanPages.map((p,i)=>`<article><span>Page ${i+1}</span><img src="${esc(p.imageData)}" alt="Scanned document page ${i+1}"></article>`).join("")}</div><div class="scanModalActions0800"><button class="primary" id="scanModalPdf0800">Download PDF</button><button class="primary" id="scanModalShare0800">Share PDF</button><button class="danger" id="scanModalDelete0800">Delete</button></div></div>`;document.body.appendChild(overlay);
  const close=()=>overlay.remove();overlay.onclick=e=>{if(e.target===overlay)close();};document.getElementById("scanModalClose0800").onclick=close;document.getElementById("scanModalPdf0800").onclick=()=>scannerDownloadPdf0800(d);document.getElementById("scanModalShare0800").onclick=()=>scannerSharePdf0800(d);document.getElementById("scanModalDelete0800").onclick=()=>{if(confirm(`Delete “${d.title||"this scanned document"}”?`)){const s=site();s.docs=s.docs.filter(x=>x.id!==d.id);save();close();toast("Scanned document deleted.");if(view==="siteDetail")render();else siteDocs();}};
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
    <div class="card contactsHero"><h2>Account Contacts</h2><p>Keep customer contacts, gate/lockbox notes, monitoring details, and after-hours access in one field-ready vault.</p><div class="contactStats"><span><strong>${counts.total}</strong>Total</span><span><strong>${counts.access}</strong>Access</span><span><strong>${counts.afterHours}</strong>After Hours</span></div></div>
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
    <div class="compactField"><div><label>Phone</label><input id="contactPhone" inputmode="tel" value="${esc(formatPhone0758(c.phone)||c.phone||"")}"></div><div><label>Email</label><input id="contactEmail" inputmode="email" value="${esc(c.email||"")}"></div></div>
    <label class="checkRow inlineCheck"><input type="checkbox" id="contactAfterHours" ${c.afterHours?"checked":""}> After-hours / emergency contact</label>
    <label>Access Notes</label><textarea id="contactAccess" placeholder="Gate code, key box, panel room access, alarm account, call-before-entry notes...">${esc(c.accessNotes||"")}</textarea>
    <label>General Notes</label><textarea id="contactNotes" placeholder="Preferences, instructions, who to notify, billing notes...">${esc(c.notes||"")}</textarea></div>
    <button class="primary" id="saveContactBtn">Save Contact</button>${mode?`<button class="danger" id="deleteContactBtn">Delete Contact</button>`:""}
  </div></div>`);
  document.getElementById("backBtn").onclick=()=>route("contactsList");
  document.getElementById("saveContactBtn").onclick=()=>{
    const obj={type:val("contactType"),role:val("contactRole"),name:val("contactName"),phone:normalizePhoneValue0758(val("contactPhone")),email:val("contactEmail"),afterHours:checked("contactAfterHours"),accessNotes:raw("contactAccess"),notes:raw("contactNotes")};
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
    <div class="card equipmentHero equipmentHero429"><h2>Account Equipment</h2><p>Quickly mark hardware checked, flag attention items, and create equipment follow-up tasks from the field.</p><div class="equipmentStats"><span><strong>${equipment.length}</strong>Total</span><span><strong>${counts.active}</strong>Active</span><span><strong>${counts.attention}</strong>Attention</span></div></div>
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
    <div class="card visitLogHero"><h2>${esc(s.name)}</h2><p>${siteVisits.length ? `${siteVisits.length} saved visit${siteVisits.length===1?"":"s"}` : "No completed visits yet."}</p></div>
    <div class="list grow">${siteVisits.length?siteVisits.map(v=>`<button class="card visitLogItem" data-visit="${esc(v.id)}"><div class="row"><div><h2>${esc(visitDateLabel(v))}</h2><p>${esc(visitTimeRange(v))} • ${esc(durationText(v.startedAt,v.endedAt))}</p></div><span class="pill">${esc(v.type||"Visit")}</span></div><p>${esc(visitNotesPreview(v,3))}</p></button>`).join(""):`<div class="empty">Use Add Note on the customer screen to create site notes for this account.</div>`}</div>
  </div>`);
  document.getElementById("backBtn").onclick=()=>route("siteDetail");
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

function duplicateAccountId0760(value,currentSiteId=""){
  const key=canonicalAccountId0731(value);
  if(!key) return null;
  return (data.sites||[]).find(candidate=>candidate.id!==currentSiteId && canonicalAccountId0731(accountId069(candidate))===key) || null;
}
function siteForm(){
  const recordSingular=recordTerm0954(),recordLower=recordTerm0954(1,true),recordIdLabel=recordIdLabel0954();
  const editing=mode==="edit";
  const s=editing ? site() : {};
  if(editing && !s){route("sites");return;}
  const fieldOn=recordFieldOn0956;
  const fieldRequired=id=>recordFieldRequired(APP_PROFILE,id);
  const requiredBadge=id=>fieldRequired(id)?" <b>Required</b>":"";
  const currentAccountId=accountId069(s);
  const identityPhone=fieldOn("sitePhone")?`<div><label>${esc(recordFieldById("sitePhone")?.label||"Site Phone")}${requiredBadge("sitePhone")}</label><input id="sitePhone0760" inputmode="tel" autocomplete="tel" value="${esc(formatPhone0758(s.sitePhone)||s.sitePhone||"")}" placeholder="(307)555-0123"></div>`:"";
  const identityId=fieldOn("externalAccountId")?`<div><label>${esc(recordIdLabel)}${requiredBadge("externalAccountId")}</label><input id="externalAccountId0760" value="${esc(currentAccountId)}" placeholder="Example: G7C1234-01" autocapitalize="characters" spellcheck="false"><small class="accountFieldHint0760" id="accountIdHint0760">Exact ${esc(recordIdLabel)}s must be unique. Same-address buildings are allowed.</small></div>`:"";
  const locationFields=["street","city","state","zip","gps"].filter(fieldOn);
  const systemFields=["panelManufacturer","panelModel","notes"].filter(fieldOn);
  const fireProfileVisible=fieldOn("panelManufacturer")||fieldOn("panelModel");
  const locationMarkup=locationFields.length?`<section class="card accountFormCard0760" data-record-group="location"><div class="accountFormSectionTitle0760"><span>2</span><div><strong>${esc(RECORD_SCHEMA.groups.find(group=>group.id==="location")?.label||"Location")}</strong><small>${recordTerm0954(2)} may share an address when they represent different buildings or record numbers.</small></div></div>
        ${fieldOn("street")?`<label>${esc(recordFieldById("street")?.label||"Street Address")}${requiredBadge("street")}</label><input id="street" value="${esc(s.street||"")}" autocomplete="street-address">`:""}
        ${(fieldOn("city")||fieldOn("state"))?`<div class="compactField">${fieldOn("city")?`<div><label>${esc(recordFieldById("city")?.label||"City")}${requiredBadge("city")}</label><input id="city" value="${esc(s.city||"")}" autocomplete="address-level2"></div>`:""}${fieldOn("state")?`<div><label>${esc(recordFieldById("state")?.label||"State")}${requiredBadge("state")}</label><input id="state" value="${esc(s.state||"")}" maxlength="2" autocapitalize="characters" autocomplete="address-level1"></div>`:""}</div>`:""}
        ${(fieldOn("zip")||fieldOn("gps"))?`<div class="compactField">${fieldOn("zip")?`<div><label>${esc(recordFieldById("zip")?.label||"ZIP")}${requiredBadge("zip")}</label><input id="zip" value="${esc(s.zip||"")}" inputmode="numeric" autocomplete="postal-code"></div>`:""}${fieldOn("gps")?`<div class="accountFormLocationAction0760"><label>${esc(recordFieldById("gps")?.label||"GPS")}${requiredBadge("gps")}</label><button type="button" class="ghost" id="formGpsBtn">Capture Current Location</button></div>`:""}</div>`:""}
        ${fieldOn("gps")?`<div class="accountGpsFields0760"><div><label>Latitude</label><input id="gpsLat" inputmode="decimal" value="${hasGps(s)?esc(s.gps.lat):""}"></div><div><label>Longitude</label><input id="gpsLng" inputmode="decimal" value="${hasGps(s)?esc(s.gps.lng):""}"></div><input id="gpsAccuracy" type="hidden" value="${hasGps(s)?esc(s.gps.accuracy||""):""}"><input id="gpsCapturedAt" type="hidden" value="${hasGps(s)?esc(s.gps.capturedAt||""):""}"></div><div class="accountPlusPreview0794" id="accountPlusPreview0794"></div>`:""}
      </section>`:"";
  const systemMarkup=systemFields.length?`<section class="card accountFormCard0760" data-record-group="fireSystem"><div class="accountFormSectionTitle0760"><span>${locationFields.length?3:2}</span><div><strong>${esc(fireProfileVisible?(RECORD_SCHEMA.groups.find(group=>group.id==="fireSystem")?.label||"Fire Alarm System"):"Record Notes")}</strong><small>${fireProfileVisible?`Optional panel information helps technicians identify the ${recordLower} quickly.`:`Keep reusable notes connected to this ${recordLower}.`}</small></div></div>
        ${(fieldOn("panelManufacturer")||fieldOn("panelModel"))?`<div class="compactField">${fieldOn("panelManufacturer")?`<div><label>${esc(recordFieldById("panelManufacturer")?.label||"Panel Make")}${requiredBadge("panelManufacturer")}</label><input id="pm" value="${esc(s.panelManufacturer||"")}" placeholder="Notifier, EST, Siemens…"></div>`:""}${fieldOn("panelModel")?`<div><label>${esc(recordFieldById("panelModel")?.label||"Panel Model")}${requiredBadge("panelModel")}</label><input id="model" value="${esc(s.panelModel||"")}"></div>`:""}</div>`:""}
        ${fieldOn("notes")?`<label>${esc(recordFieldById("notes")?.label||"Site Notes")}${requiredBadge("notes")}</label><textarea id="notes" placeholder="Access details, panel location, recurring issues…">${esc(s.notes||"")}</textarea>`:""}
      </section>`:"";
  html(`<div class="screen accountFormScreen0760">
    <section class="accountFormHeader0760"><button class="back ghost" id="backBtn" aria-label="Cancel and go back">←</button><div><span>${editing?`${esc(recordSingular.toUpperCase())} MAINTENANCE`:`NEW ${esc(recordSingular.toUpperCase())}`}</span><h1>${esc(editing?appLabel("editRecord"):appLabel("addRecord"))}</h1><p>${editing?`Update this ${esc(recordLower)} without changing its history.`:`Create the core ${esc(recordLower)} now. Details can be added after saving.`}</p></div></section>
    <div class="form grow accountForm0760">
      <div class="accountFormError0760" id="accountFormError0760" hidden></div>
      <section class="card accountFormCard0760" data-record-group="identity"><div class="accountFormSectionTitle0760"><span>1</span><div><strong>${esc(RECORD_SCHEMA.groups.find(group=>group.id==="identity")?.label||`${recordSingular} Identity`)}</strong><small>Name${fieldOn("externalAccountId")?` and ${esc(recordIdLabel)}`:""} are used throughout ${esc(APP_PROFILE.name)}.</small></div></div>
        <label>${esc(recordFieldById("name")?.label||`${recordSingular} Name`)}${requiredBadge("name")}</label><input id="name" value="${esc(s.name||"")}" placeholder="Customer or building name" autocomplete="organization">
        ${(identityId||identityPhone)?`<div class="compactField">${identityId}${identityPhone}</div>`:""}
      </section>
      ${locationMarkup}
      ${systemMarkup}
      <div class="accountFormActions0760"><button class="ghost" id="cancelAccount0760">Cancel</button><button class="primary" id="saveBtn">${editing?"Save Changes":`Create ${esc(recordSingular)}`}</button></div>
      ${editing?`<button class="danger accountDelete0760" id="delBtn">Delete ${esc(recordSingular)}</button>`:""}
    </div>
  </div>`);
  const goBack=()=>route(editing?"siteDetail":"sites");
  document.getElementById("backBtn")?.addEventListener("click",goBack);
  document.getElementById("cancelAccount0760")?.addEventListener("click",goBack);
  document.getElementById("formGpsBtn")?.addEventListener("click",captureGpsIntoForm);
  ["gpsLat","gpsLng"].forEach(id=>document.getElementById(id)?.addEventListener("input",updateAccountPlusPreview0794));
  if(fieldOn("gps"))updateAccountPlusPreview0794();
  const nameInput=document.getElementById("name");
  const idInput=document.getElementById("externalAccountId0760");
  const errorBox=document.getElementById("accountFormError0760");
  const idHint=document.getElementById("accountIdHint0760");
  const showFormError=message=>{if(errorBox){errorBox.textContent=message;errorBox.hidden=!message;}if(message)errorBox?.scrollIntoView({behavior:"smooth",block:"nearest"});};
  const checkId=()=>{
    if(!fieldOn("externalAccountId")||!idInput)return null;
    const canonical=canonicalAccountId0731(idInput.value||"");
    if(idInput.value!==canonical)idInput.value=canonical;
    const duplicate=duplicateAccountId0760(canonical,s.id||"");
    idInput.classList.toggle("fieldError0760",!!duplicate);
    if(idHint){idHint.textContent=duplicate?`Already assigned to ${duplicate.name||`another ${recordLower}`}.`:`Exact ${recordIdLabel}s must be unique. Same-address buildings are allowed.`;idHint.classList.toggle("error",!!duplicate);}
    return duplicate;
  };
  idInput?.addEventListener("blur",checkId);
  idInput?.addEventListener("input",()=>{idInput.value=idInput.value.toUpperCase();if(idHint?.classList.contains("error"))checkId();});
  document.getElementById("saveBtn")?.addEventListener("click",()=>{
    showFormError("");
    const accountName=val("name");
    const requiredInputIds={name:"name",externalAccountId:"externalAccountId0760",sitePhone:"sitePhone0760",street:"street",city:"city",state:"state",zip:"zip",panelManufacturer:"pm",panelModel:"model",notes:"notes"};
    for(const field of activeRecordFields(APP_PROFILE).filter(item=>item.required)){
      const present=field.id==="gps"?(Number.isFinite(Number(val("gpsLat")))&&Number.isFinite(Number(val("gpsLng")))):Boolean(val(requiredInputIds[field.id]||field.id));
      if(!present){showFormError(`Enter ${field.label.toLowerCase()} before saving.`);document.getElementById(requiredInputIds[field.id]||field.id)?.focus();return;}
    }
    const duplicate=checkId();
    if(duplicate){showFormError(`${recordIdLabel} ${canonicalAccountId0731(idInput?.value||"")} already belongs to ${duplicate.name||`another ${recordLower}`}. Use a different ${recordIdLabel}.`);idInput?.focus();return;}
    const obj={name:accountName};
    if(fieldOn("externalAccountId")){obj.externalAccountId=canonicalAccountId0731(val("externalAccountId0760"));obj.accountId="";}
    if(fieldOn("sitePhone"))obj.sitePhone=normalizePhoneValue0758(val("sitePhone0760"));
    if(fieldOn("street"))obj.street=val("street");
    if(fieldOn("city"))obj.city=val("city");
    if(fieldOn("state"))obj.state=val("state").toUpperCase();
    if(fieldOn("zip"))obj.zip=val("zip");
    if(fieldOn("panelManufacturer"))obj.panelManufacturer=val("pm");
    if(fieldOn("panelModel"))obj.panelModel=val("model");
    if(fieldOn("notes"))obj.notes=raw("notes");
    if(fieldOn("gps")){
      const gpsLat=Number(val("gpsLat")),gpsLng=Number(val("gpsLng"));
      if(Number.isFinite(gpsLat)&&Number.isFinite(gpsLng)){
        obj.gps={lat:gpsLat,lng:gpsLng,accuracy:Number(val("gpsAccuracy"))||0,capturedAt:val("gpsCapturedAt")||new Date().toISOString()};
        obj.plusCode=encodePlusCode071(gpsLat,gpsLng,plusCodeSettings0794().accountLength);
      }else{obj.gps=null;obj.plusCode="";}
    }
    if(editing){Object.assign(s,obj);selectedSiteId=s.id;}
    else{const n=ensureSite({...obj,id:uid(),createdAt:new Date().toISOString()});data.sites.unshift(n);selectedSiteId=n.id;}
    save();toast(editing?`${recordSingular} updated.`:`${recordSingular} created.`);route("siteDetail");
  });
  const del=document.getElementById("delBtn");
  if(del)del.onclick=()=>{if(!data.settings.app.confirmDeletes||confirm(`Delete ${s.name||`this ${recordLower}`}? This removes its locally stored notes, visits, and files.`)){data.sites=data.sites.filter(x=>x.id!==s.id);save();selectedSiteId=null;toast(`${recordSingular} deleted.`);route("sites");}};
  if(!editing)requestAnimationFrame(()=>nameInput?.focus());
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
  if(opts.site) sections.push(["SITE", `${s.name||"Unnamed Site"}\n${fullAddress(s)}\nPanel: ${[s.panelManufacturer,s.panelModel].filter(Boolean).join(" ")||"Not entered"}\nGPS: ${data.settings.gps?.includeInReports===false?"Hidden in Settings":gpsLine(s)}${reportPlusCodeLine0794(s)?`\n${reportPlusCodeLine0794(s)}`:""}\nMap: ${mapUrl(s,(set.gps&&set.gps.mapProvider)||"apple")}\nHealth: ${siteHealthLine(s)}`]);
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
    "{account_id}":accountId069(s)||"",
    "{category}":accountCategoryLabel0735(s)||"",
    "{panel}":[s.panelManufacturer,s.panelModel].filter(Boolean).join(" ")||"No panel saved",
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
    "{tech_info}":technicianOverlayLines0946(technicianOverlayNormalize0946(data.settings?.technicianOverlay?.fields)).join("\n"),
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
  const defaults=contentPackLibraryFolders(APP_PROFILE);
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
      <div><h1>Library</h1><p>Manuals, links, drawings, forms, and field references.</p><span class="libraryPackStatus0959">${activeContentPacks(APP_PROFILE).length} active content packs · ${activeContentSources(APP_PROFILE).length} sources</span></div>
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
    <div class="card jobHero490 idle siteNotesHero491 siteNotesHero494 siteNotesHero506"><div class="jobHeroHead490"><div><strong>Site Notes Only</strong><span>${noteEntries.length} note${noteEntries.length===1?"":"s"} • Last: ${esc(lastNote)}</span></div><div class="siteNotesHeroActions0801"><button class="ghost smallBtn" id="openDailyReport506">Daily Report</button></div></div><p>${esc(fullAddress(s)||"No address entered.")}</p></div>
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
  {key:"profile",icon:"👤",title:"Profile",tabs:["tech","overlay"]},
  {key:"maps",icon:"⌖",title:"Maps & GPS",tabs:["gps","plusCodes"]},
  {key:"reports",icon:"▤",title:"Reports",tabs:["reports","email"]},
  {key:"data",icon:"⇅",title:"Data & Backup",tabs:["cloudFiles","microsoftStorage","sync","customerImport","categories","backup","webdav","updates"]},
  {key:"privacy",icon:"▣",title:"Privacy & Security",tabs:["privacy","security"]},
  {key:"about",icon:"ⓘ",title:"About",tabs:["demo","about"]}
];
function settingsGroupForTab067(tab){ return SETTINGS_GROUPS_067.find(g=>g.tabs.includes(tab))?.key || "data"; }
function settingsGroup067ByKey(key){ return SETTINGS_GROUPS_067.find(g=>g.key===key) || SETTINGS_GROUPS_067[0]; }
function openSettingsGroup067(key){ settingsGroup067=key||"profile"; mode=null; view="settings"; render(); }
const APP_FORGE_TOOL_MODE_1010=(()=>{try{return new URLSearchParams(location.search).get("appforge")==="1";}catch{return false;}})();
function settingsTabs(){
  return [
    ["tech",appTerm("technician",1),"Identity and overlay template"],
    ["gps","GPS & Maps","Location and navigation"],
    ["plusCodes","Google Plus Codes","Offline location codes"],
    ["overlay","Photo Overlay","Photo labels"],
    ["reports","Reports","Report defaults"],
    ["email","Email","Recipients and signature"],
    ["privacy","Privacy Lock","PIN protection"],
    ["security","Security","Vault protection"],
    ["cloudFiles","File Storage",`${appTerm("file",2)} and photos`],
    ["microsoftStorage","Microsoft Storage","OneDrive and SharePoint"],
    ["sync","Team Sync","Shared-vault status"],
    ["customerImport",`Import ${recordTerm0954(2)}`,"CSV import"],
    ["categories","Categories",`Automatic ${recordTerm0954(1,true)} tags`],
    ["backup","Backup & Restore","Protect your data"],
    ["webdav","WebDAV Backup","Remote server upload and restore"],
    ["updates","App Updates","Refresh application files"],
    ["demo","Demo Mode",`Fictional ${recordTerm0954(2,true)} for presentations and testing`],
    ["about",`About ${APP_PROFILE.name}`,"Version and information"],
    ...(APP_FORGE_TOOL_MODE_1010?[["architecture","AppForge Factory","Blueprints, recipes, and PWA generation"]]:[])
  ].filter(([id])=>settingsTabEnabled0955(id));
}
function settingsIcon550(tab){
  return ({tech:"👤",gps:"⌖",plusCodes:"＋",reports:"▤",email:"✉",overlay:"▧",privacy:"▣",security:"⌾",cloudFiles:"☁",microsoftStorage:"M",sync:"↔",customerImport:"⇩",categories:"◇",backup:"⇅",webdav:"W",updates:"↻",demo:"D",about:"ⓘ",architecture:"⌘"})[tab]||"•";
}
function restoreAppChrome572(){
  document.body.classList.remove("homeFullscreen480","homeLayoutFixed570");
  const header=document.getElementById("appHeader"),nav=document.getElementById("appNav");
  if(header){header.style.display="flex";header.style.visibility="visible";header.style.opacity="1";header.style.pointerEvents="auto";}
  if(nav){nav.style.display="grid";nav.style.visibility="visible";nav.style.opacity="1";nav.style.pointerEvents="auto";}
  document.body.classList.toggle("settingsChrome572", view === "settings");
  showGlobalChrome537();
}
function openSettingsHome572(){
  if(formDirty0930 && !confirmDiscard0930()) return;
  clearDirty0930();
  captureSettingsScroll576();
  settingsGroup067="";
  settingsTab="tech";
  mode=null;
  view="settings";
  restoreAppChrome572();
  render();
}
function leaveSettingsHome572(){settingsGroup067="";mode=null;settingsTab="tech";route("home");}
const SETTINGS_DASHBOARD_0860 = [
  {key:"profile",title:"Profile & Photos",icon:"user",tabs:["tech","overlay"]},
  {key:"reports",title:"Reports",icon:"document",tabs:["reports","email"]},
  {key:"data",title:"Data & Backup",icon:"database",tabs:["cloudFiles","microsoftStorage","sync","customerImport","categories","backup","webdav","updates"]},
  {key:"maps",title:"Maps & GPS",icon:"pin",tabs:["gps","plusCodes"]},
  {key:"privacy",title:"Privacy & Security",icon:"shield",tabs:["privacy","security"]},
  {key:"about",title:`About ${APP_PROFILE.name}`,icon:"info",tabs:["demo","about",...(APP_FORGE_TOOL_MODE_1010?["architecture"]:[])]}
];
const SETTINGS_GROUPED_LIST_0873 = [
  {label:"Profile",items:[
    {key:"profile",subtitle:"Technician identity and photo overlay"}
  ]},
  {label:"Maps & Location",items:[
    {key:"maps",subtitle:"Navigation, GPS accuracy, and Plus Codes"}
  ]},
  {label:"Reports & Communication",items:[
    {key:"reports",subtitle:"Report templates and email defaults"}
  ]},
  {label:"Data & Backup",items:[
    {key:"data",subtitle:"Storage, WebDAV, imports, and recovery"}
  ]},
  {label:"Privacy & Security",items:[
    {key:"privacy",subtitle:"Privacy lock and local vault protection"}
  ]},
  {label:"About",items:[
    {key:"about",subtitle:"Version information and Demo Mode"}
  ]}
];

function settingsDashboardItems0955(){
  const tabs=new Set(settingsTabs().map(row=>row[0]));
  return SETTINGS_DASHBOARD_0860.map(item=>({...item,tabs:item.tabs.filter(id=>tabs.has(id))})).filter(item=>item.tabs.length);
}
function settingsGroupedItems0955(){
  const dashboard=new Set(settingsDashboardItems0955().map(item=>item.key));
  return SETTINGS_GROUPED_LIST_0873.map(group=>({...group,items:group.items.filter(item=>dashboard.has(item.key))})).filter(group=>group.items.length);
}
function normalizeSettingsTab0955(){
  const tabs=settingsTabs();
  if(!tabs.some(row=>row[0]===settingsTab))settingsTab=tabs.find(row=>row[0]==="about")?.[0]||tabs[0]?.[0]||"about";
  const dashboards=settingsDashboardItems0955();
  if(!dashboards.some(item=>item.key===settingsGroup067))settingsGroup067=dashboards[0]?.key||"about";
}
function settingsListIcon0873(name){
  return settingsSvg0860(name).replace('settingsTileIcon0860','settingsListIcon0873');
}
function settingsShortDate0880(value){
  if(!value)return "";
  const d=new Date(value);
  if(Number.isNaN(d.getTime()))return String(value);
  const today=new Date();
  if(d.toDateString()===today.toDateString())return `Today ${d.toLocaleTimeString([], {hour:"numeric",minute:"2-digit"})}`;
  return d.toLocaleDateString([], {month:"short",day:"numeric"});
}
function settingsTabStatus0880(id){
  const s=data.settings||{}, tech=s.technician||{}, gps=s.gps||{}, reports=s.reports||{}, email=s.email||{}, overlay=s.overlay||{}, plus=s.plusCodes||{}, webdav=s.webdav||{};
  if(id==="tech") {const complete=["photo","identity","contact","template"].filter(technicianSectionComplete0947).length;return complete===4?[tech.name||"Profile ready",tech.company||"Technician profile complete"]:[`${complete}/4 complete`,tech.name||"Finish technician profile"];}
  if(id==="gps") return gps.enabled===false ? ["Off","Location tools disabled"] : [gps.mapProvider==="google"?"Google Maps":"Apple Maps",gps.highAccuracy===false?"Standard accuracy":"High accuracy"];
  if(id==="plusCodes") return plus.enabled===false ? ["Off","Plus Codes disabled"] : [plus.autoGenerate===false?"Manual":"Automatic",`${Number(plus.accountLength)||10}-digit account codes`];
  if(id==="reports") return [String(reports.format||"detailed").replace(/^./,c=>c.toUpperCase()),reports.title||"Service Report"];
  if(id==="email") return email.defaultTo||email.cc||email.signature ? ["Configured",email.defaultTo||email.cc||"Signature saved"] : ["Not configured","Add defaults when needed"];
  if(id==="overlay") return overlay.template ? ["Ready",overlay.showLogo===false?"Text overlay":"Logo and text overlay"] : ["Default","Standard field overlay"];
  if(id==="privacy") return privacyConfig0791()?.enabled ? ["PIN enabled","Local lock is active"] : ["PIN off","Optional local protection"];
  if(id==="security") return ["Protected","Audit and recycle bin ready"];
  if(id==="cloudFiles") return ["IndexedDB","Photos and documents stored outside the main vault"];
  if(id==="microsoftStorage") return ["Connections","OneDrive and SharePoint setup"];
  if(id==="sync") {const sum=syncSummary(data);return [sum.pending?`${sum.pending} pending`:"Up to date",sum.conflicts?`${sum.conflicts} conflicts`:"Local package mode"];}
  if(id==="customerImport") return [`${(data.sites||[]).length} accounts`,"CSV import available"];
  if(id==="categories") return ["Automatic","Account ID category rules"];
  if(id==="backup") {const info=autoBackupInfo();return [info.count?`${info.count} snapshots`:"No snapshots",info.last?.createdAt?`Latest ${settingsShortDate0880(info.last.createdAt)}`:"Create a backup"];}
  if(id==="webdav") return webdav.enabled ? [webdav.lastUpload?"Uploaded":"Enabled",webdav.lastUpload?settingsShortDate0880(webdav.lastUpload):"Connection ready to test"] : ["Off","Optional remote backup"];
  if(id==="updates") return [`Build ${BUILD}`,"Application files current"];
  if(id==="demo") return isDemoMode() ? ["Active","Fictional Boise accounts"] : ["Off","Real vault is active"];
  if(id==="about") return [`Version ${BUILD}`,"FireVault application information"];
  if(id==="architecture") {const summary=moduleRegistrySummary(APP_PROFILE.enabledModules);return [`${summary.total} modules`,`${summary.core} core · ${summary.optional} reusable · ${summary.firevault} FireVault`];}
  return ["",""];
}
function settingsGroupStatus0880(key){
  const webdav=data.settings?.webdav||{};
  if(key==="profile")return settingsTabStatus0880("tech")[0];
  if(key==="maps")return data.settings?.gps?.enabled===false?"Location off":settingsTabStatus0880("gps")[0];
  if(key==="reports")return `${settingsTabStatus0880("reports")[0]} reports`;
  if(key==="photos")return settingsTabStatus0880("overlay")[0];
  if(key==="data"){const info=autoBackupInfo();return webdav.enabled?"WebDAV enabled":info.count?`${info.count} snapshots`:"Local storage";}
  if(key==="privacy")return privacyConfig0791()?.enabled?"PIN enabled":"PIN off";
  if(key==="demo")return isDemoMode()?"Active":"Off";
  if(key==="about")return `v${BUILD}`;
  return "";
}
function settingsTone0880(key){return ({profile:"blue",maps:"green",reports:"violet",photos:"cyan",data:"amber",privacy:"red",demo:"gold",about:"slate"})[key]||"slate";}
function settingsGroupedRow0873(item){
  const dashboardItem=SETTINGS_DASHBOARD_0860.find(x=>x.key===item.key);
  if(!dashboardItem) return "";
  const subtitle=item.key==="demo" && isDemoMode()?"Fictional Boise accounts are active":(item.subtitle||"");
  const status=settingsGroupStatus0880(item.key);
  return `<button class="settingsListRow0873 tone-${settingsTone0880(item.key)} ${item.key==="demo"&&isDemoMode()?"isActiveDemo0875":""}" data-settings-group0873="${esc(item.key)}">${settingsListIcon0873(dashboardItem.icon)}<span class="settingsListCopy0880"><strong>${esc(dashboardItem.title)}</strong><small>${esc(subtitle)}</small></span><span class="settingsRowTail0880"><em>${esc(status)}</em><b>›</b></span></button>`;
}
function settingsSvg0860(name){
  const icons={
    user:'<circle cx="12" cy="8" r="4"/><path d="M4.5 21c.7-4.2 3.2-6.3 7.5-6.3s6.8 2.1 7.5 6.3"/>',
    briefcase:'<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5.5A2.5 2.5 0 0 1 10.5 3h3A2.5 2.5 0 0 1 16 5.5V7M3 12h18M10 12v2h4v-2"/>',
    document:'<path d="M6 2h8l4 4v16H6z"/><path d="M14 2v5h5M9 12h6M9 16h6"/>',
    database:'<ellipse cx="12" cy="5" rx="7" ry="3"/><path d="M5 5v6c0 1.7 3.1 3 7 3s7-1.3 7-3V5M5 11v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6"/>',
    pin:'<path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0z"/><circle cx="12" cy="10" r="2.5"/>',
    camera:'<path d="M4 7h4l1.5-2h5L16 7h4v13H4z"/><circle cx="12" cy="13" r="4"/>',
    shield:'<path d="M12 2l8 3v6c0 5.2-3.3 9-8 11-4.7-2-8-5.8-8-11V5z"/><path d="M8.5 12l2.2 2.2 4.8-5"/>',
    demo:'<rect x="3" y="4" width="18" height="14" rx="2"/><path d="M8 22h8M12 18v4"/><path d="M10 8.5l5 2.5-5 2.5z"/>',
    info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7h.01"/>'
  };
  return `<svg class="settingsTileIcon0860" viewBox="0 0 24 24" aria-hidden="true">${icons[name]||icons.info}</svg>`;
}
function settingsDashboardTile0860(item){
  return `<button class="settingsTile0860" data-settings-group0860="${item.key}">${settingsSvg0860(item.icon)}<span>${esc(item.title)}</span></button>`;
}
function openSettingsDashboardGroup0860(key){
  settingsGroup067=key; mode="settingsGroup0860"; render();
}
function settingsSearchRows0874(query=""){
  const q=String(query||"").trim().toLowerCase();
  if(!q) return [];
  const aliases={
    tech:"profile technician company identity phone email license overlay template technician info",
    gps:"maps location navigation nearby radius accuracy apple google",
    plusCodes:"plus codes google offline location code coordinates",
    overlay:"photo overlay watermark label stamp",
    reports:"report template document default service",
    email:"email recipient cc signature subject communication",
    privacy:"privacy pin lock passcode timeout background",
    security:"security audit recycle integrity device session",
    cloudFiles:"files documents photos local storage",
    microsoftStorage:"microsoft onedrive sharepoint cloud storage",
    sync:"team sync shared vault package conflict pending",
    customerImport:"import csv customer account spreadsheet",
    categories:"category tags alarmnet clss ipdact basic",
    backup:"backup restore export snapshot recovery",
    webdav:"webdav dav remote server upload restore backup",
    updates:"update refresh cache application build",
    demo:"demo testing fictional boise presentation",
    about:"about version release revision support information",
    architecture:"architecture modules matrix core reusable appforge terminology profile future apps"
  };
  const tokens=q.split(/\s+/).filter(Boolean);
  const tabs=settingsTabs();
  return tabs.map(tab=>{
    const group=settingsDashboardItems0955().find(item=>item.tabs.includes(tab[0]));
    const status=settingsTabStatus0880(tab[0]);
    const hay=[tab[0],tab[1],tab[2],group?.title||"",aliases[tab[0]]||"",...status].join(" ").toLowerCase();
    return tokens.every(token=>hay.includes(token))?{tab,group}:null;
  }).filter(Boolean);
}
function settingsSearchResultRow0874(result){
  const [id,title,note]=result.tab;
  const status=settingsTabStatus0880(id);
  return `<button class="settingsSearchResult0874 tone-${settingsTone0880(result.group?.key||"data")}" data-settings-search-tab0874="${esc(id)}" data-settings-search-group0874="${esc(result.group?.key||"data")}"><span class="settingsGroupIcon0860">${settingsIcon550(id)}</span><span class="settingsListCopy0880"><strong>${esc(title)}</strong><small>${esc(result.group?.title||"")} · ${esc(note)}</small></span><span class="settingsRowTail0880"><em>${esc(status[0])}</em><b>›</b></span></button>`;
}
function settings(){
  if(["themes","advanced","homeLayout","visibility","backend","manual","diagnostics"].includes(settingsTab)) settingsTab="about";
  normalizeSettingsTab0955();
  captureSettingsScroll576(); restoreAppChrome572();
  const tabs=settingsTabs();
  const dashboards=settingsDashboardItems0955();
  const groupedSettings=settingsGroupedItems0955();
  const active=tabs.find(t=>t[0]===settingsTab)||tabs[0];
  const dashboardItem=dashboards.find(x=>x.key===settingsGroup067)||dashboards[0];
  if(mode!=="settingsDetail" && mode!=="settingsGroup0860"){
    const searchResults=settingsSearchRows0874(settingsSearch0874);
    const searchActive=Boolean(String(settingsSearch0874||"").trim());
    html(`<div class="screen settingsConcept10873 settingsStable573 settingsPolish0880">
      <div class="settingsConcept1Body0873">
        <div class="settingsStickyHead0880">
          <div class="settingsTitleRow0880"><h1>Settings</h1><span>${dashboards.length} areas</span></div>
          <label class="settingsSearch0874" aria-label="Search settings">
            ${fvIcon073("search","settingsSearchIcon0874")}
            <input id="settingsSearchInput0874" type="search" value="${esc(settingsSearch0874)}" placeholder="Search settings" autocomplete="off" autocapitalize="none" spellcheck="false">
            <button type="button" id="settingsSearchClear0874" aria-label="Clear settings search" ${searchActive?"":"hidden"}>×</button>
          </label>
        </div>
        <div id="settingsHomeContent0874" class="settingsGroupsGrid0880">
          ${searchActive?`<section class="settingsListGroup0873 settingsSearchGroup0874 tone-red"><div class="settingsSectionHeading0940"><span aria-hidden="true"></span><h2>Search Results</h2></div><div class="settingsSearchResults0874">${searchResults.length?searchResults.map(settingsSearchResultRow0874).join(""):`<div class="settingsSearchEmpty0874"><strong>No settings found</strong><span>Try GPS, Plus Codes, WebDAV, backup, reports, or privacy.</span></div>`}</div></section>`:groupedSettings.map(group=>{const tone=settingsTone0880(group.items?.[0]?.key||"data");return `<section class="settingsListGroup0873 tone-${tone}"><div class="settingsSectionHeading0940"><span aria-hidden="true"></span><h2>${esc(group.label)}</h2></div><div class="settingsListCard0873">${group.items.map(settingsGroupedRow0873).join("")}</div></section>`;}).join("")}
        </div>
      </div>
    </div>`);
    const searchInput=document.getElementById("settingsSearchInput0874");
    const refreshSearch=()=>{settingsSearch0874=String(searchInput?.value||"");settings();requestAnimationFrame(()=>{const next=document.getElementById("settingsSearchInput0874");if(next){next.focus();next.setSelectionRange(next.value.length,next.value.length);}});};
    searchInput?.addEventListener("input",debounce0830(refreshSearch,90));
    searchInput?.addEventListener("search",refreshSearch);
    document.getElementById("settingsSearchClear0874")?.addEventListener("click",()=>{settingsSearch0874="";settings();requestAnimationFrame(()=>document.getElementById("settingsSearchInput0874")?.focus());});
    document.querySelectorAll("[data-settings-group0873]").forEach(b=>b.onclick=()=>{
      const item=dashboards.find(x=>x.key===b.dataset.settingsGroup0873);
      if(!item) return;
      settingsGroup067=item.key;
      if(item.tabs.length===1){settingsTab=item.tabs[0];mode="settingsDetail";render();}
      else openSettingsDashboardGroup0860(item.key);
    });
    document.querySelectorAll("[data-settings-search-tab0874]").forEach(b=>b.onclick=()=>{
      settingsGroup067=b.dataset.settingsSearchGroup0874||"data";
      settingsTab=b.dataset.settingsSearchTab0874;
      mode="settingsDetail";
      render();
    });
    restoreSettingsScroll576(false); return;
  }
  if(mode==="settingsGroup0860"){
    const rows=dashboardItem.tabs.map(id=>tabs.find(t=>t[0]===id)).filter(Boolean);
    html(`<div class="screen settingsGroupScreen0860 settingsStable573 settingsPolish0880 tone-${settingsTone0880(dashboardItem.key)}">
      <header class="settingsGroupHeader0860 settingsGroupHeader0880"><button class="ghost" id="settingsGroupBack0860" aria-label="Back to Settings">←</button><div class="settingsGroupTitle0880"><h1>${esc(dashboardItem.title)}</h1><small>${rows.length} option${rows.length===1?"":"s"} · ${esc(settingsGroupStatus0880(dashboardItem.key))}</small></div><span></span></header>
      <div class="settingsGroupBody0860"><div class="settingsGroupList0860">${rows.map(t=>{const status=settingsTabStatus0880(t[0]);return `<button class="settingsGroupRow0860" data-tab="${t[0]}"><span class="settingsGroupIcon0860">${settingsIcon550(t[0])}</span><span class="settingsListCopy0880"><strong>${esc(t[1])}</strong><small>${esc(t[2])}</small></span><span class="settingsRowTail0880"><em>${esc(status[0])}</em><b>›</b></span></button>`;}).join("")}</div></div>
    </div>`);
    document.getElementById("settingsGroupBack0860")?.addEventListener("click",()=>settingsNavigate0930(()=>{mode=null;render();}));
    document.querySelectorAll(".settingsGroupRow0860[data-tab]").forEach(b=>b.onclick=()=>{settingsTab=b.dataset.tab;mode="settingsDetail";render();});
    restoreSettingsScroll576(false); return;
  }
  const saveable=!['privacy','cloudFiles','microsoftStorage','customerImport','categories','backup','webdav','updates','demo','about','architecture'].includes(settingsTab);
  const detailStatus=settingsTabStatus0880(settingsTab);
  const compactOverlayDetail=settingsTab==="overlay";
  html(`<div class="screen settingsSimpleDetail0850 settingsDetail0860 settingsStable573 settingsPolish0880 settingsTab-${settingsTab} tone-${settingsTone0880(dashboardItem.key)} ${compactOverlayDetail?"settingsOverlayDetail0943 settingsOverlayDetail1012":""}" data-settings-tab="${settingsTab}">
    ${compactOverlayDetail?"":`<header class="settingsSimpleDetailHeader0850 settingsDetailHeader0880"><button class="ghost" id="settingsBackBtn" aria-label="Back">←</button><div class="settingsDetailTitle0880"><h1>${esc(active[1])}</h1><small>${esc(active[2])}</small></div><span class="settingsDetailStatus0880">${esc(detailStatus[0])}</span>${saveable?`<button class="primary" id="saveSettingsTop">Save</button>`:`<button class="ghost" id="settingsDoneBtn">Done</button>`}</header>`}
    <div class="settingsSimpleDetailBody0850 settingsDetailBody488 settingsContent448">${settingsPanel()}</div>
  </div>`);
  document.getElementById("settingsBackBtn")?.addEventListener("click",()=>settingsNavigate0930(()=>{mode=dashboardItem.tabs?.length>1?"settingsGroup0860":null;render();}));
  document.getElementById("settingsDoneBtn")?.addEventListener("click",()=>settingsNavigate0930(()=>{mode=dashboardItem.tabs?.length>1?"settingsGroup0860":null;render();}));
  document.getElementById("saveSettingsTop")?.addEventListener("click",e=>{setButtonBusy0781(e.currentTarget,true,"Saving…");requestAnimationFrame(()=>saveSettings());});
  wireSettingsPanel(); restoreSettingsScroll576(true);
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
function overlayDefaultTemplate510(){ return "{site_name} • {date} • {time}\n{tech_info}"; }
function overlaySampleSite510(){
  return {
    name:"West Ridge Medical Plaza",
    externalAccountId:"G7C0241",
    panelManufacturer:"Notifier",
    panelModel:"NFS2-3030",
    street:"1550 E 2nd St",
    city:"Casper",
    state:"WY",
    zip:"82601",
    gps:{lat:42.8501,lng:-106.3252,accuracy:12,capturedAt:new Date().toISOString()}
  };
}
function overlayCleanSetting510(o={}){
  const hasTemplate=Object.prototype.hasOwnProperty.call(o,"template");
  return {
    template:hasTemplate ? String(o.template ?? "") : overlayDefaultTemplate510(),
    alignment:o.alignment || "bottom",
    fontSize:o.fontSize || "medium",
    accentColor:o.accentColor || "#ef4444",
    textColor:o.textColor || "#ffffff",
    backgroundStyle:o.backgroundStyle || "bar",
    opacity:String(o.opacity || "85"),
    showLogo:o.showLogo !== false,
    showTagline:o.showTagline !== false,
    logoMode:o.logoMode || "firevault",
    customLogoData:o.customLogoData || "",
    fieldLayout:overlayNormalizeFieldLayout0945(o.fieldLayout, hasTemplate ? String(o.template ?? "") : overlayDefaultTemplate510())
  };
}
let overlayFieldState0944=[];
let overlayAutoSaveTimer0944=0;
let overlayDragIndex0944=-1;
const TECHNICIAN_OVERLAY_TAGS_0946=["{technician}","{company}","{phone}","{email}","{license}"];
let technicianOverlayFieldState0946=[];
let technicianOverlayAutoSaveTimer0946=0;
let technicianOverlayDragIndex0946=-1;
let technicianOverlayGroupAlign0948="right";
function overlayAlignment0948(value,fallback="left"){
  return value==="center"?"center":value==="right"?"right":value==="left"?"left":fallback;
}
function technicianOverlayDefaults0946(){return [{tag:"{technician}",breakBefore:false},{tag:"{phone}",breakBefore:false}];}
function technicianOverlayNormalize0946(fields){
  const allowed=new Set(TECHNICIAN_OVERLAY_TAGS_0946),seen=new Set();
  const normalized=(Array.isArray(fields)?fields:[]).flatMap(item=>{
    const tag=String(item?.tag||"");
    if(!allowed.has(tag)||seen.has(tag))return [];
    seen.add(tag);
    return [{tag,breakBefore:Boolean(item?.breakBefore)}];
  });
  const result=normalized.length?normalized:technicianOverlayDefaults0946();
  if(result[0])result[0].breakBefore=false;
  return result;
}
function technicianOverlaySavedAlignment0948(){
  const saved=data.settings?.technicianOverlay||{};
  if(saved.alignment)return overlayAlignment0948(saved.alignment,"right");
  const legacy=(Array.isArray(saved.fields)?saved.fields:[]).map(item=>item?.align).filter(Boolean);
  return legacy.length&&legacy.every(value=>value==="left")?"left":"right";
}
function technicianOverlayValue0946(tag){
  const tech=data.settings?.technician||{};
  const values={
    "{technician}":tech.name||"Technician Name",
    "{company}":tech.company||"Company",
    "{phone}":formatPhone0758(tech.phone)||tech.phone||"(307) 555-0100",
    "{email}":tech.email||"tech@example.com",
    "{license}":tech.license||"License / ID"
  };
  return values[tag]||tag;
}
function technicianOverlayLines0946(fields=technicianOverlayFieldState0946){
  const lines=[];
  technicianOverlayNormalize0946(fields).forEach((item,index)=>{
    if(index===0||item.breakBefore)lines.push([]);
    lines[lines.length-1].push(technicianOverlayValue0946(item.tag));
  });
  return lines.map(line=>line.join(" • "));
}
function technicianOverlayGroupAlignmentMarkup0948(){
  const align=overlayAlignment0948(technicianOverlayGroupAlign0948,"right");
  return `<div class="technicianOverlayGroupAlign0948" role="group" aria-label="Technician information alignment">
    ${[["left","Left"],["center","Center"],["right","Right"]].map(([value,label])=>`<button type="button" class="${align===value?"active":""}" data-technician-overlay-group-align="${value}" aria-pressed="${align===value}">${label}</button>`).join("")}
  </div>`;
}
function technicianOverlayPreviewMarkup0946(){
  const align=overlayAlignment0948(technicianOverlayGroupAlign0948,"right");
  return `<div class="technicianOverlayPreview0946 align-${align}">${technicianOverlayLines0946().map(line=>`<div><span>${esc(line)}</span></div>`).join("")}</div>`;
}
function technicianOverlayAvailableMarkup0946(){
  const active=new Set(technicianOverlayFieldState0946.map(item=>item.tag));
  return TECHNICIAN_OVERLAY_TAGS_0946.map(tag=>{
    const meta=overlayFieldMeta0944(tag),added=active.has(tag);
    return `<button type="button" class="overlayFieldChip510 ${added?"isAdded0944":""}" data-technician-overlay-add="${esc(tag)}" ${added?"disabled":""}><span>${added?"✓":"＋"}</span><strong>${esc(meta.label)}</strong></button>`;
  }).join("");
}
function technicianOverlayActiveMarkup0946(){
  if(!technicianOverlayFieldState0946.length)return `<div class="overlayFieldEmpty0944"><strong>No technician fields selected</strong><small>Add fields below.</small></div>`;
  return technicianOverlayFieldState0946.map((item,index)=>{
    const meta=overlayFieldMeta0944(item.tag);
    return `<div class="overlayActiveField0944 technicianOverlayField0946" draggable="true" data-technician-overlay-index="${index}">
      <span class="overlayDragHandle0944" aria-hidden="true">☰</span>
      <div class="overlayActiveFieldText0944"><strong>${esc(meta.label)}</strong></div>
      <button type="button" class="overlayBreakButton0944 ${item.breakBefore?"active":""}" data-technician-overlay-break="${index}" ${index===0?"disabled":""} aria-label="${item.breakBefore?"Keep on a new line":"Start a new line before"} ${esc(meta.label)}">${item.breakBefore?"↵":"•"}</button>
      <div class="overlayFieldActions0944">
        <button type="button" data-technician-overlay-move="${index}" data-technician-overlay-direction="up" ${index===0?"disabled":""} aria-label="Move ${esc(meta.label)} up">↑</button>
        <button type="button" data-technician-overlay-move="${index}" data-technician-overlay-direction="down" ${index===technicianOverlayFieldState0946.length-1?"disabled":""} aria-label="Move ${esc(meta.label)} down">↓</button>
        <button type="button" class="danger" data-technician-overlay-remove="${index}" aria-label="Remove ${esc(meta.label)}">×</button>
      </div>
    </div>`;
  }).join("");
}
function technicianOverlayAutoSaveStatus0946(message,state=""){
  const el=document.getElementById("technicianOverlayAutoSave0946");if(!el)return;el.textContent=message;el.dataset.state=state;
}
function scheduleTechnicianOverlaySave0946(delay=220){
  clearTimeout(technicianOverlayAutoSaveTimer0946);
  technicianOverlayAutoSaveStatus0946("Saving…","saving");
  technicianOverlayAutoSaveTimer0946=setTimeout(()=>{
    data.settings.technicianOverlay={
      fields:technicianOverlayNormalize0946(technicianOverlayFieldState0946),
      alignment:overlayAlignment0948(technicianOverlayGroupAlign0948,"right")
    };
    save();
    technicianOverlayAutoSaveStatus0946("Saved automatically","saved");
  },delay);
}
function technicianOverlaySync0946({saveNow=false}={}){
  const active=document.getElementById("technicianOverlayActive0946");if(active)active.innerHTML=technicianOverlayActiveMarkup0946();
  const available=document.getElementById("technicianOverlayAvailable0946");if(available)available.innerHTML=technicianOverlayAvailableMarkup0946();
  const preview=document.getElementById("technicianOverlayPreview0946");if(preview)preview.innerHTML=technicianOverlayPreviewMarkup0946();
  wireTechnicianOverlayTemplate0946();
  if(saveNow)scheduleTechnicianOverlaySave0946();
}
function moveTechnicianOverlayField0946(index,direction){
  const next=direction==="up"?index-1:index+1;
  if(index<0||next<0||index>=technicianOverlayFieldState0946.length||next>=technicianOverlayFieldState0946.length)return;
  const copy=[...technicianOverlayFieldState0946];[copy[index],copy[next]]=[copy[next],copy[index]];copy[0].breakBefore=false;technicianOverlayFieldState0946=copy;technicianOverlaySync0946({saveNow:true});
}
function wireTechnicianOverlayTemplate0946(){
  document.querySelectorAll("[data-technician-overlay-add]").forEach(button=>button.onclick=()=>{
    const tag=button.dataset.technicianOverlayAdd;if(!tag||technicianOverlayFieldState0946.some(item=>item.tag===tag))return;
    technicianOverlayFieldState0946.push({tag,breakBefore:technicianOverlayFieldState0946.length>0,align:"right"});technicianOverlaySync0946({saveNow:true});
  });
  document.querySelectorAll("[data-technician-overlay-remove]").forEach(button=>button.onclick=()=>{
    const index=Number(button.dataset.technicianOverlayRemove);if(!Number.isInteger(index))return;
    technicianOverlayFieldState0946.splice(index,1);if(technicianOverlayFieldState0946[0])technicianOverlayFieldState0946[0].breakBefore=false;technicianOverlaySync0946({saveNow:true});
  });
  document.querySelectorAll("[data-technician-overlay-move]").forEach(button=>button.onclick=()=>moveTechnicianOverlayField0946(Number(button.dataset.technicianOverlayMove),button.dataset.technicianOverlayDirection));
  document.querySelectorAll("[data-technician-overlay-break]").forEach(button=>button.onclick=()=>{
    const index=Number(button.dataset.technicianOverlayBreak);if(index<=0||!technicianOverlayFieldState0946[index])return;
    technicianOverlayFieldState0946[index].breakBefore=!technicianOverlayFieldState0946[index].breakBefore;technicianOverlaySync0946({saveNow:true});
  });
  document.querySelectorAll("[data-technician-overlay-group-align]").forEach(button=>button.onclick=()=>{
    technicianOverlayGroupAlign0948=overlayAlignment0948(button.dataset.technicianOverlayGroupAlign,"right");
    const control=document.getElementById("technicianOverlayGroupAlign0948");if(control)control.innerHTML=technicianOverlayGroupAlignmentMarkup0948();
    technicianOverlaySync0946({saveNow:true});
  });
  const reset=document.getElementById("technicianOverlayReset0946");if(reset)reset.onclick=()=>{
    technicianOverlayFieldState0946=technicianOverlayDefaults0946();
    technicianOverlayGroupAlign0948="right";
    const control=document.getElementById("technicianOverlayGroupAlign0948");if(control)control.innerHTML=technicianOverlayGroupAlignmentMarkup0948();
    technicianOverlaySync0946({saveNow:true});
  };
  document.querySelectorAll("[data-technician-overlay-index]").forEach(row=>{
    row.addEventListener("dragstart",event=>{technicianOverlayDragIndex0946=Number(row.dataset.technicianOverlayIndex);row.classList.add("isDragging0944");event.dataTransfer.effectAllowed="move";});
    row.addEventListener("dragend",()=>{technicianOverlayDragIndex0946=-1;row.classList.remove("isDragging0944");});
    row.addEventListener("dragover",event=>{event.preventDefault();event.dataTransfer.dropEffect="move";});
    row.addEventListener("drop",event=>{event.preventDefault();const target=Number(row.dataset.technicianOverlayIndex);if(technicianOverlayDragIndex0946<0||target<0||target===technicianOverlayDragIndex0946)return;const copy=[...technicianOverlayFieldState0946];const [moved]=copy.splice(technicianOverlayDragIndex0946,1);copy.splice(target,0,moved);copy[0].breakBefore=false;technicianOverlayFieldState0946=copy;technicianOverlaySync0946({saveNow:true});});
  });
}
function overlayFieldMeta0944(tag){
  const found=OVERLAY_TAGS_510.find(row=>row[0]===tag);
  return found ? {tag:found[0],label:found[1],note:found[2]} : {tag,label:tag,note:"Overlay field"};
}
function overlayFieldsFromTemplate0944(template){
  const source=String(template||"");
  const allowed=new Set(OVERLAY_TAGS_510.map(row=>row[0]));
  const fields=[];
  const re=/\{[a-z_]+\}/g;
  let match,lastEnd=0;
  while((match=re.exec(source))){
    let tag=match[0];
    if(OVERLAY_TECH_LEGACY_TAGS_0949.has(tag)) tag=OVERLAY_TECH_INFO_TAG_0949;
    if(!allowed.has(tag) || fields.some(item=>item.tag===tag)) continue;
    fields.push({tag,breakBefore:fields.length>0 && source.slice(lastEnd,match.index).includes("\n"),align:tag===OVERLAY_TECH_INFO_TAG_0949?technicianOverlaySavedAlignment0948():"left"});
    lastEnd=match.index+match[0].length;
  }
  if(!fields.length){
    return [
      {tag:"{site_name}",breakBefore:false,align:"left"},
      {tag:"{account_id}",breakBefore:false,align:"left"},
      {tag:"{date}",breakBefore:true,align:"left"},
      {tag:"{time}",breakBefore:false,align:"left"}
    ];
  }
  fields[0].breakBefore=false;
  return fields;
}
function overlayNormalizeFieldLayout0945(layout,template=""){
  const allowed=new Set(OVERLAY_TAGS_510.map(row=>row[0]));
  const seen=new Set();
  const normalized=(Array.isArray(layout)?layout:[]).flatMap(item=>{
    let tag=String(item?.tag||"");
    if(OVERLAY_TECH_LEGACY_TAGS_0949.has(tag)) tag=OVERLAY_TECH_INFO_TAG_0949;
    if(!allowed.has(tag)||seen.has(tag))return [];
    seen.add(tag);
    return [{tag,breakBefore:Boolean(item?.breakBefore),align:overlayAlignment0948(item?.align,"left"),noWrap:Boolean(item?.noWrap)}];
  });
  const fields=normalized.length?normalized:overlayFieldsFromTemplate0944(template);
  if(fields[0])fields[0].breakBefore=false;
  return fields;
}
function overlayTemplateFromFields0944(fields=overlayFieldState0944){
  return (fields||[]).map((item,index)=>`${index===0?"":(item.breakBefore?"\n":" • ")}${item.tag}`).join("");
}
function overlayTagButtons510(){
  const active=new Set((overlayFieldState0944||[]).map(item=>item.tag));
  return OVERLAY_TAGS_510.map(([tag,label,note])=>`<button type="button" class="overlayFieldChip510 ${active.has(tag)?"isAdded0944":""}" data-overlay-add-field="${esc(tag)}" title="${esc(note)}" ${active.has(tag)?"disabled":""}><span>${fvIcon073(active.has(tag)?"check":"add","overlayFieldChipIcon1012")}</span><strong>${esc(label)}</strong></button>`).join("");
}
function overlayActiveFieldsMarkup0944(){
  if(!overlayFieldState0944.length) return `<div class="overlayFieldEmpty0944"><strong>No fields selected</strong><small>Add fields below. The preview updates automatically.</small></div>`;
  return overlayFieldState0944.map((item,index)=>{
    const meta=overlayFieldMeta0944(item.tag);
    const align=overlayAlignment0948(item.align,"left");
    const isTechInfo=item.tag===OVERLAY_TECH_INFO_TAG_0949;
    return `<div class="overlayActiveField0944 overlayMainField1012 ${isTechInfo?"overlayTechInfoField0949":""}" draggable="true" data-overlay-field-index="${index}">
      <div class="overlayFieldTop1012">
        <span class="overlayDragHandle0944" aria-hidden="true">${fvIcon073("drag","overlayDragIcon1012")}</span>
        <div class="overlayActiveFieldText0944"><strong>${esc(meta.label)}</strong><small>${esc(meta.note)}</small></div>
        <button type="button" class="overlayBreakButton0944 ${item.breakBefore?"active":""}" data-overlay-break-field="${index}" ${(index===0||isTechInfo)?"disabled":""} aria-label="${isTechInfo?"Tech Info uses its Profile template line arrangement":`${item.breakBefore?"Place on same line":"Start a new line before"} ${esc(meta.label)}`}">${isTechInfo?"Profile lines":index===0?"First line":item.breakBefore?"New line":"Same line"}</button>
      </div>
      <div class="overlayFieldBottom1012">
        <div class="overlayFieldAlign0945" role="group" aria-label="Align ${esc(meta.label)}">
          <button type="button" class="${align==="left"?"active":""}" data-overlay-align-field="${index}" data-overlay-field-align="left" aria-pressed="${align==="left"}">Left</button>
          <button type="button" class="${align==="center"?"active":""}" data-overlay-align-field="${index}" data-overlay-field-align="center" aria-pressed="${align==="center"}">Center</button>
          <button type="button" class="${align==="right"?"active":""}" data-overlay-align-field="${index}" data-overlay-field-align="right" aria-pressed="${align==="right"}">Right</button>
        </div>
        <div class="overlayFieldActions0944">
          <button type="button" data-overlay-move-field="${index}" data-overlay-direction="up" ${index===0?"disabled":""} aria-label="Move ${esc(meta.label)} up">${fvIcon073("up","overlayFieldControlIcon1012")}<span>Up</span></button>
          <button type="button" data-overlay-move-field="${index}" data-overlay-direction="down" ${index===overlayFieldState0944.length-1?"disabled":""} aria-label="Move ${esc(meta.label)} down">${fvIcon073("down","overlayFieldControlIcon1012")}<span>Down</span></button>
          <button type="button" class="danger" data-overlay-remove-field="${index}" aria-label="Remove ${esc(meta.label)}">${fvIcon073("remove","overlayFieldControlIcon1012")}<span>Remove</span></button>
        </div>
      </div>
    </div>`;
  }).join("");
}
function overlaySyncFieldTemplate0944({saveNow=false}={}){
  const template=document.getElementById("ovTemplate");
  if(template) template.value=overlayTemplateFromFields0944();
  const active=document.getElementById("overlayActiveFields0944");
  if(active) active.innerHTML=overlayActiveFieldsMarkup0944();
  const available=document.getElementById("overlayAvailableFields0944");
  if(available) available.innerHTML=overlayTagButtons510();
  wireOverlayFieldEditor0944();
  scheduleOverlayPreview0890(0);
  if(saveNow) scheduleOverlayAutoSave0944();
}
function overlayAutoSaveStatus0944(message,state=""){
  const el=document.getElementById("overlayAutoSaveStatus0944");
  if(!el)return;
  el.textContent=message;
  el.dataset.state=state;
}
function scheduleOverlayAutoSave0944(delay=320){
  clearTimeout(overlayAutoSaveTimer0944);
  overlayAutoSaveStatus0944("Saving…","saving");
  overlayAutoSaveTimer0944=setTimeout(()=>{
    overlayAutoSaveTimer0944=0;
    data.settings.overlay={...data.settings.overlay,...collectOverlayFromInputs510()};
    save();
    overlayAutoSaveStatus0944("Saved","saved");
  },delay);
}
function moveOverlayField0944(index,direction){
  const next=direction==="up"?index-1:index+1;
  if(index<0||next<0||index>=overlayFieldState0944.length||next>=overlayFieldState0944.length)return;
  const copy=[...overlayFieldState0944];
  [copy[index],copy[next]]=[copy[next],copy[index]];
  copy[0].breakBefore=false;
  overlayFieldState0944=copy;
  overlaySyncFieldTemplate0944({saveNow:true});
}
function applyTechnicianInfoTemplate0946(){
  const existingIndex=overlayFieldState0944.findIndex(item=>item.tag===OVERLAY_TECH_INFO_TAG_0949 || OVERLAY_TECH_LEGACY_TAGS_0949.has(item.tag));
  if(existingIndex>=0){
    document.querySelector(`[data-overlay-field-index="${existingIndex}"]`)?.scrollIntoView({behavior:"smooth",block:"center"});
    toast("Tech Info is already on the photo.");
    return;
  }
  overlayFieldState0944.push({tag:OVERLAY_TECH_INFO_TAG_0949,breakBefore:overlayFieldState0944.length>0,align:technicianOverlaySavedAlignment0948(),noWrap:true});
  if(overlayFieldState0944[0])overlayFieldState0944[0].breakBefore=false;
  overlaySyncFieldTemplate0944({saveNow:true});
  toast("Tech Info field added.");
}
function wireOverlayFieldEditor0944(){
  document.querySelectorAll("[data-overlay-add-field]").forEach(button=>button.onclick=()=>{
    const tag=button.dataset.overlayAddField;
    if(!tag||overlayFieldState0944.some(item=>item.tag===tag))return;
    overlayFieldState0944.push({tag,breakBefore:overlayFieldState0944.length>0 && overlayFieldState0944.length%2===0,align:"left"});
    overlaySyncFieldTemplate0944({saveNow:true});
  });
  document.querySelectorAll("[data-overlay-remove-field]").forEach(button=>button.onclick=()=>{
    const index=Number(button.dataset.overlayRemoveField);
    if(!Number.isInteger(index))return;
    overlayFieldState0944.splice(index,1);
    if(overlayFieldState0944[0])overlayFieldState0944[0].breakBefore=false;
    overlaySyncFieldTemplate0944({saveNow:true});
  });
  document.querySelectorAll("[data-overlay-move-field]").forEach(button=>button.onclick=()=>moveOverlayField0944(Number(button.dataset.overlayMoveField),button.dataset.overlayDirection));
  document.querySelectorAll("[data-overlay-break-field]").forEach(button=>button.onclick=()=>{
    const index=Number(button.dataset.overlayBreakField);
    if(index<=0||!overlayFieldState0944[index])return;
    overlayFieldState0944[index].breakBefore=!overlayFieldState0944[index].breakBefore;
    overlaySyncFieldTemplate0944({saveNow:true});
  });
  document.querySelectorAll("[data-overlay-align-field]").forEach(button=>button.onclick=()=>{
    const index=Number(button.dataset.overlayAlignField);
    if(index<0||!overlayFieldState0944[index])return;
    overlayFieldState0944[index].align=overlayAlignment0948(button.dataset.overlayFieldAlign,"left");
    overlaySyncFieldTemplate0944({saveNow:true});
  });
  const technicianInfo=document.getElementById("overlayTechnicianInfo0946");if(technicianInfo)technicianInfo.onclick=applyTechnicianInfoTemplate0946;
  document.querySelectorAll("[data-overlay-field-index]").forEach(row=>{
    row.addEventListener("dragstart",event=>{overlayDragIndex0944=Number(row.dataset.overlayFieldIndex);row.classList.add("isDragging0944");event.dataTransfer.effectAllowed="move";});
    row.addEventListener("dragend",()=>{overlayDragIndex0944=-1;row.classList.remove("isDragging0944");});
    row.addEventListener("dragover",event=>{event.preventDefault();event.dataTransfer.dropEffect="move";});
    row.addEventListener("drop",event=>{
      event.preventDefault();
      const target=Number(row.dataset.overlayFieldIndex);
      if(overlayDragIndex0944<0||target<0||target===overlayDragIndex0944)return;
      const copy=[...overlayFieldState0944];
      const [moved]=copy.splice(overlayDragIndex0944,1);
      copy.splice(target,0,moved);
      copy[0].breakBefore=false;
      overlayFieldState0944=copy;
      overlaySyncFieldTemplate0944({saveNow:true});
    });
  });
}
function overlayLogoSrc510(set){
  if(set.logoMode === "custom") return set.customLogoData || "";
  return `${themeBrandAsset(APP_PROFILE,"logo")}?v=${BUILD}`;
}
function overlayLogoStatus510(set){
  if(set.logoMode === "custom" && set.customLogoData) return "Custom logo ready";
  if(set.logoMode === "custom") return "Upload a custom logo";
  return "FireVault logo";
}
function overlayChoiceButtons0890(id,value,choices){
  return `<input type="hidden" id="${id}" value="${esc(value)}"><div class="overlayChoiceGrid0890">${choices.map(([key,label,icon])=>`<button type="button" class="overlayChoice0890 ${value===key?"active":""}" data-overlay-control="${id}" data-overlay-value="${key}" aria-pressed="${value===key?"true":"false"}"><span>${icon}</span><strong>${esc(label)}</strong></button>`).join("")}</div>`;
}
function overlayPresetButtons0890(){
  return `<div class="overlayPresetGrid0890">
    <button type="button" data-overlay-preset="compact">${fvIcon073("list","overlayPresetIcon1012")}<strong>Compact</strong><small>Site and date only</small></button>
    <button type="button" data-overlay-preset="standard" class="recommended">${fvIcon073("photo","overlayPresetIcon1012")}<strong>Standard</strong><small>Balanced field stamp</small><em>Recommended</em></button>
    <button type="button" data-overlay-preset="detailed">${fvIcon073("note","overlayPresetIcon1012")}<strong>Detailed</strong><small>Account and address</small></button>
  </div>`;
}
function overlayRenderedLines0945(set,siteData){
  const layout=overlayNormalizeFieldLayout0945(set.fieldLayout,set.template);
  const logical=[];
  layout.forEach((item,index)=>{
    const align=overlayAlignment0948(item.align, technicianOverlaySavedAlignment0948());
    if(item.tag===OVERLAY_TECH_INFO_TAG_0949){
      const techLines=technicianOverlayLines0946(technicianOverlayNormalize0946(data.settings?.technicianOverlay?.fields));
      if(!techLines.length)return;
      techLines.forEach(text=>logical.push({left:align==="left"?[text]:[],center:align==="center"?[text]:[],right:align==="right"?[text]:[],noWrap:true}));
      return;
    }
    if(index===0||item.breakBefore||!logical.length)logical.push({left:[],center:[],right:[],noWrap:false});
    const line=logical[logical.length-1];
    const value=String(renderTemplate(item.tag,siteData||{})||"").trim();
    if(value)line[align].push(value);
    if(item.noWrap)line.noWrap=true;
  });
  if(!logical.length){
    String(renderTemplate(set.template,siteData||{})||"").split(/\n/).forEach(text=>logical.push({left:[text],center:[],right:[],noWrap:false}));
  }
  return logical.map(line=>({left:line.left.join(" • "),center:line.center.join(" • "),right:line.right.join(" • "),noWrap:line.noWrap}));
}
async function drawOverlayStamp0890(ctx,w,h,set,siteData){
  const accent=hexToRgb512(set.accentColor);
  const alpha=Math.max(.2,Math.min(1,(Number(set.opacity)||85)/100));
  const pad=Math.max(14,Math.round(w*0.018));
  const logoSize=set.showLogo?Math.max(42,Math.min(100,Math.round(w*0.065))):0;
  const logicalLines=overlayRenderedLines0945(set,siteData);
  const tagline=set.showTagline ? "FireVault Field Photo Overlay" : "";
  const preferred=set.fontSize==="large"?Math.round(w*0.032):set.fontSize==="small"?Math.round(w*0.022):Math.round(w*0.027);
  const minimum=Math.max(11,Math.round(w*0.013));
  let fontSize=Math.max(minimum,Math.min(54,preferred));
  let lines=[],lineHeight=0,tagHeight=0,textH=0,stampW=0,stampH=0,textMax=0,maxRenderedWidth=0;
  const availableH=Math.max(90,h-(pad*2));
  const columnGap=Math.max(18,Math.round(w*.018));
  const layout=()=>{
    ctx.font=`800 ${fontSize}px Arial, sans-serif`;
    textMax=set.backgroundStyle==="card"
      ? Math.max(120,Math.round(w*.82)-logoSize-(pad*3))
      : Math.max(120,w-(pad*5)-logoSize);
    lines=[];
    logicalLines.forEach(group=>{
      if(group.center){
        const centered=group.noWrap?[group.center]:wrapCanvasText512(ctx,group.center,textMax);
        centered.forEach(text=>lines.push({left:"",center:text,right:"",noWrap:Boolean(group.noWrap)}));
        if(group.left||group.right){
          const hasBoth=Boolean(group.left&&group.right);
          const sideMax=hasBoth?Math.max(60,Math.floor((textMax-columnGap)/2)):textMax;
          const leftWrapped=group.noWrap?(group.left?[group.left]:[]):group.left?wrapCanvasText512(ctx,group.left,sideMax):[];
          const rightWrapped=group.noWrap?(group.right?[group.right]:[]):group.right?wrapCanvasText512(ctx,group.right,sideMax):[];
          const count=Math.max(leftWrapped.length,rightWrapped.length,1);
          for(let i=0;i<count;i++)lines.push({left:leftWrapped[i]||"",center:"",right:rightWrapped[i]||"",noWrap:Boolean(group.noWrap)});
        }
        return;
      }
      const hasBoth=Boolean(group.left&&group.right);
      const sideMax=hasBoth?Math.max(60,Math.floor((textMax-columnGap)/2)):textMax;
      const leftWrapped=group.noWrap?(group.left?[group.left]:[]):group.left?wrapCanvasText512(ctx,group.left,sideMax):[];
      const rightWrapped=group.noWrap?(group.right?[group.right]:[]):group.right?wrapCanvasText512(ctx,group.right,sideMax):[];
      const count=Math.max(leftWrapped.length,rightWrapped.length,1);
      for(let i=0;i<count;i++)lines.push({left:leftWrapped[i]||"",center:"",right:rightWrapped[i]||"",noWrap:Boolean(group.noWrap)});
    });
    if(!lines.length && !tagline)lines=[{left:"",right:""}];
    lineHeight=Math.max(14,Math.round(fontSize*1.24));
    tagHeight=tagline?Math.round(fontSize*.86):0;
    textH=(lines.length*lineHeight)+tagHeight;
    const measured=Math.max(...lines.map(line=>{
      const leftW=line.left?ctx.measureText(line.left).width:0;
      const centerW=line.center?ctx.measureText(line.center).width:0;
      const rightW=line.right?ctx.measureText(line.right).width:0;
      return Math.max(centerW,leftW+rightW+(leftW&&rightW?columnGap:0));
    }),0);
    maxRenderedWidth=measured;
    stampW=set.backgroundStyle==="card"
      ? Math.min(w-pad*2,Math.max(Math.round(w*.46),measured+logoSize+pad*4))
      : w-pad*2;
    stampH=Math.max(logoSize+pad*1.4,textH+pad*1.7);
  };
  layout();
  while((stampH>availableH||maxRenderedWidth>textMax) && fontSize>minimum){
    fontSize=Math.max(minimum,fontSize-Math.max(1,Math.ceil(fontSize*.08)));
    layout();
  }
  if(stampH>availableH){
    const room=Math.max(1,Math.floor((availableH-(tagHeight+pad*1.7))/lineHeight));
    if(lines.length>room){
      lines=lines.slice(0,room);
      const last=lines.length-1;
      const target=lines[last].center?"center":lines[last].right?"right":"left";
      lines[last][target]=`${String(lines[last][target]||"").replace(/[\s…]+$/g,"")} …`;
      textH=(lines.length*lineHeight)+tagHeight;
      stampH=Math.min(availableH,Math.max(logoSize+pad*1.4,textH+pad*1.7));
    }
  }
  const x=pad;
  const y=set.alignment==="top"?pad:set.alignment==="middle"?Math.round((h-stampH)/2):Math.max(pad,h-stampH-pad);
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
      ctx.fillStyle=grd;ctx.fill();
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
        const lx=x+pad,ly=y+(stampH-logoSize)/2;
        ctx.save();roundRect512(ctx,lx,ly,logoSize,logoSize,Math.round(logoSize*.22));ctx.clip();ctx.drawImage(logo,lx,ly,logoSize,logoSize);ctx.restore();
      }catch{}
    }
    tx+=logoSize+pad;
  }
  const rightEdge=x+stampW-pad;
  ctx.fillStyle=set.textColor||"#ffffff";
  ctx.textBaseline="top";
  ctx.font=`900 ${fontSize}px Arial, sans-serif`;
  let ty=y+Math.max(pad*.75,(stampH-textH)/2);
  lines.forEach(line=>{
    const hasBoth=Boolean(line.left&&line.right);
    const lineMax=hasBoth?Math.max(60,Math.floor((textMax-columnGap)/2)):textMax;
    if(line.left){ctx.textAlign="left";line.noWrap?ctx.fillText(line.left,tx,ty,lineMax):ctx.fillText(line.left,tx,ty);}
    if(line.center){ctx.textAlign="center";line.noWrap?ctx.fillText(line.center,tx+((rightEdge-tx)/2),ty,lineMax):ctx.fillText(line.center,tx+((rightEdge-tx)/2),ty);}
    if(line.right){ctx.textAlign="right";line.noWrap?ctx.fillText(line.right,rightEdge,ty,lineMax):ctx.fillText(line.right,rightEdge,ty);}
    ty+=lineHeight;
  });
  if(tagline){
    ctx.textAlign="left";
    ctx.font=`800 ${Math.max(11,Math.round(fontSize*.62))}px Arial, sans-serif`;
    ctx.fillStyle="rgba(255,255,255,.78)";
    ctx.fillText(tagline,tx,ty+Math.round(fontSize*.1));
  }
  ctx.restore();
}
async function renderOverlayComposite0890(source,set,siteData,maxW=1800){
  const photo=await loadImage512(source);
  const scale=Math.min(1,maxW/(photo.naturalWidth||photo.width||maxW));
  const w=Math.max(1,Math.round((photo.naturalWidth||photo.width)*scale));
  const h=Math.max(1,Math.round((photo.naturalHeight||photo.height)*scale));
  const canvas=document.createElement("canvas");
  canvas.width=w; canvas.height=h;
  const ctx=canvas.getContext("2d");
  ctx.drawImage(photo,0,0,w,h);
  await drawOverlayStamp0890(ctx,w,h,set,siteData);
  return canvas;
}
function overlayPreviewMarkup510(){
  return `<section class="overlayPreviewCard0890 overlayPreviewSticky0942 overlayPreviewWide0943 overlayPreview1012">
    <header class="overlayWorkspaceHead1012">
      <button type="button" class="overlayFloatingBack0943" id="settingsBackBtn" aria-label="Back to Settings">${fvIcon073("back","overlayBackIcon1012")}<strong>Back</strong></button>
      <div><span>PHOTO OVERLAY</span><strong>Live Preview</strong><small>Matches the downloaded field photo</small></div>
      <em class="overlayAutoSave0944" id="overlayAutoSaveStatus0944" data-state="saved">Saved</em>
    </header>
    <div class="overlayPreviewFrame0890"><canvas id="overlayPreviewCanvas0890" width="900" height="600" aria-label="Live photo overlay preview"></canvas><div id="overlayPreviewStatus0890">Rendering preview…</div></div>
  </section>`;
}
function overlaySettingsPanel510(o){
  const set=overlayCleanSetting510(o);
  overlayFieldState0944=overlayNormalizeFieldLayout0945(set.fieldLayout,set.template);
  return `<div class="overlayStudio0890 overlayStudio0942 overlayStudio0943 overlayStudio1012">
    ${overlayPreviewMarkup510()}
    <div class="overlayControlsColumn0942 overlayControlsColumn0943 overlayControlsColumn1012">
      <section class="overlayQuickCard0890 overlayQuickCard1012">
        <div class="overlayCardHead0890"><div><span>1 · QUICK SETUP</span><h2>Choose a look</h2><p>Start with a preset, then fine-tune only what you need.</p></div><button type="button" class="ghost overlayReset1012" id="ovReset0890">Reset</button></div>
        ${overlayPresetButtons0890()}
        <div class="overlayQuickToggles0890">
          ${checkBlock("ovLogo","Show logo",set.showLogo)}
          ${checkBlock("ovTagline","Show tagline",set.showTagline)}
        </div>
      </section>
      <section class="overlaySection0890 overlayContent0890 overlayFieldBuilder0944 overlayFieldBuilder1012">
        <div class="overlayCardHead0890"><div><span>2 · FIELDS</span><h2>Photo information</h2><p>Choose what appears and arrange it for quick field reading.</p></div></div>
        <input type="hidden" id="ovTemplate" value="${esc(set.template)}">
        <div class="overlayBuilderGroup0944"><div class="overlayBuilderTitle0944"><div><strong>Fields on photo</strong><small>Drag to reorder, or use the larger controls below each field.</small></div><button type="button" class="overlayQuickAlign0945" id="overlayTechnicianInfo0946">${fvIcon073("visit","overlayQuickInfoIcon1012")}<strong>Tech Info</strong><small>Use Profile template</small></button></div><div class="overlayActiveFields0944" id="overlayActiveFields0944">${overlayActiveFieldsMarkup0944()}</div></div>
        <div class="overlayBuilderGroup0944"><div class="overlayBuilderTitle0944"><div><strong>Add another field</strong><small>Checked fields are already on the photo.</small></div></div><div class="overlayFieldGrid510" id="overlayAvailableFields0944">${overlayTagButtons510()}</div></div>
      </section>
      <section class="overlaySection0890 overlayLayout0890 overlayLayout1012">
        <div class="overlayCardHead0890"><div><span>3 · LAYOUT</span><h2>Placement and shape</h2><p>Control where the stamp sits and how prominent it feels.</p></div></div>
        <div class="overlayControlBlock0890"><label>Position</label>${overlayChoiceButtons0890("ovAlign",set.alignment,[["top","Top",fvIcon073("up","overlayChoiceIcon1012")],["middle","Center",fvIcon073("nearby","overlayChoiceIcon1012")],["bottom","Bottom",fvIcon073("down","overlayChoiceIcon1012")]])}</div>
        <div class="overlayControlBlock0890"><label>Style</label>${overlayChoiceButtons0890("ovBg",set.backgroundStyle,[["bar","Full Bar",fvIcon073("list","overlayChoiceIcon1012")],["card","Compact Card",fvIcon073("photo","overlayChoiceIcon1012")],["minimal","Minimal",fvIcon073("note","overlayChoiceIcon1012")]])}</div>
        <div class="overlayControlBlock0890"><label>Text size</label>${overlayChoiceButtons0890("ovSize",set.fontSize,[["small","Small","A"],["medium","Medium","A"],["large","Large","A"]])}</div>
        <label class="overlayRange0890"><span><b>Background opacity</b><em id="ovOpacityValue0890">${esc(set.opacity)}%</em></span><input id="ovOpacity" type="range" min="35" max="100" value="${esc(set.opacity)}"></label>
      </section>
      <section class="overlaySection0890 overlayBrand0890 overlayBrand1012">
        <div class="overlayCardHead0890"><div><span>4 · BRANDING</span><h2>Logo and colors</h2><p>Keep the FireVault identity or use your company mark.</p></div></div>
        <div class="overlayColorGrid0890">
          ${fieldBlock("Accent",`<input id="ovAccent" type="color" value="${esc(set.accentColor)}">`,`Border and highlight color`)}
          ${fieldBlock("Text",`<input id="ovText" type="color" value="${esc(set.textColor)}">`,`Overlay text color`)}
          ${fieldBlock("Logo",`<select id="ovLogoMode"><option value="firevault" ${set.logoMode==="firevault"?"selected":""}>FireVault logo</option><option value="custom" ${set.logoMode==="custom"?"selected":""}>Custom logo</option></select>`,`Select the logo source`)}
        </div>
        <div class="overlayLogoCard511">
          <div class="overlayLogoPreview511">${set.showLogo ? (overlayLogoSrc510(set)?`<img src="${esc(overlayLogoSrc510(set))}" alt="Current overlay logo preview">`:`<span>No logo image</span>`) : `<span>Logo hidden</span>`}</div>
          <div class="overlayLogoMeta511">
            <strong>Overlay logo</strong>
            <p id="ovLogoStatus">${esc(overlayLogoStatus510(set))}</p>
            <label class="overlayUploadLabel511"><span>Upload custom logo</span><input id="ovCustomLogo" type="file" accept="image/*"></label>
            <div class="overlayLogoActions511"><button type="button" class="ghost" id="ovUseFireVault">Use FireVault</button><button type="button" class="ghost" id="ovClearCustomLogo">Clear custom</button></div>
            <small class="fieldNote">Square transparent PNG files work best.</small>
          </div>
        </div>
      </section>
    </div>
  </div>`;
}
function collectOverlayFromInputs510(){
  return overlayCleanSetting510({
    template:document.getElementById("ovTemplate") ? raw("ovTemplate") : overlayDefaultTemplate510(),
    alignment:val("ovAlign") || "bottom",
    fontSize:val("ovSize") || "medium",
    accentColor:val("ovAccent") || "#ef4444",
    textColor:val("ovText") || "#ffffff",
    backgroundStyle:val("ovBg") || "bar",
    opacity:val("ovOpacity") || "85",
    showLogo:checked("ovLogo"),
    showTagline:checked("ovTagline"),
    logoMode:val("ovLogoMode") || "firevault",
    customLogoData:overlayLogoDraftDataUrl || data.settings.overlay?.customLogoData || "",
    fieldLayout:overlayFieldState0944.map(item=>({tag:item.tag,breakBefore:Boolean(item.breakBefore),align:overlayAlignment0948(item.align,"left"),noWrap:Boolean(item.noWrap)}))
  });
}
function scheduleOverlayPreview0890(delay=70){
  if(overlayPreviewTimer0890) clearTimeout(overlayPreviewTimer0890);
  overlayPreviewTimer0890=setTimeout(()=>{overlayPreviewTimer0890=0;updateOverlayPreview510();},Math.max(0,delay));
}
async function updateOverlayPreview510(){
  const canvas=document.getElementById("overlayPreviewCanvas0890");
  if(!canvas) return;
  const token=++overlayPreviewRenderToken0890;
  const status=document.getElementById("overlayPreviewStatus0890");
  if(status){status.hidden=false;status.textContent="Rendering preview…";}
  const set=collectOverlayFromInputs510();
  const opacityValue=document.getElementById("ovOpacityValue0890");
  if(opacityValue) opacityValue.textContent=`${set.opacity}%`;
  try{
    const composed=await renderOverlayComposite0890("assets/overlay-sample-fire-alarm-issue.png",set,overlaySampleSite510(),900);
    if(token!==overlayPreviewRenderToken0890 || !canvas.isConnected) return;
    canvas.width=composed.width;canvas.height=composed.height;
    canvas.getContext("2d").drawImage(composed,0,0);
    if(status) status.hidden=true;
  }catch(err){
    if(status){status.hidden=false;status.textContent="Preview unavailable";}
  }
  const miniPreview=document.querySelector('.overlayLogoPreview511');
  if(miniPreview){
    const logoSrc=overlayLogoSrc510(set);
    miniPreview.innerHTML = !set.showLogo ? '<span>Logo hidden</span>' : (logoSrc ? `<img src="${esc(logoSrc)}" alt="Current overlay logo preview">` : '<span>No logo image</span>');
  }
  const stat=document.getElementById('ovLogoStatus');
  if(stat) stat.textContent=overlayLogoStatus510(set);
}
function setOverlayChoice0890(id,value,render=true){
  const input=document.getElementById(id);if(!input)return;
  input.value=value;
  document.querySelectorAll(`[data-overlay-control="${id}"]`).forEach(btn=>{
    const active=btn.dataset.overlayValue===value;
    btn.classList.toggle("active",active);btn.setAttribute("aria-pressed",active?"true":"false");
  });
  if(render) scheduleOverlayPreview0890(0);
}
function applyOverlayPreset0890(name){
  const presets={
    compact:{template:"{site_name} • {date}",alignment:"bottom",fontSize:"small",backgroundStyle:"minimal",opacity:"72",showLogo:false,showTagline:false},
    standard:{template:"{site_name} • {account_id}\n{date} • {time}",alignment:"bottom",fontSize:"medium",backgroundStyle:"bar",opacity:"82",showLogo:true,showTagline:false},
    detailed:{template:"{site_name} • {account_id} • {category}\n{address}\n{date} • {time}\n{tech_info}",alignment:"bottom",fontSize:"small",backgroundStyle:"card",opacity:"90",showLogo:true,showTagline:false}
  };
  const p=presets[name]||presets.standard;
  const template=document.getElementById("ovTemplate");if(template)template.value=p.template;
  overlayFieldState0944=overlayFieldsFromTemplate0944(p.template).map(item=>({...item,align:item.tag===OVERLAY_TECH_INFO_TAG_0949?technicianOverlaySavedAlignment0948():"left",noWrap:item.tag===OVERLAY_TECH_INFO_TAG_0949}));
  overlaySyncFieldTemplate0944();
  const opacity=document.getElementById("ovOpacity");if(opacity)opacity.value=p.opacity;
  const logo=document.getElementById("ovLogo");if(logo)logo.checked=p.showLogo;
  const tagline=document.getElementById("ovTagline");if(tagline)tagline.checked=p.showTagline;
  setOverlayChoice0890("ovAlign",p.alignment,false);
  setOverlayChoice0890("ovSize",p.fontSize,false);
  setOverlayChoice0890("ovBg",p.backgroundStyle,false);
  document.querySelectorAll("[data-overlay-preset]").forEach(btn=>btn.classList.toggle("active",btn.dataset.overlayPreset===name));
  scheduleOverlayPreview0890(0);
}
function wireOverlaySettings510(){
  overlayLogoDraftDataUrl=data.settings.overlay?.customLogoData||"";
  const template=document.getElementById("ovTemplate");
  overlayFieldState0944=overlayNormalizeFieldLayout0945(data.settings.overlay?.fieldLayout,template?.value||data.settings.overlay?.template||overlayDefaultTemplate510());
  overlaySyncFieldTemplate0944();
  ["ovOpacity","ovAccent","ovText","ovLogo","ovTagline","ovLogoMode"].forEach(id=>{
    const el=document.getElementById(id);if(!el)return;
    const event=(el.type==="checkbox"||el.tagName==="SELECT")?"change":"input";
    el.addEventListener(event,()=>{scheduleOverlayPreview0890(event==="input"?45:0);scheduleOverlayAutoSave0944(event==="input"?420:180);});
  });
  document.querySelectorAll("[data-overlay-control]").forEach(btn=>btn.onclick=()=>{setOverlayChoice0890(btn.dataset.overlayControl,btn.dataset.overlayValue);scheduleOverlayAutoSave0944(180);});
  document.querySelectorAll("[data-overlay-preset]").forEach(btn=>btn.onclick=()=>{applyOverlayPreset0890(btn.dataset.overlayPreset);scheduleOverlayAutoSave0944(180);});
  document.getElementById("ovReset0890")?.addEventListener("click",()=>applyOverlayPreset0890("standard"));
  const upload=document.getElementById("ovCustomLogo");
  if(upload)upload.addEventListener("change",event=>{
    const file=event.target.files&&event.target.files[0];
    if(!file)return;
    if(!file.type.startsWith("image/")){toast("Please choose an image file.");return;}
    const reader=new FileReader();
    reader.onload=()=>{
      overlayLogoDraftDataUrl=String(reader.result||"");
      const select=document.getElementById("ovLogoMode");if(select)select.value="custom";
      const showLogo=document.getElementById("ovLogo");if(showLogo)showLogo.checked=true;
      scheduleOverlayPreview0890(0);scheduleOverlayAutoSave0944(120);toast("Custom overlay logo loaded and saved.");
    };
    reader.readAsDataURL(file);
  });
  document.getElementById("ovUseFireVault")?.addEventListener("click",()=>{const select=document.getElementById("ovLogoMode");if(select)select.value="firevault";scheduleOverlayPreview0890(0);scheduleOverlayAutoSave0944(120);});
  document.getElementById("ovClearCustomLogo")?.addEventListener("click",()=>{
    overlayLogoDraftDataUrl="";const upload=document.getElementById("ovCustomLogo");if(upload)upload.value="";
    const select=document.getElementById("ovLogoMode");if(select&&select.value==="custom")select.value="firevault";
    scheduleOverlayPreview0890(0);scheduleOverlayAutoSave0944(120);toast("Custom overlay logo cleared.");
  });
  updateOverlayPreview510();
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
    ["Field Dashboard","Notes Today opens the Daily Report, Open Tasks shows current follow-ups, Copy Summary copies the day summary, and Account Directory opens the full customer list."],
    ["Pinned Sites","Pin frequently used or high-priority customer accounts for one-tap access from Today."]
  ]},
  {id:"sites",title:"Customer Database",icon:"▦",status:"Current",summary:"Create, find, edit, and organize customer accounts.",topics:[
    ["Create a site","Open Sites and tap the add control. Enter the customer name, complete address, panel information, notes, and any available GPS coordinates, then save."],
    ["Open and edit","Tap an account to open Account Detail. Use Edit for core customer information. Changes are saved to the local vault."],
    ["Contacts","Store customer contacts, roles, phone numbers, email addresses, and access notes under the account."],
    ["GPS","Capture GPS while physically at the site for the best nearby-account results. Location permission and HTTPS are required."],
    ["Search and recent use","FireVault searches multiple account fields, including imported Account Id and monitoring information, and tracks recently opened sites for faster daily access."],
    ["Customer CSV Import","Open Settings → Customer Import, choose a compatible CSV file, review New, Update, Review, and No Change counts, then import ready records. The complete Account Id is the duplicate-safe update key. Shared addresses and repeated names do not merge separate buildings. Flagged rows can be left out until corrected."],
    ["Repeat imports","Reimporting the same source file does not duplicate an exact Account ID. Different Account IDs at the same address—including CLSS IDs with different dash suffixes—remain separate buildings. Changed source fields are updated while visits, photos, notes, tasks, deficiencies, contacts, documents, and other FireVault-created history are preserved."]
  ]},
  {id:"detail",title:"Account Detail",icon:"▤",status:"Current",summary:"Understand every card and action on an individual customer account.",topics:[
    ["Important Site Info","Provides fast access to contact, access, panel, and GPS information. Use it before beginning work."],
    ["Site Brief","Summarizes open tasks, deficiencies, photos, visits, panel information, contact data, access notes, and last activity."],
    ["Activity Timeline","Shows recent visits, photos, documents, tasks, and deficiencies in chronological order."],
    ["Field Card","Use the Field Card for important condensed site information needed during testing or service."],
    ["Quick Actions","Open notes, visits, tasks, deficiencies, contacts, equipment, documents, reports, maps, and service-call tools from the account."],
    ["Collapsible sections","Account Detail cards keep their natural height and may be opened or closed without compressing their contents."]
  ]},
  {id:"workflow",title:"Daily Field Workflow",icon:"✓",status:"Current",summary:"A recommended start-to-finish process for a normal service day.",topics:[
    
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
    ["Storage caution","Photos and scanned pages can increase local browser storage quickly. Standard quality is recommended; use Compact for long documents. Export backups and remove unnecessary duplicates."],
    ["Photo review","Confirm the saved photo, caption, and overlay are readable before leaving the account."]
  ]},
  {id:"nearby",title:"GPS & Nearby Accounts",icon:"⌖",status:"Current",summary:"Use saved coordinates to find, select, and navigate to nearby customer accounts.",topics:[
    ["Nearby Accounts","Open Nearby to compare your phone location with accounts that have valid coordinates."],
    ["Numbered Map","Map markers match the numbered nearby list so accounts are easy to identify."],
    ["Directions","Use Route from an account card or Account Detail to open the selected map provider."],
    ["Location Privacy","FireVault uses phone location only when a location-based action is requested."]
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
  nearbySites:{chapter:"route",label:"Nearby Accounts",suggestions:["GPS permission","Nearby radius","Save coordinates"]},
  siteDetail:{chapter:"detail",label:"Account Detail",suggestions:["Important Site Info","Quick Actions","Activity Timeline"]},
  siteDocs:{chapter:"photos",label:"Photos & Documents",suggestions:["Add a photo","Photo notes","Storage caution"]},
  siteDocForm:{chapter:"photos",label:"Add Photo / Document",suggestions:["Photo categories","Overlay settings","Useful notes"]},
  
  jobMode:{chapter:"notes",label:"Site Notes",suggestions:["Save notes","Templates","Daily Report"]},
  tasks:{chapter:"notes",label:"Task Center",suggestions:["Create tasks","Due dates","Mark complete"]},
  taskForm:{chapter:"notes",label:"Task Editor",suggestions:["Task title","Status","Follow-up notes"]},
  deficiencies:{chapter:"notes",label:"Deficiency Center",suggestions:["Document condition","Create follow-up","Close deficiency"]},
  deficiencyForm:{chapter:"notes",label:"Deficiency Editor",suggestions:["Location","Impact","Recommended correction"]},
  report:{chapter:"reports",label:"Site Report",suggestions:["Report defaults","Email report","Final verification"]},
  dailySummary:{chapter:"reports",label:"Daily Report",suggestions:["Daily summary","Copy report","Email settings"]},
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
    <p class="academyReviewNote067">Manual revision 1.01.3 · Reviewed July 2026. Documentation must be checked with every release.</p>
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
  quick:["🚀","Quick Start Guide","Get FireVault ready for a normal field day.",[["1. Verify the build","Confirm the green build badge shows 1.01.3 before entering production information."],["2. Complete Technician Profile","Enter your name, company, phone, email, and license or employee identification."],["3. Review permissions","Allow location and photo access only when FireVault requests them and the feature is needed."],["4. Create or open a site","Add the customer name, full address, panel details, contacts, access notes, and GPS location."],["5. Document the visit","Record notes, photos, tasks, deficiencies, equipment changes, and a service visit."],["6. Finish and protect the data","Review the report, send or copy the required summary, then export a current backup."]]],
  new:["🆕","What’s New in 1.01.3","A cleaner Account Detail Favorite control with no action, workflow, or data changes.",[["Star-only control","The Favorite label was removed from the top Account Detail control so it cannot wrap on narrow phones."],["Field-ready target","The star remains easy to recognize inside a clear 44px touch target."],["Accessible state","The control reports whether activating it will add or remove the account from favorites and exposes its selected state."],["No new features","Favorite behavior, account actions, Photo Overlay, Settings, workflows, and stored data remain unchanged."]]],
  tips:["🧰","Field Tips","Short practices that improve the usefulness of FireVault records.",[["Write for the next technician","Include the exact panel, circuit, device, location, symptom, test result, and next action instead of relying on memory."],["Photograph context first","Take one wide photo showing the equipment location before close-up terminal, label, or damage photos."],["Separate facts from follow-up","Use notes for what occurred, deficiencies for code or system problems, and tasks for work that still needs completion."],["Confirm the account","Before using Quick Capture, verify the selected customer site to prevent records from being stored under the wrong account."],["Back up before updates","Download an external backup before a major update or device change and after completing significant field documentation."]]],
  revisions:["📋","Revision History","Application and documentation checkpoints.",[[["1.01.3","Replaces the wrapping Account Detail Favorite label with a compact star-only 44px control while preserving its action and accessible state."],["1.01.2","Polishes Photo Overlay with a clearer step-by-step editor, larger field controls, compact branding, and responsive phone/iPad layouts."],["1.01.1","Polishes Account Detail with larger field-ready actions, clearer account hierarchy, simplified icon tabs, and responsive phone/iPad layouts."],["1.01.0","Simplifies FireVault Settings into six technician-focused areas and hides AppForge factory tools from normal app use."],["1.00.0","Adds the AppForge Generator Engine with deterministic, isolated, installable PWA ZIP packages for all four Product Recipes."],["0.99.0","Adds deterministic AppForge Factory Manifests with generation requests, composed profiles, validation gates, output inventories, requirements, and safety guardrails."],["0.98.0","Adds validated AppForge Product Recipes for FireVault, Wyoming Explorer, Wyoming Fishing Guide, and Ghost Towns Guide with explicit publication requirements."],["0.97.0","Adds a validated AppForge Product Blueprint that packages identity, modules, data, workflows, branding, content, and storage as one portable build definition."],["0.96.0","Adds a profile-driven Sync & Storage Profile for local backends, approved providers, backups, collaboration policy, conflict handling, and credential safeguards."],["0.95.9","Adds profile-driven data sources and content packs, derives Library folders from active packs, and prepares verified versioned catalogs without downloading remote data."],["0.95.8","Adds a profile-driven Theme Profile for brand assets, semantic colors, typography, shape, and mobile browser chrome while preserving FireVault’s dark technician interface."],["0.95.7","Adds profile-defined action surfaces and Quick Photo workflow presets while preserving FireVault's complete technician workflow."],["0.95.6","Adds a profile-defined record schema for account fields, detail sections, and photo categories while keeping FireVault's complete fire-alarm data model active."],["0.95.5","Makes navigation, Account Detail tabs and actions, routes, and Settings respond to the App Profile enabled-module list while preserving all FireVault modules."],["0.95.4","Connects the App Profile terminology layer to live Search, Nearby, Account Detail, account forms, Quick Photo, navigation, and photo-category workflows while preserving FireVault labels and storage."],["0.95.3","Adds a central App Profile, terminology layer, module registry, in-app architecture view, and reusable feature matrix while preserving FireVault workflows and storage."],["0.95.2","Redesigns Account Detail with a compact identity header, four fast actions, reordered tabs, responsive iPad content, and origin-aware Back navigation."],["0.95.1","Rebuilds Account Directory as a compact dark two-line list with a smaller search header, slim filters, dense account rows, and preserved quick actions."],["0.95.0","Adds a bottom-navigation Photo button with current-account capture, overlay preview, account confirmation, automatic image resizing, category memory, and IndexedDB-safe saving."],["0.94.10","Fixes the Account Detail crash caused by an undefined account-context value when opening an account from Nearby Accounts or Search."],["0.94.9","Shows Tech Info as a single Photo Overlay field with its own adjustment options and hides individual technician profile fields from the overlay editor."],["0.94.8","Repairs Technician Overlay Template wrapping and adds group-level left, center, or right alignment with exact preview/export matching."],["0.94.7","Adds a resized technician profile photo and completion-aware collapsible Technician sections that remain open until required information is filled."],["0.94.6","Enlarges Photo Overlay editing controls, adds a reusable Technician Overlay Template under Profile, and replaces the old Technician + Phone shortcut with Technician Info."],["0.94.5","Makes Photo Overlay field rows thinner, adds per-field flush-left/flush-right alignment, and adds a one-tap Technician + Phone flush-right layout."],["0.94.4","Replaces raw Photo Overlay text editing with an auto-saving field builder that supports one-tap add, reordering, line control, and removal without a keyboard confirmation step."],["0.94.3","Maximizes the Photo Overlay Field Photo preview, removes the full detail header, and repairs field insertion and long overlay text rendering."],["0.94.2","Keeps the Photo Overlay Field Photo preview visible while controls scroll, reduces the preview size, and removes the visible sample-photo attribution line."],["0.94.1","Aligned the Nearby bottom navigation with Search and Settings and removed the red active-button underline across all three sections."],["0.94.0","Polished Settings section hierarchy, rebuilt the Account Directory header and search controls, improved active navigation, and standardized active-screen spacing and touch targets."],["0.93.1","Removed the three Settings shortcut buttons and repaired horizontal page overflow so Settings remains locked to vertical scrolling on iPhone and iPad."],["0.93.0","Improved field reliability with a visible splash presentation, unsaved-change protection, duplicate-action prevention, corrected navigation states, keyboard-safe forms, and consistent interaction feedback."],["0.92.0","Introduced a canonical release-facing design system for global chrome, Account Directory, Account Detail, Settings, Nearby, forms, cards, buttons, and responsive iPhone/iPad layouts."],["0.91.1","Rebuilt the three Settings status shortcuts as equal-width responsive controls with clear icons, readable status text, and reliable iPhone/iPad alignment."],["0.91.0","Moved photos and scanned-page payloads from the main localStorage vault into IndexedDB, added storage health and protection controls, preserved complete-media exports, and retained safe legacy migration."],["0.90.0","Core cleanup removed retired scanner capture and service timers, shortened startup, removed the global portrait lock, standardized Account terminology, and added release-safe error recovery."],["0.89.0","Rebuilt Photo Overlay as a compact visual studio with an exact canvas preview, quick presets, reorganized content/layout/branding controls, expanded account fields, and a real fire-alarm deficiency sample photo with attribution."],["0.88.0","Overhauled Settings with sticky search, live status summaries, richer grouped cards, consistent detail screens, and improved iPad layout while preserving every release-critical setting."],["0.87.11","Restored WebDAV Backup to Data & Backup and Settings search while preserving saved connection settings and transfer tools."],["0.87.10","Aligned the four Account Directory card actions across the full card width in Call, Route, Add Note, Favorite order."],["0.87.9","Cleaned up the Account Directory with layered depth, raised controls, dimensional account cards, and category-accented shading while preserving fluid scrolling."],["0.87.8","Improved Account Directory scrolling performance and added iPad portrait, landscape, and split-view layout refinements."],["0.87.4","Added spacing and search to Settings, removed the Field category, moved Google Plus Codes under Maps & GPS, enlarged Account ID/category tags, moved Favorite beside Call, removed empty panel/contact text, and restored Nearby-style card scroll locking."],["0.87.3","Moved account addresses below site names, placed Account ID and category tags beneath the address, and changed Settings to a dark grouped-list design without a duplicate logo."],["0.87.2","Polished Account Directory cards and removed the default Ready, No Open Work, and GPS status tags so only actionable issues are shown."],["0.87.1","Rebuilt Account Directory, Search, account cards, and Account Detail from the stable 0.86.1 baseline and removed the layout gap above the bottom navigation."],["0.86.1","Repaired the Settings startup error and standardized the three-button Nearby, Search, and Settings dock across the app."],["0.86.0","Redesigned Settings as a simplified dark tile dashboard and renamed the bottom Accounts navigation button to Search."],["0.85.0","Removed Tools navigation and the Account Detail Visit action, and rebuilt Settings as a simple grouped menu with clean detail screens."],["0.84.0","Refined Nearby map selection with a fixed details overlay, no marker popup, delayed street-level zoom, and direct account-card navigation."],["0.81.0","Prepared FireVault for App Store review by removing the document scanner, Daily Route and time-tracking controls, theme selection, advanced settings, diagnostics access, and excess instructional copy while preserving account data."]],["0.80.3","Defaulted new Tools scanner documents to the closest GPS-ready account with visible distance, accuracy, retry, and manual override."],["0.80.2","Simplified Document Scanner, added on-device AI Auto Scan with live corner framing and hands-free capture, and repaired mobile keyboard field visibility."],["0.80.1","Moved Document Scanner to Tools, added post-capture account search and matching, and added scanner access inside the full Site Notes workspace."],["0.80.0","Added an account-specific multi-page camera document scanner with automatic edge detection, manual corner correction, rotation, cleanup modes, page ordering, PDF preview/download/share, and account-note activity."],["0.79.14","Restored numbered Nearby Accounts map pins matched to distance-sorted list rows and removed Smart Account Intelligence."],["0.79.13","Repaired startup parsing inherited from 0.79.11 and corrected Building Navigator location-copy syntax."],["0.79.12","Added Building Navigator with exact site locations, GPS/Plus Codes, verification, linked photos, route targets, and timeline events."],["0.79.7","Shortened every Settings summary and removed the colored bar from each Section Overview."],["0.79.6","Added Nearby-style account-list scroll locking so cards settle cleanly at the top while the Accounts controls remain fixed."],["0.79.5","Added separate Personal OneDrive, Work OneDrive, and SharePoint connection profiles with exact photo/document assignments and no-personal-fallback protection."],["0.79.4","Added independent photo and document storage destinations, cloud-provider integration targets, and offline Google Plus Codes for accounts and exact field locations."],["0.79.3","Added backend-neutral provider interfaces for authentication, database, file storage, synchronization, and audit while keeping FireVault fully local."],["0.79.2","Added a unified Security Center with vault integrity validation, backup health, audit filters, device naming, session clearing, and PIN confirmation for sensitive exports, restores, and deletion."],["0.79.1","Added an optional local six-digit privacy lock with PBKDF2 hashing, inactivity/background locking, app-switcher privacy screen, recovery code, cooldown protection, and local lock events."],["0.79.0","Added security-ready schema 4 metadata, stable workspace/user/device identities, local audit history, pending change queue, recoverable deletion, credential-safe exports, and protected restore/reset actions."],["0.67.0","Redesigned Account View around service actions and grouped information, consolidated Settings into five folders, and simplified FireVault Academy and contextual Help for continuous reading."],["0.65.2","Repaired Nearby Accounts with GPS inventory counts, imported-coordinate recovery, persistent permission and timeout messages, a standard-accuracy retry, and nearest-site fallback results."],["0.65.1","Added online latitude/longitude calculation, coordinate validation, geocoding progress, unmatched-address review, optional CSV coordinates, and coordinate-safe repeat importing."],["0.65.0","Added preview-first customer CSV importing, Account Id update matching, validation warnings, imported monitoring details, and sync activity tracking."],["0.64.1","Simplified Academy article headers, removed floating metadata badges, and improved continuous scrolling and readability."],["0.64.0","Added Sync Activity, a conflict review center, export/import audit entries, and an automatic OneDrive connection-readiness checklist."],["0.63.1","Overhauled contextual Help and Academy reader formatting, removed overlapping sticky article headers, and restored full scrolling on phones and tablets."],["0.63.0","Added permanent record IDs, audit metadata, local version tracking, pending-sync states, conflict readiness, device identity, and a Team Sync settings workspace."],["0.60.0","Connected major screens and Settings areas directly to matching Academy chapters with return-to-screen navigation."],["0.59.0","Added interactive tutorials, guided orientation, pinned learning, field tips, and documentation tracking."],["0.58.0","Expanded Help & Manual into FireVault Academy with bookmarks, smart search, Quick Start, and reader navigation."],["0.57.0","Added the first complete searchable in-app FireVault User Manual."],["Ongoing review rule","Any change to navigation, labels, storage, workflows, permissions, or supported layouts requires the related manual chapter to be checked."]]],
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
 {id:"first-setup",icon:"⚙",title:"First-Time Setup",time:"5 min",level:"Beginner",summary:"Configure identity, permissions, reports, email, maps, and backups.",steps:["Open Settings and complete Technician Profile.","Review GPS permissions and choose the nearby-site radius.","Set Report and Email defaults.","Review the Search, Nearby, and Settings navigation.","Export a test backup and confirm the file downloads."]},
 {id:"first-site",icon:"▦",title:"Create Your First Customer",time:"4 min",level:"Beginner",summary:"Create a complete customer account and confirm Account Detail information.",steps:["Open Sites and tap Add Account.","Enter the customer name and complete address.","Add panel, contact, access, and GPS information.","Save and reopen the account.","Review Site Brief and Important Site Info for accuracy."]},
 {id:"visit",icon:"✓",title:"Document a Site Visit",time:"6 min",level:"Beginner",summary:"Record work performed and leave a useful history for the next technician.",steps:["Open the correct customer account.","Review recent activity and open work.","Create a visit and record arrival details.","Add notes, photos, tasks, deficiencies, and equipment updates.","Review the report before ending the visit."]},
 {id:"notes",icon:"✎",title:"Notes, Tasks & Deficiencies",time:"5 min",level:"Beginner",summary:"Choose the correct record type and create actionable documentation.",steps:["Use a note for observations or permanent context.","Use a task for work that must be completed later.","Use a deficiency for an impaired or noncompliant condition.","Add location, device, cause, and recommended action.","Close tasks and deficiencies only after resolution is documented."]},
 {id:"photos",icon:"▧",title:"Use Photos Effectively",time:"4 min",level:"Intermediate",summary:"Capture useful evidence and apply consistent photo overlays.",steps:["Confirm the correct account before taking the photo.","Frame labels, wiring, device location, and surrounding context.","Add a descriptive caption.","Apply the configured overlay when required.","Verify the saved image appears under the correct site."]},
 {id:"email",icon:"✉",title:"Email a Report",time:"5 min",level:"Intermediate",summary:"Prepare recipients, subject, signature, and report content before sending.",steps:["Open Settings → Email and verify defaults.","Open the site report or Daily Report.","Confirm To and CC recipients.","Review subject, signature, and included sections.","Open the device mail composer and verify attachments before sending."]},
 
];
const ACADEMY_TOUR_059=[
 ["Today Dashboard","Your daily starting point for Field Focus, Quick Capture, nearby accounts, and recent work."],
 ["Global Search","Find accounts using customer name, address, panel details, contacts, equipment, or notes."],
 ["Bottom Navigation","Move between Nearby, Accounts, Library, and Settings without losing stored data."],
 ["Sites","Create, search, and open customer accounts. Each account contains its own field history and documentation."],
 ["Account Detail","Review important information, recent activity, photos, visits, tasks, deficiencies, contacts, equipment, and reports."],
 ["Settings","Manage technician information, maps, reports, photo overlays, backups, privacy, Demo Mode, and support."],
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
  try{sessionStorage.removeItem(NEARBY_STATE_KEY_0652);sessionStorage.removeItem(`${NEARBY_STATE_KEY_0652}_demo`);sessionStorage.removeItem("firevault_active_route_day_demo");}catch{}
  location.reload();
}
function wireDemoMode0738(){
  document.getElementById("enterDemoMode0738")?.addEventListener("click",()=>switchDemoMode0738(true,false));
  document.getElementById("exitDemoMode0738")?.addEventListener("click",()=>switchDemoMode0738(false,false));
  document.getElementById("resetDemoMode0738")?.addEventListener("click",()=>{if(!confirm("Discard all temporary demo changes and restore the protected 20-account Boise dataset?"))return;resetDemoData();location.reload();});
}


const WEBDAV_PASSWORD_SESSION_KEY_0757="firevault_webdav_password_0757";
function webdavConfig0757(){
  const cfg=data.settings.webdav||{};
  return {enabled:!!cfg.enabled,url:String(cfg.url||""),username:String(cfg.username||""),folder:String(cfg.folder||"FireVault"),fileName:String(cfg.fileName||"firevault-latest.json"),autoUpload:!!cfg.autoUpload,lastUpload:String(cfg.lastUpload||""),lastDownload:String(cfg.lastDownload||""),lastStatus:String(cfg.lastStatus||"")};
}
function webdavPassword0757(){try{return sessionStorage.getItem(WEBDAV_PASSWORD_SESSION_KEY_0757)||""}catch{return ""}}
function setWebdavPassword0757(value){try{if(value)sessionStorage.setItem(WEBDAV_PASSWORD_SESSION_KEY_0757,value);else sessionStorage.removeItem(WEBDAV_PASSWORD_SESSION_KEY_0757)}catch{}}
function normalizeWebdavUrl0757(cfg,fileOverride=""){
  let base=String(cfg.url||"").trim();
  if(!/^https:\/\//i.test(base)) throw new Error("Use an HTTPS WebDAV server address.");
  base=base.replace(/\/+$/g,"");
  const parts=String(cfg.folder||"").split("/").map(x=>x.trim()).filter(Boolean).map(encodeURIComponent);
  const file=String(fileOverride||cfg.fileName||"firevault-latest.json").trim();
  return [base,...parts,file?encodeURIComponent(file):""].filter(Boolean).join("/");
}
function webdavHeaders0757(cfg,extra={}){
  const password=webdavPassword0757();
  if(!cfg.username||!password) throw new Error("Enter the WebDAV username and app password.");
  let token="";try{token=btoa(unescape(encodeURIComponent(`${cfg.username}:${password}`)))}catch{token=btoa(`${cfg.username}:${password}`)}
  return {Authorization:`Basic ${token}`,...extra};
}
async function webdavBackupPayload0757(){return {app:"FireVault",build:BUILD,exportedAt:new Date().toISOString(),stats:backupSafetyStats552(),credentialsExcluded:true,data:await securitySafeVaultWithMedia0910()};}
async function webdavRequest0757(method,url,headers={},body){
  let response;
  try{response=await fetch(url,{method,headers,body,cache:"no-store",credentials:"omit"});}
  catch(err){throw new Error("WebDAV connection failed. Confirm the server permits CORS access from this FireVault address.");}
  if(!response.ok) throw new Error(`WebDAV returned ${response.status} ${response.statusText||""}`.trim());
  return response;
}
async function ensureWebdavFolders0757(cfg){
  let root=String(cfg.url||"").trim().replace(/\/+$/g,"");
  if(!/^https:\/\//i.test(root)) throw new Error("Use an HTTPS WebDAV server address.");
  const folders=String(cfg.folder||"").split("/").map(x=>x.trim()).filter(Boolean);
  for(const folder of folders){
    root += "/"+encodeURIComponent(folder);
    try{await webdavRequest0757("MKCOL",root,webdavHeaders0757(cfg));}catch(err){if(!/405|301|302|409/.test(String(err.message))) throw err;}
  }
}
function webdavStatus0757(message){const el=document.getElementById("webdavStatus0757");if(el)el.textContent=message;}
async function testWebdav0757(){
  const cfg=collectWebdavInputs0757();const button=document.getElementById("testWebdav0757");setButtonBusy0781(button,true,"Testing…");webdavStatus0757("Testing connection…");
  try{await webdavRequest0757("PROPFIND",String(cfg.url||"").trim().replace(/\/+$/g,"/") ,webdavHeaders0757(cfg,{Depth:"0"}));data.settings.webdav={...cfg,lastStatus:`Connected ${new Date().toLocaleString()}`};saveData(data);webdavStatus0757("Connected successfully.");toast("WebDAV connection successful.","success");}
  catch(err){webdavStatus0757(err.message);toast(err.message,"error");}
  finally{setButtonBusy0781(button,false);}
}
function collectWebdavInputs0757(){
  const current=webdavConfig0757();
  const cfg={...current,enabled:!!document.getElementById("webdavEnabled0757")?.checked,url:document.getElementById("webdavUrl0757")?.value.trim()||"",username:document.getElementById("webdavUser0757")?.value.trim()||"",folder:document.getElementById("webdavFolder0757")?.value.trim()||"FireVault",fileName:document.getElementById("webdavFile0757")?.value.trim()||"firevault-latest.json",autoUpload:!!document.getElementById("webdavAuto0757")?.checked};
  const password=document.getElementById("webdavPassword0757")?.value||"";if(password)setWebdavPassword0757(password);
  return cfg;
}
async function uploadWebdavBackup0757(){
  if(!await securityAuthorizeSensitive0792("upload a full FireVault backup to WebDAV"))return;
  const cfg=collectWebdavInputs0757();const button=document.getElementById("uploadWebdav0757");setButtonBusy0781(button,true,"Uploading…");webdavStatus0757("Preparing secure backup…");
  try{await ensureWebdavFolders0757(cfg);const payload=JSON.stringify(await webdavBackupPayload0757(),null,2);const url=normalizeWebdavUrl0757(cfg);await webdavRequest0757("PUT",url,webdavHeaders0757(cfg,{"Content-Type":"application/json"}),payload);data.settings.webdav={...cfg,lastUpload:new Date().toLocaleString(),lastStatus:"Upload successful"};saveData(data);webdavStatus0757("Backup uploaded successfully.");toast("WebDAV backup uploaded.","success");settings();}
  catch(err){webdavStatus0757(err.message);toast(err.message,"error");}
  finally{setButtonBusy0781(button,false);}
}
async function restoreWebdavBackup0757(){
  if(!await securityAuthorizeSensitive0792("restore a full FireVault backup from WebDAV"))return;
  const cfg=collectWebdavInputs0757();if(!confirmSensitive0790("RESTORE","Download the WebDAV backup and replace the current FireVault vault? A local automatic snapshot will be created first."))return;const button=document.getElementById("restoreWebdav0757");setButtonBusy0781(button,true,"Restoring…");webdavStatus0757("Downloading backup…");
  try{const url=normalizeWebdavUrl0757(cfg);const response=await webdavRequest0757("GET",url,webdavHeaders0757(cfg));const parsed=JSON.parse(await response.text());const incoming=parsed?.data&&Array.isArray(parsed.data.sites)?parsed.data:parsed;if(!incoming||!Array.isArray(incoming.sites))throw new Error("The WebDAV file is not a valid FireVault backup.");Object.assign(data,incoming);data.settings=data.settings||{};data.settings.webdav={...cfg,lastDownload:new Date().toLocaleString(),lastStatus:"Restore successful"};recordSecurityEvent(data,"webdav-restored",{source:"WebDAV",fileName:cfg.fileName||"firevault-latest.json"});data=loadData();webdavStatus0757("Backup restored. Reloading…");toast("WebDAV backup restored.","success");setTimeout(()=>route("home"),400);}
  catch(err){webdavStatus0757(err.message);toast(err.message,"error");}
  finally{setButtonBusy0781(button,false);}
}
function webdavPanel0757(){
  const cfg=webdavConfig0757();
  return `<div class="settingsStack settingsStack540 webdavStack0757">
    ${settingsSection540("Optional remote backup","WebDAV","Connect FireVault to a compatible HTTPS WebDAV service. This is an optional manual backup and restore module; your local vault remains the working database.",`<div class="settingsList settingsToggleList540">${checkBlock("webdavEnabled0757","Enable WebDAV controls",cfg.enabled)}</div><div class="settingsGrid settingsGrid540">${fieldBlock("Server URL",`<input id="webdavUrl0757" inputmode="url" placeholder="https://cloud.example.com/remote.php/dav/files/name" value="${esc(cfg.url)}">`,`The server must allow HTTPS and CORS requests from FireVault.`)}${fieldBlock("Username",`<input id="webdavUser0757" autocomplete="username" value="${esc(cfg.username)}">`)}${fieldBlock("App password",`<input id="webdavPassword0757" type="password" autocomplete="current-password" placeholder="Stored only for this app session">`,`For safety, FireVault does not save the password in the vault.`)}${fieldBlock("Remote folder",`<input id="webdavFolder0757" value="${esc(cfg.folder)}">`)}${fieldBlock("Backup filename",`<input id="webdavFile0757" value="${esc(cfg.fileName)}">`)}</div><div class="settingsList settingsToggleList540">${checkBlock("webdavAuto0757","Upload after manual backup exports",cfg.autoUpload)}</div>`,"blue",`<button class="primary saveMini" id="saveWebdav0757">Save</button>`)}
    ${settingsSection540("Connection & transfer","WebDAV Actions","Test access before uploading. Restore replaces the current local vault only after confirmation.",`<div class="webdavActions0757"><button class="ghost" id="testWebdav0757">Test Connection</button><button class="primary" id="uploadWebdav0757">Upload Backup</button><button class="ghost" id="restoreWebdav0757">Restore from Server</button></div><div class="settingsInfo540"><strong>Status</strong><span id="webdavStatus0757">${esc(cfg.lastStatus||"Not tested")}</span></div><div class="webdavHistory0757"><div><span>Last upload</span><strong>${esc(cfg.lastUpload||"Never")}</strong></div><div><span>Last restore</span><strong>${esc(cfg.lastDownload||"Never")}</strong></div></div>`,"cyan")}
    <div class="settingsInfo540 warning"><strong>Compatibility note</strong><span>Some WebDAV providers block browser requests through CORS. If the connection test fails even with correct credentials, the server must be configured to allow requests from your FireVault GitHub Pages address.</span></div>
  </div>`;
}
function wireWebdav0757(){
  document.getElementById("saveWebdav0757")?.addEventListener("click",()=>{data.settings.webdav=collectWebdavInputs0757();saveData(data);data=loadData();toast("WebDAV settings saved.");settings();});
  document.getElementById("testWebdav0757")?.addEventListener("click",testWebdav0757);
  document.getElementById("uploadWebdav0757")?.addEventListener("click",uploadWebdavBackup0757);
  document.getElementById("restoreWebdav0757")?.addEventListener("click",restoreWebdavBackup0757);
}


function cleanSecurityVault0790(source){
  const copy=JSON.parse(JSON.stringify(source));
  const clean=(value)=>{
    if(Array.isArray(value)){value.forEach(clean);return;}
    if(!value||typeof value!=="object")return;
    Object.keys(value).forEach(key=>{
      if(/password|secret|token|credential/i.test(key)){delete value[key];return;}
      clean(value[key]);
    });
  };
  clean(copy);
  copy.exportMetadata={build:BUILD,exportedAt:new Date().toISOString(),credentialsExcluded:true,securitySchema:Number(copy.securityFoundation?.schemaVersion||0),mediaIncluded:true,mediaBackend:"indexeddb"};
  return copy;
}
function securitySafeVault0790(){return cleanSecurityVault0790(data);}
async function securitySafeVaultWithMedia0910(){
  await flushMediaWrites();
  return cleanSecurityVault0790(await prepareVaultWithMedia(data));
}
function confirmSensitive0790(phrase,message){
  const entered=prompt(`${message}\n\nType ${phrase} to continue.`);
  return String(entered||"").trim().toUpperCase()===String(phrase).toUpperCase();
}


function privacyDate0791(value){if(!value)return "Not recorded";try{return new Date(value).toLocaleString();}catch{return String(value);}}
function privacyLockPanel0791(){
  const config=privacyConfig0791(); const events=privacyEvents0791().slice(0,10);
  if(!config)return `<div class="settingsStack privacySettings0791">
    ${settingsSection540("Device privacy","Local Privacy Lock","Add a six-digit PIN to reduce casual access when FireVault is left open on this iPhone. The PIN and recovery code are stored only as one-way hashes outside the FireVault vault.",`
      <div class="privacySetupGrid0791">
        ${fieldBlock("New 6-digit PIN",`<input id="privacyNewPin0791" type="password" inputmode="numeric" autocomplete="new-password" maxlength="6" pattern="[0-9]*" placeholder="••••••">`,`Use six digits you can remember.`)}
        ${fieldBlock("Confirm PIN",`<input id="privacyConfirmPin0791" type="password" inputmode="numeric" autocomplete="new-password" maxlength="6" pattern="[0-9]*" placeholder="••••••">`)}
        ${fieldBlock("Auto-lock",`<select id="privacyTimeout0791"><option value="1">After 1 minute</option><option value="5" selected>After 5 minutes</option><option value="15">After 15 minutes</option><option value="30">After 30 minutes</option><option value="0">Never from inactivity</option></select>`)}
      </div>
      <div class="settingsList privacyToggleList0791">${checkBlock("privacyBackground0791","Lock whenever FireVault leaves the foreground",true)}${checkBlock("privacyScreen0791","Hide account information in the app switcher when possible",true)}</div>
      <div class="privacyActions0791"><button class="primary" id="enablePrivacy0791">Enable Local Lock</button></div>
    `,"blue")}
    <div class="settingsInfo540 warning"><strong>Local protection—not account login</strong><span>This feature does not encrypt the vault or replace signup, passkeys, 2FA, user roles, or server authorization. Those require the future FireVault backend.</span></div>
  </div>`;
  return `<div class="settingsStack privacySettings0791">
    ${settingsSection540("Protection active","Local Privacy Lock",`Enabled ${privacyDate0791(config.updatedAt)}. A PIN is required after a manual lock, configured inactivity period, or background lock.`,`
      <div class="privacyStatus0791"><span>✓</span><div><strong>Local lock is enabled</strong><small>${config.lockOnBackground?"Locks when FireVault leaves the foreground":"Background locking is off"} · ${Number(config.autoLockMinutes||0)?`Auto-lock after ${Number(config.autoLockMinutes)} minute${Number(config.autoLockMinutes)===1?"":"s"}`:"Inactivity auto-lock is off"}</small></div></div>
      <div class="privacyActions0791"><button class="primary" id="lockNow0791">Lock Now</button></div>
    `,"green")}
    ${settingsSection540("Lock behavior","Timeout & Privacy Screen","These preferences apply only on this installed FireVault PWA.",`
      <div class="settingsGrid">${fieldBlock("Auto-lock",`<select id="privacyTimeout0791"><option value="1" ${Number(config.autoLockMinutes)===1?"selected":""}>After 1 minute</option><option value="5" ${Number(config.autoLockMinutes)===5?"selected":""}>After 5 minutes</option><option value="15" ${Number(config.autoLockMinutes)===15?"selected":""}>After 15 minutes</option><option value="30" ${Number(config.autoLockMinutes)===30?"selected":""}>After 30 minutes</option><option value="0" ${!Number(config.autoLockMinutes)?"selected":""}>Never from inactivity</option></select>`)}</div>
      <div class="settingsList privacyToggleList0791">${checkBlock("privacyBackground0791","Lock whenever FireVault leaves the foreground",config.lockOnBackground!==false)}${checkBlock("privacyScreen0791","Hide account information in the app switcher when possible",config.privacyScreen!==false)}</div>
      <div class="privacyActions0791"><button class="primary" id="savePrivacyBehavior0791">Save Lock Behavior</button></div>
    `,"cyan")}
    ${settingsSection540("Credentials","Change PIN or Recovery Code","Changing the PIN creates a new one-time recovery code. The current PIN is required.",`
      <div class="privacySetupGrid0791">${fieldBlock("Current PIN",`<input id="privacyCurrentPin0791" type="password" inputmode="numeric" maxlength="6" pattern="[0-9]*" placeholder="••••••">`)}${fieldBlock("New PIN",`<input id="privacyNewPin0791" type="password" inputmode="numeric" maxlength="6" pattern="[0-9]*" placeholder="••••••">`)}${fieldBlock("Confirm new PIN",`<input id="privacyConfirmPin0791" type="password" inputmode="numeric" maxlength="6" pattern="[0-9]*" placeholder="••••••">`)}</div>
      <div class="privacyActions0791"><button class="primary" id="changePrivacyPin0791">Change PIN</button><button class="ghost" id="regeneratePrivacyRecovery0791">New Recovery Code</button><button class="danger" id="disablePrivacy0791">Disable Local Lock</button></div>
    `,"amber")}
    ${settingsSection540("Recent activity","Local Lock Events","This small event list is stored outside the account vault and never includes the PIN or recovery code.",`
      <div class="privacyEventList0791">${events.length?events.map(row=>`<div><span>${esc(privacyEventLabel0791(row.type))}</span><strong>${esc(privacyDate0791(row.at))}</strong>${row.detail?`<small>${esc(row.detail)}</small>`:""}</div>`).join(""):`<div class="securityEmpty0790"><strong>No privacy events yet</strong><span>Lock and unlock activity will appear here.</span></div>`}</div>
    `,"slate")}
    <div class="settingsInfo540 warning"><strong>Not a replacement for login or encryption</strong><span>The local lock helps with casual device access. Real multi-user security will still require backend authentication, passkeys or 2FA, roles, encrypted transport, and server authorization.</span></div>
  </div>`;
}
function privacyPinInputs0791(){document.querySelectorAll('#privacyNewPin0791,#privacyConfirmPin0791,#privacyCurrentPin0791').forEach(input=>input.addEventListener('input',()=>input.value=privacyNormalizeDigits0791(input.value,6)));}
async function privacyCurrentPinValid0791(){const input=document.getElementById('privacyCurrentPin0791');if(!input||privacyNormalizeDigits0791(input.value,6).length!==6){toast('Enter the current 6-digit PIN.','error');input?.focus();return false;}try{const ok=await privacyVerifyPin0791(input.value);if(!ok){toast('Current PIN was not recognized.','error');input.value='';input.focus();return false;}return true;}catch(err){toast(err?.message||'PIN verification failed.','error');return false;}}
function wirePrivacyLock0791(){
  privacyPinInputs0791();
  document.getElementById('enablePrivacy0791')?.addEventListener('click',async()=>{
    const pin=privacyNormalizeDigits0791(document.getElementById('privacyNewPin0791')?.value,6),confirmPin=privacyNormalizeDigits0791(document.getElementById('privacyConfirmPin0791')?.value,6);
    if(pin.length!==6){toast('Enter a 6-digit PIN.','error');return;}if(pin!==confirmPin){toast('PIN confirmation does not match.','error');return;}
    const button=document.getElementById('enablePrivacy0791');button.disabled=true;button.classList.add('isBusy0781');
    try{const result=await privacyCreateConfig0791(pin,{autoLockMinutes:Number(document.getElementById('privacyTimeout0791')?.value||5),lockOnBackground:document.getElementById('privacyBackground0791')?.checked!==false,privacyScreen:document.getElementById('privacyScreen0791')?.checked!==false});if(!privacyWriteConfig0791(result.config))throw new Error('iPhone storage did not accept the privacy settings.');privacySetSessionUnlocked0791(true);privacyHideContent0791(false);privacyLog0791('enabled','Local PIN created');try{recordSecurityEvent(data,'privacy-lock-enabled',{autoLockMinutes:result.config.autoLockMinutes,lockOnBackground:result.config.lockOnBackground});data=loadData();}catch{}privacyResetTimer0791();privacyShowRecoveryCode0791(result.recovery);toast('Local Privacy Lock enabled.','success');settings();}catch(err){toast(err?.message||'Local lock could not be enabled.','error');}finally{button.disabled=false;button.classList.remove('isBusy0781');}
  });
  document.getElementById('savePrivacyBehavior0791')?.addEventListener('click',()=>{const config=privacyConfig0791();if(!config)return;config.autoLockMinutes=Number(document.getElementById('privacyTimeout0791')?.value||0);config.lockOnBackground=document.getElementById('privacyBackground0791')?.checked!==false;config.privacyScreen=document.getElementById('privacyScreen0791')?.checked!==false;config.updatedAt=new Date().toISOString();if(!privacyWriteConfig0791(config)){toast('Lock preferences could not be saved.','error');return;}privacyLog0791('changed','Lock behavior updated');privacyResetTimer0791();toast('Lock behavior saved.','success');settings();});
  document.getElementById('lockNow0791')?.addEventListener('click',()=>privacyLockNow0791('manual'));
  document.getElementById('changePrivacyPin0791')?.addEventListener('click',async()=>{if(!await privacyCurrentPinValid0791())return;const pin=privacyNormalizeDigits0791(document.getElementById('privacyNewPin0791')?.value,6),confirmPin=privacyNormalizeDigits0791(document.getElementById('privacyConfirmPin0791')?.value,6);if(pin.length!==6){toast('Enter a new 6-digit PIN.','error');return;}if(pin!==confirmPin){toast('New PIN confirmation does not match.','error');return;}try{const old=privacyConfig0791();const result=await privacyCreateConfig0791(pin,old||{});if(!privacyWriteConfig0791(result.config))throw new Error('Privacy settings could not be saved.');privacyLog0791('changed','PIN and recovery code changed');try{recordSecurityEvent(data,'privacy-lock-pin-changed',{});data=loadData();}catch{}privacyShowRecoveryCode0791(result.recovery);toast('PIN changed. Save the new recovery code.','success');settings();}catch(err){toast(err?.message||'PIN could not be changed.','error');}});
  document.getElementById('regeneratePrivacyRecovery0791')?.addEventListener('click',async()=>{if(!await privacyCurrentPinValid0791())return;try{const config=privacyConfig0791(),recovery=privacyRandomRecovery0791(),salt=privacyBytesToBase640791(privacyRandomBytes0791());config.recoverySalt=salt;config.recoveryHash=await privacyHash0791(privacyNormalizeDigits0791(recovery,12),salt,config.iterations);config.updatedAt=new Date().toISOString();if(!privacyWriteConfig0791(config))throw new Error('Privacy settings could not be saved.');privacyLog0791('recoveryRegenerated','New recovery code created');privacyShowRecoveryCode0791(recovery);toast('New recovery code created.','success');}catch(err){toast(err?.message||'Recovery code could not be created.','error');}});
  document.getElementById('disablePrivacy0791')?.addEventListener('click',async()=>{if(!await privacyCurrentPinValid0791())return;if(!confirm('Disable Local Privacy Lock on this FireVault installation?'))return;try{localStorage.removeItem(PRIVACY_LOCK_KEY_0791);sessionStorage.removeItem(PRIVACY_UNLOCKED_KEY_0791);privacyClearCooldown0791();privacyHideContent0791(false);privacyLog0791('disabled','Local lock removed');try{recordSecurityEvent(data,'privacy-lock-disabled',{});data=loadData();}catch{}clearTimeout(privacyTimer0791);toast('Local Privacy Lock disabled.','success');settings();}catch(err){toast(err?.message||'Local lock could not be disabled.','error');}});
}

function securityDate0790(value){
  if(!value)return "Not recorded";
  try{return new Date(value).toLocaleString();}catch{return String(value);}
}
function securityAuditGroup0792(type=""){
  if(/backup|webdav|package|export|import/i.test(type))return "backup";
  if(/deleted|restored|recycle/i.test(type))return "deletion";
  if(/privacy|security|integrity|device|session/i.test(type))return "security";
  return "changes";
}
async function securityAuthorizeSensitive0792(action){
  const config=privacyConfig0791();
  if(!config)return true;
  const entered=prompt(`Local Privacy Lock is enabled.\n\nEnter your 6-digit PIN to ${action}.`);
  if(entered===null)return false;
  try{
    const ok=await privacyVerifyPin0791(privacyNormalizeDigits0791(entered,6));
    if(!ok){privacyLog0791("failed",`Sensitive action denied: ${action}`);toast("PIN not recognized.","error");return false;}
    privacyLog0791("authorized",action);
    return true;
  }catch(err){toast(err?.message||"PIN verification failed.","error");return false;}
}
function securityBackupState0792(){
  const auto=autoBackupInfo();
  const lastExport=fvSafeGet0739("firevault_last_backup_export","")||"";
  const webdav=data.settings?.webdav||{};
  const external=lastExport||webdav.lastUpload||"";
  return {auto,lastExport,webdav,external,status:external?"external":auto.count?"local":"none"};
}
function securityFoundationPanel0790(){
  const summary=securityFoundationSummary(data);
  const integrity=validateVaultIntegrity(data);
  const storedIntegrity=summary?.lastIntegrityCheck0792||data.securityFoundation?.lastIntegrityCheck0792||null;
  const shownIntegrity=storedIntegrity||integrity;
  const backup=securityBackupState0792();
  const recycle=recycleBinInfo(data);
  const privacy=privacyConfig0791();
  const rawAudit=securityAudit(data);
  const query=securityAuditSearch0792.trim().toLowerCase();
  const audit=rawAudit.filter(row=>{
    const group=securityAuditGroup0792(row.type);
    const groupOk=securityAuditFilter0792==="all"||securityAuditFilter0792===group;
    const text=[row.type,row.title,row.recordType,row.user,row.siteName,row.details].map(v=>typeof v==="object"?JSON.stringify(v):String(v||"")).join(" ").toLowerCase();
    return groupOk&&(!query||text.includes(query));
  }).slice(0,30);
  const auditLabels={
    "security-foundation-migrated":"Security foundation created","record-created":"Record created","record-updated":"Record updated","record-deleted":"Record moved to recycle bin","record-restored":"Deleted record restored","recycle-bin-purged":"Recycle bin emptied","backup-exported":"External backup exported","backup-imported":"External backup restored","webdav-restored":"WebDAV backup restored","bulk-change-summary":"Bulk change recorded","privacy-lock-enabled":"Local privacy lock enabled","privacy-lock-disabled":"Local privacy lock disabled","privacy-lock-pin-changed":"Local privacy PIN changed","vault-integrity-checked":"Vault integrity checked","backup-snapshot-verified":"Backup snapshot verified","device-renamed":"Device renamed","local-session-cleared":"Local session cleared"
  };
  const protectionChecks=[
    Number(summary.schemaVersion)===4,
    shownIntegrity.status!=="critical",
    backup.auto.count>0,
    !!backup.external,
    !!privacy
  ];
  const protectionScore=protectionChecks.filter(Boolean).length;
  const centerStatus=shownIntegrity.status==="critical"?"Action required":protectionScore>=4?"Protected":"Review recommended";
  const integrityTone=shownIntegrity.status==="healthy"?"green":shownIntegrity.status==="warning"?"amber":"red";
  const backupLabel=backup.status==="external"?"External backup recorded":backup.status==="local"?"Local snapshots only":"No backup recorded";
  const issueRows=[...(shownIntegrity.errors||[]).map(text=>({tone:"error",text})),...(shownIntegrity.warnings||[]).map(text=>({tone:"warning",text}))].slice(0,12);
  return `<div class="settingsStack securityCenter0792">
    ${settingsSection540("Protection overview","Security Center","One place to review local privacy, vault health, backup readiness, device identity, deleted records, and audit activity.",`
      <div class="securityHero0792"><div><span class="securityHeroIcon0792">${shownIntegrity.status==="critical"?"!":"✓"}</span><div><strong>${esc(centerStatus)}</strong><small>${protectionScore} of 5 local protection checks are active</small></div></div><span class="securityHeroPill0792 ${shownIntegrity.status}">${esc(shownIntegrity.status)}</span></div>
      <div class="securityDashboard0792">
        <button type="button" class="securityDashCard0792 ${privacy?"good":"warn"}" data-open-security0792="privacy"><span>Privacy Lock</span><strong>${privacy?"Enabled":"Off"}</strong><small>${privacy?(Number(privacy.autoLockMinutes||0)?`Auto-lock ${Number(privacy.autoLockMinutes)} min`:`Inactivity lock off`):`Add a local PIN`}</small></button>
        <button type="button" class="securityDashCard0792 ${integrityTone}" data-security-scroll0792="integrity"><span>Vault Integrity</span><strong>${esc(shownIntegrity.status)}</strong><small>${shownIntegrity.errorCount||0} errors · ${shownIntegrity.warningCount||0} warnings</small></button>
        <button type="button" class="securityDashCard0792 ${backup.status==="external"?"good":backup.status==="local"?"warn":"bad"}" data-security-scroll0792="backup"><span>Backup Health</span><strong>${esc(backupLabel)}</strong><small>${backup.auto.count} local snapshot${backup.auto.count===1?"":"s"}</small></button>
        <button type="button" class="securityDashCard0792" data-security-scroll0792="identity"><span>Device</span><strong>${esc(summary.device.label||"This device")}</strong><small>${Number(summary.pendingChanges||0)} pending change${Number(summary.pendingChanges||0)===1?"":"s"}</small></button>
      </div>
    `,"green")}
    <div id="securityIntegrity0792"></div>
    ${settingsSection540("Database safety","Vault Integrity",`Last checked ${esc(securityDate0790(shownIntegrity.checkedAt))}. FireVault checks record IDs, account collections, security metadata, GPS values, audit storage, and recycle-bin structure.`,`
      <div class="securityIntegrityStatus0792 ${shownIntegrity.status}"><div><strong>${shownIntegrity.status==="healthy"?"Vault checks passed":shownIntegrity.status==="warning"?"Vault is usable with warnings":"Vault needs attention"}</strong><span>${Number(shownIntegrity.siteCount||0)} accounts · ${Number(shownIntegrity.recordCount||0)} tracked records</span></div><b>${Number(shownIntegrity.errorCount||0)} / ${Number(shownIntegrity.warningCount||0)}</b></div>
      <div class="securityIssueList0792">${issueRows.length?issueRows.map(item=>`<div class="${item.tone}"><span>${item.tone==="error"?"!":"•"}</span><p>${esc(item.text)}</p></div>`).join(""):`<div class="securityEmpty0790"><strong>No integrity issues found</strong><span>The current vault structure and security metadata are valid.</span></div>`}</div>
      <div class="securityActions0790"><button class="primary" id="runIntegrity0792">Run Integrity Check</button><button class="ghost" id="downloadIntegrity0792">Download Report</button></div>
    `,integrityTone)}
    <div id="securityBackup0792"></div>
    ${settingsSection540("Recovery readiness","Backup Health","Local snapshots help recover from edits, but an external downloaded or WebDAV copy is required before deleting or reinstalling the Home Screen app.",`
      <div class="securityBackupGrid0792"><div><span>Automatic snapshots</span><strong>${backup.auto.count}</strong><small>${backup.auto.last?.createdAt?esc(securityDate0790(backup.auto.last.createdAt)):"None available"}</small></div><div><span>Last downloaded export</span><strong>${backup.lastExport?"Recorded":"Not recorded"}</strong><small>${esc(backup.lastExport||"Use Backup → Export Backup")}</small></div><div><span>Last WebDAV upload</span><strong>${backup.webdav.lastUpload?"Recorded":"Not recorded"}</strong><small>${esc(backup.webdav.lastUpload||"WebDAV upload has not completed")}</small></div></div>
      <div class="securityActions0790"><button class="primary" id="verifySnapshot0792" ${backup.auto.count?"":"disabled"}>Verify Latest Snapshot</button><button class="ghost" id="downloadSnapshot0792" ${backup.auto.count?"":"disabled"}>Download Latest</button><button class="ghost" id="openBackup0792">Open Backup Center</button></div>
    `,backup.status==="external"?"green":backup.status==="local"?"amber":"red")}
    <div id="securityIdentity0792"></div>
    ${settingsSection540("Local identity","Workspace & Device","These stable IDs will support future login, roles, device approval, and server-enforced permissions.",`
      <div class="securityIdentityGrid0790"><div><span>Workspace ID</span><code>${esc(summary.workspaceId)}</code></div><div><span>Local user</span><strong>${esc(summary.user.displayName||"Local FireVault User")}</strong><code>${esc(summary.user.id)}</code></div><div><span>Device ID</span><code>${esc(summary.device.id)}</code></div><div><span>Last seen</span><strong>${esc(securityDate0790(summary.device.lastSeenAt))}</strong></div></div>
      <div class="securityDeviceRename0792"><label><span>Device name</span><input id="securityDeviceName0792" maxlength="40" value="${esc(summary.device.label||"This FireVault device")}" placeholder="David's iPhone"></label><button class="primary" id="saveDeviceName0792">Save Name</button></div>
      <div class="securityActions0790"><button class="ghost" id="copySecurityIds0790">Copy Identity Summary</button><button class="danger" id="clearLocalSession0792">Clear Session & Lock</button></div>
    `,"blue")}
    ${settingsSection540("Recoverable deletion","Recycle Bin",recycle.count?`${recycle.count} deleted record${recycle.count===1?" is":"s are"} retained locally for up to 30 days.`:"No deleted records are waiting for recovery.",`
      <div class="securityRecycle0790">${recycle.items.length?recycle.items.slice(0,10).map(item=>`<article><div><strong>${esc(item.title||item.recordType)}</strong><span>${esc(item.siteName||item.recordType)} · ${esc(securityDate0790(item.deletedAt))}</span>${item.attachmentsOmitted?`<small>Large attachment data was omitted to protect device storage.</small>`:""}</div><button class="ghost" data-restore-deleted0790="${esc(item.id)}">Restore</button></article>`).join(""):`<div class="securityEmpty0790"><strong>Recycle bin is empty</strong><span>Future deletions will be retained here before permanent removal.</span></div>`}</div>
      ${recycle.count?`<div class="securityActions0790"><button class="danger" id="purgeRecycle0790">Empty Recycle Bin</button></div>`:""}
    `,"amber")}
    ${settingsSection540("Accountability","Audit Viewer","Filter local changes, security events, backup activity, and deletion history. The audit is capped to protect iPhone storage.",`
      <div class="securityAuditControls0792"><select id="securityAuditFilter0792"><option value="all" ${securityAuditFilter0792==="all"?"selected":""}>All activity</option><option value="changes" ${securityAuditFilter0792==="changes"?"selected":""}>Record changes</option><option value="security" ${securityAuditFilter0792==="security"?"selected":""}>Security events</option><option value="backup" ${securityAuditFilter0792==="backup"?"selected":""}>Backup & transfer</option><option value="deletion" ${securityAuditFilter0792==="deletion"?"selected":""}>Deletion & restore</option></select><input id="securityAuditSearch0792" value="${esc(securityAuditSearch0792)}" placeholder="Search audit history"></div>
      <div class="securityAudit0790">${audit.length?audit.map(row=>`<div><span>${esc(auditLabels[row.type]||row.type)}</span><strong>${esc(row.title||row.recordType||row.user||"")}</strong><small>${esc(securityDate0790(row.at))} · ${esc(row.user||summary.user.displayName||"Local user")}</small></div>`).join(""):`<div class="securityEmpty0790"><strong>No matching audit events</strong><span>Change the filter or search text to see more activity.</span></div>`}</div>
      <div class="securityActions0790"><button class="primary" id="downloadSecurityAudit0790">Download Audit Log</button><button class="ghost" id="clearAuditFilters0792">Clear Filters</button></div>
    `,"slate")}
    <div class="settingsInfo540 warning"><strong>Local security foundation</strong><span>This center protects and audits the device-local vault. Real signup, passkeys, 2FA, roles, encrypted cloud storage, and server authorization still require the future FireVault backend.</span></div>
  </div>`;
}
function wireSecurityFoundation0790(){
  document.querySelectorAll("[data-open-security0792]").forEach(button=>button.addEventListener("click",()=>{settingsTab=button.dataset.openSecurity0792;mode="settingsDetail";settings();}));
  document.querySelectorAll("[data-security-scroll0792]").forEach(button=>button.addEventListener("click",()=>document.getElementById(`security${button.dataset.securityScroll0792[0].toUpperCase()+button.dataset.securityScroll0792.slice(1)}0792`)?.scrollIntoView({behavior:"smooth",block:"start"})));
  document.getElementById("copySecurityIds0790")?.addEventListener("click",async()=>{
    const s=securityFoundationSummary(data);
    const text=`FireVault Security Center\nWorkspace: ${s.workspaceId}\nUser: ${s.user.displayName} (${s.user.id})\nRole: ${s.user.role}\nDevice: ${s.device.label} (${s.device.id})\nSchema: ${s.schemaVersion}`;
    try{await navigator.clipboard.writeText(text);toast("Security identity copied.","success");}catch{toast("Clipboard unavailable.","error");}
  });
  document.getElementById("runIntegrity0792")?.addEventListener("click",()=>{
    const result=validateVaultIntegrity(data);
    data.securityFoundation.lastIntegrityCheck0792=result;
    recordSecurityEvent(data,"vault-integrity-checked",{status:result.status,errorCount:result.errorCount,warningCount:result.warningCount,recordCount:result.recordCount});
    data=loadData();toast(result.status==="healthy"?"Vault integrity checks passed.":`Integrity check completed with ${result.errorCount} errors and ${result.warningCount} warnings.`,result.status==="critical"?"error":"success");settings();
  });
  document.getElementById("downloadIntegrity0792")?.addEventListener("click",async()=>{
    if(!await securityAuthorizeSensitive0792("download the vault integrity report"))return;
    const result=validateVaultIntegrity(data);
    downloadBlob(`firevault-integrity-${new Date().toISOString().slice(0,10)}.json`,JSON.stringify({format:"firevault-integrity-report",build:BUILD,workspaceId:securityFoundationSummary(data).workspaceId,...result},null,2),"application/json");
    toast("Integrity report downloaded.","success");
  });
  document.getElementById("verifySnapshot0792")?.addEventListener("click",()=>{
    try{const snapshot=latestAutoBackup();if(!snapshot?.data||!Array.isArray(snapshot.data.sites))throw new Error("The latest snapshot is not readable.");const result=validateVaultIntegrity(snapshot.data);recordSecurityEvent(data,"backup-snapshot-verified",{createdAt:snapshot.createdAt||"",siteCount:snapshot.data.sites.length,status:result.status});data=loadData();toast(`Latest snapshot verified: ${snapshot.data.sites.length} accounts, ${result.status}.`,result.status==="critical"?"error":"success");settings();}catch(err){toast(err?.message||"Snapshot verification failed.","error");}
  });
  document.getElementById("downloadSnapshot0792")?.addEventListener("click",async()=>{
    if(!await securityAuthorizeSensitive0792("download the latest full backup snapshot"))return;
    const snapshot=latestAutoBackup();if(!snapshot){toast("No automatic snapshot available.","error");return;}const stamp=new Date(snapshot.createdAt||Date.now()).toISOString().slice(0,19).replace(/[:T]/g,"-");downloadBlob(`firevault-auto-backup-${stamp}-build-${snapshot.build||BUILD}.json`,JSON.stringify(snapshot,null,2),"application/json");toast("Latest snapshot downloaded.","success");
  });
  document.getElementById("openBackup0792")?.addEventListener("click",()=>{settingsTab="backup";mode="settingsDetail";settings();});
  document.getElementById("saveDeviceName0792")?.addEventListener("click",()=>{
    const name=String(document.getElementById("securityDeviceName0792")?.value||"").trim().slice(0,40);
    if(!name){toast("Enter a device name.","error");return;}
    const old=data.securityFoundation.device.label||"";data.securityFoundation.device.label=name;recordSecurityEvent(data,"device-renamed",{from:old,to:name});data=loadData();toast("Device name saved.","success");settings();
  });
  document.getElementById("clearLocalSession0792")?.addEventListener("click",async()=>{
    if(!await securityAuthorizeSensitive0792("clear the current FireVault session"))return;
    if(!confirm("Clear temporary navigation, WebDAV password, and unlocked-session state on this device? Account data and settings will remain."))return;
    try{const keys=[];for(let i=0;i<sessionStorage.length;i++){const key=sessionStorage.key(i);if(key&&(/firevault|fv/i.test(key)))keys.push(key);}keys.forEach(key=>sessionStorage.removeItem(key));recordSecurityEvent(data,"local-session-cleared",{keysCleared:keys.length});data=loadData();toast("Local session cleared.","success");if(privacyConfig0791())privacyLockNow0791("manual");else setTimeout(()=>location.reload(),250);}catch(err){toast(err?.message||"Session could not be cleared.","error");}
  });
  document.getElementById("securityAuditFilter0792")?.addEventListener("change",event=>{securityAuditFilter0792=event.target.value||"all";settings();});
  document.getElementById("securityAuditSearch0792")?.addEventListener("change",event=>{securityAuditSearch0792=event.target.value;settings();});
  document.getElementById("clearAuditFilters0792")?.addEventListener("click",()=>{securityAuditFilter0792="all";securityAuditSearch0792="";settings();});
  document.getElementById("downloadSecurityAudit0790")?.addEventListener("click",async()=>{
    if(!await securityAuthorizeSensitive0792("download the security audit"))return;
    const payload={format:"firevault-security-audit",build:BUILD,exportedAt:new Date().toISOString(),foundation:securityFoundationSummary(data),integrity:validateVaultIntegrity(data),audit:securityAudit(data)};
    downloadBlob(`firevault-security-audit-${new Date().toISOString().slice(0,10)}.json`,JSON.stringify(payload,null,2),"application/json");toast("Security audit downloaded.","success");
  });
  document.querySelectorAll("[data-restore-deleted0790]").forEach(button=>button.addEventListener("click",async()=>{
    if(!await securityAuthorizeSensitive0792("restore a deleted record"))return;if(!confirm("Restore this deleted record to FireVault?"))return;
    try{restoreRecycleRecord(data,button.dataset.restoreDeleted0790);data=loadData();toast("Deleted record restored.","success");settings();}catch(err){toast(err?.message||"Restore failed.","error");}
  }));
  document.getElementById("purgeRecycle0790")?.addEventListener("click",async()=>{
    if(!await securityAuthorizeSensitive0792("permanently empty the recycle bin"))return;if(!confirmSensitive0790("EMPTY","Permanently remove every record in the FireVault recycle bin? This cannot be undone."))return;
    try{const count=purgeRecycleBin(data);data=loadData();toast(`${count} deleted record${count===1?"":"s"} permanently removed.`,"success");settings();}catch(err){toast(err?.message||"Recycle bin could not be emptied.","error");}
  });
}


function formatStorageBytes0910(bytes){
  const value=Math.max(0,Number(bytes||0));
  if(value<1024)return `${value} B`;
  if(value<1024*1024)return `${(value/1024).toFixed(value<10240?1:0)} KB`;
  if(value<1024*1024*1024)return `${(value/(1024*1024)).toFixed(value<10*1024*1024?1:0)} MB`;
  return `${(value/(1024*1024*1024)).toFixed(2)} GB`;
}
function mediaStorageMeter0910(){
  const state=mediaStorageState0910||{},quota=Number(state.quota||0),usage=Number(state.usage||0),pct=quota?Math.min(100,Math.max(0,usage/quota*100)):0;
  return `<div class="mediaStorageMeter0910">
    <div class="mediaStorageMetrics0910"><article><span>MEDIA FILES</span><strong id="mediaCount0910">${state.loading?"…":state.count||0}</strong><small id="mediaBreakdown0910">${state.loading?"Measuring local storage":`${state.photos||0} photos · ${state.scanPages||0} scan pages`}</small></article><article><span>MEDIA SIZE</span><strong id="mediaBytes0910">${state.loading?"…":formatStorageBytes0910(state.bytes)}</strong><small>Stored outside the main vault</small></article><article><span>DEVICE STORAGE</span><strong id="mediaUsage0910">${state.loading?"…":formatStorageBytes0910(usage)}</strong><small id="mediaQuota0910">${quota?`${formatStorageBytes0910(quota)} available quota`:"Quota unavailable"}</small></article></div>
    <div class="mediaStorageBar0910"><i id="mediaStorageFill0910" style="width:${pct.toFixed(1)}%"></i></div>
    <div class="mediaStorageStatus0910"><span id="mediaPersisted0910" class="${state.persisted?"ready":"warning"}">${state.persisted?"Protected from automatic browser cleanup":"Standard browser storage"}</span><span id="mediaOrphans0910">${state.orphans?`${state.orphans} unlinked file${state.orphans===1?"":"s"}`:"No unlinked files"}</span></div>
    <div class="mediaStorageActions0910"><button class="primary" id="protectMediaStorage0910">Protect Storage</button><button class="ghost" id="cleanMediaStorage0910" ${state.orphans?"":"disabled"}>Clean Unlinked Files</button><button class="ghost" id="refreshMediaStorage0910">Refresh</button></div>
  </div>`;
}
function applyMediaStorageState0910(){
  const state=mediaStorageState0910||{},quota=Number(state.quota||0),usage=Number(state.usage||0),pct=quota?Math.min(100,Math.max(0,usage/quota*100)):0;
  const set=(id,text)=>{const el=document.getElementById(id);if(el)el.textContent=text;};
  set("mediaCount0910",String(state.count||0));set("mediaBreakdown0910",`${state.photos||0} photos · ${state.scanPages||0} scan pages`);set("mediaBytes0910",formatStorageBytes0910(state.bytes));set("mediaUsage0910",formatStorageBytes0910(usage));set("mediaQuota0910",quota?`${formatStorageBytes0910(quota)} available quota`:"Quota unavailable");set("mediaOrphans0910",state.orphans?`${state.orphans} unlinked file${state.orphans===1?"":"s"}`:"No unlinked files");
  const fill=document.getElementById("mediaStorageFill0910");if(fill)fill.style.width=`${pct.toFixed(1)}%`;
  const persisted=document.getElementById("mediaPersisted0910");if(persisted){persisted.textContent=state.persisted?"Protected from automatic browser cleanup":"Standard browser storage";persisted.className=state.persisted?"ready":"warning";}
  const clean=document.getElementById("cleanMediaStorage0910");if(clean)clean.disabled=!state.orphans;
}
async function refreshMediaStorage0910(){
  try{mediaStorageState0910={...(await mediaStorageSummary(data)),loading:false};applyMediaStorageState0910();}
  catch(err){mediaStorageState0910={...mediaStorageState0910,loading:false,error:String(err?.message||err)};toast("Media storage could not be measured.","error");}
}

function fileStorageProviderLabel0794(id){return FILE_STORAGE_CATALOG[id]?.label||FILE_STORAGE_CATALOG.local.label;}
function profileStorageCatalogProviders0960(){return Object.values(FILE_STORAGE_CATALOG).filter(item=>storageProviderEnabled(APP_PROFILE,item.id));}
function profileFileStorageProviders0960(role){const allowed=new Set(storageRoleProviders(APP_PROFILE,role).map(provider=>provider.id));return Object.values(FILE_STORAGE_CATALOG).filter(item=>allowed.has(item.id));}
function fileStorageTarget0794(kind="document"){
  const cfg=data.settings?.fileStorage||{};
  const target=kind==="photo"?{provider:"local",connectionId:"",folder:"FireVault/Photos",...(cfg.photo||{})}:{provider:"local",connectionId:"",folder:"FireVault/Documents",...(cfg.document||{})};
  const allowed=new Set(storageRoleProviders(APP_PROFILE,kind).map(provider=>provider.id));
  return allowed.has(target.provider)?target:{...target,provider:"local",connectionId:""};
}
function fileStorageOptions0794(selected="local",role="document"){
  return profileFileStorageProviders0960(role).map(item=>`<option value="${esc(item.id)}" ${item.id===selected?"selected":""}>${esc(item.label)}${item.available?"":" — setup required"}</option>`).join("");
}
function fileStorageStatusClass0794(item){return item.ready?"ready":item.provider==="local"?"ready":"planned";}
function cloudFileStoragePanel0794(){
  const cfg=data.settings.fileStorage||{};
  const photo=fileStorageTarget0794("photo"),documentTarget=fileStorageTarget0794("document");
  const profileStorageData={...data,settings:{...data.settings,fileStorage:{...cfg,photo,document:documentTarget}}};
  const plan=fileStoragePlanSummary(profileStorageData);
  const providers=profileStorageCatalogProviders0960();
  return `<div class="settingsStack cloudStorage0794">
    ${settingsSection540("On-device media","Storage Health","FireVault stores photo and scanned-page payloads in IndexedDB instead of duplicating them inside the main account vault. Backups still include the complete media files.",mediaStorageMeter0910(),"green")}
    ${settingsSection540("Independent destinations","Photo & Document Storage","Choose one destination for account photos and a different destination for manuals, drawings, reports, and other documents. FireVault remains local-first until a remote upload is confirmed.",`
      <div class="cloudDestinationGrid0794">
        <article class="cloudDestinationCard0794 photo"><span>PHOTO STORAGE</span><strong>${esc(plan.photo.connectionLabel||fileStorageProviderLabel0794(photo.provider))}</strong><small>${esc(photo.folder||"FireVault/Photos")}</small><em class="${fileStorageStatusClass0794(plan.photo)}">${esc(plan.photo.status)}</em></article>
        <article class="cloudDestinationCard0794 document"><span>DOCUMENT STORAGE</span><strong>${esc(plan.document.connectionLabel||fileStorageProviderLabel0794(documentTarget.provider))}</strong><small>${esc(documentTarget.folder||"FireVault/Documents")}</small><em class="${fileStorageStatusClass0794(plan.document)}">${esc(plan.document.status)}</em></article>
      </div>` ,"blue")}
    ${settingsSection540("Photo destination","Account Photos","New account photos inherit this destination. A technician can still choose a different destination on an individual photo record.",`
      <div class="settingsGrid settingsGrid540">${fieldBlock("Provider",`<select id="photoProvider0794">${fileStorageOptions0794(photo.provider,"photo")}</select>`)}${fieldBlock("Remote folder",`<input id="photoFolder0794" value="${esc(photo.folder||"FireVault/Photos")}" placeholder="FireVault/Photos">`,`Folder is stored as a destination path only; credentials are never stored here.`)}</div>${microsoftConnectionField0795("photo",photo)}
      <div class="settingsInfo540"><strong>${esc(plan.photo.status)}</strong><span>${esc(plan.photo.note)}</span></div>` ,"cyan")}
    ${settingsSection540("Document destination","Documents & Drawings","Use a separate provider or folder for PDFs, panel manuals, reports, drawings, and links.",`
      <div class="settingsGrid settingsGrid540">${fieldBlock("Provider",`<select id="documentProvider0794">${fileStorageOptions0794(documentTarget.provider,"document")}</select>`)}${fieldBlock("Remote folder",`<input id="documentFolder0794" value="${esc(documentTarget.folder||"FireVault/Documents")}" placeholder="FireVault/Documents">`)}</div>${microsoftConnectionField0795("document",documentTarget)}
      <div class="settingsInfo540"><strong>${esc(plan.document.status)}</strong><span>${esc(plan.document.note)}</span></div>` ,"violet")}
    ${settingsSection540("Local-first behavior","Transfer Policy","Remote destinations must never destroy the only copy of a field photo or document.",`
      <div class="settingsList settingsToggleList540">${checkBlock("keepLocalCopy0794","Keep a local FireVault copy after upload",cfg.keepLocalCopy!==false)}${checkBlock("uploadOnSave0794","Queue remote upload when a photo or document is saved",!!cfg.uploadOnSave)}${checkBlock("noPersonalFallback0795","Never fall back from Work/SharePoint to Personal OneDrive",cfg.neverFallbackToPersonal!==false)}</div>
      <div class="cloudStorageActions0794"><button class="primary" id="saveCloudStorage0794">Save Destinations</button><button class="ghost" id="downloadCloudManifest0794">Download Integration Manifest</button>${syncStorageSettingsTabEnabled(APP_PROFILE,"microsoftStorage")?`<button class="ghost" id="openMicrosoftCloud0795">Microsoft Accounts</button>`:""}${syncStorageSettingsTabEnabled(APP_PROFILE,"webdav")?`<button class="ghost" id="openWebdavCloud0794">WebDAV Settings</button>`:""}</div>` ,"green")}
    <section class="card compactPane cloudProviderCatalog0794"><div class="paneHead"><div><h2>Available Storage Targets</h2><p class="paneNote">Local storage works now. The existing WebDAV module remains available for vault backup; photo/document transfer and OAuth providers are prepared as later connectors.</p></div></div><div>${providers.map(item=>`<article><span>${item.id==="onedrive"||item.id==="sharepoint"?"M":item.id==="googledrive"?"G":item.id==="dropbox"?"D":item.id==="webdav"?"W":"L"}</span><div><strong>${esc(item.label)}</strong><small>${esc(item.note)}</small></div><b class="${item.id==="local"?"available":"planned"}">${item.id==="local"?"READY":item.id==="webdav"?"BACKUP READY":item.id==="onedrive"||item.id==="sharepoint"?"PROFILES READY":"OAUTH SETUP"}</b></article>`).join("")}</div></section>
  </div>`;
}
function wireCloudFileStorage0794(){
  refreshMediaStorage0910();
  document.getElementById("refreshMediaStorage0910")?.addEventListener("click",refreshMediaStorage0910);
  document.getElementById("protectMediaStorage0910")?.addEventListener("click",async()=>{const granted=await requestPersistentMediaStorage();await refreshMediaStorage0910();toast(granted?"FireVault storage protection enabled.":"The browser did not grant persistent storage. Keep regular backups.",granted?"success":"error");});
  document.getElementById("cleanMediaStorage0910")?.addEventListener("click",async()=>{if(!confirm("Remove media files that are no longer linked to an account or library record?"))return;const result=await pruneOrphanedMedia(data);await refreshMediaStorage0910();toast(`${result.removed} unlinked file${result.removed===1?"":"s"} removed.`,"success");});
  const refreshConnection=(kind)=>{
    const provider=val(`${kind}Provider0794`)||"local";
    const wrap=document.getElementById(`${kind}MicrosoftWrap0795`),select=document.getElementById(`${kind}Connection0795`);
    const isMicrosoft=provider==="onedrive"||provider==="sharepoint";
    wrap?.classList.toggle("show",isMicrosoft);
    if(select){const previous=select.value;select.disabled=!isMicrosoft;select.innerHTML=microsoftProfileOptions0795(provider,previous);}
  };
  ["photo","document"].forEach(kind=>document.getElementById(`${kind}Provider0794`)?.addEventListener("change",()=>refreshConnection(kind)));
  document.getElementById("saveCloudStorage0794")?.addEventListener("click",()=>{
    const photoProvider=val("photoProvider0794")||"local",documentProvider=val("documentProvider0794")||"local";
    const photoConnection=(photoProvider==="onedrive"||photoProvider==="sharepoint")?val("photoConnection0795"):"";
    const documentConnection=(documentProvider==="onedrive"||documentProvider==="sharepoint")?val("documentConnection0795"):"";
    if((photoProvider==="onedrive"||photoProvider==="sharepoint")&&!photoConnection){toast("Choose the Microsoft account for photo storage.","error");return;}
    if((documentProvider==="onedrive"||documentProvider==="sharepoint")&&!documentConnection){toast("Choose the Microsoft account for document storage.","error");return;}
    data.settings.fileStorage={version:2,photo:{provider:photoProvider,connectionId:photoConnection,folder:val("photoFolder0794")||"FireVault/Photos"},document:{provider:documentProvider,connectionId:documentConnection,folder:val("documentFolder0794")||"FireVault/Documents"},keepLocalCopy:checked("keepLocalCopy0794"),uploadOnSave:checked("uploadOnSave0794"),neverFallbackToPersonal:checked("noPersonalFallback0795")};
    recordSecurityEvent(data,"file-storage-destinations-updated",{photoProvider,photoConnection,documentProvider,documentConnection});
    data=loadData();toast("Photo and document destinations saved.","success");settings();
  });
  document.getElementById("downloadCloudManifest0794")?.addEventListener("click",()=>{downloadBlob(`firevault-cloud-file-storage-${new Date().toISOString().slice(0,10)}.json`,JSON.stringify(cloudFileStorageManifest(data),null,2),"application/json");toast("Cloud file-storage manifest downloaded.","success");});
  document.getElementById("openMicrosoftCloud0795")?.addEventListener("click",()=>{settingsTab="microsoftStorage";mode="settingsDetail";render();});
  document.getElementById("openWebdavCloud0794")?.addEventListener("click",()=>{settingsTab="webdav";mode="settingsDetail";render();});
}

let editingMicrosoftProfile0795="";
function microsoftProfileProvider0795(type){return MICROSOFT_STORAGE_TYPES[type]?.provider||"onedrive";}
function microsoftProfileOptions0795(provider="onedrive",selected=""){
  const items=microsoftStorageAccounts().filter(item=>item.enabled!==false&&microsoftProfileProvider0795(item.type)===provider);
  return `<option value="">Choose Microsoft account…</option>${items.map(item=>`<option value="${esc(item.id)}" ${item.id===selected?"selected":""}>${esc(item.label)}${item.email?` — ${esc(item.email)}`:""}</option>`).join("")}`;
}
function microsoftConnectionField0795(kind,target){
  const provider=target.provider||"local",isMicrosoft=provider==="onedrive"||provider==="sharepoint";
  return `<div class="microsoftAssignmentField0795 ${isMicrosoft?"show":""}" id="${kind}MicrosoftWrap0795"><label>Microsoft account</label><select id="${kind}Connection0795" ${isMicrosoft?"":"disabled"}>${microsoftProfileOptions0795(provider,target.connectionId||"")}</select><small>${isMicrosoft?"Choose the exact Personal, Work, or SharePoint destination.":"Select OneDrive or SharePoint above to assign an account."}</small></div>`;
}
function microsoftProfileTypeLabel0795(type){return MICROSOFT_STORAGE_TYPES[type]?.label||"Microsoft Storage";}
function microsoftStoragePanel0795(){
  const accounts=microsoftStorageAccounts(),registration=microsoftAppRegistration(),summary=microsoftStorageSummary(data);
  const editing=accounts.find(item=>item.id===editingMicrosoftProfile0795)||createMicrosoftStorageAccount("work");
  const redirectUri=registration.redirectUri||`${location.origin}${location.pathname}`;
  const assignmentLabel=kind=>summary.assignments[kind]?.profileAvailable?summary.assignments[kind].connectionLabel:"Not assigned";
  return `<div class="settingsStack microsoftStorage0795">
    ${settingsSection540("Multiple Microsoft destinations","Microsoft Storage Accounts","Keep Personal OneDrive, Work OneDrive, and SharePoint as separate named profiles. FireVault will never silently move company files into a personal account.",`
      <div class="microsoftSummaryGrid0795"><article><span>PERSONAL / WORK PROFILES</span><strong>${accounts.filter(x=>x.type!=="sharepoint").length}</strong><small>Configured on this device</small></article><article><span>SHAREPOINT PROFILES</span><strong>${accounts.filter(x=>x.type==="sharepoint").length}</strong><small>Named libraries</small></article><article><span>PHOTO DESTINATION</span><strong>${esc(assignmentLabel("photo"))}</strong><small>Exact account assignment</small></article><article><span>DOCUMENT DESTINATION</span><strong>${esc(assignmentLabel("document"))}</strong><small>Exact account assignment</small></article></div>
      <div class="settingsInfo540 warning"><strong>No personal fallback</strong><span>If a Work or SharePoint destination is unavailable, FireVault keeps the file local and queued. It never substitutes a Personal OneDrive profile.</span></div>`,"blue")}
    ${settingsSection540("Connection profiles","Personal, Work & SharePoint",accounts.length?"Edit a profile or assign it directly to Photos or Documents.":"Create your first named Microsoft storage profile.",`
      <div class="microsoftProfileList0795">${accounts.length?accounts.map(item=>`<article class="microsoftProfileCard0795"><span class="microsoftProfileIcon0795">M</span><div><strong>${esc(item.label)}</strong><small>${esc(microsoftProfileTypeLabel0795(item.type))}${item.email?` · ${esc(item.email)}`:""}</small>${item.type==="sharepoint"&&item.libraryName?`<em>${esc(item.libraryName)}</em>`:""}</div><b>NOT CONNECTED</b><div class="microsoftProfileActions0795"><button class="ghost" data-ms-edit0795="${esc(item.id)}">Edit</button><button class="ghost" data-ms-assign0795="photo" data-ms-id0795="${esc(item.id)}">Use for Photos</button><button class="ghost" data-ms-assign0795="document" data-ms-id0795="${esc(item.id)}">Use for Documents</button><button class="danger" data-ms-delete0795="${esc(item.id)}">Remove</button></div></article>`).join(""):`<div class="emptyState"><strong>No Microsoft storage profiles</strong><span>Add Personal OneDrive, Work OneDrive, or a SharePoint library below.</span></div>`}</div>`,"cyan")}
    ${settingsSection540(editingMicrosoftProfile0795?"Edit profile":"New profile",editingMicrosoftProfile0795?"Update Microsoft Storage Profile":"Add Microsoft Storage Profile","Profiles are local connector settings and are excluded from FireVault vault backups. OAuth tokens are never stored here.",`
      <div class="settingsGrid settingsGrid540">
        ${fieldBlock("Profile type",`<select id="msProfileType0795"><option value="personal" ${editing.type==="personal"?"selected":""}>Personal OneDrive</option><option value="work" ${editing.type==="work"?"selected":""}>Work OneDrive</option><option value="sharepoint" ${editing.type==="sharepoint"?"selected":""}>SharePoint Library</option></select>`)}
        ${fieldBlock("Display name",`<input id="msProfileLabel0795" value="${esc(editing.label||"")}" placeholder="Work OneDrive">`)}
        ${fieldBlock("Microsoft email",`<input id="msProfileEmail0795" type="email" value="${esc(editing.email||"")}" placeholder="name@company.com">`,`Used only to identify the connection profile.`)}
        ${fieldBlock("Tenant ID (optional)",`<input id="msProfileTenant0795" value="${esc(editing.tenantId||"")}" placeholder="Directory tenant ID">`)}
        ${fieldBlock("SharePoint site URL",`<input id="msProfileSite0795" value="${esc(editing.siteUrl||"")}" placeholder="https://company.sharepoint.com/sites/FireVault">`)}
        ${fieldBlock("Document library",`<input id="msProfileLibrary0795" value="${esc(editing.libraryName||"")}" placeholder="Documents">`)}
      </div><div class="cloudStorageActions0794"><button class="primary" id="saveMicrosoftProfile0795">${editingMicrosoftProfile0795?"Save Profile":"Add Profile"}</button>${editingMicrosoftProfile0795?`<button class="ghost" id="cancelMicrosoftProfile0795">Cancel Edit</button>`:""}</div>`,"violet")}
    ${settingsSection540("Public app configuration","Microsoft App Registration","A Microsoft application (client) ID is public configuration, not a password. Live sign-in remains disabled in this build, but saving this prepares the connector for the later OAuth activation build.",`
      <div class="settingsGrid settingsGrid540">${fieldBlock("Application (client) ID",`<input id="msClientId0795" value="${esc(registration.clientId||"")}" placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx">`)}${fieldBlock("Authority",`<select id="msAuthority0795"><option value="common" ${registration.authority==="common"?"selected":""}>Personal + Work accounts</option><option value="organizations" ${registration.authority==="organizations"?"selected":""}>Work accounts only</option><option value="consumers" ${registration.authority==="consumers"?"selected":""}>Personal accounts only</option><option value="tenant" ${registration.authority==="tenant"?"selected":""}>Specific tenant</option></select>`)}${fieldBlock("Tenant ID for specific tenant",`<input id="msAppTenant0795" value="${esc(registration.tenantId||"")}" placeholder="Optional tenant ID">`)}${fieldBlock("SPA redirect URI",`<input id="msRedirectUri0795" value="${esc(redirectUri)}" readonly>`,`Register this exact address as a Single-page application redirect URI in Microsoft Entra.`)}</div>
      <div class="cloudStorageActions0794"><button class="primary" id="saveMicrosoftApp0795">Save App Configuration</button><button class="ghost" id="copyMicrosoftRedirect0795">Copy Redirect URI</button><button class="ghost" id="downloadMicrosoftManifest0795">Download Integration Manifest</button></div>
      <div class="settingsInfo540"><strong>${registration.clientId?"App registration saved":"App registration not configured"}</strong><span>Account passwords, access tokens, and refresh tokens are not accepted or stored by this screen.</span></div>`,"green")}
    <section class="card compactPane microsoftOAuthStatus0795"><div class="paneHead"><div><h2>Connector Status</h2><p class="paneNote">Multi-account profiles and destination assignments are ready. Live Microsoft Graph sign-in, uploads, downloads, and token refresh are intentionally not activated yet.</p></div><b>FOUNDATION READY</b></div></section>
  </div>`;
}
function wireMicrosoftStorage0795(){
  document.querySelectorAll("[data-ms-edit0795]").forEach(button=>button.addEventListener("click",()=>{editingMicrosoftProfile0795=button.dataset.msEdit0795||"";settings();}));
  document.getElementById("cancelMicrosoftProfile0795")?.addEventListener("click",()=>{editingMicrosoftProfile0795="";settings();});
  document.getElementById("saveMicrosoftProfile0795")?.addEventListener("click",()=>{
    const accounts=microsoftStorageAccounts(),type=val("msProfileType0795")||"work",existing=accounts.find(item=>item.id===editingMicrosoftProfile0795),profile=existing||createMicrosoftStorageAccount(type);
    Object.assign(profile,{type,provider:microsoftProfileProvider0795(type),label:val("msProfileLabel0795")||microsoftProfileTypeLabel0795(type),email:val("msProfileEmail0795"),tenantId:val("msProfileTenant0795"),siteUrl:val("msProfileSite0795"),libraryName:val("msProfileLibrary0795"),enabled:true,status:"not-connected",modifiedAt:new Date().toISOString()});
    if(type==="sharepoint"&&!profile.siteUrl){toast("Enter the SharePoint site URL.","error");return;}
    const next=existing?accounts.map(item=>item.id===existing.id?profile:item):[...accounts,profile];
    try{saveMicrosoftStorageAccounts(next);editingMicrosoftProfile0795="";toast("Microsoft storage profile saved.","success");settings();}catch(err){toast(err?.message||"Profile could not be saved.","error");}
  });
  document.querySelectorAll("[data-ms-delete0795]").forEach(button=>button.addEventListener("click",()=>{
    const id=button.dataset.msDelete0795;if(!confirm("Remove this Microsoft storage profile from this device? Files already stored in FireVault are not deleted."))return;
    try{saveMicrosoftStorageAccounts(microsoftStorageAccounts().filter(item=>item.id!==id));["photo","document"].forEach(kind=>{const target=data.settings.fileStorage?.[kind];if(target?.connectionId===id){target.provider="local";target.connectionId="";}});save();editingMicrosoftProfile0795="";toast("Microsoft storage profile removed.","success");settings();}catch(err){toast(err?.message||"Profile could not be removed.","error");}
  }));
  document.querySelectorAll("[data-ms-assign0795]").forEach(button=>button.addEventListener("click",()=>{
    const id=button.dataset.msId0795,kind=button.dataset.msAssign0795,profile=microsoftStorageAccountById(id);if(!profile||!["photo","document"].includes(kind))return;
    data.settings.fileStorage.version=2;data.settings.fileStorage[kind]={...(data.settings.fileStorage[kind]||{}),provider:microsoftProfileProvider0795(profile.type),connectionId:profile.id};data.settings.fileStorage.neverFallbackToPersonal=true;
    recordSecurityEvent(data,"microsoft-storage-assigned",{kind,connectionId:profile.id,connectionType:profile.type});data=loadData();toast(`${profile.label} assigned to ${kind} storage.`,"success");settings();
  }));
  document.getElementById("saveMicrosoftApp0795")?.addEventListener("click",()=>{try{saveMicrosoftAppRegistration({clientId:val("msClientId0795"),authority:val("msAuthority0795")||"common",tenantId:val("msAppTenant0795"),redirectUri:val("msRedirectUri0795")});toast("Microsoft app configuration saved on this device.","success");settings();}catch(err){toast(err?.message||"App configuration could not be saved.","error");}});
  document.getElementById("copyMicrosoftRedirect0795")?.addEventListener("click",async()=>{try{await navigator.clipboard.writeText(val("msRedirectUri0795"));toast("Redirect URI copied.","success");}catch{toast("Clipboard unavailable.","error");}});
  document.getElementById("downloadMicrosoftManifest0795")?.addEventListener("click",()=>{downloadBlob(`firevault-microsoft-storage-${new Date().toISOString().slice(0,10)}.json`,JSON.stringify(microsoftStorageManifest(data),null,2),"application/json");toast("Microsoft integration manifest downloaded.","success");});
}

function plusCodeStats0794(){
  const sites=data.sites||[];
  const accounts=sites.filter(s=>!!sitePlusCode071(s)).length;
  const points=sites.reduce((sum,s)=>sum+locationPoints071(s).filter(p=>isValidFullPlusCode(p.plusCode)).length,0);
  return {accounts,points,total:sites.length};
}
function plusCodesPanel0794(){
  const cfg=plusCodeSettings0794(),stats=plusCodeStats0794();
  return `<div class="settingsStack plusCodesSettings0794">
    ${settingsSection540("Offline location addressing","Google Plus Codes","FireVault generates full Open Location Codes directly from saved latitude and longitude. No paid API, network connection, or address lookup is required.",`
      <div class="plusCodeStats0794"><div><strong>${stats.accounts}</strong><span>Account codes</span></div><div><strong>${stats.points}</strong><span>Exact location pins</span></div><div><strong>${stats.total-stats.accounts}</strong><span>Need GPS</span></div></div>
      <div class="settingsInfo540"><strong>Full codes only</strong><span>FireVault stores full codes such as 85HPMM7R+42 so they work without a nearby city reference.</span></div>` ,"cyan")}
    ${settingsSection540("Precision","Plus Code Settings","Use standard precision for an account location and higher precision for entrances, panels, riser rooms, FDCs, and other field pins.",`
      <div class="settingsGrid settingsGrid540">${fieldBlock("Account code precision",`<select id="plusAccountLength0794"><option value="10" ${cfg.accountLength===10?"selected":""}>10 digits — ${plusCodePrecisionLabel(10)}</option><option value="11" ${cfg.accountLength===11?"selected":""}>11 digits — ${plusCodePrecisionLabel(11)}</option></select>`)}${fieldBlock("Saved location precision",`<select id="plusLocationLength0794"><option value="10" ${cfg.locationLength===10?"selected":""}>10 digits — ${plusCodePrecisionLabel(10)}</option><option value="11" ${cfg.locationLength===11?"selected":""}>11 digits — ${plusCodePrecisionLabel(11)}</option></select>`,`11 digits is recommended for doors, fire panels, riser rooms, and FDC locations.`)}${fieldBlock("Reverify locations",`<select id="plusVerifyDays07912"><option value="90" ${cfg.verifyAfterDays===90?"selected":""}>Every 90 days</option><option value="180" ${cfg.verifyAfterDays===180?"selected":""}>Every 180 days</option><option value="365" ${cfg.verifyAfterDays===365?"selected":""}>Every year</option></select>`)}</div>
      <div class="settingsList settingsToggleList540">${checkBlock("plusEnabled0794","Show Plus Code tools",cfg.enabled)}${checkBlock("plusAuto0794","Generate codes automatically from GPS",cfg.autoGenerate)}${checkBlock("plusSearch0794","Allow account search by Plus Code",cfg.searchable)}${checkBlock("plusReports0794","Include Plus Codes in reports",cfg.includeInReports)}</div>` ,"blue",`<button class="primary saveMini" id="savePlusCodes0794">Save</button>`)}
    ${settingsSection540("Database tools","Generate & Verify","Recalculate account and saved-location codes from the stored GPS coordinates using the selected precision.",`
      <div class="cloudStorageActions0794"><button class="primary" id="backfillPlusCodes0794">Generate / Refresh Codes</button><button class="ghost" id="copyPlusCodeSummary0794">Copy Summary</button></div><div id="plusCodeResult0794" class="fieldNote">${stats.accounts} of ${stats.total} accounts currently have a full Plus Code.</div>` ,"green")}
  </div>`;
}
function wirePlusCodes0794(){
  document.getElementById("savePlusCodes0794")?.addEventListener("click",()=>{
    data.settings.plusCodes={enabled:checked("plusEnabled0794"),autoGenerate:checked("plusAuto0794"),accountLength:Number(val("plusAccountLength0794"))||10,locationLength:Number(val("plusLocationLength0794"))||11,verifyAfterDays:Number(val("plusVerifyDays07912"))||180,searchable:checked("plusSearch0794"),includeInReports:checked("plusReports0794")};
    ensureAllPlusCodes071();saveData(data);data=loadData();toast("Plus Code settings saved.","success");settings();
  });
  document.getElementById("backfillPlusCodes0794")?.addEventListener("click",()=>{
    let accounts=0,points=0;
    (data.sites||[]).forEach(s=>{if(hasGps(s)){s.plusCode=encodePlusCode071(s.gps.lat,s.gps.lng,Number(val("plusAccountLength0794"))||10);accounts++;}(s.locationPoints||[]).forEach(p=>{if(Number.isFinite(Number(p.lat))&&Number.isFinite(Number(p.lng))){p.plusCode=encodePlusCode071(p.lat,p.lng,Number(val("plusLocationLength0794"))||11);points++;}});});
    saveData(data);data=loadData();const out=document.getElementById("plusCodeResult0794");if(out)out.textContent=`Generated ${accounts} account codes and ${points} saved-location codes.`;toast("Plus Codes refreshed.","success");
  });
  document.getElementById("copyPlusCodeSummary0794")?.addEventListener("click",async()=>{const stats=plusCodeStats0794();const text=`FireVault Plus Codes\nAccounts: ${stats.accounts} of ${stats.total}\nSaved location pins: ${stats.points}\nAccount precision: ${plusCodeSettings0794().accountLength} digits\nLocation precision: ${plusCodeSettings0794().locationLength} digits`;try{await navigator.clipboard.writeText(text);toast("Plus Code summary copied.","success");}catch{toast("Clipboard unavailable.","error");}});
}

function backendFoundationPanel0793(){
  const summary=backendAdapterSummary(data);
  const providers=Object.entries(summary.providers||{});
  return `<div class="settingsStack backendFoundation0793">
    <section class="card settingsSection540 tone-blue">
      <div class="settingsSectionHead530"><div><span class="settingsEyebrow530">Backend neutral</span><h2>Backend Adapter Foundation</h2><p>FireVault is still fully local. These adapters isolate backend-dependent work so Supabase or another service can be connected later without rebuilding the user interface.</p></div><span class="pill">Contract v${PROVIDER_CONTRACT_VERSION}</span></div>
      <div class="backendStatusGrid0793">
        <div><strong>Current mode</strong><span>Local offline</span></div>
        <div><strong>Remote backend</strong><span>Not configured</span></div>
        <div><strong>Pending changes</strong><span>${summary.pendingChanges}</span></div>
        <div><strong>Workspace</strong><span>${esc(summary.workspaceId)}</span></div>
      </div>
      <div class="backendFilePlan0794"><div><span>Photo destination</span><strong>${esc(summary.fileStoragePlan.photo.label)}</strong><small>${esc(summary.fileStoragePlan.photo.status)} • ${esc(summary.fileStoragePlan.photo.folder)}</small></div><div><span>Document destination</span><strong>${esc(summary.fileStoragePlan.document.label)}</strong><small>${esc(summary.fileStoragePlan.document.status)} • ${esc(summary.fileStoragePlan.document.folder)}</small></div></div>
    </section>
    <section class="card compactPane">
      <div class="paneHead"><div><h2>Provider Interfaces</h2><p class="paneNote">Each responsibility can be replaced independently when the backend is selected.</p></div></div>
      <div class="backendProviderList0793">${providers.map(([kind,item])=>`<div><span class="backendProviderIcon0793">${({authentication:'◉',database:'▦',fileStorage:'▤',sync:'↻',audit:'≡'})[kind]||'•'}</span><div><strong>${esc(item.label)}</strong><small>${esc(kind.replace(/([A-Z])/g,' $1'))}</small></div><b>LOCAL</b></div>`).join('')}</div>
    </section>
    <section class="card compactPane">
      <div class="paneHead"><div><h2>Backend Readiness</h2><p class="paneNote">No account data will leave this device until a remote provider is deliberately configured.</p></div></div>
      <div class="settingsInfo540"><strong>Supported future targets</strong><span>${summary.candidateBackends.map(esc).join(' • ')}</span></div>
      <div class="backupActionGrid449"><button class="primary" id="runBackendDiagnostics0793">Run Adapter Check</button><button class="ghost" id="downloadBackendManifest0793">Download Manifest</button></div>
      <div id="backendDiagnosticResult0793" class="fieldNote">Ready to validate the local provider contracts.</div>
    </section>
    <section class="card compactPane">
      <div class="paneHead"><div><h2>What This Build Does Not Do</h2></div></div>
      <div class="settingsInfo540"><strong>No signup or login yet</strong><span>Authentication remains local until a backend and identity provider are selected.</span></div>
      <div class="settingsInfo540"><strong>No remote synchronization yet</strong><span>The existing local change queue remains ready for a future Sync Provider.</span></div>
      <div class="settingsInfo540"><strong>No credentials in the vault</strong><span>Future provider secrets must stay outside backups and account records.</span></div>
    </section>
  </div>`;
}
async function wireBackendFoundation0793(){
  document.getElementById("runBackendDiagnostics0793")?.addEventListener("click",async()=>{
    const out=document.getElementById("backendDiagnosticResult0793");if(out)out.textContent="Checking provider contracts…";
    const result=await runBackendAdapterDiagnostics(data);
    if(out)out.textContent=result.checks.map(x=>`${x.ok?'✓':'!'} ${x.provider}: ${x.detail}`).join(" • ");
    toast(result.ok?"Backend adapter foundation is ready.":"One or more adapter checks need attention.",result.ok?"success":"error");
  });
  document.getElementById("downloadBackendManifest0793")?.addEventListener("click",()=>{
    const manifest=backendAdapterManifest(data);
    downloadBlob(`firevault-backend-adapter-manifest-${new Date().toISOString().slice(0,10)}.json`,JSON.stringify(manifest,null,2),"application/json");
    toast("Backend adapter manifest downloaded.","success");
  });
}


const TECHNICIAN_SECTION_STATE_KEY_0947="firevault_technician_section_state_0947";
function technicianSectionState0947(){
  try{const parsed=JSON.parse(localStorage.getItem(TECHNICIAN_SECTION_STATE_KEY_0947)||"{}");return parsed&&typeof parsed==="object"?parsed:{};}catch{return {};}
}
function setTechnicianSectionState0947(id,isOpen){
  const state=technicianSectionState0947();state[id]=Boolean(isOpen);
  try{localStorage.setItem(TECHNICIAN_SECTION_STATE_KEY_0947,JSON.stringify(state));}catch{}
}
function technicianSectionComplete0947(id){
  const tech=data.settings?.technician||{};
  if(id==="photo")return /^data:image\//.test(String(tech.photoData||""));
  if(id==="identity")return Boolean(String(tech.name||"").trim()&&String(tech.company||"").trim());
  if(id==="contact")return Boolean(String(tech.phone||"").trim()&&String(tech.email||"").trim());
  if(id==="template")return Array.isArray(data.settings?.technicianOverlay?.fields)&&data.settings.technicianOverlay.fields.length>0;
  return false;
}
function technicianSectionOpen0947(id){
  if(!technicianSectionComplete0947(id))return true;
  return technicianSectionState0947()[id]===true;
}
function technicianSection0947(id,kicker,title,note,content,tone="blue"){
  const complete=technicianSectionComplete0947(id);
  return `<details class="card technicianSettingsSection0947 tone-${tone} ${complete?"isComplete0947":"needsInfo0947"}" data-technician-section="${id}" ${technicianSectionOpen0947(id)?"open":""}>
    <summary class="technicianSettingsSummary0947">
      <span class="technicianSectionMark0947" aria-hidden="true">${({photo:"▣",identity:"ID",contact:"@",template:"T"})[id]||"•"}</span>
      <span class="technicianSectionCopy0947"><small>${esc(kicker)}</small><strong>${esc(title)}</strong><em>${esc(note)}</em></span>
      <span class="technicianSectionStatus0947">${complete?"Complete":"Needs information"}</span>
      <span class="technicianSectionChevron0947" aria-hidden="true">⌄</span>
    </summary>
    <div class="technicianSettingsBody0947">${content}</div>
  </details>`;
}
function technicianInitials0947(){
  const name=String(data.settings?.technician?.name||"").trim();
  if(!name)return "TECH";
  return name.split(/\s+/).slice(0,2).map(part=>part[0]||"").join("").toUpperCase();
}
function technicianPhotoMarkup0947(){
  const tech=data.settings?.technician||{};
  const hasPhoto=/^data:image\//.test(String(tech.photoData||""));
  return `<div class="technicianPhotoEditor0947">
    <div class="technicianPhotoPreview0947">${hasPhoto?`<img src="${esc(tech.photoData)}" alt="Technician profile photo">`:`<span>${esc(technicianInitials0947())}</span>`}</div>
    <div class="technicianPhotoActions0947">
      <strong>${hasPhoto?"Technician photo":"Add a technician photo"}</strong>
      <small>FireVault crops the image square and reduces it to 384 × 384 pixels for reliable app storage.</small>
      <div><label class="primary technicianPhotoChoose0947" for="technicianPhotoInput0947">${hasPhoto?"Change Photo":"Choose Photo"}</label>${hasPhoto?`<button type="button" class="ghost" id="removeTechnicianPhoto0947">Remove</button>`:""}</div>
      <input id="technicianPhotoInput0947" type="file" accept="image/*" hidden>
    </div>
  </div>`;
}
function readPhotoFile0947(file){
  return new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(String(reader.result||""));reader.onerror=()=>reject(new Error("Photo could not be read."));reader.readAsDataURL(file);});
}
function loadPhotoImage0947(src){
  return new Promise((resolve,reject)=>{const image=new Image();image.onload=()=>resolve(image);image.onerror=()=>reject(new Error("Photo format is not supported."));image.src=src;});
}
async function resizeTechnicianPhoto0947(file){
  if(!file||!String(file.type||"").startsWith("image/"))throw new Error("Choose a photo from the camera or photo library.");
  const source=await readPhotoFile0947(file);
  const image=await loadPhotoImage0947(source);
  const size=384;
  const canvas=document.createElement("canvas");canvas.width=size;canvas.height=size;
  const ctx=canvas.getContext("2d",{alpha:false});
  if(!ctx)throw new Error("Photo resizing is unavailable on this device.");
  const sourceSize=Math.min(image.naturalWidth||image.width,image.naturalHeight||image.height);
  const sx=((image.naturalWidth||image.width)-sourceSize)/2;
  const sy=((image.naturalHeight||image.height)-sourceSize)/2;
  ctx.fillStyle="#111820";ctx.fillRect(0,0,size,size);
  ctx.drawImage(image,sx,sy,sourceSize,sourceSize,0,0,size,size);
  let quality=.84;
  let result=canvas.toDataURL("image/jpeg",quality);
  while(result.length>190000&&quality>.58){quality-=.07;result=canvas.toDataURL("image/jpeg",quality);}
  return result;
}
function captureTechnicianInputs0947(){
  const tech={...(data.settings?.technician||{})};
  const name=document.getElementById("techName"),company=document.getElementById("techCompany"),phone=document.getElementById("techPhone"),email=document.getElementById("techEmail"),license=document.getElementById("techLicense");
  if(name)tech.name=name.value.trim();if(company)tech.company=company.value.trim();if(phone)tech.phone=normalizePhoneValue0758(phone.value);if(email)tech.email=email.value.trim();if(license)tech.license=license.value.trim();
  tech.defaultRole=tech.defaultRole||"Fire Alarm Technician";data.settings.technician=tech;return tech;
}
function saveTechnicianSection0947(section){
  const tech=captureTechnicianInputs0947();
  if(section==="identity"){
    tech.name=val("techName");tech.company=val("techCompany");
    if(!tech.name||!tech.company){toast("Enter the technician name and company before completing this section.","error");return;}
  }
  if(section==="contact"){
    tech.phone=normalizePhoneValue0758(val("techPhone"));tech.email=val("techEmail");tech.license=val("techLicense");
    if(!tech.phone||!tech.email){toast("Enter a phone number and email before completing this section.","error");return;}
  }
  data.settings.technician=tech;save();setTechnicianSectionState0947(section,false);toast("Technician profile saved.","success");settings();
}
function wireTechnicianProfile0947(){
  wireTechnicianOverlayTemplate0946();
  document.querySelectorAll("[data-technician-section]").forEach(section=>section.addEventListener("toggle",()=>{
    const id=section.dataset.technicianSection;if(!id)return;
    if(technicianSectionComplete0947(id))setTechnicianSectionState0947(id,section.open);
  }));
  document.querySelectorAll("[data-save-technician-section]").forEach(button=>button.onclick=()=>saveTechnicianSection0947(button.dataset.saveTechnicianSection));
  const input=document.getElementById("technicianPhotoInput0947");
  if(input)input.onchange=async()=>{
    const file=input.files?.[0];if(!file)return;
    const label=document.querySelector('.technicianPhotoChoose0947');if(label){label.textContent="Processing…";label.setAttribute("aria-disabled","true");}
    try{
      const photoData=await resizeTechnicianPhoto0947(file);
      const current=captureTechnicianInputs0947();
      data.settings.technician={...current,photoData,photoUpdatedAt:new Date().toISOString()};
      save();setTechnicianSectionState0947("photo",false);toast("Technician photo resized and saved.","success");settings();
    }catch(err){toast(err?.message||"Technician photo could not be saved.","error");if(label){label.textContent="Choose Photo";label.removeAttribute("aria-disabled");}}
  };
  const remove=document.getElementById("removeTechnicianPhoto0947");
  if(remove)remove.onclick=()=>{
    if(!confirm("Remove the technician profile photo?"))return;
    const current=captureTechnicianInputs0947();
    data.settings.technician={...current,photoData:"",photoUpdatedAt:""};
    save();setTechnicianSectionState0947("photo",true);toast("Technician photo removed.");settings();
  };
}

function architectureCsvCell0953(value){
  const text=Array.isArray(value)?value.join(" | "):String(value??"");
  return /[",\n]/.test(text)?`"${text.replaceAll('"','""')}"`:text;
}
function architectureMatrixCsv0953(){
  const rows=moduleMatrixRows();
  const headers=["Module ID","Module","Classification","Status",...FUTURE_APP_COLUMNS.map(app=>app.label),"AppForge Ready","Dependencies"];
  const keys=["id","module","classification","status",...FUTURE_APP_COLUMNS.map(app=>app.key),"appForgeReady","dependencies"];
  return [headers.map(architectureCsvCell0953).join(","),...rows.map(row=>keys.map(key=>architectureCsvCell0953(typeof row[key]==="boolean"?(row[key]?"Yes":"No"):row[key])).join(","))].join("\n");
}
function architectureSummaryText0953(){
  const summary=moduleRegistrySummary(APP_PROFILE.enabledModules);
  return [
    `${APP_PROFILE.name} Core Architecture`,
    `Build: ${BUILD}`,
    `App profile schema: ${APP_PROFILE_SCHEMA_VERSION}`,
    `Module registry: ${MODULE_REGISTRY_VERSION}`,
    `Module bindings: ${MODULE_BINDINGS_VERSION}`,
    `Record schema: ${RECORD_SCHEMA_VERSION} (${APP_PROFILE.dataModel?.schemaId||RECORD_SCHEMA.id})`,
    `Workflow schema: ${WORKFLOW_SCHEMA_VERSION} (${APP_PROFILE.workflows?.presetId||"default"})`,
    `Theme profile: ${THEME_PROFILE_SCHEMA_VERSION} (${ACTIVE_THEME_0958.id})`,
    `Content pack registry: ${CONTENT_PACK_SCHEMA_VERSION} (${ACTIVE_CONTENT_PROFILE_0959.registryId})`,
    `Sync and storage profile: ${SYNC_STORAGE_PROFILE_SCHEMA_VERSION} (${ACTIVE_SYNC_STORAGE_PROFILE_0960.profileId})`,
    `AppForge blueprint: ${APP_FORGE_BLUEPRINT_SCHEMA_VERSION} (${ACTIVE_APP_FORGE_READINESS_0970.status})`,
    `AppForge product recipes: ${APP_FORGE_RECIPE_SCHEMA_VERSION} (${APP_FORGE_RECIPE_SUMMARY_0980.blueprintReady}/${APP_FORGE_RECIPE_SUMMARY_0980.total} blueprint ready)`,
    `AppForge factory manifest: ${APP_FORGE_FACTORY_SCHEMA_VERSION} (${APP_FORGE_FACTORY_SUMMARY_0990.factoryReady}/${APP_FORGE_FACTORY_SUMMARY_0990.total} factory ready)`,
    `AppForge generator engine: ${APP_FORGE_GENERATOR_SCHEMA_VERSION} (${APP_FORGE_GENERATOR_SUMMARY_1000.packageReady}/${APP_FORGE_GENERATOR_SUMMARY_1000.total} PWA packages ready)`,
    `Active content packs: ${contentPackSummary(APP_PROFILE).packs}`,
    `Active content sources: ${contentPackSummary(APP_PROFILE).sources}`,
    `Modules: ${summary.total}`,
    `Core: ${summary.core}`,
    `Reusable optional: ${summary.optional}`,
    `FireVault-specific: ${summary.firevault}`,
    `AppForge-ready: ${summary.appForgeReady}`,
    `Primary record term: ${appTerm("account",1)} / ${appTerm("account",2)}`,
    `Record ID label: ${recordIdLabel0954()}`,
    `Visible terminology integration: Active`,
    `Module-aware navigation and Settings: Active`,
    `Profile-defined fields and photo categories: Active`,
    `Profile-defined actions and Quick Photo workflow: Active`,
    `Profile-defined branding and visual tokens: Active`,
    `Profile-defined data sources and content packs: Active`,
    `Profile-defined sync providers, backups, and storage roles: Active`,
    `Portable AppForge product blueprint: ${ACTIVE_APP_FORGE_READINESS_0970.ready?"Ready":"Needs review"}`,
    `Multi-product AppForge recipes: ${APP_FORGE_RECIPE_SUMMARY_0980.total} defined`,
    `Deterministic factory manifests: ${APP_FORGE_FACTORY_SUMMARY_0990.total} defined`,
    `Enabled modules: ${summary.enabled} of ${summary.total}`,
    `Storage key: ${KEY}`
  ].join("\n");
}
function architectureModuleCard0953(module){
  const enabled=APP_PROFILE.enabledModules.includes(module.id);
  const classification=MODULE_CLASSIFICATIONS[module.classification]||{label:module.classification,description:""};
  return `<article class="architectureModule0953 class-${esc(module.classification)}">
    <div class="architectureModuleHead0953"><span>${esc(classification.label)}</span><em class="${enabled?"enabled":"disabled"}">${enabled?"Active":"Available"}</em></div>
    <h3>${esc(module.name)}</h3><p>${esc(module.description)}</p>
    <div class="architectureModuleMeta0953"><code>${esc(module.id)}</code><small>${module.appForgeReady?"AppForge ready":"Vertical layer"}</small></div>
    ${module.dependencies.length?`<div class="architectureDependencies0953"><strong>Depends on</strong><span>${module.dependencies.map(esc).join(" · ")}</span></div>`:""}
  </article>`;
}
function architecturePanel0953(){
  const summary=moduleRegistrySummary(APP_PROFILE.enabledModules);
  const grouped=["core","optional","firevault"].map(kind=>({kind,meta:MODULE_CLASSIFICATIONS[kind],modules:MODULE_REGISTRY.filter(module=>module.classification===kind)}));
  const matrix=moduleMatrixRows();
  return `<div class="settingsStack settingsStack540 architectureStack0953">
    ${settingsSection540("Reusable foundation","App Profile",`${APP_PROFILE.name} remains optimized for ${APP_PROFILE.audience.toLowerCase()}, while shared behavior is defined outside the fire-specific layer.`,`
      <div class="architectureProfile0953">
        <div class="architectureProfileBrand0953"><img src="${esc(themeBrandAsset(APP_PROFILE,"mark"))}?v=${BUILD}" alt=""><div><strong>${esc(APP_PROFILE.name)}</strong><span>${esc(APP_PROFILE.industry)}</span></div><em>Profile v${APP_PROFILE.schemaVersion}</em></div>
        <div class="architectureProfileGrid0953">
          <div><strong>Record terminology</strong><span>${esc(appTerm("account",1))} / ${esc(appTerm("account",2))}</span></div>
          <div><strong>Record ID label</strong><span>${esc(recordIdLabel0954())}</span></div>
          <div><strong>Location terminology</strong><span>${esc(appTerm("location",1))} / ${esc(appTerm("location",2))}</span></div>
          <div><strong>Navigation</strong><span>${["nearby","search","photo","settings"].map(appNavigationLabel).map(esc).join(" · ")}</span></div>
          <div><strong>Visible labels</strong><span>Directory · Detail · Forms · Quick Photo</span></div>
          <div><strong>Module-aware UI</strong><span>Navigation · Account tabs · Actions · Settings</span></div>
          <div><strong>Binding schema</strong><span>Version ${MODULE_BINDINGS_VERSION}</span></div>
          <div><strong>Workflow preset</strong><span>${esc(APP_PROFILE.workflows?.presetId||"default")}</span></div>
          <div><strong>Workflow schema</strong><span>Version ${WORKFLOW_SCHEMA_VERSION}</span></div>
          <div><strong>Theme profile</strong><span>${esc(ACTIVE_THEME_0958.name)} · v${THEME_PROFILE_SCHEMA_VERSION}</span></div>
          <div><strong>Content registry</strong><span>${esc(ACTIVE_CONTENT_PROFILE_0959.registryId)} · v${CONTENT_PACK_SCHEMA_VERSION}</span></div>
          <div><strong>Content packs</strong><span>${contentPackSummary(APP_PROFILE).packs} active · ${contentPackSummary(APP_PROFILE).sources} sources</span></div>
          <div><strong>Sync & storage</strong><span>${esc(ACTIVE_SYNC_STORAGE_PROFILE_0960.profileId)} · v${SYNC_STORAGE_PROFILE_SCHEMA_VERSION}</span></div>
          <div><strong>Approved providers</strong><span>${activeStorageProviders(APP_PROFILE).map(provider=>esc(provider.name)).join(" · ")}</span></div>
          <div><strong>AppForge blueprint</strong><span>v${APP_FORGE_BLUEPRINT_SCHEMA_VERSION} · ${esc(ACTIVE_APP_FORGE_READINESS_0970.status)}</span></div>
          <div><strong>Product recipes</strong><span>${APP_FORGE_RECIPE_SUMMARY_0980.total} defined · v${APP_FORGE_RECIPE_SCHEMA_VERSION}</span></div>
          <div><strong>Factory manifests</strong><span>${APP_FORGE_FACTORY_SUMMARY_0990.factoryReady}/${APP_FORGE_FACTORY_SUMMARY_0990.total} ready · v${APP_FORGE_FACTORY_SCHEMA_VERSION}</span></div>
          <div><strong>Brand identity</strong><span>${esc(ACTIVE_THEME_0958.branding.tagline)}</span></div>
          <div><strong>Storage compatibility</strong><span>${esc(KEY)}</span></div>
        </div>
        <p>The profile supplies terminology, enabled modules, record fields, detail sections, photo categories, actions, capture behavior, branding, visual tokens, data sources, content packs, storage providers, backup rules, and collaboration policy to the shared workflows. The AppForge Blueprint validates the contracts, Product Recipes describe distinct vertical apps, Factory Manifests define deterministic inputs and guardrails, and the Generator Engine now assembles isolated installable PWA packages. FireVault keeps every current fire-alarm module, field, and technician action enabled.</p>
      </div>
    `,"red")}
    ${settingsSection540("Configurable data model","Record Schema",`${recordSchemaSummary(APP_PROFILE).activeFields} active fields, ${recordSchemaSummary(APP_PROFILE).detailSections} detail sections, and ${recordSchemaSummary(APP_PROFILE).photoCategories} photo categories are selected by the App Profile.`, `
      <div class="recordSchemaMetrics0956"><div><strong>${recordSchemaSummary(APP_PROFILE).activeFields}</strong><span>Active fields</span></div><div><strong>${recordSchemaSummary(APP_PROFILE).requiredFields}</strong><span>Required</span></div><div><strong>${recordSchemaSummary(APP_PROFILE).detailSections}</strong><span>Detail sections</span></div><div><strong>${recordSchemaSummary(APP_PROFILE).photoCategories}</strong><span>Photo categories</span></div></div>
      <div class="recordSchemaTableWrap0956"><table class="recordSchemaTable0956"><thead><tr><th>Field</th><th>Group</th><th>Type</th><th>Layer</th></tr></thead><tbody>${activeRecordFields(APP_PROFILE).map(field=>`<tr><td><strong>${esc(field.label)}</strong><small>${esc(field.id)}${field.required?" · Required":""}</small></td><td>${esc(RECORD_SCHEMA.groups.find(group=>group.id===field.group)?.label||field.group)}</td><td>${esc(field.type)}</td><td>${field.appForgeReady?"Core-ready":"FireVault"}</td></tr>`).join("")}</tbody></table></div>
      <div class="recordSchemaCategories0956"><strong>Photo categories</strong><div>${recordPhotoCategories(APP_PROFILE).map(category=>`<span>${esc(category.label)}</span>`).join("")}</div></div>
      <div class="architectureActions0953"><button class="ghost" id="downloadRecordSchema0956">Download Record Schema</button></div>
    `,"green")}
    ${settingsSection540("Configurable field workflow","Workflow Schema",`${workflowSchemaSummary(APP_PROFILE).directoryActions} directory actions, ${workflowSchemaSummary(APP_PROFILE).detailPrimaryActions} primary actions, and ${workflowSchemaSummary(APP_PROFILE).notesActions} Notes actions are selected by the ${APP_PROFILE.workflows?.presetId||"default"} preset.`, `
      <div class="workflowSchemaMetrics0957"><div><strong>${workflowSchemaSummary(APP_PROFILE).directoryActions}</strong><span>Directory</span></div><div><strong>${workflowSchemaSummary(APP_PROFILE).detailPrimaryActions}</strong><span>Detail</span></div><div><strong>${workflowSchemaSummary(APP_PROFILE).notesActions}</strong><span>Notes</span></div><div><strong>${QUICK_PHOTO_WORKFLOW_0957.maxImageDimension}</strong><span>Photo pixels</span></div></div>
      <div class="workflowSchemaSurfaces0957">
        ${[["Directory","directory"],["Account Detail","detailPrimary"],["Notes Workspace","notes"]].map(([label,surface])=>`<section><strong>${esc(label)}</strong><div>${workflowActions0957(surface).map(action=>`<span>${esc(action.label)}</span>`).join("")||"<em>No actions selected</em>"}</div></section>`).join("")}
      </div>
      <div class="workflowPhotoSummary0957"><strong>Quick Photo preset</strong><span>${QUICK_PHOTO_WORKFLOW_0957.cameraFacing==="environment"?"Rear camera":"Selectable camera"} · ${QUICK_PHOTO_WORKFLOW_0957.defaultUseOverlay?"Overlay on":"Overlay off"} · ${QUICK_PHOTO_WORKFLOW_0957.allowAccountChange?"Account change allowed":"Account locked"} · ${QUICK_PHOTO_WORKFLOW_0957.showCategory?"Categories shown":"Category hidden"}</span></div>
      <div class="architectureActions0953"><button class="ghost" id="downloadWorkflowSchema0957">Download Workflow Schema</button></div>
    `,"orange")}
    ${settingsSection540("Configurable brand system","Theme Profile",`${themeProfileSummary(APP_PROFILE).name} supplies the shared app shell with brand assets, semantic colors, typography, shape, and mobile browser chrome.`, `
      <div class="themeProfileMetrics0958"><div><strong>${esc(themeProfileSummary(APP_PROFILE).mode)}</strong><span>Mode</span></div><div><strong>${esc(themeProfileSummary(APP_PROFILE).accent)}</strong><span>Accent</span></div><div><strong>${themeProfileSummary(APP_PROFILE).brandAssets}</strong><span>Brand assets</span></div><div><strong>${themeProfileSummary(APP_PROFILE).radius}px</strong><span>Radius</span></div></div>
      <div class="themeProfilePreview0958" style="--theme-preview-accent:${esc(ACTIVE_THEME_0958.colors.accent)};--theme-preview-bg:${esc(ACTIVE_THEME_0958.colors.background)};--theme-preview-surface:${esc(ACTIVE_THEME_0958.colors.surface)};--theme-preview-text:${esc(ACTIVE_THEME_0958.colors.text)}">
        <div><img src="${esc(themeBrandAsset(APP_PROFILE,"mark"))}?v=${BUILD}" alt=""><span>${fireVaultBrand575()}</span><small>${esc(ACTIVE_THEME_0958.branding.tagline)}</small></div>
        <button type="button">Primary action</button>
      </div>
      <div class="themeTokenGrid0958">${Object.entries(ACTIVE_THEME_0958.colors).map(([key,value])=>`<span><i style="background:${esc(value)}"></i><b>${esc(key)}</b><code>${esc(value)}</code></span>`).join("")}</div>
      <div class="architectureActions0953"><button class="ghost" id="downloadThemeProfile0958">Download Theme Profile</button></div>
    `,"violet")}
    ${settingsSection540("Configurable content system","Data Sources & Content Packs",`${contentPackSummary(APP_PROFILE).packs} active packs use ${contentPackSummary(APP_PROFILE).sources} approved sources and create ${contentPackSummary(APP_PROFILE).libraryFolders} reusable Library folders.`, `
      <div class="contentPackMetrics0959"><div><strong>${contentPackSummary(APP_PROFILE).sources}</strong><span>Sources</span></div><div><strong>${contentPackSummary(APP_PROFILE).packs}</strong><span>Active packs</span></div><div><strong>${contentPackSummary(APP_PROFILE).libraryFolders}</strong><span>Library folders</span></div><div><strong>${contentPackSummary(APP_PROFILE).offlineSources}</strong><span>Offline sources</span></div></div>
      <div class="contentSourceGrid0959">${activeContentSources(APP_PROFILE).map(source=>`<article><span>${esc(CONTENT_SOURCE_TYPES[source.type]?.label||source.type)}</span><strong>${esc(source.name)}</strong><p>${esc(source.description)}</p><small>${source.offline?"Offline ready":"Online source"} · ${source.readOnly?"Read only":"User managed"}</small></article>`).join("")}</div>
      <div class="contentPackGrid0959">${activeContentPacks(APP_PROFILE).map(pack=>`<article><div><strong>${esc(pack.name)}</strong><em>${esc(pack.classification)}</em></div><p>${esc(pack.description)}</p><span>${(pack.folderNames||[]).map(folder=>`<b>${esc(folder)}</b>`).join("")||"No default folders"}</span><small>${esc(pack.sourceId)} · ${pack.appForgeReady?"AppForge ready":"Vertical pack"}</small></article>`).join("")}</div>
      <div class="contentPolicy0959"><strong>Update policy</strong><span>${esc(ACTIVE_CONTENT_PROFILE_0959.updatePolicy.mode)} · ${ACTIVE_CONTENT_PROFILE_0959.updatePolicy.verifyManifests?"Verify manifests":"Manifest verification off"} · ${ACTIVE_CONTENT_PROFILE_0959.updatePolicy.keepPreviousVersion?"Keep previous version":"Replace previous version"}</span></div>
      <div class="architectureActions0953"><button class="ghost" id="downloadContentPackRegistry0959">Download Content Pack Registry</button></div>
    `,"cyan")}
    ${settingsSection540("Configurable storage system","Sync & Storage Profile",`${syncStorageSummary(APP_PROFILE).providers} approved providers support an offline-first vault, ${syncStorageSummary(APP_PROFILE).backupDestinations} backup destinations, and ${esc(syncStorageSummary(APP_PROFILE).collaborationMode)} collaboration.`, `
      <div class="syncStorageMetrics0960"><div><strong>${syncStorageSummary(APP_PROFILE).providers}</strong><span>Providers</span></div><div><strong>${syncStorageSummary(APP_PROFILE).offlineProviders}</strong><span>Offline</span></div><div><strong>${syncStorageSummary(APP_PROFILE).remoteProviders}</strong><span>Remote</span></div><div><strong>${syncStorageSummary(APP_PROFILE).backupDestinations}</strong><span>Backups</span></div></div>
      <div class="syncStorageProviderGrid0960">${activeStorageProviders(APP_PROFILE).map(provider=>`<article><div><strong>${esc(provider.name)}</strong><em>${esc(provider.status)}</em></div><p>${esc(STORAGE_PROVIDER_TYPES[provider.type]?.description||provider.type)}</p><span>${provider.roles.map(role=>`<b>${esc(STORAGE_ROLES[role]?.label||role)}</b>`).join("")}</span><small>${provider.offline?"Offline ready":"Remote provider"} · ${esc(provider.credentials)}</small></article>`).join("")}</div>
      <div class="syncStoragePolicy0960"><section><strong>Local foundation</strong><span>${esc(ACTIVE_SYNC_STORAGE_PROFILE_0960.local.vaultBackend)} vault · ${esc(ACTIVE_SYNC_STORAGE_PROFILE_0960.local.mediaBackend)} media · ${ACTIVE_SYNC_STORAGE_PROFILE_0960.local.offlineFirst?"Offline first":"Online first"}</span></section><section><strong>Backup policy</strong><span>${ACTIVE_SYNC_STORAGE_PROFILE_0960.backup.automaticSnapshots?"Automatic snapshots":"Manual only"} · keep ${ACTIVE_SYNC_STORAGE_PROFILE_0960.backup.snapshotLimit} · ${ACTIVE_SYNC_STORAGE_PROFILE_0960.backup.verifyBeforeRestore?"verify restore":"no verification"}</span></section><section><strong>Collaboration</strong><span>${esc(ACTIVE_SYNC_STORAGE_PROFILE_0960.collaboration.mode)} · ${esc(ACTIVE_SYNC_STORAGE_PROFILE_0960.collaboration.conflictPolicy)} · ${ACTIVE_SYNC_STORAGE_PROFILE_0960.collaboration.queueOffline?"offline queue":"online only"}</span></section><section><strong>Credential safety</strong><span>${ACTIVE_SYNC_STORAGE_PROFILE_0960.security.storeCredentialsInVault?"Credentials in vault":"Credentials excluded"} · ${ACTIVE_SYNC_STORAGE_PROFILE_0960.security.preserveLocalCopy?"preserve local copy":"remote may replace local"}</span></section></div>
      <div class="architectureActions0953"><button class="ghost" id="downloadSyncStorageProfile0960">Download Sync & Storage Profile</button></div>
    `,"teal")}
    ${settingsSection540("Portable product definition","AppForge Blueprint",`${ACTIVE_APP_FORGE_READINESS_0970.checksPassed} of ${ACTIVE_APP_FORGE_READINESS_0970.checksTotal} architecture checks pass. Identity, modules, fields, workflows, branding, content, and storage can now travel together as one validated build input.`, `
      <div class="appForgeReadiness0970 ${ACTIVE_APP_FORGE_READINESS_0970.ready?"ready":"blocked"}"><div><span>${ACTIVE_APP_FORGE_READINESS_0970.ready?"READY":"REVIEW"}</span><strong>${esc(APP_PROFILE.name)} product blueprint</strong><small>Schema ${APP_FORGE_BLUEPRINT_SCHEMA_VERSION} · Build ${BUILD}</small></div><em>${ACTIVE_APP_FORGE_READINESS_0970.checksPassed}/${ACTIVE_APP_FORGE_READINESS_0970.checksTotal}</em></div>
      <div class="appForgeMetrics0970"><div><strong>${ACTIVE_APP_FORGE_READINESS_0970.enabledModules}</strong><span>Enabled modules</span></div><div><strong>${ACTIVE_APP_FORGE_READINESS_0970.reusableModules}</strong><span>Reusable</span></div><div><strong>${ACTIVE_APP_FORGE_READINESS_0970.verticalModules}</strong><span>Vertical</span></div><div><strong>${ACTIVE_APP_FORGE_READINESS_0970.checksPassed}</strong><span>Checks passed</span></div></div>
      <div class="appForgeChecks0970">${ACTIVE_APP_FORGE_VALIDATION_0970.checks.map(check=>`<article class="${check.ok?"pass":"fail"}"><i>${check.ok?"✓":"!"}</i><div><strong>${esc(check.label)}</strong><span>${esc(check.detail)}</span></div></article>`).join("")}</div>
      <div class="appForgeContract0970"><strong>One file replaces manual assembly</strong><span>The download contains the App Profile plus the module registry, UI bindings, record schema, workflow schema, Theme Profile, Content Pack Registry, and Sync & Storage Profile with their contract versions.</span></div>
      <div class="architectureActions0953"><button class="primary" id="downloadAppForgeBlueprint0970">Download AppForge Blueprint</button></div>
    `,"green")}
    ${settingsSection540("Factory proof","AppForge Product Recipes",`${APP_FORGE_RECIPE_SUMMARY_0980.blueprintReady} of ${APP_FORGE_RECIPE_SUMMARY_0980.total} recipes pass the architecture gate. Alternate recipes are downloadable build definitions only and never change the active FireVault app or vault.`, `
      <div class="appForgeRecipeMetrics0980"><div><strong>${APP_FORGE_RECIPE_SUMMARY_0980.total}</strong><span>Recipes</span></div><div><strong>${APP_FORGE_RECIPE_SUMMARY_0980.blueprintReady}</strong><span>Blueprint ready</span></div><div><strong>${APP_FORGE_RECIPE_SUMMARY_0980.foundation}</strong><span>Foundation</span></div><div><strong>${APP_FORGE_RECIPE_SUMMARY_0980.publishReady}</strong><span>Publish ready</span></div></div>
      <div class="appForgeRecipeGrid0980">${APP_FORGE_RECIPES_0980.map(recipe=>`<article style="--recipe-accent:${esc(recipe.profile.appearance?.accent||"#64748b")}"><header><span>${esc(recipe.category)}</span><em>${recipe.status==="active"?"ACTIVE":"FOUNDATION"}</em></header><h3>${esc(recipe.name)}</h3><p>${esc(recipe.description)}</p><div class="appForgeRecipeFacts0980"><span><b>${recipe.profile.enabledModules.length}</b> modules</span><span><b>${recipe.validation.passed}/${recipe.validation.total}</b> checks</span><span><b>${recipe.profile.content?.enabledPackIds?.length||0}</b> packs</span></div><div class="appForgeRecipeState0980 ${recipe.validation.ready?"ready":"blocked"}"><i>${recipe.validation.ready?"✓":"!"}</i><span>${recipe.validation.ready?"Blueprint configuration passes":"Blueprint needs review"}</span></div>${recipe.requirements.length?`<div class="appForgeRecipeRequirements0980"><strong>Before publication</strong>${recipe.requirements.map(item=>`<span>${esc(item)}</span>`).join("")}</div>`:`<div class="appForgeRecipeRequirements0980 complete"><strong>Current product</strong><span>Uses production FireVault assets and the active customer vault.</span></div>`}<button class="${recipe.status==="active"?"ghost":"primary"}" data-appforge-recipe="${esc(recipe.id)}">Download ${esc(recipe.name)} Blueprint</button></article>`).join("")}</div>
      <div class="appForgeRecipeNotice0980"><strong>FireVault stays FireVault</strong><span>Downloading a recipe or generating its PWA package does not switch terminology, branding, modules, storage, or customer data in this installation.</span></div>
      <div class="architectureActions0953"><button class="ghost" id="downloadAppForgeRecipeCatalog0980">Download Complete Recipe Catalog</button></div>
    `,"orange")}
    ${settingsSection540("Deterministic build handoff","AppForge Factory Manifest",`${APP_FORGE_FACTORY_SUMMARY_0990.factoryReady} of ${APP_FORGE_FACTORY_SUMMARY_0990.total} recipes produce valid generation requests and composed profiles. Each manifest separates what the factory can generate from the assets, databases, and native projects still required.`, `
      <div class="appForgeFactoryMetrics0990"><div><strong>${APP_FORGE_FACTORY_SUMMARY_0990.total}</strong><span>Manifests</span></div><div><strong>${APP_FORGE_FACTORY_SUMMARY_0990.factoryReady}</strong><span>Factory ready</span></div><div><strong>${APP_FORGE_FACTORY_SUMMARY_0990.publicationReady}</strong><span>Publish ready</span></div><div><strong>${APP_FORGE_FACTORY_SUMMARY_0990.outputItems}</strong><span>Output records</span></div></div>
      <div class="appForgeFactoryFlow0990"><span><b>1</b><strong>Recipe</strong><small>Known starting profile</small></span><i>→</i><span><b>2</b><strong>Request</strong><small>Normalized inputs</small></span><i>→</i><span><b>3</b><strong>Validate</strong><small>Request + blueprint gates</small></span><i>→</i><span><b>4</b><strong>Manifest</strong><small>Outputs + requirements</small></span></div>
      <div class="appForgeFactoryList0990">${APP_FORGE_FACTORY_MANIFESTS_0990.map(manifest=>`<article><div class="appForgeFactoryIdentity0990"><i class="${manifest.readiness.publicationReady?"publish":"pending"}">${manifest.readiness.publicationReady?"✓":"!"}</i><div><strong>${esc(manifest.recipe.name)}</strong><span>${manifest.readiness.publicationReady?"Factory and publication ready":"Factory ready · publication inputs pending"}</span></div></div><div class="appForgeFactoryFacts0990"><span><b>${manifest.validation.request.passed}/${manifest.validation.request.total}</b> request</span><span><b>${manifest.validation.profile.passed}/${manifest.validation.profile.total}</b> profile</span><span><b>${manifest.outputs.length}</b> outputs</span><span><b>${manifest.requirements.requiredOutputs.length}</b> required</span></div><div class="appForgeFactoryRequirements0990">${manifest.requirements.requiredOutputs.length?manifest.requirements.requiredOutputs.map(id=>`<span>${esc(manifest.outputs.find(output=>output.id===id)?.name||id)}</span>`).join(""):`<span class="complete">No missing factory inputs</span>`}</div><div class="appForgeFactoryActions0990"><button class="ghost" data-appforge-factory-request="${esc(manifest.recipe.id)}">Request Template</button><button class="primary" data-appforge-factory-manifest="${esc(manifest.recipe.id)}">Factory Manifest</button></div></article>`).join("")}</div>
      <div class="appForgeFactoryGuardrail0990"><strong>Factory safety contract</strong><span>Active app unchanged · customer data excluded · credentials excluded · no recipe activation · no automatic publishing</span></div>
      <div class="architectureActions0953"><button class="ghost" id="downloadAppForgeFactorySchema0990">Download Factory Request Schema</button></div>
    `,"cyan")}
    ${(APP_PROFILE.enabledModules||[]).includes("core.appForgeGenerator")?settingsSection540("Working package generation","AppForge Generator Engine",`${APP_FORGE_GENERATOR_SUMMARY_1000.packageReady} of ${APP_FORGE_GENERATOR_SUMMARY_1000.total} recipes can now be assembled locally into separate installable PWA ZIP packages. FireVault is a release candidate; alternate products remain prototypes until their stated assets and verified databases are supplied.`, `
      <div class="appForgeGeneratorMetrics1000"><div><strong>${APP_FORGE_GENERATOR_SUMMARY_1000.total}</strong><span>Products</span></div><div><strong>${APP_FORGE_GENERATOR_SUMMARY_1000.packageReady}</strong><span>PWA ready</span></div><div><strong>${APP_FORGE_GENERATOR_SUMMARY_1000.releaseCandidates}</strong><span>Release candidate</span></div><div><strong>${APP_FORGE_GENERATOR_SUMMARY_1000.sourceFiles}</strong><span>Core source files</span></div></div>
      <div class="appForgeGeneratorFlow1000"><span><b>1</b>Load core</span><i>→</i><span><b>2</b>Inject profile</span><i>→</i><span><b>3</b>Isolate storage</span><i>→</i><span><b>4</b>Package ZIP</span></div>
      <div class="appForgeGeneratorGrid1000">${APP_FORGE_GENERATOR_PLANS_1000.map(plan=>`<article style="--generator-accent:${esc(plan.profile.appearance?.accent||"#64748b")}"><header><div><strong>${esc(plan.product.name)}</strong><span>${esc(plan.recipe.id)}</span></div><em class="${plan.publicationReady?"release":"prototype"}">${plan.publicationReady?"RELEASE CANDIDATE":"PROTOTYPE"}</em></header><div class="appForgeGeneratorChecks1000"><span><b>${plan.validation.request.passed}/${plan.validation.request.total}</b> request</span><span><b>${plan.validation.profile.passed}/${plan.validation.profile.total}</b> profile</span><span><b>${plan.storageNamespace}</b> storage</span></div>${plan.requirements.length?`<div class="appForgeGeneratorPending1000"><strong>Publication inputs pending</strong>${plan.requirements.map(item=>`<span>${esc(item)}</span>`).join("")}</div>`:`<div class="appForgeGeneratorPending1000 complete"><strong>Ready for parity testing</strong><span>Production assets assigned; package contains no active vault data.</span></div>`}<button class="primary" data-appforge-generate-pwa="${esc(plan.recipe.id)}">Generate ${esc(plan.product.shortName||plan.product.name)} PWA ZIP</button></article>`).join("")}</div>
      <div class="appForgeGeneratorStatus1000" id="appForgeGeneratorStatus1000" role="status" aria-live="polite"><i>✓</i><span><strong>Generator standing by</strong><small>Package assembly stays in this browser and never reads FireVault localStorage or IndexedDB.</small></span></div>
      <div class="appForgeFactoryGuardrail0990"><strong>Generation safety contract</strong><span>Separate ZIP · isolated storage namespace · customer data and media excluded · credentials excluded · no automatic publishing</span></div>
      <div class="architectureActions0953"><button class="ghost" id="downloadAppForgeGeneratorSchema1000">Download Generator Contract</button></div>
    `,"green"):""}
    ${settingsSection540("Architecture inventory","Module Registry",`${summary.total} registered modules are explicitly separated into shared core, reusable optional, and FireVault-specific layers.`,`
      <div class="architectureMetrics0953"><div><strong>${summary.core}</strong><span>Core</span></div><div><strong>${summary.optional}</strong><span>Reusable</span></div><div><strong>${summary.firevault}</strong><span>FireVault</span></div><div><strong>${summary.appForgeReady}</strong><span>AppForge ready</span></div></div>
      <div class="architectureLegend0953">${grouped.map(group=>`<span class="class-${group.kind}"><b>${esc(group.meta.label)}</b>${esc(group.meta.description)}</span>`).join("")}</div>
      ${grouped.map(group=>`<section class="architectureGroup0953"><div><h3>${esc(group.meta.label)}</h3><span>${group.modules.length} module${group.modules.length===1?"":"s"}</span></div><div class="architectureModuleGrid0953">${group.modules.map(architectureModuleCard0953).join("")}</div></section>`).join("")}
    `,"blue")}
    ${settingsSection540("Future app planning","Feature & App Matrix","This matrix is the rulebook for deciding whether each change belongs in the shared core, a reusable module, or the FireVault vertical layer.",`
      <div class="architectureMatrixScroll0953"><table class="architectureMatrix0953"><thead><tr><th>Module</th><th>Class</th>${FUTURE_APP_COLUMNS.map(app=>`<th>${esc(app.label)}</th>`).join("")}<th>AppForge</th></tr></thead><tbody>${matrix.map(row=>`<tr><td><strong>${esc(row.module)}</strong><small>${esc(row.id)}</small></td><td>${esc(row.classification)}</td>${FUTURE_APP_COLUMNS.map(app=>`<td class="matrixCheck0953 ${row[app.key]?"yes":"no"}">${row[app.key]?"✓":"—"}</td>`).join("")}<td class="matrixCheck0953 ${row.appForgeReady?"yes":"no"}">${row.appForgeReady?"✓":"Vertical"}</td></tr>`).join("")}</tbody></table></div>
      <div class="architectureActions0953"><button class="primary" id="downloadArchitectureMatrix0953">Download Matrix CSV</button><button class="ghost" id="downloadAppProfile0953">Download App Profile</button><button class="ghost" id="downloadModuleRegistry0953">Download Module Registry</button><button class="ghost" id="downloadModuleBindings0955">Download UI Bindings</button><button class="ghost" id="copyArchitectureSummary0953">Copy Summary</button></div>
    `,"violet")}
    <div class="settingsInfo540"><strong>Development rule</strong><span>Every future feature should identify its layer before implementation: Core, Reusable optional, or FireVault-specific. FireVault usefulness for fire alarm technicians remains the first requirement.</span></div>
  </div>`;
}
function wireArchitecture0953(){
  document.getElementById("downloadArchitectureMatrix0953")?.addEventListener("click",()=>{downloadBlob(`firevault-feature-module-matrix-build-${BUILD}.csv`,architectureMatrixCsv0953(),"text/csv");toast("Feature matrix downloaded.","success");});
  document.getElementById("downloadAppProfile0953")?.addEventListener("click",()=>{downloadBlob(`firevault-app-profile-build-${BUILD}.json`,JSON.stringify(appProfileExport(),null,2),"application/json");toast("App Profile downloaded.","success");});
  document.getElementById("downloadModuleRegistry0953")?.addEventListener("click",()=>{downloadBlob(`firevault-module-registry-build-${BUILD}.json`,JSON.stringify(moduleRegistryExport(),null,2),"application/json");toast("Module Registry downloaded.","success");});
  document.getElementById("downloadModuleBindings0955")?.addEventListener("click",()=>{downloadBlob(`firevault-module-bindings-build-${BUILD}.json`,JSON.stringify(moduleBindingsExport(),null,2),"application/json");toast("UI module bindings downloaded.","success");});
  document.getElementById("downloadRecordSchema0956")?.addEventListener("click",()=>{downloadBlob(`firevault-record-schema-build-${BUILD}.json`,JSON.stringify(recordSchemaExport(APP_PROFILE),null,2),"application/json");toast("Record schema downloaded.","success");});
  document.getElementById("downloadWorkflowSchema0957")?.addEventListener("click",()=>{downloadBlob(`firevault-workflow-schema-build-${BUILD}.json`,JSON.stringify(workflowSchemaExport(APP_PROFILE),null,2),"application/json");toast("Workflow schema downloaded.","success");});
  document.getElementById("downloadThemeProfile0958")?.addEventListener("click",()=>{downloadBlob(`firevault-theme-profile-build-${BUILD}.json`,JSON.stringify(themeProfileExport(APP_PROFILE),null,2),"application/json");toast("Theme profile downloaded.","success");});
  document.getElementById("downloadContentPackRegistry0959")?.addEventListener("click",()=>{downloadBlob(`firevault-content-pack-registry-build-${BUILD}.json`,JSON.stringify(contentPackRegistryExport(APP_PROFILE),null,2),"application/json");toast("Content pack registry downloaded.","success");});
  document.getElementById("downloadSyncStorageProfile0960")?.addEventListener("click",()=>{downloadBlob(`firevault-sync-storage-profile-build-${BUILD}.json`,JSON.stringify(syncStorageProfileExport(APP_PROFILE),null,2),"application/json");toast("Sync and storage profile downloaded.","success");});
  document.getElementById("downloadAppForgeBlueprint0970")?.addEventListener("click",()=>{downloadBlob(`firevault-appforge-blueprint-build-${BUILD}.json`,JSON.stringify(appForgeBlueprintExport(APP_PROFILE,BUILD),null,2),"application/json");toast("Validated AppForge Blueprint downloaded.","success");});
  document.querySelectorAll("[data-appforge-recipe]").forEach(button=>button.addEventListener("click",()=>{const id=button.dataset.appforgeRecipe;const blueprint=appForgeRecipeBlueprintExport(id,BUILD);if(!blueprint){toast("Recipe is unavailable.","error");return;}downloadBlob(`${id}-appforge-blueprint-build-${BUILD}.json`,JSON.stringify(blueprint,null,2),"application/json");toast(`${blueprint.product.name} Blueprint downloaded.`,"success");}));
  document.getElementById("downloadAppForgeRecipeCatalog0980")?.addEventListener("click",()=>{downloadBlob(`appforge-product-recipe-catalog-build-${BUILD}.json`,JSON.stringify(appForgeRecipeCatalogExport(),null,2),"application/json");toast("AppForge recipe catalog downloaded.","success");});
  document.querySelectorAll("[data-appforge-factory-request]").forEach(button=>button.addEventListener("click",()=>{const id=button.dataset.appforgeFactoryRequest;const request=createAppForgeGenerationRequest(id);downloadBlob(`${id}-appforge-generation-request-build-${BUILD}.json`,JSON.stringify(request,null,2),"application/json");toast(`${request.product.name} request template downloaded.`,"success");}));
  document.querySelectorAll("[data-appforge-factory-manifest]").forEach(button=>button.addEventListener("click",()=>{const id=button.dataset.appforgeFactoryManifest;const manifest=appForgeFactoryManifest(id,BUILD);if(!manifest){toast("Factory manifest is unavailable.","error");return;}downloadBlob(`${id}-appforge-factory-manifest-build-${BUILD}.json`,JSON.stringify(manifest,null,2),"application/json");toast(`${manifest.recipe.name} Factory Manifest downloaded.`,"success");}));
  document.getElementById("downloadAppForgeFactorySchema0990")?.addEventListener("click",()=>{downloadBlob(`appforge-factory-request-schema-build-${BUILD}.json`,JSON.stringify(appForgeFactorySchemaExport(),null,2),"application/json");toast("Factory request schema downloaded.","success");});
  document.querySelectorAll("[data-appforge-generate-pwa]").forEach(button=>button.addEventListener("click",async()=>{
    const id=button.dataset.appforgeGeneratePwa;const status=document.getElementById("appForgeGeneratorStatus1000");const buttons=[...document.querySelectorAll("[data-appforge-generate-pwa]")];
    buttons.forEach(item=>item.disabled=true);button.textContent="Generating…";
    const update=message=>{if(status)status.innerHTML=`<i>↻</i><span><strong>${esc(message)}</strong><small>The source app and local vault remain unchanged.</small></span>`;};
    try{
      const result=await generateAppForgePwaPackage(id,BUILD,{}, {onProgress:progress=>{if(progress.phase==="source")update(`Loading ${progress.current} of ${progress.total}: ${progress.path}`);else update("Building deterministic ZIP archive…");}});
      downloadBlob(result.fileName,result.blob,"application/zip");
      if(status)status.innerHTML=`<i>✓</i><span><strong>${esc(result.plan.product.name)} package generated</strong><small>${result.entries.length} files · ${result.plan.packageState.replaceAll("-"," ")} · customer data excluded</small></span>`;
      toast(`${result.plan.product.name} PWA package downloaded.`,"success");
    }catch(error){if(status)status.innerHTML=`<i>!</i><span><strong>Package generation stopped</strong><small>${esc(error?.message||"Generator error")}</small></span>`;toast(error?.message||"PWA package could not be generated.","error");}
    finally{buttons.forEach(item=>item.disabled=false);button.textContent=`Generate ${appForgeGeneratorPlan(id,BUILD)?.product?.shortName||id} PWA ZIP`;}
  }));
  document.getElementById("downloadAppForgeGeneratorSchema1000")?.addEventListener("click",()=>{downloadBlob(`appforge-generator-contract-build-${BUILD}.json`,JSON.stringify(appForgeGeneratorSchemaExport(),null,2),"application/json");toast("Generator contract downloaded.","success");});
  document.getElementById("copyArchitectureSummary0953")?.addEventListener("click",async()=>{try{await navigator.clipboard.writeText(architectureSummaryText0953());toast("Architecture summary copied.","success");}catch{toast("Clipboard unavailable.","error");}});
}

function settingsPanel(){
  const s=data.settings, t=s.theme, tech=s.technician, email=s.email, r=s.reports, o=s.overlay, a=s.advanced, gps=s.gps||{};
  const saveButton=(label="Save")=>`<button class="primary saveMini" id="saveSettings">${esc(label)}</button>`;

  if(settingsTab==="tech"){
    technicianOverlayFieldState0946=technicianOverlayNormalize0946(s.technicianOverlay?.fields);
    technicianOverlayGroupAlign0948=technicianOverlaySavedAlignment0948();
    return `<div class="settingsStack settingsStack540 technicianSettingsStack0947">
      ${technicianSection0947("photo","Profile photo","Technician Photo","Add a clear head-and-shoulders image for your technician profile.",technicianPhotoMarkup0947(),"red")}
      ${technicianSection0947("identity","Identity","Technician Profile","Name and company are reused throughout reports, templates, and field records.",`<div class="settingsGrid settingsGrid540">${fieldBlock("Technician name",`<input id="techName" autocomplete="name" value="${esc(tech.name)}">`)}${fieldBlock("Company",`<input id="techCompany" autocomplete="organization" value="${esc(tech.company)}">`)}</div><div class="technicianSectionActions0947"><button type="button" class="primary" data-save-technician-section="identity">Save Identity</button></div>`,"blue")}
      ${technicianSection0947("contact","Contact","Contact & Credentials","Phone and email complete the section. License or employee ID remains optional.",`<div class="settingsGrid settingsGrid540">${fieldBlock("Phone",`<input id="techPhone" autocomplete="tel" inputmode="tel" value="${esc(formatPhone0758(tech.phone)||tech.phone)}">`)}${fieldBlock("Email",`<input id="techEmail" autocomplete="email" inputmode="email" value="${esc(tech.email)}">`)}${fieldBlock("License / ID",`<input id="techLicense" value="${esc(tech.license)}">`,`Optional identifier shown on reports`)}</div><div class="technicianSectionActions0947"><button type="button" class="primary" data-save-technician-section="contact">Save Contact</button></div>`,"cyan")}
      ${technicianSection0947("template","Photo overlay","Technician Overlay Template","Build the Technician Info block once, then add it from Photo Overlay with one tap.",`
        <div class="technicianOverlayTemplate0946 overlayFieldBuilder0944">
          <div class="technicianOverlayTemplateHead0946"><div><strong>Template preview</strong><small>Uses your Profile information when available.</small></div><em class="overlayAutoSave0944" id="technicianOverlayAutoSave0946" data-state="saved">Saved automatically</em></div>
          <div id="technicianOverlayPreview0946">${technicianOverlayPreviewMarkup0946()}</div>
          <div class="technicianOverlayAlignmentCard0948"><div><strong>Group alignment</strong><small>Place the complete Technician Info block flush left, centered, or flush right.</small></div><div id="technicianOverlayGroupAlign0948">${technicianOverlayGroupAlignmentMarkup0948()}</div></div>
          <div class="overlayBuilderGroup0944"><div class="overlayBuilderTitle0944"><div><strong>Technician fields</strong><small>Reorder fields and choose where each new line begins.</small></div><button type="button" class="ghost technicianOverlayReset0946" id="technicianOverlayReset0946">Reset</button></div><div class="overlayActiveFields0944" id="technicianOverlayActive0946">${technicianOverlayActiveMarkup0946()}</div></div>
          <div class="overlayBuilderGroup0944"><div class="overlayBuilderTitle0944"><strong>Add profile field</strong><small>Added fields are checked.</small></div><div class="overlayFieldGrid510" id="technicianOverlayAvailable0946">${technicianOverlayAvailableMarkup0946()}</div></div>
        </div>`,"violet")}
    </div>`;
  }

  if(settingsTab==="reports") return `<div class="settingsStack settingsStack540">
    ${settingsSection540("Document setup","Report Defaults","Choose the title and level of detail FireVault uses for new service reports.",`<div class="settingsGrid settingsGrid540">${fieldBlock("Report title",`<input id="reportTitle" value="${esc(r.title)}">`)}${fieldBlock("Report format",`<select id="reportFormat"><option value="detailed" ${r.format==="detailed"?"selected":""}>Detailed</option><option value="compact" ${r.format==="compact"?"selected":""}>Compact</option></select>`,`Detailed includes more site history; Compact is faster to review.`)}</div>`,"violet",saveButton())}
    ${settingsSection540("Included content","Report Sections","Control which information is added automatically when a report is generated.",`<div class="settingsList settingsToggleList540">${checkBlock("repTech","Include technician profile",r.includeTechnician)}${checkBlock("repTasks","Include open and completed tasks",r.includeTasks)}${checkBlock("repDef","Include deficiencies",r.includeDeficiencies)}</div>`,"purple")}
  </div>`;

  if(settingsTab==="email") return emailSettingsPanel(email);
  if(settingsTab==="overlay") return overlaySettingsPanel510(o);

  if(settingsTab==="plusCodes") return plusCodesPanel0794();

  if(settingsTab==="gps") return `<div class="settingsStack settingsStack540">
    ${settingsSection540("Navigation","Map Preferences","Set the map service, GPS accuracy, and distance used for nearby-account detection.",`<div class="settingsGrid settingsGrid540">${fieldBlock("Default map",`<select id="gpsMapProvider"><option value="apple" ${gps.mapProvider!=="google"?"selected":""}>Apple Maps</option><option value="google" ${gps.mapProvider==="google"?"selected":""}>Google Maps</option></select>`)}${fieldBlock("GPS accuracy",`<select id="gpsHighAccuracy"><option value="true" ${gps.highAccuracy!==false?"selected":""}>High accuracy</option><option value="false" ${gps.highAccuracy===false?"selected":""}>Standard</option></select>`)}${fieldBlock("Nearby radius",`<input id="gpsNearbyRadius" inputmode="decimal" value="${esc(gps.nearbyRadiusMiles||1)}">`,`Distance in miles used by Nearby Accounts`)}</div>`,"green",saveButton())}
    ${settingsSection540("Availability","GPS Tools","Choose where location controls and saved coordinates are available.",`<div class="settingsList settingsToggleList540">${checkBlock("gpsEnabled","Show GPS capture buttons on site pages",gps.enabled!==false)}${checkBlock("gpsReports","Include GPS coordinates in reports",gps.includeInReports!==false)}</div><div class="settingsInfo540"><strong>Location permission required</strong><span>Browser GPS works only when FireVault is served over HTTPS and location access is allowed on the device.</span></div>`,"teal")}
  </div>`;

  if(settingsTab==="demo") return demoModePanel0738();

  if(settingsTab==="webdav") return webdavPanel0757();
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
  if(settingsTab==="privacy") return privacyLockPanel0791();

  if(settingsTab==="security") return securityFoundationPanel0790();
  if(settingsTab==="cloudFiles") return cloudFileStoragePanel0794();
  if(settingsTab==="microsoftStorage") return microsoftStoragePanel0795();
  if(settingsTab==="backend") return backendFoundationPanel0793();

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
  if(settingsTab==="architecture") return architecturePanel0953();

  if(settingsTab==="updates") return `<div class="settingsStack settingsStack540 updateCenter072">
    ${settingsSection540("Installed version","FireVault Updates","FireVault checks the published site for newer app files while preserving your locally stored vault.",`<div class="updateBuild072"><div><strong>${BUILD}</strong><span>Installed build</span></div><div id="updateState072"><strong>Ready</strong><span>Automatic checks enabled</span></div></div>`,"green")}
    ${settingsSection540("Update controls","Maintenance","Use Check for Updates first. Clear App Cache removes only downloaded app files—it does not delete sites, notes, photos, or settings stored in FireVault.",`<div class="updateActions072"><button class="primary" id="checkUpdates072">Check for Updates</button><button class="ghost" id="reloadApp072">Reload FireVault</button><button class="ghost" id="clearAppCache072">Clear App Cache</button></div><p class="fieldNote">Home Screen PWAs still require an internet connection to receive a newly published build. Offline startup continues using the last successfully installed version.</p>`,"cyan")}
  </div>`;

  return `<div class="settingsStack settingsStack540">
    ${settingsSection540("Fire alarm field system",`About FireVault`,`A focused field application for fire alarm technicians.`,`<div class="aboutBrand540">${fireVaultBrand575()}<span>Field Vault System</span></div><p class="aboutCopy540">FireVault keeps account information, navigation, photos, documents, notes, backups, and field references together in one local-first workspace for fire alarm technicians.</p>`,"red")}
    ${settingsSection540("Application details","Build Information","Use these details when reporting a problem or confirming which version is installed.",`<div class="aboutGrid aboutGrid540"><div><strong>Build</strong><span>${BUILD}</span></div><div><strong>Storage key</strong><span>${demoStorageLabel0739()}</span></div><div class="wide"><strong>Data location</strong><span>Local vault on this device with rolling safety snapshots. Download an external backup before deleting or reinstalling the Home Screen app.</span></div></div>`,"slate")}
  </div>`;
}
function wireSettingsPanel(){
  if(settingsTab==="privacy"){wirePrivacyLock0791();return;}
  if(settingsTab==="security"){wireSecurityFoundation0790();return;}
  if(settingsTab==="cloudFiles"){wireCloudFileStorage0794();return;}
  if(settingsTab==="microsoftStorage"){wireMicrosoftStorage0795();return;}
  if(settingsTab==="plusCodes"){wirePlusCodes0794();return;}
  if(settingsTab==="backend"){wireBackendFoundation0793();return;}
  if(settingsTab==="webdav"){wireWebdav0757();return;}
  const saveBtn=document.getElementById("saveSettings"); if(saveBtn) saveBtn.onclick=saveSettings;
  if(settingsTab==="tech") wireTechnicianProfile0947();
  if(settingsTab==="overlay") wireOverlaySettings510();
  if(settingsTab==="demo") wireDemoMode0738();
  if(settingsTab==="manual") wireManual058();
  if(settingsTab==="customerImport") wireCustomerImport065();
  if(settingsTab==="categories") wireAccountCategories0737();
  if(settingsTab==="architecture"){wireArchitecture0953();return;}
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
    if(exportPackage) exportPackage.onclick=async()=>{ if(!await securityAuthorizeSensitive0792("export a Shared Vault package"))return; const exportVault=await prepareVaultWithMedia(data); const pkg=createSyncPackage(exportVault); const stamp=new Date().toISOString().slice(0,10); downloadBlob(`firevault-shared-vault-${stamp}.json`,JSON.stringify(pkg,null,2),"application/json"); notePackageExport(data,pkg); data=loadData(); settings(); toast("Shared Vault package exported and recorded."); };
    const importPackage=document.getElementById("importSyncPackage063");
    if(importPackage) importPackage.onchange=async e=>{ const file=e.target.files?.[0]; if(!file)return; if(!await securityAuthorizeSensitive0792("import a Shared Vault package")){e.target.value="";return;} const reader=new FileReader(); reader.onload=()=>{ try{ const stats=importSyncPackage(data,JSON.parse(reader.result)); data=loadData(); settings(); alert(`Shared Vault package imported.\n\nAdded: ${stats.added}\nUpdated: ${stats.updated}\nMatched: ${stats.matched}\nConflicts: ${stats.conflicts}\nLocal newer: ${stats.localNewer}`); }catch(err){ alert(err?.message||"Shared Vault import failed."); } }; reader.readAsText(file); };
    document.querySelectorAll("[data-resolve-conflict]").forEach(btn=>btn.onclick=()=>{ const choice=btn.dataset.resolveConflict; const id=btn.dataset.recordId; const label=choice==="remote"?"use the imported copy":"keep this device copy"; if(!confirm(`Resolve this conflict and ${label}?`)) return; try{ resolveSyncConflict(data,id,choice); data=loadData(); settings(); toast("Conflict resolved."); }catch(err){ alert(err?.message||"Conflict resolution failed."); } });
  }
  const exportBtn=document.getElementById("exportBtn"); if(exportBtn) exportBtn.onclick=async()=>{ if(!await securityAuthorizeSensitive0792("export the full FireVault backup"))return; const stamp=new Date().toISOString().slice(0,10); fvSafeSet0739("firevault_last_backup_export",new Date().toLocaleString()); const complete=await securitySafeVaultWithMedia0910(); downloadBlob(`firevault-backup-${stamp}-build-${BUILD}.json`, JSON.stringify(complete,null,2), "application/json"); recordSecurityEvent(data,"backup-exported",{fileName:`firevault-backup-${stamp}-build-${BUILD}.json`,mediaIncluded:true}); data=loadData(); toast("Complete backup exported with photos and documents.","success"); settings(); };
  const downloadAuto=document.getElementById("downloadAutoBackup0722"); if(downloadAuto) downloadAuto.onclick=async()=>{ if(!await securityAuthorizeSensitive0792("download the latest automatic snapshot"))return; const snapshot=latestAutoBackup(); if(!snapshot){toast("No automatic snapshot available.");return;} const stamp=new Date(snapshot.createdAt||Date.now()).toISOString().slice(0,19).replace(/[:T]/g,"-"); downloadBlob(`firevault-auto-backup-${stamp}-build-${snapshot.build||BUILD}.json`,JSON.stringify(snapshot,null,2),"application/json"); toast("Automatic snapshot downloaded."); };
  const restoreAuto=document.getElementById("restoreAutoBackup0722"); if(restoreAuto) restoreAuto.onclick=async()=>{ if(!await securityAuthorizeSensitive0792("restore the latest automatic snapshot"))return; const info=autoBackupInfo(); const latest=info.last; if(!latest){toast("No automatic snapshot available.");return;} if(!confirmSensitive0790("RESTORE",`Restore the latest automatic snapshot from ${new Date(latest.createdAt).toLocaleString()}? FireVault will preserve the current vault as another safety snapshot first.`)) return; try{ data=restoreAutoBackup(latest.key); applyTheme(); toast("Automatic snapshot restored."); route("home"); }catch(err){alert(err?.message||"Snapshot restore failed.");} };
  const copyBackupSummaryBtn=document.getElementById("copyBackupSummaryBtn"); if(copyBackupSummaryBtn) copyBackupSummaryBtn.onclick=async()=>{ try{ await navigator.clipboard.writeText(backupSummaryText()); toast("Backup summary copied."); }catch{ toast("Clipboard unavailable."); } };
  const importFile=document.getElementById("importFile"); if(importFile) importFile.onchange=async e=>{ const f=e.target.files[0]; if(!f)return; if(!await securityAuthorizeSensitive0792("restore a full FireVault backup file")){e.target.value="";return;} if(!confirmSensitive0790("RESTORE",`Replace the current FireVault vault with ${f.name}? A safety snapshot will be created first.`)){e.target.value="";return;} const r=new FileReader(); r.onload=()=>{try{const parsed=JSON.parse(r.result); const incoming=parsed?.data && Array.isArray(parsed.data.sites) ? parsed.data : parsed; if(!incoming || !Array.isArray(incoming.sites)) throw new Error("Invalid FireVault backup."); data=loadData(); Object.assign(data,incoming); recordSecurityEvent(data,"backup-imported",{fileName:f.name}); data=loadData(); applyTheme(); toast("Backup restored and audited.","success"); route("home");}catch(err){alert(err?.message||"Import failed.");}}; r.readAsText(f); };
  const resetBtn=document.getElementById("resetBtn"); if(resetBtn) resetBtn.onclick=async()=>{ const demo=isDemoMode(); if(!demo && !await securityAuthorizeSensitive0792("clear the local FireVault vault"))return; const promptText=demo?"Reset the fictional Demo Mode database to its original 20 Boise accounts?":"Clear the active FireVault vault on this browser? Export an external backup first."; const approved=demo?confirm(promptText):confirmSensitive0790("DELETE",promptText); if(approved){ if(demo) resetDemoData(); else localStorage.removeItem(KEY); data=loadData(); applyTheme(); route("home");} };
}
function saveSettings(){
  const s=data.settings;
  if(settingsTab==="tech") s.technician={...(s.technician||{}),name:val("techName"),company:val("techCompany"),phone:normalizePhoneValue0758(val("techPhone")),email:val("techEmail"),license:val("techLicense"),defaultRole:"Fire Alarm Technician"};
  if(settingsTab==="reports") s.reports={...s.reports,title:val("reportTitle")||"FireVault Service Report",format:val("reportFormat"),includeTechnician:checked("repTech"),includeTasks:checked("repTasks"),includeDeficiencies:checked("repDef")};
  if(settingsTab==="email") s.email={...s.email,defaultTo:val("emailTo"),cc:val("emailCc"),defaultSubject:val("emailSubject"),signature:raw("emailSig")};
  if(settingsTab==="overlay") s.overlay={...s.overlay,...collectOverlayFromInputs510()};
  if(settingsTab==="gps") s.gps={enabled:checked("gpsEnabled"),mapProvider:val("gpsMapProvider")||"apple",highAccuracy:val("gpsHighAccuracy")!=="false",includeInReports:checked("gpsReports"),nearbyRadiusMiles:Number(val("gpsNearbyRadius"))||1};
  if(settingsTab==="homeLayout") {
    const cards={};
    HOME_LAYOUT_CARDS_550.forEach(card=>cards[card.key]={visible:checked(`homeVisible_${card.key}`),behavior:val(`homeBehavior_${card.key}`)||"remember"});
    s.homeLayout={preset:"custom",cards};
  }
  if(settingsTab==="visibility") { s.app={...(s.app||{}),viewMode:val("viewMode")||"simple",activeFeaturePreset575:"",activeLayoutPreset575:""}; const next={...visibility()}; FEATURE_LABELS.forEach(([key])=>next[key]=checked("vis_"+key)); s.visibility=next; }
  if(settingsTab==="sync") s.sync={...(s.sync||{}),provider:val("syncProvider")||"onedrive",organization:val("syncOrganization"),workspace:val("syncWorkspace")||"FireVault Shared Vault",conflictPolicy:val("syncConflict")||"review",enabled:false};
  save(); toast("Settings saved."); view="settings"; mode="settingsDetail"; render();
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
  return {sites,openTasks,overdue,dueToday,openDef,attention,photos,selectedPhotos};
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
        <button id="focusAccounts561"><strong>${f.sites.length}</strong><span>Accounts</span></button>
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
    `Selected Report Photos: ${f.selectedPhotos}`
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
  const resources = (data.resources || []).length;
  const bytes = (()=>{ try{return new Blob([JSON.stringify(data)]).size;}catch{return 0;} })();
  return {sites,visits,docs,photoDocs,tasks,deficiencies,resources,bytes};
}
function backupFileName552(){
  const stamp = new Date().toISOString().slice(0,19).replace(/[:T]/g,"-");
  return `firevault-backup-${BUILD}-${stamp}.json`;
}
async function downloadVaultBackup552(){
  try{
    const complete=await prepareVaultWithMedia(data);
    const payload={app:"FireVault", build:BUILD, exportedAt:new Date().toISOString(), stats:backupSafetyStats552(), mediaIncluded:true, data:complete};
    const blob=new Blob([JSON.stringify(payload,null,2)],{type:"application/json"});
    const url=URL.createObjectURL(blob);
    const a=document.createElement("a");
    a.href=url;
    a.download=backupFileName552();
    document.body.appendChild(a);
    a.click();
    setTimeout(()=>{URL.revokeObjectURL(url); a.remove();},450);
    toast("Backup downloaded.");
    if(data.settings?.webdav?.enabled && data.settings?.webdav?.autoUpload && webdavPassword0757()) setTimeout(()=>uploadWebdavBackup0757(),250);
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
    "4. Check Home, Add Account, Backup Safety, and one saved account.",
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
  return {sites,visits,docs,photos,tasks,deficiencies};
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

function showChangelog(){
  const notes = [
    "Build 1.01.3 replaces the wrapping Account Detail Favorite label with a compact star-only control.",
    "The Favorite control keeps a 44px touch target and reports its add, remove, and selected states accessibly.",
    "Favorite behavior, account actions, workflows, and stored data remain unchanged.",
    "Build 1.01.2 polishes Photo Overlay with a clear Preview, Quick Setup, Fields, Layout, and Branding workflow.",
    "Field alignment, line placement, reordering, removal, presets, and branding now use larger labels, reliable SVG icons, and safer touch targets.",
    "Overlay presets, templates, exact-export rendering, auto-save behavior, photo workflows, and stored settings remain unchanged.",
    "Build 1.01.1 polishes Account Detail with larger field-ready controls, clearer account identity, simplified icon tabs, and stronger content hierarchy.",
    "Phone layouts use a compact scrollable tab rail while iPad expands to six full tabs and a balanced two-column Overview.",
    "Every Account Detail action, route, workflow, and stored-data contract remains unchanged.",
    "Build 1.01.0 simplifies Settings into six clear technician-focused areas without adding features or changing stored data.",
    "AppForge and Architecture tools are hidden from normal app use and remain available only through the explicit ?appforge=1 developer URL.",
    "Build 1.00.0 adds a working AppForge Generator Engine that assembles separate, installable PWA ZIP packages entirely in the browser.",
    "Generated packages inject the selected Product Recipe, isolate storage and cache namespaces, include offline files and architecture contracts, and never read the active FireVault vault or media database.",
    "FireVault is ready for generated-package parity testing; Wyoming Explorer, Wyoming Fishing Guide, and Ghost Towns Guide generate as prototypes with their missing publication inputs clearly listed.",
    "Build 0.99.0 adds deterministic AppForge Factory Manifests with normalized requests, composed profiles, validation gates, expected outputs, and safety guardrails.",
    "All four recipes are factory-ready; only FireVault is publication-ready, while the three future apps stop at requirements pending for brand assets and verified databases.",
    "Factory downloads never activate a recipe, publish an app, or include customer data, media, credentials, backups, or device identity.",
    "Build 0.98.0 adds validated AppForge Product Recipes for FireVault, Wyoming Explorer, Wyoming Fishing Guide, and Ghost Towns Guide.",
    "Every recipe passes the nine-check blueprint gate, while the three future apps remain clearly marked as foundations until original brand assets and verified databases are installed.",
    "Recipe downloads never switch the active FireVault experience or include customer records, media, credentials, backups, or device identity.",
    "Build 0.97.0 adds a validated AppForge Product Blueprint that packages identity, modules, data, workflows, branding, content, and storage as one portable build definition.",
    "Architecture & Modules now shows nine readiness checks and can download the complete blueprint without including customer records, media, credentials, or backups.",
    "FireVault remains offline-first with its existing local vault, IndexedDB media, automatic snapshots, complete exports, WebDAV backup, and Microsoft profile readiness; no live provider capability is overstated.",
    "Build 0.95.9 adds configurable data sources and content packs, with active Library folders generated from the App Profile.",
    "FireVault keeps its user library, account-linked content, fire-alarm field reference, and panel-document packs active; remote catalogs remain foundation-only and do not download automatically.",
    "Build 0.95.8 adds a configurable Theme Profile for brand assets, semantic colors, typography, shape, and mobile browser chrome.",
    "FireVault keeps its current dark red technician interface while future AppForge profiles can apply a different visual identity without branching shared screen code.",
    "Build 0.95.7 adds a configurable workflow schema for Account Directory actions, Account Detail actions, Notes shortcuts, and Quick Photo behavior.",
    "FireVault keeps Call, Route, Add Note, Favorite, Photo, Task, Deficiency, and Report actions active while future apps can select a smaller workflow preset.",
    "Build 0.95.6 adds a configurable record schema that controls account fields, detail sections, required fields, and photo categories from the App Profile.",
    "FireVault keeps its complete panel, address, GPS, notes, and technician data model enabled while future apps can select only the fields they need.",
    "Build 0.95.5 activates module-aware navigation, route guards, Account Detail tabs and actions, and Settings filtering from the reusable App Profile.",
    "Build 0.95.4 connects the App Profile terminology layer to Search, Nearby, Account Detail, account forms, Quick Photo, navigation labels, and profile-defined photo categories while preserving FireVault terminology and data.",
    "Build 0.95.3 adds the reusable App Profile, terminology layer, module registry, in-app architecture view, and feature matrix without changing FireVault workflows or its storage key.",
    "Build 0.95.2 redesigns Account Detail with a compact identity header, Call / Route / Add Note / Photo actions, reordered tabs, responsive iPad content, and origin-aware Back navigation.",
    "Build 0.95.0 adds a bottom-navigation Photo button with current-account capture, account confirmation, live overlay preview, automatic image resizing, remembered categories, and IndexedDB-safe saving.",
    "Build 0.94.8 repairs Technician Overlay Template text fitting and adds group alignment for left, center, or right placement.",
    "Build 0.94.7 adds a resized technician profile photo and completion-aware collapsible Technician Profile sections.",
    "Build 0.94.6 enlarges Photo Overlay field controls and adds the reusable Technician Info template under Profile.",
    "Build 0.94.5 tightens the Photo Overlay field arranger, adds left/right alignment for every field, and adds a one-tap Technician + Phone flush-right layout.",
    "Build 0.94.4 replaces raw Photo Overlay text editing with an auto-saving field builder for one-tap add, reorder, line breaks, and removal.",
    "Build 0.94.3 enlarges the Photo Overlay Field Photo preview, removes the space-heavy detail header, and repairs overlay-field insertion and text fitting.",
    "Build 0.94.2 keeps the Photo Overlay Field Photo preview visible while controls scroll, reduces the preview size, and removes the visible sample-photo attribution line.",
    "Build 0.94.1 aligns the Nearby bottom navigation with Search and Settings and removes the red active-button underline.",
    "Build 0.94.0 improves Settings hierarchy, Account Directory search formatting, active navigation, form labels, tabs, and touch-target consistency across active screens.",
    "Build 0.93.1 removes the three Settings shortcut buttons and prevents horizontal page dragging on iPhone and iPad.",
    "Build 0.93.0 improves field reliability with a visible splash presentation, unsaved-change protection, duplicate-action prevention, corrected navigation states, keyboard-safe forms, and consistent interaction feedback.",
    "Build 0.92.0 introduces one canonical visual system for active FireVault screens, unifying surfaces, controls, navigation, Account Directory, Account Detail, Settings, Nearby, and iPad responsiveness.",
    "Build 0.91.1 fixes the three Settings status shortcuts with equal-width responsive alignment, clearer icons, and full iPhone/iPad support.",
    "Build 0.91.0 moves photos and scanned pages into IndexedDB, adds storage health controls, and keeps complete media in manual and WebDAV backups.",
    "Build 0.90.0 removes retired scanner capture and service timers, shortens startup, removes the global portrait lock, standardizes Account terminology, and adds release-safe error recovery.",
    "Build 0.89.0 rebuilds Photo Overlay as a compact visual studio with exact preview-to-export rendering, presets, reorganized controls, expanded account fields, and a real fire-alarm deficiency sample photo.",
    "Build 0.88.0 overhauls Settings with sticky search, live status summaries, richer grouped cards, and consistent detail screens while preserving WebDAV, Demo Mode, Plus Codes, backup, import/export, and security.",
    "Build 0.87.11 restores WebDAV Backup to Data & Backup and Settings search while preserving saved connection settings and transfer tools.",
    "Build 0.87.10 aligns the four Account Directory card actions across the full card width in Call, Route, Add Note, Favorite order.",
    "Build 0.87.9 cleans up the Account Directory with subtle 3D shading, layered surfaces, raised controls, clearer card separation, and category-accented depth without changing account workflows.",
    "Build 0.87.8 improves Account Directory scrolling responsiveness and adds iPad portrait, landscape, and Split View layout refinements.",
    "Build 0.87.6 repairs Account Directory scroll locking in both directions and gives the Nearby and Sort controls a wider, cleaner two-button layout.",
    "Build 0.87.5 restores Demo Mode to the visible Settings page, keeps its fictional Boise workspace isolated from the real vault, and restores the header DEMO MODE indicator while active.",
    "Build 0.87.4 spaces Settings cards, adds Settings search, moves Google Plus Codes under Maps & GPS, simplifies Account cards, enlarges identity tags, moves Favorite beside Call, and restores Nearby-style scroll locking.",
    "Build 0.87.3 moves the account address directly below the site name, places Account ID and category tags beneath the address, and changes Settings to a dark grouped-list design without duplicating the FireVault logo.",
    "Build 0.87.2 polishes Account Directory cards and removes the Ready, No Open Work, and GPS status tags so the cards show only useful account information and actionable issues.",
    "Build 0.87.1 rebuilds Account Directory, Search, account cards, and Account Detail from the stable 0.86.1 baseline and removes the black layout gap above the bottom dock.",
    "Build 0.86.1 repairs Settings navigation and standardizes the three-button Nearby, Search, and Settings dock across main pages.",
    "Build 0.80.3 defaults Tools scanner documents to the closest GPS-ready account while preserving manual search, Site Notes account context, and existing-document account locking.",
    "Build 0.80.2 simplifies Document Scanner, adds on-device AI Auto Scan with live page framing and hands-free capture, and keeps focused fields visible above the mobile keyboard.",
    "Build 0.80.1 moves Document Scanner to Tools, supports post-capture account search and matching, and adds scanner access inside Site Notes.",
    "Build 0.80.0 adds a built-in multi-page account document scanner with camera capture, page-edge adjustment, cleanup modes, page ordering, and PDF download or sharing.",
    "Build 0.79.14 restores numbered Nearby Accounts map pins matched to the distance-sorted list and removes Smart Account Intelligence.",
    "Build 0.79.13 repairs the 0.79.11 Revision History syntax error and the 0.79.12 Building Navigator copy-newline error.",
    "Build 0.79.12 adds Building Navigator with exact site locations, GPS/Plus Codes, verification, linked photos, route targets, and account timeline events.",
    "Build 0.79.5 adds separate Personal OneDrive, Work OneDrive, and SharePoint profiles with exact destination assignments and strict no-personal-fallback protection.",
    "Build 0.79.4 adds independent photo/document storage destinations and full offline Google Plus Codes while keeping FireVault local-first.",
    "Build 0.79.3 adds backend-neutral provider interfaces for authentication, database, file storage, synchronization, and audit while keeping FireVault fully local.",
    "Build 0.79.2 adds a unified Security Center for vault integrity, backup health, audit review, device identity, recovery, and PIN-gated sensitive actions.",
    "Build 0.79.0 adds a security-ready data foundation with stable workspace, user, and device identities; record versioning; change queues; audit history; soft deletion; recycle recovery; and stronger restore/reset confirmation.",
    "Build 0.78.6 completed the Account Detail polish pass with a cleaner field workspace and improved service actions.",
    "Build 0.78.4 redesigns Settings section introductions so they no longer resemble buttons, repairs wrapping and overflow in Data and other Settings areas, and standardizes narrow-phone settings layouts.",
    "Build 0.78.3 improves field readability across Nearby, Accounts, Account Detail, Settings, Tools, and forms with larger supporting text, stronger contrast, clearer badges, and safer touch targets.",
    "Build 0.78.2 remembers scroll position across major screens, restores each Account Detail tab independently, lets an active bottom-navigation button return its page to the top, and updates the browser title for clearer orientation.",
    "Build 0.78.1 adds smoother route transitions, improved toast and loading feedback, refined empty states, stronger disabled and focus states, and safer WebDAV operation feedback.",
    "Build 0.78.0 scopes the fixed app header and bottom dock to the real global chrome, then polishes Tools, Settings, Account Detail, forms, dialogs, and touch states across FireVault.",
    "Build 0.76.2 adds one-tap Call and Route controls to every account card, identifies multi-account addresses, clarifies account health, and prevents accidental double-opening while preserving the Accounts view state.",
    "Build 0.76.1 hardens the Accounts directory with persistent view state, inline Favorites, recent-opened context, keyboard shortcuts, and a permanent app-chrome repair so the bottom navigation remains visible after saves and Favorite changes.",
    "Build 0.76.0 completes the Accounts workflow with sorting, safer manual account creation, duplicate Account ID protection, and improved empty states.",
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
    "Manual chapters document installation, Today, Sites, Account Detail, field workflow, notes, tasks, deficiencies, photos, GPS, route tracking, reports, email, settings, backups, updates, and troubleshooting.",
    "Added living-documentation revision metadata and a release-state review requirement.",
    "Added Quick Capture for timestamped site notes, follow-up tasks, and deficiencies without leaving Today.",
    "Quick Capture defaults to the active or most recently used account and can create a matching task from a deficiency.",
    "Field Dashboard counters open the correct Daily Report and follow-up views.",
    "Copy Summary and Today’s Accounts controls are fully connected.",
    "Preserved the 0.55.0 Home Layout controls, scoped Settings design, Email composer, responsive layouts, and all existing data."
  ];
  const overlay=document.createElement("div");
  overlay.className="releaseOverlay";
  overlay.innerHTML=`<div class="releaseSheet" role="dialog" aria-modal="true" aria-label="FireVault release notes">
    <div class="releaseHead"><div><strong>${fireVaultBrand575()}</strong><span>Build ${BUILD}</span></div><button class="ghost iconBtn" id="closeRelease" aria-label="Close release notes">×</button></div>
    <div class="releaseBody"><h2>Release Notes</h2><p class="releaseIntro">FireVault 1.01.3 keeps the Account Detail Favorite control clean on narrow phones without changing its action or the local vault.</p><ul>${notes.map(n=>`<li>${esc(n)}</li>`).join("")}</ul></div>
  </div>`;
  document.body.appendChild(overlay);
  const close=()=>overlay.remove();
  document.getElementById("closeRelease").onclick=close;
  overlay.addEventListener("click",e=>{ if(e.target===overlay) close(); });
}


/* Build 0.79.0 — route-safe chrome and viewport metric guard. */
let layoutFrame0785=0;
let chromeObserver0785=null;
function elementVisible0785(el){
  if(!el) return false;
  const style=getComputedStyle(el);
  return style.display!=="none" && style.visibility!=="hidden" && style.opacity!=="0";
}
function syncLayoutMetrics0785(){
  const root=document.documentElement;
  const body=document.body;
  const header=document.getElementById("appHeader");
  const nav=document.getElementById("appNav");
  const viewportHeight=Math.max(320,Math.round(window.visualViewport?.height||window.innerHeight||document.documentElement.clientHeight||0));
  const home=body.classList.contains("homeFullscreen480");
  const headerHeight=!home&&elementVisible0785(header)?Math.ceil(header.getBoundingClientRect().height||0):0;
  const navHeight=!home&&elementVisible0785(nav)?Math.ceil(nav.getBoundingClientRect().height||0):0;
  if(headerHeight>0) root.style.setProperty("--fv0785-header-h",`${headerHeight}px`);
  if(navHeight>0) root.style.setProperty("--fv0785-nav-h",`${navHeight}px`);
  root.style.setProperty("--fv0785-viewport-h",`${viewportHeight}px`);
  body.classList.toggle("fv-compact-height0785",viewportHeight<720);
  body.classList.add("fv-layout-audited0785");
  body.dataset.fvLayoutRoute=String(view||"home");
}
function scheduleLayoutMetrics0785(){
  cancelAnimationFrame(layoutFrame0785);
  layoutFrame0785=requestAnimationFrame(()=>requestAnimationFrame(syncLayoutMetrics0785));
}
function installLayoutGuard0785(){
  if(!chromeObserver0785 && "ResizeObserver" in window){
    chromeObserver0785=new ResizeObserver(scheduleLayoutMetrics0785);
    [document.getElementById("appHeader"),document.getElementById("appNav"),document.getElementById("app")].filter(Boolean).forEach(el=>chromeObserver0785.observe(el));
  }
  scheduleLayoutMetrics0785();
}
window.addEventListener("resize",scheduleLayoutMetrics0785,{passive:true});
window.addEventListener("orientationchange",()=>setTimeout(scheduleLayoutMetrics0785,100),{passive:true});
window.visualViewport?.addEventListener("resize",scheduleLayoutMetrics0785,{passive:true});
window.visualViewport?.addEventListener("scroll",scheduleLayoutMetrics0785,{passive:true});

/* Build 0.80.2 — keep focused fields visible above mobile keyboards. */
let keyboardGuardInstalled0802=false;
let keyboardBaseHeight0802=Math.max(window.innerHeight||0,window.visualViewport?.height||0,document.documentElement.clientHeight||0);
function editableField0802(el){return !!el&&el.matches?.('input:not([type="button"]):not([type="submit"]):not([type="checkbox"]):not([type="radio"]),textarea,select,[contenteditable="true"]');}
function keyboardOffset0802(){const vv=window.visualViewport;if(!vv)return 0;const current=Math.max(vv.height||0,window.innerHeight||0);if(!editableField0802(document.activeElement)&&current>keyboardBaseHeight0802*.86)keyboardBaseHeight0802=Math.max(keyboardBaseHeight0802,current);return Math.max(0,Math.round(keyboardBaseHeight0802-vv.height-(vv.offsetTop||0)));}
function focusedFieldScrollParent0900(el){
  for(let node=el?.parentElement;node&&node!==document.body;node=node.parentElement){const style=getComputedStyle(node),overflow=style.overflowY;if((overflow==="auto"||overflow==="scroll")&&node.scrollHeight>node.clientHeight+4)return node;}
  return document.scrollingElement||document.documentElement;
}
function revealFocusedField0802(el=document.activeElement){
  if(!editableField0802(el))return;const offset=keyboardOffset0802();document.documentElement.style.setProperty("--fv-keyboard-offset0802",`${offset}px`);document.body.classList.toggle("fvKeyboardOpen0802",offset>80);
  const reveal=()=>{
    try{
      const viewport=window.visualViewport,top=(viewport?.offsetTop||0)+Math.max(74,Number(document.documentElement.style.getPropertyValue("--fv0785-header-h")?.replace("px","")||0)+12),bottom=(viewport?.offsetTop||0)+(viewport?.height||window.innerHeight)-22,rect=el.getBoundingClientRect();let delta=0;
      if(rect.bottom>bottom)delta=rect.bottom-bottom+18;else if(rect.top<top)delta=rect.top-top-18;
      if(Math.abs(delta)>2){const parent=focusedFieldScrollParent0900(el);if(parent===document.scrollingElement||parent===document.documentElement||parent===document.body)window.scrollBy({top:delta,behavior:"smooth"});else parent.scrollBy({top:delta,behavior:"smooth"});}
      else el.scrollIntoView({behavior:"smooth",block:"nearest",inline:"nearest"});
    }catch{}
  };
  requestAnimationFrame(reveal);setTimeout(reveal,90);setTimeout(reveal,260);setTimeout(reveal,520);
}
function installKeyboardGuard0802(){
  if(keyboardGuardInstalled0802)return;keyboardGuardInstalled0802=true;
  document.addEventListener("focusin",e=>{if(editableField0802(e.target))revealFocusedField0802(e.target);});
  document.addEventListener("focusout",()=>setTimeout(()=>{if(!editableField0802(document.activeElement)){document.body.classList.remove("fvKeyboardOpen0802");document.documentElement.style.setProperty("--fv-keyboard-offset0802","0px");}},180));
  window.visualViewport?.addEventListener("resize",()=>revealFocusedField0802(),{passive:true});window.visualViewport?.addEventListener("scroll",()=>revealFocusedField0802(),{passive:true});
}
installKeyboardGuard0802();

function bootFireVault518(){
  try{
    try{performance.mark("firevault-boot-start");}catch{}
    window.__FIREVAULT_MODULE_READY = true;
    if(privacyShouldLockOnBoot0791()) privacyShowLock0791("startup"); else privacyHideContent0791(false);
    document.body.classList.remove("app-loading533");
    document.body.classList.add("app-booted533");
    render();
    // Build 0.91.0: migrate legacy inline photos/scanned pages to IndexedDB,
    // then hydrate media in the background so account search opens immediately.
    hydrateVaultMedia(data).then(result=>{
      mediaBootResult0910=result;
      if(result.migrated){saveData(data);}
      if(["siteDocs","siteDetail","settings"].includes(view)||mode==="settingsDetail") render();
    }).catch(err=>{mediaBootResult0910={...mediaBootResult0910,failed:1};console.error("Media storage initialization failed",err);});
    const autoGpsKey069="firevault_auto_gps_refresh_0691";
    let autoGpsAlready069=false;
    try{autoGpsAlready069=sessionStorage.getItem(autoGpsKey069)==="1";}catch{}
    if((view||"home")==="home" && (isDemoMode() || navigator.geolocation) && data.settings.gps?.enabled!==false && !autoGpsAlready069){
      try{sessionStorage.setItem(autoGpsKey069,"1");}catch{}
      idle0830(()=>runNearbyScan0652("home"),1400);
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
    try{performance.mark("firevault-boot-ready");performance.measure("firevault-boot","firevault-boot-start","firevault-boot-ready");}catch{}
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
      try{window.fireVaultRecordSupportError0900?.(err,"startup");}catch{}
      app.innerHTML=`<div class="screen"><div class="card errorBox fvReleaseError0900"><h1>Something went wrong</h1><p>FireVault could not finish opening. Your saved account data remains on this device.</p><button class="primary" onclick="location.reload()">Reload</button></div></div>`;
    }
  }
}
const splashStarted518 = Number(window.__FIREVAULT_SPLASH_STARTED || Date.now());
const minSplashMs518 = Number(window.__FIREVAULT_MIN_SPLASH_MS || 450);
const elapsedSplashMs518 = Date.now() - splashStarted518;
setTimeout(bootFireVault518, Math.max(0, minSplashMs518 - elapsedSplashMs518));
