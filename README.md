# FireVault Build 0.50.9

Build 0.50.9 continues from the uploaded 0.50.8 baseline and polishes the Daily Report / Site Notes closeout workflow while preserving the simple Home screen, Search Bar Concept #6, and iPad responsive sizing.

## What changed

- Visible app version advanced to 0.50.9.
- Updated cache-busting references in `index.html` to 0.50.9.
- Added **Save + Report** on the Site Notes composer so a note can be saved and the Daily Report opened in one tap.
- Added **Notes Only** copy on the Daily Report screen for a clean saved-site-notes closeout text.
- Notes Only copy includes an unsaved draft warning if any site still has a draft note waiting to be saved or cleared.
- Preserved autosaved Site Note drafts per site.
- Preserved Clear Draft, Report Ready Check, Unsaved Drafts, Full Report, Customer Copy, and TXT download.
- Preserved the clean Home screen and selected Search Bar Concept #6.
- Preserved iPad autosizing / responsive layout work.
- Did not bring back Start Job / End Job / Arrived / Working / Complete workflow controls.

## Validation

Before release, validate:

```bash
node --check src/storage.js
node --check src/app.js
python3 -m json.tool manifest.json >/dev/null
zip -T firevault-build-0.50.9-modular-root.zip
```

## Suggested commit message

```text
Build 0.50.9 daily report closeout actions
```
