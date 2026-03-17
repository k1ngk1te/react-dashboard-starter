# State Management

State is split into three layers, each with a distinct responsibility:

| Layer | Tool | Purpose |
|---|---|---|
| Auth state | External pub-sub store (`authStore`) | Current user, CSRF token, login/logout |
| UI feedback | React Context (`AlertContext`) | Toast notifications |
| Server state | TanStack React Query | Data fetching, caching, mutations |

Alert and React Query are composed in `src/store/contexts/provider.tsx`. Auth state lives in `src/store/listeners/auth.ts` — outside React entirely.

---

## Auth Store

**Location:** `src/store/listeners/auth.ts`

A plain pub-sub store that holds auth state outside React. Components subscribe via `useSyncExternalStore` — no Context, no Provider, no re-render overhead from a wrapping tree.

### Store shape

```ts
type AuthStoreDataType = {
  data: AuthDataType | null;   // user object, null when logged out
  token: string | null;        // raw JWT, used for query cache keys
  csrfToken: string | null;    // kept in memory only, never localStorage
  loading: boolean;            // true until CheckAuth resolves
};
```

`auth: boolean` is derived in `useAuthContext()` as `!!data && !!token`.

### Available hooks

```ts
// Full state + actions
const { auth, loading, data, token, csrfToken } = useAuthContext();

// Throws 401 AppError if not authenticated — use inside protected routes only
const { user, token, csrfToken } = useUserContext();
```

### Actions

Actions are plain functions exported from `src/store/contexts/auth/context.ts`. They write to the store directly — no dispatch, no reducer.

```ts
import { authActions } from '~/store/contexts/auth/context';

authActions.login(payload);           // set user + token + csrfToken, loading → false
authActions.logout(payload);          // clear token, keep data, update csrfToken
authActions.changeCSRFToken(token);   // update csrfToken after rotation
```

They are also returned by `useAuthContext()` for convenience:

```ts
const { login, logout, changeCSRFToken } = useAuthContext();
```

### Auth flow

```
App loads
  → CheckAuth calls useGetAuthQuery()
      → Success: authActions.login(data) → store updates → auth = true
      → Failure: authActions.logout()    → store updates → auth = false
  → useSyncExternalStore notifies all subscribers
  → Router renders Authenticated or NotAuthenticated wrapper
```

---

## AlertContext

**Location:** `src/store/contexts/alert/`

Global toast notification system. Wraps Ant Design's notification-style alerts with auto-dismiss and icon support.

### Available hooks

```ts
const { open, close, success, error } = useAlertContext();
```

### Methods

```ts
// Generic alert
open({
  type: 'success' | 'danger' | 'warning' | 'info',
  message: 'Something happened',
  duration: 5000,    // ms, optional (default 5000)
  iconType: 'check', // 'check' | 'close' | 'exclamation', optional
  classes: '',       // extra CSS classes, optional
});

// Shorthand
success('Logged out successfully');
error('Something went wrong');

// Dismiss
close();
```

### Usage example

```tsx
import { useAlertContext } from '~/store/contexts/alert';

const { success, error } = useAlertContext();

async function handleSubmit() {
  try {
    await submitData();
    success('Saved successfully');
  } catch {
    error('Failed to save');
  }
}
```

---

## React Query

**Location:** `src/store/queries/` and `src/store/contexts/query-provider.tsx`

Used for all server state — fetching, caching, and mutating data. The `QueryClient` is configured centrally with defaults and global error handling.

### QueryClient defaults

```ts
defaultOptions: {
  queries: {
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  }
}
```

### Global error handling

The query client's `MutationCache` and `QueryCache` have global `onError` handlers that:

- **On `401`** — automatically dispatch logout and redirect to the login screen
- **On `ERROR_CSRF_100`** — update the CSRF token from the error response and show an alert

This means individual query hooks don't need to handle these two cases themselves.

### Query tags

Cache keys are defined inline per query file. Always use a consistent key shape so cache invalidation stays predictable:

```ts
queryKey: ['auth']
```

### Auth queries

**`useGetAuthQuery()`** — Checks the current session on app load.

```ts
const { data, status, isLoading } = useGetAuthQuery();
```

**`useLoginMutation()`** — Logs the user in. Passes CSRF token and form data.

```ts
const loginMutation = useLoginMutation();

loginMutation.mutate(
  { csrfToken, data: { email, password } },
  {
    onSuccess: () => { ... },
    onError: (error) => { ... },
  }
);
```

**`useLogoutMutation()`** — Logs the user out and invalidates the auth query cache.

```ts
const logoutMutation = useLogoutMutation();
logoutMutation.mutate({ csrfToken, token });
```

---

## Adding New Queries

Follow this pattern when adding data fetching for a new resource:

**1. Add a URL constant** in `src/server/config/api-routes.ts`:

```ts
export const API_PRODUCTS_URL = '/api/products/';
```

**2. Add a service function** in `src/server/services/`:

```ts
export async function getProducts(): Promise<ProductsResponseType> {
  const response = await HttpInstance.current().get<ProductsResponseType>(API_PRODUCTS_URL);
  return NewSuccessDataResponse(response.data.data);
}
```

**3. Add a tag** in `src/store/tags.ts`:

```ts
export const tags = {
  Auth: ['auth'],
  Products: ['products'],
};
```

**4. Create a React Query hook** in `src/store/queries/`:

```ts
export function useGetProductsQuery() {
  return useQuery({
    queryKey: tags.Products,
    queryFn: getProducts,
  });
}
```

**5. Use it in a component:**

```tsx
const { data, isLoading } = useGetProductsQuery();
```
