# Task 006 — Next.js Middleware

**Plan:** [plan.md](../plan.md)
**Status:** Done
**Depends on:** 004

## What to Build

Create Next.js middleware that protects admin routes server-side by reading the `auth-token`
httpOnly cookie.

## Files to Touch

- `frontend/src/middleware.ts` — CREATE

## Implementation Notes

1. Protected path prefixes: `/dashboard`, `/brokers`, `/forms`, `/distributions`, `/leads`.
2. Read `request.cookies.get('auth-token')?.value`.
3. If path is protected and no cookie: redirect to `/login?from=<pathname>`.
4. All other paths (including `/login` and `/{slug}`) pass through.

## Acceptance Criteria

- [ ] `/dashboard` without cookie → redirect to `/login`.
- [ ] `/login` always passes through.
- [ ] `/{slug}` (any slug) passes through — not treated as protected.

## Tests to Write

`frontend/specs/auth.spec.ts`

- Admin paths identified as protected.
- `/login` and `/{slug}` are not protected.
