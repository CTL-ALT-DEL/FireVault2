# FireVault Build 0.50.24

Build 0.50.24 continues from the stable Build 0.50.23 baseline and polishes the Account Photo workflow so adding, categorizing, previewing, and exporting photos is more obvious in the field.

## Changes

- Visible app version advanced to 0.50.24.
- Updated cache-busting references in `index.html` to 0.50.24.
- Added clearer **Take Photo / Upload Photo** wording to the Add Account Photo form.
- Added photo category buttons: Panel, NAC, Device, Communicator, Battery, Deficiency, Before, After, and Other.
- Added a **Use Overlay** toggle for saved account photos.
- Improved photo notes labeling so field notes sit directly with the photo workflow.
- Added full-screen photo preview from account thumbnails and Photo Vault records.
- Full photo preview includes Download With Overlay, Download Original, and Edit Photo actions.
- Added category badges to account photo thumbnails and Photo Vault rows.
- Preserved Photo Vault search, filters, sorting, Copy List, overlay preview, Download With Overlay, and Download Original.
- Preserved Startup Health diagnostics, 5-second splash timing, and the stable Safari EOF startup repair.
- Preserved Photo Overlay tools and custom overlay logo support.
- Kept the Home screen simple.
- Preserved Search Bar Concept #6.
- Preserved iPad autosizing.
- Did not bring back job-status workflow controls.

## Validation

Run from the repository root:

```bash
node --check src/storage.js
node --check src/app.js
python -m json.tool manifest.json >/dev/null
zip -T firevault-build-0.50.24-modular-root.zip
```

## Suggested Commit Message

```text
Build 0.50.24 account photo category and preview polish
```
