# Task 003 — Leads Page

**Plan:** [plan.md](../plan.md)
**Status:** Done
**Depends on:** 002

## What to Build

Create the admin leads page with status filter and manual assignment modal for unsent leads.

## Files to Touch

- `frontend/src/app/(admin)/leads/page.tsx` — CREATE
- `frontend/src/components/admin/LeadStatusBadge.tsx` — CREATE

## Implementation Notes

1. Fetch `GET /api/leads` on mount.
2. Status filter dropdown: All / Sent / Unsent / Duplicate / Failed — filters server-side by passing `?status=<value>` to `leadsApi.getAll(status)`.
3. Table columns: name, email, phone, IP address, form, broker, status badge, date received.
4. Only `unsent` leads show an "Assign" button — opens modal with broker dropdown.
5. Brokers are pre-fetched via `brokersApi.getAll()` on page mount (alongside leads). Modal shows pre-loaded active brokers (`brokers.filter(b => b.isActive)`), confirms `POST /api/leads/:id/assign` via `leadsApi.assign(leadId, brokerId)`.
6. After assignment, refresh lead list.
7. `LeadStatusBadge` renders color-coded badge: sent=green, unsent=yellow, duplicate=purple, failed=red.

## Acceptance Criteria

- [ ] Status filter reduces visible leads correctly.
- [ ] Only unsent leads show Assign action.
- [ ] Manual assign updates lead status in table.
- [ ] Status badges color-coded correctly.
- [ ] IP address column present.

## Tests to Write

`frontend/specs/lead.spec.ts`

- Status badge CSS classes per status.
- Only unsent leads show Assign action.
- Status filter reduces visible leads.
- IP address present.
- Required column list present.
