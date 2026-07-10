# Clean Install Notes — FireVault Build 0.50.76

This ZIP is the clean baseline for FireVault Build 0.50.76.

## Install

1. Extract the ZIP.
2. Upload the extracted root contents to the GitHub Pages branch/root.
3. Confirm `index.html`, `manifest.json`, `src/`, and `assets/` are at the web root.
4. Commit and push the replacement files.
5. After GitHub Pages deploys, hard refresh the browser or clear the installed PWA cache if the old build number remains visible.

## Build focus

- Fixes Settings returning to the top after presets, saves, and submenu navigation.
- Keeps separate remembered positions for the Settings menu and individual detail pages.
- Preserves Build 0.50.75 functionality and visual design.
- Keeps the Home screen simple and keeps FIRE red with VAULT white.

## Recommended check

Open **Settings → Modules**, scroll down, change a module or preset, and press Save. The page should remain at the same location. Then return to the Settings menu and reopen Modules; both screens should restore their previous positions.
