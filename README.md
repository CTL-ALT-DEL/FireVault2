# FireVault Build 0.50.32

Build 0.50.32 continues from the stable Build 0.50.31 baseline and polishes the top app chrome / splash screen layout.

## Changes

- Visible app version advanced to 0.50.32.
- Updated cache-busting references in `index.html` to 0.50.32.
- Hid the top static bar while the splash screen is visible.
- Shows the top bar only after FireVault opens.
- Pinned the Home logo / build / settings bar so it does not scroll away with the Home page.
- Preserved the 5-second splash timing and stable startup repair.
- Preserved Customer Photo Ready Check, Customer Photo Captions, Customer Report Photo Selection, Deficiency Photo Workflow, Photo Vault tools, Startup Health, iPad autosizing, simple Home screen, and Search Bar Concept #6.
- Did not bring back job-status workflow controls.

## Validation

```bash
node --check src/storage.js
node --check src/app.js
python -m json.tool manifest.json
zip -T firevault-build-0.50.32-modular-root.zip
```

## Suggested commit message

```text
Build 0.50.32 top chrome and splash screen layout polish
```
