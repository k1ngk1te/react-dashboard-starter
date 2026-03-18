// Single source of truth for all Vite environment variables.
// All other files should import from here — never read import.meta.env directly.

const env = {
  NODE_ENV: import.meta.env.MODE === 'development' ? 'development' : 'production',
  STATIC_URL: import.meta.env.STATIC_URL || '',
  TEST_MODE: import.meta.env.VITE_TEST_MODE === '1',
  CSRF_TOKEN: import.meta.env.VITE_CSRF_TOKEN || 'X-Csrf-Token',
  DISABLE_CSRF: import.meta.env.VITE_DISABLE_CSRF === '1',
  USE_MOCK: import.meta.env.VITE_USE_MOCK !== '0',
  API_URL: import.meta.env.VITE_API_URL || '',
} as const;

export default env;
