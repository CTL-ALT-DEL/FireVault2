import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";

const [app,design,version,iconContents,icon]=await Promise.all([
  readFile(new URL("../src/app.js",import.meta.url),"utf8"),
  readFile(new URL("../src/design-system.css",import.meta.url),"utf8"),
  readFile(new URL("../version.json",import.meta.url),"utf8"),
  readFile(new URL("../../work/ios-upload/FireVault-iOS/FireVault/FireVault/Assets.xcassets/AppIcon.appiconset/Contents.json",import.meta.url),"utf8"),
  readFile(new URL("../../work/ios-upload/FireVault-iOS/FireVault/FireVault/Assets.xcassets/AppIcon.appiconset/AppIcon-1024.png",import.meta.url))
]);

let checks=0;
function equal(actual,expected,message){checks+=1;assert.equal(actual,expected,message)}
function match(source,pattern,message){checks+=1;assert.match(source,pattern,message)}
function ok(value,message){checks+=1;assert.ok(value,message)}

const build=JSON.parse(version).build;
equal(build,"1.03.26","Simplified scanning must ship in Build 1.03.26.");

const detail=app.slice(app.indexOf("function siteDetail()"),app.indexOf("function photoCategory524"));
match(detail,/nativeDocumentScannerAvailable10325\(\)&&moduleEnabled0955\("core\.files"\)\?`<button class="accountScanPrimary10326" id="accountScanDocument10326"/);
match(detail,/<strong>Scan Document<\/strong><small>Apple camera · automatic edges · multi-page<\/small>/);
ok(detail.indexOf("accountScanDocument10326")<detail.indexOf("accountActionGrid0871"),"Scan Document must appear before ordinary account actions.");
match(detail,/accountScanDocument10326"\)\?\.addEventListener\("click",\(\)=>startNativeDocumentScan10325\(s,\{returnRoute:"siteDetail"\}\)\)/);
match(app,/route\(options\.returnRoute==="siteDetail"\?"siteDetail":"siteDocs"\)/);

match(detail,/\["overview","docs","notes"\]\.flatMap/);
match(detail,/\["details","locations","equipment",\.\.\./);
match(detail,/id="accountMoreTab10326" aria-expanded="false" aria-controls="accountMoreMenu10326"/);
match(detail,/class="accountMoreMenu10326" id="accountMoreMenu10326" hidden/);
match(detail,/button\.setAttribute\("aria-expanded",opening\?"true":"false"\)/);

const docs=app.slice(app.indexOf("function siteDocs()"),app.indexOf("function siteDocForm()"));
match(docs,/<details class="docOrganize10326"><summary><span>Find or organize saved items<\/span><small>Search · filters · sort<\/small><\/summary>/);
ok(docs.indexOf("docOrganize10326")<docs.indexOf("docVaultSearchBar521()"),"Document organization controls must begin inside the collapsed section.");

const marker="Build 1.03.26 — one-tap Account Detail document scanning";
const updateMarker="Build 1.03.7 — canonical Update Ready geometry";
ok(design.includes(marker),"The final design layer must identify simplified scanning.");
ok(design.indexOf(marker)<design.indexOf(updateMarker),"Simplified scanning rules must remain before the Update Ready geometry contract.");
match(design,/\.accountDetail1011 \.accountScanPrimary10326\{[\s\S]*?min-height:58px!important;[\s\S]*?grid-template-columns:30px minmax\(0,1fr\) 18px!important/);
match(design,/\.accountDetail1011 \.accountPrimaryTabs10326\{[\s\S]*?repeat\(var\(--account-primary-tab-count,4\),minmax\(0,1fr\)\)/);
match(design,/\.accountDetail1011 \.accountMoreMenu10326\[hidden\]\{display:none!important\}/);
match(design,/\.docOrganize10326>summary\{[\s\S]*?min-height:48px!important/);

const catalog=JSON.parse(iconContents);
equal(catalog.images[0].filename,"AppIcon-1024.png","The primary iOS icon slot must reference the FireVault artwork.");
equal(icon.subarray(0,8).toString("hex"),"89504e470d0a1a0a","The native app icon must be a PNG.");
equal(icon.readUInt32BE(16),1024,"The native app icon width must be 1024 pixels.");
equal(icon.readUInt32BE(20),1024,"The native app icon height must be 1024 pixels.");
equal(icon[25],2,"The native app icon must be true-color without an alpha channel.");

console.log(JSON.stringify({status:"passed",build,checks,accountTaps:2,collapsedMenus:true,nativeIcon:"1024x1024"}));
