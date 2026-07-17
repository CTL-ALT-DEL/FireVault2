import assert from "node:assert/strict";

class StorageMock {
  #values=new Map();
  get length(){return this.#values.size;}
  key(index){return [...this.#values.keys()][index]??null;}
  getItem(key){return this.#values.has(String(key))?this.#values.get(String(key)):null;}
  setItem(key,value){this.#values.set(String(key),String(value));}
  removeItem(key){this.#values.delete(String(key));}
  clear(){this.#values.clear();}
}

globalThis.localStorage=new StorageMock();
globalThis.sessionStorage=new StorageMock();

const {BUILD,KEY,isDemoMode,setDemoMode,loadData,saveData,ensureSite}=await import("../src/storage.js");

assert.equal(BUILD,"1.03.20");
assert.equal(isDemoMode(),false);

const defaultData=loadData();
assert.equal(isDemoMode(),true,"A fresh install should default to Demo Mode.");
assert.equal(defaultData.sites.length,20,"The protected demo workspace should contain 20 fictional sites.");
assert.equal(localStorage.getItem(KEY),null,"Demo startup must not create a real vault.");

setDemoMode(false);
const realImportBase=loadData({allowEmptyReal:true});
assert.equal(isDemoMode(),false,"The CSV transition should leave Demo Mode before import analysis.");
assert.equal(realImportBase.sites.length,0,"A fresh real vault should begin empty instead of reopening demo data.");

const imported=ensureSite({id:"csv-test-site",externalAccountId:"TEST-CSV-1031",name:"CSV Persistence Test",street:"100 Main St",city:"Cheyenne",state:"WY",zip:"82001"});
realImportBase.sites.push(imported);
saveData(realImportBase);

const stored=JSON.parse(localStorage.getItem(KEY)||"null");
assert.equal(stored?.sites?.length,1,"The real vault should be written to persistent storage.");
assert.equal(stored.sites[0].externalAccountId,"TEST-CSV-1031");

const afterReload=loadData();
assert.equal(isDemoMode(),false,"A populated real vault must prevent Demo Mode from returning after reload.");
assert.equal(afterReload.sites.length,1);
assert.equal(afterReload.sites[0].externalAccountId,"TEST-CSV-1031");

console.log(JSON.stringify({status:"passed",build:BUILD,demoSites:defaultData.sites.length,persistedSites:afterReload.sites.length}));
