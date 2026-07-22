# AppForge Generator Engine

Build baseline: 1.03.27  
Generator schema: 1

The Generator Engine is the first executable AppForge stage. It turns a validated Product Recipe and Factory Manifest into a separate, installable PWA source package without changing the running FireVault installation.

## Generation pipeline

1. Resolve a registered Product Recipe.
2. Build and validate its Generation Request and composed App Profile.
3. Load the versioned shared Field Vault core files.
4. Inject the generated profile through `src/generated-app-profile.js`.
5. assign a product-specific localStorage, sessionStorage, IndexedDB, and cache namespace.
6. Generate the PWA manifest, build metadata, architecture contracts, requirements, package report, and iOS handoff profile.
7. Assemble every file into a deterministic uncompressed ZIP locally in the browser.

## Package states

- `release-candidate`: Runtime package and recipe publication inputs are complete. FireVault currently has this state.
- `prototype-ready`: Runtime package is generated, but original brand assets or a verified database remain required.
- `blocked`: Request or profile validation failed and no package is emitted.

## Capability boundary

Build 1.00.0 generates a complete PWA source package and a native handoff profile. It does not create or sign an Xcode project, invent original production artwork, install an authoritative database, configure OAuth, upload files, or publish to an app store.

## Safety

The generator loads only versioned static application files. It never reads the active localStorage vault, IndexedDB media, backups, credentials, device identity, or OAuth tokens. Generated products receive an isolated storage namespace, and generation does not activate the recipe in FireVault.
