# Auth Architecture

A full walkthrough of how authentication works in this starter — from credential storage, to the CSRF token, to the client-side store, to the HTTP layer.

---

## Overview

Auth is split across two distinct layers:

| Layer | Responsibility |
|---|---|
| **Express server (BFF)** | Stores and retrieves the JWT in an `httpOnly` cookie. Never handles login/logout logic itself. |
| **External API** | Performs actual authentication — validates credentials, issues tokens. |
| **Client store** | Holds auth state in memory (user data, token, CSRF token). Never persists to `localStorage`. |

The Express server acts purely as a **credential proxy** (BFF — Backend for Frontend). It signs and stores the JWT so the browser never sees it directly, protecting it from XSS.

---

## Credential Storage

### JWT

When login succeeds:

1. The external API returns `{ token, user }` (via the mock or real repository)
2. The client calls `POST /api/auth/login/` on the Express server, passing the credentials
3. Express signs the credentials into a JWT using `SECRET_KEY` and stores it in an `httpOnly` cookie named by `AUTH_KEY`
4. The browser never sees the raw JWT — it's stored server-side in a cookie JavaScript cannot read

On subsequent requests, Express reads the cookie on `GET /api/auth/user/`, decodes the JWT, and returns the user data.

### CSRF Token

Because the auth cookie is `httpOnly`, a CSRF attack could trick the browser into sending it to the server without the user's knowledge. The **double-submit cookie pattern** prevents this:

1. On the first request to `/api/health/` or `/api/auth/user/`, Express generates a random 32-byte token and sets it as both:
   - A response header (`X-Csrf-Token`)
   - An `httpOnly` cookie (`X-Csrf-Token`)
