# FireVault

## Build 1.01.0 — UI & Settings Cleanup

Build 1.01.0 keeps the scope to interface cleanup. It simplifies everyday Settings for fire alarm technicians and hides developer-only AppForge tools from normal app use.

### Cleaned up

- Consolidated Settings into six areas: Profile & Photos, Reports, Data & Backup, Maps & GPS, Privacy & Security, and About FireVault.
- Folded Demo Mode into About FireVault.
- Removed AppForge and Architecture from the normal Settings interface.
- Simplified About FireVault copy around the technician workflow.

### Developer access

Existing Build 1.00 AppForge tools are preserved. To open them, serve the app locally and visit `http://localhost:8000/?appforge=1`, then open Settings → About FireVault → AppForge Factory.

### No feature or data changes

This build adds no features and changes no storage contracts. The active storage key remains `firevault_vault_build_030`; existing accounts, photos, documents, imports, backups, security controls, and field workflows are unchanged.
