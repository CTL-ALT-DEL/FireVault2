# FireVault Build 0.94.1

Bottom-navigation consistency repair built from the 0.94.0 Comprehensive UI Polish baseline.

## What changed

- Aligned the Nearby Accounts bottom navigation to the exact same fixed position, height, safe-area padding, and button geometry used by Search and Settings.
- Removed the red underline/bar beneath the active Nearby, Search, or Settings button.
- Preserved the active button background, border, icon, and text treatment so the current section remains clear.
- Preserved the three-button Nearby, Search, Settings navigation and all existing route behavior.
- Preserved Settings, Account Directory, Account Detail, IndexedDB media, WebDAV, Demo Mode, Plus Codes, backups, and existing account records.

## Compatibility

- Existing customer records remain on storage key `firevault_vault_build_030`.
- Existing IndexedDB photos and documents remain unchanged.
- No data migration is required.
