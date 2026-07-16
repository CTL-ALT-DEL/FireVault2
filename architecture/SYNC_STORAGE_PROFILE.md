# Sync & Storage Profile

FireVault Build 0.96.0 adds `src/sync-storage-profile.js` as the reusable policy layer for local storage, remote providers, backups, and collaboration.

## Purpose

The profile separates storage policy from screen code. A future AppForge product can select local-only storage, WebDAV backup, Microsoft destinations, or another provider adapter without rewriting Settings, file-destination, backup, or Team Sync workflows.

## FireVault profile

The active `firevault-local-first` profile uses:

- Local structured vault in `localStorage`
- Photo and scanned-page media in IndexedDB
- Automatic local safety snapshots
- Complete manual exports with media
- WebDAV as an approved backup destination
- OneDrive and SharePoint as approved photo, document, and package-exchange destinations
- Manual package exchange rather than automatic live synchronization
- Offline change queue and manual conflict review
- Credentials excluded from the FireVault vault and backup payload
- Local copies preserved when remote destinations are selected

## Profile-controlled behavior

The active App Profile selects:

- Approved provider IDs
- Provider roles for vault, media, backups, photos, documents, and shared packages
- Offline-first behavior
- Backup retention and restore verification
- Collaboration mode and conflict policy
- Credential and local-copy safeguards
- Visibility of Microsoft Storage, WebDAV, Team Sync, File Storage, and Backup settings

## Current limitation

This architecture does not claim live OAuth transfer or automatic server synchronization. Existing provider readiness remains unchanged. The profile defines approved behavior and safely filters the interface while provider adapters continue to report their actual implementation state.
