# Task 003 — Broker List Page

**Plan:** [plan.md](../plan.md)
**Status:** Done
**Depends on:** 002

## What to Build

Create the admin brokers list page with a create/edit modal using `BrokerForm`.

## Files to Touch

- `frontend/src/app/(admin)/brokers/page.tsx` — CREATE
- `frontend/src/components/admin/BrokerForm.tsx` — CREATE
- `frontend/src/components/ui/Modal.tsx` — CREATE

## Implementation Notes

1. Fetch brokers on mount: `brokersApi.getAll()`.
2. Table columns: name (link to detail), status badge, daily cap, timezone, hours, working days
   (abbreviated: Mon/Tue/...), lead count, edit/delete actions.
3. Status badge: clicking it toggles `isActive` via `PUT /api/brokers/:id`.
4. Edit opens modal pre-filled with broker data.
5. Delete shows `window.confirm()` prompt before `DELETE /api/brokers/:id`.
6. `BrokerForm` handles both create and edit — receives optional `broker` prop.
7. Working days shown as abbreviated day names (Mon, Tue, Wed, Thu, Fri, Sat, Sun).

## Acceptance Criteria

- [ ] Table shows all broker fields.
- [ ] Status badge click toggles `isActive` without page reload.
- [ ] Edit modal pre-fills current values.
- [ ] Delete removes broker from table after confirmation.

## Tests to Write

`frontend/specs/broker.spec.ts`

- Day abbreviation display (Mon/Tue/...).
- Active/inactive toggle logic.
- Time format `HH:MM – HH:MM`.
- Name and dailyCap validation.
