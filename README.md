# FireVault
## Build 0.95.3 — Core Architecture Foundation

Build 0.95.3 establishes the reusable Field Vault architecture without changing FireVault's technician workflows or storage key.

### Added

- `src/app-profile.js`: canonical app identity, terminology, navigation labels, appearance defaults, photo categories, and enabled modules.
- `src/module-registry.js`: explicit Core, Reusable optional, and FireVault-specific module classifications.
- Settings → About FireVault → Architecture & Modules: profile summary, registry inventory, feature matrix, and downloadable JSON/CSV exports.
- `architecture/FEATURE_MODULE_MATRIX.md` and `.csv`: development decision sheet for FireVault and future vertical apps.
- Storage metadata now records profile `firevault` and architecture version `1` while retaining `firevault_vault_build_030`.

### Compatibility

Accounts, notes, photos, IndexedDB media, WebDAV, backups, Demo Mode, Quick Photo, Search, Nearby, and Account Detail remain compatible with Build 0.95.2 data.


Rebuilds Account Detail around a compact account identity header, Call / Route / Add Note / Photo actions, and a faster tab order: Overview, Notes, Locations, Equipment, Files, and Details. The content area stays independently scrollable, iPad layouts use wider two-column space where appropriate, and Back returns to Search or Nearby according to where the account was opened. Existing data and storage remain compatible.
