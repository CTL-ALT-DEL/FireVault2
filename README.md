# FireVault

## Build 1.03.29 — Native Field Workspace

Build 1.03.29 replaces Account Detail inside the native iPhone app with a focused SwiftUI Field Workspace centered on Notes, Files, Scans, Equipment, and Maps.

### Updated

- Uses native SwiftUI for the Account identity, Apple Map, field destinations, recent activity, and quick actions.
- Presents Notes, Files & Scans, Equipment, and Locations as four clear work destinations.
- Places Scan, Note, Camera, and Route in one compact Liquid Glass action dock.
- Uses Apple MapKit for the account and precise saved entrances, parking areas, panels, risers, FDCs, and other locations.
- Keeps Favorite, Edit Account, Call, Nearby, Search, Photo, and Settings connected through a controlled native-to-web bridge.
- Disables Tasks and Deficiencies in the active profile without deleting any existing stored records.
- Retains Notes, files, photos, Apple document scanning, equipment, maps, GPS, Plus Codes, and account information.
- Keeps the established web vault as the data authority; the bridge sends lightweight metadata and returns actions to existing save workflows.
- Retains the Build 1.03.28 accordion only as the browser/PWA fallback where SwiftUI is unavailable.
- Returns a saved scan to the same Account Detail screen instead of sending the technician into the document-management workspace.
- Keeps Scan Document in Documents / Photos as a secondary access point.
- Uses Apple VisionKit for automatic document edges, perspective correction, crop review, retakes, and multi-page capture.
- Transfers finished pages sequentially into FireVault to reduce web-view memory pressure.
- Adds a compact Save Scan review for title, type, date/revision, and optional notes.
- Stores scan pages offline in IndexedDB outside the main account vault.
- Retains existing scan preview, PDF download, PDF sharing, deletion, backup, and account timeline behavior.
- Keeps the browser/PWA scanner hidden because Apple VisionKit requires the native Xcode app.
- Retains Build 1.03.28 module cleanup, Build 1.03.25 Apple VisionKit capture, Build 1.03.24 navigation reliability, and Build 1.03.23 native Apple Maps support.

### Run locally

From this folder, run `python3 -m http.server 8000`, then open `http://localhost:8000`. Use HTTPS for real GPS permission outside localhost.

### Developer access

Existing AppForge tools remain hidden from normal technician use. Open `http://localhost:8000/?appforge=1`, then Settings → About FireVault → AppForge Factory.

### Compatibility

The active storage key remains `firevault_vault_build_030`; no schema migration is required. Existing CSV matching, account history, and all prior field workflows remain compatible.
