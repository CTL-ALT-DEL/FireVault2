# FireVault Workflow Schema

FireVault Build 0.95.7 moves shared record actions and Quick Photo behavior into a profile-driven workflow schema.

## Purpose

Future AppForge profiles can choose which actions appear in the Account Directory, Account Detail, and Notes workspace without rewriting those screens. The same profile also controls the Quick Photo defaults and optional review fields.

## FireVault preset

The active `fire-alarm-technician` preset keeps:

- Directory: Call, Route, Add Note, Favorite
- Account Detail: Call, Route, Add Note, Photo
- Notes workspace: Task, Deficiency, Photo, Report
- Rear-camera capture
- Account confirmation and account changing
- Category selection
- Overlay preview toggle
- Customer-report selection
- Optional title, internal notes, and customer caption
- 2,048-pixel maximum image dimension with JPEG optimization

## Reuse rule

Actions are exposed only when both conditions are true:

1. The App Profile selects the action for that interface surface.
2. The module required by the action is enabled.

This lets a travel, fishing, inspection, or property app use the same screens with a smaller or different workflow.
