# FireVault Build 0.47.0

Build 0.47.0 is the Daily Route pause / resume polish build.

## What changed

- Visible app version advanced to 0.47.0.
- Added **Pause Route** and **Resume Route** controls for active Daily Route sessions.
- Added dashboard Pause / Resume control inside the active Daily Route card.
- The dashboard LED now reflects route state:
  - Green blinking LED = route recording
  - Amber pulsing LED = route paused
- Waypoint capture and nearest-site checks are blocked while the route is paused.
- Route reports now include recording status.
- Pause and Resume are added to the route timeline as events.
- Preserved vehicle / odometer logging, CSV export, customer summary, nearest-site suggestions, and route dashboard controls.

Suggested commit message:

```text
Build 0.47.0 daily route pause resume status
```
