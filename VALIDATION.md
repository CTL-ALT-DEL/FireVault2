# FireVault Build 1.03.10 Validation

## GitHub Pages deployment contract

- `.nojekyll` is present at repository root so GitHub Pages publishes the static PWA directly.
- `index.html`, `manifest.json`, `version.json`, `sw.js`, release instructions, and validation documents are present at repository root.
- `assets`, `src`, `tests`, and `architecture` are present as top-level directories.
- No nested FireVault build directory, `_config.yml`, or Ruby `Gemfile` can enter the deploy root.
- The deployment guide identifies the current build, explains root-level extraction, and warns against uploading the containing ZIP folder.
- The guide explains that only the newest workflow run matters and requires published `version.json` verification before updating the Home Screen app.
- Runtime HTML and service-worker references agree on Build 1.03.10 and reject asset references from Builds 1.03.0 through 1.03.9.

## Vault upgrade preservation

- The production vault key remains `firevault_vault_build_030`; normal build updates do not create a replacement vault namespace.
- The device identity remains stable through save and reload.
- A realistic account retains its Account ID, address, panel data, access notes, contacts, tasks, deficiencies, and site-note history.
- Account GPS, account Plus Code, preferred entrance, entrance GPS, and entrance Plus Code survive save and reload.
- Photo category, customer caption, media reference, linked deficiency, storage destination, and both per-photo overlay choices survive save and reload.
- Photo Overlay layout, colors, template, custom field layout, Technician Overlay fields/alignment, technician profile, and Plus Code settings survive save and reload.
- A first real save creates a rolling safety snapshot and a second save preserves the prior revision in the recovery copy.
- A populated real vault keeps Demo Mode off after reload.
- The service worker contains no customer-storage key and no `localStorage`, `sessionStorage`, or `indexedDB` access.

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
- Photo Overlay remains visible whenever either Photos or Photo Overlay is enabled in the active profile.
- The Photo Overlay detail page includes visible Back and Done controls.
- Only one Back control is rendered inside the Photo Overlay detail page.
- The live preview and Compact, Standard, and Detailed presets remain immediately visible.
- Photo Information, Layout, Branding, and Technician Overlay open as compact disclosure sections, with only one advanced section open at a time.
- Each active photo field stays collapsed until tapped, then exposes its existing line, alignment, order, and remove controls.
- Desktop layouts keep the preview beside the controls; phone layouts return the preview to the normal document flow.
- Compact, Standard, and Detailed presets remain wired.
- Field add, remove, reorder, line-break, and left/center/right alignment controls remain wired.
- Position, background style, text size, opacity, accent, text color, logo, and tagline controls remain wired.
- Custom-logo upload, FireVault-logo restore, and custom-logo clear remain wired.
- Technician Overlay fields, ordering, line breaks, group alignment, reset, and independent auto-save remain wired.
- A non-Other category produces `FIREVAULT FIELD NOTES - {CATEGORY}` in preview and export.
- Other produces `FIREVAULT FIELD NOTES` without a category suffix.
- Quick Photo and Take Photo / Upload Photo both expose an independent Add Technician Overlay option.
- The per-photo Technician Overlay choice persists without changing the normal Photo Overlay settings.

## Update Ready regression

- The dialog is centered in a large card over a full-screen blurred backdrop.
- A final canonical geometry block pins the modal to the viewport after every older application style.
- The container and dialog use safe-area-aware padding, bounded height, contained scrolling, and explicit transform resets.
- No retired left-50-percent, bottom-docked, compact-banner, or forced child-grid rules remain for the update modal container.
- A backdrop tap dismisses the prompt before installation starts, providing a safe escape path if presentation ever fails.
- Safe-to-install and local-data-protection messages remain visible before installation.
- Install Update, Release Notes, and Later use readable, touch-safe controls.
- The service worker does not call `skipWaiting()` during installation.
- Install Update sends exactly one `SKIP_WAITING` message after a deliberate tap.
- Activation or `controllerchange` reloads FireVault once.
- A failed message restores enabled Try Again and Reload App controls immediately.
- An eight-second activation timeout restores the same usable controls instead of leaving the popup locked.
- Duplicate update detections reuse the existing dialog rather than stacking another popup.

## Navigation bootstrap regression

- A fast navigation-preload response is returned immediately and written to the active cache.
- A slow response yields to cached HTML after the 1.8-second freshness window instead of blocking FireVault.
- The slow response remains alive through `waitUntil` and refreshes the cache after fallback.
- An offline network failure returns cached HTML without changing the saved vault.
- A first online load with no cached page waits for and returns the network response.

## Static checks

- JavaScript syntax passes for `app.js`, `storage.js`, `sw.js`, and all six release regression tests.
- The deploy-root contract passes 29 direct-publish, file-placement, instruction, build-alignment, and stale-reference checks.
- The storage transition test passes with 20 isolated demo sites and one real site surviving a simulated reload.
- The vault upgrade-preservation test passes 41 realistic storage, recovery, backup, overlay, location, and service-worker isolation checks.
- The PWA upgrade-contract test verifies build alignment, deferred activation, old-cache cleanup, version freshness, navigation refresh, all 33 offline-shell assets, and final update-dialog geometry.
- The service-worker navigation smoke test executes fast-online, slow-online, offline, and first-install responses against the real worker code.
- The release-safety test covers build references, CSV persistence guards, Plus Code generation, progressive Photo Overlay navigation, Quick Photo and imported-photo composition, retired-style rejection, and the centered Update Ready recovery flow.
- Active runtime and service-worker references resolve to Build 1.03.10.
- `version.json`, the manifest, cache name, module imports, and release UI agree on Build 1.03.10.

## Scope and compatibility

- No new record type, schema, or storage service was added.
- The storage key remains `firevault_vault_build_030`; no migration is required.
- Existing Account ID matching and history-preservation rules are unchanged.
- Build 1.03.9 vault preservation, Build 1.03.8 fresh-first navigation, Build 1.03.7 update geometry hardening, Build 1.03.6 lockup repair, Build 1.03.5 Photo Overlay cleanup, and all earlier data work remain intact.
