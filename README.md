# FireVault

## Build 1.03.18 — Confirmed Account Setup

Build 1.03.18 completely rebuilds Add Account as a guided, field-ready workspace. Every new account can search a business or street address, use current GPS, or enter the location manually, and the address must be explicitly confirmed before creation.

### Updated

- Adds a compact setup header, three-step navigation, live readiness checklist, simplified required fields, and collapsible optional fire-alarm details.
- Adds an explicit business or street-address search with up to five reviewable matches.
- Retains current-location GPS assistance and commercial-location name suggestions for every new account, not only the first one.
- Shows a structured confirmation sheet before a lookup result fills the account.
- Invalidates confirmation whenever street, city, state, or ZIP is changed.
- Requires a final “Confirm & Create” review for manually entered or corrected addresses.
- Stores confirmation method and time with the account while preserving existing fields, Plus Codes, and account history behavior.
- Prevents blank latitude and longitude fields from being interpreted as 0,0.
- Keeps Demo Mode protection, manual fallbacks, and all prior update, vault, CSV, deployment, offline, form, list, and photo safeguards.

### Run locally

From this folder, run `python3 -m http.server 8000`, then open `http://localhost:8000`. Use HTTPS for real GPS permission outside localhost.

### Developer access

Existing AppForge tools remain hidden from normal technician use. Open `http://localhost:8000/?appforge=1`, then Settings → About FireVault → AppForge Factory.

### Compatibility

The active storage key remains `firevault_vault_build_030`; no schema migration is required. Existing CSV matching, account history, and all prior field workflows remain compatible.
