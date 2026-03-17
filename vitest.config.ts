import path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '~': path.resolve(__dirname, 'src'),
    },
  },
  test: {
    env: {
      API_DEFAULT_LIMITER_MAX: '10000',
      API_AUTH_LIMITER_MAX: '10000',
    },
    environmentMatchGlobs: [
      ['tests/server/**', 'node'],
      ['tests/src/**', 'happy-dom'],
    ],
    globals: true,
    coverage: {
      provider: 'v8',
      include: ['server/**', 'src/**'],
      exclude: ['src/styles/**', 'src/utils/components/**'],
    },
  },
});
