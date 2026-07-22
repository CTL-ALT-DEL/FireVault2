# FireVault Build 1.03.23 Validation

## Account Directory and Account Detail cleanup contract

- Account Directory rows contain account identity only; no row renders Call, Route, Add Note, Photo, or Favorite controls.
- The retired top-account expanded state and action synchronization are absent from the active directory runtime.
- Every row remains a single tap, Enter, or Space target that opens its exact Account Detail screen.
- Immediate multi-word search, result counts, A-Z sorting, filtered scroll reset, and saved list position remain intact.
- Bottom navigation is explicitly kept visible during directory search and restored after the search field loses focus.
- Account Detail’s Details tab no longer renders the redundant large GPS & Navigation panel.
- Address, primary Route, location editing, Plus Code, and exact-location workflows remain available on their established surfaces.
- Account Detail tabs use individual shaded surfaces, alternating inactive depth, and a stronger active border and shadow.
- The dedicated Build 1.03.23 suite verifies markup removal, retained workflows, navigation recovery, and final tab geometry.

## Nearby Accounts workspace contract

- Map/List and category-filter controls retain their existing behavior in clearer 48px targets.
- The selected-account overlay shows distance, name, address, Account ID, and communicator category without covering the map controls.
- Existing Route and Call actions remain immediately available for the selected map account; Call disables safely when no phone is saved.
- Nearby cards expose readable bottom-right distance values and retain numbered, category-accented account identity.
- Every card opens its exact account by tap, Enter, or Space and reports the same selected state visually and accessibly.
- Touch and wheel movement use a temporary low-cost scrolling state, cancel safely, and settle without smooth-scroll feedback loops.
- The phone workspace remains vertically compact, short screens reduce only map height, and iPad widths use a side-by-side map/list layout.
- The dedicated Build 1.03.20 suite verifies active markup, accessibility, interaction state, scroll settling, and final responsive CSS.

## Account Directory search and navigation contract

- Every Account Directory row remains compact and contains no inline quick-action strip.
- Card taps and keyboard activation continue to open the exact account represented by that card.
- Search filters immediately for normal typing, paste, dictation, iOS composition input, native search events, and value changes.
- Multi-word queries match each word anywhere in the complete indexed account record.
- A changed search resets to the top and recalculates the scroll tail for the visible matches.
- The default directory sort label and selector option display the compact A-Z text.
- The four bottom-navigation buttons reserve 58px for their icon and label plus safe-area-aware outer height.
- The updated directory suite verifies compact markup, scroll settling, search events and matching, navigation persistence, and final responsive CSS.

## Add Account and address-confirmation contract

- Add Account uses a dedicated three-step workspace while Edit Account retains its existing maintenance form and saved fields.
- The new-account header provides Basics, Location, and Details navigation plus a live name/address readiness checklist.
- Fire alarm system fields and site notes remain available in a collapsed optional section.
- Every new account offers business or street-address search, current-location GPS lookup, and manual entry.
- Address search runs only after a deliberate Search tap or Enter key, requires a meaningful query, returns at most five matches, times out safely, and caches matches only for the current session.
- Each lookup match opens a structured review showing the commercial name when available, address components, and coordinates before fields are populated.
- Changing street, city, state, or ZIP invalidates a prior confirmation.
- Manually entered and corrected addresses require a final Confirm & Create review.
- Confirmed accounts retain the confirmation method, timestamp, geocode metadata when available, GPS coordinates, and offline Plus Code.
- Empty GPS inputs cannot be converted into the valid-looking coordinate 0,0.
- Lookup failure, no match, timeout, disabled assistance, and location-permission denial all preserve manual account creation.
- The dedicated Add Account suite verifies markup, controls, lookup boundaries, confirmation gates, persistence, responsive geometry, and final stylesheet order.

## New-user onboarding and first-account contract

- A fresh installation with no real vault opens the protected Demo Mode and shows only three short onboarding cards.
- Existing real-vault users do not receive the first-run popup after updating.
- The guide explains Demo Mode, Search, Nearby Accounts, Account Detail, and the first real-account transition.
- Every Add Account entry point asks whether to leave Demo Mode before real information is entered.
- Choosing Yes exits Demo Mode and loads an empty or existing real vault; choosing No opens a temporary practice form in Demo Mode.
- The first-account form offers GPS address assistance and manual entry without requesting location automatically.
- Address assistance performs one user-requested reverse lookup and caches that result only for the current session.
- FireVault displays the suggested address and any detected commercial location name before changing form fields.
- Yes applies the name, address, GPS, and Plus Code inputs; No retries; manual entry keeps GPS but does not insert the suggested address.
- Permission denial, unavailable GPS, lookup timeout, and no-match results return to manual entry without blocking account creation.
- The OpenStreetMap source is attributed in the confirmation popup and the lookup endpoint remains configurable in GPS settings data.
- The dedicated onboarding suite verifies Demo Mode isolation, first-run persistence, GPS privacy, address confirmation, business-name handling, fallbacks, and responsive geometry.

