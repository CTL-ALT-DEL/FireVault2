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
equal(build,"1.03.30");

match(app,/screen fieldForm10315 contactFieldForm10315/);
match(app,/screen fieldForm10315 equipmentFieldForm10315/);
match(app,/screen fieldForm10315 taskFieldForm10315/);
match(app,/screen deficiencyForm525 fieldForm10315 deficiencyFieldForm10315/);
equal((app.match(/fieldFormHeader10315 fieldFormTop10315/g)||[]).length,4);
ok((app.match(/fieldFormBody10315/g)||[]).length>=4);
ok((app.match(/fieldFormCard10315/g)||[]).length>=4);
ok((app.match(/fieldFormActions10315/g)||[]).length>=4);

match(app,/id="contactType"/);
match(app,/id="contactRole"/);
match(app,/id="contactName"/);
match(app,/id="contactPhone" inputmode="tel"/);
match(app,/id="contactEmail" inputmode="email"/);
match(app,/id="contactAfterHours"/);
match(app,/id="contactAccess"/);
match(app,/id="contactNotes"/);
match(app,/id="saveContactBtn">Save Contact<\/button>/);
match(app,/id="deleteContactBtn">Delete Contact<\/button>/);

match(app,/id="eqType"/);
match(app,/id="eqStatus"/);
match(app,/id="eqLocation"/);
match(app,/id="eqMake"/);
match(app,/id="eqModel"/);
match(app,/id="eqSerial"/);
match(app,/id="eqDate" type="date"/);
match(app,/id="eqInterval"/);
match(app,/class="card equipmentActionPanel fieldFormSupportCard10315"/);
match(app,/id="saveEquipmentBtn">Save Equipment<\/button>/);
match(app,/id="deleteEquipmentBtn">Delete Equipment<\/button>/);

match(app,/taskFieldForm10315[\s\S]*?id="sitePick"/);
match(app,/taskFieldForm10315[\s\S]*?id="title"/);
match(app,/taskFieldForm10315[\s\S]*?id="status"/);
match(app,/id="due" type="date"/);
match(app,/id="saveBtn">Save Task<\/button>/);
match(app,/id="delBtn">Delete Task<\/button>/);

match(app,/deficiencyFieldForm10315[\s\S]*?id="priority"/);
match(app,/deficiencyFieldForm10315[\s\S]*?id="status"/);
match(app,/class="checkRow fieldFormCheck10315"/);
match(app,/id="makeTask" checked/);
match(app,/class="card defPhotoPanel525 fieldFormSupportCard10315"/);
match(app,/id="saveBtn">Save Deficiency<\/button>/);
match(app,/id="saveAddPhotoBtn525">Save \+ Add Photo<\/button>/);
match(app,/id="delBtn">Delete Deficiency<\/button>/);

for(const route of ["contactForm","equipmentForm","taskForm","deficiencyForm"]) match(app,new RegExp(`DIRTY_ROUTES_0930[^;]+["']${route}["']`));

const marker="Build 1.03.15 — consistent secondary field forms";
const accountMarker="Build 1.03.14 — field-ready Add/Edit Account form cleanup";
const updateMarker="Build 1.03.7 — canonical Update Ready geometry";
ok(design.includes(marker));
ok(design.indexOf(marker)>design.indexOf(accountMarker),"Secondary form rules must follow the Add/Edit Account cleanup.");
ok(design.indexOf(marker)<design.indexOf(updateMarker),"Secondary form rules must remain before the final Update Ready geometry contract.");
match(design,/\.fieldFormHeader10315\{[\s\S]*?grid-template-columns:44px minmax\(0,1fr\)!important;[\s\S]*?min-height:66px!important;/);
match(design,/\.fieldFormHeader10315 h1\{[\s\S]*?font-size:22px!important;[\s\S]*?text-align:left!important;/);
match(design,/body\.fv-unsaved0930 \.fieldFormTop10315 h1::after\{[\s\S]*?content:" • Unsaved"!important;/);
match(design,/\.fieldFormBody10315\{[\s\S]*?scroll-padding-bottom:120px!important;[\s\S]*?overscroll-behavior:contain!important;/);
match(design,/\.fieldFormCard10315 label\{[\s\S]*?font-size:12\.5px!important;[\s\S]*?text-transform:none!important;/);
match(design,/\.fieldFormCard10315 input,[\s\S]*?min-height:50px!important;[\s\S]*?font-size:16px!important;/);
match(design,/\.fieldFormCard10315 textarea\{min-height:104px!important;line-height:1\.45!important;resize:vertical!important\}/);
match(design,/\.equipmentFieldForm10315 \.equipmentQuickActions\{[\s\S]*?grid-template-columns:repeat\(3,minmax\(0,1fr\)\)!important;/);
match(design,/\.fieldFormActions10315\{[\s\S]*?position:sticky!important;[\s\S]*?grid-template-columns:1fr!important;/);
match(design,/\.fieldFormActions10315\.hasDelete10315\{grid-template-columns:1fr 1fr!important\}/);
match(design,/\.fieldFormActions10315 button\{min-height:54px!important;font-size:13px!important;/);
match(design,/\.deficiencyFormActions10315 \.danger\{grid-column:1\/-1!important\}/);
match(design,/@media\(max-width:360px\)\{[\s\S]*?\.fieldFormCard10315 \.compactField\{grid-template-columns:1fr!important\}/);

console.log(JSON.stringify({status:"passed",build,checks}));
