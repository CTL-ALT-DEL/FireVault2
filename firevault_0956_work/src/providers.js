/* FireVault Build 0.79.13 — Building Navigator Foundation */
export const PROVIDER_CONTRACT_VERSION = 3;
export const PROVIDER_MODE = "local";

export const FILE_STORAGE_CATALOG = Object.freeze({
  local:{id:"local",label:"This Device / Downloads",kind:"local",available:true,auth:"none",note:"Files remain in FireVault or are downloaded manually."},
  webdav:{id:"webdav",label:"WebDAV",kind:"remote",available:true,transferReady:false,auth:"session-password",note:"The existing WebDAV connection remains available for vault backup; individual photo/document transfer is prepared for a later connector build."},
  onedrive:{id:"onedrive",label:"Microsoft OneDrive",kind:"remote",available:false,auth:"oauth-pkce",note:"Supports separate Personal and Work connection profiles. Live transfer requires a Microsoft app registration and OAuth PKCE."},
  sharepoint:{id:"sharepoint",label:"SharePoint Library",kind:"remote",available:false,auth:"oauth-pkce",note:"Supports named SharePoint site/library profiles through Microsoft Graph. Live transfer requires app registration and tenant approval."},
  googledrive:{id:"googledrive",label:"Google Drive",kind:"remote",available:false,auth:"oauth",note:"Requires a Google Cloud OAuth client and Drive API access."},
  dropbox:{id:"dropbox",label:"Dropbox",kind:"remote",available:false,auth:"oauth-pkce",note:"Requires a Dropbox app and OAuth PKCE connection."}
});


export const MICROSOFT_STORAGE_ACCOUNTS_KEY = "firevault_microsoft_storage_accounts_v0795";
export const MICROSOFT_APP_REGISTRATION_KEY = "firevault_microsoft_app_registration_v0795";
export const MICROSOFT_STORAGE_TYPES = Object.freeze({
  personal:{id:"personal",label:"Personal OneDrive",provider:"onedrive",authority:"consumers",note:"A personal Microsoft account such as Outlook.com, Hotmail, or Live."},
  work:{id:"work",label:"Work OneDrive",provider:"onedrive",authority:"organizations",note:"A Microsoft 365 work or school account managed by an organization."},
  sharepoint:{id:"sharepoint",label:"SharePoint Library",provider:"sharepoint",authority:"organizations",note:"A named SharePoint site and document library for shared company files."}
});

