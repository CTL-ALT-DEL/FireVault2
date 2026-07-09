# FireVault Build 0.50.36

Build 0.50.36 continues from the working 0.50.35 baseline and restores the Home logo/build/settings bar after the clean splash-screen hide fix while preserving the stable startup path.

## Changes

- Visible app version advanced to 0.50.36.
- Cache-busting references updated to 0.50.36.
- Continued from the working 0.50.33 baseline and avoided risky JavaScript feature changes.
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
zip -T firevault-build-0.50.36-modular-root.zip
```

## Suggested commit message

```text
Build 0.50.36 splash top-bar hide and Home safe-area backing repair
```
