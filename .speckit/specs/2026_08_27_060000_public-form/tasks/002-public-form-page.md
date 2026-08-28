# Task 002 — Public Form Page

**Plan:** [plan.md](../plan.md)
**Status:** Done
**Depends on:** 001

## What to Build

Create the visitor-facing form page at `/[slug]`. No authentication required.

## Files to Touch

- `frontend/src/app/[slug]/page.tsx` — CREATE
- `frontend/src/middleware.ts` — UPDATE (confirm `/{slug}` is not protected)

## Implementation Notes

1. On mount: `publicApi.getForm(slug)`.
   - If 404 → render "Form Not Found" message.
2. Render form with three fields: Full Name, Email Address, Phone Number.
3. Validation:
   - Browser-native: HTML `required` on all fields, `type="email"` on email (prevents empty/invalid submit).
   - Server-side: on 400 response with `errors` array, set per-field error state from `e.path`/`e.param`.
   - On other errors: set generic form-level error message.
4. `publicApi.submitLead(slug, { name, email, phone })`.
5. On `201`: set `submitState = 'success'` — render generic thank-you message:
   - Heading: "Thank You!"
   - Body: "Your information has been submitted successfully. We'll be in touch shortly."
6. On error: set generic form-level error message.
7. `publicApi` must NOT attach Authorization header (separate axios instance or no interceptor).

## Acceptance Criteria

- [ ] Page loads without authentication.
- [ ] "Form Not Found" for unknown slug.
- [ ] Per-field inline errors shown on failed validation.
- [ ] Thank-you message replaces form on success.
- [ ] No auth token sent in submission request.

## Tests to Write

`frontend/specs/form.spec.ts`

- Email validation rejects invalid format.
- Name and phone required.
- `/login` and `/{slug}` not in protected paths (`frontend/specs/auth.spec.ts`).
