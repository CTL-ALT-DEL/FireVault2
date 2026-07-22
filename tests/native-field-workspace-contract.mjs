import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";

const [app,version,container,workspace,project]=await Promise.all([
  readFile(new URL("../src/app.js",import.meta.url),"utf8"),
  readFile(new URL("../version.json",import.meta.url),"utf8"),
  readFile(new URL("../../work/ios-upload/FireVault-iOS/FireVault/FireVault/ContentView.swift",import.meta.url),"utf8"),
  readFile(new URL("../../work/ios-upload/FireVault-iOS/FireVault/FireVault/FieldWorkspace.swift",import.meta.url),"utf8"),
  readFile(new URL("../../work/ios-upload/FireVault-iOS/FireVault/FireVault.xcodeproj/project.pbxproj",import.meta.url),"utf8")
]);

let checks=0;
const equal=(actual,expected,message)=>{checks+=1;assert.equal(actual,expected,message)};
const match=(source,pattern,message)=>{checks+=1;assert.match(source,pattern,message)};
const ok=(value,message)=>{checks+=1;assert.ok(value,message)};

equal(JSON.parse(version).build,"1.03.30","The native Field Workspace must ship in Build 1.03.30.");

// The existing web vault stays authoritative and sends only lightweight account metadata.
match(app,/function nativeFieldWorkspaceAvailable10329\(\)/);
match(app,/messageHandlers\?\.fireVaultWorkspace\?\.postMessage/);
match(app,/function nativeFieldWorkspacePayload10329\(s\)/);
match(app,/window\.fireVaultNativeWorkspaceAction=function/);
match(app,/presentNativeFieldWorkspace10329\(s\)/);
for(const action of ["back","favorite","edit","scan","note","photo","route","nearby","search","settings","addFile","openFile","addEquipment","openEquipment","addLocation","routeLocation"]){
  match(app,new RegExp(`case "${action}"`),`The Field Workspace must keep the ${action} action connected.`);
}
match(app,/documents:docs\.slice\(0,50\)/);
match(app,/equipment:equipment\.slice\(0,50\)/);
match(app,/locations:locations\.slice\(0,50\)/);
match(app,/notes:notes\.slice\(0,30\)/);

// The WKWebView exposes a dedicated, controlled bridge and overlays the native workspace.
match(container,/@StateObject private var workspaceBridge = FireVaultWorkspaceBridge\(\)/);
match(container,/configuration\.userContentController\.add\(context\.coordinator, name: "fireVaultWorkspace"\)/);
match(container,/if message\.name == "fireVaultWorkspace"/);
match(container,/workspaceBridge\.present\(account\)/);
match(container,/FieldWorkspaceView\(account: account, bridge: workspaceBridge\)/);
match(container,/FireVault-iOS\/1\.03\.30/);

// The new Account experience is native SwiftUI, Apple Maps based, and field focused.
match(workspace,/final class FireVaultWorkspaceBridge: ObservableObject/);
match(workspace,/import Combine/);
match(workspace,/struct FieldWorkspaceView: View/);
match(workspace,/MapArrivalView/);
match(workspace,/FilesScansView/);
match(workspace,/EquipmentWorkspaceView/);
match(workspace,/NotesWorkspaceView/);
match(workspace,/Map\(initialPosition: \.region/);
match(workspace,/\.mapStyle\(\.standard\(elevation: \.realistic\)\)/);
match(workspace,/\.glassEffect\(\)/);
match(workspace,/\.buttonStyle\(\.glass\)/);
match(workspace,/\.buttonStyle\(\.glassProminent\)/);
for(const label of ["Notes","Files & Scans","Equipment","Locations","Scan","Camera","Route"]){
  ok(workspace.includes(`"${label}"`),`${label} must remain visible in the native field hierarchy.`);
}
ok(!workspace.includes('"Tasks"'),"Tasks must not appear in the native Field Workspace.");
ok(!workspace.includes('"Deficiencies"'),"Deficiencies must not appear in the native Field Workspace.");
const mapPreview=workspace.slice(workspace.indexOf("private var mapPreview"),workspace.indexOf("private var destinations"));
equal((mapPreview.match(/MapArrivalView\(account: account, bridge: bridge\)/g)||[]).length,1,"The Account map destination must be inserted exactly once.");

equal((project.match(/CURRENT_PROJECT_VERSION = 31;/g)||[]).length,2,"Both app configurations must use native build 31.");
equal((project.match(/MARKETING_VERSION = 1\.03\.30;/g)||[]).length,2,"Both app configurations must use marketing version 1.03.30.");

console.log(JSON.stringify({status:"passed",build:"1.03.30",checks,workspace:"native-swiftui",map:"MapKit",material:"Liquid Glass"}));
