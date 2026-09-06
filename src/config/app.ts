export const APP_NAME = 'Kite React Dashboard Starter';

export const COMPANY_NAME = 'KITE';

export const DEFAULT_PAGINATION_SIZE = 100;

export const REFETCH_INTERVAL = 1000 * 60 * 1;

import env from './env';

export const NODE_ENV = env.NODE_ENV;
export const TEST_MODE = env.TEST_MODE;

// Keys
export const CSRF_TOKEN = env.CSRF_TOKEN;
export const DISABLE_CSRF = env.DISABLE_CSRF;
export const USER_DATA_KEY = 'user_data';

// Auto-refresh-on-new-deploy
// Static file written next to index.html on every production build (see
// vite-plugin-build-version.ts). Served automatically by Netlify and the
// Express server in production.
export const BUILD_VERSION_URL = '/build-version.json';
// App-namespaced so it can't collide with anything else on the same origin.
export const BUILD_VERSION_STORAGE_KEY = 'kite-react-dashboard-starter:build-version';
// How often an open tab re-checks for a new build.
export const VERSION_CHECK_INTERVAL = 1000 * 60 * 10; // 10 minutes
// How long the "updating" notice stays visible before the reload fires.
export const RELOAD_NOTICE_DELAY = 2200; // ms
