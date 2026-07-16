# Theme Profile

Build 0.95.8 separates the visual identity of a vertical app from the shared Field Vault screens.

## Profile-controlled values

- App mark, full logo, install icons, and Apple touch icon
- Segmented wordmark and tagline
- Background, surfaces, borders, text, muted text, accent, success, warning, information, and cyan tokens
- Browser theme color, install background, and iOS status-bar style
- Base font family and size
- Card and control corner radius
- Optional compact density

## Runtime behavior

`src/theme-profile.js` validates the active App Profile, resolves safe fallback values, applies semantic CSS variables, updates app-shell metadata, and supplies brand assets and wordmark markup to shared screens.

FireVault uses the `firevault-dark` profile. Future AppForge products can replace the profile while retaining the same Search, Nearby, Account Detail, Quick Photo, Settings, security, storage, and backup code.
