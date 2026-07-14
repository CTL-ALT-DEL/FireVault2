# FireVault 0.92.0 Design System

`src/design-system.css` is the canonical release-facing visual layer.

## Foundations

- Dark blue-charcoal surfaces rather than flat black
- Restrained red FireVault accent
- 44-point minimum touch targets
- 16-pixel editable text on iPhone to avoid Safari zoom
- Shared radii, borders, shadows, focus rings, spacing, and motion
- Responsive layouts for iPhone, iPad, landscape, and Split View

## Active components covered

- Global header and three-button bottom navigation
- Account Directory, search, toolbar, account cards, and card actions
- Account Detail identity, quick actions, tabs, and content
- Settings index, search, status shortcuts, grouped lists, and detail screens
- Nearby supporting screens
- Forms, buttons, cards, pills, empty states, toasts, and recovery screens

Future visual changes should be made in this file instead of adding another build-numbered patch to `styles.css`.
