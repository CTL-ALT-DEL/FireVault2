# Clean Install Notes — FireVault Build 0.50.74

This ZIP is intended to be used as the new clean baseline for FireVault Build 0.50.74.

## Install

1. Extract the ZIP.
2. Upload the extracted root contents to the GitHub Pages branch/root.
3. Confirm `index.html`, `manifest.json`, `src/`, and `assets/` are at the web root.
4. Hard refresh the browser or clear the PWA cache if needed.

## Build focus

Build 0.50.74 continues from the stable 0.50.71 baseline and fixes Settings submenu navigation.

## Notes

- Uses the stable 0.50.43 baseline.
- Keeps the 5-second splash screen.
- Keeps the fixed top header behavior.
- Keeps Home simple.
- Does not reintroduce job-status workflow buttons.

## Build 0.50.74 highlights

- Built from the stable 0.50.46 baseline.
- Removed the splash loading bar/ember entirely.
- Preserved the 0.50.46 Home layout fixes.
- Preserved fixed splash/header behavior and the 5-second splash screen.

## Build 0.50.74 note

- Repairs the 0.50.47 splash flame animation by separating travel movement from flame flicker so Safari/PWA does not cancel the movement.

## Build 0.50.74 note

- Replaces the unreliable left/right scrolling loader with a stable pulsing ember animation that should work better in iPhone PWA/Safari.

## Build 0.50.74 note

- Returning from a Settings submenu now restores the Settings main screen and bottom navigation.
- Settings main and submenu screens now include reliable Home buttons.

## Build 0.50.74 note

- Add Site is now on the top-right of the Home screen across from Today/date.
- The bottom floating red button has been removed.

## Build 0.50.74 note

- Use Download Backup before installing future builds or clearing browser data.
- Backup Safety is available from Home and Diagnostics.

## Build 0.50.74 note

- Main-page Settings uses the stacked-lines icon again.
- Backup Safety now includes Copy Update Checklist and a short update-order reminder.

## Build 0.50.74 note

- Restore Center is available from Home and Diagnostics.
- Restoring a backup requires preview and confirmation before local data is overwritten.

## Build 0.50.74 note

- Open a site, go to Report Center, and review the new Customer Report Preview card before copying or downloading the customer closeout packet.

## Build 0.50.74 note

- Open any account to see the new Site Brief card near the top of the site detail screen.
- Use Copy Brief for a quick technician-facing summary of the account.

## Build 0.50.74 note

- Open any account to see recent visits, photos/documents, tasks, and deficiencies in the new Activity Timeline card.

## Build 0.50.74 note

- Open any account and use the new Activity Timeline filters to narrow the recent activity list.

## Build 0.50.74 note

- Open any account and use Show More on the Activity Timeline to expand the recent activity list.

## Build 0.50.74 note

- Home is now more field-focused. Backup, Restore, Diagnostics, Startup Health, Repair Vault, and Update Safety now live in Data Tools.
- Open Data Tools from the compact Data Safe card on Home.

## Build 0.50.74 note

- Home now includes Field Focus below Search so daily field priorities are visible without bringing Backup/Restore clutter back to Home.

## Build 0.50.74 note

- Tap the Field Focus status pill or its priority counts to open Action Center with matching filters.

## Build 0.50.74 note

- Go to Settings → Modules and turn off Field Focus to hide the Home Field Focus dashboard.
- Action Center and its priority tools remain available.

## Build 0.50.74 note

- Go to Settings → Modules to show/hide Field Focus, Data Safe Home Card, Site Brief, and Site Activity Timeline.
- Data Tools now includes a Layout Controls status card.

## Build 0.50.74 note

- Go to Settings → Modules → Quick Layout Presets to change Home/account screen layout with one tap.

## Build 0.50.74 note

- Open an account and tap the star in the account header to pin it to Home.
- Go to Settings → Modules to show or hide Pinned Sites.

## Build 0.50.74 note

- Tap All on the Home Pinned Sites card to open Pinned Sites Manager.
- The manager supports Open, Map, Copy, Unpin, and Unpin All.

## Build 0.50.74 note

- Open any account to see Important Site Info near the top of the account screen.
- Use Copy to copy contact, access, panel, and GPS reference information.

## Build 0.50.74 note

- The Home screen no longer auto-focuses Search on load, which helps prevent the page from parking too low.
- Tap Today/date to choose a date and open that Daily Summary report.

## Build 0.50.74 note

- Home layout has been tightened so Today, Search, Field Focus, Nearby Accounts, and the first stat cards fit more like the intended screenshot.

## Build 0.50.74 note

- Tap Today/date on Home to open the FireVault calendar picker. Bold dates have saved daily activity.

## Build 0.50.74 note

- Open Settings, enter any submenu, and use Back or Home. The navigation bar should remain available.

## Build 0.50.74 note

- The Settings main menu now uses the full usable screen and scrolls normally.
- Settings submenus retain the bottom navigation and provide Back and Home controls.
- The large empty black area caused by nested height and padding calculations has been removed.

## Build 0.50.74 note

- Account/site information screens now stay inside the iPhone viewport.
- Important Site Info uses separate colors for Contact, Access, Panel, and GPS.
- Site Brief statistics use separate colors for quicker field scanning.
