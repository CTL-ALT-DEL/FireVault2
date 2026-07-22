# AppForge Product Blueprint

Build baseline: 1.03.30  
Blueprint schema: 1

The AppForge Product Blueprint is the portable definition of a Field Vault product. It combines the separate architecture contracts added in Builds 0.95.3 through 0.96.0 and checks them before export.

## What it contains

- Product identity, industry, audience, purpose, terminology, and navigation labels
- Enabled modules and their dependency graph
- Navigation, route, Settings, and Account Detail UI bindings
- Active record fields, required fields, detail sections, and photo categories
- Directory, detail, Notes, and Quick Photo workflow policy
- Theme assets, semantic colors, typography, and mobile chrome
- Data sources, content packs, folder defaults, and update policy
- Local storage backends, approved providers, backup rules, collaboration, and credential safeguards
- Contract version numbers and PWA runtime targets

## Validation gate

`validateAppForgeProfile()` checks product identity, selected module IDs, module dependencies, UI binding references, record-schema references, workflow actions, content pack/source relationships, storage provider/role relationships, and required Theme Profile assets.

A blueprint with errors reports `blocked`. FireVault Build 1.00.0, all four registered Product Recipes, and all four generator-composed profiles pass all nine checks and report `ready` at the configuration level.

## Safety and compatibility

The blueprint contains configuration only. It does not contain customer accounts, notes, photos, documents, credentials, backups, or device identifiers. Exporting it does not alter the active vault.

FireVault retains storage key `firevault_vault_build_030`, so no customer-data or media migration is required.
