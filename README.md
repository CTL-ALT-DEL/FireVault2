# FireVault
## Build 0.98.0 — AppForge Product Recipes

Build 0.98.0 proves that FireVault’s shared core can define several genuinely different products without changing the active technician app or customer vault.

### Integrated

- Added `src/app-forge-recipes.js` as the canonical Product Recipe registry.
- Added `core.appForgeRecipes` to Module Registry version 7.
- Advanced the App Profile to schema version 10 with recipe support.
- Added four validated recipes: FireVault, Wyoming Explorer, Wyoming Fishing Guide, and Ghost Towns Guide.
- Every recipe passes all nine AppForge Blueprint configuration checks.
- Added recipe comparison cards under Settings → About FireVault → Architecture & Modules.
- Added one-tap downloads for every individual recipe blueprint and the complete recipe catalog.
- Added explicit publication requirements so blueprint validity is never confused with App Store readiness.

### Readiness distinction

- **FireVault:** active and publish-ready at the recipe level.
- **Wyoming Explorer:** foundation; needs original brand assets and a verified Wyoming database.
- **Wyoming Fishing Guide:** foundation; needs original brand assets, verified fishing locations, and current regulations.
- **Ghost Towns Guide:** foundation; needs original brand assets and a verified historic-sites database.

### Safety

Alternate recipes are configuration downloads only. They do not activate inside FireVault, alter terminology, switch branding, install databases, migrate storage, or include customer records, media, credentials, backups, or device identity.

### Compatibility

The storage key remains `firevault_vault_build_030`. All current accounts, notes, photos, documents, overlays, IndexedDB media, backups, cloud profiles, Demo Mode behavior, and technician workflows remain compatible.
