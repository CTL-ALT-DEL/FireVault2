# FireVault
## Build 0.99.0 — AppForge Factory Manifest

Build 0.99.0 converts every registered Product Recipe into a deterministic factory handoff while preserving FireVault as the active fire-alarm technician app.

### Integrated

- Added `src/app-forge-factory.js` with a versioned Generation Request schema.
- Added `core.appForgeFactory` to Module Registry version 8.
- Advanced the App Profile to schema version 11 with factory-manifest support.
- Added normalized generation requests covering identity, terminology, branding, modules, content, storage, and output targets.
- Added separate request and composed-profile validation gates.
- Added Factory Manifests containing output inventories, missing requirements, safety guardrails, and the validated blueprint.
- Added Request Template, Factory Manifest, and Factory Request Schema downloads under Architecture & Modules.
- Added a compact recipe-to-manifest pipeline and readiness comparison for all four products.

### Factory results

- **FireVault:** factory-ready and publication-ready at the manifest level.
- **Wyoming Explorer:** factory-ready; brand assets and verified database required.
- **Wyoming Fishing Guide:** factory-ready; brand assets, verified locations, and current regulations required.
- **Ghost Towns Guide:** factory-ready; brand assets and verified historic-sites database required.

### Capability honesty

Build 0.99.0 defines the generation contract and expected outputs. It does not claim to generate an Xcode project, install databases, create original brand assets, configure OAuth, or publish an app automatically.

### Safety and compatibility

Every manifest locks in these guardrails: active FireVault unchanged, customer data excluded, credentials excluded, recipe activation disabled, and automatic publishing disabled. Storage key `firevault_vault_build_030` and all technician workflows remain compatible.
