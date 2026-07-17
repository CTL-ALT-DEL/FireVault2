import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";

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

const worker=await readFile(new URL("../sw.js",import.meta.url),"utf8");
const {
  BUILD,KEY,DEVICE_KEY,autoBackupInfo,deviceIdentity,ensureSite,
  isDemoMode,latestAutoBackup,loadData,saveData,setDemoMode
}=await import("../src/storage.js");

assert.equal(BUILD,"1.03.19");
assert.equal(KEY,"firevault_vault_build_030","Build updates must never rename the customer vault.");
assert.equal(DEVICE_KEY,"firevault_device_identity_062","Build updates must preserve the device identity key.");
assert.doesNotMatch(worker,/localStorage|sessionStorage|indexedDB/i,"The app-file cache must not read or write customer storage.");
assert.doesNotMatch(worker,/firevault_vault_build_030/,"The service worker must remain unaware of the customer vault key.");

setDemoMode(false);
const vault=loadData({allowEmptyReal:true});
const originalDevice=deviceIdentity();
assert.equal(isDemoMode(),false);
assert.equal(vault.sites.length,0);

vault.settings.technician={
  name:"Jordan Field",company:"Mountain Fire Systems",phone:"307-555-0147",
  email:"jordan@example.com",license:"WY-FA-2048",defaultRole:"Fire Alarm Technician",
  photoData:"",photoUpdatedAt:""
};
vault.settings.overlay={
  fields:["site","account","date","time","gps"],alignment:"bottom",fontSize:"large",
  textColor:"#f8fafc",accentColor:"#22c55e",backgroundStyle:"gradient",opacity:"78",
  template:"{site_name} | {account_id}\n{date} {time} | {gps}",showLogo:true,showTagline:true,
  logoMode:"firevault",customLogoData:"",
  fieldLayout:[
    {tag:"{site_name}",breakBefore:false,align:"left"},
    {tag:"{account_id}",breakBefore:false,align:"right"},
    {tag:"{date}",breakBefore:true,align:"left"},
    {tag:"{time}",breakBefore:false,align:"left"}
  ]
};
vault.settings.technicianOverlay={
  alignment:"right",
  fields:[
    {tag:"{technician}",breakBefore:false},
    {tag:"{company}",breakBefore:true},
    {tag:"{phone}",breakBefore:true}
  ]
};
vault.settings.plusCodes={
  enabled:true,autoGenerate:true,accountLength:10,locationLength:11,
  includeInReports:true,searchable:true,verifyAfterDays:365
};

const site=ensureSite({
  id:"upgrade-site-1039",externalAccountId:"FV-1039-001",accountId:"FV-1039-001",
  name:"Vault Preservation Test",street:"100 W 17th St",city:"Cheyenne",state:"WY",zip:"82001",
  sitePhone:"307-555-0100",panelManufacturer:"Notifier",panelModel:"NFS2-3030",
  panelLocation:"Main electrical room",notes:"Gate code is in the protected account notes.",
  accessNotes:"Park east of the fire lane and check in at reception.",
  gps:{lat:41.13331,lng:-104.82021,accuracy:7,capturedAt:"2026-07-16T18:00:00.000Z",source:"Field GPS"},
  plusCode:"85HQ45MH+8W",preferredLocationPointId:"entrance-1039",
  contacts:[{
    id:"contact-1039",name:"Alex Morgan",role:"Facility Manager",phone:"307-555-0111",
    email:"alex@example.com",primary:true,accessNotes:"Call 15 minutes before arrival."
  }],
  tasks:[{
    id:"task-1039",title:"Confirm monitoring signals",status:"Open",priority:"High",
    due:"2026-07-20",notes:"Verify alarm, supervisory, and trouble signals."
  }],
  deficiencies:[{
    id:"deficiency-1039",title:"Missing circuit label",status:"Open",priority:"Normal",
    device:"NAC 2",location:"Main panel",notes:"Add a permanent typed label."
  }],
  noteEntries:[{
    id:"note-1039",type:"Site Note",text:"Customer approved the east service entrance.",
    note:"Customer approved the east service entrance.",technician:"Jordan Field",
    createdAt:"2026-07-16T18:05:00.000Z"
  }],
  docs:[{
    id:"photo-1039",title:"NAC 2 label",type:"Photo",mime:"image/jpeg",
    imageName:"nac-2-label.jpg",mediaRef:"fvmedia:site:upgrade-site-1039:photo-1039:image",
    mediaStorage:"indexeddb",photoCategory:"Deficiency",customerCaption:"NAC 2 requires a permanent circuit label.",
    linkedDeficiencyId:"deficiency-1039",useOverlayOnSave:true,useTechnicianOverlayOnSave:true,
    storageProvider:"local",storageFolder:"FireVault/Photos",createdAt:"2026-07-16T18:10:00.000Z"
  }],
  locationPoints:[{
    id:"entrance-1039",type:"Main Entrance",label:"East Service Entrance",floor:"1",placement:"Outdoor",
    description:"Technician entrance",notes:"Use the call box after 7:00 AM.",lat:41.13337,lng:-104.82008,
    accuracy:6,plusCode:"85HQ45MH+8XQ",verification:"verified",lastVerifiedAt:"2026-07-16T18:15:00.000Z",
    photoDocId:"photo-1039",createdAt:"2026-07-16T18:15:00.000Z",updatedAt:"2026-07-16T18:15:00.000Z"
  }]
});
vault.sites.push(site);
saveData(vault);

