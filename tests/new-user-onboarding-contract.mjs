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

const build=JSON.parse(version).build;
equal(build,"1.03.30");

match(app,/const FIRST_RUN_KEY_10317="firevault_first_run_complete_10317"/);
match(app,/function firstRunComplete10317\(\).*localStorage\.getItem\(FIRST_RUN_KEY_10317\)/);
match(app,/function completeFirstRun10317\(\).*localStorage\.setItem\(FIRST_RUN_KEY_10317,"1"\)/);
match(app,/function shouldShowFirstRun10317\(\)\{return isDemoMode\(\)&&!firstRunComplete10317\(\)&&realVaultCount10317\(\)===0;\}/);
match(app,/function firstRunSlides10317\(\)\{return \[/);
for(const title of ["Explore with demo accounts","Everything starts with an account","Add your first real account"]) match(app,new RegExp(title));
for(const feature of ["Search and Nearby Accounts","Account Detail","GPS can suggest the current address"]) match(app,new RegExp(feature));
match(app,/aria-label="Step \$\{index\+1\} of \$\{slides\.length\}"/);
match(app,/id="skipFirstRun10317">Skip/);
match(app,/index===slides\.length-1\?"Explore Demo":"Next"/);
match(app,/scheduleFirstRunOnboarding10317\(\);/);
match(app,/document\.querySelector\("#fvUpdateBanner072,\.privacyLockOverlay0791,\.releaseOverlay"\)/);

match(app,/function startAccountCreation10317\(\)/);
ok((app.match(/startAccountCreation10317/g)||[]).length>=5,"Every live Add Account entry point should use the guided creation path.");
match(app,/if\(isDemoMode\(\)&&!demoAccountChoiceResolved10317\)\{showDemoAccountChoice10317\(\);return;\}/);
match(app,/id="demoChoiceTitle10317">Turn off Demo Mode\?<\/h2>/);
match(app,/id="keepDemoAccount10317">No — Practice in Demo<\/button>/);
match(app,/id="useRealAccount10317">Yes — Use Real Vault<\/button>/);
match(app,/setDemoMode\(false\);/);
match(app,/data=loadData\(\{allowEmptyReal:true\}\);saveData\(data\);applyTheme\(\)/);
match(app,/firstAccountGuide10317=true;demoAccountChoiceResolved10317=true;startAccountCreation10317\(\)/);

match(app,/const guidedNewAccount10317=!editing&&/);
match(app,/editing\?editLocationMarkup10318:createLocationMarkup10318/);
match(app,/id="firstAccountGps10317">⌖ Use Current Location<\/button>/);
match(app,/id="firstAccountManual10317">✎ Enter Manually<\/button>/);
match(app,/Find and confirm the location/);
match(app,/Address lookup starts only after you tap Search or Use Current Location/);
match(app,/firstAccountGps10317"\)\?\.addEventListener\("click",captureFirstAccountAddress10317\)/);
match(app,/nativeAppleMapsAvailable10323\(\)\?await nativeMapRequest10323\("currentLocation"\)/);
match(app,/navigator\.geolocation\.getCurrentPosition\(resolve,reject,gpsOptions\(\)\)/);
ok(!/scheduleFirstRunOnboarding10317[\s\S]{0,500}navigator\.geolocation\.getCurrentPosition/.test(app),"First-run slides must not request location automatically.");

match(storage,/addressAssist:true/);
match(storage,/reverseGeocodeEndpoint:"https:\/\/nominatim\.openstreetmap\.org\/reverse"/);
match(app,/gpsAddressAssist","Enable address lookup when adding accounts"/);
match(app,/Search and GPS assistance run only after a tap and always require address confirmation/);
match(app,/native iPhone app uses Apple Maps and Core Location/);
match(app,/s\.gps=\{\.\.\.\(s\.gps\|\|\{\}\)[\s\S]*?addressAssist:checked\("gpsAddressAssist"\)\}/);

match(app,/function reverseCurrentAddress10317\(coords\)/);
match(app,/url\.searchParams\.set\("format","jsonv2"\)/);
match(app,/url\.searchParams\.set\("addressdetails","1"\)/);
match(app,/url\.searchParams\.set\("namedetails","1"\)/);
match(app,/url\.searchParams\.set\("zoom","18"\)/);
match(app,/fetch\(url\.toString\(\),\{headers:\{Accept:"application\/json"\},referrerPolicy:"strict-origin-when-cross-origin"/);
match(app,/setTimeout\(\(\)=>controller\.abort\(\),14000\)/);
match(app,/sessionStorage\.getItem\(FIRST_ADDRESS_CACHE_KEY_10317\)/);
match(app,/sessionStorage\.setItem\(FIRST_ADDRESS_CACHE_KEY_10317/);
match(app,/const allowed=new Set\(\["amenity","shop","office","tourism","leisure","craft","industrial","commercial","healthcare","historic"\]\)/);
match(app,/payload\.namedetails\?\.name\|\|payload\.name/);
match(app,/const street=\[address\.house_number,road\]\.filter\(Boolean\)\.join\(" "\)/);
match(app,/const city=address\.city\|\|address\.town\|\|address\.village/);
match(app,/"wyoming":"WY"/);

match(app,/id="detectedAddressTitle10317">I see you are at this address<\/h2>/);
match(app,/COMMERCIAL LOCATION FOUND/);
match(app,/Is that correct\? Would you like to add this address\?/);
match(app,/id="manualDetectedAddress10317">Enter Manually<\/button>/);
match(app,/id="retryDetectedAddress10317">No — Try Again<\/button>/);
match(app,/id="useDetectedAddress10317">Yes — Add Address<\/button>/);
match(app,/Address lookup © OpenStreetMap contributors/);
match(app,/useDetectedAddress10317"\)\.onclick=\(\)=>\{applyDetectedAddress10317\(result\);close\(\);\}/);
match(app,/manualDetectedAddress10317"\)\.onclick=\(\)=>\{applyGpsFields10317\(result\)/);
ok(!/manualDetectedAddress10317"\)\.onclick=\(\)=>\{applyDetectedAddress10317/.test(app),"Manual choice must not insert the suggested address.");
match(app,/if\(name&&result\.businessName&&!name\.value\.trim\(\)\)\{name\.value=result\.businessName/);
match(app,/const values=\{street:result\.street,city:result\.city,state:result\.state,zip:result\.zip\}/);
match(app,/obj\.plusCode=encodePlusCode071\(gpsLat,gpsLng,plusCodeSettings0794\(\)\.accountLength\)/);
match(app,/obj\.geocodeSource=firstAccountDetected10317\.source/);
match(app,/First \$\{recordLower\} created\. Add contacts, photos, and exact locations from Account Detail/);
match(app,/GPS is ready, but the address lookup was unavailable\. Enter the address manually/);
match(app,/GPS could not be used: \$\{err\.message\|\|"permission denied"\}\. Enter the address manually/);

const marker="Build 1.03.17 — guided first-run and first-account setup";
const previousMarker="Build 1.03.16 — compact secondary workflow lists";
const updateMarker="Build 1.03.7 — canonical Update Ready geometry";
ok(design.includes(marker));
ok(design.indexOf(marker)>design.indexOf(previousMarker),"Onboarding styles must follow the prior list cleanup.");
ok(design.indexOf(marker)<design.indexOf(updateMarker),"Onboarding styles must remain before the final Update Ready geometry contract.");
match(design,/\.firstRunOverlay10317\{[\s\S]*?position:fixed;[\s\S]*?place-items:center;[\s\S]*?backdrop-filter:blur\(14px\)/);
match(design,/\.firstRunDialog10317\{[\s\S]*?width:min\(100%,520px\);[\s\S]*?max-height:min\(760px,calc\(100dvh - 28px\)\)/);
match(design,/\.firstRunActions10317,[\s\S]*?grid-template-columns:1fr 1fr/);
match(design,/\.accountAddressWorkspace10318\{gap:11px!important\}/);
match(design,/\.detectedAddressDialog10317>footer\{[\s\S]*?grid-template-columns:\.9fr \.9fr 1\.2fr/);
match(design,/@media\(max-width:430px\)\{[\s\S]*?\.accountAddressFinderActions10318\{grid-template-columns:1fr\}/);
match(design,/@media\(max-width:430px\)\{[\s\S]*?\.detectedAddressDialog10317>footer \.primary\{grid-column:1\/-1;grid-row:1\}/);

console.log(JSON.stringify({status:"passed",build,checks}));
