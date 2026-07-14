# FireVault Build 0.91.0

Media-storage reliability release built from the 0.90.0 core-cleanup baseline.

## Included
- Account photos and legacy scanned-page images are moved from the main localStorage vault into IndexedDB.
- Existing inline Base64 photos migrate automatically without changing account IDs or the FireVault storage key.
- Runtime media cache keeps photos available after normal account and Settings saves.
- Manual backup, Shared Vault package export, and WebDAV backup include complete photo and scanned-page payloads.
- Settings → Data & Backup → File Storage now includes media size, device quota, persistent-storage status, and orphan cleanup.
- New photos are written to IndexedDB before the account record is finalized.
- Automatic local snapshots remain lightweight metadata snapshots that reference the on-device media store.

Open `index.html` through HTTPS or deploy the complete folder to GitHub Pages.
