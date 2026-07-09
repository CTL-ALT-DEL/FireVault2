# FireVault Build 0.50.26

Build 0.50.26 continues from the stable Build 0.50.25 baseline and adds Customer Report Photo Selection so account photos can be selected for the customer report package without disturbing the stable startup path.

## Changes

- Visible app version advanced to 0.50.26.
- Updated cache-busting references in `index.html` to 0.50.26.
- Added Customer Report Photo Selection in Report Center.
- Added Include in customer report checkbox on the account photo form.
- Report Center now shows a customer-photo picker with selected / included status.
- Selected photos are listed in the generated TXT customer report with category, title, deficiency link, and notes.
- Preserved Deficiency Photo Workflow from Build 0.50.25.
- Preserved Photo Vault search, filters, sorting, Copy List, overlay preview, Download With Overlay, and Download Original.
- Preserved Startup Health diagnostics, 5-second splash timing, and the stable Safari EOF startup repair.
- Preserved simple Home screen, Search Bar Concept #6, iPad autosizing, and hidden advanced modules.
- Did not bring back Start Job / End Job / Arrived / Working / Complete workflow controls.

## Validation

Run from the ZIP root after extraction:

```bash
node --check src/storage.js
node --check src/app.js
python -m json.tool manifest.json >/dev/null
zip -T firevault-build-0.50.26-modular-root.zip
```

## Suggested commit message

```text
Build 0.50.26 customer report photo selection
```
