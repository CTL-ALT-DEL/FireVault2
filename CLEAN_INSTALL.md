# FireVault Build 0.80.1 — Deployment Notes

## Update procedure

Deploy this package over the existing FireVault GitHub Pages files. Do not delete the current FireVault Home Screen app or clear browser storage before updating.

## Data preservation

Build 0.80.1 preserves the existing `firevault_vault_build_030` storage key. Existing accounts, notes, photos, scanned documents, Building Navigator locations, settings, backups, and security metadata remain in place.

## After deployment

Open FireVault while online once so the service worker can download Build 0.80.1. If the older build remains visible, close FireVault completely and reopen it. Use Tools → Backup & Data before any future reinstall or device migration.
