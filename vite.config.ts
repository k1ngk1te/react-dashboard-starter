import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  base: '/',
  build: {
    outDir: '../dist',
  },
  envDir: '../',
  plugins: [react()],
  publicDir: '../public',
  resolve: {
    alias: {
      '~': path.resolve(__dirname, 'src'),
    },
  },
  root: './src',
  server: {
		port: 3000,
		proxy: {
			// Forward all requests starting with /api to the Express backend on port 3000
			'/api': {
				target: 'http://localhost:5000', // Replace with your Express server URL
				changeOrigin: true,
				secure: mode !== 'development', // Set to `true` if your backend uses HTTPS
			},
		},
	},
}))
