import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";

const [app,design,version]=await Promise.all([
  readFile(new URL("../src/app.js",import.meta.url),"utf8"),
  readFile(new URL("../src/design-system.css",import.meta.url),"utf8"),
  readFile(new URL("../version.json",import.meta.url),"utf8")
]);

let checks=0;
function equal(actual,expected,message){checks+=1;assert.equal(actual,expected,message)}
function match(source,pattern,message){checks+=1;assert.match(source,pattern,message)}
function ok(value,message){checks+=1;assert.ok(value,message)}

const build=JSON.parse(version).build;
equal(build,"1.03.20","The polished Nearby workspace must ship in the current build.");

const card=app.slice(app.indexOf("function nearbyAccountCard069"),app.indexOf("function homeNearbyMapShell069"));
match(card,/role="button" tabindex="0"/);
match(card,/aria-current="\$\{selected\?'location':'false'\}"/);
match(card,/aria-label="Open \$\{esc\(s\.name\|\|'Unnamed Account'\)\}, \$\{esc\(distance\)\} away"/);
match(card,/<span class="nearbyDistance069"><b>\$\{esc\(distance\)\}<\/b><small>away<\/small><i class="gpsDot069"><\/i><\/span>/);

const home=app.slice(app.indexOf("function home()"),app.indexOf("function clearNearbyStreetZoom0840"));
match(home,/id="nearbyViewToggle069"[^>]*aria-pressed="\$\{homeNearbyView069==='map'\}"/);
match(home,/<span><small>View<\/small><b>\$\{homeNearbyView069==='map'\?'Map':'List'\}<\/b><\/span>/);
match(home,/nearbyListHead069"><strong><b>\$\{rows\.length\}<\/b>/);
match(home,/<span>Nearest first<\/span>/);
match(home,/const openNearbyAccount10320=id=>/);
match(home,/if\(e\.key!=="Enter"&&e\.key!==" "\)return;[\s\S]*?openNearbyAccount10320\(c\.dataset\.nearbyCard069\)/);
match(home,/list\.classList\.add\('isScrolling10320'\)/);
match(home,/list\.addEventListener\('touchcancel',[\s\S]*?list\.classList\.remove\('isScrolling10320'\)/);

const selection=app.slice(app.indexOf("function updateNearbyMapSelection069"),app.indexOf("function scheduleNearbySnap069"));
match(selection,/actions\.hidden=!row/);
match(selection,/nearbySelectedKicker10320">Selected • \$\{esc\(distanceLabel\(row\.meters\)\)\} away/);
match(selection,/\$\{id\?`\$\{esc\(id\)\} • `:''\}\$\{esc\(categoryLabel\)\}/);
match(selection,/c\.setAttribute\('aria-current',selected\?'location':'false'\)/);

const scrolling=app.slice(app.indexOf("function syncNearbyScroll069"),app.indexOf("function prepareNearbyScrollTail069"));
match(scrolling,/c\.setAttribute\('aria-current',selected\?'location':'false'\)/);
match(scrolling,/requestAnimationFrame\(\(\)=>\{[\s\S]*?list\.scrollTop=safeTarget;[\s\S]*?requestAnimationFrame/);
match(scrolling,/list\.classList\.remove\('isScrolling10320'\)/);
ok(!scrolling.includes("behavior:'smooth'"),"Nearby settling must avoid the locking smooth-scroll loop.");

const marker="Build 1.03.20 — consolidated Nearby Accounts workspace polish";
const updateMarker="Build 1.03.7 — canonical Update Ready geometry";
ok(design.includes(marker),"The final design layer must document the Nearby workspace contract.");
ok(design.indexOf(marker)<design.indexOf(updateMarker),"Nearby rules must remain before the final Update Ready geometry contract.");
match(design,/\.nearbyViewToggle069,\.nearbyCategoryFilter070\{[\s\S]*?height:48px!important;[\s\S]*?min-height:48px!important/);
match(design,/\.nearbyWorkspace069\.map\{grid-template-rows:minmax\(205px,34dvh\) 34px minmax\(0,1fr\)!important\}/);
match(design,/\.nearbyAccount069\{[\s\S]*?min-height:84px!important/);
match(design,/\.nearbyDistance069>b\{[\s\S]*?font-size:\.88rem!important/);
match(design,/\.nearbyMapActions0711\[hidden\]\{display:none!important\}/);
match(design,/@media\(min-width:760px\)\{[\s\S]*?grid-template-columns:minmax\(0,1\.25fr\) minmax\(330px,\.75fr\)!important/);
match(design,/@media\(max-width:430px\)\{[\s\S]*?grid-template-columns:88px 44px!important/);
match(design,/@media\(max-height:700px\) and \(max-width:759px\)/);

console.log(JSON.stringify({status:"passed",build,checks}));
