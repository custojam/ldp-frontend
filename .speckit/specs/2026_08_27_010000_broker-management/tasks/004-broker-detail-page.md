# Task 004 — Broker Detail Page

**Plan:** [plan.md](../plan.md)
**Status:** Done
**Depends on:** 002

## What to Build

Create the broker detail page at `/brokers/[id]` showing broker config and all assigned leads.

## Files to Touch

- `frontend/src/app/(admin)/brokers/[id]/page.tsx` — CREATE

## Implementation Notes

1. Fetch `GET /api/brokers/:id` on mount.
2. Show config cards: daily cap, timezone, hours (`HH:MM – HH:MM`), working days count.
3. Lead table columns: name, email, phone, IP address, form name, status badge, date received.
4. Empty state message if broker has no leads.
5. Back link to `/brokers`.

## Acceptance Criteria

- [ ] Config cards show correct broker values.
- [ ] Lead table shows all leads assigned to this broker.
- [ ] IP address column present.
- [ ] Empty state shown when no leads.

## Tests to Write

Covered by `frontend/specs/broker.spec.ts` badge label tests.
