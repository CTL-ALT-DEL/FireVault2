export const CONTENT_PACK_SCHEMA_VERSION = 1;

export const CONTENT_SOURCE_TYPES = Object.freeze({
  local:{label:"Local vault",description:"User-created and imported content stored on the device."},
  bundled:{label:"Bundled reference",description:"Read-only content packaged with the app release."},
  import:{label:"Import source",description:"CSV or JSON content brought into the app by the user."},
  remote:{label:"Remote catalog",description:"Versioned catalog metadata prepared for future signed downloads."}
});

export const CONTENT_SOURCES = Object.freeze([
  Object.freeze({id:"local.user-vault",name:"User Library",type:"local",status:"active",offline:true,readOnly:false,description:"Manuals, forms, links, notes, and reference items created or saved by the user."}),
  Object.freeze({id:"bundled.app-reference",name:"Bundled App Reference",type:"bundled",status:"active",offline:true,readOnly:true,description:"Small reference sets shipped inside the application package."}),
  Object.freeze({id:"import.csv-json",name:"CSV / JSON Import",type:"import",status:"active",offline:true,readOnly:false,description:"Structured records and reference metadata imported through reusable onboarding tools."}),
  Object.freeze({id:"remote.versioned-catalog",name:"Versioned Content Catalog",type:"remote",status:"foundation",offline:false,readOnly:true,description:"Future provider-neutral manifest for downloadable state, trade, manufacturer, or themed packs."})
]);

export const CONTENT_PACKS = Object.freeze([
  Object.freeze({
    id:"core.user-library",name:"User Reference Library",classification:"core",sourceId:"local.user-vault",status:"active",appForgeReady:true,
    description:"Reusable user-managed folders and reference items available to every field-vault app.",
    folderNames:Object.freeze(["Manuals","Forms","Links","Codes"]),
    contentTypes:Object.freeze(["document","link","note","image"]),
    apps:Object.freeze({fireVault:true,travelGuide:true,fishing:true,ghostTowns:true,gardening:true,inspection:true})
  }),
  Object.freeze({
    id:"core.account-content",name:"Record-Linked Content",classification:"core",sourceId:"local.user-vault",status:"active",appForgeReady:true,
    description:"Photos, documents, links, and reference items connected to a specific account or location.",
    folderNames:Object.freeze([]),contentTypes:Object.freeze(["document","photo","link"]),
    apps:Object.freeze({fireVault:true,travelGuide:true,fishing:true,ghostTowns:true,gardening:true,inspection:true})
  }),
  Object.freeze({
    id:"firevault.field-reference",name:"Fire Alarm Field Reference",classification:"firevault",sourceId:"bundled.app-reference",status:"active",appForgeReady:false,
    description:"Fire-alarm-oriented library organization for field manuals, forms, codes, and quick references.",
    folderNames:Object.freeze(["Panel Manuals","Communicators","Inspection Forms","Fire Codes"]),
    contentTypes:Object.freeze(["document","link","note"]),
    apps:Object.freeze({fireVault:true,travelGuide:false,fishing:false,ghostTowns:false,gardening:false,inspection:false})
  }),
  Object.freeze({
    id:"firevault.panel-documents",name:"Panel Document Matching",classification:"firevault",sourceId:"local.user-vault",status:"active",appForgeReady:false,
    description:"Manufacturer and model-linked documents that can be assigned to fire-alarm accounts.",
    folderNames:Object.freeze(["Panel Manuals"]),contentTypes:Object.freeze(["document","link"]),
    apps:Object.freeze({fireVault:true,travelGuide:false,fishing:false,ghostTowns:false,gardening:false,inspection:false})
  }),
  Object.freeze({
    id:"travel.wyoming-points",name:"Wyoming Points of Interest",classification:"optional",sourceId:"remote.versioned-catalog",status:"planned",appForgeReady:true,
    description:"Example downloadable location pack for attractions, unusual sites, services, and travel notes.",
    folderNames:Object.freeze(["Attractions","Scenic Stops","Historic Sites","Services"]),contentTypes:Object.freeze(["record","photo","reference"]),
    apps:Object.freeze({fireVault:false,travelGuide:true,fishing:false,ghostTowns:true,gardening:false,inspection:false})
  }),
  Object.freeze({
    id:"outdoors.fishing-spots",name:"Fishing Locations",classification:"optional",sourceId:"remote.versioned-catalog",status:"planned",appForgeReady:true,
    description:"Example location pack for access points, water details, species, regulations, and live-condition readiness.",
    folderNames:Object.freeze(["Access","Regulations","Species","Conditions"]),contentTypes:Object.freeze(["record","photo","reference"]),
    apps:Object.freeze({fireVault:false,travelGuide:true,fishing:true,ghostTowns:false,gardening:false,inspection:false})
  }),
  Object.freeze({
    id:"history.ghost-towns",name:"Ghost Towns and Historic Sites",classification:"optional",sourceId:"remote.versioned-catalog",status:"planned",appForgeReady:true,
    description:"Example themed location pack with history, access, safety, photos, and route information.",
    folderNames:Object.freeze(["History","Access","Safety","Nearby Sites"]),contentTypes:Object.freeze(["record","photo","reference"]),
    apps:Object.freeze({fireVault:false,travelGuide:true,fishing:false,ghostTowns:true,gardening:false,inspection:false})
  })
]);

