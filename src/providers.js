/* FireVault Build 0.79.4 — Backend Adapter & Cloud File Storage Foundation */
export const PROVIDER_CONTRACT_VERSION = 2;
export const PROVIDER_MODE = "local";

export const FILE_STORAGE_CATALOG = Object.freeze({
  local:{id:"local",label:"This Device / Downloads",kind:"local",available:true,auth:"none",note:"Files remain in FireVault or are downloaded manually."},
  webdav:{id:"webdav",label:"WebDAV",kind:"remote",available:true,transferReady:false,auth:"session-password",note:"The existing WebDAV connection remains available for vault backup; individual photo/document transfer is prepared for a later connector build."},
  onedrive:{id:"onedrive",label:"Microsoft OneDrive",kind:"remote",available:false,auth:"oauth",note:"Requires a Microsoft app registration and OAuth connection."},
  sharepoint:{id:"sharepoint",label:"SharePoint Library",kind:"remote",available:false,auth:"oauth",note:"Designed for company document libraries through Microsoft Graph."},
  googledrive:{id:"googledrive",label:"Google Drive",kind:"remote",available:false,auth:"oauth",note:"Requires a Google Cloud OAuth client and Drive API access."},
  dropbox:{id:"dropbox",label:"Dropbox",kind:"remote",available:false,auth:"oauth-pkce",note:"Requires a Dropbox app and OAuth PKCE connection."}
});

function storageTargetConfig(vault,kind){
  const cfg=vault?.settings?.fileStorage||{};
  return kind==="photo"?(cfg.photo||{}):(cfg.document||{});
}
export function fileStoragePlanSummary(vault={}){
  const webdavReady=!!(vault?.settings?.webdav?.enabled&&String(vault?.settings?.webdav?.url||"").trim());
  const summarize=kind=>{
    const target=storageTargetConfig(vault,kind);
    const provider=FILE_STORAGE_CATALOG[target.provider]||FILE_STORAGE_CATALOG.local;
    const ready=provider.id==="local";
    const connectionReady=provider.id==="local"||(provider.id==="webdav"&&webdavReady);
    const status=provider.id==="local"?"Ready":provider.id==="webdav"?(webdavReady?"Backup connection saved • file connector pending":"Needs WebDAV settings"):"OAuth connector required";
    return {kind,provider:provider.id,label:provider.label,folder:target.folder||`FireVault/${kind==="photo"?"Photos":"Documents"}`,ready,connectionReady,status,note:provider.note};
  };
  return {photo:summarize("photo"),document:summarize("document"),catalog:FILE_STORAGE_CATALOG};
}

export function cloudFileStorageManifest(vault={}){
  const plan=fileStoragePlanSummary(vault);
  return {
    format:"firevault-cloud-file-storage-manifest",
    generatedAt:new Date().toISOString(),
    contractVersion:PROVIDER_CONTRACT_VERSION,
    localFirst:true,
    destinations:{photo:plan.photo,document:plan.document},
    providers:Object.values(FILE_STORAGE_CATALOG),
    recordFields:["storageTargetId","storageProvider","storageFolder","storageStatus","remoteFileId","remoteRevision","remoteUrl"],
    integrationRules:[
      "Photo and document destinations are configured independently.",
      "The local FireVault record remains authoritative until a remote upload is confirmed.",
      "OAuth access and refresh tokens must never be stored inside the FireVault vault or backup exports.",
      "Remote providers must return stable file identifiers and revision metadata.",
      "Failed uploads remain queued without deleting the local file copy."
    ]
  };
}

const CONTRACTS = Object.freeze({
  authentication:["initialize","getCurrentUser","signIn","signOut","getSession","onSessionChanged"],
  database:["initialize","loadVault","saveVault","listChanges","applyRemoteChanges","healthCheck"],
  fileStorage:["initialize","putFile","getFile","deleteFile","listFiles","healthCheck"],
  sync:["initialize","push","pull","resolveConflict","getStatus","healthCheck"],
  audit:["initialize","record","query","export","healthCheck"]
});

function localValue(key,fallback=null){
  try{const raw=localStorage.getItem(key);return raw===null?fallback:raw;}catch{return fallback;}
}
function jsonValue(key,fallback=null){
  try{const raw=localValue(key,null);return raw?JSON.parse(raw):fallback;}catch{return fallback;}
}
function idFromVault(vault,path,fallback="Not assigned"){
  let value=vault;for(const key of path)value=value?.[key];return value||fallback;
}

