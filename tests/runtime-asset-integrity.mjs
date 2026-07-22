import assert from "node:assert/strict";
import {access,readFile,readdir} from "node:fs/promises";
import {posix as path} from "node:path";
import {fileURLToPath} from "node:url";

const rootUrl=new URL("../",import.meta.url);
const rootPath=fileURLToPath(rootUrl);
const srcNames=(await readdir(new URL("../src/",import.meta.url))).sort();
const sourceNames=srcNames.filter(name=>/\.(?:js|css)$/.test(name));
const sourceEntries=await Promise.all(sourceNames.map(async name=>[
  `src/${name}`,await readFile(new URL(`../src/${name}`,import.meta.url),"utf8")
]));
const sources=new Map(sourceEntries);
const [index,worker,manifestText,versionText]=await Promise.all([
  readFile(new URL("../index.html",import.meta.url),"utf8"),
  readFile(new URL("../sw.js",import.meta.url),"utf8"),
  readFile(new URL("../manifest.json",import.meta.url),"utf8"),
  readFile(new URL("../version.json",import.meta.url),"utf8")
]);
const manifest=JSON.parse(manifestText);
const build=JSON.parse(versionText).build;
let checks=0;

function ok(value,message){checks++;assert.ok(value,message);}
function equal(actual,expected,message){checks++;assert.equal(actual,expected,message);}
function cleanReference(value){return String(value||"").split(/[?#]/,1)[0];}
function localReference(value){
  const ref=String(value||"").trim();
  return !!ref&&!ref.startsWith("#")&&!/^(?:[a-z]+:|\/\/)/i.test(ref)&&!ref.includes("${");
}
function resolveReference(from,value){
  const clean=cleanReference(value).replace(/^\.\//,"");
  return path.normalize(path.join(path.dirname(from),clean)).replace(/^\.\//,"");
}
async function requireFile(relative,label){
  await access(new URL(relative,rootUrl));
  checks++;
  ok(!relative.startsWith("../"),`${label} must remain inside the release root: ${relative}`);
}
function matches(text,expression){return [...text.matchAll(expression)].map(match=>match[1]);}

equal(build,"1.03.22");
equal(manifest.version,build);
equal(manifest.start_url,"./");
equal(manifest.scope,"./");
equal(manifest.display,"standalone");
ok(["any","portrait","landscape"].includes(manifest.orientation));

const shellMatch=worker.match(/const SHELL=(\[[\s\S]*?\]);/);
ok(shellMatch,"The service worker must expose a parseable offline shell.");
const shell=JSON.parse(shellMatch[1]);
equal(new Set(shell).size,shell.length,"Offline-shell entries must not be duplicated.");

const runtimeFiles=new Set();
const htmlRefs=matches(index,/(?:src|href)="([^"#]+)"/g).filter(localReference);
htmlRefs.forEach(ref=>runtimeFiles.add(cleanReference(ref).replace(/^\.\//,"")));
equal(htmlRefs.length,25,"The checked HTML bootstrap reference count changed; review the offline contract.");
htmlRefs.forEach(ref=>ok(ref.includes(`?v=${build}`),`HTML reference is missing the current build token: ${ref}`));

for(const [name,text] of sources){
  if(name.endsWith(".js")){
    const imports=matches(text,/^\s*import[^\n]*?\sfrom\s*["']([^"']+)["']/gm).filter(localReference);
    imports.forEach(ref=>{
      ok(ref.includes(`?v=${build}`),`${name} import is missing the current build token: ${ref}`);
      runtimeFiles.add(resolveReference(name,ref));
    });
  }
  if(name.endsWith(".css")){
    const urls=matches(text,/url\(\s*["']?([^"')]+)["']?\s*\)/g).filter(localReference);
    urls.forEach(ref=>runtimeFiles.add(resolveReference(name,ref)));
  }
  matches(text,/["'`](assets\/[A-Za-z0-9_.-]+)["'`]/g).forEach(ref=>runtimeFiles.add(ref));
}

for(const icon of manifest.icons||[]){
  ok(localReference(icon.src),`Manifest icon must use a local path: ${icon.src}`);
  runtimeFiles.add(cleanReference(icon.src));
  ok(/^\d+x\d+$/.test(icon.sizes),`Manifest icon size is invalid: ${icon.sizes}`);
  equal(icon.type,"image/png");
}
for(const shortcut of manifest.shortcuts||[]){
  ok(/^\.\/\?route=[A-Za-z]+$/.test(shortcut.url),`Manifest shortcut leaves the app scope: ${shortcut.url}`);
}

const shellFiles=new Set(shell.map(item=>cleanReference(item).replace(/^\.\//,"")).filter(Boolean));
for(const ref of runtimeFiles){
  await requireFile(ref,"Runtime reference");
  ok(shellFiles.has(ref),`Runtime file is missing from the offline shell: ${ref}`);
}
for(const ref of shellFiles) await requireFile(ref,"Offline-shell reference");

shell.filter(ref=>/^\.\/src\/.*\.(?:js|css)\?/.test(ref)).forEach(ref=>{
  ok(ref.endsWith(`?v=${build}`),`Offline-shell source has a stale build token: ${ref}`);
});

function pngSize(buffer){
  const signature="89504e470d0a1a0a";
  equal(buffer.subarray(0,8).toString("hex"),signature,"Manifest icon is not a valid PNG.");
  return {width:buffer.readUInt32BE(16),height:buffer.readUInt32BE(20)};
}
for(const icon of manifest.icons||[]){
  const expected=icon.sizes.split("x").map(Number);
  const actual=pngSize(await readFile(new URL(icon.src,rootUrl)));
  equal(actual.width,expected[0],`${icon.src} width does not match its manifest declaration.`);
  equal(actual.height,expected[1],`${icon.src} height does not match its manifest declaration.`);
}

ok(runtimeFiles.size>=30,"The runtime graph is unexpectedly small.");
ok(shellFiles.size>=30,"The offline shell is unexpectedly small.");

console.log(JSON.stringify({
  status:"passed",build,checks,
  runtimeFiles:runtimeFiles.size,offlineFiles:shellFiles.size,
  htmlReferences:htmlRefs.length,sourceFiles:sourceNames.length,
  manifestIcons:(manifest.icons||[]).length,manifestShortcuts:(manifest.shortcuts||[]).length
}));
