# FireVault Build 0.50.27

Build 0.50.27 continues from the stable Build 0.50.26 baseline and polishes Customer Report Photo Selection inside Report Center without changing the stable startup path.

## Changes

- Visible app version advanced to 0.50.27.
- Updated cache-busting references in `index.html` to 0.50.27.
- Added Select All for customer report photos.
- Added Clear Selected for customer report photos.
- Added Copy Photo List for the selected customer-report photo set.
- Added selected-photo summary stats for included photos, deficiency photos, and before/after photos.
- Added selected-photo thumbnail strip that opens the full photo preview.
- Preserved the stable startup path, 5-second splash screen, Startup Health diagnostics, Photo Vault search/sort/filter tools, Deficiency Photo Workflow, Photo Overlay tools, iPad autosizing, the simple Home screen, and Search Bar Concept #6.
- Did not bring back Start Job / End Job / Arrived / Working / Complete workflow buttons.

## Validation

Run these checks after extracting the ZIP:

```bash
node --check src/storage.js
node --check src/app.js
python -m json.tool manifest.json >/dev/null
zip -T firevault-build-0.50.27-modular-root.zip
```

## Suggested commit message

```text
Build 0.50.27 customer report photo selection polish
```
