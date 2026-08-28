# Task 004 — Frontend Auth Lib

**Plan:** [plan.md](../plan.md)
**Status:** Done
**Depends on:** none

## What to Build

Create token helper functions used across the frontend: get, set, clear, and an
`isAuthenticated()` check.

## Files to Touch

- `frontend/src/lib/auth.ts` — CREATE

## Implementation Notes

1. `getToken()` — `localStorage.getItem('auth-token')` — returns `string | null`.
2. `setToken(token)` — `localStorage.setItem('auth-token', token)`.
3. `clearToken()` — `localStorage.removeItem('auth-token')`.
4. `isAuthenticated()` — returns `!!getToken()`.

## Acceptance Criteria

- [ ] `getToken()` returns `null` when localStorage is empty.
- [ ] `setToken()` + `getToken()` round-trip works.
- [ ] `clearToken()` removes the stored token.
- [ ] `isAuthenticated()` returns `false` when no token, `true` when token present.

## Tests to Write

`frontend/specs/auth.spec.ts`

- `getToken()` returns null when empty.
- `setToken()` + `getToken()` round-trip.
- `clearToken()` removes token.
- `isAuthenticated()` false/true.
