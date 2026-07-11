# FireVault Build 0.69.4

Nearby Accounts map reliability and layout repair.

- Fixes GPS-ready account markers by reading the saved site GPS fields directly.
- Starts the map at a closer radius based on the nearest accounts instead of the full configured radius.
- Keeps the map centered and non-draggable; only + / - changes the visible distance.
- Automatically expands the map range when the selected list account is farther away.
- Compacts GPS status, Map/List, Refresh, Tools, and radius information above the map.
- Crops external map chrome from the visible map surface.
- Preserves momentum account scrolling and settles the nearest complete row at the top.
