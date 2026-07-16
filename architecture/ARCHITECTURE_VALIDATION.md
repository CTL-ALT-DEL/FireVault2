# Architecture Validation

FireVault Build 0.96.1 adds `src/architecture-validator.js` as a reusable audit engine for every Field Vault app profile.

## Validation scope

The audit checks:

- Profile identity and schema integration
- Module references, duplicate IDs, and dependency closure
- Navigation, route, Settings, and Account Detail bindings
- Record fields, required fields, detail sections, and photo categories
- Workflow action IDs, supported surfaces, and Quick Photo constraints
- Theme assets and semantic color values
- Content-source and content-pack coverage
- Storage providers, provider roles, and offline-first coverage
- FireVault critical modules, tabs, photo categories, and technician actions

## Hidden transformation proof

`LOCATION_GUIDE_TEST_PROFILE` is a validation-only profile. It is not selectable and never changes the active FireVault interface. It exists to prove that the shared architecture can remove FireVault-specific modules and fields, change terminology, activate a non-fire content pack, and use a reduced storage policy.

## Packaged reports

- `architecture-audit.json`
- `architecture-audit.txt`
- `ARCHITECTURE_AUDIT.md`
- `location-guide-proof-profile.json`

The same reports can be generated inside FireVault under **Settings → About FireVault → Architecture & Modules**.
