# FireVault Build 0.79.14 — Numbered Nearby Accounts

## Nearby Accounts restored

- Restores one numbered map pin for every nearby account.
- Map pin numbers match the numbered account rows exactly.
- Numbering follows the existing distance-sorted Nearby Accounts list.
- Keeps Account IDs, communicator categories, filters, Map/List views, routing, calling, GPS refresh, and selected-account focus.
- Removes the newer single-dot, same-address count, and area-cluster marker hierarchy.

## Smart Account Intelligence removed

- Removes account completeness scoring and Account Health score badges.
- Removes the Data Quality settings page, priority list, downloadable quality report, snapshot integration, and diagnostics checks.
- Removes the retired `dataQuality` settings object during normalization without changing account records.

## Preserved

Building Navigator, exact site locations, Plus Codes, linked photos, preferred route targets, security schema 4, backups, Privacy Lock, Security Center, OneDrive/SharePoint profiles, backend adapters, and the existing `firevault_vault_build_030` storage key remain intact.
