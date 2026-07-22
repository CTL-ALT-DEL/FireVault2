# FireVault

## Build 1.03.24 — Bottom Navigation Reliability

Build 1.03.24 repairs and polishes FireVault’s persistent bottom navigation without changing stored data or adding features.

### Updated

- Matches the dock’s column count to its visible buttons instead of forcing a retired three-button layout.
- Keeps Nearby, Search, Photo, and Settings visible in equal-width columns.
- Enlarges dock icons and keeps labels readable on narrow iPhones.
- Preserves safe-area spacing around the Home indicator.
- Restores the correct dock layout after Account Directory search input and keyboard dismissal.
- Updates the in-app navigation manual and revision history.
- Retains Build 1.03.23 native Apple Maps support and all prior update, vault, CSV, onboarding, form, list, and photo safeguards.

### Run locally

From this folder, run `python3 -m http.server 8000`, then open `http://localhost:8000`. Use HTTPS for real GPS permission outside localhost.

### Developer access

Existing AppForge tools remain hidden from normal technician use. Open `http://localhost:8000/?appforge=1`, then Settings → About FireVault → AppForge Factory.

### Compatibility

The active storage key remains `firevault_vault_build_030`; no schema migration is required. Existing CSV matching, account history, and all prior field workflows remain compatible.
