const BUILD="1.03.24";
const CACHE=`firevault-${BUILD}`;
const NAVIGATION_FRESH_WAIT_MS=1800;
const SHELL=["./","./index.html","./manifest.json","./version.json","./src/app.js?v=1.03.24","./src/storage.js?v=1.03.24","./src/providers.js?v=1.03.24","./src/open-location-code.js?v=1.03.24","./src/media-store.js?v=1.03.24","./src/generated-app-profile.js?v=1.03.24","./src/app-profile.js?v=1.03.24","./src/module-registry.js?v=1.03.24","./src/module-bindings.js?v=1.03.24","./src/record-schema.js?v=1.03.24","./src/workflow-schema.js?v=1.03.24","./src/theme-profile.js?v=1.03.24","./src/content-pack-registry.js?v=1.03.24","./src/sync-storage-profile.js?v=1.03.24","./src/app-forge-blueprint.js?v=1.03.24","./src/app-forge-recipes.js?v=1.03.24","./src/app-forge-factory.js?v=1.03.24","./src/app-forge-generator.js?v=1.03.24","./src/styles.css?v=1.03.24","./src/design-system.css?v=1.03.24","./assets/favicon.png","./assets/apple-touch-icon.png","./assets/icon-192.png","./assets/icon-512.png","./assets/firevault-logo-master.png","./assets/overlay-sample-fire-alarm-issue.png","./assets/help-nearby.png","./assets/help-account-detail.png","./assets/help-photo-overlay.png"];
self.addEventListener("install",event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(SHELL)));});
self.addEventListener("activate",event=>{event.waitUntil((async()=>{if(self.registration.navigationPreload)await self.registration.navigationPreload.enable();const keys=await caches.keys();await Promise.all(keys.filter(k=>k.startsWith("firevault-")&&k!==CACHE).map(k=>caches.delete(k)));await self.clients.claim();})());});
self.addEventListener("message",event=>{if(event.data&&event.data.type==="SKIP_WAITING")self.skipWaiting();});
async function updateCache(req,response){if(response&&response.ok){const cache=await caches.open(CACHE);await cache.put(req,response.clone());}return response;}
self.addEventListener("fetch",event=>{
 const req=event.request;if(req.method!=="GET")return;const url=new URL(req.url);if(url.origin!==location.origin)return;
 if(url.pathname.endsWith("/version.json")){event.respondWith(fetch(req,{cache:"no-store"}).then(res=>updateCache(req,res)).catch(()=>caches.match(req)));return;}
 if(req.mode==="navigate"||url.pathname.endsWith("/index.html")){
  const refresh=(async()=>{try{const preload=await event.preloadResponse;const res=preload||await fetch(req,{cache:"no-store"});await updateCache(req,res);return res;}catch{return null;}})();
  event.waitUntil(refresh.then(()=>undefined));
  event.respondWith((async()=>{const cache=await caches.open(CACHE);const cached=await cache.match(req)||await cache.match("./index.html");if(!cached)return await refresh||Response.error();const fresh=await Promise.race([refresh,new Promise(resolve=>setTimeout(()=>resolve(null),NAVIGATION_FRESH_WAIT_MS))]);return fresh||cached;})());return;
 }
 event.respondWith((async()=>{const cached=await caches.match(req);if(cached)return cached;try{return await updateCache(req,await fetch(req));}catch{return Response.error();}})());
});
