# FireVault Build 0.98.0 Validation

## Static checks

- JavaScript syntax passed for every source module and the service worker.
- Every imported symbol resolves from its source module.
- JSON parsing passed for manifest, version, and every architecture contract.
- Every static `?v=` application reference resolves to Build 0.98.0.
- Service-worker shell includes `app-forge-recipes.js` and every required application asset.
- Runtime App Profile and Module Registry match their architecture JSON mirrors.
- Local HTTP asset smoke test passed.
- ZIP integrity test passed.

## Product Recipe checks

- App Profile schema is version 10 and enables `core.appForgeRecipes`.
- Module Registry is version 7 and registers Product Recipes as shared core.
- Recipe schema is version 1.
- FireVault passes 9/9 blueprint checks with 25 enabled modules.
- Wyoming Explorer passes 9/9 blueprint checks with 17 enabled modules and three content packs.
- Wyoming Fishing Guide passes 9/9 blueprint checks with 17 enabled modules and three content packs.
- Ghost Towns Guide passes 9/9 blueprint checks with 17 enabled modules and four content packs.
- Every recipe export includes identity, terminology, modules, data model, workflows, theme, content, storage, validation, and publication requirements.
- Foundation recipes use local-first storage and disabled collaboration by default.
- Foundation recipes are clearly separated from publication readiness.

## Compatibility checks

- Storage key remains `firevault_vault_build_030`.
- The active runtime profile remains FireVault.
- No alternate recipe is activated or written into customer storage.
- No record, media, backup, WebDAV, Microsoft profile, privacy, Demo Mode, or schema migration is required.
- FireVault keeps every current fire-alarm module, field, photo category, and technician action enabled.

## Device confirmation

Confirm the four Product Recipe cards render under Architecture & Modules, each recipe and the complete catalog download as JSON, existing Settings areas remain accessible, and offline startup works on a physical iPhone and iPad.
