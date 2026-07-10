# Clean Install Notes — FireVault Build 0.50.53

This ZIP is intended to be used as the new clean baseline for FireVault Build 0.50.53.

## Install

1. Extract the ZIP.
2. Upload the extracted root contents to the GitHub Pages branch/root.
3. Confirm `index.html`, `manifest.json`, `src/`, and `assets/` are at the web root.
4. Hard refresh the browser or clear the PWA cache if needed.

## Build focus

Build 0.50.53 continues from the stable 0.50.52 baseline, restores the stacked-lines main Settings icon, and adds an update checklist to Backup Safety.

## Notes

- Uses the stable 0.50.43 baseline.
- Keeps the 5-second splash screen.
- Keeps the fixed top header behavior.
- Keeps Home simple.
- Does not reintroduce job-status workflow buttons.

## Build 0.50.53 highlights

- Built from the stable 0.50.46 baseline.
- Removed the splash loading bar/ember entirely.
- Preserved the 0.50.46 Home layout fixes.
- Preserved fixed splash/header behavior and the 5-second splash screen.

## Build 0.50.53 note

- Repairs the 0.50.47 splash flame animation by separating travel movement from flame flicker so Safari/PWA does not cancel the movement.

## Build 0.50.53 note

- Replaces the unreliable left/right scrolling loader with a stable pulsing ember animation that should work better in iPhone PWA/Safari.

## Build 0.50.53 note

- Changes the main-page Settings gear back to a stacked-lines menu icon.
- Adds Copy Update Checklist to Backup Safety.

## Build 0.50.53 note

- Add Site is now on the top-right of the Home screen across from Today/date.
- The bottom floating red button has been removed.

## Build 0.50.53 note

- Use Download Backup before installing future builds or clearing browser data.
- Backup Safety is available from Home and Diagnostics.

## Build 0.50.53 note

- Main-page Settings uses the stacked-lines icon again.
- Backup Safety now includes Copy Update Checklist and a short update-order reminder.
