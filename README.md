# Lead Distribution Platform — Frontend

Next.js admin panel and public lead capture form built with **TypeScript** and **Tailwind CSS**.

---

## Tech Stack

- **Next.js 14** — App Router
- **TypeScript** — type-safe throughout
- **Tailwind CSS** — styling
- **Axios** — API client with JWT interceptor
- **Jest** — BDD-style specs

---

## Environment Variables

Copy `.env.example` to `.env.local` and fill in the values:

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Backend base URL (e.g. `http://127.0.0.1:4000`) |
| `FRONTEND_PUBLIC_PORT` | Port to expose frontend on (used by PM2) |

---

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env.local
# Edit .env.local with your values
```

---

## Running

### Development

```bash
npm run dev
```

### Production build

```bash
npm run build
```

### Production with PM2

```bash
npm install -g pm2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

PM2 commands:

```bash
pm2 restart ldp-frontend
pm2 logs ldp-frontend
pm2 status
```

---

## Running Tests

```bash
npm test
```

| Spec File | Feature |
|---|---|
| `auth.spec.ts` | Auth flow & middleware |
| `broker.spec.ts` | Broker list & detail pages |
| `form.spec.ts` | Public form validation |
| `distribution.spec.ts` | Distribution pages |
| `lead.spec.ts` | Leads page & status badges |

---

## Pages

| Path | Description |
|---|---|
| `/login` | Admin login (public) |
| `/` | Dashboard (protected) |
| `/brokers` | Broker list (protected) |
| `/brokers/:id` | Broker detail (protected) |
| `/forms` | Lead form management (protected) |
| `/distributions` | Distribution management (protected) |
| `/distributions/:id` | Distribution detail (protected) |
| `/leads` | Leads table with status filter (protected) |
| `/[slug]` | Public visitor form (no auth) |

---

## Spec Documentation

Feature specs and task breakdowns are in `.speckit/specs/`. Each spec covers the frontend pages and components for that feature.
