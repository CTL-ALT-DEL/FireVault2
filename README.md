# FireVault

## Build 1.03.7 — PWA Update & Overlay Stability

Build 1.03.7 is a no-new-features stability release. It makes the repaired Update Ready geometry the final stylesheet contract, validates the complete PWA upgrade path, and expands coverage for Photo Overlay capture and import workflows.

### Updated

- Places a tightly scoped Update Ready geometry contract at the end of the stylesheet so older rules cannot override it.
- Accounts for iPhone and iPad safe areas while keeping the dialog centered, scrollable, and fully inside the viewport.
- Adds a dedicated PWA upgrade-contract test for build alignment, service-worker activation, cache cleanup, and all offline-shell files.
- Expands Photo Overlay regression coverage across Quick Photo, imported photos, category rendering, normal overlay, and Technician Overlay composition.
- Keeps deferred service-worker activation, the eight-second recovery watchdog, and backdrop dismissal intact.
- Changes no records, storage schema, settings, or field features.

### Run locally

From this folder, run `python3 -m http.server 8000`, then open `http://localhost:8000`. Use HTTPS for real GPS permission outside localhost.

### Developer access

Existing AppForge tools remain hidden from normal technician use. Open `http://localhost:8000/?appforge=1`, then Settings → About FireVault → AppForge Factory.

### Compatibility

The active storage key remains `firevault_vault_build_030`; no schema migration is required. Existing CSV matching, account history, and all prior field workflows remain compatible.
