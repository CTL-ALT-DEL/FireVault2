# Clean Install Notes — FireVault Build 0.50.36

This ZIP is intended to replace the failed 0.50.31 / 0.50.32 branch.

## Important

Build 0.50.36 continues from the working 0.50.34 baseline and directly fixes splash top-bar visibility plus the Home safe-area backing behind the fixed top bar without changing the stable startup path.

## Install

1. Extract the ZIP.
2. Upload the contents to the root of the GitHub Pages branch/folder.
3. Commit and wait for GitHub Pages deployment.
4. On iPhone/iPad, reload the PWA. If an older cached build appears, remove the Home Screen app icon and add it again from Safari.

## Layout repair

- Splash screen stays clean without the top app bar.
- Top app bar appears after the app opens.
- Top app bar is fixed and should not scroll away with the main page.
