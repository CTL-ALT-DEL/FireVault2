# FireVault Build 0.73.7 Deployment

1. Download and extract the package.
2. Replace the existing GitHub Pages files with the contents of this package.
3. Commit and wait for GitHub Pages deployment to finish.
4. Open FireVault and use Settings → Data → App Updates if the Home Screen app still shows an older build.

Do not delete and reinstall the Home Screen app unless a current external backup has been downloaded and verified. The live vault storage key remains `firevault_vault_build_030`.


## Build 0.73.7
- Adds Settings → Data → Categories with editable multi-rule account tags.
- A single account can match multiple categories at the same time.
- Accounts show matching category chips in the Accounts directory and Account Detail header.
- Repairs Settings category-tab size and spacing.
- Removes the faint separator line under the global FireVault logo header.
- Preserves the existing `firevault_vault_build_030` storage key and automatic backup protections.