function uniqueStrings(values=[]){return [...new Set((Array.isArray(values)?values:[]).map(value=>String(value||"").trim()).filter(Boolean))];}

export function contentSourceById(id){return CONTENT_SOURCES.find(source=>source.id===String(id||""))||null;}
export function contentPackById(id){return CONTENT_PACKS.find(pack=>pack.id===String(id||""))||null;}

export function resolveContentPackProfile(appProfile={}){
  const config=appProfile.content||{};
  const sourceIds=uniqueStrings(config.enabledSourceIds).filter(id=>contentSourceById(id));
  const packIds=uniqueStrings(config.enabledPackIds).filter(id=>contentPackById(id));
  return {
    schemaVersion:CONTENT_PACK_SCHEMA_VERSION,
    registryId:String(config.registryId||"field-vault-content-v1"),
    enabledSourceIds:sourceIds.length?sourceIds:["local.user-vault","bundled.app-reference"],
    enabledPackIds:packIds.length?packIds:["core.user-library","core.account-content"],
    updatePolicy:{
      mode:["manual","startup-check","scheduled"].includes(config.updatePolicy?.mode)?config.updatePolicy.mode:"manual",
      allowMetered:Boolean(config.updatePolicy?.allowMetered),
      verifyManifests:config.updatePolicy?.verifyManifests!==false,
      keepPreviousVersion:config.updatePolicy?.keepPreviousVersion!==false
    }
  };
}

export function activeContentSources(appProfile={}){
  const profile=resolveContentPackProfile(appProfile);
  return profile.enabledSourceIds.map(contentSourceById).filter(Boolean);
}

export function activeContentPacks(appProfile={}){
  const profile=resolveContentPackProfile(appProfile);
  return profile.enabledPackIds.map(contentPackById).filter(Boolean);
}

export function contentPackLibraryFolders(appProfile={}){
  return uniqueStrings(activeContentPacks(appProfile).flatMap(pack=>pack.folderNames||[]));
}

export function contentPackSummary(appProfile={}){
  const profile=resolveContentPackProfile(appProfile);
  const packs=activeContentPacks(appProfile);
  const sources=activeContentSources(appProfile);
  return {
    registryId:profile.registryId,
    sources:sources.length,
    packs:packs.length,
    libraryFolders:contentPackLibraryFolders(appProfile).length,
    offlineSources:sources.filter(source=>source.offline).length,
    appForgeReady:packs.filter(pack=>pack.appForgeReady).length,
    updateMode:profile.updatePolicy.mode
  };
}

export function contentPackRegistryExport(appProfile={}){
  return JSON.parse(JSON.stringify({
    version:CONTENT_PACK_SCHEMA_VERSION,
    sourceTypes:CONTENT_SOURCE_TYPES,
    sources:CONTENT_SOURCES,
    packs:CONTENT_PACKS,
    activeProfile:resolveContentPackProfile(appProfile)
  }));
}
