# Clean Install Notes — FireVault Build 0.50.18

This ZIP is intended to be used as the new clean baseline for FireVault Build 0.50.18.

## Install

1. Extract the ZIP.
2. Commit all files to the repository root.
3. Push to GitHub.
4. Wait for GitHub Pages to finish deploying.
5. On iPhone/iPad, fully close and reopen the PWA. If an older build is cached, remove the Home Screen icon and add it again after deployment.

## Build focus

Build 0.50.18 repairs the startup watchdog and splash timing behavior:

- 5-second splash screen remains intentional.
- Watchdog no longer fires before the splash delay finishes.
- Module-ready state is tracked separately from app-open state.
- Startup render errors are shown clearly instead of silently hanging.

The Home screen stays simple, Search Bar Concept #6 is preserved, iPad autosizing is preserved, and job-status workflow buttons remain excluded.
