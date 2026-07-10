# Clean Install Notes — FireVault Build 0.50.62

This ZIP is intended to be used as the new clean baseline for FireVault Build 0.50.62.

## Install

1. Extract the ZIP.
2. Upload the extracted root contents to the GitHub Pages branch/root.
3. Confirm `index.html`, `manifest.json`, `src/`, and `assets/` are at the web root.
4. Hard refresh the browser or clear the PWA cache if needed.

## Build focus

Build 0.50.62 continues from the stable 0.50.61 baseline and adds Action Center.

## Notes

- Uses the stable 0.50.43 baseline.
- Keeps the 5-second splash screen.
- Keeps the fixed top header behavior.
- Keeps Home simple.
- Does not reintroduce job-status workflow buttons.

## Build 0.50.62 highlights

- Built from the stable 0.50.46 baseline.
- Removed the splash loading bar/ember entirely.
- Preserved the 0.50.46 Home layout fixes.
- Preserved fixed splash/header behavior and the 5-second splash screen.

## Build 0.50.62 note

- Repairs the 0.50.47 splash flame animation by separating travel movement from flame flicker so Safari/PWA does not cancel the movement.

## Build 0.50.62 note

- Replaces the unreliable left/right scrolling loader with a stable pulsing ember animation that should work better in iPhone PWA/Safari.

## Build 0.50.62 note

- Adds Action Center for overdue tasks, due-today tasks, deficiencies, report photo review items, and attention sites.
- Adds Copy Action Center in Data Tools and corrects Field Focus due/overdue counts.

## Build 0.50.62 note

- Add Site is now on the top-right of the Home screen across from Today/date.
- The bottom floating red button has been removed.

## Build 0.50.62 note

- Use Download Backup before installing future builds or clearing browser data.
- Backup Safety is available from Home and Diagnostics.

## Build 0.50.62 note

- Main-page Settings uses the stacked-lines icon again.
- Backup Safety now includes Copy Update Checklist and a short update-order reminder.

## Build 0.50.62 note

- Restore Center is available from Home and Diagnostics.
- Restoring a backup requires preview and confirmation before local data is overwritten.

## Build 0.50.62 note

- Open a site, go to Report Center, and review the new Customer Report Preview card before copying or downloading the customer closeout packet.

## Build 0.50.62 note

- Open any account to see the new Site Brief card near the top of the site detail screen.
- Use Copy Brief for a quick technician-facing summary of the account.

## Build 0.50.62 note

- Open any account to see recent visits, photos/documents, tasks, and deficiencies in the new Activity Timeline card.

## Build 0.50.62 note

- Open any account and use the new Activity Timeline filters to narrow the recent activity list.

## Build 0.50.62 note

- Open any account and use Show More on the Activity Timeline to expand the recent activity list.

## Build 0.50.62 note

- Home is now more field-focused. Backup, Restore, Diagnostics, Startup Health, Repair Vault, and Update Safety now live in Data Tools.
- Open Data Tools from the compact Data Safe card on Home.

## Build 0.50.62 note

- Home now includes Field Focus below Search so daily field priorities are visible without bringing Backup/Restore clutter back to Home.

## Build 0.50.62 note

- Tap the Field Focus status pill or its priority counts to open Action Center with matching filters.
