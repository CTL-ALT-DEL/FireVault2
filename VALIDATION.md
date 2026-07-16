# FireVault Build 1.01.1 Validation

## Static checks

- JavaScript syntax passes for every source module and the service worker.
- Every imported symbol resolves from its source module.
- All JSON architecture contracts parse and runtime mirrors match.
- Every static application reference resolves to Build 1.01.1.
- Service-worker shell includes the generated-profile bridge, Generator Engine, and every required runtime asset.
- Local HTTP asset smoke test and release ZIP integrity pass.

## Account Detail checks

- Account Detail exposes the same Back, Favorite, Edit, Call, Route, Add Note, and Photo actions.
- All six enabled Account Detail tabs remain present and route to their existing content.
- Primary action labels render at 12px or larger on iPhone and 14px on iPad.
- Tab labels render at 12px or larger with visible SVG icons and 48px touch targets.
- Phone tabs scroll horizontally inside their rail without creating page overflow.
- iPad tabs expand to six equal columns and Overview uses a two-column content layout.
- Account identity, address, metadata, status tags, issue counts, card headings, values, and secondary text remain readable at supported widths.
- Focus-visible states remain available for keyboard navigation.

## Preserved UI cleanup

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

Confirm Account Detail has no horizontal page overflow at 390×844 or 1024×1366, all primary actions and tabs remain visible or scrollable, every tab opens without a runtime error, Settings remains consolidated, AppForge stays hidden without the query flag, and offline startup works after updating.
