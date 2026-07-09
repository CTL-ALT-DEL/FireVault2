# FireVault Build 0.50.21

Build 0.50.21 continues from the stable Build 0.50.20 baseline and adds Photo Vault search while preserving the stable boot repair, 5-second splash screen, Startup Health diagnostics, Photo Vault workflow, simple Home screen, Search Bar Concept #6, and iPad autosizing.

## Changes

- Visible app version advanced to 0.50.21.
- Updated cache-busting references in `index.html` to 0.50.21.
- Added Photo Vault search for photos, links, documents, references, and notes.
- Added Clear search action on the Site Documents / Photos screen.
- Preserved Photo Vault filter tabs and live counts.
- Preserved Startup Health diagnostics without touching the stable startup path.
- Preserved the 5-second splash screen and Safari EOF startup repair.
- Preserved Photo Overlay tools and custom overlay logo support.
- Kept Home simple and preserved Search Bar Concept #6.
- Did not restore Start Job / End Job / Arrived / Working / Complete workflow buttons.

## Validation

```bash
node --check src/storage.js
node --check src/app.js
python -m json.tool manifest.json
zip -T firevault-build-0.50.21-modular-root.zip
```

## Suggested commit message

```text
Build 0.50.21 photo vault search polish
```
