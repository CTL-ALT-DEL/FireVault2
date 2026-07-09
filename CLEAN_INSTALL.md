# Clean Install Notes — FireVault Build 0.50.25

This ZIP is intended to be used as the clean baseline for FireVault Build 0.50.25.

## Install

1. Extract the ZIP.
2. Commit all files to the FireVault GitHub repository.
3. Push to GitHub Pages.
4. Clear browser/PWA cache if the previous build remains visible.
5. Open the deployed PWA and confirm the visible build number shows `0.50.25`.

## Build focus

Build 0.50.25 keeps the stable 0.50.24 photo workflow and adds Deficiency Photo Workflow:

- `Save + Add Photo` from the Deficiency form.
- `+ Photo` quick action from deficiency cards.
- Linked deficiency photo thumbnails on deficiency cards and edit screens.
- Deficiency-linked photo records saved in the Photo Vault.
- Photo Vault search includes deficiency-linked metadata.

## Stability notes

- Startup path was intentionally left alone.
- The 5-second splash timing and startup watchdog are preserved.
- JavaScript validation and ZIP integrity checks were run before release.
