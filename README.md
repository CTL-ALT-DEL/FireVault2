# FireVault Build 0.46.0

Build 0.46.0 is a Bug Sweep / Stability Checkpoint build.

## What changed

- Visible app version advanced to 0.46.0.
- Added a new **Stability Checkpoint** inside Diagnostics.
- Added sanity checks for:
  - App route registration
  - Site database structure
  - Library resource structure
  - Library folders
  - Core settings objects
  - Duplicate site IDs
  - Duplicate resource IDs
  - Invalid GPS records
  - Orphaned active service calls
- Added **Repair Vault** to normalize data structures and clear orphaned active jobs.
- Added **Copy Diagnostics** for easy troubleshooting.
- Improved Diagnostics layout with cleaner summary cards and better screen fit.
- Preserved the centered bold day/date, splash screen, Library folder tools, Settings fixes, and navigation fit polish.

Suggested commit message:

```text
Build 0.46.0 bug sweep stability checkpoint diagnostics
```
