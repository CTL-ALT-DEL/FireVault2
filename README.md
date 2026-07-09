# FireVault Build 0.50.20

Build 0.50.20 continues from the working Build 0.50.19 baseline and adds startup health diagnostics while preserving the stable boot repair, 5-second splash screen, Photo Vault workflow, simple Home screen, Search Bar Concept #6, and iPad autosizing.

## Changes

- Visible app version advanced to 0.50.20.
- Updated cache-busting references in `index.html` to 0.50.20.
- Added Startup Health diagnostics in the Diagnostics screen.
- Startup Health shows module-ready status, boot status, last good boot time, last boot build, last route, splash timing, and last startup error.
- Added Copy Startup Health for easier troubleshooting if a future PWA boot problem appears.
- Recorded the last successful boot build and route locally after the app opens cleanly.
- Preserved the Safari EOF startup repair from Build 0.50.19.
- Preserved the 5-second splash screen timing.
- Preserved Photo Vault filters, Photo Overlay tools, custom overlay logo support, iPad autosizing, the simple Home screen, and Search Bar Concept #6.
- Did not bring back Start Job / End Job / Arrived / Working / Complete workflow buttons.

## Validation

Run these checks before publishing:

```bash
node --check src/storage.js
node --check src/app.js
python -m json.tool manifest.json > /dev/null
zip -T firevault-build-0.50.20-modular-root.zip
```

## Suggested commit message

```text
Build 0.50.20 startup health diagnostics polish
```
