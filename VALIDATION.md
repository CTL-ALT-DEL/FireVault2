# FireVault Build 1.02.0 Validation

## Static checks

- JavaScript syntax passes for every source module and the service worker.
- Every imported symbol resolves from its source module.
- All JSON architecture contracts parse and runtime mirrors match.
- Every static application reference resolves to Build 1.02.0.
- Service-worker shell includes the generated-profile bridge, Generator Engine, and every required runtime asset.
- Local HTTP asset smoke test and release ZIP integrity pass.

## On-Site Guide checks

- A successful foreground Nearby scan offers arrival guidance only at 125 m accuracy or better and within the adaptive 120–180 m arrival boundary.
- Automatic arrival requires at least one precise saved Parking Area, Main Entrance, or Secondary Entrance point.
- The arrival card identifies the account, summarizes access points, remains nonblocking, and stays above navigation at 320×700, 390×844, and 1024×1366.
- The arrival card appears only once per eligible account group during the current session.
- Accounts sharing the same site location present a name and Account ID chooser before the guide opens.
- The selected account is preserved when a shared-address choice opens the guide.
- The guide orders Parking Area, Main Entrance, Secondary Entrance, access points, and fire-alarm equipment for field use.
- Every precise saved location has a matching numbered map pin, Copy action, Route action, Plus Code when available, and access context.
- Map-pin selection highlights and reveals the matching location row.
- Account Detail → Locations exposes a 44px On-Site Guide action whenever precise saved locations exist.
- Guide layout, actions, scrolling, dialog semantics, and horizontal overflow pass at all three supported test viewports.
- Demo Mode includes a safe Parking → Entrance → Panel sequence for hands-on validation.

## GPS safety checks

- Arrival detection runs only after FireVault itself requests GPS while visible; no background monitoring is added.
- GPS results worse than ±125 m do not produce an automatic arrival prompt.
- Accounts without precise access points do not produce an automatic arrival prompt.
- Manual On-Site Guide access remains available for any account with a precise saved location.
- Dismissing or opening a prompt records only session state and never edits the account.

## Preserved UI cleanup

- Build 1.01.5 Update Ready sheet behavior, progress locking, retry state, and layout remain intact.
- Build 1.01.4 selected-tab visibility remains intact on phone and iPad layouts.
- Build 1.01.3 star-only Favorite control, 44px target, and accessible state remain intact.
- Build 1.01.2 Photo Overlay workflow, controls, preview, and responsive layouts remain intact.
- Build 1.01.1 Account Detail actions, tabs, and responsive layouts remain intact.
- Normal Settings continues to present six technician-focused areas.
- AppForge remains hidden from normal Settings and available only with `?appforge=1`.
- Demo Mode remains available under About FireVault.

## Scope checks

- The existing reusable `core.locationNavigator` capability is extended; no duplicate map or settings module was added.
- App Profile remains schema version 12.
- Module Registry remains version 9.
- Existing Build 1.00 AppForge generator contracts remain intact behind developer access.

## Compatibility checks

- Active runtime profile remains `firevault`.
- Storage key remains `firevault_vault_build_030`.
- FireVault retains all fire-alarm modules, fields, categories, and technician actions.
- No record, media, backup, WebDAV, Microsoft profile, privacy, or schema migration is required.

## Device confirmation

In Demo Mode, refresh Nearby and confirm the arrival card opens Capitol Plaza Offices; verify the guide presents Technician Parking, Main Entrance, and Main Fire Alarm Panel in that order; close it and confirm it does not reappear during the same session; open any Account Detail → Locations and launch On-Site Guide manually. Also confirm shared-address account selection, existing Update Ready behavior, Account Detail, Favorite, Add Note, Photo Overlay, Settings cleanup, hidden AppForge access, and offline startup.