## Secondary list UI contract

- Contact, Equipment, Task, and Deficiency list screens retain their records, filters, quick actions, routes, and empty states.
- All four screens use the same compact three-column header with 44px Back and Add controls.
- Header account context remains visible and truncates safely when unusually long.
- Contact quick actions adapt to available buttons without forming a tall phone stack.
- Equipment and Deficiency quick actions remain in compact three-column grids; Task actions remain in two columns.
- Every list quick action and filter pill uses at least a 44px touch target.
- Cards keep titles, account metadata, notes, status pills, photo links, and existing state treatments readable.
- The narrowest phone layout moves status information below long titles while preserving compact action grids.
- The dedicated secondary-list suite verifies active markup, actions, filters, geometry, responsive behavior, and final stylesheet order.

## Secondary form UI contract

- Contact, Equipment, Task, and Deficiency editors retain every existing field and save/delete route.
- All four editors use the same live header, 44px Back control, left-aligned title, scroll-safe form body, content card, and sticky action contract.
- The existing dirty-route protection now displays the intended Unsaved state on each secondary-form header.
- Labels use 12.5px text; input, select, and textarea values remain 16px with at least 50px controls.
- Contact phone and email retain their specialized phone keyboard hints.
- Equipment status, service interval, checked date, and all three field actions remain connected.
- Task site, title, status, due date, notes, Save Task, and Delete Task remain connected.
- Deficiency site, title, priority, status, notes, matching-task choice, linked photos, Save, Save + Add Photo, and Delete remain connected.
- Paired fields and dual action bars collapse only at 360px and below.
- The dedicated secondary-form suite verifies active markup, dirty routes, fields, actions, responsive geometry, and final stylesheet order.

## Account form UI contract

- Add Account and Edit Account retain the configured Identity, Location, Fire Alarm System, GPS, Plus Code, and notes fields.
- The live form header now carries the existing `accountFormTop0760` contract so edited inputs display the intended Unsaved state.
- Account name, Account ID, phone, street, city, state, ZIP, latitude, and longitude retain their browser autocomplete and phone keyboard hints.
- Form labels, Required badges, section headings, error messages, and field hints use explicit readable sizes.
- Inputs remain 16px and at least 50px high to prevent iPhone focus zoom and support field use.
- Capture Current Location remains a 50px action without changing GPS or Plus Code behavior.
- The sticky Cancel / Create Account or Save Changes actions use 54–56px targets.
- The narrow-phone header removes only its explanatory sentence; the form title, state, Back control, sections, and every field remain available.
- The dedicated account-form suite verifies live markup, validation hooks, dirty-state protection, responsive overrides, and final stylesheet order.

## Photo workflow UI contract

- Quick Photo review retains the live preview, account confirmation, category, normal Photo Overlay, Technician Overlay, report inclusion, optional title/notes, Retake, and Save Photo controls.
- Category selects use a 16px phone-safe value size and toggle rows use 20px checkboxes with 50px touch targets.
- Quick Photo account confirmation, account picker rows, progress text, and sticky Retake / Save Photo actions use explicit readable sizes.
- The phone preview uses a bounded 16:10 workspace so the controls remain reachable without removing the exact overlay preview.
- Take Photo / Upload Photo retains all nine configured categories and displays them as three compact columns on phones.
- Category hints remain visible on larger screens and collapse on phones where the category names are self-explanatory.
- Imported-photo actions remain Preview Overlay, Download With Overlay, Download Original, and Clear Photo in a two-by-two phone grid.
- The dedicated photo-workflow suite confirms active markup, touch targets, responsive overrides, stylesheet order, and final Update Ready geometry order.

## Active-screen readability contract

- Account Directory names, addresses, metadata, issue badges, filter controls, and row actions use explicit readable sizes.
- Directory row actions use 46px targets and expand to 48px on narrow phones.
- Call, Route, Add Note, Photo, and Favorite labels remain single-line, clipped safely only if an unusually narrow custom workflow requires it.
- Phone-size Account Detail Back, primary-action, tab, panel, and inline-action labels override the retired smaller values.
- Settings Back, Done, and Save remain 44px targets with readable labels.
- Compact Photo Overlay field actions, field state, and preview status receive larger text without changing the disclosure layout.
- The existing bottom-right 14px Nearby distance contract remains active.
- The dedicated UI-readability suite checks the active markup and final stylesheet order.

## Runtime and offline asset integrity

