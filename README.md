# FireVault Build 0.50.45

Build 0.50.45 continues from the stable 0.50.44 baseline and adds Deficiency Closeout Polish while preserving the fixed splash/header behavior, Home spacing polish, Site Quick Actions, and stable startup path.

## Changes

- Visible app version advanced to 0.50.45.
- Cache-busting references updated to 0.50.45.
- Added **Deficiency Closeout Polish**.
- Added new deficiency closeout fields:
  - Next Action / Parts Needed
  - Resolution Notes
  - Customer Note
- Added **Copy Closeout** on deficiency cards.
- Added **Copy Closeout** on the deficiency edit screen.
- Added **Close With Note** on the deficiency edit screen.
- Added **Need Closeout** count for closed deficiencies missing resolution notes.
- Preserved Site Quick Actions, Customer Report Photo tools, Deficiency Photo Workflow, Photo Vault tools, overlay tools, fixed splash/header behavior, the 5-second splash screen, Startup Health diagnostics, Home spacing polish, iPad autosizing, simple Home screen, and Search Bar Concept #6.
- Did not bring back job-status workflow buttons.

## Validation

Run from the project root:

```bash
node --check src/storage.js
node --check src/app.js
python -m json.tool manifest.json > /dev/null
zip -T firevault-build-0.50.45-modular-root.zip
```

## Suggested commit message

```text
Build 0.50.45 deficiency closeout polish
```
