# Clean Install Notes — FireVault Build 0.50.22

This ZIP is intended to be used as the clean baseline for FireVault Build 0.50.22.

## Recommended install

1. Delete the old deployed files from the GitHub Pages branch or repository root.
2. Copy the full contents of this ZIP into the repo root.
3. Commit and push the full replacement.
4. Open the deployed PWA and confirm the visible build number shows `0.50.22`.
5. On iPhone/iPad, clear Safari/PWA cache if an older build remains stuck.

## Build focus

Build 0.50.22 keeps the working 0.50.21 startup repair and adds Photo Vault workflow polish:

- Photo Vault sorting by newest, photos first, title, or type.
- Copy List for the currently filtered/searched/sorted document list.
- Updated document timestamps for better recent sorting.
- Existing Photo Vault search and filter tabs preserved.
- Startup Health diagnostics and 5-second splash preserved.
- Safari EOF startup repair preserved.

## Validation performed

- JavaScript syntax validation completed.
- Manifest JSON validation completed.
- ZIP integrity validation completed.
- Extracted ZIP validation completed.
