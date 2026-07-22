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
equal(build,"1.03.23","The compact Account Directory contract must ship in the current build.");

const row=app.slice(app.indexOf("function accountDirectoryRow0759"),app.indexOf("function accountDirectorySort0760"));
match(row,/role="button" tabindex="0" aria-label="Open/);
ok(!row.includes("aria-expanded"),"A directory row must not advertise retired expandable actions.");
ok(!row.includes("accountRowActions0951"),"A directory row must contain account identity only.");
for(const label of ["Call","Route","Add Note","Favorite"])ok(!row.includes(`<span>${label}</span>`),`${label} must not appear on a directory row.`);

const settle=app.slice(app.indexOf("function settleAccountsList0796"),app.indexOf("function sites()"));
match(settle,/const card=closestVisibleAccountCard0796\(list\)/);
ok(!settle.includes("setTopAccountCard10319"),"Scroll settling must not restore top-account actions.");
match(settle,/prepareAccountsScrollTail0796\(list\);[\s\S]*?persistAccountsViewState0761\(true\)/);

const sites=app.slice(app.indexOf("function sites()"),app.indexOf("function nearbySites()"));
match(app,/function accountsSortLabel0760\(\)\{[\s\S]*?az:"A-Z"[\s\S]*?\|\|"A-Z"/);
match(sites,/<option value="az"[^>]*>A-Z<\/option>/);
ok(!sites.includes("Alphabetical"),"The compact sort control must not show the retired Alphabetical label.");
match(sites,/let appliedSearchQuery10319=siteSearch\.toLowerCase\(\)/);
match(sites,/const accountSearchIndex10319=new Map\(accounts\.map\(account=>\[account\.id,siteSearchBlob\(account\)\]\)\)/);
match(sites,/const queryTerms=query\.split\(\/\\s\+\/\)\.filter\(Boolean\)/);
match(sites,/const queryChanged=query!==appliedSearchQuery10319/);
match(sites,/queryTerms\.every\(term=>searchText\.includes\(term\)\)/);
match(sites,/searchEl\?\.addEventListener\("input",applySearch\)/);
match(sites,/searchEl\?\.addEventListener\("change",applySearch\)/);
match(sites,/searchEl\?\.addEventListener\("compositionend",applySearch\)/);
match(sites,/if\(queryChanged\)\{[\s\S]*?accountsScroll0759=0;[\s\S]*?list\.scrollTop=0;/);
match(sites,/list\.scrollTop=Math\.max\(0,accountsScroll0759\|\|0\);[\s\S]*?prepareAccountsScrollTail0796\(list\)/);
match(sites,/const card=event\.target\.closest\("\[data-account-card0759\]"\);[\s\S]*?openAccount\(card\.dataset\.id\)/);

const historicalMarker="Build 1.03.19 — only the settled top Account Directory card shows actions";
const currentMarker="Build 1.03.23 — simplified Account Directory and clearer Account Detail tabs";
const updateMarker="Build 1.03.7 — canonical Update Ready geometry";
ok(design.includes(historicalMarker),"The former action contract must remain documented as release history.");
ok(design.includes(currentMarker),"The current compact-directory contract must be documented.");
ok(design.indexOf(historicalMarker)<design.indexOf(currentMarker),"The current cleanup must supersede the historical action contract.");
ok(design.indexOf(currentMarker)<design.indexOf(updateMarker),"Directory rules must remain before the final Update Ready geometry contract.");
match(design,/\.accountDirectory0951 \.accountRowActions0951\{[\s\S]*?display:none!important/);
match(design,/body\.fv-route-sites #appNav,[\s\S]*?visibility:visible!important/);
match(design,/:root\{--navH:calc\(76px \+ max\(env\(safe-area-inset-bottom\),8px\)\)\}/);
match(design,/#appNav button,\.nearbyBottomNav069 button\{[\s\S]*?height:58px!important;[\s\S]*?overflow:visible!important/);
match(design,/#appNav button span,\.nearbyBottomNav069 button span\{[\s\S]*?min-height:14px!important;[\s\S]*?line-height:1\.15!important/);

console.log(JSON.stringify({status:"passed",build,checks}));
