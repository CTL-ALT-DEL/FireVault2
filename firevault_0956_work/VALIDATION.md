# FireVault Build 0.95.6 Validation

## Record-schema integration

- App Profile schema version 4 selects active fields, required fields, Account Detail sections, and photo categories.
- `src/record-schema.js` loads as an ES module and exports the canonical schema plus filtering and export helpers.
- FireVault enables all 11 registered record fields, all six Account Detail sections, and all nine photo categories.
- Add/Edit Account uses the schema for field visibility and labels.
- Account Detail tabs require both schema selection and module availability.
- Quick Photo categories and category hints resolve from the active schema.
- Disabled existing fields are preserved rather than erased when saving a record.

## Architecture and compatibility

- Settings → About FireVault → Architecture & Modules displays the Record Schema inventory.
- Record Schema JSON can be downloaded from the application.
- Package includes `architecture/record-schema.json` and `architecture/RECORD_SCHEMA.md`.
- Storage key remains `firevault_vault_build_030`.
- No record migration or key rename is required.

## Release checks

- JavaScript syntax checks pass for all application modules.
- All local ES-module imports resolve to packaged files.
- JSON files parse successfully.
- App Profile JSON matches schema version 4.
- Service-worker shell contains `record-schema.js` and all Build 0.95.6 application assets.
- FireVault field/module dependencies are satisfied.
- CSS braces are balanced.
- ZIP integrity check passes.

Physical iPhone and iPad confirmation remains recommended after deployment.
