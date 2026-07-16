# FireVault Build 1.01.4 Validation

## Static checks

- JavaScript syntax passes for every source module and the service worker.
- Every imported symbol resolves from its source module.
- All JSON architecture contracts parse and runtime mirrors match.
- Every static application reference resolves to Build 1.01.4.
- Service-worker shell includes the generated-profile bridge, Generator Engine, and every required runtime asset.
- Local HTTP asset smoke test and release ZIP integrity pass.

## Account Detail tab checks

- Overview, Notes, Locations, Equipment, Files, and Details remain available in the same order.
- Activating every tab keeps the selected tab fully visible inside the phone tab rail.
- A clipped selected tab is revealed automatically after Account Detail re-renders.
- The tab rail remains horizontally swipeable on phones and remains a six-column grid on iPad.
- Account Detail creates no horizontal page overflow at 320×700, 390×844, or 1024×1366.
- Add Note remains readable and contained within its action button.
- Every Account Detail tab continues to open without runtime errors.

## Preserved UI cleanup

- Build 1.01.3 star-only Favorite control, 44px target, and accessible state remain intact.
- Build 1.01.2 Photo Overlay workflow, controls, preview, and responsive layouts remain intact.
- Build 1.01.1 Account Detail actions, tabs, and responsive layouts remain intact.
- Normal Settings continues to present six technician-focused areas.
- AppForge remains hidden from normal Settings and available only with `?appforge=1`.
- Demo Mode remains available under About FireVault.

## Scope checks

- No preview, parity-audit, or other feature module was added.
- App Profile remains schema version 12.
- Module Registry remains version 9.
- Existing Build 1.00 AppForge generator contracts remain intact behind developer access.

## Compatibility checks

- Active runtime profile remains `firevault`.
- Storage key remains `firevault_vault_build_030`.
- FireVault retains all fire-alarm modules, fields, categories, and technician actions.
- No record, media, backup, WebDAV, Microsoft profile, privacy, Demo Mode, or schema migration is required.

## Device confirmation

Confirm every Account Detail tab remains fully visible after activation at 320×700 and 390×844; iPad retains all six tabs in one row at 1024×1366; the Favorite and Add Note fixes remain intact; Photo Overlay remains intact; Settings remains consolidated; AppForge stays hidden without the query flag; and offline startup works after updating.
