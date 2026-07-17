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
equal(build,"1.03.19","Top-account actions must ship in the current build.");

match(app,/aria-expanded="false" aria-label="Open/);
match(app,/accountRowActions0951 workflowActions0957[^>]*aria-hidden="true"/);
for(const label of ["Call","Route","Add Note","Favorite"]) match(app,new RegExp(`<span>${label}<\\/span>`));

match(app,/function setTopAccountCard10319\(list,card\)/);
match(app,/const cards=visibleAccountCards0876\(list\)/);
match(app,/item\.classList\.toggle\("isTopAccount10319",active\)/);
match(app,/item\.setAttribute\("aria-expanded",String\(active\)\)/);
match(app,/actions\.setAttribute\("aria-hidden",String\(!active\)\)/);
match(app,/if\(active\)button\.removeAttribute\("tabindex"\)/);
match(app,/else button\.tabIndex=-1/);
match(app,/list\.dataset\.topAccountId10319=target\?\.dataset\.id\|\|""/);
match(app,/function syncTopAccountCard10319\(list\)/);
match(app,/setTopAccountCard10319\(list,closestVisibleAccountCard0796\(list\)\)/);

const settle=app.slice(app.indexOf("function settleAccountsList0796"),app.indexOf("function sites()"));
match(settle,/const card=closestVisibleAccountCard0796\(list\)/);
match(settle,/setTopAccountCard10319\(list,card\)/);
match(settle,/list\.classList\.remove\("isScrolling0878"\)/);
ok(settle.indexOf("setTopAccountCard10319(list,card)")<settle.indexOf('list.classList.remove("isScrolling0878")'),"The destination must be selected before actions are revealed.");
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
match(sites,/syncTopAccountCard10319\(list\);[\s\S]*?prepareAccountsScrollTail0796\(list\)/);
match(sites,/list\.scrollTop=Math\.max\(0,accountsScroll0759\|\|0\);[\s\S]*?syncTopAccountCard10319\(list\)/);
match(sites,/const card=event\.target\.closest\("\[data-account-card0759\]"\);[\s\S]*?openAccount\(card\.dataset\.id\)/);

const marker="Build 1.03.19 — only the settled top Account Directory card shows actions";
const updateMarker="Build 1.03.7 — canonical Update Ready geometry";
ok(design.includes(marker),"The top-account action contract must be documented in the final design layer.");
ok(design.indexOf(marker)<design.indexOf(updateMarker),"Directory rules must remain before the final Update Ready geometry contract.");
match(design,/\.accountDirectory0951 \.accountRow0951 \.accountRowActions0951\{display:none!important\}/);
match(design,/\.accountDirectory0951 \.accountRow0951\.isTopAccount10319 \.accountRowActions0951\{display:grid!important\}/);
match(design,/\.accountDirectory0951 \.accountDirectoryList0871\.isScrolling0878 \.accountRow0951 \.accountRowActions0951\{display:none!important\}/);
match(design,/\.accountDirectory0951 \.accountRow0951\.isTopAccount10319\{[\s\S]*?border-color:[\s\S]*?box-shadow:/);
match(design,/\.accountDirectory0951 \.accountDirectoryList0871\.isScrolling0878 \.accountRow0951\.isTopAccount10319\{[\s\S]*?box-shadow:none!important/);
match(design,/\.accountDirectory0951 \.accountSearch0951 input\{[\s\S]*?pointer-events:auto!important;[\s\S]*?user-select:text!important/);
match(design,/:root\{--navH:calc\(76px \+ max\(env\(safe-area-inset-bottom\),8px\)\)\}/);
match(design,/#appNav button,\.nearbyBottomNav069 button\{[\s\S]*?height:58px!important;[\s\S]*?overflow:visible!important/);
match(design,/#appNav button span,\.nearbyBottomNav069 button span\{[\s\S]*?min-height:14px!important;[\s\S]*?line-height:1\.15!important/);

console.log(JSON.stringify({status:"passed",build,checks}));
