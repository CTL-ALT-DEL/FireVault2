# Clean Install Notes — FireVault Build 0.50.29

This ZIP is intended to be used as the clean baseline for FireVault Build 0.50.29.

## Install

1. Extract the ZIP.
2. Upload the extracted root files to the FireVault GitHub Pages branch/root.
3. Commit all files together.
4. Wait for GitHub Pages deployment to finish.
5. Open the deployed PWA and confirm the visible build number shows `0.50.29`.
6. On iPhone/iPad, refresh or reinstall the home-screen PWA if Safari keeps an older cached build.

## Build focus

Build 0.50.29 keeps the stable 0.50.28 startup path and improves customer-facing photo summaries:

- Add Copy Customer Summary from Customer Report Photos.
- Use customer captions in the copied summary.
- Keep internal technician notes out of the customer-facing summary.
- Add a Captioned count to the photo report stats.

## Safety notes

- The startup path was not intentionally changed.
- The 5-second splash timing is preserved.
- Search Bar Concept #6 is preserved.
- Home screen remains simple.
- Job-status workflow buttons were not restored.
