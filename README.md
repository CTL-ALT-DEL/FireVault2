# FireVault Build 0.50.39

Build 0.50.39 continues from the stable 0.50.38 baseline and adds a small Report Center closeout workflow polish item while preserving the fixed splash/header behavior and stable startup path.

## Changes

- Visible app version advanced to 0.50.39.
- Cache-busting references updated to 0.50.39.
- Added **Copy Closeout Packet** in Report Center.
- Closeout packet combines:
  - customer-facing closeout email
  - Customer Photo Ready Check
  - selected customer photo count
  - customer-facing captions
  - Customer Photo Summary
- Internal technician notes remain out of the customer-facing packet.
- Preserved **Copy Customer Email**.
- Preserved the fixed app header behavior from Build 0.50.37.
- Preserved the 5-second splash screen and Startup Health diagnostics.
- Preserved Customer Photo Ready Check, Customer Photo Captions, Customer Report Photo Selection, Deficiency Photo Workflow, Photo Vault tools, overlay tools, iPad autosizing, simple Home, and Search Bar Concept #6.
- Did not bring back job-status workflow buttons.

## Validation

```bash
node --check src/storage.js
node --check src/app.js
python -m json.tool manifest.json
zip -T firevault-build-0.50.39-modular-root.zip
```

## Suggested commit message

```text
Build 0.50.39 customer closeout packet copy
```
