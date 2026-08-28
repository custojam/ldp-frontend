# Lead Distribution Platform — Frontend Constitution

## Purpose

The frontend is the admin panel and public lead capture form for the Lead Distribution
Platform, built with **Next.js 14** (App Router), **TypeScript**, **Tailwind CSS**, and
**Axios**. It provides a protected admin area for managing brokers, forms, distributions,
and leads — and a public visitor-facing form at `/{slug}` that captures leads without
requiring authentication.

---

## Core Principles

### I. Separation of Concerns (NON-NEGOTIABLE)

Pages own layout and composition. `src/lib/` owns all API communication. Components
own presentation only.

- Pages MUST NOT contain inline `axios` or `fetch` calls. All API communication goes
  through `src/lib/api.ts` (authenticated) or the `publicApi` instance (unauthenticated).
- Components MUST NOT make API calls directly. Data is fetched in page components and
  passed down as props.
- Business logic (filtering, transformations, derived state) belongs in the page or a
  utility function — not scattered across JSX.

**Rationale**: Centralising API calls makes authentication, error handling, and redirects
consistent across the entire app. Components that fetch their own data are impossible
to test in isolation.

### II. Authentication Architecture (NON-NEGOTIABLE)

JWT is stored in `localStorage`. The Next.js middleware and the Axios interceptor enforce
auth at both the routing layer and the API layer.

- **`src/middleware.ts`** — Protects all routes except `/login` and `/[slug]` paths.
  These two paths MUST NEVER be added to the protected list.
- **`src/lib/api.ts`** — Axios instance with a request interceptor that attaches
  `Authorization: Bearer <token>` from `localStorage`. On `401` response: clear the
  token and redirect to `/login`.
- **`publicApi`** — A separate bare Axios instance with NO auth header. Used exclusively
  for `/api/public/*` endpoints. MUST NOT share the authenticated instance.
- Base URL for both: `${NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api`.

**Rationale**: The public form (`/[slug]`) must be accessible to anonymous visitors.
Accidentally protecting it breaks the core product. The two API instances prevent auth
tokens from leaking into public submissions.

### III. Route Groups & Layout

- `app/(admin)/` — All pages in this group require authentication and use the admin
  layout with the sidebar. Adding a page here automatically makes it protected.
- `app/login/` — Public. No admin layout.
- `app/[slug]/` — Public visitor form. No admin layout. No auth.
- `app/page.tsx` — Root redirects to `/dashboard`.

### IV. Component Discipline

- Components MUST have a single, clearly stated responsibility. Split when a component
  manages more than one distinct concern.
- Shared admin components live in `src/components/admin/`. Do not duplicate components —
  extend existing ones first.
- Before creating a new component, check `src/components/admin/` for an existing one
  that satisfies the requirement.
- Styling MUST use Tailwind CSS utility classes. No inline `style` props except for
  truly dynamic values that Tailwind cannot express.

### V. Key Page Behaviours (NON-NEGOTIABLE)

These are invariants derived from the spec and MUST NOT be changed without a spec update.

- **Leads page**: Brokers are pre-fetched on page mount (not lazily in the modal). Status
  filter passes `?status=<value>` as a query parameter (server-side filtering, not client
  filtering). Only `unsent` leads show an Assign button.
- **Distribution detail page**: Stats (Total / Sent / Unsent / Duplicate) are computed
  locally from the embedded `leads[]` array in the distribution response. They MUST NOT
  call `/api/leads/stats`.
- **Public form page**: No auth token is sent in any request. On `404` from the API →
  render "Form Not Found". On `201` → render the exact thank-you copy:
  heading `"Thank You!"`, body `"Your information has been submitted successfully. We'll be in touch shortly."`.
  Per-field inline errors on `400` responses with an `errors` array (matched by `e.path` or `e.param`).
- **Distributions page**: Show an amber warning if no form exists. Hide the Create
  Distribution button if a distribution already exists.

### VI. LeadStatusBadge Colors (NON-NEGOTIABLE)

| Status | Tailwind Classes |
|---|---|
| `sent` | `bg-green-100 text-green-800` |
| `unsent` | `bg-yellow-100 text-yellow-800` |
| `duplicate` | `bg-purple-100 text-purple-800` |
| `failed` | `bg-red-100 text-red-800` |

