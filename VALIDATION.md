# FireVault Build 1.01.3 Validation

## Static checks

- JavaScript syntax passes for every source module and the service worker.
- Every imported symbol resolves from its source module.
- All JSON architecture contracts parse and runtime mirrors match.
- Every static application reference resolves to Build 1.01.3.
- Service-worker shell includes the generated-profile bridge, Generator Engine, and every required runtime asset.
- Local HTTP asset smoke test and release ZIP integrity pass.

## Account Detail Favorite checks

- The top Favorite control has no visible text that can wrap.
- The star-only Favorite control renders at 44px with an icon at least 20px wide.
- Its accessible label reports Add to favorites or Remove from favorites as appropriate.
- Its `aria-pressed` state matches the saved Favorite state and updates after activation.
- The labeled Edit control remains unchanged.
- Account Detail creates no horizontal page overflow at 320×700, 390×844, or 1024×1366.
- Add Note remains readable and contained within its action button.
- Overview, System, Activity, Notes, Photos, and Documents continue to open without runtime errors.

## Preserved UI cleanup

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

Confirm the Account Detail Favorite control is star-only and does not wrap at 320×700, 390×844, or 1024×1366; the 44px control toggles its visible and accessible selected state; all Account Detail tabs still open; Photo Overlay remains intact; Settings remains consolidated; AppForge stays hidden without the query flag; and offline startup works after updating.
