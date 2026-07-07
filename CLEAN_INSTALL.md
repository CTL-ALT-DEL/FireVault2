# Clean Install Notes — FireVault 0.43.7

This ZIP is a clean root package. The top-level contents should be copied directly into the FireVault project root.

Expected root contents:

```text
index.html
manifest.json
src/
assets/
README.md
CLEAN_INSTALL.md
.gitignore
```

Build 0.43.7 adds the per-site Inspection Checklist workflow. It keeps the same localStorage key so existing FireVault data should remain compatible.

Before committing, delete any extracted folders named like `firevault-build-*` from inside the repo.
