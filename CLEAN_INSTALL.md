# FireVault Build 0.80.2 — Deployment Notes

1. Commit every file in this package to the FireVault repository.
2. Wait for GitHub Pages deployment to finish.
3. Open FireVault once while online so the service worker can cache Build 0.80.2.
4. Close and reopen the installed PWA if the previous build remains visible.
5. On the first AI Auto Scan, allow camera permission when prompted.

Build 0.80.2 preserves the existing `firevault_vault_build_030` storage key and all existing records. Live camera scanning requires HTTPS, which GitHub Pages provides. If live camera access is unavailable or denied, FireVault falls back to the standard device camera picker.
