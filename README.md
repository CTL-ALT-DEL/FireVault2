# FireVault Build 0.50.42

Build 0.50.42 continues from the stable 0.50.41 baseline and adds a combined closeout bundle copy action while preserving the fixed splash/header behavior, Home spacing polish, and stable startup path.

## Changes

- Visible app version advanced to 0.50.42.
- Cache-busting references updated to 0.50.42.
- Added **Copy Full Bundle** in Report Center.
- Full Bundle combines:
  - customer-facing closeout packet
  - customer photo ready check
  - selected customer photo captions
  - technician closeout packet
  - internal photo notes
  - linked deficiencies
  - open tasks
  - open deficiencies
- Preserved **Copy Customer Email**, **Copy Closeout Packet**, and **Copy Tech Packet**.
- Preserved the fixed app header behavior from Build 0.50.37.
- Preserved the 5-second splash screen and Startup Health diagnostics.
- Preserved Customer Photo Ready Check, Customer Photo Captions, Customer Report Photo Selection, Deficiency Photo Workflow, Photo Vault tools, overlay tools, iPad autosizing, simple Home, Search Bar Concept #6, and Home spacing polish.
- Did not bring back job-status workflow buttons.

## Validation

```bash
node --check src/storage.js
node --check src/app.js
python -m json.tool manifest.json
zip -T firevault-build-0.50.42-modular-root.zip
```

## Suggested commit message

```text
Build 0.50.42 full closeout bundle copy
```
