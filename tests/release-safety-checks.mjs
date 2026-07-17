import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";

const [index,worker,app,storage,styles,design,version]=await Promise.all([
  readFile(new URL("../index.html",import.meta.url),"utf8"),
  readFile(new URL("../sw.js",import.meta.url),"utf8"),
  readFile(new URL("../src/app.js",import.meta.url),"utf8"),
  readFile(new URL("../src/storage.js",import.meta.url),"utf8"),
  readFile(new URL("../src/styles.css",import.meta.url),"utf8"),
  readFile(new URL("../src/design-system.css",import.meta.url),"utf8"),
  readFile(new URL("../version.json",import.meta.url),"utf8")
]);
const {encodePlusCode,isValidFullPlusCode}=await import("../src/open-location-code.js");

const build=JSON.parse(version).build;
assert.equal(build,"1.03.14");
assert.match(index,/setTimeout\(function\(\)\{[\s\S]*?showRecovery\([\s\S]*?\},8000\);/);
assert.match(index,/updateButton\.disabled=false;laterButton\.disabled=false;/);
assert.match(index,/updateButton\.textContent="Try Again";laterButton\.textContent="Reload App";/);
assert.match(index,/fvUpdateDialog1033/);
assert.match(index,/Safe to install/);
assert.match(index,/fvUpdateNotes1033/);
assert.match(index,/fireVaultOpenReleaseNotes/);
assert.match(styles,/#fvUpdateBanner072[\s\S]*?backdrop-filter:blur\(14px\)/);
assert.match(styles,/\.fvUpdateDialog1033[\s\S]*?width:min\(100%,540px\)/);
assert.match(styles,/#fvUpdateBanner072\{[\s\S]*?position:fixed!important;inset:0!important/);
assert.doesNotMatch(styles,/#fvUpdateBanner072\{[^}]*left:50%!important/);
assert.doesNotMatch(styles,/#fvUpdateBanner072\{[^}]*bottom:calc\(88px/);
assert.doesNotMatch(styles,/#fvUpdateBanner072 div\{display:grid/);
assert.equal((styles.match(/#fvUpdateBanner072\{/g)||[]).length,2);
assert.equal((design.match(/#fvUpdateBanner072\{/g)||[]).length,2);
assert.ok(design.lastIndexOf("Build 1.03.7 — canonical Update Ready geometry")>design.length-6000);
assert.match(index,/event\.target===banner && !window\.FIREVAULT_UPDATE\.activating/);
assert.equal((index.match(/postMessage\(\{type:"SKIP_WAITING"\}\)/g)||[]).length,1);
assert.doesNotMatch(worker,/install"[\s\S]{0,180}skipWaiting\(/);
assert.match(worker,/message"[\s\S]{0,180}SKIP_WAITING[\s\S]{0,80}skipWaiting\(/);

assert.match(storage,/loadData\(options=\{\}\)/);
assert.match(storage,/allowEmptyReal/);
assert.match(app,/activateRealVaultForCustomerImport065/);
assert.match(app,/Customer CSV imports create real customer records/);
assert.match(app,/const persistedIds=new Set/);
assert.match(app,/if\(isDemoMode\(\)\|\|missing\.length\)/);
assert.match(app,/fields\.plusCode=encodePlusCode071\(codePair\.lat,codePair\.lng,plusCodeSettings0794\(\)\.accountLength\)/);
assert.match(app,/plusCodes:selected\.filter\(r=>!!rowPlusCode065\(r\)\)\.length/);
assert.match(app,/Plus Code \$\{esc\(plusCode\)\}/);
const csvPlusCode=encodePlusCode(41.14,-104.8202,10);
assert.equal(csvPlusCode,"85HQ45RH+2W");
assert.equal(isValidFullPlusCode(csvPlusCode),true);
assert.match(app,/\{key:"photos",title:"Photo Overlay",icon:"camera",tabs:\["overlay"\]\}/);
assert.match(app,/\{label:"Photos",items:\[/);
assert.match(app,/photoOverlayDetailHeader1032/);
assert.match(app,/function overlaySettingsPanel510\(/);
assert.match(app,/function wireOverlaySettings510\(/);
assert.match(app,/function wireOverlayDisclosures1035\(\)/);
assert.match(app,/<details class="overlayActiveField0944 overlayMainField1012 overlayFieldDisclosure1035/);
assert.match(app,/overlayDisclosureSummary1035\("1","Photo information"/);
assert.match(app,/technicianOverlayIndependent1030 overlayDisclosure1035 technicianDisclosure1035/);
assert.equal((app.match(/id="settingsBackBtn"/g)||[]).length,1);
assert.match(app,/querySelectorAll\("\[data-overlay-preset\]"\)/);
assert.match(app,/getElementById\("ovCustomLogo"\)/);
assert.match(app,/wireTechnicianOverlayTemplate0946\(\)/);
assert.match(app,/return !label\|\|label\.toLowerCase\(\)===\"other\" \? \"FIREVAULT FIELD NOTES\" : `FIREVAULT FIELD NOTES - \$\{label\.toUpperCase\(\)\}`/);
assert.match(app,/renderOverlayComposite0890\(source,set,siteData,maxW=1800,options=\{\}\)/);
assert.match(app,/id="quickPhotoTechnicianOverlay1034"/);
assert.match(app,/id="docUseTechnicianOverlay1034"/);
assert.match(app,/useTechnicianOverlayOnSave:quickPhotoDraft0950\.useTechnicianOverlay/);
assert.match(app,/useTechnicianOverlayOnSave:imageData\?checked\("docUseTechnicianOverlay1034"\):false/);
assert.match(app,/quickPhotoDraft0950\.category,showMain:quickPhotoDraft0950\.useOverlay,showTechnician:quickPhotoDraft0950\.useTechnicianOverlay/);
assert.match(app,/showDocOverlayPreview513\(\{photoCategory:selectedPhotoCategory524\(\),imageData:/);
assert.match(app,/category:photoOverlayCategory1034\(d\),showTechnician:photoTechnicianOverlaySelected1034\(d\)/);
assert.match(app,/if\(options\.showMain!==false\)await drawOverlayStamp0890/);
assert.match(app,/if\(showTechnician\)drawTechnicianOverlay1034\(ctx,w,h,set\)/);
assert.match(app,/if\(id===\"overlay\"\)return moduleEnabled0955\(\"core\.photoOverlay\"\)\|\|moduleEnabled0955\(\"core\.photos\"\)/);
assert.match(styles,/\.technicianPhotoToggle1034/);
assert.match(design,/Build 1\.03\.5 — calm, progressive Photo Overlay workspace/);
assert.match(design,/\.overlayFieldBuilder1012 \.overlayMainField1012\.overlayFieldDisclosure1035\{display:block!important/);
assert.match(design,/@media\(max-width:759px\)[\s\S]*?\.overlayPreview1012\{position:relative!important;top:auto!important\}/);

for(const source of [index,worker,app,storage]) assert.doesNotMatch(source,/\?v=1\.03\.0/,"Active runtime references must use the current build.");
console.log(JSON.stringify({status:"passed",build,checks:61,csvPlusCode}));
