# FireVault

## Build 1.03.17 — Guided First Account

Build 1.03.17 adds a minimal new-user path from the protected Demo Mode into a confirmed, GPS-assisted first real account. It keeps real and fictional data separate and never inserts a detected address without approval.

### Updated

- Shows three short first-open cards explaining Demo Mode, account search, Nearby Accounts, Account Detail, and the move to real data.
- Asks whether to leave Demo Mode when Add Account is selected: use the real vault or continue with a temporary practice account.
- Adds a first-account guide with explicit GPS and manual-entry choices.
- Uses one user-requested reverse-address lookup, then asks “Is that correct?” before populating any address fields.
- Shows a commercial location name when OpenStreetMap returns one and uses it as the suggested account name only when the field is empty.
- Keeps manual entry available when GPS permission is declined, lookup fails, or the suggested address is wrong.
- Generates the existing offline Google Plus Code after confirmed GPS is applied.
- Adds an automated onboarding contract and retains Build 1.03.16 list cleanup plus all update, vault, CSV, deployment, and offline safeguards.

### Run locally

From this folder, run `python3 -m http.server 8000`, then open `http://localhost:8000`. Use HTTPS for real GPS permission outside localhost.

### Developer access

Existing AppForge tools remain hidden from normal technician use. Open `http://localhost:8000/?appforge=1`, then Settings → About FireVault → AppForge Factory.

### Compatibility

The active storage key remains `firevault_vault_build_030`; no schema migration is required. Existing CSV matching, account history, and all prior field workflows remain compatible.
