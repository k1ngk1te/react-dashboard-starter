# Deployment

This project supports two deployment targets: **Netlify** (serverless) and **self-hosted** (Express server). Both share the same frontend build output from Vite.

---

## Build

Before deploying to either target, run the full build:

```bash
npm run build
```

This runs three steps in order:

1. `tsc -b` — type-checks all TypeScript (frontend + server)
2. `vite build --emptyOutDir` — compiles the React frontend into `dist/`
3. `tsc -p tsconfig.server.build.json` — compiles the Express server TypeScript into `dist/server/` and `dist/netlify/`

The order matters — Vite's `--emptyOutDir` clears `dist/` first, so the server compile must run after.

**Output structure after build:**

```
dist/
├── index.html              # Frontend entry point
├── assets/                 # Bundled JS, CSS, images
├── server/
│   ├── base.js             # Compiled Express routes + controllers
│   └── index.js            # Compiled server entry point
└── netlify/
    └── functions/
        └── serverless.js   # Compiled Netlify function
```

---

## Netlify

### How it works

On Netlify, the Express server runs as a serverless function. `netlify/functions/serverless.ts` wraps the Express router with `serverless-http` and exports it as a Netlify function handler.

All `/api/*` requests are redirected to the serverless function via the rule in `netlify.toml`:

```toml
[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/serverless/:splat"
  status = 200
  force = true
```

All other routes fall through to `index.html` for client-side routing.

### Deploy steps

1. Push your code to GitHub (or connect your repo to Netlify)
2. In Netlify dashboard: set **Build command** to `npm run build` and **Publish directory** to `dist`
3. Set all required environment variables in **Site settings > Environment variables** (see [Environment Variables](environment-variables.md))
4. Deploy

Netlify reads `netlify.toml` automatically — no additional configuration needed.

### Local Netlify testing

```bash
npm run dev:netlify
```

This builds the project and runs it locally using Netlify Dev, which emulates the serverless function environment on `http://localhost:8888`.

### Important: Prevent caching on auth endpoint

Netlify CDN can cache GET responses. Set `PREVENT_CACHE_ON_GET_AUTH_USER=1` to ensure `/api/auth/user/` always returns a fresh response and is never served from cache.

---

## Self-Hosted (Express)

### How it works

`server/index.ts` starts an Express server that:
1. Serves the compiled React frontend from `dist/` as static files
2. Handles all `/api/*` routes via the Express router
3. Falls back to `dist/index.html` for all other routes (SPA support)

### Deploy steps

1. Run the build: `npm run build`
2. Copy the following to your server:
   - `dist/` (entire directory)
   - `package.json`
   - `package-lock.json`
   - `.env` (with production values)
3. On the server, install production dependencies:
   ```bash
   npm install --omit=dev
   ```
4. Start the server:
   ```bash
   npm start
   ```

`npm start` runs `cross-env NODE_ENV=production node dist/server/index.js`.

### Reverse proxy (recommended)

In production, put Nginx or another reverse proxy in front of the Node process:

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
    }
}
```

When using a reverse proxy, set `TRUST_PROXY=1` in your `.env` so Express correctly reads the client IP from `X-Forwarded-For` headers (required for accurate rate limiting).

### Process management

Use a process manager like PM2 to keep the server running:

```bash
npm install -g pm2
pm2 start dist/server/index.js --name "dashboard"
pm2 save
pm2 startup
```

---

## Environment Variables

Both deployment targets require environment variables to be set. See [Environment Variables](environment-variables.md) for the full list.

At a minimum, set these in production:

| Variable | Description |
|---|---|
| `SECRET_KEY` | Secret used to sign JWTs — must be a strong random value |
| `AUTH_KEY` | Name of the auth cookie |
| `ALLOWED_ORIGINS` | Comma-separated list of allowed origins for CORS |
| `NODE_ENV` | Set to `production` |

The server will throw an error at startup if `SECRET_KEY` or `AUTH_KEY` are missing when `NODE_ENV=production`.
