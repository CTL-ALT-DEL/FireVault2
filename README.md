# FireVault Build 0.93.1

Interaction & Field Reliability release built from the 0.92.0 Unified Design System baseline.

## What changed

- Restored a visible 2.2-second minimum splash-screen presentation while allowing initialization to continue underneath it.
- Added unsaved-change protection for account, document, contact, equipment, task, deficiency, library, Site Notes, and saveable Settings forms.
- Added a visible Unsaved state to active form headers.
- Added accidental duplicate-action protection for Save, Delete, and other primary/destructive buttons.
- Corrected bottom-navigation highlighting so Nearby views highlight Nearby and account workflows highlight Search.
- Improved keyboard-safe scrolling, sticky form headers, focus rings, validation feedback, and reachable Save controls.
- Shortened route-entry motion so screen changes feel responsive rather than heavy.
- Preserved natural Account Directory momentum scrolling and delayed settling behavior.
- Preserved all 0.92.0 design-system, IndexedDB media, WebDAV, Demo Mode, Plus Codes, Nearby, and Building Navigator behavior.

## Compatibility

- Existing customer records remain on storage key `firevault_vault_build_030`.
- Existing IndexedDB photos and documents remain unchanged.
- No feature or data migration is required for this build.


## Build 0.93.1

- Removed the three shortcut/status buttons from the top of Settings.
- Prevented the Settings page from moving horizontally on iPhone and iPad.
- Removed negative-width and horizontal-scroll behavior from the Settings shell.
- Preserved Settings search, grouped sections, WebDAV, Demo Mode, Plus Codes, backups, security, and Photo Overlay.
