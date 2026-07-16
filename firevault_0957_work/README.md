# FireVault
## Build 0.95.7 — Configurable Workflow Presets

Build 0.95.7 makes shared field actions and Quick Photo behavior profile-driven while preserving FireVault’s complete fire-alarm technician workflow.

### Integrated

- Added `src/workflow-schema.js` as the canonical registry for reusable actions and capture behavior.
- App Profile schema version 5 now selects actions for Account Directory, Account Detail, and the Notes workspace.
- Action visibility requires both profile selection and the supporting module.
- Quick Photo now reads camera direction, image size, JPEG quality, default overlay/report state, account/category memory, and optional review controls from the workflow preset.
- Account Directory and Account Detail action grids automatically resize to the number of active actions.
- Quick Photo categories now resolve directly from the active record schema.
- Architecture & Modules displays and exports the active workflow schema.

### FireVault behavior

The active `fire-alarm-technician` preset retains:

- Directory: Call, Route, Add Note, Favorite
- Account Detail: Call, Route, Add Note, Photo
- Notes: Task, Deficiency, Photo, Report
- Rear-camera capture, account confirmation, category selection, overlay preview, report selection, title, internal notes, and customer caption
- 2,048-pixel image optimization at 0.86 JPEG quality

### AppForge direction

Future apps can select different action sets and camera-review behavior without branching the shared Account Directory, Account Detail, Notes, or Quick Photo code.

### Compatibility

The storage key remains `firevault_vault_build_030`. Existing accounts, notes, photos, documents, overlays, IndexedDB media, backups, WebDAV settings, Demo Mode, Nearby, Search, and Account Detail remain compatible.
