# FireVault

<<<<<<< HEAD
## Build 1.03.5 — Photo Overlay Workspace Cleanup

Build 1.03.5 redesigns Photo Overlay Settings as a calm, progressive workspace. The preview and presets stay immediately available; detailed tools remain one tap away without crowding the screen.

### Updated

- Keeps one clear Back control, an exact live preview, and the three visual presets at the top of the workspace.
- Collapses Photo Information, Layout, Branding, and Technician Overlay into concise summary rows.
- Lets each active field expand independently for line placement, alignment, ordering, and removal.
- Uses a balanced preview-and-controls desktop layout and a clean single-column phone layout.
- Preserves every overlay setting, auto-save behavior, category-aware tagline, and independent Technician Overlay option.
- Adds regression checks for the progressive controls, responsive preview, and single Back control.
=======
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
>>>>>>> b4b0cafc2c6c607b145fd4a195aa5e026a507940

### Run locally

From this folder, run `python3 -m http.server 8000`, then open `http://localhost:8000`. Use HTTPS for real GPS permission outside localhost.

### Developer access

Existing AppForge tools remain hidden from normal technician use. Open `http://localhost:8000/?appforge=1`, then Settings → About FireVault → AppForge Factory.

### Compatibility

The active storage key remains `firevault_vault_build_030`; no schema migration is required. Existing CSV matching, account history, and all prior field workflows remain compatible.
