# FireVault Build 0.50.33

Build 0.50.33 is a startup-safe repair build made from the last known stable Build 0.50.30 baseline. Builds 0.50.31 and 0.50.32 were treated as bad branches because they produced EOF errors at load.

## Changes

- Visible app version advanced to 0.50.33.
- Cache-busting references updated to 0.50.33.
- Rebuilt from stable 0.50.30 instead of continuing from the 0.50.31 / 0.50.32 EOF branch.
- Hid the top logo / build / settings chrome while the splash screen is showing.
- Top chrome appears only after FireVault boots.
- Top chrome is pinned/fixed after app boot so it does not scroll away with the main page.
- Preserved the 5-second splash screen and Startup Health diagnostics.
- Preserved Customer Photo Ready Check, Customer Photo Captions, Customer Report Photo Selection, Deficiency Photo Workflow, Photo Vault tools, overlay tools, iPad autosizing, simple Home, and Search Bar Concept #6.
- Did not bring back job-status workflow buttons.

## Validation

```bash
node --check src/storage.js
node --check src/app.js
python -m json.tool manifest.json
zip -T firevault-build-0.50.33-modular-root.zip
```

## Suggested commit message

```text
Build 0.50.33 stable startup rebuild and top chrome repair
```
