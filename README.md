# FireVault

## Build 1.03.9 — Vault Upgrade Preservation

Build 1.03.9 is a no-new-features data-preservation release. A realistic production-style account now runs through save, reload, second save, recovery, and rolling-backup checks so future PWA or UI work cannot silently drop important field data.

### Updated

- Locks the customer vault key and device identity key across build upgrades.
- Verifies account notes, contacts, tasks, deficiencies, GPS, account and entrance Plus Codes, and preferred location data after reload.
- Verifies photo metadata, customer captions, media references, the normal Photo Overlay, and the independent Technician Overlay after reload.
- Verifies Demo Mode stays off once a real vault exists and the prior revision remains available in the recovery copy.
- Verifies the service worker cannot access customer local storage or IndexedDB.
- Retains Build 1.03.8 fresh-first navigation, Build 1.03.7 update geometry hardening, and all earlier field workflows.
- Changes no records, storage schema, settings, or technician features.

### Run locally

From this folder, run `python3 -m http.server 8000`, then open `http://localhost:8000`. Use HTTPS for real GPS permission outside localhost.

### Developer access

Existing AppForge tools remain hidden from normal technician use. Open `http://localhost:8000/?appforge=1`, then Settings → About FireVault → AppForge Factory.

### Compatibility

The active storage key remains `firevault_vault_build_030`; no schema migration is required. Existing CSV matching, account history, and all prior field workflows remain compatible.
