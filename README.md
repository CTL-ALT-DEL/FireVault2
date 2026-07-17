# FireVault

## Build 1.03.8 — Fresh-First PWA Bootstrap

Build 1.03.8 is a no-new-features update bootstrap release. When online, navigation briefly prefers the newest page instead of automatically serving stale HTML first; slow or unavailable connections still fall back to the complete offline app.

### Updated

- Gives a fresh navigation response up to 1.8 seconds to arrive before using cached HTML.
- Returns the cached app promptly when the network is slow or offline, preserving field reliability.
- Continues the network refresh in the background after a cached fallback so the next opening is current.
- Adds an executable service-worker simulation for fast-online, slow-online, offline, and first-install navigation.
- Retains Build 1.03.7 update geometry hardening and the complete Photo Overlay regression coverage.
- Changes no records, storage schema, settings, or technician features.

### Run locally

From this folder, run `python3 -m http.server 8000`, then open `http://localhost:8000`. Use HTTPS for real GPS permission outside localhost.

### Developer access

Existing AppForge tools remain hidden from normal technician use. Open `http://localhost:8000/?appforge=1`, then Settings → About FireVault → AppForge Factory.

### Compatibility

The active storage key remains `firevault_vault_build_030`; no schema migration is required. Existing CSV matching, account history, and all prior field workflows remain compatible.
