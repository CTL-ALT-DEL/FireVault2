import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";

const [app,design,version,native,project]=await Promise.all([
  readFile(new URL("../src/app.js",import.meta.url),"utf8"),
  readFile(new URL("../src/design-system.css",import.meta.url),"utf8"),
  readFile(new URL("../version.json",import.meta.url),"utf8"),
  readFile(new URL("../../work/ios-upload/FireVault-iOS/FireVault/FireVault/ContentView.swift",import.meta.url),"utf8"),
  readFile(new URL("../../work/ios-upload/FireVault-iOS/FireVault/FireVault.xcodeproj/project.pbxproj",import.meta.url),"utf8")
]);

let checks=0;
function equal(actual,expected,message){checks+=1;assert.equal(actual,expected,message)}
function match(source,pattern,message){checks+=1;assert.match(source,pattern,message)}
function ok(value,message){checks+=1;assert.ok(value,message)}

const build=JSON.parse(version).build;
equal(build,"1.03.29","The native Apple scanner must ship in Build 1.03.29.");

// The browser app exposes the scanner only when the native WKWebView bridge exists.
match(app,/window\.webkit\?\.messageHandlers\?\.fireVaultScanner\?\.postMessage/);
match(app,/window\.fireVaultNativeScannerPage=function/);
match(app,/window\.fireVaultNativeScannerResolve=function/);
match(app,/expected!==pages\.length/);
match(app,/nativeDocumentScannerAvailable10325\(\)\?`<button class="primary nativeScanButton10325" id="scanDocumentBtn10325">/);
match(app,/startNativeDocumentScan10325\(s\)/);
match(app,/APPLE DOCUMENT SCANNER/);
match(app,/Save \$\{validPages\.length\}-Page Scan/);
match(app,/isScannedDocument:true/);
match(app,/scanPageCount:validPages\.length/);
match(app,/stageVaultMedia\(data\)/);
match(app,/scannerPdfBlob0800/);
match(app,/scannerDownloadPdf0800/);
match(app,/scannerSharePdf0800/);
match(app,/browser PWA intentionally hides both native-only controls/);

// The iOS container must use Apple's document camera and stream pages to the web app.
match(native,/import VisionKit/);
match(native,/configuration\.userContentController\.add\(context\.coordinator, name: "fireVaultScanner"\)/);
match(native,/VNDocumentCameraViewControllerDelegate/);
match(native,/VNDocumentCameraViewController\.isSupported/);
match(native,/let scanner = VNDocumentCameraViewController\(\)/);
match(native,/didFinishWith scan: VNDocumentCameraScan/);
match(native,/documentCameraViewControllerDidCancel/);
match(native,/didFailWithError error: Error/);
match(native,/scan\.imageOfPage\(at:/);
match(native,/maximumSide: CGFloat = 2200/);
match(native,/jpegData\(compressionQuality: 0\.82\)/);
match(native,/prepareAndDeliverScannerPage/);
match(native,/fireVaultNativeScannerPage/);
match(native,/fireVaultNativeScannerResolve/);
match(native,/FireVault-iOS\/1\.03\.29/);

equal((project.match(/CURRENT_PROJECT_VERSION = 29;/g)||[]).length,2,"Both app configurations must use native build 29.");
equal((project.match(/MARKETING_VERSION = 1\.03\.29;/g)||[]).length,2,"Both app configurations must use version 1.03.29.");
match(project,/INFOPLIST_KEY_NSCameraUsageDescription = "FireVault uses the camera to photograph and scan fire alarm equipment and site documents\.";/);

const marker="Build 1.03.25 — compact Apple Document Scanner handoff and save review";
const updateMarker="Build 1.03.7 — canonical Update Ready geometry";
ok(design.includes(marker),"The final design layer must identify the scanner review contract.");
ok(design.indexOf(marker)<design.indexOf(updateMarker),"Scanner review rules must remain before the final Update Ready geometry contract.");
match(design,/\.nativeScanReviewOverlay10325\{[\s\S]*?backdrop-filter:blur\(16px\) saturate\(\.8\)/);
match(design,/\.nativeScanReviewSheet10325\{[\s\S]*?max-height:calc\(100dvh - max\(24px,env\(safe-area-inset-top\)\) - max\(24px,env\(safe-area-inset-bottom\)\)\)!important/);
match(design,/@media\(max-width:620px\)\{[\s\S]*?height:100dvh!important;[\s\S]*?padding-top:env\(safe-area-inset-top\)!important/);

console.log(JSON.stringify({status:"passed",build,checks,nativeScanner:"VisionKit",multiPage:true,pdfTools:true}));
