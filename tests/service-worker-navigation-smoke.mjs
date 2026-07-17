import assert from "node:assert/strict";
import vm from "node:vm";
import {readFile} from "node:fs/promises";

const [source,versionText]=await Promise.all([
  readFile(new URL("../sw.js",import.meta.url),"utf8"),
  readFile(new URL("../version.json",import.meta.url),"utf8")
]);
const build=JSON.parse(versionText).build;

assert.match(source,new RegExp(`const BUILD="${build.replaceAll(".","\\.")}"`));
assert.match(source,/const NAVIGATION_FRESH_WAIT_MS=1800/);
assert.match(source,/Promise\.race\(\[refresh,new Promise\(resolve=>setTimeout\(\(\)=>resolve\(null\),NAVIGATION_FRESH_WAIT_MS\)\)\]\)/);
assert.match(source,/return fresh\|\|cached/);
assert.doesNotMatch(source,/return cached\|\|await refresh/);

function delayedResponse(body,delay){
  return new Promise(resolve=>setTimeout(()=>resolve(new Response(body,{status:200})),delay));
}

async function navigate({cachedBody="cached",preloadResponse=Promise.resolve(null),networkBody="network",networkError=false}={}){
  const listeners={};
  const puts=[];
  let fetchCount=0;
  const request={method:"GET",mode:"navigate",url:"https://example.test/firevault/"};
  const cache={
    match:async key=>cachedBody===null?undefined:new Response(cachedBody,{status:200}),
    put:async(key,response)=>{puts.push({key,ok:response.ok});}
  };
  const context={
    URL,
    Response,
    Promise,
    location:{origin:"https://example.test"},
    setTimeout:(callback,delay)=>setTimeout(callback,Math.min(delay,10)),
    clearTimeout,
    fetch:async()=>{fetchCount+=1;if(networkError)throw new Error("offline");return new Response(networkBody,{status:200});},
    caches:{open:async()=>cache,keys:async()=>[],delete:async()=>true,match:async()=>undefined},
    self:{
      registration:{navigationPreload:{enable:async()=>undefined}},
      clients:{claim:async()=>undefined},
      skipWaiting:()=>undefined,
      addEventListener:(type,listener)=>{listeners[type]=listener;}
    }
  };
  vm.createContext(context);
  vm.runInContext(source,context,{filename:"sw.js"});
  const waits=[];
  let responsePromise;
  listeners.fetch({
    request,
    preloadResponse,
    respondWith:value=>{responsePromise=Promise.resolve(value);},
    waitUntil:value=>{waits.push(Promise.resolve(value));}
  });
  assert.ok(responsePromise,"Navigation must provide a response.");
  assert.equal(waits.length,1,"The network refresh must remain alive after a cached fallback.");
  const response=await responsePromise;
  const body=await response.text();
  await Promise.all(waits);
  return {body,fetchCount,puts};
}

const fresh=await navigate({preloadResponse:Promise.resolve(new Response("fresh",{status:200}))});
assert.equal(fresh.body,"fresh","A fast online navigation should use the newest page immediately.");
assert.equal(fresh.fetchCount,0,"Navigation preload should avoid a duplicate fetch.");
assert.equal(fresh.puts.length,1,"The newest page should refresh the active cache.");

const slow=await navigate({preloadResponse:delayedResponse("slow-fresh",30)});
assert.equal(slow.body,"cached","A slow connection should return the offline page before blocking the app.");
assert.equal(slow.puts.length,1,"The slow response should still refresh the cache in the background.");

const offline=await navigate({preloadResponse:Promise.resolve(null),networkError:true});
assert.equal(offline.body,"cached","An offline navigation should keep FireVault usable.");
assert.equal(offline.fetchCount,1);
assert.equal(offline.puts.length,0);

const firstInstall=await navigate({cachedBody:null,preloadResponse:Promise.resolve(new Response("first-online",{status:200}))});
assert.equal(firstInstall.body,"first-online","A first online load without cached HTML should use the network response.");
assert.equal(firstInstall.puts.length,1);

console.log(JSON.stringify({status:"passed",build,checks:18,paths:["fresh","slow","offline","first-install"]}));
