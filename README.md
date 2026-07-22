# FireVault

## Build 1.03.26 — One-Tap Document Scan

Build 1.03.26 makes Apple document scanning a primary Account Detail action in the native iPhone app.

### Updated

- Adds a large, clearly labeled Scan Document button directly to Account Detail, reducing scanning to two taps: open the account, then scan.
- Returns a saved scan to the same Account Detail screen instead of sending the technician into the document-management workspace.
- Keeps Scan Document in Documents / Photos as a secondary access point.
- Uses Apple VisionKit for automatic document edges, perspective correction, crop review, retakes, and multi-page capture.
- Transfers finished pages sequentially into FireVault to reduce web-view memory pressure.
- Adds a compact Save Scan review for title, type, date/revision, and optional notes.
- Stores scan pages offline in IndexedDB outside the main account vault.
- Retains existing scan preview, PDF download, PDF sharing, deletion, backup, and account timeline behavior.
- Keeps the browser/PWA scanner hidden because Apple VisionKit requires the native Xcode app.
- Retains Build 1.03.25 Apple VisionKit capture, Build 1.03.24 navigation reliability, and Build 1.03.23 native Apple Maps support.

### Run locally

From this folder, run `python3 -m http.server 8000`, then open `http://localhost:8000`. Use HTTPS for real GPS permission outside localhost.

### Developer access

Existing AppForge tools remain hidden from normal technician use. Open `http://localhost:8000/?appforge=1`, then Settings → About FireVault → AppForge Factory.

### Compatibility

The active storage key remains `firevault_vault_build_030`; no schema migration is required. Existing CSV matching, account history, and all prior field workflows remain compatible.
