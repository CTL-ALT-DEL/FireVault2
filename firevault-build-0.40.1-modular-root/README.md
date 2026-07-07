# FireVault Build 0.40.1 — Selected Logo Integration

Root-level package for GitHub Pages.

## Changes
- Applies saved theme preferences live instead of only storing them
- Adds preset theme buttons: FireVault Dark, Fire Red, Industrial Blue, Night Shift, High Contrast, AMOLED Black
- Adds large text, compact layout, squared/rounded buttons, and glass/solid cards as real UI modes
- Refreshes iPhone home-screen assets with a stronger FireVault field-service icon
- Updates manifest metadata for iPhone/PWA install behavior
- Keeps Settings sections for technician, report, email, photo overlay, themes, advanced services, import/export, about, and diagnostics
- Marks advanced features that require outside services with an asterisk
- Preserves the existing FireVault localStorage key from the modular line

Suggested commit:

`Build 0.40.1 selected flame logo integration`


## Build 0.40.1
- Replaced the app header mark, favicon, Apple touch icon, and PWA manifest icons with the selected #8 Flame Icon logo.
- Added `assets/firevault-logo-master.png` and `assets/firevault-logo-source.png` for future logo/icon work.
- Preserved storage key `firevault_vault_build_030` so existing browser data remains compatible.
