# FireVault Build 0.95.3 Validation

## Architecture foundation

- App Profile module loads as an ES module.
- Module Registry contains unique module IDs and valid classifications.
- Every FireVault enabled module resolves to a registry entry.
- Feature matrix exports valid CSV rows for each registered module.
- Architecture & Modules is reachable from Settings → About FireVault.
- App Profile and Module Registry JSON downloads are wired.

## Compatibility

- Storage key remains `firevault_vault_build_030`.
- Existing settings receive only `profileId: firevault` and `architectureVersion: 1` defaults.
- Existing accounts, notes, visits, photos, documents, overlays, and IndexedDB media are not renamed or migrated.
- Search, Nearby, Quick Photo, Account Detail, Settings, backup, WebDAV, Demo Mode, and privacy/security routes remain present.

## Release checks

- JavaScript syntax checks pass.
- JSON files parse successfully.
- Service-worker shell contains both new architecture modules.
- All cache-busting references use Build 0.95.3.
- CSS braces are balanced.
- ZIP integrity check passes.

Physical iPhone and iPad confirmation is still recommended after deployment.
