# Clean Install Notes — FireVault Build 0.50.24

This ZIP is intended to be used as the clean baseline for FireVault Build 0.50.24.

## Install

1. Extract the ZIP.
2. Upload the extracted files to the root of the GitHub Pages branch.
3. Commit all changed files.
4. Wait for GitHub Pages to finish deploying.
5. Open the deployed PWA and confirm the visible build number shows `0.50.24`.
6. On iPhone/iPad, fully close and reopen the Home Screen PWA after deployment so cache-busted files load.

## Build Notes

Build 0.50.24 keeps the working 0.50.23 baseline and polishes account photos:

- Clear Take Photo / Upload Photo wording.
- Photo category buttons for Panel, NAC, Device, Communicator, Battery, Deficiency, Before, After, and Other.
- Use Overlay toggle on account photos.
- Better notes labeling for field photo notes.
- Tap account thumbnails or Photo Vault Preview to open a full photo preview.
- Full preview includes overlay download, original download, and edit actions.
- Photo category badges are shown on thumbnails and Photo Vault rows.
- Startup path, splash timing, Search Bar #6, iPad autosizing, and simple Home screen were preserved.

## Validation Checklist

- `node --check src/storage.js`
- `node --check src/app.js`
- `manifest.json` JSON validation
- ZIP integrity test
- Extracted ZIP validation
