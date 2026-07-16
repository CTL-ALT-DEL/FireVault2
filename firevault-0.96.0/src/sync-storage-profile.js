export const SYNC_STORAGE_PROFILE_SCHEMA_VERSION = 1;

export const STORAGE_PROVIDER_TYPES = Object.freeze({
  local:{label:"Local device",description:"On-device vault, IndexedDB media, and manual downloads."},
  webdav:{label:"WebDAV",description:"Remote backup endpoint using user-supplied server credentials."},
  microsoft:{label:"Microsoft cloud",description:"OneDrive and SharePoint profiles prepared for Microsoft Graph."},
  oauth:{label:"OAuth cloud",description:"Provider adapter requiring an external OAuth application."}
});

export const STORAGE_PROVIDERS = Object.freeze([
  Object.freeze({id:"local",name:"This Device",type:"local",status:"active",offline:true,roles:Object.freeze(["vault","media","backup","photo","document"]),credentials:"none",appForgeReady:true}),
  Object.freeze({id:"webdav",name:"WebDAV",type:"webdav",status:"backup-ready",offline:false,roles:Object.freeze(["backup"]),credentials:"session-password",appForgeReady:true}),
  Object.freeze({id:"onedrive",name:"Microsoft OneDrive",type:"microsoft",status:"profile-ready",offline:false,roles:Object.freeze(["photo","document","sync-package"]),credentials:"oauth-pkce",appForgeReady:true}),
  Object.freeze({id:"sharepoint",name:"SharePoint Library",type:"microsoft",status:"profile-ready",offline:false,roles:Object.freeze(["photo","document","sync-package"]),credentials:"oauth-pkce",appForgeReady:true}),
  Object.freeze({id:"googledrive",name:"Google Drive",type:"oauth",status:"planned",offline:false,roles:Object.freeze(["photo","document","backup","sync-package"]),credentials:"oauth",appForgeReady:true}),
  Object.freeze({id:"dropbox",name:"Dropbox",type:"oauth",status:"planned",offline:false,roles:Object.freeze(["photo","document","backup","sync-package"]),credentials:"oauth-pkce",appForgeReady:true})
]);

export const STORAGE_ROLES = Object.freeze({
  vault:{label:"Primary vault",description:"Structured records and settings."},
  media:{label:"Media storage",description:"Photos and scanned-page payloads."},
  backup:{label:"Backup destination",description:"Complete vault and media recovery packages."},
  photo:{label:"Photo destination",description:"Optional account-photo export or upload target."},
  document:{label:"Document destination",description:"Optional manuals, drawings, and report target."},
  "sync-package":{label:"Team package exchange",description:"Manual shared-vault package exchange."}
});

function uniqueStrings(values=[]){return [...new Set((Array.isArray(values)?values:[]).map(value=>String(value||"").trim()).filter(Boolean))];}
export function storageProviderById(id){return STORAGE_PROVIDERS.find(provider=>provider.id===String(id||""))||null;}