2. The client reads the token from the **response header** (not the cookie — it's `httpOnly`) and stores it in `authStore`
3. On every mutating request (`POST`), the client sends the token back in the `X-Csrf-Token` **request header**
4. Express reads both values and rejects the request with `403` if they don't match

A third-party site cannot forge this because it cannot read the response headers from a cross-origin request.

---

## Client-Side Auth State

Auth state is held in a **plain pub-sub store** (`src/store/listeners/auth.ts`), completely outside React.

```
src/store/listeners/auth.ts   ← the store (source of truth)
src/store/contexts/auth/
  context.ts                  ← authActions + useAuthContext + useUserContext
```

### Store shape

```ts
type AuthStoreDataType = {
  data: AuthDataType | null;     // user object
  token: string | null;          // raw JWT from the external API
  csrfToken: string | null;      // CSRF token, kept in memory only
  refreshToken: string | null;   // optional, only if external API provides one
  loading: boolean;              // true until CheckAuth resolves
};
```

`data`, `token`, and `csrfToken` are all `null` when logged out. `loading` starts as `true` and is set to `false` after the first `CheckAuth` pass.

### Reading state

Components never import `authStore` directly. They use `useAuthContext()`, which subscribes via `useSyncExternalStore`:

```ts
const { auth, loading, data, token, csrfToken } = useAuthContext();
// auth = !!data && !!token (derived boolean)
```

For protected code that requires a logged-in user, `useUserContext()` throws `AppError(401)` if auth state is missing — use it inside `Authenticated`-wrapped routes only:

```ts
const { user, token, csrfToken } = useUserContext();
```

For non-React code (services, repositories), use `authStore.getUser()` directly — same behaviour, same 401 throw:

```ts
const { data, token, csrfToken } = authStore.getUser();
```

### Writing state (actions)

All writes go through `authActions` in `src/store/contexts/auth/context.ts`. These are plain functions — no dispatch, no reducer:

```ts
authActions.login({ user, token, csrfToken });   // sets data + token + csrfToken, loading → false
authActions.logout({ csrfToken? });              // clears token, optionally updates csrfToken
authActions.changeCSRFToken(token);              // updates csrfToken only (after rotation)
```

`authActions` are also returned by `useAuthContext()` for convenience in components.

---

## Auth Flow

### App load

```
App mounts
  → CheckAuth renders
      → useGetAuthQuery() calls GET /api/auth/user/
          → Success (200): authActions.login(response.data)
              → authStore.set({ data, token, csrfToken, loading: false })
              → HttpInstance.login(token, csrfToken) — sets Authorization + CSRF headers
          → Failure (401): authActions.logout()
              → authStore.set({ token: null, loading: false })
              → HttpInstance.logout() — clears Authorization header
  → useSyncExternalStore notifies all subscribers
  → Authenticated / NotAuthenticated wrappers render the correct layout
```

### Login

```
User submits login form
  → useLoginMutation.mutate({ data: { email, password } })
      → MockAuthRepository.login() (or ApiAuthRepository when real API is ready)
          → Calls external API → gets { token, user }
          → Calls saveCredentials() → POST /api/auth/login/ → Express sets httpOnly cookie
          → Returns LoginResponseType with { token, user, csrfToken }
      → onSuccess: authActions.login(response.data)
          → authStore updated → components re-render → redirect to dashboard
```

### Logout

```
User clicks logout
  → useLogoutMutation.mutate()
      → MockAuthRepository.logout() (or ApiAuthRepository)
          → Calls removeCredentials() → POST /api/auth/logout/ → Express clears httpOnly cookie
          → Returns LogoutResponseType with rotated csrfToken
      → onSuccess: authActions.logout(response.data)
          → authStore updated → components re-render → redirect to login
```

---

## HTTP Layer

All API calls go through `HttpInstance` (`src/utils/http/index.ts`) — a single Axios instance shared across the app.

### Header management

| Method | Effect |
|---|---|
| `HttpInstance.login(token, csrf)` | Sets `Authorization: Bearer <token>` and `X-Csrf-Token` |
| `HttpInstance.csrf(token)` | Updates `X-Csrf-Token` only |
| `HttpInstance.logout()` | Clears `Authorization` header |
| `HttpInstance.current()` | Returns the raw Axios instance |

These are called directly by `authActions` and the base repository — components never touch `HttpInstance`.

### 401 interceptor and token refresh

`HttpInstance` has a response interceptor that handles expired access tokens:

```
Request fails with 401
  → Is this the refresh endpoint itself? → logout + reject (no infinite loop)
  → Was this request already retried?    → logout + reject (no double refresh)
  → No refresh token in authStore?       → logout + reject
  → No refresh handler registered?       → logout + reject
  → Otherwise:
      → If another refresh is in progress → queue this request, wait
      → Call authStore.getRefreshHandler()(refreshToken)
          → On success: update store with new token, retry all queued requests
          → On failure: logout + reject all queued requests
```

The refresh handler is registered by the repository factory (`src/server/repositories/auth/index.ts`) at startup — only if the active repository implements `refreshAccessToken`:

```ts
if (AuthRepository.refreshAccessToken && AuthRepository.refreshUrl) {
  authStore.setRefreshHandler(
    AuthRepository.refreshAccessToken.bind(AuthRepository),
    AuthRepository.refreshUrl,
  );
}
```

`MockAuthRepository` does not implement `refreshAccessToken`, so no handler is registered in mock mode.

### CSRF token rotation

After any mutating request, Express rotates the CSRF token and returns the new value in the `X-Csrf-Token` response header. The React Query global error handler in `QueryProvider` reads this and calls `authActions.changeCSRFToken(newToken)` automatically — individual queries don't need to handle it.

---

## Repository Pattern

The auth data layer is abstracted behind `IAuthRepository` (`src/server/repositories/auth/auth.type.ts`):

```ts
interface IAuthRepository {
  getAuth(): Promise<LoginResponseType>;
  login(params): Promise<LoginResponseType>;
  logout(params): Promise<LogoutResponseType>;
  refreshAccessToken?(refreshToken: string): Promise<{ token: string; refreshToken?: string }>;
  refreshUrl?: string;
}
```

Two implementations:

| Class | When active | Behaviour |
|---|---|---|
| `MockAuthRepository` | `VITE_USE_MOCK=1` | Returns hardcoded data. No external API calls. |
| `ApiAuthRepository` | `VITE_USE_MOCK=0` | Makes real HTTP calls to `VITE_API_URL`. |

The factory (`src/server/repositories/auth/index.ts`) picks the active implementation and registers the refresh handler if supported.

The **base class** (`BaseAuthRepository`) holds shared credential operations:

| Method | What it does |
|---|---|
| `getCredentials()` | Calls `GET /api/auth/user/` — reads JWT from cookie, returns user + CSRF token |
| `saveCredentials(csrf, data)` | Calls `POST /api/auth/login/` — stores JWT in httpOnly cookie |
| `removeCredentials({ csrf, token })` | Calls `POST /api/auth/logout/` — clears httpOnly cookie |
| `refreshCsrfToken()` | Calls `GET /api/health/` — fetches a fresh CSRF token, updates `HttpInstance` headers and `authStore` |

---

## Disabling CSRF

CSRF protection can be turned off for local development or demo mode:

```env
DISABLE_CSRF=1        # server — skips verifyCSRFTokenMiddleware
VITE_DISABLE_CSRF=1   # client — skips csrfToken check in authStore.getUser()
```

**This is blocked in production.** `validateEnv()` throws at server startup if `DISABLE_CSRF=1` and `NODE_ENV=production`.

When disabled:
- `verifyCSRFTokenMiddleware` is a no-op — all `POST` requests pass through
- The health and auth endpoints skip generating and returning CSRF tokens
- `authStore.getUser()` only requires `data` and `token` — `csrfToken` is ignored
- `getCredentials()` skips the CSRF retry loop

Both variables must be set together — the server and client must agree.
