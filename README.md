# FireVault Build 0.73.1

## Same-address building import protection

Build 0.73.1 strengthens Customer CSV Import so different buildings are never merged merely because they use the same street address or account name.

- Uses the complete normalized Account ID as the only customer-record matching key.
- Preserves meaningful CLSS suffixes such as `G7C1234-01` and `G7C1234-02` as separate identities.
- Normalizes capitalization, spaces, and typographic dash characters without removing the building suffix.
- Labels shared-address rows as multiple building accounts rather than duplicates.
- Reimporting an exact Account ID updates that account while preserving FireVault-created notes, visits, photos, tasks, and deficiencies.
- Different Account IDs at one address import as separate site records, even when the name and calculated GPS coordinates are also the same.

## Data safety retained

- Uses the existing `firevault_vault_build_030` storage key and database format.
- Keeps rolling automatic snapshots and recovery protections.
- Keeps reliable PWA update checks, portrait-first behavior, and the Build 0.73.0 design system.

Automatic snapshots remain inside the installed PWA. Download an external FireVault backup before deleting or reinstalling the Home Screen app.
