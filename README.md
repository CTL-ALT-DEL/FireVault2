# FireVault

## Build 1.03.0 — Settings & Help Cleanup

Build 1.03.0 makes the existing FireVault interface easier to scan and maintain without adding a new field workflow or changing stored account data.

### Polished

- Anchors each Nearby Account distance at the lower right and increases its type size.
- Aligns the Account Detail Back arrow and label inside one readable control.
- Renames Settings “Profile & Photos” to “Profile.”
- Moves Technician Overlay from Technician Profile to Photo Overlay and keeps its data completely independent from the normal Photo Overlay.
- Rebuilds Reports → Email Preview as a clean sample message with recipients, subject, body, example attachment, and signature.
- Moves App Updates from Data & Backup to About FireVault.
- Replaces the Microsoft “M” and storage-provider initials with recognizable OneDrive, SharePoint, WebDAV, and local-device marks for every enabled storage target.
- Adds About FireVault → Help & User Manual with three screenshots captured from this build and the existing searchable FireVault Academy content.
- Repairs Update Ready activation so updates wait for a deliberate Install action and stalled attempts always restore enabled Try Again and Reload App controls.

### Run locally

From this folder, run `python3 -m http.server 8000`, then open `http://localhost:8000`. Use HTTPS for real GPS permission outside localhost.

### Developer access

Existing AppForge tools remain hidden from normal technician use. Open `http://localhost:8000/?appforge=1`, then Settings → About FireVault → AppForge Factory.

### Compatibility

The active storage key remains `firevault_vault_build_030`; no schema migration is required. Accounts, notes, photos, documents, overlay settings, Microsoft profiles, imports, backups, security controls, On-Site Guide, and all prior field workflows remain compatible.
