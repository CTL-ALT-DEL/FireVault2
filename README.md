# FireVault Build 0.50.7

Build 0.50.7 continues from the uploaded 0.50.6 baseline and adds iPad autosizing / responsive tablet polish without changing the clean Home workflow.

## What changed

- Visible app version advanced to 0.50.7.
- Updated cache-busting references in `index.html` to 0.50.7.
- Updated manifest description and release notes for Build 0.50.7.
- Changed the PWA manifest orientation from portrait-only to `any` for better iPad portrait and landscape use.
- Added iPad/tablet breakpoints so FireVault can scale beyond the narrow phone-width layout.
- Improved Home screen tablet sizing while keeping the Home screen simple and preserving Search Bar Concept #6.
- Improved tablet spacing and two-column behavior for:
  - Daily Report
  - Site Notes composer and saved-note list
  - Settings panels
  - Bottom navigation
- Preserved the 0.50.6 Daily Report / Site Notes workflow.
- Did not bring back Start Job / End Job / Arrived / Working / Complete workflow controls.
- Preserved modules/settings behavior so advanced tools remain hidden unless enabled.

Suggested commit message:

```text
Build 0.50.7 iPad autosizing and responsive layout polish
```
