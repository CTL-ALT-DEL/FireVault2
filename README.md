# FireVault Build 0.42.4

Emergency loading fix and 0.42.3 stability restore.

## Updates
- Fixed the issue where 0.42.3 could stay stuck on **Loading FireVault**.
- Corrected an invalid newline escape inside the report generator that could prevent the app module from parsing.
- Added a boot watchdog so future load failures show a clear recovery message instead of leaving the loading screen forever.
- Preserved the 0.42.3 iPhone shell spacing, Settings readability, GPS visibility, Nearby Sites access, Task Center filters, Visit Log, service follow-ups, and haptic-ready controls.

## Install
Use the clean-root ZIP contents in the GitHub Pages project root. Do not nest build folders.
