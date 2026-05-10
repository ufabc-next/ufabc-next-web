# AGENTS.md — ufabc-next-web

## 1. Project Overview

Vue 3 + Vite SPA (TypeScript monorepo, pnpm + Turborepo) serving as the main web frontend for UFABC Next. Students browse teacher/subject reviews, visualize academic performance, view grade history, and manage accounts. Consumes `ufabc-next-backend` API and `ufabc-parser.com`. No SSR, no backend logic.

---

## 2. Stack and Commands

| Tool | Version |
|---|---|
| Node.js | 20.19 (CI-pinned) |
| pnpm | ^9 |
| Turborepo | latest |
| Vue | ^3.5 |
| TypeScript | ^5 |
| Vuetify | ^3.11 |
| Vite | latest |
| Vitest | — |

```bash
# Install
pnpm install

# Dev (port 3000)
pnpm dev

# Build (production)
pnpm build

# Build (staging)
pnpm build:staging

# Type check
pnpm tsc

# Lint
pnpm lint

# Tests
pnpm test

# Single test file
cd apps/container && pnpm test <path/to/spec.ts>
```

---

## 3. Folder Structure

```
apps/
├── container/          # Main SPA — all page views live here
│   ├── src/
│   │   ├── App.vue     # Root: AppBar, router-view, auth init, Mixpanel
│   │   ├── router/index.ts     # All routes + navigation guards
│   │   ├── stores/auth.ts      # Pinia auth store (persisted)
│   │   ├── views/              # One folder per route
│   │   └── components/         # Shared Vue components
│   ├── .env            # Local: VITE_APP_ENV=local, BASE_URL=/
│   ├── .env.production # VITE_APP_ENV=production, BASE_URL=/app
│   └── vite.config.ts  # port 3000, base /app in prod
└── static/             # Static landing page synced to S3 root
packages/
├── services/src/       # Axios API clients — ADD NEW API CALLS HERE
├── types/src/          # TypeScript types — ADD NEW TYPES HERE
├── tsconfig/           # Shared TS configs
└── eslint-config-custom/  # Shared ESLint
```

---

## 4. Code Patterns

### Adding a new route

```typescript
// apps/container/src/router/index.ts
const NewView = () => import('@/views/New/NewView.vue');

// Add to routes array:
{
  path: '/new',
  name: 'new',
  component: NewView,
  meta: {
    title: 'New Page',
    confirmed: true,   // requires logged-in + confirmed account
  },
}
```

### Adding a new API call

```typescript
// packages/services/src/myfeature.ts
import { api } from './api';
import type { MyType } from '@ufabc-next/types';

export const MyFeature = {
  list: () => api.get<MyType[]>('/entities/myfeature'),
  get: (id: string) => api.get<MyType>(`/entities/myfeature/${id}`),
};
```

```typescript
// packages/services/src/index.ts — export it
export { MyFeature } from './myfeature';
```

### Adding a type

```typescript
// packages/types/src/myfeature.ts
export type MyType = {
  _id: string;
  name: string;
};
```

```typescript
// packages/types/src/index.ts — export it
export type { MyType } from './myfeature';
```

### Auth store usage

```typescript
import { useAuthStore } from '@/stores/auth';
const auth = useAuthStore();
// auth.token     → Bearer token string
// auth.user      → decoded User object (or null)
// auth.isLoggedIn → boolean
// auth.authenticate(token) → decode + store JWT
// auth.logOut()  → clear + redirect to /
```

### Vue Query for server state

```typescript
import { useQuery } from '@tanstack/vue-query';
import { Reviews } from '@ufabc-next/services';

const { data, isLoading } = useQuery({
  queryKey: ['teacher', teacherId],
  queryFn: () => Reviews.getTeacher(teacherId.value),
});
```

---

## 5. Database Access Rules

No database. All data:
- **Remote**: fetched via `packages/services/src/api.ts` (backend) or `apiParser` (ufabc-parser)
- **Local**: Pinia auth store (persisted to `localStorage` key `auth`)

Do NOT store user data beyond `user` and `token` fields in the Pinia store — server state belongs in Vue Query cache.

---

## 6. Test Requirements

- Tests live alongside views: `apps/container/src/views/<Name>/<Name>.spec.ts`
- **Vitest + jsdom** — DOM available in tests
- **@testing-library/vue** — render and query Vue components
- **MSW** — mock HTTP calls (do not mock axios directly)
- **80% coverage threshold** enforced (statements, branches, functions, lines)
- Setup file: `apps/container/setup-tests.ts`

