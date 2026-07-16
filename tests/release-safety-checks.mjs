import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";

const [index,worker,app,storage,styles,version]=await Promise.all([
  readFile(new URL("../index.html",import.meta.url),"utf8"),
  readFile(new URL("../sw.js",import.meta.url),"utf8"),
  readFile(new URL("../src/app.js",import.meta.url),"utf8"),
  readFile(new URL("../src/storage.js",import.meta.url),"utf8"),
  readFile(new URL("../src/styles.css",import.meta.url),"utf8"),
  readFile(new URL("../version.json",import.meta.url),"utf8")
]);
const {encodePlusCode,isValidFullPlusCode}=await import("../src/open-location-code.js");

const build=JSON.parse(version).build;
assert.equal(build,"1.03.4");
assert.match(index,/setTimeout\(function\(\)\{[\s\S]*?showRecovery\([\s\S]*?\},8000\);/);
assert.match(index,/updateButton\.disabled=false;laterButton\.disabled=false;/);
assert.match(index,/updateButton\.textContent="Try Again";laterButton\.textContent="Reload App";/);
assert.match(index,/fvUpdateDialog1033/);
assert.match(index,/Safe to install/);
assert.match(index,/fvUpdateNotes1033/);
assert.match(index,/fireVaultOpenReleaseNotes/);
assert.match(styles,/#fvUpdateBanner072[\s\S]*?backdrop-filter:blur\(14px\)/);
assert.match(styles,/\.fvUpdateDialog1033[\s\S]*?width:min\(100%,540px\)/);
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
assert.match(app,/querySelectorAll\("\[data-overlay-preset\]"\)/);
assert.match(app,/getElementById\("ovCustomLogo"\)/);
assert.match(app,/wireTechnicianOverlayTemplate0946\(\)/);
assert.match(app,/return !label\|\|label\.toLowerCase\(\)===\"other\" \? \"FIREVAULT FIELD NOTES\" : `FIREVAULT FIELD NOTES - \$\{label\.toUpperCase\(\)\}`/);
assert.match(app,/renderOverlayComposite0890\(source,set,siteData,maxW=1800,options=\{\}\)/);
assert.match(app,/id="quickPhotoTechnicianOverlay1034"/);
assert.match(app,/id="docUseTechnicianOverlay1034"/);
assert.match(app,/useTechnicianOverlayOnSave:quickPhotoDraft0950\.useTechnicianOverlay/);
assert.match(app,/useTechnicianOverlayOnSave:imageData\?checked\("docUseTechnicianOverlay1034"\):false/);
assert.match(app,/if\(id===\"overlay\"\)return moduleEnabled0955\(\"core\.photoOverlay\"\)\|\|moduleEnabled0955\(\"core\.photos\"\)/);
assert.match(styles,/\.technicianPhotoToggle1034/);

for(const source of [index,worker,app,storage]) assert.doesNotMatch(source,/\?v=1\.03\.0/,"Active runtime references must use the current build.");
console.log(JSON.stringify({status:"passed",build,checks:40,csvPlusCode}));