- The HTML bootstrap contains 25 reviewed local stylesheet, module, manifest, icon, image, and application references.
- Every local HTML reference carries the current Build 1.03.23 cache token.
- All JavaScript imports are resolved from their source modules, exist inside the release, and carry the current build token.
- CSS `url(...)`, branding profile assets, Photo Overlay sample media, and all three visual Help images resolve to packaged files.
- All 30 runtime files are present in the 32-entry offline shell; the shell contains no duplicate or missing entry.
- Manifest start URL, scope, standalone display, orientation, and four in-scope shortcuts are validated.
- Manifest icons are real PNG files whose stored dimensions exactly match their declared 192×192 and 512×512 sizes.
- The runtime-asset suite performs 262 checks against the real release files.

## GitHub Pages deployment contract

- `.nojekyll` is present at repository root so GitHub Pages publishes the static PWA directly.
- `index.html`, `manifest.json`, `version.json`, `sw.js`, release instructions, and validation documents are present at repository root.
- `assets`, `src`, `tests`, and `architecture` are present as top-level directories.
- No nested FireVault build directory, `_config.yml`, or Ruby `Gemfile` can enter the deploy root.
- The deployment guide identifies the current build, explains root-level extraction, and warns against uploading the containing ZIP folder.
- The guide explains that only the newest workflow run matters and requires published `version.json` verification before updating the Home Screen app.
- Runtime HTML and service-worker references agree on Build 1.03.23 and reject asset references from Builds 1.03.0 through 1.03.9.

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

- JavaScript syntax passes for `app.js`, `storage.js`, `sw.js`, and all fifteen release regression tests.
- The runtime-asset integrity suite passes 262 HTML, import, CSS, manifest, icon, branding, help, and offline-shell checks.
- The deploy-root contract passes 29 direct-publish, file-placement, instruction, build-alignment, and stale-reference checks.
- The storage transition test passes with 20 isolated demo sites and one real site surviving a simulated reload.
- The vault upgrade-preservation test passes 41 realistic storage, recovery, backup, overlay, location, and service-worker isolation checks.
- The PWA upgrade-contract test verifies build alignment, deferred activation, old-cache cleanup, version freshness, navigation refresh, all 33 offline-shell assets, and final update-dialog geometry.
- The service-worker navigation smoke test executes fast-online, slow-online, offline, and first-install responses against the real worker code.
- The release-safety test covers build references, CSV persistence guards, Plus Code generation, progressive Photo Overlay navigation, Quick Photo and imported-photo composition, retired-style rejection, and the centered Update Ready recovery flow.
- The UI-readability contract verifies active Account Directory, Account Detail, Settings, Photo Overlay, and Nearby markup against the final responsive CSS overrides.
- The photo-workflow UI contract verifies Quick Photo review, account selection, imported-photo categories, overlay choices, and final action geometry.
- The account-form UI contract verifies Add/Edit Account fields, browser input hints, dirty-state protection, validation controls, and responsive action sizing.
- The secondary-form UI contract verifies Contact, Equipment, Task, and Deficiency fields, dirty states, support cards, field actions, and responsive save/delete geometry.
- The secondary-list UI contract verifies Contact, Equipment, Task, and Deficiency headers, cards, filters, quick actions, touch targets, and responsive list geometry.
- The new-user onboarding contract verifies the first-open guide, Demo Mode decision, GPS lookup, address confirmation, commercial-name suggestion, manual fallback, and form integration.
- The Add Account address-lookup contract verifies the redesigned setup workspace, explicit search, result review, change invalidation, manual confirmation, metadata persistence, and responsive presentation.
- The Account Directory top-actions contract verifies scroll-settled action visibility, immediate multi-word search, accessibility state, and unclipped bottom-navigation labels.
- Active runtime and service-worker references resolve to Build 1.03.23.
- `version.json`, the manifest, cache name, module imports, and release UI agree on Build 1.03.23.

## Scope and compatibility

- No new record type, schema, or storage service was added.
- The storage key remains `firevault_vault_build_030`; no migration is required.
- Existing Account ID matching and history-preservation rules are unchanged.
- Build 1.03.17 onboarding, Build 1.03.16 secondary-list cleanup, Build 1.03.15 secondary-form cleanup, Build 1.03.14 account-form cleanup, Build 1.03.13 photo workflow cleanup, Build 1.03.12 active-screen readability, Build 1.03.11 offline asset integrity, Build 1.03.10 GitHub Pages direct deployment, Build 1.03.9 vault preservation, Build 1.03.8 fresh-first navigation, Build 1.03.7 update geometry hardening, Build 1.03.6 lockup repair, Build 1.03.5 Photo Overlay cleanup, and all earlier data work remain intact.
