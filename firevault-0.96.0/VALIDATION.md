# FireVault Build 1.03.0 Validation

## Static checks

- JavaScript syntax passes for every source module and the service worker.
- Every imported symbol resolves from its source module.
- All JSON architecture contracts parse and runtime mirrors match.
- Every active application reference resolves to Build 1.03.0; 1.02.0 remains only in historical release documentation.
- Service-worker shell includes all runtime modules and the three Help screenshots.
- Local HTTP asset smoke test and release ZIP integrity pass.

## Responsive UI checks

- Nearby distance is within the row’s lower-right inset and renders at 14px or larger at 320×700, 390×844, and 1024×1366.
- Account Detail Back arrow and label centerlines remain within one pixel at all three viewports.
- Nearby, Account Detail, Photo Overlay, and User Manual have zero horizontal overflow at all three viewports.
- Profile, Photo Overlay, About FireVault, email preview, and File Storage labels remain readable at phone and iPad sizes.

## Settings organization checks

- Settings home shows Profile, not Profile & Photos.
- Technician contains only profile photo, identity, and contact sections.
- Photo Overlay contains the normal overlay studio and the separately labeled Technician Overlay.
- Editing Technician Overlay and waiting for auto-save leaves the complete original `settings.overlay` object byte-for-byte unchanged.
- Data & Backup does not contain App Updates.
- About FireVault contains Help & User Manual, App Updates, Demo Mode, and About FireVault.
- Microsoft Storage uses a OneDrive mark, and every enabled File Storage target has a provider-specific mark.

## Help and email checks

- Help loads all three bundled screenshots with nonzero natural dimensions.
- The visual guide explains Nearby, Account Detail, and the two independent overlay settings.
- The searchable User Manual remains available below the visual guide.
- Email Preview uses Sample Message rather than the previous redundant Live Preview / Example Email hierarchy.
- Recipient rows, subject, body, example attachment, and signature render without horizontal overflow.

## Update procedure checks

- An installed waiting worker receives exactly one `SKIP_WAITING` message from Install Update.
- Worker activation completes the reload handoff and clears the activation flag.
- A failed `postMessage` restores enabled Try Again and Reload App controls immediately.
- A stalled update has an eight-second timeout that restores the same usable controls.
- Duplicate detections update the existing sheet instead of stacking dialogs.
- The service worker no longer calls `skipWaiting()` during install; updates wait for the explicit popup action.

## Scope and compatibility

- No new field workflow, record type, schema, or storage service was activated.
- App Profile remains schema version 12 and Module Registry remains version 9.
- AppForge remains hidden from normal Settings and available only with `?appforge=1`.
- Active runtime profile remains `firevault`.
- Storage key remains `firevault_vault_build_030`.
- No record, media, backup, WebDAV, Microsoft profile, privacy, or schema migration is required.

## Automated result

The focused Chromium behavior suite passes 47 of 47 checks across 320×700, 390×844, and 1024×1366. Static syntax, JSON parsing, service-worker assets, package integrity, storage-key continuity, and AppForge contract checks also pass.
