# Clean Install Notes — FireVault Build 0.50.28

This ZIP is intended to be used as the clean baseline for FireVault Build 0.50.28.

## Install

1. Extract the ZIP.
2. Upload the extracted root files to the FireVault GitHub Pages branch/root.
3. Commit all files together.
4. Wait for GitHub Pages deployment to finish.
5. Open the deployed PWA and confirm the visible build number shows `0.50.28`.
6. On iPhone/iPad, refresh or reinstall the home-screen PWA if Safari keeps an older cached build.

## Build focus

Build 0.50.28 keeps the stable 0.50.27 startup path and adds customer-facing photo captions:

- Add a Customer Photo Caption on account photos.
- Keep internal technician notes separate from customer-facing captions.
- Include captions in customer report photo lists and generated report text.
- Include captions in Photo Vault search and copied document/photo lists.
- Show captions in the full-screen photo preview.

## Safety notes

- The startup path was not intentionally changed.
- The 5-second splash timing is preserved.
- Search Bar Concept #6 is preserved.
- Home screen remains simple.
- Job-status workflow buttons were not restored.
