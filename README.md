# FireVault

## Build 1.02.0 — On-Site Guide

Build 1.02.0 turns exact saved Plus Code locations into a focused On-Site Guide. When a foreground Nearby scan confirms that a technician has reached an account with saved parking or entrance points, FireVault offers a compact arrival prompt and a property map ordered for field use.

### Added

- Offers a nonblocking arrival card only while FireVault is open, GPS accuracy is usable, and the account has a saved parking or entrance location.
- Opens an On-Site Guide with a focused property map, numbered pins, Plus Codes, access notes, distance, Copy, and Route actions.
- Orders locations Parking → Entrance → fire-alarm equipment so the guide matches a technician’s approach to the property.
- Provides a permanent On-Site Guide action in Account Detail → Locations for manual use at any time.
- Identifies shared-location accounts by account name and Account ID before opening the guide.
- Shows the arrival prompt only once per account group during the current app session.
- Expands the fictional Demo Mode dataset with technician parking points for safe hands-on testing.

### Preserved UI cleanup

Build 1.01.5 Update Sheet redesign, Build 1.01.4 Account tab visibility, Build 1.01.3 Favorite cleanup, Build 1.01.2 Photo Overlay polish, Build 1.01.1 Account Detail polish, and Build 1.01.0 Settings cleanup remain intact. Everyday Settings stays consolidated into six technician-focused areas, and AppForge remains hidden from normal app use.

### Developer access

Existing Build 1.00 AppForge tools are preserved. To open them, serve the app locally and visit `http://localhost:8000/?appforge=1`, then open Settings → About FireVault → AppForge Factory.

### Compatibility

The active storage key remains `firevault_vault_build_030`; no schema migration is required. Arrival detection uses the existing foreground Nearby GPS request and the existing reusable Exact Location Navigator. It does not monitor location in the background. Update activation, tabs, Favorite behavior, Photo Overlay, photos, accounts, documents, imports, backups, security controls, and other field workflows are unchanged.
