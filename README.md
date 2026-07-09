# FireVault Build 0.50.29

Build 0.50.29 continues from the stable Build 0.50.28 baseline and adds a cleaner customer-facing photo summary workflow without changing the stable startup path.

## Changes

- Visible app version advanced to 0.50.29.
- Updated cache-busting references in `index.html` to 0.50.29.
- Added **Copy Customer Summary** inside Customer Report Photos.
- Customer photo summary uses customer-facing captions and avoids internal technician notes.
- Added a **Captioned** count to the Customer Report Photos stats.
- Preserved Customer Photo Captions, Customer Report Photo Selection, Deficiency Photo Workflow, Photo Vault search/sort/filter tools, Photo Overlay tools, Startup Health diagnostics, the 5-second splash screen, iPad autosizing, the simple Home screen, and Search Bar Concept #6.
- Did not bring back Start Job / End Job / Arrived / Working / Complete workflow buttons.

## Validation

Run these checks after extracting the ZIP:

```bash
node --check src/storage.js
node --check src/app.js
python -m json.tool manifest.json >/dev/null
zip -T firevault-build-0.50.29-modular-root.zip
```

## Suggested commit message

```text
Build 0.50.29 customer photo summary polish
```
