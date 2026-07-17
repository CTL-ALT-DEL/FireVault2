# FireVault

## Build 1.03.14 — Account Form Cleanup

Build 1.03.14 is a no-new-features UI cleanup release. It makes Add Account and Edit Account clearer, more compact, and safer to use with a phone keyboard without changing any account field, validation rule, or saved data.

### Updated

- Reconnects the existing Unsaved indicator to the live account-form header.
- Enlarges the Back control, form heading, labels, required badges, GPS action, error message, and Save / Cancel actions.
- Reduces excess space between section headings and fields while retaining Identity, Location, Fire Alarm System, GPS, Plus Code, and notes content.
- Keeps 16px inputs and explicit phone keyboard modes to prevent iPhone focus zoom and preserve efficient entry.
- Keeps the sticky Save / Cancel bar reachable and hides only the nonessential header description on narrow phones.
- Adds an automated account-form UI contract and retains Build 1.03.13 photo cleanup plus all existing update, vault, deployment, and offline safeguards.
- Changes no account field, validation rule, storage schema, or technician feature.

### Run locally

From this folder, run `python3 -m http.server 8000`, then open `http://localhost:8000`. Use HTTPS for real GPS permission outside localhost.

### Developer access

Existing AppForge tools remain hidden from normal technician use. Open `http://localhost:8000/?appforge=1`, then Settings → About FireVault → AppForge Factory.

### Compatibility

The active storage key remains `firevault_vault_build_030`; no schema migration is required. Existing CSV matching, account history, and all prior field workflows remain compatible.
