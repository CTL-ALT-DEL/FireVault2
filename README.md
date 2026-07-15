# FireVault
## Build 0.95.4 — Core Terminology Integration

Build 0.95.4 turns the App Profile from an architecture reference into an active UI source while keeping FireVault optimized for fire alarm technicians.

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
