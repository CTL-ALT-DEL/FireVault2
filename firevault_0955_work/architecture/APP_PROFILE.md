# FireVault App Profile

FireVault Build 0.95.5 uses a central application profile in `src/app-profile.js` as an active source for reusable UI terminology and configuration.

## Profile responsibilities

- App identity and industry
- Singular and plural record terminology
- Record-ID label
- Reusable interface phrases
- Location, technician, note, equipment, task, deficiency, and file terminology
- Bottom-navigation labels
- Appearance defaults
- Default photo categories
- Enabled modules

## Live integration

The profile now drives visible terminology in:

- Search / Account Directory
- Nearby
- Account Detail
- Add / Edit Account
- Quick Photo
- Navigation labels
- Photo categories

The FireVault profile continues to resolve these terms as Account, Accounts, Account ID, and other fire-service wording. Future AppForge profiles can substitute different vocabulary without changing the underlying record storage or workflows.


## Build 0.95.5 module-aware interface

The App Profile enabled-module list now controls global navigation availability, route access, Account Detail tabs and quick actions, and Settings visibility. FireVault keeps all current modules enabled, so existing technician workflows remain available while future app profiles can omit unused capabilities without branching the shared UI code.

- `architecture/module-bindings.json` records the profile-to-interface requirements used by navigation, routes, Account Detail, and Settings.
