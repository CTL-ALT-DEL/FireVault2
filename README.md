# FireVault Build 0.50.30

Build 0.50.30 continues from the stable Build 0.50.29 baseline and adds Customer Photo Ready Check plus Auto-Caption Missing for customer-report photos.

## Changes

- Visible app version advanced to 0.50.30.
- Updated cache-busting references in `index.html` to 0.50.30.
- Added Customer Photo Ready Check in Report Center.
- Added Auto-Caption Missing for selected customer-report photos without customer captions.
- Added Needs Caption indicators on selected report photos.
- Added Ready / Needs Review status inside Customer Report Photos.
- Preserved Customer Photo Captions, Customer Report Photo Selection, Deficiency Photo Workflow, Photo Vault tools, Startup Health diagnostics, 5-second splash screen, iPad autosizing, simple Home screen, and Search Bar Concept #6.
- Did not bring back job-status workflow buttons.

## Validation

```bash
node --check src/storage.js
node --check src/app.js
python3 -m json.tool manifest.json >/dev/null
zip -T firevault-build-0.50.30-modular-root.zip
```

## Suggested commit message

```text
Build 0.50.30 customer photo ready check polish
```
