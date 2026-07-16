# AppForge Factory Manifest

Build baseline: 1.01.3  
Factory schema: 1

The Factory Manifest is the deterministic handoff between a Product Recipe and the AppForge Generator Engine. It says exactly what was requested, what configuration was composed, what validation passed, what outputs are expected, and what still must be supplied.

## Factory pipeline

1. Select a registered Product Recipe.
2. Normalize identity, terminology, branding, modules, content, storage, and output targets into a Generation Request.
3. Validate the request against registered modules, packs, providers, formats, and targets.
4. Compose an App Profile and validate it through the nine-check AppForge Blueprint gate.
5. Produce a Factory Manifest containing the request, recipe, validation results, output inventory, requirements, guardrails, and blueprint.

## Readiness states

- `ready`: Request and profile validation pass with no missing required inputs.
- `requirements-pending`: Factory configuration passes, but brand assets or a verified database remain required.
- `blocked`: Request or profile validation failed; no validated blueprint is emitted.

## Registered output inventory

- Generation Request
- App Profile
- Validated Blueprint
- PWA shell target
- iOS project profile target
- Brand asset set
- Verified content database

Build 1.00.0 generates the PWA source-package target and an iOS handoff profile. It does not claim to generate or sign an Xcode project, install an authoritative database, publish an app, or complete OAuth integrations.

## Guardrails

Every manifest records that FireVault remains the active app, customer data and credentials are excluded, recipe activation is disabled, and automatic publishing is disabled.
