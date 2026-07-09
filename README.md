# FireVault Build 0.50.10

Build 0.50.10 continues from the uploaded 0.50.9 baseline and upgrades the Photo Overlay settings into a more functional editor while preserving the simple Home screen, Search Bar Concept #6, Daily Report / Site Notes workflow, and iPad responsive sizing.

## What changed

- Visible app version advanced to 0.50.10.
- Updated cache-busting references in `index.html` to 0.50.10.
- Rebuilt **Photo Overlay** settings with an actual sample-photo preview instead of a plain static bar.
- Added an editable overlay text template.
- Added tap-to-insert chips showing every available overlay `{field}`.
- Added live preview updates for position, font size, background style, opacity, accent color, text color, logo badge, and tagline.
- Added new overlay fields: `{address}`, `{city}`, `{state}`, `{zip}`, `{time}`, `{license}`, `{gps}`, and `{build}`.
- Preserved the Daily Report / Site Notes closeout actions from Build 0.50.9.
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
zip -T firevault-build-0.50.10-modular-root.zip
```

## Suggested commit message

```text
Build 0.50.10 photo overlay settings editor
```
