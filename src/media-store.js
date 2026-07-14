/* FireVault Build 0.91.0 — IndexedDB media storage
   Keeps large photo and scanned-page payloads out of the main localStorage vault.
   The main vault stores metadata and media references; payloads remain local-first
   in IndexedDB and are rehydrated into the in-memory model when needed. */

const DB_NAME = "firevault_media_store";
const DB_VERSION = 1;
const STORE_NAME = "media";
const MEDIA_SCHEMA = 1;

const runtimeCache = new Map();
const persistedKeys = new Set();
const pendingWrites = new Map();
let dbPromise = null;

function openDb(){
  if(dbPromise) return dbPromise;
  dbPromise = new Promise((resolve,reject)=>{
    if(!globalThis.indexedDB){reject(new Error("IndexedDB is unavailable on this device."));return;}
    const request=indexedDB.open(DB_NAME,DB_VERSION);
    request.onupgradeneeded=()=>{
      const db=request.result;
      if(!db.objectStoreNames.contains(STORE_NAME)){
        const store=db.createObjectStore(STORE_NAME,{keyPath:"key"});
        store.createIndex("updatedAt","updatedAt",{unique:false});
      }
    };
    request.onsuccess=()=>resolve(request.result);
    request.onerror=()=>reject(request.error||new Error("FireVault media storage could not be opened."));
    request.onblocked=()=>reject(new Error("FireVault media storage is blocked by another open tab."));
  });
  return dbPromise;
}

function txComplete(tx){
  return new Promise((resolve,reject)=>{
    tx.oncomplete=()=>resolve();
    tx.onerror=()=>reject(tx.error||new Error("Media storage transaction failed."));
    tx.onabort=()=>reject(tx.error||new Error("Media storage transaction was cancelled."));
  });
}

function isDataUrl(value){return /^data:[^;,]+(?:;[^,]*)?,/i.test(String(value||""));}
function dataUrlMime(value){const m=String(value||"").match(/^data:([^;,]+)/i);return m?.[1]||"application/octet-stream";}
function dataUrlBytes(value){
  const text=String(value||"");
  const comma=text.indexOf(",");
  if(comma<0)return new Blob([text]).size;
  const head=text.slice(0,comma),body=text.slice(comma+1);
  if(/;base64/i.test(head))return Math.max(0,Math.floor(body.length*3/4)-(body.endsWith("==")?2:body.endsWith("=")?1:0));
  try{return new TextEncoder().encode(decodeURIComponent(body)).length;}catch{return new Blob([body]).size;}
}
function safeId(value,fallback){return String(value||fallback||"item").replace(/[^a-zA-Z0-9_.:-]+/g,"-").slice(0,160);}
function mediaKey(scope,siteId,docId,suffix){return `fvmedia:${safeId(scope,"vault")}:${safeId(siteId,"global")}:${safeId(docId,"doc")}:${safeId(suffix,"image")}`;}

function collectMediaSlots(vault){
  const slots=[];
  const addDocument=(doc,scope,siteId,index)=>{
    if(!doc||typeof doc!=="object")return;
    const docId=doc.id||`doc-${index}`;
    const primary=doc.imageData||doc.photoData||"";
    if(primary||doc.mediaRef){
      doc.mediaRef=doc.mediaRef||mediaKey(scope,siteId,docId,"image");
      slots.push({owner:doc,field:"imageData",legacyField:"photoData",ref:doc.mediaRef,data:primary,kind:"image",mime:doc.mediaMime||dataUrlMime(primary),name:doc.imageName||doc.title||"Account photo"});
    }
    if(Array.isArray(doc.scanPages))doc.scanPages.forEach((page,pageIndex)=>{
      if(!page||typeof page!=="object")return;
      const pageData=page.imageData||"";
      if(pageData||page.mediaRef){
        page.mediaRef=page.mediaRef||mediaKey(scope,siteId,docId,`scan-${page.id||pageIndex+1}`);
        slots.push({owner:page,field:"imageData",ref:page.mediaRef,data:pageData,kind:"scan-page",mime:page.mediaMime||dataUrlMime(pageData),name:`${doc.title||"Scanned document"} page ${pageIndex+1}`});
      }
    });
  };
  (vault?.sites||[]).forEach((site,siteIndex)=>(site?.docs||[]).forEach((doc,docIndex)=>addDocument(doc,"site",site.id||`site-${siteIndex}`,docIndex)));
  (vault?.resources||[]).forEach((doc,index)=>addDocument(doc,"resource","library",index));
  return slots;
}

