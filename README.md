# FireVault Build 0.79.11 — Smart Account Intelligence

## Changes

- Adds a configurable Account Health / Data Quality score from 0–100.
- Evaluates address, Account ID, GPS, Plus Code, contacts, phone, panel information, photos, documents, notes, and visit history.
- Applies limited operational deductions for overdue tasks and open or critical deficiencies.
- Shows optional Health controls on Accounts cards and Account Detail.
- Tapping a Health score opens a missing-information checklist with direct navigation to the appropriate workspace.
- Adds **Settings → Data → Data Quality** with display controls, minimum acceptable score, optional-field handling, and a downloadable Data Quality report.
- Preserves the 0.79.10 map-marker hierarchy and deeper selected-account zoom.

## Preserved

- Existing `firevault_vault_build_030` storage key
- Security schema 4 and all account records
- Demo Mode, automatic snapshots, Privacy Lock, and Security Center
- WebDAV and Microsoft storage profiles
- Google Plus Codes and backend adapters

Deploy over the existing FireVault installation. Do not delete or reinstall the Home Screen PWA.
