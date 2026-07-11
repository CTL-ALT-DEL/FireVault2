# FireVault Build 0.72.3

## Automatic Backup Safety

- Creates rolling safety snapshots automatically before and after vault changes.
- Keeps up to three recent snapshots to reduce local-storage pressure on iPhone.
- Preserves the live vault first if storage space becomes limited.
- Adds Download Latest and Restore Latest controls in Settings → Data, Sync & Support → Backup.
- Accepts both traditional FireVault backups and wrapped automatic-snapshot files during import.
- Keeps the existing FireVault storage key and account database format.

Important: automatic snapshots live inside the installed PWA. Download a backup before deleting or reinstalling the Home Screen app.

## Build 0.72.3 — Compact map label and component foundation

- Replaces the unrelated grey map-control cover with a compact translucent badge that sizes itself only to the selected site name and address.
- Keeps white text and strong black shadow for map readability.
- Introduces shared FireVault control variables for height, radius, border, background, active state, and shadow.
- Applies the first shared control treatment to Nearby Map/List, Filter, and dynamic bottom navigation buttons.

Nearby Accounts category and header redesign.


## Build 0.72.3 — Nearby control and navigation refinement

- Removes the black background box, border, blur, and panel shadow from the selected-account overlay.
- Displays the selected account name and address as white text with a strong black outline/shadow for map readability.
- Keeps the text anchored at the top-left and gives it nearly the full available map width.

- Removes the Home build badge and top Settings icon.
- Displays right-aligned TODAY, weekday, and date.
- Retires the floating blue Help circle while preserving FireVault Academy in Settings.
- Removes the map +/− and reset controls.
- Adds a compact All / Basic / CLSS / AlarmNet / IPDACT filter.
- Categorizes Account IDs as follows: G7C = CLSS, AN = AlarmNet, VA1 = IPDACT, and all remaining IDs = Basic.
- Uses category colors consistently on account rows, Account IDs, and map markers.
- Preserves the 25-mile list, adaptive radius, street-level account focus, glowing green selection, and Open / Route / Call actions.



## Build 0.71.4 — Nearby header and refresh controls

- Moves the selected account name/address overlay to the top-left of the street-level map, giving it more usable width.
- Repairs the Nearby Accounts top row so the MAP / LIST selector remains visible on narrow phones.
- Replaces the visible selected-category dropdown with a compact filter icon while preserving All, Basic, CLSS, AlarmNet, and IPDACT choices.
- Makes the bottom Nearby navigation button request a fresh GPS position and redraw the map, matching the top refresh button.

## Build 0.71.3 — Nearby startup repair

- Moves the imported Account ID to the bottom metadata line, directly before the category badge.
- Keeps account name, address, ID, category, and Plus Code left aligned.
- Shows the selected account name and address in a left-aligned map overlay during street-level focus.
- Adds breathing room between the FireVault logo header, Nearby heading, and map workspace.


## Inherited from Build 0.71.0 — Plus Codes and exact site locations
- Permanently removes the top Build and Settings controls and replaces them with the right-aligned current day/date.
- Automatically generates a full Plus Code for every account that has latitude/longitude.
- Adds account location points for entrances, parking, exterior doors, riser rooms, panels, FDCs, and other field locations.
- Allows technicians to drop a GPS pin, save notes, copy the Plus Code, select the default route destination, and navigate with Google Maps.
- Nearby Route now uses the account's preferred Plus Code location when available.


## Repair note
- Removed the duplicate `const row` declaration that prevented the JavaScript module from loading on Safari/iPhone.
- Preserved the 0.71.2 Nearby layout changes.


## Build 0.72.3
- Added versioned service-worker caching and automatic old-cache cleanup.
- HTML, manifest, and version checks use network-first/no-store behavior.
- New service workers activate immediately and notify open app windows.
- Added Settings > Data, Sync & Support > App Updates.
- Added Check for Updates, Clear App Cache, and Reload FireVault controls.
- FireVault local vault storage remains unchanged.


## Build 0.72.3 vault protection
- Scans FireVault local-storage records and restores the populated vault with the highest account count.
- Maintains a recovery copy of the last populated vault.
- Blocks automatic startup migrations from replacing a populated vault with an empty database.


## Build 0.72.3
- Requests portrait-primary orientation for the installed PWA and retries the runtime portrait lock when supported.
- Changes selected Nearby accounts from neon green to a darker field-friendly green.
- Splash status now reports database verification and latest-version checking.
