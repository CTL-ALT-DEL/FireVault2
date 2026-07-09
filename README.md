# FireVault Build 0.50.50

Build 0.50.50 continues from the stable 0.50.49 baseline, removes the splash loader completely, and repairs the Home bottom-button clearance.

## Changes

- Visible app version advanced to 0.50.50.
- Cache-busting references updated to 0.50.50.
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
zip -T firevault-build-0.50.50-modular-root.zip
```

## Suggested commit message

```text
Build 0.50.50 remove splash loader and bottom button repair
```

- Lifted the red Home add button above the bottom nav so it should not be blocked by the black bottom area.
- Removed the extra Home nav safe-area slab that was covering the red add button.
