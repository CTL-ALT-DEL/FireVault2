const BUILD="0.78.0";
const CACHE=`firevault-${BUILD}`;
const SHELL=["./","./index.html","./manifest.json","./src/app.js?v=0.78.0","./src/storage.js?v=0.78.0","./src/styles.css?v=0.78.0","./assets/favicon.png","./assets/apple-touch-icon.png","./assets/icon-192.png","./assets/icon-512.png"];
self.addEventListener("install",event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(SHELL)).then(()=>self.skipWaiting()));});
self.addEventListener("activate",event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith("firevault-")&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener("message",event=>{if(event.data&&event.data.type==="SKIP_WAITING") self.skipWaiting();});
self.addEventListener("fetch",event=>{
 const req=event.request; if(req.method!=="GET") return; const url=new URL(req.url); if(url.origin!==location.origin) return;
 if(req.mode==="navigate" || url.pathname.endsWith("/index.html") || url.pathname.endsWith("/version.json") || url.pathname.endsWith("/manifest.json")){
  event.respondWith(fetch(req,{cache:"no-store"}).then(res=>{const copy=res.clone();caches.open(CACHE).then(c=>c.put(req,copy));return res;}).catch(()=>caches.match(req).then(r=>r||caches.match("./index.html")))); return;
 }
 event.respondWith(caches.match(req).then(cached=>{const network=fetch(req).then(res=>{if(res&&res.ok){const copy=res.clone();caches.open(CACHE).then(c=>c.put(req,copy));}return res;}).catch(()=>cached);return cached||network;}));
});
