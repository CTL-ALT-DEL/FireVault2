# Clean Install Notes — FireVault Build 0.50.21

This ZIP is intended to be used as the clean baseline for FireVault Build 0.50.21.

## Install

1. Upload the ZIP contents to the root of the GitHub Pages branch.
2. Keep the file structure exactly as provided.
3. Commit the full extracted contents together.
4. Open the deployed app after GitHub Pages finishes.
5. If Safari or iPhone PWA cache holds an older build, reload Safari and reinstall the Home Screen shortcut if needed.

## Build focus

Build 0.50.21 keeps the working 0.50.20 startup repair and adds Photo Vault search polish:

- Search saved site photos, links, documents, references, and notes.
- Clear search action on the Site Documents / Photos screen.
- Preserved Photo Vault filter tabs and counts.
- Preserved Startup Health diagnostics.
- Preserved 5-second splash screen and startup watchdog.
- Preserved Photo Overlay tools and custom overlay logo support.
- Kept Home simple and Search Bar Concept #6 unchanged.

## Do not regress

- Do not bring back Start Job / End Job / Arrived / Working / Complete workflow buttons.
- Do not simplify away the Photo Vault / Daily Report workflow.
- Do not remove the startup watchdog or Startup Health diagnostics.
