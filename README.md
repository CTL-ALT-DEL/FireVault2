# FireVault Build 0.46.2

Build 0.46.2 is the Daily Route Log Starter build.

## What changed

- Visible app version advanced to 0.46.2.
- Added **Daily Route** tile on the main dashboard.
- Added **Start Day** and **End Day / Save** route sessions.
- Added active route actions:
  - Arrived Site
  - Left Site
  - Manual Waypoint
  - Break / Fuel / Parts
- Added GPS capture for route waypoints while the app is open.
- Added saved daily route history.
- Added copy / download / delete actions for saved route days.
- Daily route reports include:
  - Date
  - Start / end time
  - Duration
  - Ordered stops
  - Site names
  - GPS coordinates
  - Nearest saved site when available
  - Apple Maps or Google Maps links
- Added route day count to Diagnostics.
- Preserved the 0.46.1 Diagnostics bottom menu visibility fix.

Important iPhone note: browser/PWA background GPS is limited. This starter uses foreground route logging while FireVault is open.

Suggested commit message:

```text
Build 0.46.2 daily route log starter
```
