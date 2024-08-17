import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  // const env = loadEnv(mode, process.cwd(), '')
  const env = loadEnv(mode, '');

  return {
    base: '/',
    build: {
      outDir: '../dist',
    },
    envDir: '../',
    plugins: [react()],
    publicDir: '../public',
    root: './src',
    server: { port: +(env.PORT || 3000) },
  };
});
