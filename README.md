# FireVault

## Build 1.03.6 — Update Dialog Lockup Repair

Build 1.03.6 repairs the iPhone Update Ready screen shown as an oversized blank dark panel. Retired compact-banner styles were overriding the current centered dialog and clipping its controls off-screen.

### Updated

- Removes the retired Build 0.72 and 1.01.5 banner geometry that conflicted with the centered Update Ready modal.
- Keeps the update card centered inside a full-screen blurred backdrop on iPhone and iPad.
- Keeps Install Update, Release Notes, Later, Try Again, and Reload App reachable.
- Lets a tap on the empty backdrop dismiss the prompt safely before installation begins.
- Adds regression checks that reject the exact legacy positioning rules responsible for the lockup.
- Retains the Build 1.03.5 Photo Overlay workspace cleanup and every existing data workflow.

### Run locally

From this folder, run `python3 -m http.server 8000`, then open `http://localhost:8000`. Use HTTPS for real GPS permission outside localhost.

### Developer access

Existing AppForge tools remain hidden from normal technician use. Open `http://localhost:8000/?appforge=1`, then Settings → About FireVault → AppForge Factory.

### Compatibility

The active storage key remains `firevault_vault_build_030`; no schema migration is required. Existing CSV matching, account history, and all prior field workflows remain compatible.
