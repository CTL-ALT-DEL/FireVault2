# Clean Install Notes — FireVault Build 0.50.23

This ZIP is intended to be used as the clean baseline for FireVault Build 0.50.23.

## Recommended install

1. Delete the old deployed files from the GitHub Pages branch or repository root.
2. Copy the full contents of this ZIP into the repo root.
3. Commit and push the full replacement.
4. Open the deployed PWA and confirm the visible build number shows `0.50.23`.
5. On iPhone/iPad, clear Safari/PWA cache if an older build remains stuck.

## Build focus

Build 0.50.23 keeps the working 0.50.22 startup repair and makes account photos easy to find:

- Account Photos card added directly to each site/account screen.
- Add Photo button added directly to each account.
- Photo Vault button added directly to each account.
- Latest account photo thumbnails shown on the account page.
- Documents / Photos screen now has separate Add Photo and Add Document / Link actions.
- Add Account Photo flow defaults to Photo Set.
- Existing Photo Vault search, filter, sort, copy-list, and overlay tools preserved.
- Startup Health diagnostics and 5-second splash preserved.
- Safari EOF startup repair preserved.

## Validation performed

- JavaScript syntax validation completed.
- Manifest JSON validation completed.
- ZIP integrity validation completed.
- Extracted ZIP validation completed.
