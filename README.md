# FireVault Build 0.63.0

Build 0.63.0 adds the first working multi-device data handoff and merge workflow while preserving FireVault's offline-first operation.

## Included
- Detailed synchronization queue in Settings → Team Sync
- Exportable Shared Vault Packages suitable for storage in OneDrive
- Import and merge workflow for a package created on another FireVault device
- Record-version comparison and newer-record merging
- Equal-version conflict detection without silent overwrites
- Sync package origin, technician, device, workspace, and timestamp metadata
- Updated Team Sync guidance and Academy revision references

Automatic Microsoft sign-in and Microsoft Graph synchronization are not enabled yet.

Suggested commit message:

`Build 0.63.0 add Shared Vault package export import and conflict-safe merging`