async function putRecord(slot){
  const ref=slot.ref,data=String(slot.data||"");
  if(!ref||!data)return false;
  if(runtimeCache.get(ref)===data&&persistedKeys.has(ref))return false;
  if(pendingWrites.has(ref))return pendingWrites.get(ref);
  runtimeCache.set(ref,data);
  const write=(async()=>{
    const db=await openDb();
    const tx=db.transaction(STORE_NAME,"readwrite");
    tx.objectStore(STORE_NAME).put({key:ref,schema:MEDIA_SCHEMA,dataUrl:data,mime:slot.mime||dataUrlMime(data),bytes:dataUrlBytes(data),kind:slot.kind||"image",name:slot.name||"",updatedAt:new Date().toISOString()});
    await txComplete(tx);
    persistedKeys.add(ref);
    return true;
  })().finally(()=>pendingWrites.delete(ref));
  pendingWrites.set(ref,write);
  return write;
}

async function getRecord(ref){
  if(!ref)return null;
  if(runtimeCache.has(ref))return {key:ref,dataUrl:runtimeCache.get(ref)};
  const db=await openDb();
  return new Promise((resolve,reject)=>{
    const tx=db.transaction(STORE_NAME,"readonly");
    const request=tx.objectStore(STORE_NAME).get(ref);
    request.onsuccess=()=>{
      const row=request.result||null;
      if(row?.dataUrl){runtimeCache.set(ref,row.dataUrl);persistedKeys.add(ref);}
      resolve(row);
    };
    request.onerror=()=>reject(request.error||new Error("Stored media could not be read."));
  });
}

export function hydrateVaultMediaFromCache(vault){
  let count=0;
  collectMediaSlots(vault).forEach(slot=>{
    const cached=runtimeCache.get(slot.ref);
    if(cached&&!slot.owner[slot.field]){slot.owner[slot.field]=cached;count++;}
    if(slot.legacyField&&slot.owner[slot.legacyField])delete slot.owner[slot.legacyField];
  });
  return count;
}

export async function hydrateVaultMedia(vault){
  const slots=collectMediaSlots(vault);
  let migrated=0,hydrated=0,missing=0,failed=0;
  const inline=slots.filter(slot=>isDataUrl(slot.data));
  if(inline.length){
    const results=await Promise.allSettled(inline.map(slot=>putRecord(slot)));
    results.forEach((result,index)=>{if(result.status==="fulfilled"){migrated++;inline[index].owner.mediaStorage="indexeddb";}else failed++;});
  }
  const needs=slots.filter(slot=>!slot.owner[slot.field]&&slot.ref);
  const rows=await Promise.allSettled(needs.map(slot=>getRecord(slot.ref)));
  rows.forEach((result,index)=>{
    const slot=needs[index];
    if(result.status==="fulfilled"&&result.value?.dataUrl){slot.owner[slot.field]=result.value.dataUrl;slot.owner.mediaStorage="indexeddb";hydrated++;}
    else if(result.status==="rejected")failed++;
    else {slot.owner.mediaMissing=true;missing++;}
  });
  hydrateVaultMediaFromCache(vault);
  if(vault?.settings){
    const current=vault.settings.mediaStorage||{};
    vault.settings.mediaStorage={...current,version:MEDIA_SCHEMA,backend:"indexeddb",migratedAt:current.migratedAt||(migrated?new Date().toISOString():""),lastCheckedAt:new Date().toISOString()};
  }
  return {migrated,hydrated,missing,failed,total:slots.length};
}

