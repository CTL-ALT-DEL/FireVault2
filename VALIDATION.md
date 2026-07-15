# FireVault 0.94.9 validation

## Completed static checks

- JavaScript syntax passed for all active JavaScript modules.
- `manifest.json` and `version.json` parsed successfully.
- Service-worker build, module imports, and cached asset query strings reference Build 0.94.9.
- Existing `firevault_vault_build_030` storage key remains unchanged.
- Photo Overlay field choices contain one **Tech Info** field and do not expose the individual Technician, Company, Phone, Email, or License fields.
- Existing field layouts containing any legacy technician-profile field migrate to one Tech Info field without duplicates.
- Tech Info retains adjustment controls for ordering, Left/Center/Right alignment, and removal.
- The line arrangement inside Tech Info remains controlled by the Technician Overlay Template in Profile.
- The live preview and exported photo expand Tech Info using the saved Profile template.
- Raw legacy overlay templates containing technician tags also migrate to Tech Info.
- CSS brace counts are balanced in both active stylesheets.
- Build references, release notes, deployment files, and archive contents were updated.

## Device checks still required

- Confirm an existing 0.94.8 overlay with multiple technician fields displays one Tech Info row after update.
- Confirm moving and aligning Tech Info updates the live preview immediately on iPhone.
- Confirm editing the Technician Overlay Template in Profile changes Tech Info contents without creating separate overlay fields.
- Confirm exported photos match the live preview for Left, Center, and Right Tech Info alignment.
- Confirm layouts in iPad portrait, landscape, and Split View.
