# Clean Install — Build 0.91.0

1. Back up FireVault before replacing the published files.
2. Replace the previously published FireVault files with this complete package, including `src/media-store.js`.
3. Commit and publish the full folder.
4. Open FireVault online once so the new service worker installs.
5. Reload the installed Home Screen app.
6. Allow the first launch to finish migrating existing photos and legacy scanned pages.
7. Open Settings → Data & Backup → File Storage and verify the Media Storage Health card.
8. Confirm existing account photos, Building Navigator linked photos, old scanned PDFs, manual backup, and WebDAV backup.

The main storage key remains `firevault_vault_build_030`. Do not clear Safari website data during migration.
