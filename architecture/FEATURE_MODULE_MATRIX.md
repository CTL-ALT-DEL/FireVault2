# FireVault / Field Vault Feature and Module Matrix

Build baseline: 1.03.7  
Architecture version: 8

## Decision rule

- **Core**: expected to benefit nearly every future app.
- **Reusable optional**: shared implementation that may be enabled by selected app profiles.
- **FireVault-specific**: fire-alarm terminology, data, and workflows layered above the core.

| Module | Class | FireVault | Travel Guide | Fishing | Ghost Towns | Gardening | Inspection | AppForge Ready |
|---|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| Record Database | Core | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Branding & Theme Profile | Core | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Data Sources & Content Packs | Core | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Sync & Storage Profile | Core | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| AppForge Product Blueprint | Core | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| AppForge Product Recipes | Core | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| AppForge Factory Manifest | Core | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| AppForge Generator Engine | Core | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Search Directory | Core | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Nearby GPS | Core | ✓ | ✓ | ✓ | ✓ |  | ✓ | ✓ |
| Notes & History | Core | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Quick Photo | Core | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Files & Documents | Core | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Photo Overlay | Core | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Exact Location Navigator | Core | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Offline Storage | Core | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Backup & Restore | Core | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Security Foundation | Core | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Equipment Records | Reusable optional | ✓ |  | ✓ |  | ✓ | ✓ | ✓ |
| Tasks | Reusable optional | ✓ |  |  |  | ✓ | ✓ | ✓ |
| Deficiencies / Issues | Reusable optional | ✓ |  |  |  | ✓ | ✓ | ✓ |
| Reports | Reusable optional | ✓ |  |  |  |  | ✓ | ✓ |
| Cloud Storage Adapters | Reusable optional | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Import & Export | Reusable optional | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Fire Alarm Account Profile | FireVault-specific | ✓ |  |  |  |  |  |  |
| Panel Documents | FireVault-specific | ✓ |  |  |  |  |  |  |
| Fire Location Types | FireVault-specific | ✓ |  |  |  |  |  |  |

The canonical machine-readable definitions are in `src/app-profile.js`, `src/module-registry.js`, `src/content-pack-registry.js`, `src/sync-storage-profile.js`, `src/app-forge-blueprint.js`, `src/app-forge-recipes.js`, `src/app-forge-factory.js`, and `src/app-forge-generator.js`.

## Build 1.00.0 AppForge Generator Engine

`core.appForgeGenerator` consumes a validated Factory Manifest, loads the shared Field Vault source, injects a generated App Profile, assigns a product-specific storage namespace, and creates a deterministic installable PWA ZIP locally in the browser. The package includes architecture contracts, request and manifest records, a package report, requirements, and an iOS handoff profile. It never reads the active vault or publishes an app.

## Build 0.99.0 AppForge Factory Manifest

`core.appForgeFactory` turns each registered Product Recipe into a normalized Generation Request, composed App Profile, two validation gates, explicit publication requirements, expected output inventory, and safety guardrails. The factory contract does not activate recipes, publish apps, or include customer data.

## Build 0.98.0 AppForge Product Recipes

`core.appForgeRecipes` adds four validated starting definitions: the active FireVault product plus foundation recipes for Wyoming Explorer, Wyoming Fishing Guide, and Ghost Towns Guide. Every recipe passes the blueprint contract gate. Only FireVault is marked publish-ready; alternate recipes explicitly require their own brand assets and verified databases before publication.

## Build 0.97.0 AppForge Product Blueprint

`core.appForgeBlueprint` is now a registered core module. App Profile schema 9 marks the complete product definition as blueprint-enabled, while `src/app-forge-blueprint.js` validates module dependencies and every configured record, workflow, content, branding, and storage reference. FireVault can export those contracts together as one portable AppForge build input without changing its local-first vault or technician workflow.
