# Clean Install Notes — FireVault Build 0.50.51

This ZIP is intended to be used as the new clean baseline for FireVault Build 0.50.51.

## Install

1. Extract the ZIP.
2. Upload the extracted root contents to the GitHub Pages branch/root.
3. Confirm `index.html`, `manifest.json`, `src/`, and `assets/` are at the web root.
4. Hard refresh the browser or clear the PWA cache if needed.

## Build focus

Build 0.50.51 continues from the stable 0.50.50 baseline and moves Add Site to the top of the Home screen.

## Notes

- Uses the stable 0.50.43 baseline.
- Keeps the 5-second splash screen.
- Keeps the fixed top header behavior.
- Keeps Home simple.
- Does not reintroduce job-status workflow buttons.

## Build 0.50.51 highlights

- Built from the stable 0.50.46 baseline.
- Removed the splash loading bar/ember entirely.
- Preserved the 0.50.46 Home layout fixes.
- Preserved fixed splash/header behavior and the 5-second splash screen.

## Build 0.50.51 note

- Repairs the 0.50.47 splash flame animation by separating travel movement from flame flicker so Safari/PWA does not cancel the movement.

## Build 0.50.51 note

- Replaces the unreliable left/right scrolling loader with a stable pulsing ember animation that should work better in iPhone PWA/Safari.

## Build 0.50.51 note

- Moves the red Add Site button to the right side of the Today/date row.
- Removes the bottom floating Add Site button so it can no longer be blocked by the bottom navigation.

## Build 0.50.51 note

- Add Site is now on the top-right of the Home screen across from Today/date.
- The bottom floating red button has been removed.
