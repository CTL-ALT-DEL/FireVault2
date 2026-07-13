# FireVault Build 0.81.0 — App Store Cleanup

This release removes the document scanner, Daily Route/time-tracking controls, theme selection, advanced settings, diagnostics access, and excess introductory copy. Core account records, Site Notes, Nearby Accounts, Building Navigator, files, photos, field tools, reports, backup, and imported data remain preserved.

# FireVault Build 0.81.0 — Advanced Auto-Crop Scanner

Build 0.81.0 rebuilds the scanner around a simpler capture-first workflow and a stronger on-device document-detection engine.

## Scanner workflow

- The scanner opens with only **Scan Page** and **Import** controls.
- The scan button contains no introduction or instructional sentence.
- Title, date, notes, quality, cleanup, account search, and Save controls appear only after the first page is captured.
- New Tools scans retain Build 0.80.3 closest-account GPS matching and manual account override.
- Site Notes scans remain matched to the account from which they were opened.

## Advanced capture

- Four-edge document detection uses blurred luminance, Sobel gradients, directional edge filtering, line voting, quadrilateral scoring, and stability tracking.
- The camera frame is detected continuously and automatic capture waits for a stable, sharp page.
- Every captured camera image is analyzed again at full resolution before perspective cropping.
- The scanner warns when the full page is not in view or when the image is too soft.
- Supported devices expose a camera flash/torch button.
- Manual shutter, imported photos, four-corner adjustment, rotation, cleanup filters, page ordering, multi-page PDF output, sharing, and editing remain available.

## Keyboard visibility

Focused title, date, notes, and account-search fields are kept within the visual viewport using the nearest scrollable container. Additional keyboard-aware space is added while the mobile keyboard is open.

## Compatibility

The existing `firevault_vault_build_030` storage key is unchanged. Existing accounts, scans, notes, Building Navigator records, settings, and security metadata remain compatible.
