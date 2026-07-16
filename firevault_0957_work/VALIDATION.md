# FireVault Build 0.95.7 Validation

## Workflow-schema integration

- App Profile schema version 5 selects Directory, Account Detail, and Notes actions.
- `src/workflow-schema.js` exports the canonical action registry, Quick Photo defaults, filtering helpers, summaries, and export data.
- FireVault retains four Directory actions, four Account Detail actions, and four Notes actions.
- Each action requires both profile selection and its supporting module.
- Action grids automatically use the active action count.
- Quick Photo reads camera, image optimization, memory, overlay, report, account-change, retake, category, title, note, and caption behavior from the active preset.
- Quick Photo category validation uses the active Record Schema.
- Optional Quick Photo controls are wired safely when hidden.

## Architecture and compatibility

- Settings → About FireVault → Architecture & Modules displays the Workflow Schema inventory.
- Workflow Schema JSON can be downloaded from the application.
- Package includes `architecture/workflow-schema.json` and `architecture/WORKFLOW_SCHEMA.md`.
- Storage key remains `firevault_vault_build_030`.
- No record migration or key rename is required.

## Release checks

- JavaScript syntax checks pass for all application modules.
- All local ES-module imports resolve to packaged files.
- JSON files parse successfully.
- App Profile JSON matches schema version 5.
- Service-worker shell contains `workflow-schema.js` and all Build 0.95.7 application assets.
- FireVault action/module dependencies are satisfied.
- CSS braces are balanced.
- ZIP integrity check passes.

Physical iPhone and iPad confirmation remains recommended after deployment.
