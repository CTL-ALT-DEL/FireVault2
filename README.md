# FireVault Build 0.50.15

Build 0.50.15 continues from the Build 0.50.14 startup hotfix baseline and adjusts the splash screen timing so the splash screen stays visible long enough to feel intentional instead of flashing for a microsecond.

## Changes

- Visible app version advanced to 0.50.15.
- Updated cache-busting references in `index.html` to 0.50.15.
- Added a controlled minimum splash-screen display time.
- Preserved the 0.50.14 startup watchdog so boot errors still surface instead of silently hanging.
- Preserved Photo Vault overlay preview, Download Original, Download With Overlay, custom logo support, and Photo Overlay settings.
- Preserved iPad autosizing, the simple Home screen, and Search Bar Concept #6.
- Did not bring back job-status workflow buttons.

## Validation

Run these checks before deploying:

```bash
node --check src/storage.js
node --check src/app.js
python -m json.tool manifest.json
zip -T firevault-build-0.50.15-modular-root.zip
```

Suggested commit message:

```text
Build 0.50.15 splash screen timing polish
```
