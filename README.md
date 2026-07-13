# FireVault Build 0.83.0 — Performance and Reliability

Build 0.83.0 improves speed and installed-PWA reliability without adding features or changing the focused 0.82.0 interface.

## Improvements
- Preloads core JavaScript modules to shorten startup dependency loading.
- Uses the cached application shell immediately when launched as an installed PWA, then refreshes it in the background.
- Defers automatic GPS work until the interface is responsive.
- Debounces account search to prevent a full list pass on every keystroke.
- Reduces rendering work for off-screen account and content cards.
- Adds internal startup performance measurement for later diagnostics.
- Corrects the internal storage-module build identifier.

## Preserved
Accounts, Site Notes, Nearby Accounts, Building Navigator, Files, Photos, Reports, Library, focused field tools, the existing storage key, and all customer data.