class LocalAuthenticationProvider{
  constructor(){this.id="local-auth";this.label="Local Device Identity";}
  async initialize(){return {ready:true};}
  async getCurrentUser(vault){return {id:idFromVault(vault,["securityFoundation","user","id"]),name:idFromVault(vault,["settings","technician","name"],"Local Technician"),authenticated:false,mode:"local"};}
  async signIn(){throw new Error("A remote authentication provider has not been configured.");}
  async signOut(){return {ok:true};}
  async getSession(){return {mode:"local",authenticated:false};}
  onSessionChanged(){return ()=>{};}
}
class LocalDatabaseProvider{
  constructor(){this.id="local-vault";this.label="Local FireVault Database";}
  async initialize(){return {ready:true};}
  async loadVault(){return jsonValue("firevault_vault_build_030",null);}
  async saveVault(vault){localStorage.setItem("firevault_vault_build_030",JSON.stringify(vault));return {ok:true};}
  async listChanges(vault){return vault?.securityFoundation?.pendingChanges||vault?.syncState?.pendingChanges||[];}
  async applyRemoteChanges(){throw new Error("Remote synchronization is not configured.");}
  async healthCheck(){const vault=await this.loadVault();return {ok:!!vault,detail:vault?`${vault.sites?.length||0} accounts available locally`:"No local vault found"};}
}
class LocalFileStorageProvider{
  constructor(){this.id="local-files";this.label="Browser / Download Storage";}
  async initialize(){return {ready:true};}
  async putFile(){throw new Error("Direct persistent file storage requires a configured backend or native container.");}
  async getFile(){throw new Error("Direct persistent file storage requires a configured backend or native container.");}
  async deleteFile(){throw new Error("Direct persistent file storage requires a configured backend or native container.");}
  async listFiles(){return [];}
  async healthCheck(){return {ok:true,detail:"Manual downloads and WebDAV remain available"};}
}
class LocalSyncProvider{
  constructor(){this.id="local-queue";this.label="Local Pending-Change Queue";}
  async initialize(){return {ready:true};}
  async push(){return {ok:false,pending:true,reason:"No remote sync provider configured"};}
  async pull(){return {ok:false,pending:true,reason:"No remote sync provider configured"};}
  async resolveConflict(){throw new Error("Remote synchronization is not configured.");}
  async getStatus(vault){const queue=vault?.securityFoundation?.pendingChanges||vault?.syncState?.pendingChanges||[];return {mode:"local",pending:queue.length,connected:false};}
  async healthCheck(){return {ok:true,detail:"Changes remain queued locally until a backend is connected"};}
}
class LocalAuditProvider{
  constructor(){this.id="local-audit";this.label="Local Audit History";}
  async initialize(){return {ready:true};}
  async record(){return {ok:true};}
  async query(vault){return vault?.securityFoundation?.audit||vault?.securityAudit||[];}
  async export(vault){return this.query(vault);}
  async healthCheck(){return {ok:true,detail:"Audit events are stored in the local vault"};}
}

export const backendProviders = Object.freeze({
  authentication:new LocalAuthenticationProvider(),
  database:new LocalDatabaseProvider(),
  fileStorage:new LocalFileStorageProvider(),
  sync:new LocalSyncProvider(),
  audit:new LocalAuditProvider()
});

export function backendAdapterSummary(vault={}){
  const pending=(vault?.securityFoundation?.pendingChanges||vault?.syncState?.pendingChanges||[]).length;
  return {
    contractVersion:PROVIDER_CONTRACT_VERSION,
    mode:PROVIDER_MODE,
    backendConfigured:false,
    workspaceId:idFromVault(vault,["securityFoundation","workspace","id"]),
    userId:idFromVault(vault,["securityFoundation","user","id"]),
    deviceId:idFromVault(vault,["securityFoundation","device","id"]),
    pendingChanges:pending,
    providers:Object.fromEntries(Object.entries(backendProviders).map(([key,value])=>[key,{id:value.id,label:value.label,status:"Local"}])),
    candidateBackends:["Supabase","Firebase","Custom API","Microsoft / Azure"],
    fileStoragePlan:fileStoragePlanSummary(vault)
  };
}

export async function runBackendAdapterDiagnostics(vault={}){
  const checks=[];
  for(const [kind,provider] of Object.entries(backendProviders)){
    try{const result=await provider.healthCheck(vault);checks.push({kind,provider:provider.label,ok:result?.ok!==false,detail:result?.detail||"Ready"});}
    catch(error){checks.push({kind,provider:provider.label,ok:false,detail:error?.message||"Check failed"});}
  }
  return {at:new Date().toISOString(),contractVersion:PROVIDER_CONTRACT_VERSION,mode:PROVIDER_MODE,checks,ok:checks.every(x=>x.ok)};
}

export function backendAdapterManifest(vault={}){
  return {
    format:"firevault-backend-adapter-manifest",
    generatedAt:new Date().toISOString(),
    contractVersion:PROVIDER_CONTRACT_VERSION,
    mode:PROVIDER_MODE,
    summary:backendAdapterSummary(vault),
    contracts:CONTRACTS,
    cloudFileStorage:cloudFileStorageManifest(vault),
    integrationRules:[
      "The local vault remains the offline working copy.",
      "Remote providers must enforce workspace and role authorization on the server.",
      "Provider credentials must remain outside FireVault vault exports.",
      "Sync implementations must use record version and change identifiers.",
      "File storage providers must return stable remote identifiers rather than embedding credentials in records."
    ]
  };
}
