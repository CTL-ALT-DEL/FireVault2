# FireVault 0.94.5 Design System

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

## Build 0.94.3 Photo Overlay preview rules

- The Field Photo example remains sticky within the Photo Overlay Settings scroll area.
- The preview uses the same canvas renderer as exported field photos.
- Controls scroll in a separate column on iPad and beneath the preview on iPhone.
- The visible Settings page does not show third-party attribution text; licensing remains in `THIRD_PARTY_NOTICES.md`.

## Build 0.94.3 Photo Overlay workspace
- Photo Overlay omits the standard detail header to maximize usable vertical space.
- The full-width 3:2 live preview remains sticky and uses the exact export renderer.
- A compact floating Back control replaces the removed header navigation.
- Field chips insert at the last stored textarea selection and immediately update the canvas.

## Build 0.94.5 Photo Overlay field builder

Photo Overlay data fields use a button-first ordered list. The editor auto-saves, avoids raw-template keyboard editing, and supports drag plus explicit move controls for touch accessibility.


## Build 0.94.7 Technician Info template

Photo Overlay field controls use larger iPhone touch targets. Settings → Profile contains a reusable Technician Overlay Template whose order, line breaks, and left/right alignment are applied by the Technician Info quick choice in Photo Overlay.

## Build 0.94.8 Technician Overlay alignment

- Technician Overlay Template uses one group alignment control: Left, Center, or Right.
- Template preview rows use the full available width and never break inside long words.
- Technician Info uses no-wrap canvas rows and fits text to the export width.
- Center alignment is supported by the shared Photo Overlay preview/export renderer.
