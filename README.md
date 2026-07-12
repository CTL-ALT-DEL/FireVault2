# FireVault Build 0.75.3 — Structural Header Repair

Build 0.75.3 replaces offset-based positioning on all non-home screens with a structural three-row layout: the FireVault logo/date header, the active page, and the bottom navigation. Because the header now occupies real layout space, the Accounts header and action buttons cannot render underneath it.

## Changes
- Rebuilt non-home app chrome as a CSS grid instead of fixed overlays plus calculated margins.
- Accounts page starts in the dedicated content row below the header.
- Bottom navigation occupies its own row and no longer competes with page content.
- Route chrome classes are applied before page markup is rendered.
- Existing account storage, backups, Demo Mode, categories, and update behavior are unchanged.
