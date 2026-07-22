import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";

const [app,styles,version]=await Promise.all([
  readFile(new URL("../src/app.js",import.meta.url),"utf8"),
  readFile(new URL("../src/styles.css",import.meta.url),"utf8"),
  readFile(new URL("../version.json",import.meta.url),"utf8")
]);

let checks=0;
function match(source,pattern,message){checks+=1;assert.match(source,pattern,message)}
function ok(value,message){checks+=1;assert.ok(value,message)}
function equal(actual,expected,message){checks+=1;assert.equal(actual,expected,message)}

const build=JSON.parse(version).build;
equal(build,"1.03.29","Apple Maps bridge must remain available in the current build.");

match(app,/window\.webkit\?\.messageHandlers\?\.fireVaultMaps\?\.postMessage/);
match(app,/window\.fireVaultNativeMapsResolve=function/);
for(const action of ["currentLocation","reverse","search","route","snapshot"]){
  match(app,new RegExp(`nativeMapRequest10323\\("${action}"`),`The web app must request native ${action}.`);
}
match(app,/source:"Apple Core Location"/);
match(app,/nativeMapCredit10323\(result=\{\}\)/);
match(app,/Address lookup · Apple Maps/);
match(app,/Apple Maps — Native/);
match(app,/data-apple-map10323/);
match(app,/nativeMapSnapshot10323\(base/);
match(app,/hydrateNativeMapElements10323\(overlay\)/);
match(app,/https:\/\/maps\.apple\.com\/\?daddr=/);
match(app,/routeSite10323\(s\)/);

// Browser/PWA behavior must remain available when the native handler is absent.
match(app,/https:\/\/nominatim\.openstreetmap\.org\/reverse/);
match(app,/https:\/\/www\.openstreetmap\.org\/export\/embed\.html/);
match(app,/navigator\.geolocation\.getCurrentPosition/);
ok(app.indexOf("if(nativeAppleMapsAvailable10323())")<app.indexOf("nominatim.openstreetmap.org/reverse"),"Native reverse geocoding must be preferred before the web fallback.");

match(styles,/\.nearbyStaticBase069\{[^}]*object-fit:cover/);
match(styles,/\.arrivalGuideMap1020 iframe,\.arrivalGuideMap1020>img/);
match(styles,/\.accountMapPreview0735 iframe,\.accountMapPreview0735>img/);

console.log(JSON.stringify({status:"passed",build,checks,nativeActions:5,browserFallback:true}));
