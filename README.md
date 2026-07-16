# FireVault

## Build 1.01.5 — Update Sheet Redesign

Build 1.01.5 redesigns the working Update Ready popup into a clear, field-safe update sheet. It explains what will happen, protects against repeat taps, and provides useful progress and retry states without changing the service-worker update mechanism.

### Polished

- Replaced the cramped toast and unlabeled × with clear Later and Install Update actions.
- Enlarged both actions to 48px and kept the sheet above bottom navigation on phones and iPad.
- Added an Installing state that disables repeat taps and explains that FireVault will reopen automatically.
- Added retry guidance when activation takes longer than expected.
- Refreshes an already-open update sheet when a newer waiting build is detected instead of creating a duplicate.
- Clearly states that saved accounts, notes, photos, and settings remain on the device.

### Preserved UI cleanup

Build 1.01.4 Account tab visibility, Build 1.01.3 Favorite cleanup, Build 1.01.2 Photo Overlay polish, Build 1.01.1 Account Detail polish, and Build 1.01.0 Settings cleanup remain intact. Everyday Settings stays consolidated into six technician-focused areas, and AppForge remains hidden from normal app use.

### Developer access

Existing Build 1.00 AppForge tools are preserved. To open them, serve the app locally and visit `http://localhost:8000/?appforge=1`, then open Settings → About FireVault → AppForge Factory.

### No feature or data changes

This build adds no features and changes no storage contracts. The active storage key remains `firevault_vault_build_030`; update detection and activation, tabs, Favorite behavior, account actions, overlay rendering, photos, accounts, documents, imports, backups, security controls, and field workflows are unchanged.
