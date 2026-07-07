# FireVault Build 0.40.5 — Clean Root Package

Root-level package for GitHub Pages.

## Changes
- Fixed the app-visible build number so the header and dashboard now show Build 0.40.5.
- Cache-busted the selected #8 Flame Icon in the header, favicon, Apple home-screen icon, and PWA icons.
- Replaced the Settings page header with a very small microbar.
- Redesigned Settings submenus into compact small-screen chips.
- Reworked every Settings subpage with smaller typography, tighter field spacing, corrected left alignment, and smaller save controls.
- Reduced vertical waste on iPhone/PWA screens so settings panels use the available space better.
- Preserves the existing FireVault localStorage key from the modular line: `firevault_vault_build_030`.

Suggested commit:

`Build 0.40.5 clean root package no nested build folders`

## Build 0.40.5 packaging correction

This package is intentionally a clean project-root ZIP. It contains only the app files needed for this build and does not include any previous `firevault-build-*` extracted folders.

If your local folder shows old build folders such as `firevault-build-0.40.1-modular-root`, `firevault-build-0.40.2-modular-root`, or `firevault-build-0.40.3-modular-root`, those are leftover extracted folders and should be deleted before committing.

## Suggested commit message

`Build 0.40.5 clean root package no nested build folders`
