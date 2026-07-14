# FireVault Build 0.92.0

Unified Design System release built from the 0.91.1 Settings Shortcut Repair baseline.

## What changed

- Added `src/design-system.css` as the canonical release-facing component layer.
- Unified global header, bottom navigation, surfaces, buttons, forms, focus states, cards, empty states, and alerts.
- Consolidated the active Account Directory visual system, including toolbar, search, account cards, identity tags, and full-width card actions.
- Consolidated Account Detail identity, action controls, tabs, and content surfaces.
- Consolidated Settings index, status shortcuts, search, grouped rows, submenus, and detail pages.
- Polished Nearby supporting screens and responsive tablet layouts.
- Added consistent iPhone, iPad portrait, iPad landscape, and Split View breakpoints.
- Added reduced-motion handling and preserved 44-point minimum interaction targets.

## Compatibility

- Existing customer records remain on storage key `firevault_vault_build_030`.
- IndexedDB media storage from Build 0.91.0 remains unchanged.
- WebDAV, Demo Mode, Plus Codes, backup, security, Photo Overlay, Nearby, and Building Navigator remain available.
- The legacy stylesheet remains in place for older secondary workflows; active release screens now use the new canonical layer so future polish can be concentrated in one file.