function connectorDemoMode(){
  try{if(localStorage.getItem("firevault_demo_mode_0738")==="1")return true;}catch{}
  try{return sessionStorage.getItem("firevault_demo_mode_0738")==="1";}catch{return false;}
}
function connectorReadJson(key,fallback){
  try{const raw=localStorage.getItem(key);return raw?JSON.parse(raw):fallback;}catch{return fallback;}
}
function connectorWriteJson(key,value){
  try{localStorage.setItem(key,JSON.stringify(value));return true;}catch{return false;}
}
function connectorId(prefix="ms"){
  try{return `${prefix}-${crypto.randomUUID()}`;}catch{return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2,9)}`;}
}
function normalizeMicrosoftAccount(item,index=0){
  const type=MICROSOFT_STORAGE_TYPES[item?.type]?item.type:"work";
  const typeInfo=MICROSOFT_STORAGE_TYPES[type];
  return {
    id:String(item?.id||connectorId("msacct")),
    label:String(item?.label||typeInfo.label||`Microsoft Account ${index+1}`).trim()||typeInfo.label,
    type,
    provider:typeInfo.provider,
    email:String(item?.email||"").trim(),
    tenantId:String(item?.tenantId||"").trim(),
    siteUrl:String(item?.siteUrl||"").trim(),
    libraryName:String(item?.libraryName||"").trim(),
    enabled:item?.enabled!==false,
    status:"not-connected",
    createdAt:item?.createdAt||new Date().toISOString(),
    modifiedAt:item?.modifiedAt||new Date().toISOString()
  };
}
export function microsoftStorageAccounts(){
  if(connectorDemoMode()) return [];
  const raw=connectorReadJson(MICROSOFT_STORAGE_ACCOUNTS_KEY,[]);
  return (Array.isArray(raw)?raw:[]).map(normalizeMicrosoftAccount);
}
export function saveMicrosoftStorageAccounts(accounts=[]){
  if(connectorDemoMode()) throw new Error("Exit Demo Mode before changing Microsoft storage profiles.");
  const normalized=(Array.isArray(accounts)?accounts:[]).map(normalizeMicrosoftAccount);
  if(!connectorWriteJson(MICROSOFT_STORAGE_ACCOUNTS_KEY,normalized)) throw new Error("Microsoft account profiles could not be saved on this device.");
  return normalized;
}
export function createMicrosoftStorageAccount(type="work"){
  return normalizeMicrosoftAccount({id:connectorId("msacct"),type,label:MICROSOFT_STORAGE_TYPES[type]?.label||"Microsoft Storage",createdAt:new Date().toISOString(),modifiedAt:new Date().toISOString()});
}
export function microsoftStorageAccountById(id){return microsoftStorageAccounts().find(item=>item.id===id)||null;}
export function microsoftAppRegistration(){
  if(connectorDemoMode()) return {clientId:"",authority:"common",tenantId:"",redirectUri:"",configuredAt:""};
  const raw=connectorReadJson(MICROSOFT_APP_REGISTRATION_KEY,{});
  return {
    clientId:String(raw?.clientId||"").trim(),
    authority:["common","organizations","consumers","tenant"].includes(raw?.authority)?raw.authority:"common",
    tenantId:String(raw?.tenantId||"").trim(),
    redirectUri:String(raw?.redirectUri||"").trim(),
    configuredAt:String(raw?.configuredAt||"")
  };
}
export function saveMicrosoftAppRegistration(config={}){
  if(connectorDemoMode()) throw new Error("Exit Demo Mode before changing Microsoft app registration settings.");
  const value={
    clientId:String(config.clientId||"").trim(),
    authority:["common","organizations","consumers","tenant"].includes(config.authority)?config.authority:"common",
    tenantId:String(config.tenantId||"").trim(),
    redirectUri:String(config.redirectUri||"").trim(),
    configuredAt:new Date().toISOString()
  };
  if(!connectorWriteJson(MICROSOFT_APP_REGISTRATION_KEY,value)) throw new Error("Microsoft app registration settings could not be saved on this device.");
  return value;
}
export function microsoftStorageSummary(vault={}){
  const accounts=microsoftStorageAccounts();
  const registration=microsoftAppRegistration();
  const cfg=vault?.settings?.fileStorage||{};
  const summarizeTarget=(kind,target={})=>{
    const connection=microsoftStorageAccountById(target.connectionId);
    return {kind,provider:target.provider||"local",connectionId:target.connectionId||"",connectionLabel:connection?.label||"Not assigned",connectionType:connection?.type||"",profileAvailable:!!connection};
  };
  return {
    connector:"microsoft-graph-oauth-pkce",
    liveTransfer:false,
    appRegistrationConfigured:!!registration.clientId,
    registration:{authority:registration.authority,tenantId:registration.tenantId,redirectUri:registration.redirectUri,clientIdConfigured:!!registration.clientId},
    accounts,
    assignments:{photo:summarizeTarget("photo",cfg.photo),document:summarizeTarget("document",cfg.document)},
    noPersonalFallback:cfg.neverFallbackToPersonal!==false
  };
}
export function microsoftStorageManifest(vault={}){
  const summary=microsoftStorageSummary(vault);
  return {
    format:"firevault-microsoft-storage-manifest",
    generatedAt:new Date().toISOString(),
    contractVersion:PROVIDER_CONTRACT_VERSION,
    connector:summary.connector,
    liveTransfer:false,
    appRegistration:summary.registration,
    profiles:summary.accounts.map(({id,label,type,provider,tenantId,siteUrl,libraryName,enabled,status})=>({id,label,type,provider,tenantId,siteUrl,libraryName,enabled,status})),
    assignments:summary.assignments,
    rules:[
      "Personal OneDrive, Work OneDrive, and SharePoint are separate named connection profiles.",
      "FireVault must never move company files to a personal account as an automatic fallback.",
      "If the selected Microsoft destination is unavailable, the file remains local and queued.",
      "OAuth access and refresh tokens must remain outside the FireVault vault and every backup export.",
      "Live Microsoft Graph transfer remains disabled until an app registration and OAuth PKCE connector are activated."
    ]
  };
}

function storageTargetConfig(vault,kind){
  const cfg=vault?.settings?.fileStorage||{};
  return kind==="photo"?(cfg.photo||{}):(cfg.document||{});
}
export function fileStoragePlanSummary(vault={}){
  const webdavReady=!!(vault?.settings?.webdav?.enabled&&String(vault?.settings?.webdav?.url||"").trim());
  const registration=microsoftAppRegistration();
  const summarize=kind=>{
    const target=storageTargetConfig(vault,kind);
    const provider=FILE_STORAGE_CATALOG[target.provider]||FILE_STORAGE_CATALOG.local;
    const connection=(provider.id==="onedrive"||provider.id==="sharepoint")?microsoftStorageAccountById(target.connectionId):null;
    const ready=provider.id==="local";
    let connectionReady=provider.id==="local"||(provider.id==="webdav"&&webdavReady);
    let status="OAuth connector required";
    let note=provider.note;
    if(provider.id==="local") status="Ready";
    else if(provider.id==="webdav") status=webdavReady?"Backup connection saved • file connector pending":"Needs WebDAV settings";
    else if(provider.id==="onedrive"||provider.id==="sharepoint"){
      connectionReady=!!(connection&&registration.clientId);
      status=!connection?"Choose a Microsoft storage account":!registration.clientId?`${connection.label} • app registration required`:`${connection.label} • sign-in connector pending`;
      note=connection?`${connection.label} is configured as a ${MICROSOFT_STORAGE_TYPES[connection.type]?.label||provider.label} profile. Live upload remains disabled until Microsoft sign-in is activated.`:"Create a Personal, Work, or SharePoint profile under Microsoft Storage Accounts.";
    }
    return {kind,provider:provider.id,label:provider.label,folder:target.folder||`FireVault/${kind==="photo"?"Photos":"Documents"}`,connectionId:target.connectionId||"",connectionLabel:connection?.label||"",connectionType:connection?.type||"",ready,connectionReady,status,note};
  };
  return {photo:summarize("photo"),document:summarize("document"),catalog:FILE_STORAGE_CATALOG,microsoft:microsoftStorageSummary(vault)};
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
    recordFields:["storageTargetId","storageProvider","storageConnectionId","storageFolder","storageStatus","remoteFileId","remoteRevision","remoteUrl"],
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
    microsoftStorage:microsoftStorageManifest(vault),
    integrationRules:[
      "The local vault remains the offline working copy.",
      "Remote providers must enforce workspace and role authorization on the server.",
      "Provider credentials must remain outside FireVault vault exports.",
      "Sync implementations must use record version and change identifiers.",
      "File storage providers must return stable remote identifiers rather than embedding credentials in records."
    ]
  };
}
