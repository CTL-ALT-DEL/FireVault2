# FireVault / Field Vault Feature and Module Matrix

Build baseline: 0.96.0  
Architecture version: 4

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

The canonical machine-readable definitions are in `src/app-profile.js`, `src/module-registry.js`, `src/content-pack-registry.js`, and `src/sync-storage-profile.js`.

## Build 0.96.0 configurable sync and storage

`core.syncStorageProfile` is now a registered core module. App Profile schema 8 selects approved storage providers, assigns provider roles, defines offline and backup behavior, and controls collaboration and credential safeguards through `src/sync-storage-profile.js`. FireVault keeps its current local-first storage, WebDAV backup, Microsoft profile readiness, and manual package exchange.