const persisted=JSON.parse(localStorage.getItem(KEY)||"null");
assert.equal(persisted?.sites?.length,1);
assert.equal(persisted.sites[0].externalAccountId,"FV-1039-001");
assert.equal(persisted.sites[0].notes,"Gate code is in the protected account notes.");
assert.equal(persisted.sites[0].contacts[0].accessNotes,"Call 15 minutes before arrival.");
assert.equal(persisted.sites[0].locationPoints[0].plusCode,"85HQ45MH+8XQ");
assert.equal(persisted.sites[0].docs[0].mediaRef,"fvmedia:site:upgrade-site-1039:photo-1039:image");
assert.equal(persisted.sites[0].docs[0].useOverlayOnSave,true);
assert.equal(persisted.sites[0].docs[0].useTechnicianOverlayOnSave,true);

const backup=latestAutoBackup();
assert.equal(autoBackupInfo().count,1,"The first real save should create a rolling safety snapshot.");
assert.equal(backup?.format,"firevault-auto-backup");
assert.equal(backup?.data?.sites?.[0]?.externalAccountId,"FV-1039-001");

const reloaded=loadData();
const restored=reloaded.sites[0];
assert.equal(isDemoMode(),false,"A real vault must not reopen Demo Mode after an app update.");
assert.equal(deviceIdentity(),originalDevice,"The device identity must remain stable across reloads.");
assert.equal(restored.id,"upgrade-site-1039");
assert.deepEqual(restored.gps,{lat:41.13331,lng:-104.82021,accuracy:7,capturedAt:"2026-07-16T18:00:00.000Z",source:"Field GPS"});
assert.equal(restored.plusCode,"85HQ45MH+8W");
assert.equal(restored.preferredLocationPointId,"entrance-1039");
assert.equal(restored.noteEntries[0].text,"Customer approved the east service entrance.");
assert.equal(restored.tasks[0].notes,"Verify alarm, supervisory, and trouble signals.");
assert.equal(restored.deficiencies[0].linkedDeficiencyId,undefined);
assert.equal(restored.docs[0].photoCategory,"Deficiency");
assert.equal(restored.docs[0].customerCaption,"NAC 2 requires a permanent circuit label.");
assert.equal(restored.docs[0].linkedDeficiencyId,"deficiency-1039");
assert.equal(restored.locationPoints[0].photoDocId,"photo-1039");
assert.equal(reloaded.settings.overlay.template,"{site_name} | {account_id}\n{date} {time} | {gps}");
assert.deepEqual(reloaded.settings.overlay.fieldLayout,vault.settings.overlay.fieldLayout);
assert.equal(reloaded.settings.technicianOverlay.alignment,"right");
assert.deepEqual(reloaded.settings.technicianOverlay.fields,[
  {tag:"{technician}",breakBefore:false},
  {tag:"{company}",breakBefore:true},
  {tag:"{phone}",breakBefore:true}
]);
assert.equal(reloaded.settings.technician.name,"Jordan Field");
assert.equal(reloaded.settings.plusCodes.locationLength,11);
assert.equal(reloaded.settings.plusCodes.verifyAfterDays,365);

restored.noteEntries.unshift({
  id:"note-after-reload-1039",type:"Site Note",text:"Second save completed after reload.",
  note:"Second save completed after reload.",createdAt:"2026-07-16T19:00:00.000Z",technician:"Jordan Field"
});
saveData(reloaded);
const secondReload=loadData();
assert.equal(secondReload.sites[0].noteEntries[0].text,"Second save completed after reload.");
assert.equal(secondReload.sites[0].docs[0].useTechnicianOverlayOnSave,true);
assert.equal(JSON.parse(localStorage.getItem(`${KEY}_recovery`)).sites[0].noteEntries.length,1,"The recovery copy should retain the prior saved revision.");

console.log(JSON.stringify({
  status:"passed",build:BUILD,checks:41,sites:secondReload.sites.length,
  backups:autoBackupInfo().count,storageKey:KEY
}));
