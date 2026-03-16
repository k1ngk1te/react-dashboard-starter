# Environment Variables

All environment variables are defined in the `.env` file at the project root. The server reads them via `dotenv`. Vite reads them at build time for any frontend-exposed variables.

Copy the values below into your `.env` to get started.

---

## Server Variables

These are read exclusively by the Express server (`server/base.ts`, `server/index.ts`).

### Security

| Variable | Default | Description |
|---|---|---|
| `SECRET_KEY` | `mrhqpzfUCPLie3537e7ebb5f58e` | Secret used to sign and verify JWTs. **Must be changed to a strong random value in production.** |
| `AUTH_KEY` | `nrGgtPY` | Name of the `httpOnly` cookie that stores the JWT. Change to any string. |
| `CSRF_TOKEN` | `X-Csrf-Token` | Header name used to transmit the CSRF token. |
| `CSRF_TOKEN_EXPIRES` | `undefined` (session) | How long the CSRF token cookie lives, in seconds. If not set, it expires when the browser session ends. |
| `JWT_EXPIRES` | `14400` | JWT expiry in seconds. Default is 4 hours. |

### CORS

| Variable | Default | Description |
|---|---|---|
| `ALLOWED_ORIGINS` | _(empty)_ | Comma-separated list of origins allowed by CORS. If empty, all origins are allowed. Example: `http://localhost:3000,https://yourdomain.com` |

### Rate Limiting

| Variable | Default | Description |
|---|---|---|
| `API_AUTH_LIMITER_EXPIRES` | `3600` | Window duration in seconds for the auth rate limiter (applied to `GET /api/auth/user/`). Default: 1 hour. |
| `API_AUTH_LIMITER_MAX` | `50` | Max requests per window for the auth rate limiter. |
| `API_DEFAULT_LIMITER_EXPIRES` | `900` | Window duration in seconds for the general API rate limiter. Default: 15 minutes. |
| `API_DEFAULT_LIMITER_MAX` | `10` | Max requests per window for the general API rate limiter. |

### Server

| Variable | Default | Description |
|---|---|---|
| `SERVER_TARGET_PORT` | `5000` | Port the Express server listens on. |
| `TRUST_PROXY` | `0` | Number of proxy hops to trust for IP extraction. Set to `1` when running behind Nginx or a load balancer. Required for accurate rate limiting. |
| `NODE_ENV` | _(unset)_ | Set to `production` in production environments. Enables secure cookies and startup env validation. |
| `PREVENT_CACHE_ON_GET_AUTH_USER` | `1` | Set to `1` to add `Cache-Control: no-cache` headers on `GET /api/auth/user/`. Recommended on Netlify to prevent CDN caching. Set to `0` to disable. |

### Development / Testing

| Variable | Default | Description |
|---|---|---|
| `TEST_MODE` | `0` | Set to `1` to enable debug output (e.g. exposes raw error messages in API responses, logs `req.ip` in health endpoint). Disable in production. |

---

## Client Variables

These are read by Vite at build time and embedded into the frontend bundle.

| Variable | Default | Description |
|---|---|---|
| `PORT` | `3000` | Port the Vite dev server runs on. |

---

## Example `.env`

```env
# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5000

# Auth
AUTH_KEY=your_auth_cookie_name
SECRET_KEY=your_strong_random_secret
JWT_EXPIRES=14400
CSRF_TOKEN=X-Csrf-Token
CSRF_TOKEN_EXPIRES=180

# Rate Limiting
API_AUTH_LIMITER_EXPIRES=3600
API_AUTH_LIMITER_MAX=50
API_DEFAULT_LIMITER_EXPIRES=900
API_DEFAULT_LIMITER_MAX=10

# Server
NODE_ENV=development
SERVER_TARGET_PORT=5000
TRUST_PROXY=0
PREVENT_CACHE_ON_GET_AUTH_USER=1

# Dev
PORT=3000
TEST_MODE=1
```

---

## Production Checklist

- `SECRET_KEY` — set to a strong random value (e.g. `openssl rand -hex 32`)
- `AUTH_KEY` — set to a custom cookie name
- `NODE_ENV=production` — enables secure cookies and startup env validation
- `TEST_MODE=0` — disables raw error messages in API responses
- `ALLOWED_ORIGINS` — restrict to your production domain(s)
- `TRUST_PROXY=1` — if running behind a reverse proxy
- `PREVENT_CACHE_ON_GET_AUTH_USER=1` — if deploying to Netlify
