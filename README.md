# FireVault Build 0.50.28

Build 0.50.28 continues from the stable Build 0.50.27 baseline and adds Customer Photo Captions for report-ready photo descriptions without changing the stable startup path.

## Changes

- Visible app version advanced to 0.50.28.
- Updated cache-busting references in `index.html` to 0.50.28.
- Added a Customer Photo Caption field on account photo records.
- Customer captions appear in Customer Report Photo lists and generated customer report text.
- Copy Photo List now includes customer captions.
- Full-screen photo preview now separates Customer Caption from internal technician notes.
- Photo Vault search and copied document lists now include customer captions.
- Preserved the stable startup path, 5-second splash screen, Startup Health diagnostics, Photo Vault search/sort/filter tools, Deficiency Photo Workflow, Photo Overlay tools, iPad autosizing, the simple Home screen, and Search Bar Concept #6.
- Did not bring back Start Job / End Job / Arrived / Working / Complete workflow buttons.

## Validation

Run these checks after extracting the ZIP:

```bash
node --check src/storage.js
node --check src/app.js
python -m json.tool manifest.json >/dev/null
zip -T firevault-build-0.50.28-modular-root.zip
```

## Suggested commit message

```text
Build 0.50.28 customer photo caption polish
```
