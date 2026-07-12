# FireVault Build 0.76.0

## Accounts Workflow Completion

This release builds on the stable 0.75.9 Accounts directory and completes the manual account workflow.

### Accounts directory
- Sort by A–Z, Favorites, Recently Opened, or Priority.
- Search and filter counts now show the visible result count.
- Reset View clears search and filters from the no-results state.
- Improved empty-account guidance and accessibility labels.
- Preserves list position when opening an account and returning.

### Add / Edit Account
- Rebuilt as a guided three-section form.
- Adds Account ID and Site Phone to manual account creation.
- Enforces a required account name.
- Prevents exact duplicate Account IDs while still allowing multiple accounts at the same address.
- Preserves GPS capture, panel information, notes, and safe return behavior.
- Phone numbers continue to format as `(xxx)xxx-xxxx`.

### Data safety
The existing `firevault_vault_build_030` storage key, automatic backups, Demo Mode, WebDAV, categories, imports, and account history remain unchanged.
