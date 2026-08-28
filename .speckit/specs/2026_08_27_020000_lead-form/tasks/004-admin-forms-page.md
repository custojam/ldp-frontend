# Task 004 — Admin Forms Page

**Plan:** [plan.md](../plan.md)
**Status:** Done
**Depends on:** 002

## What to Build

Create the admin forms management page. Shows existing form details, or a create form UI if none
exists.

## Files to Touch

- `frontend/src/app/(admin)/forms/page.tsx` — CREATE

## Implementation Notes

1. Fetch `GET /api/forms` on mount.
2. If form exists: show name, slug, created date, public URL (copyable), "Open" button.
3. "Copy" copies `/{slug}` full URL to clipboard.
4. "Open" opens `/{slug}` in a new tab (`target="_blank"`).
5. If no form: show create form with name input and slug input.
6. Slug auto-generates from name: lowercase, spaces → hyphens, strip non-alphanumeric except hyphens.
7. Admin can override the auto-generated slug.
8. Create button hidden once form exists.

## Acceptance Criteria

- [ ] Form details shown when form exists.
- [ ] Public URL copyable.
- [ ] "Open" opens public URL in new tab.
- [ ] Create button hidden when form exists.
- [ ] Slug auto-generates from name input.

## Tests to Write

`frontend/specs/form.spec.ts`

- Slug auto-generated from name.
- Public URL format.
- Create button hidden when form exists.
