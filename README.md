# FireVault

## Build 1.03.16 — Secondary List Cleanup

Build 1.03.16 is a no-new-features UI cleanup release. It gives the Contact, Equipment, Task, and Deficiency list screens one compact field-ready layout without changing any record, filter, quick action, route, or stored data.

### Updated

- Gives all four list screens the same compact header with 44px Back and Add controls.
- Keeps account context readable while safely shortening unusually long account names.
- Replaces tall phone action stacks with compact two- or three-column 44px action grids.
- Keeps filter rails horizontal, raises their touch targets to 44px, and strengthens count readability.
- Aligns card titles, status pills, metadata, notes, and summary counts across phone and tablet layouts.
- Adds an automated secondary-list UI contract and retains Build 1.03.15 form cleanup plus all update, vault, deployment, and offline safeguards.
- Changes no contact, equipment, task, or deficiency data, filters, status behavior, storage schema, or technician feature.

### Run locally

From this folder, run `python3 -m http.server 8000`, then open `http://localhost:8000`. Use HTTPS for real GPS permission outside localhost.

### Developer access

Existing AppForge tools remain hidden from normal technician use. Open `http://localhost:8000/?appforge=1`, then Settings → About FireVault → AppForge Factory.

### Compatibility

The active storage key remains `firevault_vault_build_030`; no schema migration is required. Existing CSV matching, account history, and all prior field workflows remain compatible.
