# FireVault
## Build 0.95.6 — Configurable Record Schema

Build 0.95.6 makes the shared record model profile-driven while preserving FireVault’s complete fire-alarm workflow.

### Integrated

- Added `src/record-schema.js` as the canonical registry for record fields, form groups, Account Detail sections, and photo categories.
- App Profile schema version 4 now selects active field IDs, required fields, detail sections, and photo categories.
- Add/Edit Account renders only fields enabled by the active profile.
- Account Detail tabs must be enabled by both the record schema and the module registry.
- Quick Photo and document-photo category choices now come from the record schema.
- Hidden fields are preserved when an existing record is saved under a reduced future-app profile.
- Architecture & Modules now displays the active field schema and can download it as JSON.

### FireVault behavior

The FireVault profile enables all existing fields: Account Name, Account ID, Site Phone, address, GPS, panel make, panel model, and Site Notes. All current Account Detail tabs and fire-photo categories remain active.

### AppForge direction

A future app can select a smaller or different field set without branching the shared form, detail-tab, or photo-category code. Fire-specific fields remain identified as vertical-layer fields, while reusable identity, location, GPS, and notes fields remain AppForge-ready.

### Compatibility

The storage key remains `firevault_vault_build_030`. Existing accounts, notes, photos, documents, overlays, IndexedDB media, backups, WebDAV settings, Demo Mode, Nearby, Search, and Account Detail remain compatible.
