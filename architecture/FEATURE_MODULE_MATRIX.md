# FireVault / Field Vault Feature and Module Matrix

Build baseline: 0.95.4  
Architecture version: 1

## Decision rule

- **Core**: expected to benefit nearly every future app.
- **Reusable optional**: shared implementation that may be enabled by selected app profiles.
- **FireVault-specific**: fire-alarm terminology, data, and workflows layered above the core.

| Module | Class | FireVault | Travel Guide | Fishing | Ghost Towns | Gardening | Inspection | AppForge Ready |
|---|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| Record Database | Core | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
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

The canonical machine-readable definitions are in `src/app-profile.js` and `src/module-registry.js`.
