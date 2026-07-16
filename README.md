# FireVault
## Build 0.95.8 — Configurable Branding and Theme Profiles

Build 0.95.8 makes the shared Field Vault shell visually configurable while preserving FireVault’s current dark fire-technician presentation.

### Integrated

- Added `src/theme-profile.js` as the canonical resolver for branding and visual design tokens.
- App Profile schema version 6 now defines the app mark, full logo, install icons, wordmark segments, tagline, semantic colors, browser chrome, typography, density, and corner shape.
- The live application shell applies the resolved Theme Profile at startup.
- Header, splash, Home, Nearby, privacy lock, overlay branding, About, release notes, and Architecture previews use profile-resolved brand assets or wordmarks.
- Shared CSS uses semantic variables instead of requiring a new stylesheet for every future vertical app.
- Architecture & Modules displays and exports the active Theme Profile.

### FireVault behavior

The active `firevault-dark` profile retains:

- FireVault name, wordmark, icons, and Field Vault System tagline
- Dark charcoal surfaces
- Red primary accent
- Existing status colors and readable light text
- Existing iPhone and iPad spacing
- All current technician workflows and modules

### AppForge direction

A future app profile can replace branding, colors, typography, shape, and mobile browser chrome without branching Search, Nearby, Account Detail, Quick Photo, Settings, or storage code.

### Compatibility

The storage key remains `firevault_vault_build_030`. Existing accounts, notes, photos, documents, overlays, IndexedDB media, backups, WebDAV settings, Demo Mode, Nearby, Search, Account Detail, record schema, and workflow schema remain compatible.
