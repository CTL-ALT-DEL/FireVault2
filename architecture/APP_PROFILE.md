# FireVault App Profile

FireVault Build 0.97.0 uses `src/app-profile.js` as the active configuration for identity, terminology, modules, record data, workflow presets, branding, content packs, storage policy, and AppForge blueprint participation.

The FireVault profile remains optimized for fire alarm technicians. Shared screens consume the profile so future AppForge products can change terminology, enabled modules, fields, detail sections, photo categories, action surfaces, Quick Photo behavior, brand assets, content packs, approved storage providers, backup rules, and collaboration policy without rewriting the shared application core.

The active profile uses schema version 9 with:

- `fire-alarm-technician` workflow preset
- `firevault-dark` Theme Profile
- `firevault-content-v1` Content Pack Registry
- `firevault-local-first` Sync & Storage Profile
- AppForge Product Blueprint validation and export

## Build 0.97.0 blueprint configuration

App Profile schema 9 adds `appForgeBlueprint` integration and enables `core.appForgeBlueprint`. The blueprint combines and validates:

- Product identity and terminology
- Enabled modules and dependency closure
- UI module bindings
- Record fields, detail sections, and photo categories
- Workflow actions and Quick Photo policy
- Branding and Theme Profile
- Data sources and Content Pack Registry
- Sync providers, local backends, backups, and collaboration policy

The exported blueprint is a portable build input, not a customer-data export. FireVault keeps its current local vault, IndexedDB media, automatic snapshots, complete exports, WebDAV backup, Microsoft profile readiness, and manual package-exchange workflow.
