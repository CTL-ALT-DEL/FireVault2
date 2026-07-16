# FireVault Build 1.01.0 Validation

## Static checks

- JavaScript syntax passes for every source module and the service worker.
- Every imported symbol resolves from its source module.
- All JSON architecture contracts parse and runtime mirrors match.
- Every static application reference resolves to Build 1.01.0.
- Service-worker shell includes the generated-profile bridge, Generator Engine, and every required runtime asset.
- Local HTTP asset smoke test and release ZIP integrity pass.

## UI cleanup checks

- Normal Settings presents six areas: Profile & Photos, Reports, Data & Backup, Maps & GPS, Privacy & Security, and About FireVault.
- AppForge Factory does not appear in normal Settings, dashboard lists, or Settings search.
- AppForge Factory appears only when the app is opened with `?appforge=1`.
- Demo Mode remains available under About FireVault.
- Every existing Settings detail tab remains reachable through its consolidated area.
- Technician-facing About copy contains no product-factory messaging.

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

Confirm normal Settings shows only the six consolidated areas on iPhone and iPad, each detail screen remains accessible, AppForge stays hidden without the query flag, developer access works with `?appforge=1`, and offline startup works after updating.
