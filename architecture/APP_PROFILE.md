# FireVault App Profile

FireVault Build 0.95.9 uses `src/app-profile.js` as the active configuration for identity, terminology, modules, record data model, field workflow presets, branding, and visual design tokens.

The FireVault profile remains optimized for fire alarm technicians. Shared screens consume the profile so future AppForge products can change terminology, enabled modules, fields, detail sections, photo categories, action surfaces, Quick Photo behavior, brand assets, colors, typography, and shape without rewriting the shared application core.

The active profile uses schema version 6, the `fire-alarm-technician` workflow preset, and the `firevault-dark` Theme Profile.

## Build 0.95.9 content configuration

App Profile schema 7 adds `content` with:

- `registryId`
- `enabledSourceIds`
- `enabledPackIds`
- `updatePolicy`

The profile controls approved sources and active content packs while the shared Library derives its default folders from those packs. FireVault keeps its current user library, record-linked content, fire-alarm field reference, and panel-document packs enabled.
