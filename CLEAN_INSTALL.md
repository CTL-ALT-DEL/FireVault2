# Clean Install Notes — FireVault Build 0.50.20

This ZIP is intended to be used as the clean baseline for FireVault Build 0.50.20.

## Clean install steps

1. Extract this ZIP.
2. Commit the full extracted root to the FireVault repository.
3. Publish through GitHub Pages.
4. On iPhone/iPad, hard refresh Safari or remove and re-add the Home Screen PWA if old cached files remain.

## Build notes

Build 0.50.20 keeps the working 0.50.19 startup repair and adds a Startup Health section in Diagnostics.

Startup Health records and displays:

- module-ready status
- booted status
- last good boot time
- last boot build
- last route opened
- splash screen minimum timing
- last startup error, if one exists

This build preserves the 5-second splash screen, Photo Vault tools, Photo Overlay tools, custom overlay logo support, iPad autosizing, simple Home screen, and Search Bar Concept #6.
