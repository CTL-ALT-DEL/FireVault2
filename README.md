# FireVault

## Build 1.03.13 — Photo Workflow Cleanup

Build 1.03.13 is a no-new-features UI cleanup release. It makes Quick Photo review and Take Photo / Upload Photo easier to scan and operate on phones without changing photo storage, overlays, categories, or report behavior.

### Updated

- Tightens the Quick Photo review sheet while keeping the image preview, account confirmation, category, overlay choices, notes, Retake, and Save Photo visible and touch-safe.
- Enlarges Quick Photo account, toggle, category, and footer text and keeps iPhone form controls at zoom-safe sizes.
- Replaces the nine-category phone stack with a compact three-column selector; descriptive hints remain available on larger screens.
- Replaces the four imported-photo action rows with a touch-safe two-by-two phone grid.
- Keeps Photo Overlay, Technician Overlay, report inclusion, original download, overlay download, preview, and clear-photo behavior unchanged.
- Adds an automated photo-workflow UI contract and retains Build 1.03.12 active-screen readability plus all existing update, vault, deployment, and offline safeguards.
- Changes no records, storage schema, settings behavior, or technician features.

### Run locally

From this folder, run `python3 -m http.server 8000`, then open `http://localhost:8000`. Use HTTPS for real GPS permission outside localhost.

### Developer access

Existing AppForge tools remain hidden from normal technician use. Open `http://localhost:8000/?appforge=1`, then Settings → About FireVault → AppForge Factory.

### Compatibility

The active storage key remains `firevault_vault_build_030`; no schema migration is required. Existing CSV matching, account history, and all prior field workflows remain compatible.
