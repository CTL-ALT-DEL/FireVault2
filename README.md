# FireVault Build 0.50.52

Build 0.50.52 continues from the stable 0.50.51 baseline and adds Backup Safety tools so FireVault data can be saved before installing new builds.

## Changes

- Visible app version advanced to 0.50.52.
- Cache-busting references updated to 0.50.52.
- Added **Site Quick Actions** card on the account/site screen.
- Added direct quick actions for:
  - Add Site Note
  - Add Photo
  - Add Deficiency
  - Add Task
  - Photo Vault
  - Report Center
  - Copy Closeout Packet
- Kept Snapshot and Navigate available while making the most-used field actions easier to find.
- Preserved Customer Report Photo tools, Deficiency Photo Workflow, Photo Vault tools, overlay tools, fixed splash/header behavior, the 5-second splash screen, Startup Health diagnostics, Home spacing polish, iPad autosizing, simple Home screen, and Search Bar Concept #6.
- Did not bring back job-status workflow buttons.

- Preserved the Home layout fixes from 0.50.46, including the lifted Add Account button and tighter Today/date spacing.
- Preserved Site Quick Actions from 0.50.44.
- Preserved fixed splash/header behavior, the 5-second splash screen, and stable startup path.

## Validation

Run from the project root:

```bash
node --check src/storage.js
node --check src/app.js
python -m json.tool manifest.json > /dev/null
zip -T firevault-build-0.50.52-modular-root.zip
```

## Suggested commit message

```text
Build 0.50.52 backup safety polish
```

- Lifted the red Home add button above the bottom nav so it should not be blocked by the black bottom area.
- Removed the extra Home nav safe-area slab that was covering the red add button.

- Removed the bottom floating Add Site button so it can no longer be blocked by the bottom navigation.

- Added Backup Safety counts for sites, visits, docs, photos, tasks, deficiencies, and backup size.
- Added Copy Backup Summary.
- Preserved top-right Add Site placement from 0.50.51.
