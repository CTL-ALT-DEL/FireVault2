import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";

const [index,app,design,version]=await Promise.all([
  readFile(new URL("../index.html",import.meta.url),"utf8"),
  readFile(new URL("../src/app.js",import.meta.url),"utf8"),
  readFile(new URL("../src/design-system.css",import.meta.url),"utf8"),
  readFile(new URL("../version.json",import.meta.url),"utf8")
]);

let checks=0;
function equal(actual,expected,message){checks+=1;assert.equal(actual,expected,message)}
function match(source,pattern,message){checks+=1;assert.match(source,pattern,message)}
function ok(value,message){checks+=1;assert.ok(value,message)}

const build=JSON.parse(version).build;
equal(build,"1.03.28","Bottom navigation reliability must remain available in the current build.");

const appNav=index.slice(index.indexOf('<nav id="appNav"'),index.indexOf("</nav>",index.indexOf('<nav id="appNav"')));
for(const id of ["nav-home","nav-sites","nav-photo","nav-settings"]){
  match(appNav,new RegExp(`id="${id}"`),`${id} must remain in the persistent dock.`);
}
equal((appNav.match(/<button/g)||[]).length,4,"The persistent dock must contain four buttons.");

const nearbyNav=app.slice(app.indexOf('<nav class="nearbyBottomNav069'),app.indexOf("</nav>",app.indexOf('<nav class="nearbyBottomNav069')));
for(const id of ["homeNearbyNav069","homeAccounts069","homePhotoNav0950","homeSettingsNav069"]){
  match(nearbyNav,new RegExp(`id="${id}"`),`${id} must remain in the Nearby dock.`);
}
equal((nearbyNav.match(/<button/g)||[]).length,4,"The Nearby dock must contain four buttons.");

match(app,/nav\.style\.setProperty\("--fv-module-nav-count",String\(count\)\)/,"The runtime must publish the visible-button count.");
match(app,/function restoreDirectoryNavigation10324\(\)\{[\s\S]*?showGlobalChrome537\(\);[\s\S]*?applyModuleNavigation0955\(\);[\s\S]*?nav\.style\.display="grid"/);
const sites=app.slice(app.indexOf("function sites()"),app.indexOf("function nearbySites()"));
ok((sites.match(/restoreDirectoryNavigation10324\(\)/g)||[]).length>=2,"Search input and keyboard dismissal must both restore the dock.");

const marker="Build 1.03.24 — reliable dynamic bottom navigation";
const updateMarker="Build 1.03.7 — canonical Update Ready geometry";
ok(design.includes(marker),"The final design layer must document the navigation contract.");
ok(design.indexOf(marker)<design.indexOf(updateMarker),"Navigation rules must remain before the final Update Ready geometry contract.");
match(design,/#appNav\.fvModuleNav0955,[\s\S]*?grid-template-columns:repeat\(var\(--fv-module-nav-count,4\),minmax\(0,1fr\)\)!important/);
match(design,/#appNav\.fvModuleNav0955>button\[hidden\],[\s\S]*?display:none!important/);
match(design,/#appNav\.fvModuleNav0955 \.fvNavIcon073,[\s\S]*?width:26px!important;[\s\S]*?height:26px!important/);
match(design,/#appNav\.fvModuleNav0955 button span,[\s\S]*?white-space:nowrap!important;[\s\S]*?font-size:clamp\(\.68rem,2\.8vw,\.76rem\)!important/);
match(design,/body\.fv-route-sites #appNav\.fvModuleNav0955\{[\s\S]*?visibility:visible!important;[\s\S]*?pointer-events:auto!important/);

match(app,/\["Bottom Navigation","Use the four persistent buttons—Nearby, Search, Photo, and Settings—/);
match(app,/\["1\.03\.24","Repairs the four-button bottom dock/);

console.log(JSON.stringify({status:"passed",build,checks,buttons:4,dynamicColumns:true}));
