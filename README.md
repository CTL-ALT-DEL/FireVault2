# FireVault Build 0.50.13

Build 0.50.13 continues from the uploaded 0.50.12 baseline and polishes the Photo Vault / overlay export workflow while preserving the simple Home screen, Search Bar Concept #6, Daily Report / Site Notes workflow, and iPad responsive sizing.

## Build updates

- Visible app version advanced to 0.50.13.
- Updated cache-busting references in `index.html` to 0.50.13.
- Updated `manifest.json`, README, clean install notes, and in-app release notes.
- Added **Preview Overlay** on the Site Documents / Photos document screen.
- Added **Download Original** next to **Download With Overlay**.
- Overlay preview uses the current Photo Overlay settings, including template fields, logo source, position, size, background, opacity, colors, and tagline.
- Changing or clearing the selected photo now clears the old overlay preview so the preview stays accurate.
- Preserved the 0.50.12 Photo Vault upload, saved thumbnails, and overlay export workflow.
- Preserved the simple Home screen, Search Bar Concept #6, iPad autosizing, and advanced-module visibility rules.
- No Start Job / End Job / Arrived / Working / Complete workflow was added back.

## Validation

Run from the extracted ZIP root:

```bash
node --check src/storage.js
node --check src/app.js
python -m json.tool manifest.json >/dev/null
zip -T firevault-build-0.50.13-modular-root.zip
```

## Suggested commit message

```text
Build 0.50.13 photo vault overlay preview polish
```
