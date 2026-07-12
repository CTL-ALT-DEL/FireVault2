# FireVault Build 0.79.4 — Cloud File Storage & Plus Codes Foundation

This release keeps FireVault local-first while preparing photos and documents for independent storage destinations and adding full offline Google Plus Codes.

## Photo and document storage

Open **Settings → Data → Photo & Document Storage**.

- Configure separate destinations for photos and documents
- Available targets: Local FireVault, WebDAV, Microsoft OneDrive, SharePoint Library, Google Drive, and Dropbox
- Local storage works now; the existing WebDAV module continues to handle vault backup and restore
- WebDAV photo/document transfer and OAuth-based providers are represented as integration targets until their connector flows are activated
- Keep a local copy after upload
- Queue a future remote upload when a photo or document is saved
- Override the default destination on an individual photo or document record
- Download a provider integration manifest for the later cloud-connection build

No OAuth access tokens, refresh tokens, or passwords are stored in the FireVault vault or backup exports.

## Google Plus Codes

Open **Settings → Field → Google Plus Codes**.

- Generates full Plus Codes directly from latitude and longitude without a network request
- Default account precision: 10 digits
- Default saved-location precision: 11 digits
- Search accounts by Plus Code
- Include Plus Codes in reports
- Generate or refresh codes across the existing database
- Save exact location pins for entrances, fire panels, riser rooms, FDCs, parking, and other field locations
- Copy codes or open them in Google Maps

## Data compatibility

- Existing storage key remains `firevault_vault_build_030`
- Security schema remains version 4
- Existing accounts, Demo Mode, automatic backups, WebDAV, categories, imports, Privacy Lock, Security Center, and backend adapters are preserved
- No remote OAuth provider or live cloud synchronization is activated in this release
