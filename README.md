# FireVault

## Build 1.03.10 — GitHub Pages Direct Deploy

Build 1.03.10 is a no-new-features deployment-stability release. The package now publishes directly through GitHub Pages without Jekyll, carries current deployment instructions, and verifies that every required app file is at repository root before release.

### Updated

- Adds the `.nojekyll` marker so GitHub Pages serves the static PWA directly instead of invoking an unnecessary Jekyll build.
- Replaces the outdated deployment note with exact repository-root extraction and version-verification instructions.
- Adds a deployment contract covering required root files and directories, stale asset versions, forbidden nested release folders, and Jekyll/Ruby build files.
- Clarifies that only the newest GitHub Pages run for the newest commit needs to succeed.
- Retains Build 1.03.9 vault-preservation checks, Build 1.03.8 fresh-first navigation, and Build 1.03.7 update geometry hardening.
- Changes no records, storage schema, settings, or technician features.

### Run locally

From this folder, run `python3 -m http.server 8000`, then open `http://localhost:8000`. Use HTTPS for real GPS permission outside localhost.

### Developer access

Existing AppForge tools remain hidden from normal technician use. Open `http://localhost:8000/?appforge=1`, then Settings → About FireVault → AppForge Factory.

### Compatibility

The active storage key remains `firevault_vault_build_030`; no schema migration is required. Existing CSV matching, account history, and all prior field workflows remain compatible.
