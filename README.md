# FireVault Build 0.74.0 — Demo Mode Quota Repair

Build 0.74.0 repairs the `QuotaExceededError` that could appear after entering **Settings → App → Demo Mode** on an iPhone or iPad with a large real vault, recovery copy, and automatic backups.

## What changed

- The 20 fictional Boise-area accounts now run in a temporary in-memory workspace.
- FireVault no longer writes a second full demo vault into `localStorage`.
- Any legacy Build 0.73.8 demo-vault record is removed automatically to release space.
- Demo changes remain available during the current app session and reset after a full reload.
- Active demo jobs, routes, and small presentation preferences use temporary session storage when available.
- Startup status records and other noncritical preferences can no longer crash the app when browser storage is full.
- Demo Mode can fall back to a session-only activation flag if `localStorage` has no free space.

## Demo content retained

- 20 fictional Boise-area customer accounts.
- CLSS, AlarmNet, IPDACT, and Basic examples.
- Two multi-account locations sharing one address.
- Fictional contacts, equipment, visits, notes, tasks, deficiencies, documents, and checklists.
- Automatic demo tags and simulated downtown Boise GPS.
- Persistent **DEMO • BOISE** identification while active.

## Data safety

- The real vault still uses `firevault_vault_build_030`.
- The real vault, recovery copy, and automatic backups are not replaced by Demo Mode.
- Exiting Demo Mode reloads the untouched real customer vault.
- Continue downloading an external backup before deleting or reinstalling the Home Screen app.


## Build 0.74.0
- Uses the protected 20-account Boise Demo Mode workspace automatically when no real vault exists.
- Keeps the demo master immutable; demonstration edits are temporary and discarded on exit.
- Moves the Demo Mode indicator into the fixed top header between the logo and date.
