# FireVault App Profile

FireVault Build 0.96.0 uses `src/app-profile.js` as the active configuration for identity, terminology, modules, record data, workflow presets, branding, content packs, and storage policy.

The FireVault profile remains optimized for fire alarm technicians. Shared screens consume the profile so future AppForge products can change terminology, enabled modules, fields, detail sections, photo categories, action surfaces, Quick Photo behavior, brand assets, content packs, approved storage providers, backup rules, and collaboration policy without rewriting the shared application core.

The active profile uses schema version 8 with:

- `fire-alarm-technician` workflow preset
- `firevault-dark` Theme Profile
- `firevault-content-v1` Content Pack Registry
- `firevault-local-first` Sync & Storage Profile

## Build 0.96.0 storage configuration

App Profile schema 8 adds `syncStorage` with:

- `profileId`
- `enabledProviderIds`
- Role assignments for vault, media, backup, photo, document, and sync package
- Local backend and offline-first policy
- Backup and restore safeguards
- Collaboration mode and conflict policy
- Credential and local-copy protections

FireVault keeps its current local vault, IndexedDB media, automatic snapshots, complete exports, WebDAV backup, Microsoft profile readiness, and manual package-exchange workflow.
