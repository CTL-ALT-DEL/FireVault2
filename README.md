# FireVault Build 0.50.12

Build 0.50.12 continues from the uploaded 0.50.11 baseline and connects the improved Photo Overlay settings to the Site Documents / Photos workflow while preserving the simple Home screen, Search Bar Concept #6, Daily Report / Site Notes workflow, and iPad responsive sizing.

## What changed

- Visible app version advanced to 0.50.12.
- Updated cache-busting references in `index.html` to 0.50.12.
- Added **Photo Vault** support inside Site Documents / Photos.
- Added photo upload on the Add/Edit Document screen.
- Saved photo documents now show thumbnails in the Documents / Photos list.
- Added **Download With Overlay** for saved or newly selected photos.
- Overlay export uses the current Photo Overlay settings, including template text, position, font size, background style, opacity, colors, FireVault logo, custom logo, and tagline.
- Added quick access from a photo document to Photo Overlay settings.
- Preserved the improved Photo Overlay editor from Build 0.50.11.
- Preserved autosaved Site Note drafts, Report Ready Check, Unsaved Drafts, Full Report, Customer Copy, Notes Only copy, and TXT download.
- Preserved iPad autosizing / responsive layout work.
- Preserved the clean Home screen and selected Search Bar Concept #6.
- Did not bring back Start Job / End Job / Arrived / Working / Complete workflow controls.

## Validation

Before release, validate:

```bash
node --check src/storage.js
node --check src/app.js
python3 -m json.tool manifest.json >/dev/null
zip -T firevault-build-0.50.12-modular-root.zip
```

## Suggested commit message

```text
Build 0.50.12 photo vault overlay export workflow
```
