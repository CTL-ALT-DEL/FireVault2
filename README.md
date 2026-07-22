# FireVault

## Build 1.03.23 — Native Apple Maps Bridge

Build 1.03.23 connects the native iPhone container to Apple Maps while preserving the browser PWA fallback and stored FireVault data.

### Updated

- Uses Apple Maps for native address and business searches.
- Uses Apple Core Location for GPS capture in the native iPhone app.
- Uses Apple reverse geocoding for the confirmed current-address workflow.
- Uses Apple map snapshots behind Nearby Accounts and On-Site Guide pins.
- Opens native driving routes in Apple Maps.
- Keeps OpenStreetMap and browser geolocation only as PWA fallbacks.
- Removes the redundant GPS & Navigation panel from the bottom of Account Detail’s Details tab.
- Retains the account-header address, primary Route action, editable location fields, Plus Code, and exact-location tools.
- Adds individual shaded tab surfaces and a stronger active treatment to improve Account Detail tab contrast.
- Keeps Build 1.03.20 Nearby polish and all prior update, vault, CSV, deployment, onboarding, form, list, and photo safeguards.

### Run locally

From this folder, run `python3 -m http.server 8000`, then open `http://localhost:8000`. Use HTTPS for real GPS permission outside localhost.

### Developer access

Existing AppForge tools remain hidden from normal technician use. Open `http://localhost:8000/?appforge=1`, then Settings → About FireVault → AppForge Factory.

### Compatibility

The active storage key remains `firevault_vault_build_030`; no schema migration is required. Existing CSV matching, account history, and all prior field workflows remain compatible.
