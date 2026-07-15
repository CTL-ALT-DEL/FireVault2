# FireVault
## Build 0.95.5 — Module-Aware Interface

Build 0.95.5 makes navigation, routes, Account Detail tools, and Settings respond to the enabled modules declared by the reusable App Profile while keeping every FireVault technician capability active.

### Integrated

- Search / Account Directory headings, counts, empty states, search labels, sorting accessibility, and account cards now use the App Profile terminology layer.
- Nearby titles and selected-record action labels use profile terminology.
- Account Detail titles, identity labels, actions, sections, photo headings, and record metadata use profile terminology.
- Add / Edit Account forms, validation, confirmation, deletion, and status messages use profile terminology.
- Quick Photo account selection, preview, overlay wording, empty states, and save messages use profile terminology.
- Navigation labels and photo categories continue to come from the App Profile.
- App Profile schema is now version 2 and includes reusable phrases plus a configurable record-ID label.

### FireVault behavior

The active profile still resolves the shared terms to Account, Accounts, Account ID, Technician, Equipment, Tasks, and Deficiencies. Fire alarm system fields and fire-specific modules remain in the FireVault vertical layer.

### Compatibility

The storage key remains `firevault_vault_build_030`. Existing accounts, notes, photos, IndexedDB media, WebDAV, backups, Photo Overlay, Demo Mode, Nearby, Search, and Account Detail remain compatible.


## Build 0.95.5 module-aware interface

The App Profile enabled-module list now controls global navigation availability, route access, Account Detail tabs and quick actions, and Settings visibility. FireVault keeps all current modules enabled, so existing technician workflows remain available while future app profiles can omit unused capabilities without branching the shared UI code.

- `architecture/module-bindings.json` records the profile-to-interface requirements used by navigation, routes, Account Detail, and Settings.
