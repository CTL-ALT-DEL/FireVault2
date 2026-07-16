# FireVault
## Build 0.96.1 — Architecture Validation and Regression Audit

Build 0.96.1 proves and protects the reusable Field Vault architecture while preserving FireVault’s current technician interface, data, media, backups, and storage key.

### Integrated

- Added `src/architecture-validator.js` as the automated configuration and regression audit engine.
- Registered `core.architectureValidation` in the shared Module Registry.
- Advanced the App Profile to schema version 9 and UI bindings to version 3.
- Added live checks for profile references, enabled-module dependencies, navigation and route bindings, Settings pages, Account Detail sections, record fields, photo categories, workflow actions, Quick Photo limits, theme assets and colors, content-pack sources, storage providers, provider roles, and offline coverage.
- Added FireVault-specific regression checks for critical modules, all six Account Detail sections, all nine photo categories, and all expected technician actions.
- Added a hidden `Location Guide Proof` profile that validates the same shared core without any `firevault.*` modules or FireVault-only fields.
- Added an in-app Architecture Validation section under **Settings → About FireVault → Architecture & Modules**.
- Added Run Audit Again, Download Audit JSON, and Download Audit Text controls.

### Validation result

The packaged audit completed:

- Overall: PASS
- Total checks: 60
- Passed: 60
- Warnings: 0
- Failures: 0
- FireVault active profile: PASS
- Hidden Location Guide proof: PASS

### Hidden alternate-profile proof

The validation-only profile confirms that the platform can:

- Change Account terminology to Location.
- Remove FireVault-specific modules and panel fields.
- Retain Search, Nearby, Notes, Photos, Files, location points, backups, security, and import/export.
- Load a travel-oriented content-pack definition.
- Reduce storage to a local-only provider configuration.
- Preserve safe Account Detail tab and route coverage.

The proof profile is never activated in the production FireVault interface.

### Compatibility

The storage key remains `firevault_vault_build_030`. Existing accounts, notes, photos, documents, overlays, IndexedDB media, backups, WebDAV settings, Microsoft profiles, Demo Mode, record schemas, workflow presets, Theme Profile, Content Pack Registry, and Sync & Storage Profile remain compatible.
