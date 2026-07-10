# FireVault Build 0.53.1

Build 0.53.1 is the first larger milestone release after the stable 0.50.76 baseline. It improves Home-screen organization and responsive iPad sizing without redesigning existing workflows.

## Changes

- Advanced the visible build and cache-busting references to **0.53.1**.
- Added collapsible Home cards for:
  - Pinned Sites
  - Field Focus
  - Nearby Accounts
  - Recent Accounts
- Home cards remain open by default and remember their open/closed state between app sessions.
- Collapse controls update in place without rerendering the Home screen or changing the current scroll position.
- Added responsive Home grouping for phone, iPad portrait, and iPad landscape layouts.
- iPad landscape now uses available width for paired dashboard sections while portrait layouts remain single-column and touch-friendly.
- Preserved the Build 0.50.76 Settings scroll-position recovery.
- Preserved all existing data, routes, sites, reports, settings, module presets, and FIRE-red / VAULT-white branding.

## Validation

Run from the project root:

```bash
node --check src/storage.js
node --check src/app.js
python -m json.tool manifest.json > /dev/null
zip -T firevault-build-0.53.1-modular-root.zip
```

## Suggested commit message

```text
Build 0.53.1 add responsive collapsible Home cards
```
