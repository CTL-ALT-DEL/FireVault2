# FireVault Build 0.65.1

Build 0.65.1 adds coordinate calculation to the duplicate-safe Customer CSV Importer.

## Changes
- Calculates latitude and longitude for imported U.S. customer addresses using the U.S. Census Geocoder.
- Uses Latitude and Longitude columns directly when they are already present in the CSV.
- Preserves existing manually captured site GPS coordinates.
- Requires coordinates before import by default.
- Shows coordinate progress, matched addresses, no-match results, and retryable errors.
- Reuses coordinates for shared addresses and caches completed lookups during the browser session.
- Updates existing sites by Account Id without replacing visits, notes, photos, tasks, deficiencies, contacts, or documents.
- Stores coordinate source and matched-address metadata with the site.
- Preserves the multi-user synchronization queue, Sync Activity, Help reader, and FireVault Academy.

## Important
- Coordinate calculation requires an internet connection and the Customer Import screen must remain open.
- Census results are calculated along an address range and should be verified for critical navigation or emergency-response use.
- Records without usable coordinates remain in the import preview unless the technician turns off the coordinate requirement.

Suggested commit message:

`Build 0.65.1 add customer address coordinate calculation to CSV import`
