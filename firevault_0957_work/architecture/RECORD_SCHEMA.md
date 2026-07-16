# FireVault Record Schema

FireVault Build 0.95.6 separates the reusable record engine from the fields selected by an individual app profile.

## Source files

- `src/record-schema.js` — canonical field, detail-section, and photo-category definitions.
- `src/app-profile.js` — selects which schema items are active for FireVault.
- `architecture/record-schema.json` — portable AppForge-facing schema reference.

## FireVault field groups

### Account Identity

- Account Name — required
- Account ID — unique when entered
- Site Phone

### Location

- Street Address
- City
- State
- ZIP
- GPS coordinates and Plus Code

### Fire Alarm System

- Panel Make
- Panel Model
- Site Notes

## Profile behavior

`APP_PROFILE.dataModel` selects:

- `enabledFieldIds`
- `requiredFieldIds`
- `detailSectionIds`
- `photoCategoryIds`

The live Add/Edit Account form only renders enabled fields. Disabled fields are not erased from an existing record when that record is saved under a reduced future-app profile.

Account Detail tabs are limited by both the active record schema and the enabled module registry. Quick Photo categories are produced by the active schema rather than a separate hard-coded list.

## FireVault compatibility

FireVault enables its complete current schema, including fire-panel fields and all nine field-photo categories. Existing records keep the same storage structure and the `firevault_vault_build_030` storage key.
