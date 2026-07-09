# FireVault Build 0.50.14

Build 0.50.14 continues from the uploaded 0.50.13 baseline and fixes a blocking startup issue that could leave the app stuck on the splash screen. It preserves the Photo Vault overlay preview, Download Original, Photo Overlay settings, simple Home screen, Search Bar Concept #6, and iPad autosizing.

## Changes

- Visible app version advanced to 0.50.14.
- Updated cache-busting references in `index.html` to 0.50.14.
- Fixed the Photo Vault overlay preview line-break handling that prevented the app module from booting.
- Added a stronger splash-screen watchdog so startup errors are displayed instead of silently leaving the splash screen visible.
- Preserved Build 0.50.13 Photo Vault overlay preview and Download Original features.
- Preserved the simple Home screen, Search Bar Concept #6, iPad autosizing, and hidden advanced modules behavior.
- Did not add Start Job / End Job / Arrived / Working / Complete workflow controls.

## Validation

```bash
node --check src/storage.js
node --check src/app.js
python -m json.tool manifest.json >/dev/null
zip -T firevault-build-0.50.14-modular-root.zip
```

## Suggested commit message

```text
Build 0.50.14 splash screen startup hotfix
```
