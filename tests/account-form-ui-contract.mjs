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
equal(build,"1.03.19");

match(app,/class="screen accountFormScreen0760/);
match(app,/class="accountFormHeader0760 accountFormTop0760"/);
match(app,/id="backBtn" aria-label="Cancel and go back"/);
match(app,/data-record-group="identity"/);
match(app,/data-record-group="location"/);
match(app,/data-record-group="fireSystem"/);
match(app,/const requiredBadge=id=>fieldRequired\(id\)\?" <b>Required<\/b>":""/);
match(app,/id="name"[^>]*autocomplete="organization"/);
match(app,/id="sitePhone0760" inputmode="tel" autocomplete="tel"/);
match(app,/id="externalAccountId0760"[^>]*autocapitalize="characters" spellcheck="false"/);
match(app,/id="street"[^>]*autocomplete="street-address"/);
match(app,/id="city"[^>]*autocomplete="address-level2"/);
match(app,/id="state"[^>]*maxlength="2"[^>]*autocomplete="address-level1"/);
match(app,/id="zip"[^>]*inputmode="numeric" autocomplete="postal-code"/);
match(app,/id="formGpsBtn">Capture Current Location<\/button>/);
match(app,/id="gpsLat" inputmode="decimal"/);
match(app,/id="gpsLng" inputmode="decimal"/);
match(app,/id="accountFormError0760" hidden/);
match(app,/id="cancelAccount0760">Cancel<\/button>/);
match(app,/id="saveBtn">\$\{editing\?"Save Changes":`Create \$\{esc\(recordSingular\)\}`\}<\/button>/);
match(app,/class="danger accountDelete0760" id="delBtn"/);
match(app,/document\.body\.classList\.add\("fv-unsaved0930"\)/);
match(app,/window\.addEventListener\("beforeunload"/);
match(app,/confirm\(`Discard unsaved \$\{formDirtyContext0930\|\|"changes"\}\?`\)/);

const marker="Build 1.03.14 — field-ready Add/Edit Account form cleanup";
const photoMarker="Build 1.03.13 — compact, readable photo capture and import workflow";
const updateMarker="Build 1.03.7 — canonical Update Ready geometry";
ok(design.includes(marker));
ok(design.indexOf(marker)>design.indexOf(photoMarker),"Account form rules must follow the prior photo workflow cleanup.");
ok(design.indexOf(marker)<design.indexOf(updateMarker),"Account form rules must remain before the final Update Ready geometry contract.");
match(design,/\.accountFormHeader0760 \.back\{[\s\S]*?width:44px!important;[\s\S]*?min-height:44px!important;/);
match(design,/\.accountFormHeader0760 h1\{font-size:23px!important;line-height:1\.08!important\}/);
match(design,/body\.fv-unsaved0930 \.accountFormHeader0760 h1::after\{[\s\S]*?content:" • Unsaved"!important;[\s\S]*?font-size:12px!important;/);
match(design,/\.accountForm0760\{[\s\S]*?scroll-padding-bottom:110px!important;[\s\S]*?overscroll-behavior:contain!important;/);
match(design,/\.accountFormSectionTitle0760\{margin-bottom:0!important;gap:10px!important\}/);
match(design,/\.accountFormSectionTitle0760 strong\{font-size:15px!important;line-height:1\.2!important\}/);
match(design,/\.accountForm0760 label\{min-height:18px!important;font-size:12\.5px!important;line-height:1\.3!important\}/);
match(design,/\.accountForm0760 label b\{[\s\S]*?min-height:20px!important;[\s\S]*?font-size:9\.5px!important;/);
match(design,/\.accountForm0760 input,[\s\S]*?min-height:50px!important;[\s\S]*?font-size:16px!important;/);
match(design,/\.accountFormLocationAction0760 button\{min-height:50px!important;font-size:12px!important;font-weight:850!important\}/);
match(design,/\.accountFormActions0760 button\{min-height:56px!important;font-size:13px!important;line-height:1\.2!important\}/);
match(design,/@media\(max-width:390px\)\{[\s\S]*?\.accountFormHeader0760 p\{display:none!important\}/);
match(design,/@media\(max-width:390px\)\{[\s\S]*?\.accountFormActions0760 button\{min-height:54px!important;font-size:12\.5px!important\}/);

console.log(JSON.stringify({status:"passed",build,checks}));
