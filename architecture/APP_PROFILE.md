# FireVault App Profile

FireVault Build 0.99.0 uses `src/app-profile.js` as the active configuration for identity, terminology, modules, record data, workflow presets, branding, content packs, storage policy, AppForge blueprint participation, product recipes, and factory-manifest support.

The FireVault profile remains optimized for fire alarm technicians. Shared screens consume the profile so future AppForge products can change terminology, enabled modules, fields, detail sections, photo categories, action surfaces, Quick Photo behavior, brand assets, content packs, approved storage providers, backup rules, and collaboration policy without rewriting the shared application core.

The active profile uses schema version 11 with:

- `fire-alarm-technician` workflow preset
- `firevault-dark` Theme Profile
- `firevault-content-v1` Content Pack Registry
- `firevault-local-first` Sync & Storage Profile
- AppForge Product Blueprint validation and export
- AppForge Product Recipe validation and export
- AppForge Factory Request and Manifest generation

## Build 0.99.0 factory-manifest configuration

App Profile schema 11 adds `appForgeFactory` integration and enables `core.appForgeFactory`. The active FireVault profile remains unchanged while the factory layer can:

- Normalize a Product Recipe into a versioned Generation Request
- Compose a deterministic App Profile
- Validate both request inputs and the resulting blueprint
- Identify required brand assets and verified databases
- Describe expected PWA and native-profile outputs
- Enforce customer-data, credential, activation, and publishing guardrails

Factory manifests are build handoffs, not executable installers or customer-data exports. FireVault keeps its current local vault, IndexedDB media, automatic snapshots, complete exports, WebDAV backup, Microsoft profile readiness, and manual package-exchange workflow.
