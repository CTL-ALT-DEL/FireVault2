# FireVault Build 0.71.2

Nearby Accounts category and header redesign.

- Removes the Home build badge and top Settings icon.
- Displays right-aligned TODAY, weekday, and date.
- Retires the floating blue Help circle while preserving FireVault Academy in Settings.
- Removes the map +/− and reset controls.
- Adds a compact All / Basic / CLSS / AlarmNet / IPDACT filter.
- Categorizes Account IDs as follows: G7C = CLSS, AN = AlarmNet, VA1 = IPDACT, and all remaining IDs = Basic.
- Uses category colors consistently on account rows, Account IDs, and map markers.
- Preserves the 25-mile list, adaptive radius, street-level account focus, glowing green selection, and Open / Route / Call actions.


## Build 0.71.2 — Nearby readability refinement

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
