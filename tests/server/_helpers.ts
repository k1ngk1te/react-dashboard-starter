import express from 'express';
import request from 'supertest';
import { router, CSRF_TOKEN } from '../../server/base';

export function createApp() {
  const app = express();
  app.use(express.json());
  app.use(router);
  return app;
}

export async function getCsrfCredentials(app: ReturnType<typeof createApp>) {
  const res = await request(app).get('/api/health/');
  const resCookie = res.headers['set-cookie'];
  const setCookieHeaders = Array.isArray(resCookie) ? resCookie : [resCookie];
  const csrfCookie = setCookieHeaders?.find((c) => c.startsWith(CSRF_TOKEN));
  const csrfValue = csrfCookie?.split(';')[0].split('=')[1] ?? '';
  return { csrfValue, cookieHeader: `${CSRF_TOKEN}=${csrfValue}` };
}
