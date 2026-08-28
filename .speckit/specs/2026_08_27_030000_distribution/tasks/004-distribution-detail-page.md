# Task 004 — Distribution Detail Page

**Plan:** [plan.md](../plan.md)
**Status:** Done
**Depends on:** 002

## What to Build

Create the distribution detail page at `/distributions/[id]` with broker management and lead history.

## Files to Touch

- `frontend/src/app/(admin)/distributions/[id]/page.tsx` — CREATE

## Implementation Notes

1. Fetch `GET /api/distributions/:id` on mount.
2. Stats row: total leads, sent, unsent, duplicate counts.
3. Broker table: name, percentage, isActive badge, edit (modal with % + isActive checkbox) / remove actions.
4. "Add Broker" panel: select from brokers not yet in distribution, enter percentage, submit.
5. Full lead history table: name, email, phone, IP, broker, status badge, date.
6. All mutations (add/edit/remove broker) refresh the page data after success.

## Acceptance Criteria

- [ ] Stats counts correct per status.
- [ ] Broker table shows percentage and isActive badge.
- [ ] Edit percentage inline and save.
- [ ] Remove broker from distribution.
- [ ] Add broker with percentage.
- [ ] Full lead history visible.

## Tests to Write

`frontend/specs/distribution.spec.ts`

- Percentage validation (1–100).
- Broker payload construction.
- Lead counts by status.
