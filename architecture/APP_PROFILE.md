# FireVault App Profile

FireVault Build 0.95.4 uses a central application profile in `src/app-profile.js` as an active source for reusable UI terminology and configuration.

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
