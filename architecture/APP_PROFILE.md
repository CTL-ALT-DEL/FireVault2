# FireVault App Profile

FireVault Build 0.96.1 uses `src/app-profile.js` as the active configuration for identity, terminology, modules, record data, workflow presets, branding, content packs, and storage policy.

The FireVault profile remains optimized for fire alarm technicians. Shared screens consume the profile so future AppForge products can change terminology, enabled modules, fields, detail sections, photo categories, action surfaces, Quick Photo behavior, brand assets, content packs, approved storage providers, backup rules, and collaboration policy without rewriting the shared application core.

The active profile uses schema version 9 with:

- `fire-alarm-technician` workflow preset
- `firevault-dark` Theme Profile
- `firevault-content-v1` Content Pack Registry
- `firevault-local-first` Sync & Storage Profile

## Build 0.96.1 validation configuration

App Profile schema 9 adds the `architectureValidation` integration flag and enables `core.architectureValidation`. The validator audits the active FireVault profile and a hidden Location Guide proof profile without switching the production interface.

The App Profile continues to define `syncStorage`, content packs, theme, workflows, data model, terminology, and enabled modules. FireVault keeps its current local vault, IndexedDB media, automatic snapshots, complete exports, WebDAV backup, Microsoft profile readiness, and manual package-exchange workflow.
