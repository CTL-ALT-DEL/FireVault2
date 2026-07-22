import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";

const [app,storage,design,version]=await Promise.all([
  readFile(new URL("../src/app.js",import.meta.url),"utf8"),
  readFile(new URL("../src/storage.js",import.meta.url),"utf8"),
  readFile(new URL("../src/design-system.css",import.meta.url),"utf8"),
  readFile(new URL("../version.json",import.meta.url),"utf8")
]);

let checks=0;
function equal(actual,expected,message){checks+=1;assert.equal(actual,expected,message)}
function match(source,pattern,message){checks+=1;assert.match(source,pattern,message)}
function ok(value,message){checks+=1;assert.ok(value,message)}

equal(JSON.parse(version).build,"1.03.28");

// The new-account surface is structurally different without changing Edit Account.
match(app,/accountFormScreen0760\$\{editing\?"":" accountFormCreate10318"\}/);
match(app,/class="accountCreateSteps10318" aria-label="Account setup steps"/);
match(app,/>Basics</);match(app,/>Location</);match(app,/>Details</);
match(app,/data-account-step10318="identity"/);
match(app,/data-account-step10318="location"/);
match(app,/data-account-step10318="fireSystem"/);
match(app,/class="accountCreateHero10318"/);
match(app,/Build a field-ready account/);
match(app,/Only the name and confirmed location are essential/);
match(app,/id="accountCreateReadyCount10318">0\/2 ready/);
match(app,/id="accountCreateNameCheck10318" data-ready="false"/);
match(app,/id="accountCreateAddressCheck10318" data-ready="false"/);
match(app,/accountIdentityCard10318/);
match(app,/class="card accountOptionalCard10318" data-record-group="fireSystem"/);
match(app,/Panel information and site notes can be added now or later/);
match(app,/accountCreateActions10318/);
match(app,/id="accountCreateFooterStatus10318">Complete the name and confirm the address/);
match(app,/editing\?editLocationMarkup10318:createLocationMarkup10318/);
match(app,/id="formGpsBtn">Capture Current Location<\/button>/);

// Every new account gets one address workspace with three intentional paths.
match(app,/class="card accountFormCard0760 accountAddressWorkspace10318"/);
match(app,/Find and confirm the location/);
match(app,/id="accountAddressSearch10318" type="search"/);
match(app,/placeholder="Business, street, city, state, or ZIP"/);
match(app,/id="accountAddressSearchBtn10318">Search<\/button>/);
match(app,/id="firstAccountGps10317">⌖ Use Current Location<\/button>/);
match(app,/id="firstAccountManual10317">✎ Enter Manually<\/button>/);
match(app,/Address lookup starts only after you tap Search or Use Current Location/);
match(app,/id="accountAddressResults10318" hidden/);
match(app,/id="accountAddressStatus10318" data-state="review"/);
match(app,/id="accountAddressStatusCopy10318"/);
match(app,/id="clearAccountAddress10318">Clear<\/button>/);
match(app,/class="accountLocationAdvanced10318"/);
match(app,/GPS \+ Plus Code/);

