# FireVault Build 0.80.2 — AI Auto Scan

Build 0.80.2 simplifies the built-in document scanner and upgrades camera capture.

## Scanner changes

- Removed the large scanner introduction/help tile.
- Reorganized the screen around one primary **Scan a Page** action.
- Added a full-screen live camera instead of relying only on the standard browser camera picker.
- Added on-device smart page-corner detection with a visible live crop frame.
- Added hands-free automatic capture after the page is detected and held steady.
- Automatically crops and cleans each captured page before adding it to the document.
- Keeps the camera open for fast multi-page scanning.
- Keeps manual shutter capture and standard camera/import fallback available.
- Retains page adjustment, rotation, cleanup modes, ordering, deletion, PDF preview/download/share, account matching, and Site Notes access.

## Mobile editing repair

Focused text fields now scroll into the visible area when the iPhone or Android keyboard opens. The bottom navigation temporarily hides while typing so it cannot cover the active field.

## Data compatibility

The existing `firevault_vault_build_030` storage key is unchanged. Existing accounts, notes, files, scans, Building Navigator locations, settings, and security metadata remain compatible.
