# FireVault Build 0.41.7

Nearby Sites detection and iPhone home-screen bottom safe-area fix.

## Changes
- Restores visible Nearby Sites detection from the dashboard and Sites page.
- Adds a Nearby Sites screen that scans current GPS and sorts saved GPS sites by distance.
- Adds configurable Nearby Radius under Settings > GPS.
- Keeps Capture GPS, Apple Maps, Google Maps, GPS badges, and GPS report support.
- Hardens iPhone PWA bottom safe-area handling to cover the white strip below the nav menu.
- Preserves clean root package format and the existing FireVault storage key.

## Install
Copy these files into the project root that contains package.json, src, public, index.html, manifest.json, and assets. Do not copy the outer folder itself into your repo.
