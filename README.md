# FireVault

## Build 1.03.12 — Active-Screen Readability

Build 1.03.12 is a no-new-features UI cleanup release. It improves the smallest labels and touch targets on the screens technicians use most while preserving the compact Photo Overlay workspace and every existing workflow.

### Updated

- Enlarges Account Directory names, addresses, metadata, issue badges, quick actions, and filter controls.
- Keeps Add Note and Favorite on one line with readable labels and 46–48px action targets.
- Improves phone-size Account Detail Back, primary-action, tab, and inline-action labels.
- Improves Settings header controls and the smallest Photo Overlay field-action and status labels without expanding the workspace.
- Preserves the larger bottom-right Nearby distance, the star-only Account Detail favorite, and the hardened Update Ready dialog.
- Adds an automated UI-readability contract and retains the complete runtime/offline integrity suite from Build 1.03.11.
- Changes no records, storage schema, settings behavior, or technician features.

### Run locally

From this folder, run `python3 -m http.server 8000`, then open `http://localhost:8000`. Use HTTPS for real GPS permission outside localhost.

### Developer access

Existing AppForge tools remain hidden from normal technician use. Open `http://localhost:8000/?appforge=1`, then Settings → About FireVault → AppForge Factory.

### Compatibility

The active storage key remains `firevault_vault_build_030`; no schema migration is required. Existing CSV matching, account history, and all prior field workflows remain compatible.
