# FireVault Build 0.95.9 Validation

## Static checks

- JavaScript syntax passed for all source modules and the service worker.
- JSON parsing passed for manifest, version, App Profile, Module Registry, module bindings, Record Schema, Workflow Schema, Theme Profile, and Content Pack Registry.
- Every `?v=` application reference resolves to Build 0.95.9.
- Service-worker shell includes `content-pack-registry.js` and every required application asset.
- ZIP integrity test passed.

## Content Pack checks

- App Profile schema is version 7.
- Content Pack Registry schema is version 1.
- Module Registry is version 4 and includes `core.contentPacks`.
- Module Bindings is version 2 and protects Library routes with Files plus Content Packs.
- Every enabled source ID resolves to a registered source.
- Every enabled pack ID resolves to a registered pack.
- Every active pack references a registered source.
- FireVault resolves four active packs and three approved sources.
- Library default folders are generated from active packs and are de-duplicated.
- Remote catalog support remains foundation-only and does not initiate network downloads.
- Content Pack Registry export is JSON-safe.

## Compatibility checks

- Storage key remains `firevault_vault_build_030`.
- Existing user-created Library folders and resources remain preserved.
- No record, media, backup, WebDAV, privacy, Demo Mode, Record Schema, Workflow Schema, or Theme Profile migration is required.
- FireVault keeps every current fire-alarm module and technician action enabled.

## Device confirmation

Confirm the Library folder list, Library content-pack status, Architecture & Modules content section, Account Detail, Quick Photo, and offline startup on a physical iPhone and iPad.
