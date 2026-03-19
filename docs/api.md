# API Reference

The Express server exposes a small set of endpoints that handle authentication and health checks. All endpoints are prefixed with `/api/`.

In development, Vite proxies `/api/*` requests to `http://localhost:5000`. In production, the server serves both the API and the static frontend from the same process.

---

## Endpoints

### GET /api/health/

Check that the server is running. Also generates a CSRF token if one is not already present in the request cookies.

**Rate limit:** 10 requests per 15 minutes per IP

**Response**

```json
{
  "status": "success",
  "message": "Health is Good",
  "data": {}
}
```

**Side effects:**
- If no CSRF token cookie is present, one is generated and set via `Set-Cookie`
- The CSRF token is also returned in the `X-Csrf-Token` response header

---

### GET /api/auth/user/

Verify the current session. Decodes the JWT from the auth cookie and returns the user data.

**Rate limit:** 50 requests per hour per IP

**Response — authenticated (200)**

```json
{
  "status": "success",
  "message": "Authentication credentials verified",
  "data": {
    "token": "...",
    "user": { ... },
    "csrfToken": "..."
  }
}
```

**Response — not authenticated (401)**

```json
{
  "status": "error",
  "message": "Authentication credentials were not found"
}
```

**Side effects:**
- If `PREVENT_CACHE_ON_GET_AUTH_USER=1`, sets `Cache-Control: no-cache` headers to prevent Netlify from caching this endpoint
- CSRF token is refreshed in the response header if not already present in cookies

---

### POST /api/auth/login/

Save credentials to an `httpOnly` auth cookie. The frontend serializes the user data, signs it on the server as a JWT, and stores it as a cookie.

**Rate limit:** 10 requests per 15 minutes per IP

**Required headers:**

| Header | Description |
|---|---|
| `X-Csrf-Token` | Must match the CSRF token in the request cookies |

**Request body**

```json
{
  "credentials": {
    "token": "string",
    "user": { ... }
  }
}
```

**Response — success (200)**

```json
{
  "status": "success",
  "message": "Logged in successfully"
}
```

**Response — validation error (400)**

```json
{
  "status": "error",
  "message": "Token is required"
}
```

**Side effects:**
- Sets `httpOnly` auth cookie containing the signed JWT
- Rotates the CSRF token (new token set in `Set-Cookie` and `X-Csrf-Token` header)

---

### POST /api/auth/logout/

Clear the auth cookie and rotate the CSRF token.

**Rate limit:** 10 requests per 15 minutes per IP

**Required headers:**

| Header | Description |
|---|---|
| `X-Csrf-Token` | Must match the CSRF token in the request cookies |

**Response — success (200)**

```json
{
  "status": "success",
  "message": "Token removed successfully"
}
```

**Side effects:**
- Clears the auth cookie (sets it to expired)
- Rotates the CSRF token

---

## CSRF Protection

All state-mutating endpoints (`POST /api/auth/login/` and `POST /api/auth/logout/`) require a valid CSRF token.

**How it works:**

1. On the first request to `/api/health/` or `/api/auth/user/`, the server generates a CSRF token using `crypto.randomBytes(32)`
2. The token is stored in an `httpOnly` cookie and also returned in the `X-Csrf-Token` response header
3. The client reads the token from the response header (not the cookie, since it's `httpOnly`) and stores it in `authStore` via `authActions.changeCSRFToken`
4. On every mutating request, the client sends the token back in the `X-Csrf-Token` request header
5. The server compares the header value against the cookie value — if they don't match, the request is rejected with `403`

**Error response (403)**

```json
{
  "errorCode": "ERROR_CSRF_100",
  "status": "error",
  "message": "Unable to validate CSRF TOKEN. Please refresh this page and try again."
}
```

If the client receives `ERROR_CSRF_100`, it automatically reloads the page to obtain a fresh CSRF token.

> **Cross-domain deployments:** If the frontend and backend are on different domains (e.g. Vercel + Railway), the browser will block JavaScript from reading the `X-Csrf-Token` response header unless it is explicitly exposed via the `exposedHeaders` CORS option. Uncomment the `exposedHeaders` line in `server/base.ts` in that case.

---

## Rate Limiting

| Limiter | Endpoints | Default window | Default max requests |
|---|---|---|---|
| Auth limiter | `GET /api/auth/user/` | 1 hour | 50 |
| API limiter | All other `/api/*` routes | 15 minutes | 10 |

Both limits are configurable via environment variables. See [Environment Variables](environment-variables.md).

---

## Response Shape

All endpoints return a consistent JSON structure:

```ts
type ApiResponse<T = undefined> = {
  status: 'success' | 'error';
  message?: string;
  data?: T;
  errorCode?: string;
}
```

Paginated list endpoints additionally include:

```ts
type ApiPaginatedResponse<T> = {
  status: 'success' | 'error';
  message?: string;
  pagination: {
    pages: number;
    prev: number;
    next: number;
    total: number;
  };
  data: T[];
}
```

---

## Adding New Endpoints

1. Add the route handler in `server/base.ts`
2. Apply the appropriate rate limiter middleware (`authLimiter` or `apiLimiter`)
3. Add `verifyCSRFTokenMiddleware` to any state-mutating routes
4. Add the URL constant to `src/server/config/api-routes.ts`
5. Create a repository for the resource in `src/server/repositories/<resource>/` — define the interface, mock implementation, and API implementation
6. Create a service in `src/server/services/` that delegates to the repository
7. Create a React Query hook in `src/store/queries/`
