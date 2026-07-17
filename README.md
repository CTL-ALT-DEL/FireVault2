# FireVault

## Build 1.03.15 — Secondary Form Cleanup

Build 1.03.15 is a no-new-features UI cleanup release. It gives Contact, Equipment, Task, and Deficiency editors one consistent, phone-ready layout without changing any field, status action, photo link, save route, or stored data.

### Updated

- Aligns Contact, Equipment, Task, and Deficiency titles beside a consistent 44px Back control.
- Reconnects the existing Unsaved state to each live secondary-form header.
- Standardizes labels, 16px inputs, 50px controls, notes areas, checkboxes, support cards, and sticky actions.
- Keeps Equipment field actions compact in three columns and keeps Deficiency photo actions and Save + Add Photo intact.
- Collapses paired fields and Save/Delete actions only on the narrowest phones where two columns would be cramped.
- Adds an automated secondary-form UI contract and retains Build 1.03.14 account-form cleanup plus all update, vault, deployment, and offline safeguards.
- Changes no contact, equipment, task, or deficiency field, validation, status behavior, storage schema, or technician feature.

### Run locally

From this folder, run `python3 -m http.server 8000`, then open `http://localhost:8000`. Use HTTPS for real GPS permission outside localhost.

### Developer access

Existing AppForge tools remain hidden from normal technician use. Open `http://localhost:8000/?appforge=1`, then Settings → About FireVault → AppForge Factory.

### Compatibility

The active storage key remains `firevault_vault_build_030`; no schema migration is required. Existing CSV matching, account history, and all prior field workflows remain compatible.
