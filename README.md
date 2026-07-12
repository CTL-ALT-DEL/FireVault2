# FireVault Build 0.79.10 — Accounts Card Hierarchy Polish

## Changes

- Moved the Favorite star to the far-right side of each Accounts card title row.
- Moved the built-in account category badge into the lower status row.
- Moved automatic custom category tags into the same row as GPS Ready / Needs GPS.
- Preserved account opening, Favorites, Call, Route, search, sorting, and locked-list scrolling.
- No vault or storage-key changes.


This release removes unnecessary summary controls from the Accounts and Nearby GPS workflows.

## Accounts directory

- Removes the four filter tiles: All, Attention, Open Work, and No GPS.
- Keeps search, Jump To, Sort By, Favorites, Call, Route, and locked list scrolling.
- Clears any older saved filter selection so all accounts appear automatically.
- Expands the account list into the space previously used by the filter tiles.

## Nearby GPS comparison

- Removes the Total Accounts, GPS Ready, and Missing GPS counters.
- Removes the Location Comparison Complete message after a successful scan.
- Keeps Scan/Refresh, permission and error guidance, distance results, radius behavior, and nearest-account fallback.

## Preserved

- Existing `firevault_vault_build_030` storage key
- Security schema 4 and all account data
- Demo Mode, automatic snapshots, Privacy Lock, and Security Center
- WebDAV, Microsoft storage profiles, Plus Codes, and backend adapters

Deploy over the existing FireVault installation. Do not delete or reinstall the Home Screen PWA.