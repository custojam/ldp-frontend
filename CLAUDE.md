# Frontend — Claude Code Constitution

Next.js 14 admin panel and public lead capture form for the Lead Distribution Platform.

---

## Tech Stack

- **Next.js 14** — App Router
- **TypeScript** — strict mode throughout
- **Tailwind CSS** — styling
- **Axios** — API client
- **Jest** — BDD-style specs in `specs/`

---

## Directory Structure

```
frontend/
├── specs/                        # Jest test files
│   ├── auth.spec.ts
│   ├── broker.spec.ts
│   ├── distribution.spec.ts
│   ├── form.spec.ts
│   └── lead.spec.ts
├── src/
│   ├── middleware.ts             # Next.js route protection
│   ├── app/
│   │   ├── layout.tsx            # Root layout
│   │   ├── page.tsx              # Redirects to /dashboard
│   │   ├── login/                # Public login page
│   │   ├── [slug]/               # Public visitor form (no auth)
│   │   └── (admin)/              # Protected admin area
│   │       ├── layout.tsx        # Admin layout with sidebar
│   │       ├── dashboard/
│   │       ├── brokers/
│   │       ├── forms/
│   │       ├── distributions/
│   │       │   └── [id]/
│   │       └── leads/
│   ├── components/admin/
│   │   ├── BrokerForm.tsx        # Shared broker create/edit form
│   │   ├── LeadStatusBadge.tsx   # Color-coded status badge
│   │   └── Sidebar.tsx           # Admin navigation sidebar
│   ├── lib/
│   │   ├── api.ts                # Axios instance + all API calls (authenticated)
│   │   └── auth.ts               # Auth helpers (getToken, logout, etc.)
│   ├── middleware.ts             # Protects /admin routes; allows /login and /[slug]
│   └── types/                   # Shared TypeScript types
└── .speckit/                    # Feature specs and task breakdowns
```

---

## Architecture Conventions

### API Clients
- **`src/lib/api.ts`** — authenticated axios instance. Attaches JWT from `localStorage` via request interceptor. On `401` response → clears token and redirects to `/login`.
- **`publicApi`** — bare axios instance with no auth header. Used only for `/api/public/*` endpoints (visitor form submission).
- Base URL: `${NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api`

### Auth Flow
- JWT stored in `localStorage` (key: `token`).
- `src/middleware.ts` protects all routes except `/login` and `/[slug]` paths.
- On page load, protected pages check auth state; unauthenticated users are redirected to `/login`.

### Route Groups
- `(admin)/` — all pages require authentication, share the admin layout with sidebar.
- `[slug]/` — public visitor form, no auth, no admin layout.
- `login/` — public, no auth.

---

## Key Page Behaviours

### Leads Page (`/leads`)
- Fetches leads + brokers on mount (brokers pre-loaded for assign modal).
- Status filter sends `?status=<value>` to API (server-side filtering).
- Only `unsent` leads show an Assign button.
- After assignment, refreshes the lead list.

### Distributions Page (`/distributions`)
- Shows amber warning if no form exists yet.
- Create distribution button hidden if distribution already exists.
- Fetches distributions + brokers + forms on mount.

### Distribution Detail Page (`/distributions/[id]`)
- Stats (Total / Sent / Unsent / Duplicate) computed locally from embedded `leads[]` in the distribution response — not from `/api/leads/stats`.

### Public Form Page (`/[slug]`)
- No auth token sent.
- On 404 from API → renders "Form Not Found".
- On `201` → renders thank-you: "Thank You!" / "Your information has been submitted successfully. We'll be in touch shortly."
- Per-field inline errors on `400` response with `errors` array (matched by `e.path` or `e.param`).

---

## LeadStatusBadge Colors

| Status | Classes |
|---|---|
| `sent` | `bg-green-100 text-green-800` |
| `unsent` | `bg-yellow-100 text-yellow-800` |
| `duplicate` | `bg-purple-100 text-purple-800` |
| `failed` | `bg-red-100 text-red-800` |

---

## Running Tests

```bash
npm test
```

Tests in `specs/` use Jest with mocked API calls. Each spec file covers one feature domain.

---

## Environment Variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Backend base URL (e.g. `http://127.0.0.1:4000`) |
| `FRONTEND_PUBLIC_PORT` | Port for PM2 to expose the frontend on |
