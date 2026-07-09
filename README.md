# FireVault Build 0.50.25

Build 0.50.25 continues from the stable Build 0.50.24 baseline and adds a focused Deficiency Photo Workflow so field photos can be linked directly to deficiencies without burying them in the general Photo Vault.

## Changes

- Visible app version advanced to 0.50.25.
- Updated cache-busting references in `index.html` to 0.50.25.
- Added linked Deficiency Photos from the Deficiency Center and Deficiency form.
- Added `Save + Add Photo` on the Deficiency form.
- Added `+ Photo` quick action on deficiency cards.
- Added deficiency photo thumbnail strips on deficiency cards and the deficiency edit screen.
- Deficiency photos open the same full-screen photo preview used by Account Photos.
- Deficiency-linked photos are saved into the site Photo Vault with category `Deficiency` and linked deficiency metadata.
- Photo Vault search now includes linked deficiency titles and IDs.
- Preserved Account Photo categories, full photo preview, Photo Vault search/sort/filter tools, overlay exports, custom overlay logo support, Startup Health, the 5-second splash screen, iPad autosizing, the simple Home screen, and Search Bar Concept #6.
- Did not bring back Start Job / End Job / Arrived / Working / Complete workflow buttons.

## Validation

```bash
node --check src/storage.js
node --check src/app.js
python -m json.tool manifest.json
zip -T firevault-build-0.50.25-modular-root.zip
```

## Suggested commit message

```text
Build 0.50.25 deficiency photo workflow
```
