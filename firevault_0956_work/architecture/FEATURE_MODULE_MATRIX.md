# FireVault / Field Vault Feature and Module Matrix

Build baseline: 0.95.6  
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


## Build 0.95.5 module-aware interface

The App Profile enabled-module list now controls global navigation availability, route access, Account Detail tabs and quick actions, and Settings visibility. FireVault keeps all current modules enabled, so existing technician workflows remain available while future app profiles can omit unused capabilities without branching the shared UI code.

- `architecture/module-bindings.json` records the profile-to-interface requirements used by navigation, routes, Account Detail, and Settings.


## Build 0.95.6 configurable record schema

The module matrix now works alongside `record-schema.json`. The matrix decides which capabilities exist; the record schema decides which fields, detail sections, and photo categories each app profile exposes.
