# FireVault Build 1.03.1 Validation

## Customer CSV regression

- A fresh local-storage profile starts in the protected 20-account Demo Mode without creating a real vault.
- Confirming Customer CSV preparation clears the Demo Mode flag before the file is analyzed.
- `loadData({allowEmptyReal:true})` supplies an empty normalized real vault on a fresh installation instead of reopening the demo dataset.
- A populated existing real vault remains the CSV comparison and merge target.
- CSV import is blocked if Demo Mode is still active at final confirmation.
- Success is shown only after every selected Account ID is found in the persisted real vault.
- Reloading after a successful first import keeps Demo Mode off and reloads the imported real account.
- A rejected save shows a failure state and does not claim that the customer records were saved.

## Update Ready regression

- The service worker does not call `skipWaiting()` during installation.
- Install Update sends exactly one `SKIP_WAITING` message after a deliberate tap.
- Activation or `controllerchange` reloads FireVault once.
- A failed message restores enabled Try Again and Reload App controls immediately.
- An eight-second activation timeout restores the same usable controls instead of leaving the popup locked.
- Duplicate update detections reuse the existing dialog rather than stacking another popup.

## Static checks

- JavaScript syntax passes for `app.js`, `storage.js`, `sw.js`, and both release regression tests.
- The storage transition test passes with 20 isolated demo sites and one real site surviving a simulated reload.
- The release-safety test passes 13 assertions covering build references, CSV persistence guards, and Update Ready recovery.
- Active runtime and service-worker references resolve to Build 1.03.1.
- `version.json`, the manifest, cache name, module imports, and release UI agree on Build 1.03.1.

## Scope and compatibility

- No new field workflow, record type, schema, or storage service was added.
- The storage key remains `firevault_vault_build_030`; no migration is required.
- Existing Account ID matching and history-preservation rules are unchanged.
- Build 1.03.0 UI cleanup, independent overlay settings, Help, and update-recovery design remain intact.
