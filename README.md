# FireVault
## Build 0.97.0 — AppForge Product Blueprint

Build 0.97.0 turns FireVault’s reusable architecture into one validated, portable product definition while preserving the complete fire-alarm technician app.

### Integrated

- Added `src/app-forge-blueprint.js` with a nine-check configuration validator.
- Added `core.appForgeBlueprint` to Module Registry version 6.
- Advanced the App Profile to schema version 9 and explicitly enabled blueprint integration.
- Combined the App Profile, Module Registry, UI bindings, Record Schema, Workflow Schema, Theme Profile, Content Pack Registry, and Sync & Storage Profile into one downloadable blueprint.
- Added AppForge readiness, reusable/vertical module counts, and individual validation results under Settings → About FireVault → Architecture & Modules.
- Added a one-tap **Download AppForge Blueprint** action.
- Added the canonical blueprint contract and documentation under `architecture/`.

### FireVault readiness

The active FireVault profile passes all nine blueprint checks:

- Product identity
- Module selection
- Module dependencies
- UI bindings
- Record schema
- Workflow schema
- Content packs
- Sync and storage
- Theme assets

### Safety

The blueprint exports configuration only. It contains no customer accounts, notes, photos, documents, credentials, backups, or device identity.

### Compatibility

The storage key remains `firevault_vault_build_030`. Existing accounts, notes, photos, documents, overlays, IndexedDB media, backups, WebDAV settings, Microsoft profiles, Demo Mode, and every current technician workflow remain compatible.
