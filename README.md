# FireVault Build 0.41.9

Email Defaults designer and Settings tab position fix.

## Changes
- Redesigns Settings > Email into a modern template composer.
- Separates recipients, subject template, signature template, insert tags, and live preview into clean sections.
- Replaces the cramped inline tag list with tappable tag chips.
- Adds live subject and signature preview using a sample site and your saved technician profile.
- Keeps the Settings horizontal tab rail from jumping back to the far left after a tab is pressed.
- Preserves Nearby Sites, GPS capture, map actions, GPS report support, and iPhone PWA safe-area handling.
- Preserves clean root package format and the existing FireVault storage key.

## Install
Copy these files into the project root that contains package.json, src, public, index.html, manifest.json, and assets. Do not copy the outer folder itself into your repo.


## Build 0.41.9
- Lowered bottom menu icon bar for iPhone home-screen use.
- Added haptic button feedback where supported by the browser/device.
- Added a haptics toggle under Settings → Theme.
- Preserved Nearby Sites and GPS tools.
