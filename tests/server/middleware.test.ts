import { describe, it, expect } from 'vitest';
import request from 'supertest';
import express from 'express';
import { verifyCSRFTokenMiddleware, CSRF_TOKEN } from '../../server/base';

function createMiddlewareApp() {
  const app = express();
  app.use(express.json());
  app.post('/test', verifyCSRFTokenMiddleware, (_req, res) => {
    res.status(200).json({ status: 'success' });
  });
  return app;
}

describe('verifyCSRFTokenMiddleware', () => {
  it('returns 403 when CSRF header is missing', async () => {
    const res = await request(createMiddlewareApp())
      .post('/test')
      .set('Cookie', `${CSRF_TOKEN}=abc123`);

    expect(res.status).toBe(403);
    expect(res.body.errorCode).toBe('ERROR_CSRF_100');
  });

  it('returns 403 when CSRF cookie is missing', async () => {
    const res = await request(createMiddlewareApp())
      .post('/test')
      .set(CSRF_TOKEN, 'abc123');

    expect(res.status).toBe(403);
    expect(res.body.errorCode).toBe('ERROR_CSRF_100');
  });

  it('returns 403 when CSRF header and cookie do not match', async () => {
    const res = await request(createMiddlewareApp())
      .post('/test')
      .set('Cookie', `${CSRF_TOKEN}=token-a`)
      .set(CSRF_TOKEN, 'token-b');

    expect(res.status).toBe(403);
    expect(res.body.errorCode).toBe('ERROR_CSRF_100');
  });

  it('calls next when CSRF header and cookie match', async () => {
    const res = await request(createMiddlewareApp())
      .post('/test')
      .set('Cookie', `${CSRF_TOKEN}=valid-token`)
      .set(CSRF_TOKEN, 'valid-token');

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('success');
  });
});
