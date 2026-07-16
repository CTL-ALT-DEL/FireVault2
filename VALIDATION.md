# FireVault Build 1.00.0 Validation

## Static checks

- JavaScript syntax passes for every source module and the service worker.
- Every imported symbol resolves from its source module.
- All JSON architecture contracts parse and runtime mirrors match.
- Every static application reference resolves to Build 1.00.0.
- Service-worker shell includes the generated-profile bridge, Generator Engine, and every required runtime asset.
- Local HTTP asset smoke test and release ZIP integrity pass.

## Generator checks

- App Profile schema is version 12 and enables `core.appForgeGenerator`.
- Module Registry is version 9 and registers the Generator Engine as shared core.
- All four Product Recipes pass 9/9 request and 9/9 AppForge profile checks.
- All four recipes produce deterministic generator plans and byte-identical ZIPs for identical inputs.
- Every generated package contains an installable PWA folder, request, Factory Manifest, generator plan, package report, requirements report, and iOS handoff profile.
- Generated App Profiles match their selected Product Recipes.
- Alternate products use isolated storage and IndexedDB namespaces.
- Generated service-worker shells reference existing package files.
- FireVault is a release candidate; the three alternate products remain prototype-ready with explicit publication requirements.

## Safety checks

- The generator source loader reads only registered static files.
- No generator path reads localStorage, sessionStorage, IndexedDB, media, backups, credentials, device identity, or OAuth tokens.
- Generation does not switch the active profile, activate a recipe, write to the vault, upload, or publish.

## Compatibility checks

- Active runtime profile remains `firevault`.
- Storage key remains `firevault_vault_build_030`.
- FireVault retains all fire-alarm modules, fields, categories, and technician actions.
- No record, media, backup, WebDAV, Microsoft profile, privacy, Demo Mode, or schema migration is required.

## Device confirmation

Confirm the Generator Engine section renders under Architecture & Modules, each product shows the correct state, FireVault PWA ZIP downloads successfully, progress remains readable on iPhone and iPad, Settings remain accessible, and offline startup works after updating.
