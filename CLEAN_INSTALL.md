# Clean Install Notes — FireVault Build 0.50.7

Use this ZIP as a clean root package. Do not copy the outer `firevault-build-*` folder into your repository.

## Expected root files

```text
index.html
manifest.json
src/
assets/
README.md
CLEAN_INSTALL.md
.gitignore
```

## Install reminder

Copy the contents of this ZIP into the GitHub Pages project root, replacing the old files. The app still uses the existing FireVault local storage key, so existing browser data should remain compatible.

## Tablet note

Build 0.50.7 allows portrait and landscape orientation in the PWA manifest and adds responsive layout rules for iPad-sized screens.
