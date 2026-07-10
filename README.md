# FireVault Build 0.50.76

Build 0.50.76 continues directly from the stable 0.50.75 baseline. It fixes Settings scroll-position loss without redesigning existing screens or changing the Home layout.

## Changes

- Advanced the visible build and cache-busting references to **0.50.76**.
- Settings now preserves the current scroll position after:
  - toggling modules while editing
  - applying Quick View presets
  - applying Quick Layout presets
  - saving settings
  - theme and other Settings rerenders
  - entering and returning from Settings detail pages
  - opening Diagnostics or Data Tools from Settings and returning
- Stores separate scroll positions for the Settings main menu and each Settings detail section.
- Uses session-scoped restoration so normal app data and saved customer information are untouched.
- Preserved all existing functionality, the simple Home screen, optional module cards, active-preset highlighting, iPhone/iPad responsive behavior, and the FIRE-red / VAULT-white branding standard.

## Validation

Run from the project root:

```bash
node --check src/storage.js
node --check src/app.js
python -m json.tool manifest.json > /dev/null
zip -T firevault-build-0.50.76-modular-root.zip
```

## Suggested commit message

```text
Build 0.50.76 preserve Settings scroll position
```
