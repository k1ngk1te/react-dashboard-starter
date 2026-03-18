import express from 'express';
import ServerlessHttp from 'serverless-http';

import { env, router } from '../../server/base.js';

const serverlessApp = express();

// ******************************

// Rate Limiter
serverlessApp.set('trust proxy', env.TRUST_PROXY);

// Middleware
serverlessApp.use(express.json());

serverlessApp.use(router);

const handler = ServerlessHttp(serverlessApp);

export { handler };
