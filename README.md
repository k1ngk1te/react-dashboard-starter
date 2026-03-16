# Kite React Dashboard Starter

A production-ready full-stack dashboard starter built with React, TypeScript, and Express. Includes JWT authentication, CSRF protection, rate limiting, a rich component library, and deployment support for both Netlify and self-hosted environments.

---

## Quick Start

```bash
# Install dependencies
npm install

# Start development (client + server concurrently)
npm run dev
```

The client runs on `http://localhost:3000` and the Express server on `http://localhost:5000`.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript 5.8 |
| Build tool | Vite 6 |
| UI library | Ant Design 5 |
| Styling | Tailwind CSS 3 |
| Routing | React Router 7 |
| Server state | TanStack React Query 5 |
| Tables | TanStack React Table 8 |
| HTTP client | Axios |
| Backend | Express 4 |
| Auth | JWT + CSRF tokens |
| Validation | Yup |
| Date handling | Dayjs |

---

## Project Structure

```
├── server/                  # Express backend (TypeScript)
│   ├── base.ts              # Routes, controllers, middleware, CSRF, rate limiting
│   └── index.ts             # Server entry point, static file serving
├── netlify/
│   └── functions/
│       └── serverless.ts    # Netlify serverless function wrapper
├── src/                     # React frontend
│   ├── components/          # Reusable UI components
│   │   ├── controls/        # 40+ UI controls (Button, Input, Modal, Table, etc.)
│   │   └── common/          # Container, Portal, ErrorBoundary, SplashScreen
│   ├── config/              # App-wide config (theme, routes, API URLs, constants)
│   ├── containers/          # Page-level logic components (Home, Login)
│   ├── hooks/               # Custom hooks
│   ├── layout/              # Layout wrapper + route protection
│   ├── pages/               # Route-level page components
│   ├── server/              # Client-side API layer
│   │   ├── config/          # API route URL constants
│   │   ├── serializers/     # API response transformers
│   │   ├── services/        # Auth service functions
│   │   ├── types/           # API-specific TypeScript types
│   │   └── utils/           # HTTP, auth, pagination, response helpers
│   ├── store/               # Global state
│   │   ├── contexts/        # Auth, Alert, QueryProvider contexts
│   │   └── queries/         # React Query hooks
│   ├── styles/              # Global CSS + Ant Design overrides
│   ├── types/               # Shared TypeScript types
│   └── utils/               # Error handling, HTTP, dates, formatting
├── public/                  # Static assets
├── dist/                    # Build output — gitignored
│   ├── server/              # Compiled Express server JS
│   └── netlify/             # Compiled Netlify function JS
└── docs/                    # Documentation
```

---

## Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start client + server concurrently |
| `npm run dev:client` | Start Vite dev server only |
| `npm run dev:node` | Start Express server only (nodemon + tsx) |
| `npm run build` | Type-check, build frontend, compile server to `dist/` |
| `npm start` | Run production server (`node dist/server/index.js`) |
| `npm run lint` | Run ESLint |
| `npm run dev:netlify` | Build and run Netlify Dev locally |

---

## Documentation

- [API Reference](docs/api.md) — Endpoints, request/response formats, CSRF usage
- [Routing](docs/routing.md) — Route structure, protection wrappers, adding routes
- [State Management](docs/state-management.md) — Auth context, Alert context, React Query
- [Environment Variables](docs/environment-variables.md) — All env vars with descriptions and defaults
- [Deployment](docs/deployment.md) — Netlify and self-hosted deployment guides
- [Features](docs/features.md) — Full list of included features, hooks, and components
- [Glossary](docs/glossary.md) — Key terms and concepts used in this project

---

## Replacing Mock Auth

The login function in `src/server/services/auth.service.ts` uses hardcoded mock credentials for quick local testing. To connect a real backend:

1. Replace the mock data in `login()` with a real API call to your auth provider
2. Update `AuthSerializer.serializeLogin()` in `src/server/serializers/auth.serializer.ts` to match your API response shape
3. Set `TEST_MODE=0` in your production `.env`

---

## Prerequisites

- Node.js v18+
- npm v9+

---

## Author

Built by **Emmanuel (k1ngk1te)** — [https://github.com/k1ngk1te](https://github.com/k1ngk1te)
