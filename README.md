# FireVault Build 0.50.19

Build 0.50.19 continues from the Build 0.50.18 baseline and is a focused startup repair build.

## What changed

- Visible app version advanced to 0.50.19.
- Updated cache-busting references in `index.html` to 0.50.19.
- Fixed the Photo Vault document-list newline syntax pattern that caused Safari/PWA `SyntaxError: Unexpected EOF` on app load.
- Rebuilt the document/photo list rendering into a safer helper function.
- Kept the splash screen minimum display time at about 5 seconds.
- Preserved the startup watchdog and module-ready handling.
- Preserved Photo Vault filters, Photo Overlay tools, custom overlay logo support, iPad autosizing, the simple Home screen, and Search Bar Concept #6.
- Did not restore Start Job / End Job / Arrived / Working / Complete workflow controls.

## Validation

```bash
node --check src/storage.js
node --check src/app.js
python -m json.tool manifest.json
zip -T firevault-build-0.50.19-modular-root.zip
```

Additional validation: checked that the bad `split("` newline pattern is no longer present in `src/app.js`.

## Suggested commit message

```text
Build 0.50.19 Safari EOF startup repair
```
