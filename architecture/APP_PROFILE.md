# FireVault App Profile

FireVault Build 1.03.25 uses `src/app-profile.js` as the active configuration for identity, terminology, modules, record data, workflow presets, branding, content packs, storage policy, AppForge blueprint participation, product recipes, factory manifests, and generated PWA packages.

The FireVault profile remains optimized for fire alarm technicians. Shared screens consume the profile so future AppForge products can change terminology, enabled modules, fields, detail sections, photo categories, action surfaces, Quick Photo behavior, brand assets, content packs, approved storage providers, backup rules, and collaboration policy without rewriting the shared application core.

The active profile uses schema version 12 with:

- `fire-alarm-technician` workflow preset
- `firevault-dark` Theme Profile
- `firevault-content-v1` Content Pack Registry
- `firevault-local-first` Sync & Storage Profile
- AppForge Product Blueprint validation and export
- AppForge Product Recipe validation and export
- AppForge Factory Request and Manifest generation
- AppForge Generator Engine package generation

Build 1.03.25 keeps AppForge out of the normal technician-facing Settings interface. Existing factory and generator tools are available only when FireVault is opened with the explicit `?appforge=1` developer query.

## Build 1.00.0 generator configuration

App Profile schema 12 adds `appForgeGenerator` integration and enables `core.appForgeGenerator`. The active FireVault profile remains unchanged while the generator can:

- Normalize a Product Recipe into a versioned Generation Request
- Compose a deterministic App Profile
- Validate both request inputs and the resulting blueprint
- Identify required brand assets and verified databases
- Describe expected PWA and native-profile outputs
- Enforce customer-data, credential, activation, and publishing guardrails
- Inject a generated profile through `src/generated-app-profile.js`
- Assign an isolated product storage namespace
- Package a complete offline-ready PWA ZIP locally in the browser

Generated packages are static source handoffs, not customer-data exports or automatic app-store submissions. FireVault keeps its current local vault, IndexedDB media, automatic snapshots, complete exports, WebDAV backup, Microsoft profile readiness, and manual package-exchange workflow.
