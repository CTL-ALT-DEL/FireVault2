# FireVault Build 0.79.1 — Local Privacy Lock

This release adds an optional device-level privacy lock without pretending to be cloud authentication. Under Settings → Data → Privacy Lock, the user can create a six-digit PIN, choose an inactivity timeout, lock whenever FireVault leaves the foreground, and request a privacy cover for the iOS app switcher.

The PIN and one-time recovery code are stored only as PBKDF2-SHA-256 hashes in a small local configuration record outside the FireVault vault. The raw PIN and recovery code are never included in FireVault backups, WebDAV exports, or the account database. Five failed attempts trigger a short cooldown. A recovery code is shown once when the lock is enabled or changed and can be copied or downloaded.

This is a local privacy control, not vault encryption, signup, passkeys, 2FA, roles, or server authorization. The existing `firevault_vault_build_030` storage key and security schema 4 remain unchanged.