// Search is explicit, bounded, cached, and resilient.
match(storage,/addressSearchEndpoint:"https:\/\/nominatim\.openstreetmap\.org\/search"/);
match(app,/function accountSearchEndpoint10318\(\)/);
match(app,/replace\(\/\\\/reverse\(\?:\\\?\.\*\)\?\$\/,"\/search"\)/);
match(app,/if\(query\.length<5\)/);
match(app,/accountAddressSearchBtn10318"\)\?\.addEventListener\("click",searchAccountAddress10318\)/);
match(app,/if\(event\.key==="Enter"\)\{event\.preventDefault\(\);searchAccountAddress10318\(\);\}/);
match(app,/data\.settings\?\.gps\?\.addressAssist===false/);
match(app,/sessionStorage\.getItem\(ACCOUNT_ADDRESS_SEARCH_CACHE_KEY_10318\)/);
match(app,/sessionStorage\.setItem\(ACCOUNT_ADDRESS_SEARCH_CACHE_KEY_10318/);
match(app,/url\.searchParams\.set\("q",query\)/);
match(app,/url\.searchParams\.set\("format","jsonv2"\)/);
match(app,/url\.searchParams\.set\("addressdetails","1"\)/);
match(app,/url\.searchParams\.set\("namedetails","1"\)/);
match(app,/url\.searchParams\.set\("limit","5"\)/);
match(app,/setTimeout\(\(\)=>controller\.abort\(\),14000\)/);
match(app,/fetch\(url\.toString\(\),\{headers:\{Accept:"application\/json"\},referrerPolicy:"strict-origin-when-cross-origin"/);
match(app,/Address search timed out\. Try again or enter the address manually/);
match(app,/Address search is unavailable\. You can still enter and confirm the address manually/);
match(app,/No exact address found/);
match(app,/Choose one to review/);
match(app,/data-address-result10318/);
match(app,/showAccountAddressConfirmation10318\(results\[Number\(button\.dataset\.addressResult10318\)\]\)/);

// Lookup results and manual changes cannot silently become saved addresses.
match(app,/id="accountAddressConfirmTitle10318">Confirm this account address<\/h2>/);
match(app,/COMMERCIAL LOCATION FOUND/);
match(app,/id="manualAccountAddress10318">Enter Manually<\/button>/);
match(app,/id="backAccountAddress10318">Back to Results<\/button>/);
match(app,/id="confirmAccountAddress10318">Confirm Address<\/button>/);
match(app,/confirmAccountAddress10318"\)\.onclick=\(\)=>\{applyDetectedAddress10317\(result\);markAccountAddressConfirmed10318\(result,"Address search"\)/);
match(app,/function invalidateAccountAddress10318\(\)/);
match(app,/signature!==accountAddressSignature10318/);
match(app,/The address changed\. Review it again before creating the account/);
match(app,/\["street","city","state","zip"\]\.forEach\(id=>document\.getElementById\(id\)\?\.addEventListener\("input",invalidateAccountAddress10318\)\)/);
match(app,/if\(!editing&&hasAddress&&!accountAddressConfirmed10318\)/);
match(app,/id="manualAddressConfirmTitle10318">Confirm account location<\/h2>/);
match(app,/This address was entered or changed manually\. Is it correct for this account\?/);
match(app,/id="editManualAddress10318">Back to Edit<\/button>/);
match(app,/id="confirmManualAddress10318">Confirm & Create<\/button>/);
match(app,/addressVerification=\{status:"confirmed",method:/);
match(app,/confirmedAt:new Date\(\)\.toISOString\(\),addressSignature:accountAddressSignatureFromForm10318\(\)/);
match(app,/created with a confirmed address/);
ok(!/const gpsLat=Number\(val\("gpsLat"\)\),gpsLng=Number\(val\("gpsLng"\)\)/.test(app),"Blank GPS fields must not be converted into 0,0.");
match(app,/gpsLatRaw&&gpsLngRaw&&Number\.isFinite\(gpsLat\)&&Number\.isFinite\(gpsLng\)/);

// Responsive presentation remains readable and the Update Ready contract stays last.
const marker="Build 1.03.18 — complete Add Account workspace and confirmed address search";
const prior="Build 1.03.17 — guided first-run and first-account setup";
const update="Build 1.03.7 — canonical Update Ready geometry";
ok(design.includes(marker));
ok(design.indexOf(marker)>design.indexOf(prior),"The Add Account redesign must follow onboarding styles.");
ok(design.indexOf(marker)<design.indexOf(update),"The canonical update overlay must remain last.");
match(design,/\.accountFormCreate10318\{[\s\S]*?radial-gradient/);
match(design,/\.accountCreateSteps10318\{[\s\S]*?overflow-x:auto/);
match(design,/\.accountCreateHero10318\{[\s\S]*?grid-template-columns:48px minmax\(0,1fr\) auto/);
match(design,/\.accountAddressSearchRow10318\{display:grid;grid-template-columns:minmax\(0,1fr\) 106px/);
match(design,/\.accountAddressResult10318\{[\s\S]*?min-height:63px/);
match(design,/\.accountAddressStatus10318\[data-state="confirmed"\]/);
match(design,/\.accountOptionalCard10318>summary\{[\s\S]*?min-height:64px/);
match(design,/\.accountFormCreate10318 \.accountCreateActions10318\{grid-template-columns:minmax\(0,1fr\) 105px minmax\(150px,1\.15fr\)/);
match(design,/@media\(max-width:430px\)\{[\s\S]*?\.accountAddressFinderActions10318\{grid-template-columns:1fr\}/);
match(design,/@media\(max-width:430px\)\{[\s\S]*?\.accountAddressConfirmDialog10318>footer \.primary\{grid-column:1\/-1;grid-row:1\}/);

console.log(JSON.stringify({status:"passed",build:JSON.parse(version).build,checks}));
