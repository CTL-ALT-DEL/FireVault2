# FireVault

## Build 1.00.0 — AppForge Generator Engine

Build 1.00.0 turns the validated AppForge factory contracts into working, downloadable PWA packages while preserving FireVault as the production fire-alarm technician app.

### Integrated

- Added `src/app-forge-generator.js` with a deterministic client-side ZIP writer and package pipeline.
- Added `src/generated-app-profile.js` as the safe profile-injection point for generated products.
- Added `core.appForgeGenerator` to Module Registry version 9.
- Advanced the App Profile to schema version 12.
- Added one-click PWA ZIP generation for FireVault, Wyoming Explorer, Wyoming Fishing Guide, and Ghost Towns Guide.
- Generated packages contain the shared runtime, offline shell, product-specific App Profile, PWA manifest, architecture contracts, factory records, requirements report, and iOS handoff profile.
- Each generated product receives its own storage, media-database, global, and service-worker cache namespace.
- Added live generation progress and package-state reporting under Architecture & Modules.

### Generator results

- **FireVault:** release-candidate PWA package for parity testing.
- **Wyoming Explorer:** working prototype PWA; original brand assets and verified location database remain required.
- **Wyoming Fishing Guide:** working prototype PWA; original assets, verified fishing locations, and current regulations remain required.
- **Ghost Towns Guide:** working prototype PWA; original assets and verified historic-sites database remain required.

### Capability honesty

Build 1.00.0 generates installable PWA source ZIPs and an iOS handoff profile. It does not generate or sign an Xcode project, install an authoritative database, create original production artwork, configure OAuth, or publish an app automatically.

### Safety and compatibility

Generation happens entirely in the browser from versioned static source. It never reads customer records, photos, documents, backups, credentials, device identity, or OAuth tokens. The active FireVault storage key remains `firevault_vault_build_030`, and all fire-alarm technician workflows remain enabled.
