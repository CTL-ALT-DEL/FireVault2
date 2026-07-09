# FireVault Build 0.50.17

Build 0.50.17 continues from the Build 0.50.15 splash timing baseline and polishes the Documents / Photos workflow with Photo Vault filter tabs and faster photo download actions.

## Changes

- Visible app version advanced to 0.50.17.
- Updated cache-busting references in `index.html` to 0.50.17.
- Added Photo Vault filter tabs: All, Photos, Links, and Docs.
- Added live counts on each Photo Vault filter tab.
- Added a quick Original download action directly from saved photo records.
- Preserved Preview Overlay, Download With Overlay, Download Original, and custom overlay logo support.
- Preserved controlled splash-screen timing and the startup watchdog.
- Preserved iPad autosizing, the simple Home screen, and Search Bar Concept #6.
- Did not bring back job-status workflow buttons.

## Validation

Run these checks before deploying:

```bash
node --check src/storage.js
node --check src/app.js
python -m json.tool manifest.json
zip -T firevault-build-0.50.17-modular-root.zip
```

Suggested commit message:

```text
Build 0.50.17 five second splash timing
```
