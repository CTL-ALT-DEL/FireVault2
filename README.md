# FireVault Build 0.73.0

## Design-system polish

Build 0.73.0 is a visual-cohesion milestone. It preserves FireVault data and behavior while applying one consistent interface language across the app.

- Introduces shared tokens for surfaces, borders, control height, corner radius, shadows, and interaction states.
- Standardizes primary, secondary, destructive, compact, and dynamic navigation controls.
- Gives the global bottom navigation and Nearby bottom navigation the same square button family.
- Replaces mixed Unicode bottom-navigation symbols with a consistent line-icon set.
- Cleans up cards, inputs, focus states, disabled states, and press feedback.
- Reduces competing gradients and heavy visual effects while keeping FireVault's dark field-ready appearance.
- Improves Nearby Accounts hierarchy, spacing, map controls, selected-site label, and small-text readability.
- Keeps the selected account in a restrained dark green state.
- Simplifies the Nearby status line to avoid repeating information already shown above the account list.

## Data safety retained

- Uses the existing `firevault_vault_build_030` storage key.
- Keeps rolling automatic snapshots and recovery protections from Build 0.72.2.
- Keeps reliable PWA update checks and old-cache cleanup from Build 0.72.0.
- Keeps portrait-first behavior and startup database/version status from Build 0.72.3.

Automatic snapshots remain inside the installed PWA. Download an external FireVault backup before deleting or reinstalling the Home Screen app.
