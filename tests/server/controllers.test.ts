import { describe, it, expect } from 'vitest';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import { SECRET_KEY, CSRF_TOKEN, AUTH_KEY } from '../../server/base';
import { createApp, getCsrfCredentials } from './_helpers';

// ─── Health ──────────────────────────────────────────────────────────────────

describe('GET /api/health/', () => {
  it('returns 200 with success status', async () => {
    const res = await request(createApp()).get('/api/health/');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('success');
    expect(res.body.message).toBe('Health is Good');
  });

  it('sets a CSRF token cookie when none is present', async () => {
    const res = await request(createApp()).get('/api/health/');
    const cookies = res.headers['set-cookie'] as string[];
    expect(cookies?.some((c) => c.startsWith(CSRF_TOKEN))).toBe(true);
    expect(res.headers[CSRF_TOKEN.toLowerCase()]).toBeDefined();
  });

  it('returns the existing CSRF token when cookie is already present', async () => {
    const app = createApp();
    const { csrfValue, cookieHeader } = await getCsrfCredentials(app);
    const res = await request(app).get('/api/health/').set('Cookie', cookieHeader);
    expect(res.headers[CSRF_TOKEN.toLowerCase()]).toBe(csrfValue);
  });
});

// ─── Login ────────────────────────────────────────────────────────────────────

describe('POST /api/auth/login/', () => {
  it('returns 200 and sets auth cookie with valid credentials and CSRF', async () => {
    const app = createApp();
    const { csrfValue, cookieHeader } = await getCsrfCredentials(app);

    const res = await request(app)
      .post('/api/auth/login/')
      .set('Cookie', cookieHeader)
      .set(CSRF_TOKEN, csrfValue)
      .send({ credentials: { token: 'test-token', user: { id: 1 } } });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('success');
    const cookies = res.headers['set-cookie'] as string[];
    expect(cookies?.some((c) => c.startsWith(AUTH_KEY))).toBe(true);
  });

  it('returns 400 when token is missing from credentials', async () => {
    const app = createApp();
    const { csrfValue, cookieHeader } = await getCsrfCredentials(app);

    const res = await request(app)
      .post('/api/auth/login/')
      .set('Cookie', cookieHeader)
      .set(CSRF_TOKEN, csrfValue)
      .send({ credentials: { user: { id: 1 } } });

    expect(res.status).toBe(400);
    expect(res.body.status).toBe('error');
  });

  it('returns 400 when credentials object is missing entirely', async () => {
    const app = createApp();
    const { csrfValue, cookieHeader } = await getCsrfCredentials(app);

    const res = await request(app)
      .post('/api/auth/login/')
      .set('Cookie', cookieHeader)
      .set(CSRF_TOKEN, csrfValue)
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.status).toBe('error');
  });

  it('returns 403 when CSRF token is missing', async () => {
    const res = await request(createApp())
      .post('/api/auth/login/')
      .send({ credentials: { token: 'test-token', user: { id: 1 } } });

    expect(res.status).toBe(403);
    expect(res.body.errorCode).toBe('ERROR_CSRF_100');
  });
});

// ─── Auth User ────────────────────────────────────────────────────────────────

describe('GET /api/auth/user/', () => {
  it('returns 401 when no auth cookie is present', async () => {
    const res = await request(createApp()).get('/api/auth/user/');
    expect(res.status).toBe(401);
    expect(res.body.status).toBe('error');
  });

  it('returns 200 with user data when a valid JWT cookie is present', async () => {
    const payload = { token: 'test-token', user: { id: 1, email: 'test@test.com' } };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: 3600 });

    const res = await request(createApp())
      .get('/api/auth/user/')
      .set('Cookie', `${AUTH_KEY}=${token}`);

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('success');
    expect(res.body.data.token).toBe('test-token');
  });

  it('returns 500 when the JWT is invalid', async () => {
    const res = await request(createApp())
      .get('/api/auth/user/')
      .set('Cookie', `${AUTH_KEY}=invalid.jwt.token`);

    expect(res.status).toBe(500);
  });
});

// ─── Logout ───────────────────────────────────────────────────────────────────

describe('POST /api/auth/logout/', () => {
  it('returns 200 and clears the auth cookie', async () => {
    const app = createApp();
    const { csrfValue, cookieHeader } = await getCsrfCredentials(app);

    const res = await request(app)
      .post('/api/auth/logout/')
      .set('Cookie', cookieHeader)
      .set(CSRF_TOKEN, csrfValue);

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('success');
    const cookies = res.headers['set-cookie'] as string[];
    const authCookie = cookies?.find((c) => c.startsWith(AUTH_KEY));
    expect(authCookie).toContain('Expires=Thu, 01 Jan 1970');
  });

  it('returns 403 when CSRF token is missing', async () => {
    const res = await request(createApp()).post('/api/auth/logout/');
    expect(res.status).toBe(403);
    expect(res.body.errorCode).toBe('ERROR_CSRF_100');
  });
});
