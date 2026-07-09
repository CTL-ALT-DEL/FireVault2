# FireVault Build 0.50.22

Build 0.50.22 continues from the stable Build 0.50.21 baseline and adds Photo Vault sorting plus a copyable document/photo index while preserving the stable boot repair, 5-second splash screen, Startup Health diagnostics, Photo Vault search/filter workflow, simple Home screen, Search Bar Concept #6, and iPad autosizing.

## Changes

- Visible app version advanced to 0.50.22.
- Updated cache-busting references in `index.html` to 0.50.22.
- Added Photo Vault sorting:
  - Newest first
  - Photos first
  - Title A-Z
  - Type
- Added **Copy List** on the Document / Photo Vault screen.
- Copy List respects the current search, filter, and sort view.
- Saved document records now store an updated timestamp for cleaner recent sorting.
- Preserved Photo Vault search and filter tabs.
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
zip -T firevault-build-0.50.22-modular-root.zip
```

## Suggested commit message

```text
Build 0.50.22 photo vault sort and copy-list polish
```
