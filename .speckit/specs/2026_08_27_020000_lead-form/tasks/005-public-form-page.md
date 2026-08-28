# Task 005 — Public Form Page

**Plan:** [plan.md](../plan.md)
**Status:** Done
**Depends on:** 003

## What to Build

Create the visitor-facing form page at `/[slug]`. No authentication required.

## Files to Touch

- `frontend/src/app/[slug]/page.tsx` — CREATE

## Implementation Notes

1. On mount: `GET /api/public/forms/:slug` — if 404, render "Form Not Found".
2. Fields: Full Name, Email Address, Phone Number — all required.
3. Client-side validation on submit: check each field, set per-field error state.
4. On valid submit: `POST /api/public/forms/:slug/submit`.
5. On `201`: replace form with generic thank-you message ("Thank You! Your information has been submitted successfully. We'll be in touch shortly.").
6. On network error: show generic error message.
7. No `Authorization` header — use `publicApi` instance (no auth interceptor).

## Acceptance Criteria

- [ ] Accessible at `/{slug}` with no authentication.
- [ ] "Form Not Found" shown for unknown slug.
- [ ] Inline errors shown per field on failed validation.
- [ ] Thank-you message replaces form on success.

## Tests to Write

`frontend/specs/form.spec.ts`

- Email validation rejects invalid format.
- Name and phone required.
