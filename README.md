# FireVault Build 0.50.18

Build 0.50.18 continues from the Build 0.50.17 baseline and repairs the startup/splash watchdog behavior. The 5-second splash screen is preserved, but the watchdog now waits long enough and separates actual module-load failures from the intentional splash delay.

## Changes

- Visible app version advanced to 0.50.18.
- Updated cache-busting references in `index.html` to 0.50.18.
- Fixed the startup watchdog false-positive that could show an error before the 5-second splash completed.
- Kept the splash screen minimum display time at about 5 seconds.
- Added a module-ready flag so a delayed splash is not treated as a failed boot.
- Added safer render error handling after the splash delay.
- Preserved Photo Vault filters, Photo Overlay tools, custom overlay logo support, iPad autosizing, simple Home screen, and Search Bar Concept #6.
- Did not bring back Start Job / End Job / Arrived / Working / Complete workflow.

## Validation

```bash
node --check src/storage.js
node --check src/app.js
python -m json.tool manifest.json
zip -T firevault-build-0.50.18-modular-root.zip
```

## Suggested commit message

```text
Build 0.50.18 startup watchdog and splash timing repair
```
