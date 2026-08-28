# Task 005 — Axios Interceptor

**Plan:** [plan.md](../plan.md)
**Status:** Done
**Depends on:** 004

## What to Build

Create the shared axios instance with a request interceptor that attaches the Bearer token,
and a response interceptor that redirects to `/login` on `401`.

## Files to Touch

- `frontend/src/lib/api.ts` — CREATE

## Implementation Notes

1. `const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'`; create axios
   instance with `baseURL: ${API_BASE}/api` and `withCredentials: true`.
2. Request interceptor: read `localStorage.getItem('auth-token')` → set
   `config.headers.Authorization = 'Bearer <token>'` if present (SSR-safe: check `typeof window`).
3. Response interceptor: on `401`, inline `localStorage.removeItem('auth-token')` and
   `window.location.href = '/login'` (SSR-safe: check `typeof window`).
4. Export named API objects: `authApi`, `brokersApi`, `formsApi`, `distributionsApi`,
   `leadsApi`, `publicApi` — each wrapping the shared `api` instance with typed methods.
5. `publicApi` uses a **bare `axios` instance** (not the shared intercepted instance) so no auth
   header is ever attached. It constructs full URLs directly using `API_BASE`.

## Acceptance Criteria

- [ ] Bearer token attached to requests when token exists.
- [ ] No Authorization header when no token.
- [ ] `401` response triggers redirect to `/login`.

## Tests to Write

Covered implicitly by integration — no isolated unit tests needed.
