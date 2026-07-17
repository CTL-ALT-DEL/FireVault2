# FireVault

## Build 1.03.20 — Polished Nearby Workspace

Build 1.03.20 gives Nearby Accounts a calmer, more readable map-and-list workspace without adding features or changing stored data.

### Updated

- Rebuilds the active Nearby header around clearer 48px Map/List and category-filter controls.
- Presents the selected account, address, Account ID, category, and distance in one restrained map overlay.
- Keeps Route and Call ready for the selected account instead of delaying those existing actions until map zoom completes.
- Enlarges the bottom-right distance treatment and separates its value from the supporting “away” label.
- Adds reliable keyboard opening and matching selected-state accessibility to every Nearby account card.
- Removes the smooth-scroll feedback loop from list settling and suppresses card shadows while the list is moving.
- Uses a compact single-column phone layout and a true map/list split workspace on iPad-sized screens.
- Keeps Build 1.03.19 Account Directory search and top-account actions plus all prior update, vault, CSV, deployment, onboarding, form, list, and photo safeguards.

### Run locally

From this folder, run `python3 -m http.server 8000`, then open `http://localhost:8000`. Use HTTPS for real GPS permission outside localhost.

### Developer access

Existing AppForge tools remain hidden from normal technician use. Open `http://localhost:8000/?appforge=1`, then Settings → About FireVault → AppForge Factory.

### Compatibility

The active storage key remains `firevault_vault_build_030`; no schema migration is required. Existing CSV matching, account history, and all prior field workflows remain compatible.
