# FireVault

## Build 1.01.2 — Photo Overlay Polish

Build 1.01.2 cleans up the Photo Overlay workspace for faster field use. It improves the editor hierarchy, control readability, and phone/iPad layouts without changing overlay rendering, saved settings, photo workflows, or stored data.

### Polished

- Reordered the editor into Live Preview, Quick Setup, Fields, Layout, and Branding.
- Moved Back and auto-save status into a clear workspace header instead of covering the preview image.
- Rebuilt presets as three compact, icon-led starting points with clear logo and tagline toggles.
- Replaced compressed field rows with readable two-row controls for alignment, line placement, reordering, and removal.
- Standardized Photo Overlay controls on SVG icons and 44px-or-larger touch targets.
- Constrained the logo manager so custom branding no longer overwhelms the phone layout.
- Expanded iPad controls into a balanced workspace while preserving the persistent exact-export preview.

### Settings scope

The Build 1.01.1 Account Detail polish and Build 1.01.0 Settings cleanup remain intact. Everyday Settings stays consolidated into six technician-focused areas, and AppForge remains hidden from normal app use.

### Developer access

Existing Build 1.00 AppForge tools are preserved. To open them, serve the app locally and visit `http://localhost:8000/?appforge=1`, then open Settings → About FireVault → AppForge Factory.

### No feature or data changes

This build adds no features and changes no storage contracts. The active storage key remains `firevault_vault_build_030`; existing overlay presets, fields, templates, renderer output, photos, accounts, documents, imports, backups, security controls, and field workflows are unchanged.
