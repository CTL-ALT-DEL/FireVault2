# Clean Install Notes — FireVault Build 0.50.46

This ZIP is intended to be used as the new clean baseline for FireVault Build 0.50.46.

## Install

1. Extract the ZIP.
2. Upload the extracted root contents to the GitHub Pages branch/root.
3. Confirm `index.html`, `manifest.json`, `src/`, and `assets/` are at the web root.
4. Hard refresh the browser or clear the PWA cache if needed.

## Build focus

Build 0.50.46 rebuilds from the stable 0.50.44 baseline after the 0.50.45 EOF issue and fixes the Home layout.

## Notes

- Uses the stable 0.50.43 baseline.
- Keeps the 5-second splash screen.
- Keeps the fixed top header behavior.
- Keeps Home simple.
- Does not reintroduce job-status workflow buttons.

## Build 0.50.46 highlights

- Rebuilt from the last working 0.50.44 baseline because 0.50.45 had an EOF startup error.
- Lifted the floating **Add Account** button above the bottom navigation so it no longer hides behind the black bottom bar.
- Moved the **Today / current date** block closer to the top of the Home screen.
- Preserved fixed splash/header behavior and the 5-second splash screen.
