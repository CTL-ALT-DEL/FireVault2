# FireVault 0.94.1 Design System

`src/design-system.css` is the canonical release-facing visual layer.

## Foundations

- Layered dark blue-charcoal surfaces rather than flat black
- Restrained FireVault red and category accents
- 44-point minimum touch targets
- 16-pixel editable text on iPhone to avoid Safari zoom
- Shared radii, borders, shadows, focus rings, spacing, and motion
- Responsive layouts for iPhone, iPad, landscape, Split View, and Stage Manager-sized windows

## Active components covered

- Global header and three-button bottom navigation
- Account Directory top bar, search, toolbar, cards, and card actions
- Account Detail identity, quick actions, tabs, and content
- Settings index, search, grouped lists, detail headers, form labels, and content cards
- Nearby supporting screens
- Forms, buttons, cards, pills, empty states, toasts, and recovery screens

## Build 0.94.0 hierarchy rules

- Settings category names must be visually separated from the controls they describe.
- Main page headings, counts, and primary actions must form one clear top-bar hierarchy.
- Search controls must use the full available width without clipping or horizontal movement.
- Active bottom-navigation sections must be immediately recognizable.
- New visual changes should be added here rather than as another large patch in `styles.css`.


## Build 0.94.1 navigation rules

- Nearby and the global app dock use identical fixed geometry and safe-area padding.
- The selected route is communicated by the button surface, border, icon, and label—not an underline bar.
