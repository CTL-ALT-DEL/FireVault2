# FireVault Build 0.95.8 Validation

## Static checks

- JavaScript syntax passed for all source modules and the service worker.
- JSON parsing passed for manifest, version, App Profile, module registry, module bindings, record schema, workflow schema, and Theme Profile.
- Every `?v=` application reference resolves to Build 0.95.8.
- Service-worker shell includes `theme-profile.js` and every required application asset.
- ZIP integrity test passed.

## Theme Profile checks

- App Profile schema is version 6.
- Theme Profile schema is version 1.
- FireVault resolves to the `firevault-dark` profile.
- Semantic color tokens resolve to valid six-digit hexadecimal colors.
- Wordmark, tagline, mark, logo, and install-icon references resolve.
- Theme Profile export is JSON-safe.
- Live startup applies the Theme Profile before normal route rendering.
- Existing user-selected body theme classes remain able to override base profile variables.

## Compatibility checks

- Storage key remains `firevault_vault_build_030`.
- No record, media, backup, WebDAV, privacy, Demo Mode, module, record-schema, or workflow-schema migration is required.
- FireVault keeps every current fire-alarm module and technician action enabled.

## Device confirmation

Confirm the installed Home Screen icon, status-bar color, splash branding, Account Detail, Quick Photo, Photo Overlay, and Architecture & Modules screen on a physical iPhone and iPad.
