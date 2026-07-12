# FireVault Build 0.79.6 — Accounts Scrolling Lock

This release applies the stable Nearby Accounts scrolling behavior to the main Accounts directory.

## Accounts scrolling lock

- The Accounts title, search, filters, result summary, Jump To, and Sort By controls stay fixed in place.
- Only the account-card list scrolls.
- After a finger or mouse-wheel scroll ends, the closest visible account card settles cleanly at the top of the list area.
- A protected tail spacer allows the final account card to reach the same top position without changing card heights.
- The implementation uses JavaScript settling rather than CSS scroll snapping, avoiding the card-collapse problem from the earlier snap experiment.
- Search, filters, Jump To, Sort By, Favorites, Call, Route, Top, and restored list position remain supported.

## Preserved

- Existing `firevault_vault_build_030` storage key
- Security schema 4
- Account data and view-state memory
- Demo Mode, automatic snapshots, Privacy Lock, and Security Center
- WebDAV and Microsoft storage-account foundation
- Google Plus Codes and backend adapters

Deploy over the existing FireVault installation. Do not delete or reinstall the Home Screen PWA.
