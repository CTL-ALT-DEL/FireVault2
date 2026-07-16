import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";

const [index,worker,app,storage,version]=await Promise.all([
  readFile(new URL("../index.html",import.meta.url),"utf8"),
  readFile(new URL("../sw.js",import.meta.url),"utf8"),
  readFile(new URL("../src/app.js",import.meta.url),"utf8"),
  readFile(new URL("../src/storage.js",import.meta.url),"utf8"),
  readFile(new URL("../version.json",import.meta.url),"utf8")
]);

const build=JSON.parse(version).build;
assert.equal(build,"1.03.1");
assert.match(index,/setTimeout\(function\(\)\{[\s\S]*?showRecovery\([\s\S]*?\},8000\);/);
assert.match(index,/updateButton\.disabled=false;laterButton\.disabled=false;/);
assert.match(index,/updateButton\.textContent="Try Again";laterButton\.textContent="Reload App";/);
assert.equal((index.match(/postMessage\(\{type:"SKIP_WAITING"\}\)/g)||[]).length,1);
assert.doesNotMatch(worker,/install"[\s\S]{0,180}skipWaiting\(/);
assert.match(worker,/message"[\s\S]{0,180}SKIP_WAITING[\s\S]{0,80}skipWaiting\(/);

assert.match(storage,/loadData\(options=\{\}\)/);
assert.match(storage,/allowEmptyReal/);
assert.match(app,/activateRealVaultForCustomerImport065/);
assert.match(app,/Customer CSV imports create real customer records/);
assert.match(app,/const persistedIds=new Set/);
assert.match(app,/if\(isDemoMode\(\)\|\|missing\.length\)/);

for(const source of [index,worker,app,storage]) assert.doesNotMatch(source,/\?v=1\.03\.0/,"Active runtime references must use the current build.");
console.log(JSON.stringify({status:"passed",build,checks:13}));