export function resolveSyncStorageProfile(appProfile={}){
  const config=appProfile.syncStorage||{};
  const enabledProviderIds=uniqueStrings(config.enabledProviderIds).filter(id=>storageProviderById(id));
  const fallbackProviders=["local"];
  const normalizedProviders=enabledProviderIds.length?enabledProviderIds:fallbackProviders;
  const normalizeRole=(role,fallback=[])=>{
    const selected=uniqueStrings(config.roles?.[role]).filter(id=>normalizedProviders.includes(id)&&storageProviderById(id)?.roles.includes(role));
    return selected.length?selected:fallback.filter(id=>normalizedProviders.includes(id)&&storageProviderById(id)?.roles.includes(role));
  };
  return {
    schemaVersion:SYNC_STORAGE_PROFILE_SCHEMA_VERSION,
    profileId:String(config.profileId||"local-first"),
    enabledProviderIds:normalizedProviders,
    roles:{
      vault:normalizeRole("vault",["local"]),
      media:normalizeRole("media",["local"]),
      backup:normalizeRole("backup",["local"]),
      photo:normalizeRole("photo",["local"]),
      document:normalizeRole("document",["local"]),
      "sync-package":normalizeRole("sync-package",[])
    },
    local:{
      offlineFirst:config.local?.offlineFirst!==false,
      vaultBackend:String(config.local?.vaultBackend||"localStorage"),
      mediaBackend:String(config.local?.mediaBackend||"indexedDB"),
      persistentStorageRecommended:config.local?.persistentStorageRecommended!==false
    },
    backup:{
      manualExport:config.backup?.manualExport!==false,
      automaticSnapshots:config.backup?.automaticSnapshots!==false,
      snapshotLimit:Math.max(1,Math.min(50,Number(config.backup?.snapshotLimit)||12)),
      verifyBeforeRestore:config.backup?.verifyBeforeRestore!==false,
      includeMedia:config.backup?.includeMedia!==false
    },
    collaboration:{
      mode:["disabled","package-exchange","provider-sync"].includes(config.collaboration?.mode)?config.collaboration.mode:"disabled",
      automaticSync:Boolean(config.collaboration?.automaticSync),
      queueOffline:config.collaboration?.queueOffline!==false,
      conflictPolicy:["manual-review","newest-wins","server-wins"].includes(config.collaboration?.conflictPolicy)?config.collaboration.conflictPolicy:"manual-review"
    },
    security:{
      storeCredentialsInVault:Boolean(config.security?.storeCredentialsInVault),
      requireHttps:config.security?.requireHttps!==false,
      preserveLocalCopy:config.security?.preserveLocalCopy!==false,
      preventPersonalFallback:config.security?.preventPersonalFallback!==false
    }
  };
}

export function activeStorageProviders(appProfile={}){
  const profile=resolveSyncStorageProfile(appProfile);
  return profile.enabledProviderIds.map(storageProviderById).filter(Boolean);
}
export function storageProviderEnabled(appProfile,id){return resolveSyncStorageProfile(appProfile).enabledProviderIds.includes(String(id||""));}
export function storageRoleProviders(appProfile,role){
  const profile=resolveSyncStorageProfile(appProfile);
  return (profile.roles?.[role]||[]).map(storageProviderById).filter(Boolean);
}
export function syncStorageSettingsTabEnabled(appProfile={},tab=""){
  const profile=resolveSyncStorageProfile(appProfile);
  const providers=new Set(profile.enabledProviderIds);
  if(tab==="microsoftStorage")return providers.has("onedrive")||providers.has("sharepoint");
  if(tab==="webdav")return providers.has("webdav");
  if(tab==="sync")return profile.collaboration.mode!=="disabled";
  if(tab==="cloudFiles")return profile.roles.photo.length>0||profile.roles.document.length>0;
  if(tab==="backup")return profile.backup.manualExport||profile.backup.automaticSnapshots||profile.roles.backup.length>0;
  return true;
}
export function syncStorageSummary(appProfile={}){
  const profile=resolveSyncStorageProfile(appProfile);
  const providers=activeStorageProviders(appProfile);
  return {
    profileId:profile.profileId,
    providers:providers.length,
    offlineProviders:providers.filter(provider=>provider.offline).length,
    remoteProviders:providers.filter(provider=>!provider.offline).length,
    backupDestinations:profile.roles.backup.length,
    collaborationMode:profile.collaboration.mode,
    automaticSync:profile.collaboration.automaticSync,
    offlineFirst:profile.local.offlineFirst
  };
}
export function syncStorageProfileExport(appProfile={}){
  return JSON.parse(JSON.stringify({
    version:SYNC_STORAGE_PROFILE_SCHEMA_VERSION,
    providerTypes:STORAGE_PROVIDER_TYPES,
    providers:STORAGE_PROVIDERS,
    roles:STORAGE_ROLES,
    activeProfile:resolveSyncStorageProfile(appProfile)
  }));
}
