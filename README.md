# FireVault Build 0.50.43

Build 0.50.43 continues from the stable 0.50.42 baseline and adds a closeout action-items copy tool while preserving the fixed splash/header behavior, Home spacing polish, and stable startup path.

## Changes

- Visible app version advanced to 0.50.43.
- Cache-busting references updated to 0.50.43.
- Added **Copy Action Items** in Report Center.
- Action Items includes customer photo readiness, missing captions, open tasks, open deficiencies, and the next suggested closeout step.
- Preserved Copy Customer Email, Copy Closeout Packet, Copy Tech Packet, and Copy Full Bundle.
- Preserved fixed splash/header behavior, the 5-second splash screen, Startup Health diagnostics, Home spacing polish, iPad autosizing, simple Home screen, and Search Bar Concept #6.
- Did not bring back job-status workflow buttons.

## Validation

Run from the project root:

```bash
node --check src/storage.js
node --check src/app.js
python -m json.tool manifest.json > /dev/null
zip -T firevault-build-0.50.43-modular-root.zip
```

## Suggested commit message

```text
Build 0.50.43 closeout action items copy
```