These colors are spec-defined and MUST NOT be changed without a spec update.

### VII. Quality Gates (Definition of Done)

A feature is DONE only when ALL of the following are true:

- The feature meets all spec acceptance criteria.
- Protected pages are unreachable without a valid JWT.
- Public pages (`/login`, `/[slug]`) are reachable without any token.
- `publicApi` is used for all `/api/public/*` calls; the authenticated `api` instance
  is never used for public submissions.
- No `console.log` statements remain in production code.
- `npm test` passes with zero failures.
- Tests cover all documented acceptance criteria.
- `spec.md`, `plan.md`, and task files are committed alongside the feature.
- **Verify in code, never assume** — Before marking any acceptance criterion as done,
  the actual source file MUST be read and verified.

### VIII. Test-Driven Development (NON-NEGOTIABLE)

Frontend specs in `specs/` cover component behaviour and page logic. Tests are written
before or alongside implementation — never after.

- Tests MUST cover: correct rendering per status/state, conditional element visibility,
  user interactions (filter changes, modal open/close, form submit), and error states.
- `npm test` MUST pass with zero failures before any change is considered complete.

### IX. Spec-Driven Development (NON-NEGOTIABLE)

No feature enters implementation without a reviewed `spec.md` and `plan.md`.

- Every feature follows the SpecKit lifecycle: specify → clarify → plan → tasks → implement.
- Specs are never deleted — Done specs serve as the architectural record of the project.
- Spec lifecycle: **Draft → Ready → Planned → In Progress → Done**.
- Before writing any production code for a new feature or bug fix, the relevant task file
  MUST exist in `tasks/` and MUST be listed in `tasks/index.md`.

---

## Non-Functional Requirements

| Requirement | Target |
|---|---|
| **Security** | JWT token never sent to public endpoints; `/[slug]` always unauthenticated |
| **Accessibility** | Interactive elements have correct labels and keyboard navigation |
| **Performance** | No unnecessary re-renders; data fetched once on mount where possible |
| **Responsiveness** | Admin panel usable on desktop; public form usable on mobile |

---

## Technology Stack

| Package | Purpose |
|---|---|
| `next` (v14) | App Router framework |
| `typescript` | Type safety throughout |
| `tailwindcss` | Utility-first CSS |
| `axios` | HTTP client (two instances: authenticated + public) |
| `jest` + `ts-jest` | Test runner |

No new runtime dependencies MUST be introduced without updating this table.

---

## Architecture

```
Browser
  └── Next.js Middleware (src/middleware.ts)
        ├── Protected: app/(admin)/ → Admin layout + sidebar
        ├── Public: app/login/      → Login page
        └── Public: app/[slug]/     → Visitor form (publicApi only)

API Calls
  ├── src/lib/api.ts     → Axios + JWT interceptor → /api/* (admin endpoints)
  └── publicApi          → Bare Axios → /api/public/* (no auth)
```

- **`src/middleware.ts`** — Route-level auth guard.
- **`src/lib/api.ts`** — Single file for all API functions + the two Axios instances.
- **`src/components/admin/`** — Shared admin UI components.
- **`src/app/(admin)/`** — All protected admin pages.
- **`src/app/[slug]/`** — Public visitor form.

---

## Development Workflow

```bash
npm run dev    # Start Next.js development server
npm run build  # Production build
npm test       # Run all specs
```

### SpecKit Feature Flow

```
New feature: /speckit.specify → /speckit.clarify → /speckit.plan
           → /speckit.tasks → /speckit.implement → commit

Bug fix: investigate → write failing test → fix → verify npm test passes → commit
```

---

## Out of Scope

- Server-side rendering with auth (all auth is client-side via localStorage + middleware)
- Real-time updates (WebSockets / SSE) — not specced; polling only
- Multi-language / i18n — English only
- Mobile native app — web only
- Dark mode — not specced

---

## Governance

This constitution supersedes all informal conventions and undocumented practices.
When this document conflicts with any other artifact, this document takes precedence.

**Amendment procedure**: Open a PR with the proposed change and a clear rationale.
Update the version below on merge.

---

**Version**: 1.0.0 | **Ratified**: 2026-08-27
