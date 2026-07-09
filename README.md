# FireVault Build 0.50.31

Build 0.50.31 continues from the stable Build 0.50.30 baseline and adds a customer photo caption checklist for selected customer-report photos.

## Changes

- Visible app version advanced to 0.50.31.
- Updated cache-busting references in `index.html` to 0.50.31.
- Added **Copy Caption Checklist** inside Customer Report Photos.
- Caption Checklist marks selected photos as **READY** or **NEEDS CAPTION**.
- Caption Checklist includes suggested auto-captions for missing customer captions.
- Preserved Customer Photo Ready Check and Auto-Caption Missing.
- Preserved Customer Photo Captions, Customer Report Photo Selection, Deficiency Photo Workflow, Photo Vault tools, Startup Health diagnostics, 5-second splash screen, iPad autosizing, simple Home screen, and Search Bar Concept #6.
- Did not bring back job-status workflow buttons.

## Validation

```bash
node --check src/storage.js
node --check src/app.js
python3 -m json.tool manifest.json >/dev/null
zip -T firevault-build-0.50.31-modular-root.zip
```

## Suggested commit message

```text
Build 0.50.31 customer photo caption checklist polish
```
