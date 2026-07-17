# FireVault

## Build 1.03.19 — Focused Account Directory

Build 1.03.19 makes the Account Directory calmer and more reliable on a phone. Only the account aligned at the top shows quick actions, search filters immediately, and bottom-navigation labels remain fully visible.

### Updated

- Keeps non-top account cards compact and hides their Call, Route, Add Note, Photo, and Favorite controls.
- Reveals the action strip only after an account settles at the top, avoiding layout changes during touch or wheel scrolling.
- Preserves card taps, keyboard opening, action behavior, sort choices, and saved scroll position.
- Repairs Account Directory search with immediate input, paste, dictation, composition, and change handling.
- Matches multi-word searches across account name, address, Account ID, panel, phone, contacts, equipment, documents, tasks, deficiencies, checklists, tags, and Plus Codes when enabled.
- Resets filtered results to the top and exposes actions only on the first visible match.
- Replaces the long Alphabetical sort label with the compact A-Z label.
- Enlarges bottom-navigation buttons and reserves safe-area-aware vertical space so labels no longer clip.
- Keeps the Build 1.03.18 Add Account redesign, Demo Mode protection, GPS assistance, and all prior update, vault, CSV, deployment, offline, form, list, and photo safeguards.

### Run locally

From this folder, run `python3 -m http.server 8000`, then open `http://localhost:8000`. Use HTTPS for real GPS permission outside localhost.

### Developer access

Existing AppForge tools remain hidden from normal technician use. Open `http://localhost:8000/?appforge=1`, then Settings → About FireVault → AppForge Factory.

### Compatibility

The active storage key remains `firevault_vault_build_030`; no schema migration is required. Existing CSV matching, account history, and all prior field workflows remain compatible.
