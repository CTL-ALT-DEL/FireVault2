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
equal(build,"1.03.30","The simplified directory and detail layout must ship in the current build.");

const row=app.slice(app.indexOf("function accountDirectoryRow0759"),app.indexOf("function accountDirectorySort0760"));
match(row,/role="button" tabindex="0" aria-label="Open/);
ok(!row.includes("accountRowActions0951"),"Directory rows must not render a quick-action strip.");
for(const id of ["data-account-call0762","data-account-route0762","data-account-note0877","data-account-photo0957","data-account-favorite0761"]){
  ok(!row.includes(id),`${id} must be absent from directory rows.`);
}
ok(!app.includes("function setTopAccountCard10319"),"The retired top-account action selector must be removed.");
ok(!app.includes("function syncTopAccountCard10319"),"The retired top-account action synchronizer must be removed.");

const settle=app.slice(app.indexOf("function settleAccountsList0796"),app.indexOf("function sites()"));
match(settle,/const card=closestVisibleAccountCard0796\(list\)/);
match(settle,/requestAnimationFrame\(\(\)=>\{[\s\S]*?list\.scrollTop=target/);
match(settle,/list\.classList\.remove\("isScrolling0878"\)/);

const sites=app.slice(app.indexOf("function sites()"),app.indexOf("function nearbySites()"));
match(sites,/searchEl\?\.addEventListener\("input",applySearch\)/);
match(sites,/restoreDirectoryNavigation10324\(\)/);
match(sites,/searchEl\?\.addEventListener\("blur",\(\)=>setTimeout\(\(\)=>\{[\s\S]*?classList\.remove\("fvKeyboardOpen0802"\)/);
match(sites,/list\?\.addEventListener\("pointerdown",\(\)=>\{if\(document\.activeElement===searchEl\)searchEl\.blur\(\);\}/);
match(sites,/const card=event\.target\.closest\("\[data-account-card0759\]"\);[\s\S]*?openAccount\(card\.dataset\.id\)/);
for(const id of ["data-account-call0762","data-account-route0762","data-account-note0877","data-account-photo0957","data-account-favorite0761"]){
  ok(!sites.includes(id),`${id} event handling must be absent from Account Directory.`);
}

const details=app.slice(app.indexOf("function accountDetailsTab0735"),app.indexOf("function accountEquipmentTab0735"));
ok(!details.includes("GPS &amp; Navigation"),"The redundant GPS & Navigation panel must be removed from Details.");
for(const id of ["captureGpsBtn","navigateBtn477","appleBtn","googleBtn"]){
  ok(!details.includes(`id=\"${id}\"`),`${id} must not be rendered in the retired panel.`);
}
match(details,/\$\{plusCodeSection071\(s\)\}/);
const detailScreen=app.slice(app.indexOf("function siteDetail()"),app.indexOf("function wireDashboard068"));
match(detailScreen,/<p>\$\{esc\(address\)\}<\/p>/);
match(detailScreen,/id="detailRoute0871"/);
match(detailScreen,/class="accountDetailContent0871 accountDetailContent0952 accountAccordion10328"/);
match(detailScreen,/class="accountAccordionToggle10328"[\s\S]*?aria-expanded=/);

const marker="Build 1.03.23 — simplified Account Directory and clearer Account Detail tabs";
const updateMarker="Build 1.03.7 — canonical Update Ready geometry";
ok(design.includes(marker),"The final design layer must document the cleanup contract.");
ok(design.indexOf(marker)<design.indexOf(updateMarker),"Cleanup rules must remain before the final Update Ready geometry contract.");
match(design,/\.accountDirectory0951 \.accountRowActions0951\{[\s\S]*?display:none!important/);
match(design,/body\.fv-route-sites #appNav,[\s\S]*?body\.fv-route-sites\.fvKeyboardOpen0802 #appNav\{[\s\S]*?visibility:visible!important;[\s\S]*?pointer-events:auto!important;[\s\S]*?transform:none!important/);
match(design,/\.accountDetail1011 \.accountTabs0952\{[\s\S]*?gap:7px!important;[\s\S]*?background:linear-gradient/);
match(design,/\.accountDetail1011 \.accountTabs0952 button\{[\s\S]*?border:1px solid[\s\S]*?background:linear-gradient/);
match(design,/\.accountDetail1011 \.accountTabs0952 button:nth-child\(even\):not\(\.active\)/);
match(design,/\.accountDetail1011 \.accountTabs0952 button\.active\{[\s\S]*?border-color:color-mix[\s\S]*?box-shadow:/);

console.log(JSON.stringify({status:"passed",build,checks}));
