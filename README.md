# FireVault2

FireVault is a customer memory system for fire alarm service technicians.

## Build 0.2

This build is intentionally small and stable. It focuses on customer-first records instead of trying to build the whole platform at once.

### Included

- Customer-first home screen
- Search by customer, address, panel, known issue, or notes
- Add/edit customer records
- Fire alarm panel fields
- Equipment notes
- Access notes
- Known issues
- GPS anchor fields
- Service visit logging
- Visit timeline
- Resource library
- Local browser storage
- Backup export/import
- PWA manifest/service worker basics

### Not included yet

- Background GPS
- Cloud sync
- Photos
- Multi-technician sharing
- AI summaries
- Push notifications

Those features come later after the customer database is dependable.

## Run locally

```bash
npm install
npm start
```

## Build

```bash
npm run build
```

## Development rule

One feature at a time. Test it. Commit it. Then move on.
