# FireVault Build 1.01.2 Validation

## Static checks

- JavaScript syntax passes for every source module and the service worker.
- Every imported symbol resolves from its source module.
- All JSON architecture contracts parse and runtime mirrors match.
- Every static application reference resolves to Build 1.01.2.
- Service-worker shell includes the generated-profile bridge, Generator Engine, and every required runtime asset.
- Local HTTP asset smoke test and release ZIP integrity pass.

## Photo Overlay checks

- The workspace order is Live Preview, Quick Setup, Fields, Layout, and Branding.
- Compact, Standard, and Detailed presets remain available and update the exact-export preview.
- Logo and tagline toggles, position, style, text size, opacity, accent, text color, and logo source remain available.
- Existing overlay fields can be added, aligned left/center/right, placed on a new line, reordered, and removed.
- Main field controls render at 44px or larger with visible SVG icons and readable labels.
- Tech Info continues to use the Technician Profile overlay template as one field.
- Auto-save reports Saving and Saved without requiring a manual save action.
- The logo preview remains constrained on phone and tablet layouts.
- The editor and preview create no horizontal page overflow at 390×844 or 1024×1366.
- Preset selection, field insertion, alignment, position changes, preview rendering, and auto-save complete without runtime errors.

## Preserved UI cleanup

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

Confirm Photo Overlay has no horizontal page overflow at 390×844 or 1024×1366, the preview remains visible while editing, every control remains readable and reachable, preset/field/layout changes update and save without a runtime error, Settings remains consolidated, AppForge stays hidden without the query flag, and offline startup works after updating.
