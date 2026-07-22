# FireVault

## Build 1.03.22 — Native Import Transition Fix

Build 1.03.22 simplifies Account Directory and Account Detail without adding features or changing stored data.

### Updated

- Removes Call, Route, Add Note, Photo, and Favorite controls from every Account Directory row, including the top result.
- Keeps each directory row as one compact, reliable tap or keyboard target that opens Account Detail.
- Keeps the bottom navigation visible while searching and explicitly restores it when directory search loses focus.
- Preserves immediate multi-word search, A-Z sorting, filters, saved scroll position, and direct account opening.
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