```bash
# Run all tests with coverage
cd apps/container && pnpm test

# Single test file
cd apps/container && pnpm test src/views/Reviews/ReviewsView.spec.ts
```

**What must be tested:**
- All new view components (happy path + unauthenticated redirect)
- Service functions with MSW handlers
- Auth store actions (authenticate, logOut, expiry logic)

---

## 7. Build and Pre-Commit Checklist

```bash
pnpm tsc    # 0 TypeScript errors
pnpm lint   # 0 lint errors
pnpm test   # tests pass, coverage ≥ 80%
pnpm build  # dist/ produced without errors
```

CI (`.github/workflows/integration-deploy.yml`): quality matrix (test + lint + tsc) on every push + PR; build + S3 sync on push to main/develop.

---

## 8. Environment Variables

| Variable | Dev | Staging | Production |
|---|---|---|---|
| `VITE_APP_ENV` | `local` | `staging` | `production` |
| `VITE_APP_BASE_URL` | `/` | `/app` | `/app` |
| `VITE_MIXPANEL_TOKEN` | (empty) | CI secret | CI secret |
| `NODE_ENV` | `local` | `staging` | `production` |

API URL is set in `packages/services/src/api.ts` — auto-selects `http://localhost:5000` when `VITE_APP_ENV=local`, else `https://api.v2.ufabcnext.com`.

---

## 9. Absolute Rules

**NEVER:**
- Add backend logic, server endpoints, or database access — this is a pure SPA
- Call `fetch()` or create new axios instances — use `api` or `apiParser` from `packages/services/src/api.ts`
- Store server data in Pinia — use Vue Query; Pinia is only for `auth`
- Add inline styles — use Vuetify classes or extend the Vuetify theme
- Use `window.location` for in-app navigation — use Vue Router `push/replace` (exception: prod logout redirects to `/` via `window.location.href`)
- Commit `.env.production` or `.env.staging` with real tokens

**ALWAYS:**
- Export types from `packages/types/src/index.ts` — not imported directly from internal files
- Export service functions from `packages/services/src/index.ts`
- Use `meta.confirmed: true` on routes that require account confirmation
- Use lazy imports (`() => import(...)`) for all view components in router
- Import with `@/` alias for `apps/container/src` references
- Use `.js` or `.ts` extensions in cross-package imports when required by TS config

---

## 10. Critical Flows — Do Not Break

| Flow | Location | Risk |
|---|---|---|
| JWT-in-URL authentication | `router/index.ts:beforeEach` — `isJWT(tokenParam)` check | Users can never log in |
| Auth store persistence | `stores/auth.ts` — `persist: true` + localStorage key `auth` | Token lost on page refresh → logged out |
| JWT expiry check (1-day) | `router/index.ts:beforeEach` — `iat + 86400s` | Expired tokens never cleared, or valid sessions rejected |
| `confirmed` route guard | `router/index.ts` — `requireConfirmed` branch | Unconfirmed users reach protected views, or confirmed users stuck at /signup |
| API base URL selection | `packages/services/src/api.ts` | Dev hits production API; prod hits localhost |
| Bearer token interceptor | `packages/services/src/api.ts` | All authenticated API calls return 401 |

---

## 11. Ecosystem Context

| Repo | Relationship |
|---|---|
| `ufabc-next-backend` | Backend API — all data reads/writes go here via `https://api.v2.ufabcnext.com` |
| `ufabc-next-server` (legacy) | Legacy backend — OAuth2 flow originates here; JWT issued here |
| `ufabc-next-extension` | Chrome extension — syncs student data to backend; users are redirected from extension to this web app |
| `ufabc-parser.com` | External scraper — `apiParser` calls it directly for curriculum + component data |
| `ufabc-next-tf-modules` | Infrastructure — provisions AWS S3 + CloudFront that serves this SPA |

---

## 12. Contributing Workflow

1. Branch from `main`
2. Make changes following patterns in section 4
3. Run `pnpm tsc && pnpm lint && pnpm test && pnpm build`
4. Load at `http://localhost:3000` and test the modified views
5. For auth-dependent views, pass a valid JWT via `?token=<JWT>` query param
6. Open PR against `main`
7. CI must pass: type check + lint + tests on all matrix commands

**PR requirements:**
- No `any` without comment explaining why
- New API calls in `packages/services/` only — never inline fetch/axios in views
- New routes must have `meta.title` set
- No `console.log` committed
