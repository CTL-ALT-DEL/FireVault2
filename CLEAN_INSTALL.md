# Clean Install Notes — FireVault Build 0.50.26

This ZIP is intended to be used as the clean baseline for FireVault Build 0.50.26.

## Install

1. Extract the ZIP.
2. Upload the extracted root contents to the FireVault GitHub Pages repository.
3. Commit all files.
4. Wait for GitHub Pages to deploy.
5. Open the deployed PWA and confirm the visible build number shows `0.50.26`.

## Build focus

Build 0.50.26 keeps the stable 0.50.25 startup and photo workflow, then adds Customer Report Photo Selection:

- Customer-photo picker in Report Center.
- Include in customer report checkbox on the photo form.
- Selected customer photos appear in the generated TXT report.
- Deficiency-linked photos include deficiency title when listed in the report.
- Startup path, splash timing, and EOF repair were not changed.

## Validation checklist

- JavaScript syntax check passes.
- Manifest JSON validation passes.
- ZIP integrity test passes.
- Extracted ZIP contains expected root files.
