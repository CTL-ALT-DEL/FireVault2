import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";

const [app,version,container,shell,project]=await Promise.all([
  readFile(new URL("../src/app.js",import.meta.url),"utf8"),
  readFile(new URL("../version.json",import.meta.url),"utf8"),
  readFile(new URL("../../work/ios-upload/FireVault-iOS/FireVault/FireVault/ContentView.swift",import.meta.url),"utf8"),
  readFile(new URL("../../work/ios-upload/FireVault-iOS/FireVault/FireVault/NativeAppShell.swift",import.meta.url),"utf8"),
  readFile(new URL("../../work/ios-upload/FireVault-iOS/FireVault/FireVault.xcodeproj/project.pbxproj",import.meta.url),"utf8")
]);

let checks=0;
const equal=(actual,expected,message)=>{checks+=1;assert.equal(actual,expected,message)};
const match=(source,pattern,message)=>{checks+=1;assert.match(source,pattern,message)};
const ok=(value,message)=>{checks+=1;assert.ok(value,message)};

equal(JSON.parse(version).build,"1.03.30","The native app shell must ship in Build 1.03.30.");

match(app,/function nativeAppShellAvailable10330\(\)/);
match(app,/function nativeAppShellPayload10330\(\)/);
match(app,/window\.fireVaultNativeAppAction=function/);
match(app,/messageHandlers\?\.fireVaultAppShell\?\.postMessage/);
for(const action of ["refreshNearby","openAccount","addAccount","photo","routeAccount","callAccount","openSetting"]){
  match(app,new RegExp(`case "${action}"`),`Native ${action} must remain connected to the vault.`);
}
for(const group of ["Profile","Field Tools","Reports","Data & Security","Help & About"]){
  ok(app.includes(`title:"${group}"`),`${group} must remain in the simplified native Settings model.`);
}
match(app,/syncNativeAppShell10330\(\);/);
match(app,/resumeNativeAppShell10330/);

match(container,/@StateObject private var appShellBridge = FireVaultAppShellBridge\(\)/);
match(container,/configuration\.userContentController\.add\(context\.coordinator, name: "fireVaultAppShell"\)/);
match(container,/if message\.name == "fireVaultAppShell"/);
match(container,/NativeAppShellView\(payload: payload, bridge: appShellBridge\)/);
match(container,/FireVault-iOS\/1\.03\.30/);

match(shell,/final class FireVaultAppShellBridge: ObservableObject/);
match(shell,/struct NativeAppShellView: View/);
match(shell,/struct NativeNearbyView: View/);
match(shell,/struct NativeAccountsView: View/);
match(shell,/struct NativeSettingsView: View/);
match(shell,/Map\(initialPosition: \.region/);
match(shell,/\.searchable\(text: \$search/);
match(shell,/DisclosureGroup\(isExpanded:/);
match(shell,/\.glassEffect\(\)/);
for(const label of ["Nearby","Accounts","Photo","Settings","A–Z","Favorites","Recent"]){
  ok(shell.includes(`"${label}"`),`${label} must remain visible in the native shell.`);
}
ok(!shell.includes('"Tasks"'),"Tasks must not be restored in the native shell.");
ok(!shell.includes('"Deficiencies"'),"Deficiencies must not be restored in the native shell.");

equal((project.match(/CURRENT_PROJECT_VERSION = 31;/g)||[]).length,2,"Both app configurations must use native build 31.");
equal((project.match(/MARKETING_VERSION = 1\.03\.30;/g)||[]).length,2,"Both app configurations must use marketing version 1.03.30.");

console.log(JSON.stringify({status:"passed",build:"1.03.30",checks,shell:"native-swiftui",settingsAreas:5,map:"MapKit"}));
