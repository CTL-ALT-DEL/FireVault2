# FireVault

## Build 1.03.11 — Offline Asset Integrity

Build 1.03.11 is a no-new-features runtime-integrity release. The complete HTML, JavaScript, CSS, manifest, branding, help-image, icon, and offline-cache graph is now traced and verified before packaging so GitHub cannot publish a partially broken PWA.

### Updated

- Traces 30 runtime files from the actual HTML bootstrap, module imports, CSS URLs, manifest, branding configuration, and in-app help references.
- Verifies every runtime file exists and belongs to the 32-entry offline shell.
- Verifies all versioned HTML, JavaScript, CSS, and service-worker references use the current build token.
- Validates manifest scope, standalone display, shortcuts, icon paths, PNG signatures, and exact 192×192 and 512×512 dimensions.
- Retains Build 1.03.10 direct GitHub Pages publishing, Build 1.03.9 vault preservation, and all update-dialog hardening.
- Changes no records, storage schema, settings, or technician features.

### Run locally

From this folder, run `python3 -m http.server 8000`, then open `http://localhost:8000`. Use HTTPS for real GPS permission outside localhost.

### Developer access

Existing AppForge tools remain hidden from normal technician use. Open `http://localhost:8000/?appforge=1`, then Settings → About FireVault → AppForge Factory.

### Compatibility

The active storage key remains `firevault_vault_build_030`; no schema migration is required. Existing CSV matching, account history, and all prior field workflows remain compatible.
