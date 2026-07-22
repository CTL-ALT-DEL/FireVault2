import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root=path.resolve(new URL("..",import.meta.url).pathname);
const read=file=>fs.readFileSync(path.join(root,file),"utf8");
const version=JSON.parse(read("version.json"));
const app=read("src/app.js");
const profile=read("src/app-profile.js");
const design=read("src/design-system.css");
let checks=0;
const ok=(value,message)=>{checks+=1;assert.ok(value,message)};
const match=(source,pattern,message)=>{checks+=1;assert.match(source,pattern,message)};

assert.equal(version.build,"1.03.28");checks+=1;
const detail=app.slice(app.indexOf("function siteDetail()"),app.indexOf("function photoCategory524"));
for(const label of ["Overview","Map & Locations","Equipment","Files & Scans","Notes","Account Info"])match(detail,new RegExp(label.replace(/[&]/g,"&")),`${label} must be present in the tabless account flow.`);
match(detail,/accountAccordion10328/);
match(detail,/accountAccordionToggle10328/);
match(detail,/aria-expanded=/);
match(detail,/accountEssentialActions10328/);
match(detail,/id="accountScanDocument10326"/);
ok(!detail.includes('id="taskBtn"'),"Account Detail must not render a Tasks status button.");
ok(!detail.includes('id="defBtn"'),"Account Detail must not render a Deficiencies status button.");
ok(!profile.includes('"optional.tasks"'),"Tasks must be disabled in the active profile.");
ok(!profile.includes('"optional.deficiencies"'),"Deficiencies must be disabled in the active profile.");
for(const module of ["core.notes","core.files","core.locationNavigator","optional.equipment"])ok(profile.includes(`"${module}"`),`${module} must remain enabled.`);
const marker=design.indexOf("Build 1.03.28 — Option 4 tabless Account Details");
const update=design.indexOf("Build 1.03.7 — canonical Update Ready geometry");
ok(marker>=0&&marker<update,"Tabless Account Details styles must precede the protected Update Ready contract.");
match(design,/\.accountAccordion10328\{/);
match(design,/grid-template-columns:repeat\(var\(--account-essential-count,3\),minmax\(0,1fr\)\)/);

console.log(JSON.stringify({status:"passed",build:version.build,checks,layout:"tabless-accordion",disabledModules:["tasks","deficiencies"]}));
