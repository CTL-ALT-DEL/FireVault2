# FireVault Build 1.03.21 deployment

This ZIP is already arranged as a GitHub Pages deploy root. Extract it, open the extracted folder, and copy its **contents** into the repository root. `index.html`, `sw.js`, `version.json`, `.nojekyll`, `src`, and `assets` must sit at the top level of the repository; do not upload the containing ZIP folder as another nested directory.

Commit and push the complete replacement together. The `.nojekyll` marker tells GitHub Pages to publish FireVault directly without an unnecessary Jekyll build. If earlier workflow runs failed, only the newest run for the newest commit needs to succeed.

Before opening the Home Screen app, load `version.json` from the published site and confirm it reports Build 1.03.21. Then open FireVault and use Settings → About FireVault → App Updates → Check for Updates. Do not delete the Home Screen app or clear Safari website data during a normal update.

Existing customer data remains under the unchanged `firevault_vault_build_030` storage key. Replacing repository files or refreshing the PWA cache does not replace that local vault.
