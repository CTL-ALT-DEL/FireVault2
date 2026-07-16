# FireVault Build 0.96.0 Validation

## Static checks

- JavaScript syntax passed for all source modules and the service worker.
- JSON parsing passed for manifest, version, App Profile, Module Registry, module bindings, Record Schema, Workflow Schema, Theme Profile, Content Pack Registry, and Sync & Storage Profile.
- Every `?v=` application reference resolves to Build 0.96.0.
- Service-worker shell includes `sync-storage-profile.js` and every required application asset.
- ZIP integrity test passed.

## Sync & Storage Profile checks

- App Profile schema is version 8.
- Sync & Storage Profile schema is version 1.
- Module Registry is version 5 and includes `core.syncStorageProfile`.
- Every enabled provider ID resolves to a registered provider.
- Every role assignment references an enabled provider that supports that role.
- Local storage remains the primary vault and media backend.
- FireVault resolves four approved providers: local, WebDAV, OneDrive, and SharePoint.
- File Storage choices are filtered by the active profile.
- WebDAV, Microsoft Storage, Team Sync, File Storage, and Backup settings are profile-aware.
- Credentials remain excluded from the vault.
- The profile retains local copies and requires restore verification.
- Collaboration remains manual package exchange; automatic live synchronization is disabled.
- Sync & Storage Profile export is JSON-safe.

## Compatibility checks

- Storage key remains `firevault_vault_build_030`.
- No record, media, backup, WebDAV, Microsoft profile, privacy, Demo Mode, Record Schema, Workflow Schema, Theme Profile, or Content Pack migration is required.
- Existing saved provider assignments are preserved when allowed by the profile and safely fall back to local when a future profile disables a provider.
- FireVault keeps every current fire-alarm module and technician action enabled.

## Device confirmation

Confirm File Storage provider choices, WebDAV and Microsoft Settings access, Team Sync, Backup & Restore, Architecture & Modules storage section, and offline startup on a physical iPhone and iPad.
