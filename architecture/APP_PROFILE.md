# App Profile Foundation

FireVault Build 0.95.3 introduces a central, read-only application profile in `src/app-profile.js`.

The profile currently controls the canonical definitions for:

- App identity and industry
- Reusable record terminology
- Bottom-navigation labels
- Theme identity
- Default photo categories
- Enabled module identifiers

FireVault remains the active profile. Future AppForge work can generate additional profiles that reuse the same core modules while replacing terminology, branding, categories, and vertical-specific modules.

User data is not migrated to a new storage key. The existing key remains `firevault_vault_build_030`.
