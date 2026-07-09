# Clean Install Notes — FireVault Build 0.50.19

This ZIP is intended to be used as the new clean baseline for FireVault Build 0.50.19.

## Install

1. Extract the ZIP.
2. Copy all files to the root of the GitHub Pages branch/repo.
3. Commit and push.
4. On iPhone/iPad, reload the PWA. If the old build is still cached, remove the Home Screen app icon and add it again from Safari.

## Build notes

Build 0.50.19 is a focused startup repair build:

- Fixes the Photo Vault document-list syntax pattern that caused `SyntaxError: Unexpected EOF` on app load.
- Keeps the 5-second splash screen timing.
- Preserves the startup watchdog.
- Preserves Photo Vault filters and overlay export tools.
- Preserves custom Photo Overlay logo support.
- Preserves iPad autosizing.
- Keeps Home simple and preserves Search Bar Concept #6.
- Does not bring back job-status workflow controls.
