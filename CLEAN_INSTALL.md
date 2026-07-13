# FireVault Build 0.80.4 — Deployment Notes

1. Replace the previous GitHub Pages files with the contents of this ZIP.
2. Commit and push every changed file.
3. Open FireVault once while online so the new service worker can cache Build 0.80.4.
4. Reload or reopen the installed Home Screen app.
5. Allow camera access for live automatic scanning and location access for closest-account matching.

The scanner is fully client-side and requires HTTPS for live camera and GPS access. GitHub Pages provides HTTPS. The existing `firevault_vault_build_030` data key is preserved.
