# FireVault Build 0.73.8

Build 0.73.8 adds a protected **Demo Mode** under **Settings → App → Demo Mode**. Demo Mode switches FireVault to a completely separate fictional customer vault so the app can be shown without exposing real account information.

## Demo Mode highlights

- 20 fictional customer accounts in the Boise, Idaho area.
- Every demo location is within approximately 15 miles of downtown Boise.
- Sample CLSS, AlarmNet, IPDACT, and Basic account numbers.
- Two multi-building locations with separate account IDs at the same address.
- Fictional contacts, panels, communicators, batteries, visits, notes, tasks, deficiencies, documents, and checklists.
- Sample rule-driven tags for Healthcare, Education, Priority Service, Multi-Building Campus, and Boise Metro.
- Simulated downtown Boise GPS so Nearby Accounts works regardless of the device's real location.
- A persistent **DEMO • BOISE** badge while Demo Mode is active.
- Demo changes are saved only to a separate demo vault.
- Exiting Demo Mode reloads the untouched real FireVault vault.
- Reset Demo Data restores the original 20 fictional accounts.

## Data safety

- The real vault continues to use `firevault_vault_build_030`.
- The demo vault uses a separate key and is excluded from real-vault recovery scans.
- Demo active jobs and route logs use separate storage keys.
- Automatic real-vault snapshots are not exposed or modified while Demo Mode is active.
- Continue downloading an external backup before deleting or reinstalling the Home Screen app.
