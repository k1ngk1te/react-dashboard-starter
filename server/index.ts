import express from 'express';
import helmet from 'helmet';
import path from 'path';

import { env, router } from './base.js';

// ******************************

const app = express();

// Apply Helmet middleware first for maximum protection
app.use(helmet());

// Rate Limiter
app.set('trust proxy', env.TRUST_PROXY);

// Middleware
app.use(express.json());

// Serve static files from Vite's build output directory
app.use(express.static(path.join(process.cwd(), 'dist')));

app.use(router);

// Handle all other routes by serving the frontend (index.html)
app.get('*', (_req, res) => {
  res.sendFile(path.resolve(process.cwd(), 'dist', 'index.html'));
});

// Set up the server to listen on a port
const PORT = process.env.SERVER_TARGET_PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
