# FireVault App Profile

FireVault Build 0.95.6 uses `src/app-profile.js` as the active configuration for identity, terminology, modules, and the record data model.

## Profile responsibilities

- App identity, industry, and audience
- Singular and plural terminology
- Record-ID label and reusable interface phrases
- Bottom-navigation labels and appearance defaults
- Enabled modules
- Enabled record fields
- Required record fields
- Account Detail sections
- Photo categories

## Data-model selection

The `dataModel` section points to `firevault.account.v1` and selects:

- 11 enabled FireVault fields
- Account Name as the required field
- Six Account Detail sections
- Nine field-photo categories

The shared interface reads those selections from the profile. Future AppForge profiles can omit panel fields, use a smaller set of detail sections, and substitute their own categories without rewriting the common screens.

## Live integration

The profile drives:

- Search / Account Directory terminology
- Nearby terminology
- Account Detail tabs and actions
- Add / Edit Account field visibility
- Quick Photo categories
- Module-aware navigation, routes, and Settings

FireVault keeps all current fire-alarm modules and fields enabled.
