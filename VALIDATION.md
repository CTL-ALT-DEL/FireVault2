# FireVault Build 0.95.4 Validation

## Terminology integration

- App Profile schema 2 loads as an ES module.
- Reusable phrase labels resolve through `appLabel()`.
- Record singular, plural, lowercase, and ID labels resolve through the active profile.
- Search / Directory, Nearby, Account Detail, Add / Edit Account, and Quick Photo consume profile terminology.
- Photo categories continue to load from `APP_PROFILE.defaultPhotoCategories`.
- FireVault still displays Account / Accounts / Account ID under the FireVault profile.

## Architecture and compatibility

- Module Registry and feature matrix remain available from Settings → About FireVault → Architecture & Modules.
- Storage key remains `firevault_vault_build_030`.
- Architecture metadata advances to version 2 without renaming or migrating user records.
- Existing accounts, notes, visits, photos, documents, overlays, and IndexedDB media remain compatible.

## Release checks

- JavaScript syntax checks pass for all modules.
- JSON files parse successfully.
- App Profile JSON matches schema version 2.
- Service-worker shell contains all application and architecture modules using Build 0.95.4 references.
- CSS braces are balanced.
- ZIP integrity check passes.

Physical iPhone and iPad confirmation is still recommended after deployment.
