# FireVault

## Build 1.03.1 — Real-Vault CSV Import Fix

Build 1.03.1 prevents Customer CSV imports from being discarded when a fresh installation starts in Demo Mode.

### Fixed

- Choosing a Customer CSV while Demo Mode is active now asks to exit Demo Mode before analyzing the file.
- CSV rows merge against the real vault rather than the temporary fictional workspace.
- A successful import is shown only after every selected Account ID is verified in persistent storage.
- Save failures keep the source CSV untouched and show a clear retry message instead of reporting a false success.
- Existing real-vault accounts and their notes, photos, visits, tasks, deficiencies, contacts, and documents remain protected during repeat imports.

### Run locally

From this folder, run `python3 -m http.server 8000`, then open `http://localhost:8000`. Use HTTPS for real GPS permission outside localhost.

### Developer access

Existing AppForge tools remain hidden from normal technician use. Open `http://localhost:8000/?appforge=1`, then Settings → About FireVault → AppForge Factory.

### Compatibility

The active storage key remains `firevault_vault_build_030`; no schema migration is required. Build 1.03.0 UI cleanup and every prior field workflow remain compatible.
