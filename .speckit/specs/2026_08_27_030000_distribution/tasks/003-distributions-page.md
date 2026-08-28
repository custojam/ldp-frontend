# Task 003 — Distributions Page

**Plan:** [plan.md](../plan.md)
**Status:** Done
**Depends on:** 002

## What to Build

Create the admin distributions list/create page. Shows existing distribution or a create button.

## Files to Touch

- `frontend/src/app/(admin)/distributions/page.tsx` — CREATE

## Implementation Notes

1. Fetch `GET /api/distributions`, `GET /api/brokers`, and `GET /api/forms` on mount.
2. If no form exists: show an amber warning "You need to create a form first." Submission is blocked client-side with error "Oops, please create a form first." if attempted.
3. If no distribution: show "Create Distribution" button (visible regardless of form state). Modal collects distribution name and broker checkboxes with percentages.
4. If distribution exists: show summary card with broker list (linked to detail page) and hide create button.
5. Create calls `distributionsApi.create({ name, brokers: [{ brokerId, percentage }] })`.

## Acceptance Criteria

- [ ] "Create form first" guard shown when no form.
- [ ] Create button hidden when distribution exists.
- [ ] Distribution summary links to detail page.

## Tests to Write

`frontend/specs/distribution.spec.ts`

- "Create form first" guard shown.
- Create button hidden when distribution exists.