export function stageVaultMedia(vault){
  const slots=collectMediaSlots(vault).filter(slot=>isDataUrl(slot.data));
  slots.forEach(slot=>{runtimeCache.set(slot.ref,String(slot.data));slot.owner.mediaStorage="indexeddb";});
  return Promise.allSettled(slots.map(slot=>putRecord(slot))).then(results=>({total:slots.length,saved:results.filter(x=>x.status==="fulfilled").length,failed:results.filter(x=>x.status==="rejected").length}));
}

function cloneValue(value){
  try{return structuredClone(value);}catch{return JSON.parse(JSON.stringify(value));}
}

export function stripPersistedMediaForStorage(vault,{all=false}={}){
  const copy=cloneValue(vault);
  collectMediaSlots(copy).forEach(slot=>{
    const canStrip=all||persistedKeys.has(slot.ref);
    if(canStrip){delete slot.owner[slot.field];if(slot.legacyField)delete slot.owner[slot.legacyField];slot.owner.mediaStorage="indexeddb";slot.owner.mediaMissing=false;}
  });
  if(copy?.settings){copy.settings.mediaStorage={version:MEDIA_SCHEMA,backend:"indexeddb",...(copy.settings.mediaStorage||{})};}
  return copy;
}

export async function prepareVaultWithMedia(vault){
  const copy=cloneValue(vault);
  const slots=collectMediaSlots(copy);
  await Promise.all(slots.map(async slot=>{
    if(slot.owner[slot.field])return;
    try{const row=await getRecord(slot.ref);if(row?.dataUrl)slot.owner[slot.field]=row.dataUrl;}catch{}
  }));
  return copy;
}

function referencedKeys(vault){return new Set(collectMediaSlots(vault).map(slot=>slot.ref).filter(Boolean));}

export async function pruneOrphanedMedia(vault){
  const keep=referencedKeys(vault),db=await openDb();
  let removed=0,bytes=0;
  const tx=db.transaction(STORE_NAME,"readwrite"),store=tx.objectStore(STORE_NAME);
  await new Promise((resolve,reject)=>{
    const request=store.openCursor();
    request.onsuccess=()=>{
      const cursor=request.result;
      if(!cursor){resolve();return;}
      const row=cursor.value;
      if(!keep.has(row.key)){removed++;bytes+=Number(row.bytes||0);runtimeCache.delete(row.key);persistedKeys.delete(row.key);cursor.delete();}
      cursor.continue();
    };
    request.onerror=()=>reject(request.error||new Error("Stored media could not be cleaned."));
  });
  await txComplete(tx);
  return {removed,bytes};
}

export async function mediaStorageSummary(vault){
  let count=0,bytes=0,photos=0,scanPages=0;
  try{
    const db=await openDb();
    await new Promise((resolve,reject)=>{
      const tx=db.transaction(STORE_NAME,"readonly"),request=tx.objectStore(STORE_NAME).openCursor();
      request.onsuccess=()=>{const cursor=request.result;if(!cursor){resolve();return;}const row=cursor.value||{};count++;bytes+=Number(row.bytes||0);if(row.kind==="scan-page")scanPages++;else photos++;persistedKeys.add(row.key);cursor.continue();};
      request.onerror=()=>reject(request.error||new Error("Stored media could not be measured."));
    });
  }catch{}
  let estimate={usage:0,quota:0};
  try{estimate=await navigator.storage?.estimate?.()||estimate;}catch{}
  let persisted=false;
  try{persisted=!!(await navigator.storage?.persisted?.());}catch{}
  const refs=referencedKeys(vault).size;
  return {count,bytes,photos,scanPages,refs,orphans:Math.max(0,count-refs),usage:Number(estimate.usage||0),quota:Number(estimate.quota||0),persisted,backend:"IndexedDB"};
}

export async function requestPersistentMediaStorage(){
  if(!navigator.storage?.persist)return false;
  try{return !!(await navigator.storage.persist());}catch{return false;}
}

export function mediaPayloadIsPersisted(ref){return persistedKeys.has(ref);}
export async function flushMediaWrites(){await Promise.allSettled([...pendingWrites.values()]);}
