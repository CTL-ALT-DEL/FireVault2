# Validation — Build 0.93.0

## Passed

- JavaScript syntax: `app.js`, `storage.js`, `providers.js`, `media-store.js`, `open-location-code.js`, and `sw.js`
- JSON parsing: `manifest.json` and `version.json`
- Build consistency across index, manifest, version file, storage module, source imports, and service worker
- Service-worker shell paths exist and include the canonical design system
- Visible minimum splash duration set to 2.2 seconds; startup recovery timeout extended to 9 seconds
- Unsaved-change protection is wired to account, document, contact, equipment, task, deficiency, library, Site Notes, and saveable Settings forms
- Save operations clear the dirty state; navigation and browser close protect unsaved edits
- Primary and destructive buttons include rapid double-tap protection
- Nearby views correctly activate Nearby in the bottom navigation; account workflows activate Search
- Keyboard-safe scroll padding, sticky form headers, field focus rings, validation states, and reduced route motion are present
- Natural Account Directory momentum scrolling remains enabled
- Existing storage key `firevault_vault_build_030` preserved
- IndexedDB media storage and complete-media backup workflow preserved
- WebDAV, Demo Mode, Google Plus Codes, Photo Overlay, Nearby, and Building Navigator remain present
- Three-button Nearby / Search / Settings navigation preserved
- ZIP archive integrity

## Physical-device checks still required

- Installed-PWA update from 0.92.0 to 0.93.0
- Splash timing on a warm and cold iPhone/iPad launch
- Unsaved-change confirmation from every edited form
- Rapid double-tap testing on Save, Delete, export, and restore controls
- Keyboard behavior with Notes, Settings, and account forms
- Account Directory scrolling on iPhone and iPad
- Nearby map/list active navigation state
- iPad portrait, landscape, Split View, and Stage Manager sizing
- WebDAV, GPS permissions, Photo Overlay export, and backup/restore

Static validation passed. Camera, GPS, WebDAV, installed-PWA caching, and physical keyboard/viewport behavior still require device testing.
