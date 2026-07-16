# FireVault Build 0.99.0 Validation

## Static checks

- JavaScript syntax passed for every source module and the service worker.
- Every imported symbol resolves from its source module.
- JSON parsing passed for manifest, version, and every architecture contract.
- Every static `?v=` application reference resolves to Build 0.99.0.
- Service-worker shell includes `app-forge-factory.js` and every required application asset.
- Runtime App Profile and Module Registry match their architecture JSON mirrors.
- Local HTTP asset smoke test passed.
- ZIP integrity test passed.

## Factory checks

- App Profile schema is version 11 and enables `core.appForgeFactory`.
- Module Registry is version 8 and registers the Factory Manifest as shared core.
- Factory schema and Generation Request schema are version 1.
- All four default Generation Requests pass 9/9 request checks.
- All four composed profiles pass 9/9 AppForge Blueprint checks.
- FireVault produces a `ready` manifest with seven registered outputs and no missing required inputs.
- Wyoming Explorer, Wyoming Fishing Guide, and Ghost Towns Guide produce `requirements-pending` manifests with assets and databases required.
- Every factory manifest contains a request, recipe identity, validation results, readiness, requirements, output inventory, guardrails, and validated blueprint.
- Every export excludes customer records, media, credentials, backups, and device identity.
- No factory action activates another recipe or writes to the active vault.

## Compatibility checks

- Storage key remains `firevault_vault_build_030`.
- Active runtime profile remains `firevault`.
- No record, media, backup, WebDAV, Microsoft profile, privacy, Demo Mode, or schema migration is required.
- FireVault keeps every current fire-alarm module, field, photo category, and technician action enabled.

## Device confirmation

Confirm Factory Manifest metrics and four product rows render under Architecture & Modules, Request Template and Factory Manifest downloads produce valid JSON, current FireVault Settings remain accessible, and offline startup works on a physical iPhone and iPad.
