# FireVault Build 0.50.41

Build 0.50.41 continues from the stable 0.50.39 baseline and adds a technician-facing closeout packet copy action while preserving the fixed splash/header behavior and stable startup path.

## Changes

- Visible app version advanced to 0.50.41.
- Cache-busting references updated to 0.50.41.
- Added **Copy Tech Packet** in Report Center.
- Technician packet combines:
  - Customer Photo Ready Check
  - selected photo captions
  - internal photo notes
  - linked deficiencies
  - open tasks
  - open deficiencies
- Preserved **Copy Closeout Packet** and **Copy Customer Email** for customer-facing copy.
- Preserved the fixed app header behavior from Build 0.50.37.
- Preserved the 5-second splash screen and Startup Health diagnostics.
- Preserved Customer Photo Ready Check, Customer Photo Captions, Customer Report Photo Selection, Deficiency Photo Workflow, Photo Vault tools, overlay tools, iPad autosizing, simple Home, and Search Bar Concept #6.
- Did not bring back job-status workflow buttons.

## Validation

```bash
node --check src/storage.js
node --check src/app.js
python -m json.tool manifest.json
zip -T firevault-build-0.50.41-modular-root.zip
```

## Suggested commit message

```text
Build 0.50.41 technician closeout packet copy
```


## Build 0.50.41 notes

- Reduced the Home screen black spacing above the TODAY/date block.
- Compact fixed top header height while preserving the fixed splash/header behavior from 0.50.37+.
- No startup-path or workflow changes.
