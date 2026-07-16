# FireVault
## Build 0.96.0 — Configurable Sync and Storage Profiles

Build 0.96.0 adds a reusable storage-policy layer while preserving FireVault’s existing offline-first vault, IndexedDB media, backups, WebDAV configuration, Microsoft profile readiness, and manual Team Sync package workflow.

### Integrated

- Added `src/sync-storage-profile.js` as the canonical registry for storage providers, provider roles, backup policy, and collaboration behavior.
- App Profile schema version 8 now selects approved providers and assigns vault, media, backup, photo, document, and sync-package roles.
- Registered `core.syncStorageProfile` in the shared Module Registry.
- File Storage provider choices now come from the active Sync & Storage Profile.
- Microsoft Storage, WebDAV, Team Sync, File Storage, and Backup settings can be hidden safely when a future profile does not enable them.
- Architecture & Modules now displays approved providers, local backends, backup retention, collaboration mode, conflict policy, and credential safeguards.
- Added downloadable Sync & Storage Profile JSON.

### FireVault active profile

FireVault uses `firevault-local-first`:

- Structured vault: localStorage
- Photo and scan media: IndexedDB
- Automatic local snapshots: enabled
- Complete manual exports with media: enabled
- Backup providers: This Device and WebDAV
- Photo and document providers: This Device, OneDrive, and SharePoint
- Collaboration: manual package exchange with an offline queue
- Conflict handling: manual review
- Credentials: excluded from the vault and backups
- Remote transfer policy: preserve the local copy

### Provider honesty

This build configures and filters approved providers; it does not claim new live OAuth transfer or automatic cloud synchronization. Each existing provider continues to report its actual readiness state.

### Compatibility

The storage key remains `firevault_vault_build_030`. Existing accounts, notes, photos, documents, overlays, IndexedDB media, backups, WebDAV settings, Microsoft profiles, Demo Mode, schemas, Theme Profile, and Content Pack Registry remain compatible.
