# Data Sources and Content Packs

Build baseline: 0.95.9  
Schema version: 1

## Purpose

The content-pack registry separates application behavior from the data and reference sets delivered through that behavior. A future app can keep the same Search, Nearby, Library, files, and offline-storage code while selecting different location databases, reference folders, and update policies.

## Source types

- **Local vault** — user-managed records and references stored on the device.
- **Bundled reference** — small read-only content packaged with the app.
- **Import source** — CSV or JSON supplied by the user.
- **Remote catalog** — a versioned manifest foundation for future downloadable packs.

## FireVault active packs

- `core.user-library` — reusable user reference folders.
- `core.account-content` — photos, documents, and links connected to accounts.
- `firevault.field-reference` — fire-alarm field-reference organization.
- `firevault.panel-documents` — manufacturer and model-linked panel documents.

## Safety and update rules

FireVault 0.95.9 does not silently download remote data. The current policy is manual, requires manifest verification, avoids metered downloads, and retains the previous pack version for rollback readiness.

## AppForge use

A generated app profile may select different pack IDs without rewriting the shared screens. Example planned packs in the registry include Wyoming points of interest, fishing locations, and ghost towns. Their presence in the registry does not install or populate those databases in FireVault.
