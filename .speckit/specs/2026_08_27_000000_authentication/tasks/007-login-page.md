# Task 007 — Login Page

**Plan:** [plan.md](../plan.md)
**Status:** Done
**Depends on:** 005, 006

## What to Build

Create the login page UI at `/login`. On success, store the token and redirect to `/dashboard`.

## Files to Touch

- `frontend/src/app/login/page.tsx` — CREATE

## Implementation Notes

1. Form fields: email, password.
2. On submit: call `authApi.login(email, password)`.
3. On success: `setToken(res.data.token)` → `router.push('/dashboard')`.
4. On error: show `err?.response?.data?.error || 'Login failed. Please try again.'`.
5. No auth check on this page — if already logged in, no automatic redirect needed.

## Acceptance Criteria

- [ ] Form submits email and password.
- [ ] Successful login stores token and navigates to `/dashboard`.
- [ ] Failed login shows error message without crashing.

## Tests to Write

Covered by `frontend/specs/auth.spec.ts` token helper tests.
