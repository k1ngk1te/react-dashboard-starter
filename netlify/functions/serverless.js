import express from 'express';
import ServerlessHttp from 'serverless-http';
import { router } from '../../server/base.js';

const serverlessApp = express();

// Middleware
serverlessApp.use(express.json());

serverlessApp.use(router);

const handler = ServerlessHttp(serverlessApp);

export { handler };
