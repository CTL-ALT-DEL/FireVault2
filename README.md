# FireVault
## Build 0.95.9 — Configurable Data Sources and Content Packs

Build 0.95.9 adds a reusable content-delivery layer while preserving FireVault’s current accounts, manuals, photos, documents, and local-first behavior.

### Integrated

- Added `src/content-pack-registry.js` as the canonical registry for approved data sources and content packs.
- App Profile schema version 7 now selects enabled sources, active packs, and update policy.
- Registered `core.contentPacks` in the shared Module Registry.
- Library routes now require both Files and Content Packs modules.
- The Library derives its default folders from the active content packs instead of a FireVault-only hard-coded list.
- Architecture & Modules displays active sources, packs, generated folders, and update safeguards.
- Added downloadable Content Pack Registry JSON.

### FireVault active content

FireVault keeps these active packs:

- User Reference Library
- Record-Linked Content
- Fire Alarm Field Reference
- Panel Document Matching

The resulting Library folders include the existing general folders plus fire-alarm-oriented folders such as Panel Manuals, Communicators, Inspection Forms, and Fire Codes.

### AppForge direction

A future app profile can select different packs without branching Search, Nearby, Library, Files, offline storage, or import code. Planned registry examples include Wyoming Points of Interest, Fishing Locations, and Ghost Towns. They are planning definitions only and are not installed into FireVault.

### Update safety

The current FireVault policy is manual. Remote catalogs are only a foundation in this build; FireVault does not silently download data. The profile requires manifest verification and keeps the prior pack version for rollback readiness.

### Compatibility

The storage key remains `firevault_vault_build_030`. Existing accounts, notes, photos, documents, overlays, IndexedDB media, backups, WebDAV settings, Demo Mode, record schema, workflow schema, and Theme Profile remain compatible.
