# FireVault / Field Vault Feature and Module Matrix

Build baseline: 0.95.9  
Architecture version: 3

## Decision rule

- **Core**: expected to benefit nearly every future app.
- **Reusable optional**: shared implementation that may be enabled by selected app profiles.
- **FireVault-specific**: fire-alarm terminology, data, and workflows layered above the core.

| Module | Class | FireVault | Travel Guide | Fishing | Ghost Towns | Gardening | Inspection | AppForge Ready |
|---|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| Record Database | Core | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Branding & Theme Profile | Core | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Data Sources & Content Packs | Core | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
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

The canonical machine-readable definitions are in `src/app-profile.js`, `src/module-registry.js`, and `src/content-pack-registry.js`.

## Build 0.95.9 configurable data sources and content packs

`core.contentPacks` is now a registered core module. App Profile schema 7 selects approved local, bundled, imported, and future remote data sources through `src/content-pack-registry.js`. Active packs can define reusable Library folders and update policies while FireVault keeps its fire-alarm field-reference and panel-document packs enabled.
