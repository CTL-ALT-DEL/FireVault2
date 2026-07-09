# FireVault Build 0.50.8

Build 0.50.8 continues from the uploaded 0.50.7 baseline and polishes the Daily Report / Site Notes workflow while preserving the simple Home screen, Search Bar Concept #6, and iPad responsive sizing.

## What changed

- Visible app version advanced to 0.50.8.
- Updated cache-busting references in `index.html` to 0.50.8.
- Added autosaved Site Note drafts per site.
- Added a Clear Draft control in the Site Notes composer.
- Added Daily Report "Report Ready Check" cards for notes, drafts, route status, and deficiencies.
- Added an Unsaved Note Drafts section on the Daily Report screen so drafts can be opened before copying the final report.
- Preserved the clean Home screen and selected Search Bar Concept #6.
- Preserved Build 0.50.7 iPad autosizing / responsive layout work.
- Did not bring back Start Job / End Job / Arrived / Working / Complete workflow controls.

## Validation

Before release, validate:

```bash
node --check src/storage.js
node --check src/app.js
python3 -m json.tool manifest.json >/dev/null
zip -T firevault-build-0.50.8-modular-root.zip
```

## Suggested commit message

```text
Build 0.50.8 daily report draft safety polish
```
