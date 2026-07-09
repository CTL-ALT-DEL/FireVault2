# Clean Install Notes — FireVault Build 0.50.15

This ZIP is intended to be used as the new clean baseline for FireVault Build 0.50.15.

## Install

1. Extract the ZIP.
2. Upload the contents to the GitHub Pages root for the FireVault repository.
3. Commit all changed files together.
4. Wait for GitHub Pages to finish deploying.
5. On iPhone/iPad, fully close and reopen the PWA if the previous build is cached.

## Build focus

Build 0.50.15 keeps the 0.50.14 startup hotfix and improves splash-screen timing:

- Adds a controlled minimum splash display time so the splash screen does not flash for only a microsecond.
- Keeps the startup watchdog from 0.50.14.
- Preserves Photo Vault overlay workflow, Photo Overlay settings, iPad autosizing, simple Home screen, and Search Bar Concept #6.

## Validation performed

- JavaScript syntax validation.
- Manifest JSON validation.
- ZIP integrity validation.
- Extracted ZIP validation.
