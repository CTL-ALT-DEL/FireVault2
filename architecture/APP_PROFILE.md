# FireVault App Profile

FireVault Build 0.98.0 uses `src/app-profile.js` as the active configuration for identity, terminology, modules, record data, workflow presets, branding, content packs, storage policy, AppForge blueprint participation, and product-recipe support.

The FireVault profile remains optimized for fire alarm technicians. Shared screens consume the profile so future AppForge products can change terminology, enabled modules, fields, detail sections, photo categories, action surfaces, Quick Photo behavior, brand assets, content packs, approved storage providers, backup rules, and collaboration policy without rewriting the shared application core.

The active profile uses schema version 10 with:

- `fire-alarm-technician` workflow preset
- `firevault-dark` Theme Profile
- `firevault-content-v1` Content Pack Registry
- `firevault-local-first` Sync & Storage Profile
- AppForge Product Blueprint validation and export
- AppForge Product Recipe validation and export

## Build 0.98.0 product recipe configuration

App Profile schema 10 adds `appForgeRecipes` integration and enables `core.appForgeRecipes`. The active FireVault profile remains unchanged as a technician product, while alternate recipe profiles can replace:

- Product identity, industry, audience, and terminology
- Enabled modules and location-oriented workflows
- Branding words, colors, and tagline
- Content packs and database requirements
- Storage and collaboration policy

Recipe downloads are portable build inputs, not switches or customer-data exports. FireVault keeps its current local vault, IndexedDB media, automatic snapshots, complete exports, WebDAV backup, Microsoft profile readiness, and manual package-exchange workflow.
