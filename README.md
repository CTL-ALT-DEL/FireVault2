# FireVault Build 0.28.0 — Modular Recovery

Root-level package for GitHub Pages.

## Why this build exists
The previous single-file app became too fragile. Build 0.28.0 restarts FireVault using a modular structure so future changes are safer.

## Files
- `index.html`
- `manifest.json`
- `src/styles.css`
- `src/storage.js`
- `src/photos.js`
- `src/app.js`

## What works in this recovery build
- Home screen
- Sites list
- Add/Edit Site
- Site detail
- Docs / Photos
- Photo upload
- FireVault photo overlay
- View saved images full-size
- Delete photo/document records
- Advanced Settings screen
- JSON backup export
- Diagnostics screen

## Data
Uses the same localStorage key as previous builds, so existing data should remain available.

Suggested commit:

`Build 0.28.0 modular recovery`
