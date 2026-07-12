# FireVault Build 0.79.13 — Startup Repair + Building Navigator
## Startup repair

- Corrects the malformed Revision History array introduced in 0.79.11.
- Corrects the Building Navigator location-copy newline introduced in the first 0.79.12 package.
- Preserves the existing FireVault storage key and account database.


This build adds a dedicated Locations tab to Account Detail for exact site navigation. Technicians can save entrances, fire alarm panels, annunciators, risers, FDCs, pumps, Knox Boxes, electrical rooms, parking, and custom points with GPS, Google Plus Codes, floors, indoor/outdoor status, notes, linked account photos, verification state, navigation, sharing, and a preferred route target. Location changes are recorded in the account timeline. Demo Mode includes sample saved locations.

The existing `firevault_vault_build_030` storage key, security schema 4, accounts, Smart Account Intelligence, backups, Privacy Lock, Security Center, WebDAV, Microsoft storage profiles, backend adapters, and Nearby map hierarchy remain unchanged.