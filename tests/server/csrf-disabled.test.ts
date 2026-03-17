import { describe, it, expect, beforeEach, vi } from 'vitest';
import request from 'supertest';
import express from 'express';

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function importBase() {
  const mod = await import('../../server/base');
  return mod;
}

function createMiddlewareApp(verifyCSRFTokenMiddleware: (...args: any[]) => void) {
  const app = express();
  app.use(express.json());
  app.post('/test', verifyCSRFTokenMiddleware, (_req, res) => {
    res.status(200).json({ status: 'success' });
  });
  return app;
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('CSRF disabled (DISABLE_CSRF=1)', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubEnv('DISABLE_CSRF', '1');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('verifyCSRFTokenMiddleware passes through without any CSRF header or cookie', async () => {
    const { verifyCSRFTokenMiddleware, CSRF_TOKEN } = await importBase();
    const res = await request(createMiddlewareApp(verifyCSRFTokenMiddleware))
      .post('/test');

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('success');
  });

  it('verifyCSRFTokenMiddleware passes through even when header and cookie mismatch', async () => {
    const { verifyCSRFTokenMiddleware, CSRF_TOKEN } = await importBase();
    const res = await request(createMiddlewareApp(verifyCSRFTokenMiddleware))
      .post('/test')
      .set('Cookie', `${CSRF_TOKEN}=token-a`)
      .set(CSRF_TOKEN, 'token-b');

    expect(res.status).toBe(200);
  });

  it('healthController does not set CSRF token in response headers', async () => {
    const { router } = await importBase();
    const app = express();
    app.use(router);

    const res = await request(app).get('/api/health/');
    expect(res.status).toBe(200);
    expect(res.headers['x-csrf-token']).toBeUndefined();
  });

  it('validateEnv throws when NODE_ENV is production', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('SECRET_KEY', 'some-secret');
    vi.stubEnv('AUTH_KEY', 'some-auth-key');
    const { validateEnv } = await importBase();
    expect(() => validateEnv()).toThrow('DISABLE_CSRF cannot be enabled in production');
  });
});

describe('CSRF enabled (DISABLE_CSRF unset)', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubEnv('DISABLE_CSRF', '');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('verifyCSRFTokenMiddleware still rejects mismatched tokens', async () => {
    const { verifyCSRFTokenMiddleware, CSRF_TOKEN } = await importBase();
    const res = await request(createMiddlewareApp(verifyCSRFTokenMiddleware))
      .post('/test')
      .set('Cookie', `${CSRF_TOKEN}=token-a`)
      .set(CSRF_TOKEN, 'token-b');

    expect(res.status).toBe(403);
    expect(res.body.errorCode).toBe('ERROR_CSRF_100');
  });

  it('healthController sets CSRF token in response headers', async () => {
    const { router } = await importBase();
    const app = express();
    app.use(router);

    const res = await request(app).get('/api/health/');
    expect(res.status).toBe(200);
    expect(res.headers['x-csrf-token']).toBeDefined();
  });

  it('validateEnv does not throw in production when CSRF is enabled', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('SECRET_KEY', 'some-secret');
    vi.stubEnv('AUTH_KEY', 'some-auth-key');
    const { validateEnv } = await importBase();
    expect(() => validateEnv()).not.toThrow();
  });
});
