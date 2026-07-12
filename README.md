# FireVault Build 0.79.2 — Security Center & Recovery Hardening

This release consolidates FireVault’s local security and recovery tools under **Settings → Data → Security Center**.

## Added

- Unified Security Center dashboard
- Privacy Lock status and direct access
- Vault integrity validation for record IDs, collections, security metadata, GPS values, audit storage, and recycle-bin structure
- Downloadable integrity reports
- Backup-health summary for rolling snapshots, downloaded exports, and WebDAV uploads
- Latest automatic snapshot verification and download
- Device naming and stable workspace/user/device identity display
- Clear Session & Lock control for temporary navigation state, WebDAV session password, and unlocked privacy state
- Filterable and searchable audit viewer
- PIN confirmation for full backup export, automatic snapshot download/restore, WebDAV upload/restore, full backup import, recycle-bin purge, audit export, integrity export, and local-vault deletion when Privacy Lock is enabled

## Data compatibility

- Existing storage key remains `firevault_vault_build_030`
- Security schema remains version 4
- Existing accounts, Demo Mode, categories, imports, backups, WebDAV settings, and update behavior are preserved
- No signup, cloud login, passkeys, 2FA, roles enforcement, or backend is included yet
