import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";

const [app,styles,design,version]=await Promise.all([
  readFile(new URL("../src/app.js",import.meta.url),"utf8"),
  readFile(new URL("../src/styles.css",import.meta.url),"utf8"),
  readFile(new URL("../src/design-system.css",import.meta.url),"utf8"),
  readFile(new URL("../version.json",import.meta.url),"utf8")
]);

let checks=0;
function equal(actual,expected,message){checks+=1;assert.equal(actual,expected,message)}
function match(source,pattern,message){checks+=1;assert.match(source,pattern,message)}
function ok(value,message){checks+=1;assert.ok(value,message)}

const build=JSON.parse(version).build;
equal(build,"1.03.26");

const directoryRow=app.slice(app.indexOf("function accountDirectoryRow0759"),app.indexOf("function accountDirectorySort0760"));
ok(!directoryRow.includes("accountRowActions0951"),"Account Directory quick actions are intentionally retired.");
match(app,/class="accountTopBack1011"[^>]*><span aria-hidden="true">‹<\/span><strong>Back<\/strong>/);
match(app,/class="accountActionGrid0871 accountActionGrid0952/);
match(app,/<strong>Add \$\{esc\(appTerm\("note",1\)\)\}<\/strong>/);
match(app,/class="nearbyDistance069"/);
match(app,/photoOverlayDetailHeader1032/);
match(app,/class="overlayActiveField0944 overlayMainField1012 overlayFieldDisclosure1035/);

const readabilityMarker="Build 1.03.12 — active-screen readability and touch-target polish";
const updateMarker="Build 1.03.7 — canonical Update Ready geometry";
ok(design.includes(readabilityMarker));
ok(design.indexOf(readabilityMarker)<design.indexOf(updateMarker),"Readability rules must remain before the final Update Ready geometry contract.");
match(design,/\.accountDirectory0951 \.accountRowTitle0951 h2\{font-size:15px!important\}/);
match(design,/\.accountDirectory0951 \.accountRowAddress0951\{font-size:12px!important\}/);
match(design,/\.accountDirectory0951 \.accountRowMeta0951>span\{font-size:10px!important\}/);
match(design,/\.accountDirectory0951 \.accountRowIssues0951 span\{[\s\S]*?min-height:22px!important;[\s\S]*?font-size:9\.5px!important;/);
match(design,/\.accountDirectory0951 \.accountRowActions0951\{[\s\S]*?display:none!important/);
match(design,/\.accountDirectory0951 \.accountDirectoryNear0951,[\s\S]*?height:42px!important;[\s\S]*?min-height:42px!important;[\s\S]*?font-size:11\.5px!important;/);
match(design,/@media\(max-width:390px\)\{[\s\S]*?\.accountDirectory0951 \.accountDirectoryReset0951\{height:40px!important;min-height:40px!important\}/);
match(design,/@media\(max-width:430px\)\{[\s\S]*?\.accountDetail1011 \.accountTopBack1011\{min-width:64px!important\}/);
match(design,/@media\(max-width:430px\)\{[\s\S]*?\.accountDetail1011 \.accountTopBack1011 strong\{font-size:12\.5px!important\}/);
match(design,/@media\(max-width:430px\)\{[\s\S]*?\.accountDetail1011 \.accountActionGrid0952 strong\{font-size:13px!important\}/);
match(design,/@media\(max-width:430px\)\{[\s\S]*?\.accountDetail1011 \.accountTabs0952 button\{min-width:96px!important;font-size:12\.5px!important\}/);
match(design,/\.settingsPolish0880 \.settingsDetailHeader0880>#settingsBackBtn,[\s\S]*?height:44px!important;[\s\S]*?font-size:12\.5px!important;/);
match(design,/\.settingsOverlayDetail1012 \.overlayFieldDisclosure1035 \.overlayFieldActions0944 button>span\{font-size:10px!important\}/);
match(design,/\.settingsOverlayDetail1012 \.overlayFieldState1035\{font-size:10px!important\}/);
match(design,/\.settingsOverlayDetail1012 \.overlayPreviewFoot1035\{font-size:10\.5px!important\}/);
match(styles,/\.nearbyAccount069 \.nearbyDistance069\{[\s\S]*?align-self:end!important;[\s\S]*?justify-self:end!important;[\s\S]*?font-size:14px!important;/);

console.log(JSON.stringify({status:"passed",build,checks}));
