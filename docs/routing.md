# Routing

Routing is handled by **React Router 7**. The router is configured in `src/router.tsx` and bootstrapped in `src/App.tsx` via `<RouterProvider>`.

---

## Route Structure

```
Root (CheckAuth + ScrollRestoration)
├── NotAuthenticated wrapper
│   └── (unauthenticated routes go here — e.g. /login)
├── Authenticated wrapper
│   └── / → DashboardPage
└── * → NotFoundPage (outside root, no auth check)
```

The router uses a nested layout pattern. Every route (except `*`) is wrapped in `CheckAuth`, which verifies the session on app load before rendering anything.

---

## Route Protection

Three protection wrappers live in `src/layout/protections/`:

### `CheckAuth`

Runs once on app load. Calls `useGetAuthQuery()` to check if the user has a valid session.

- While loading: renders `<SplashScreen />`
- On success: calls `authActions.login(data)` to update `authStore` and renders children
- On failure: calls `authActions.logout()` to update `authStore` and renders children

All other route guards depend on the auth state set by `CheckAuth`.

### `Authenticated`

Wraps routes that require a logged-in user.

- If authenticated: renders the dashboard layout with children
- If not authenticated: lazy-loads and renders the login page
- While `authStore.loading` is true: renders `<SplashScreen />`

### `NotAuthenticated`

Wraps routes that should only be accessible when logged out (e.g. a future `/register` page).

- If not authenticated: renders children
- If authenticated: redirects to the dashboard (`/`)

---

## Route Constants

Route paths are defined in `src/config/routes.ts` and should always be referenced from there rather than hardcoded inline:

```ts
import { DASHBOARD_PAGE } from '~/config';

navigate(DASHBOARD_PAGE); // '/'
```

---

## Adding a New Authenticated Route

1. Create a page component in `src/pages/`
2. Create a container component in `src/containers/` if the page has data-fetching logic
3. Add a path constant to `src/config/routes.ts`
4. Register the route inside the `Authenticated` wrapper in `src/router.tsx`:

```tsx
{
  element: <Authenticated><Outlet /></Authenticated>,
  children: [
    { path: '/', element: <DashboardPage /> },
    { path: '/settings', element: <SettingsPage /> }, // new route
  ],
}
```

---

## Adding a New Unauthenticated Route

Register the route inside the `NotAuthenticated` wrapper:

```tsx
{
  element: <NotAuthenticated><Outlet /></NotAuthenticated>,
  children: [
    { path: '/register', element: <RegisterPage /> },
  ],
}
```

---

## Navigation

Use the `useNavigate` hook from `src/hooks/` rather than React Router's directly — it provides a consistent `navigate(route)` and `goBack()` interface:

```ts
import { useNavigate } from '~/hooks';

const { navigate, goBack } = useNavigate();

navigate(DASHBOARD_PAGE);
goBack();
```

For reading the current path:

```ts
import { usePathname } from '~/hooks';

const pathname = usePathname(); // e.g. '/'
```

---

## 404 Page

Any path not matched by the router renders `src/pages/404.tsx`. This route sits outside the `CheckAuth` wrapper so it renders immediately without waiting for the auth check.

---

## Error Boundary

React Router's `errorElement` on the root route is set to `src/pages/error.tsx`. This catches any unhandled errors thrown during rendering or data loading and displays an error page with a "Go back" and "Go home" option.
