# FireVault Build 0.94.2

Photo Overlay live-preview usability update built from the 0.94.1 Navigation Alignment Repair baseline.

## What changed

- Removed the visible “Photo by Ben Schumin · CC BY-SA 2.0” line from the Photo Overlay Settings page.
- Kept the Field Photo example as a persistent live preview while Photo Overlay controls scroll.
- Reduced the preview card and example image size so more controls remain visible on iPhone.
- Reorganized Photo Overlay into a sticky preview column and a separate scrolling controls column on iPad and wider layouts.
- Preserved the exact shared renderer used by the preview and exported photo, so changes to content, position, style, text size, opacity, colors, logo, and tagline remain visible immediately.
- Preserved the third-party image attribution in `THIRD_PARTY_NOTICES.md`.
- Preserved all 0.94.1 navigation alignment, IndexedDB media, WebDAV, Demo Mode, Plus Codes, backups, settings, and account data.

## Compatibility

- Existing customer records remain on storage key `firevault_vault_build_030`.
- Existing IndexedDB photos and documents remain unchanged.
- No data migration is required.
