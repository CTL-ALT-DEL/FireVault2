# FireVault Build 1.01.5 Validation

## Static checks

- JavaScript syntax passes for every source module and the service worker.
- Every imported symbol resolves from its source module.
- All JSON architecture contracts parse and runtime mirrors match.
- Every static application reference resolves to Build 1.01.5.
- Service-worker shell includes the generated-profile bridge, Generator Engine, and every required runtime asset.
- Local HTTP asset smoke test and release ZIP integrity pass.

## Update Ready sheet checks

- The sheet identifies the waiting build and explains that FireVault will reopen after installation.
- Later and Install Update are visible, labeled, and 48px tall.
- The sheet stays inside the viewport and above bottom navigation at 320×700, 390×844, and 1024×1366.
- Install Update sends the existing `SKIP_WAITING` command exactly once per activation attempt.
- Installation disables both actions, reports Installing, and prevents duplicate taps.
- A delayed activation restores the actions with clear retry guidance.
- Later dismisses the sheet without starting the update.
- Repeated update-ready events refresh one existing sheet instead of creating duplicates.
- The sheet exposes dialog semantics, live status updates, and no horizontal page overflow.

## Preserved UI cleanup

- Build 1.01.4 selected-tab visibility remains intact on phone and iPad layouts.
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

Confirm Update Ready stays above navigation at 320×700, 390×844, and 1024×1366; Later dismisses it; Install Update enters a locked progress state and reopens FireVault through the existing service-worker flow; prior Account Detail, Favorite, Add Note, Photo Overlay, and Settings cleanup remains intact; AppForge stays hidden without the query flag; and offline startup works after updating.
