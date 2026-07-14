# FireVault 0.94.7 validation

## Completed static checks

- JavaScript syntax passed for `src/app.js`, `src/storage.js`, `src/providers.js`, `src/open-location-code.js`, and `src/media-store.js`.
- `manifest.json` and `version.json` parsed successfully.
- Service-worker build and cached asset query strings reference Build 0.94.7.
- Existing `firevault_vault_build_030` storage key remains unchanged.
- Technician settings normalization preserves existing name, company, phone, email, license, overlay template, and the new resized photo fields.
- Technician photo input accepts image files, center-crops them, resizes to 384 × 384 pixels, converts to JPEG, and reduces quality when needed to keep the stored data manageable.
- Photo upload and removal preserve unsaved values currently entered in the Identity and Contact sections before the page rerenders.
- Identity completion requires technician name and company.
- Contact completion requires phone and email; License / ID remains optional.
- Incomplete Technician sections render open automatically.
- Completed Technician sections render collapsed unless the user manually reopens them.
- The open/closed preference for completed sections is remembered locally on the device.
- Technician Overlay Template behavior and automatic saving remain connected.
- CSS brace counts are balanced in both active stylesheets.
- Build references, release notes, and deployment documents were updated.

## Device checks still required

- Select a large camera photo on an iPhone and confirm the resized profile image remains sharp.
- Confirm Choose Photo and Change Photo open the expected iOS photo picker.
- Confirm Technician sections open automatically when incomplete, collapse after completion, and reopen smoothly when tapped.
- Confirm keyboard behavior for Identity and Contact fields on iPhone.
- Confirm the section layout in iPad portrait, landscape, and Split View.
