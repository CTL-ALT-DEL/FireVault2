# FireVault Build 0.50.23

Build 0.50.23 continues from the stable Build 0.50.22 baseline and makes adding photos to an account obvious. The Photo Vault tools are now surfaced directly on the account/site screen instead of being hidden under Documents.

## Changes

- Visible app version advanced to 0.50.23.
- Updated cache-busting references in `index.html` to 0.50.23.
- Added a visible **Account Photos** card directly on each account/site screen.
- Added direct **Add Photo** button from the account screen.
- Added direct **Photo Vault** button from the account screen.
- Added photo thumbnail strip for the latest saved account photos.
- Updated the Documents / Photos screen with clear **Add Photo** and **Add Document / Link** buttons.
- New photo records now default to **Photo Set** and use an **Add Account Photo** form title.
- Preserved Photo Vault search, filters, sorting, Copy List, overlay preview, Download With Overlay, and Download Original.
- Preserved Startup Health diagnostics and the 5-second splash screen.
- Preserved the stable Safari EOF boot repair.
- Preserved Photo Overlay tools and custom overlay logo support.
- Preserved iPad autosizing, simple Home screen, and Search Bar Concept #6.
- Did not bring back job-status workflow controls.

## Validation

- `node --check src/storage.js`
- `node --check src/app.js`
- `manifest.json` JSON validation
- ZIP integrity test:

```bash
zip -T firevault-build-0.50.23-modular-root.zip
```

## Suggested commit message

```text
Build 0.50.23 account photo entry point polish
```
