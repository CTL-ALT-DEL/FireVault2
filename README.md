# FireVault

## Build 1.01.3 — Favorite Button Cleanup

Build 1.01.3 simplifies the Favorite control at the top of Account Detail so it stays clean and readable on narrow phones without changing the Favorite action, account workflows, or stored data.

### Polished

- Removed the visible Favorite label from the Account Detail header so it cannot wrap.
- Kept a clear 44px star-only touch target with a larger icon.
- Added an accessible pressed state and action label for adding or removing an account from favorites.
- Preserved the labeled Edit button and the rest of the Account Detail hierarchy.

### Preserved UI cleanup

Build 1.01.2 Photo Overlay polish, Build 1.01.1 Account Detail polish, and Build 1.01.0 Settings cleanup remain intact. Everyday Settings stays consolidated into six technician-focused areas, and AppForge remains hidden from normal app use.

### Developer access

Existing Build 1.00 AppForge tools are preserved. To open them, serve the app locally and visit `http://localhost:8000/?appforge=1`, then open Settings → About FireVault → AppForge Factory.

### No feature or data changes

This build adds no features and changes no storage contracts. The active storage key remains `firevault_vault_build_030`; existing Favorite behavior, account actions, overlay presets, fields, templates, renderer output, photos, accounts, documents, imports, backups, security controls, and field workflows are unchanged.
