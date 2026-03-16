# State Management

State is split into three layers, each with a distinct responsibility:

| Layer | Tool | Purpose |
|---|---|---|
| Auth state | React Context (`AuthContext`) | Current user, CSRF token, login/logout |
| UI feedback | React Context (`AlertContext`) | Toast notifications |
| Server state | TanStack React Query | Data fetching, caching, mutations |

All three are composed in `src/store/contexts/provider.tsx` and wrap the entire app.

---

## AuthContext

**Location:** `src/store/contexts/auth/`

Manages the authentication lifecycle — whether a user is logged in, their data, and the CSRF token used for mutating requests.

### Shape

```ts
type AuthContextType = {
  auth: 'AUTHENTICATED' | 'NOT_AUTHENTICATED' | null;
  loading: boolean;
  csrfToken: string | null;
  token: string | null;
  data: AuthDataType | null;
}
```

- `auth` — `null` means the initial check hasn't completed yet
- `csrfToken` — extracted from the `X-Csrf-Token` response header and kept in memory (never in localStorage)
- `token` — the raw JWT string, used as an identifier for query cache keys

### Available hooks

```ts
// Full auth context (auth state, loading, token, csrfToken)
const { auth, loading, csrfToken } = useAuthContext();

// Just the user data
const user = useUserContext(); // returns AuthDataType | null
```

### Methods

```ts
const { login, logout, changeCSRFToken } = useAuthContext();

login(data);              // store user + token after successful auth
logout();                 // clear user data
changeCSRFToken(token);   // update CSRF token after rotation
```

### Auth flow

```
App loads
  → CheckAuth calls useGetAuthQuery()
      → Success: login(data) dispatched → auth = 'AUTHENTICATED'
      → Failure: logout() dispatched → auth = 'NOT_AUTHENTICATED'
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

Cache keys are centralised in `src/store/tags.ts`:

```ts
import { tags } from '~/store';

tags.Auth // ['auth']
```

Always use tags for query keys so cache invalidation stays consistent.

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
