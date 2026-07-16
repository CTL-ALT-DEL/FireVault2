# FireVault

## Build 1.01.4 — Account Tab Visibility

Build 1.01.4 keeps the selected Account Detail tab visible on narrow phones. Opening a tab no longer resets the horizontal tab rail to the beginning and hides the technician’s current location.

### Polished

- Automatically reveals the active tab after Account Detail re-renders.
- Centers a clipped tab within the phone tab rail when space allows.
- Keeps Overview, Notes, Locations, Equipment, Files, and Details unchanged.
- Preserves normal swipe navigation and the full six-column iPad layout.

### Preserved UI cleanup

Build 1.01.3 Favorite cleanup, Build 1.01.2 Photo Overlay polish, Build 1.01.1 Account Detail polish, and Build 1.01.0 Settings cleanup remain intact. Everyday Settings stays consolidated into six technician-focused areas, and AppForge remains hidden from normal app use.

### Developer access

Existing Build 1.00 AppForge tools are preserved. To open them, serve the app locally and visit `http://localhost:8000/?appforge=1`, then open Settings → About FireVault → AppForge Factory.

### No feature or data changes

This build adds no features and changes no storage contracts. The active storage key remains `firevault_vault_build_030`; existing tabs, Favorite behavior, account actions, overlay presets, fields, templates, renderer output, photos, accounts, documents, imports, backups, security controls, and field workflows are unchanged.
