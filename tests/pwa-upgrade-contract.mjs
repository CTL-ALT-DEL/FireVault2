import assert from "node:assert/strict";
import {access,readFile} from "node:fs/promises";
import {fileURLToPath} from "node:url";

const root=new URL("../",import.meta.url);
const [index,worker,storage,styles,design,manifestText,versionText]=await Promise.all([
  readFile(new URL("index.html",root),"utf8"),
  readFile(new URL("sw.js",root),"utf8"),
  readFile(new URL("src/storage.js",root),"utf8"),
  readFile(new URL("src/styles.css",root),"utf8"),
  readFile(new URL("src/design-system.css",root),"utf8"),
  readFile(new URL("manifest.json",root),"utf8"),
  readFile(new URL("version.json",root),"utf8")
]);

const version=JSON.parse(versionText);
const manifest=JSON.parse(manifestText);
const build=version.build;
const escapedBuild=build.replaceAll(".","\\.");

assert.equal(build,"1.03.19");
assert.equal(manifest.version,build);
assert.match(storage,new RegExp(`export const BUILD = "${escapedBuild}"`));
assert.match(worker,new RegExp(`const BUILD="${escapedBuild}"`));
assert.match(index,new RegExp(`window\\.FIREVAULT_BUILD = "${escapedBuild}"`));
assert.match(index,new RegExp(`serviceWorker\\.register\\("sw\\.js\\?v=${escapedBuild}"`));
assert.match(index,new RegExp(`src/styles\\.css\\?v=${escapedBuild}`));
assert.match(index,new RegExp(`src/design-system\\.css\\?v=${escapedBuild}`));

const shellMatch=worker.match(/const SHELL=(\[[\s\S]*?\]);/);
assert.ok(shellMatch,"The service worker must declare its offline shell.");
const shell=JSON.parse(shellMatch[1]);
assert.ok(shell.includes("./index.html"));
assert.ok(shell.includes("./version.json"));
assert.ok(shell.includes(`./src/styles.css?v=${build}`));
assert.ok(shell.includes(`./src/design-system.css?v=${build}`));
const missing=[];
for(const item of shell){
  const path=item.replace(/^\.\//,"").split("?")[0];
  if(!path)continue;
  try{await access(new URL(path,root));}catch{missing.push(path);}
}
assert.deepEqual(missing,[],"Every offline-shell entry must exist in the release package.");

assert.match(worker,/const CACHE=`firevault-\$\{BUILD\}`/);
assert.doesNotMatch(worker,/addEventListener\("install"[\s\S]{0,220}skipWaiting\(/);
assert.match(worker,/addEventListener\("message"[\s\S]{0,180}SKIP_WAITING[\s\S]{0,80}skipWaiting\(/);
assert.match(worker,/keys\.filter\(k=>k\.startsWith\("firevault-"\)&&k!==CACHE\)/);
assert.match(worker,/clients\.claim\(\)/);
assert.match(worker,/version\.json"\)\)\{event\.respondWith\(fetch\(req,\{cache:"no-store"\}\)/);
assert.match(worker,/const NAVIGATION_FRESH_WAIT_MS=1800/);
assert.match(worker,/req\.mode==="navigate"[\s\S]*?const refresh=[\s\S]*?event\.waitUntil\(refresh\.then/);
assert.match(worker,/if\(!cached\)return await refresh\|\|Response\.error\(\)/);
assert.match(worker,/Promise\.race\(\[refresh,new Promise\(resolve=>setTimeout/);
assert.doesNotMatch(worker,/return cached\|\|await refresh/);
assert.match(worker,/preloadResponse[\s\S]*?fetch\(req,\{cache:"no-store"\}\)/);
assert.match(index,/controllerchange"[\s\S]{0,120}fireVaultReloadForUpdate\(\)/);
assert.equal((index.match(/postMessage\(\{type:"SKIP_WAITING"\}\)/g)||[]).length,1);

const geometryMarker=design.lastIndexOf("Build 1.03.7 — canonical Update Ready geometry");
assert.ok(geometryMarker>=0 && geometryMarker>design.length-6000,"Canonical update geometry must remain at the end of the final stylesheet.");
const geometry=design.slice(geometryMarker);
const allStyles=`${styles}\n${design}`;
assert.match(geometry,/#fvUpdateBanner072\{[\s\S]*?inset:0!important;[\s\S]*?width:100%!important;[\s\S]*?height:100dvh!important/);
assert.match(geometry,/#fvUpdateBanner072>\.fvUpdateDialog1033\{[\s\S]*?width:min\(100%,540px\)!important;[\s\S]*?transform:none!important/);
assert.match(geometry,/env\(safe-area-inset-top\)[\s\S]*?env\(safe-area-inset-bottom\)/);
assert.doesNotMatch(allStyles,/#fvUpdateBanner072\{[^}]*left:50%!important/);
assert.doesNotMatch(allStyles,/#fvUpdateBanner072\{[^}]*bottom:calc\(88px/);
assert.doesNotMatch(allStyles,/#fvUpdateBanner072 div\{display:grid/);
assert.doesNotMatch(index,new RegExp(`\\?v=1\\.03\\.(?:[0-9]|10)(?:"|')`));

console.log(JSON.stringify({status:"passed",build,checks:34,shellAssets:shell.length,root:fileURLToPath(root)}));
