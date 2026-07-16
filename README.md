# FireVault

## Build 1.03.4 — Category-Aware Photo Overlays

Build 1.03.4 makes the Photo Overlay tagline follow the selected photo category and adds an independent Technician Overlay option to camera and imported-photo workflows.

### Updated

- Uses `FIREVAULT FIELD NOTES - {CATEGORY}` whenever the Photo Overlay tagline is enabled. 
- Uses `FIREVAULT FIELD NOTES` without a suffix when Other is selected.
- Rebuilds live previews immediately when the selected photo category changes.
- Adds an independent Technician Overlay toggle to Quick Photo capture and Take Photo / Upload Photo.
- Saves the Technician Overlay choice with each photo without changing the normal Photo Overlay template.
- Keeps Photo Overlay directly available from the main Settings page whenever Photos are enabled.
- Retains Build 1.03.3 update-dialog recovery and all earlier CSV and Plus Code fixes.

### Run locally

From this folder, run `python3 -m http.server 8000`, then open `http://localhost:8000`. Use HTTPS for real GPS permission outside localhost.

### Developer access

Existing AppForge tools remain hidden from normal technician use. Open `http://localhost:8000/?appforge=1`, then Settings → About FireVault → AppForge Factory.

### Compatibility

The active storage key remains `firevault_vault_build_030`; no schema migration is required. Existing CSV matching, account history, and all prior field workflows remain compatible.
