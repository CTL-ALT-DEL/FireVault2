import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";

const [index,app,styles,design,version]=await Promise.all([
  readFile(new URL("../index.html",import.meta.url),"utf8"),
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
equal(build,"1.03.24");
ok(index.indexOf("src/styles.css?v=1.03.24")<index.indexOf("src/design-system.css?v=1.03.24"),"The final design system must load after legacy application styles.");

match(app,/class="quickPhotoSheet0950" role="dialog" aria-modal="true"/);
match(app,/id="quickPhotoCategory0950"/);
match(app,/id="quickPhotoOverlayToggle0950"/);
match(app,/id="quickPhotoTechnicianOverlay1034"/);
match(app,/id="quickPhotoReportToggle0950"/);
match(app,/class="quickPhotoAccount0950" id="quickPhotoChangeAccount0950"/);
match(app,/id="quickPhotoRetake0950">Retake<\/button>/);
match(app,/id="quickPhotoSave0950">Save Photo<\/button>/);
match(app,/class="docPhotoManager512 docPhotoManager513 docPhotoManager524"/);
match(app,/id="docPhotoFile512" type="file" accept="image\/\*" capture="environment"/);
match(app,/class="photoCategoryGrid524"/);
match(app,/id="docUseOverlay524"/);
match(app,/id="docUseTechnicianOverlay1034"/);
match(app,/id="docIncludeReport526"/);
match(app,/id="previewOverlayPhoto513">Preview Overlay<\/button>/);
match(app,/id="downloadOverlayPhoto512">Download With Overlay<\/button>/);
match(app,/id="downloadOriginalPhoto513">Download Original<\/button>/);
match(app,/id="clearDocPhoto512">Clear Photo<\/button>/);

const marker="Build 1.03.13 — compact, readable photo capture and import workflow";
const updateMarker="Build 1.03.7 — canonical Update Ready geometry";
ok(design.includes(marker));
ok(design.indexOf(marker)<design.indexOf(updateMarker),"Photo workflow polish must remain before the final Update Ready geometry contract.");
match(design,/\.quickPhotoAccount0950\{min-height:64px!important;[\s\S]*?font-size:15px!important/);
match(design,/\.quickPhotoOptions0950 select\{min-height:50px!important;font-size:16px!important\}/);
match(design,/\.quickPhotoOptions0950 \.checkRow\{[\s\S]*?min-height:50px!important;[\s\S]*?font-size:13px!important;/);
match(design,/\.quickPhotoOptions0950 \.checkRow input\{width:20px!important;height:20px!important;min-height:20px!important\}/);
match(design,/\.quickPhotoSheet0950>footer button\{min-height:54px!important;font-size:13px!important;font-weight:900!important\}/);
match(design,/\.docPhotoHead524>button\{min-height:44px!important;font-size:11\.5px!important;white-space:nowrap!important\}/);
match(design,/#docPhotoFile512\{min-height:50px!important;font-size:13px!important\}/);
match(design,/\.photoNotesPanel524 \.checkRow\{min-height:48px!important;[\s\S]*?font-size:12\.5px!important;/);
match(design,/\.docPhotoActions513 button\{min-height:48px!important;font-size:11\.5px!important;line-height:1\.2!important\}/);
match(design,/@media\(max-width:520px\)\{[\s\S]*?\.quickPhotoPreview0950\{aspect-ratio:16\/10!important;max-height:36dvh!important\}/);
match(design,/@media\(max-width:520px\)\{[\s\S]*?\.photoCategoryGrid524\{grid-template-columns:repeat\(3,minmax\(0,1fr\)\)!important;gap:6px!important\}/);
match(design,/@media\(max-width:520px\)\{[\s\S]*?\.photoCategoryChip524 span\{display:none!important\}/);
match(design,/@media\(max-width:520px\)\{[\s\S]*?\.docPhotoActions512,[\s\S]*?grid-template-columns:repeat\(2,minmax\(0,1fr\)\)!important;/);
match(styles,/@media\(max-width:520px\)\{[\s\S]*?\.photoCategoryGrid524,[\s\S]*?grid-template-columns:1fr;/);
ok(design.indexOf(marker)>design.lastIndexOf("Build 1.03.12 — active-screen readability"),"The current photo workflow rules must follow the prior readability release.");

console.log(JSON.stringify({status:"passed",build,checks}));
