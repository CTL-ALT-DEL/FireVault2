# FireVault Build 1.03.3 Validation

## Customer CSV regression

- A fresh local-storage profile starts in the protected 20-account Demo Mode without creating a real vault.
- Confirming Customer CSV preparation clears the Demo Mode flag before the file is analyzed.
- `loadData({allowEmptyReal:true})` supplies an empty normalized real vault on a fresh installation instead of reopening the demo dataset.
- A populated existing real vault remains the CSV comparison and merge target.
- CSV import is blocked if Demo Mode is still active at final confirmation.
- Success is shown only after every selected Account ID is found in the persisted real vault.
- Reloading after a successful first import keeps Demo Mode off and reloads the imported real account.
- A rejected save shows a failure state and does not claim that the customer records were saved.

## CSV Plus Code checks

- Coordinates supplied by the CSV generate a valid full Plus Code.
- Coordinates calculated from an address generate the same code path before import.
- Existing coordinates on an updated account also receive a refreshed code.
- Generation uses the saved 10- or 11-digit account precision setting.
- CSV row preview displays the code beside latitude and longitude.
- The saved account and imported-account detail card retain the code.
- Import results and synchronization activity include the Plus Code count.
- The known coordinate pair `41.14, -104.8202` produces valid code `85HQ45RH+2W` at 10-digit precision.

## Photo Overlay checks

- Settings home exposes Photo Overlay as its own row instead of hiding it inside Profile.
- The Photo Overlay detail page includes visible Back and Done controls.
- Compact, Standard, and Detailed presets remain wired.
- Field add, remove, reorder, line-break, and left/center/right alignment controls remain wired.
- Position, background style, text size, opacity, accent, text color, logo, and tagline controls remain wired.
- Custom-logo upload, FireVault-logo restore, and custom-logo clear remain wired.
- Technician Overlay fields, ordering, line breaks, group alignment, reset, and independent auto-save remain wired.

## Update Ready regression

- The dialog is centered in a large card over a full-screen blurred backdrop.
- Safe-to-install and local-data-protection messages remain visible before installation.
- Install Update, Release Notes, and Later use readable, touch-safe controls.
- The service worker does not call `skipWaiting()` during installation.
- Install Update sends exactly one `SKIP_WAITING` message after a deliberate tap.
- Activation or `controllerchange` reloads FireVault once.
- A failed message restores enabled Try Again and Reload App controls immediately.
- An eight-second activation timeout restores the same usable controls instead of leaving the popup locked.
- Duplicate update detections reuse the existing dialog rather than stacking another popup.

## Static checks

- JavaScript syntax passes for `app.js`, `storage.js`, `sw.js`, and both release regression tests.
- The storage transition test passes with 20 isolated demo sites and one real site surviving a simulated reload.
- The release-safety test covers build references, CSV persistence guards, Plus Code generation, Photo Overlay access and wiring, and the centered Update Ready recovery flow.
- Active runtime and service-worker references resolve to Build 1.03.3.
- `version.json`, the manifest, cache name, module imports, and release UI agree on Build 1.03.3.

## Scope and compatibility

- No new record type, schema, or storage service was added.
- The storage key remains `firevault_vault_build_030`; no migration is required.
- Existing Account ID matching and history-preservation rules are unchanged.
- Build 1.03.2 CSV Plus Codes, Photo Overlay access, and real-vault CSV persistence remain intact.
