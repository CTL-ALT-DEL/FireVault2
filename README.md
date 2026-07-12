# FireVault Build 0.79.5 — Microsoft Storage Accounts

This release keeps FireVault local-first while preparing separate Microsoft storage destinations for a personal account, a work account, and SharePoint libraries.

## Microsoft Storage Accounts

Open **Settings → Data → Microsoft Storage Accounts**.

- Create multiple named Personal OneDrive, Work OneDrive, and SharePoint profiles
- Keep connector profile metadata outside the FireVault vault and backup exports
- Assign the exact profile used for Photos and the exact profile used for Documents
- Protect company data with a strict no-personal-fallback rule
- Save the public Microsoft application (client) ID, authority, tenant ID, and SPA redirect URI
- Download a Microsoft integration manifest for the later live OAuth connector build

## Current connector state

The account-profile and destination-assignment foundation is complete. Live Microsoft sign-in, token refresh, file upload, download, and SharePoint discovery are intentionally not activated until a Microsoft Entra app registration is available. Passwords and OAuth tokens are never accepted by this build.

## Preserved

- Existing `firevault_vault_build_030` storage key
- Security schema 4
- Local-first account database
- Automatic snapshots and Security Center
- Privacy Lock
- WebDAV backup and restore
- Independent photo/document storage settings
- Offline Google Plus Codes
- Backend adapter foundation

Deploy over the existing FireVault installation. Do not delete or reinstall the Home Screen PWA.
