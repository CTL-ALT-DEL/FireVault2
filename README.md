# FireVault

## Build 1.03.3 — Recovery Ready Update Dialog

Build 1.03.3 redesigns Update Ready as a large, centered, recovery-safe dialog while preserving the existing service-worker update procedure and local data.

### Polished

- Centers the update dialog in a larger card and blurs the inactive app behind it.
- Clearly identifies the update as safe to install and confirms that local data remains protected.
- Provides large Install Update, Release Notes, and Later controls with readable labels.
- Keeps Try Again and Reload App available if activation fails or takes too long.
- Prevents duplicate dialogs and repeat install taps during activation.
- Retains Build 1.03.2 CSV Plus Codes, Photo Overlay access, and real-vault CSV persistence.

### Run locally

From this folder, run `python3 -m http.server 8000`, then open `http://localhost:8000`. Use HTTPS for real GPS permission outside localhost.

### Developer access

Existing AppForge tools remain hidden from normal technician use. Open `http://localhost:8000/?appforge=1`, then Settings → About FireVault → AppForge Factory.

### Compatibility

The active storage key remains `firevault_vault_build_030`; no schema migration is required. Existing CSV matching, account history, and all prior field workflows remain compatible.
