/* FireVault Build 0.79.3 — Backend Adapter Foundation */
export const PROVIDER_CONTRACT_VERSION = 1;
export const PROVIDER_MODE = "local";

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
    candidateBackends:["Supabase","Firebase","Custom API","Microsoft / Azure"]
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
    integrationRules:[
      "The local vault remains the offline working copy.",
      "Remote providers must enforce workspace and role authorization on the server.",
      "Provider credentials must remain outside FireVault vault exports.",
      "Sync implementations must use record version and change identifiers.",
      "File storage providers must return stable remote identifiers rather than embedding credentials in records."
    ]
  };
}
