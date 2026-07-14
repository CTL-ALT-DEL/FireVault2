# FireVault 0.93.1 Design System

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


## Build 0.93.0 interaction layer

- Visible launch presentation with a 2.2-second minimum splash duration
- Unsaved-change indicators and navigation confirmation
- Duplicate primary/destructive action protection
- Keyboard-safe scroll padding and sticky form headers
- Correct Nearby/Search navigation state mapping
- Short, opacity-only route transitions


## Build 0.93.1 Settings containment

The Settings shortcut rail was removed. The Settings shell now enforces vertical-only scrolling, clamps all child widths to the viewport, removes negative sticky-header margins, and preserves one- or two-column grouped layouts without horizontal overflow.
