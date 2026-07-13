# FireVault Build 0.80.1 — Scanner Account Matching

## Scanner workflow upgrade

- Moves the primary **Document Scanner** entry point to the **Tools** section.
- Allows scanning to begin without first opening an account.
- After the first page is captured, provides an account search and match step.
- Searches account name, Account ID, address, city, state, ZIP code, and site phone.
- Shows recent accounts before a search is entered.
- Clearly identifies the selected account before Save is enabled.
- Saves the scanned document into the matched account and logs it in that account’s Site Notes activity.
- Opens the matched account’s Files tab after a scan started from Tools is saved.
- Adds **Scan Document** directly to the full Site Notes workspace.
- Keeps scanner access on the account Notes tab.
- Removes scanner capture buttons from the Files/Photo Vault areas; existing scans remain visible and editable there.

## Scanner capabilities preserved

Multi-page camera capture, photo import, automatic edge detection, four-corner correction, rotation, Auto Color, Grayscale, Black & White, Original mode, page reordering, local storage safeguards, PDF preview, PDF download, native sharing, and editing of existing scans remain intact.

## Preserved from earlier builds

Numbered Nearby Accounts map pins remain matched to the distance-sorted list. Smart Account Intelligence remains removed. Building Navigator, Plus Codes, security, backups, cloud-storage profiles, and the existing `firevault_vault_build_030` storage key remain intact.
