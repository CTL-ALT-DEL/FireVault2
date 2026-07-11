# FireVault Build 0.69.2

Nearby Accounts reliability and scrolling repair.

- Replaces the CDN-dependent Leaflet marker layer with a built-in static marker overlay.
- Uses a non-interactive OpenStreetMap base centered on current GPS.
- Account markers render from locally stored latitude and longitude even if the map library CDN is unavailable.
- Map cannot be dragged or scrolled by touch.
- Plus/minus controls change the visible radius.
- Account list uses iOS momentum scrolling and settles the nearest complete row at the top.
- The top account highlights its matching marker and opens the map detail popup.
