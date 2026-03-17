import cookie from 'cookie';
import cors from 'cors';
import crypto from 'crypto';
import dotenv from 'dotenv';
import express, { NextFunction, Request, Response } from 'express';
import { rateLimit } from 'express-rate-limit';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

// ****** ENVS Start ********

dotenv.config();

const ENV_ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS;
export const ALLOWED_ORIGINS =
  !ENV_ALLOWED_ORIGINS || ENV_ALLOWED_ORIGINS === '*' ? [] : ENV_ALLOWED_ORIGINS.split(',');
export const API_AUTH_LIMITER_EXPIRES =
  process.env.API_AUTH_LIMITER_EXPIRES && !isNaN(+process.env.API_AUTH_LIMITER_EXPIRES)
    ? +process.env.API_AUTH_LIMITER_EXPIRES
    : 3600;
export const API_AUTH_LIMITER_MAX =
  process.env.API_AUTH_LIMITER_MAX && !isNaN(+process.env.API_AUTH_LIMITER_MAX)
    ? +process.env.API_AUTH_LIMITER_MAX
    : 50;
export const API_DEFAULT_LIMITER_EXPIRES =
  process.env.API_DEFAULT_LIMITER_EXPIRES && !isNaN(+process.env.API_DEFAULT_LIMITER_EXPIRES)
    ? +process.env.API_DEFAULT_LIMITER_EXPIRES
    : 900;
export const API_DEFAULT_LIMITER_MAX =
  process.env.API_DEFAULT_LIMITER_MAX && !isNaN(+process.env.API_DEFAULT_LIMITER_MAX)
    ? +process.env.API_DEFAULT_LIMITER_MAX
    : 10;
export const AUTH_KEY = process.env.AUTH_KEY || 'nrGgtPY';
export const CSRF_TOKEN = process.env.CSRF_TOKEN || 'X-Csrf-Token';
export const CSRF_TOKEN_EXPIRES =
  process.env.CSRF_TOKEN_EXPIRES && !isNaN(+process.env.CSRF_TOKEN_EXPIRES)
    ? +process.env.CSRF_TOKEN_EXPIRES
    : undefined;
export const NODE_ENV = process.env.NODE_ENV;
export const SECRET_KEY = process.env.SECRET_KEY || 'mrhqpzfUCPLie3537e7ebb5f58e';
export const JWT_EXPIRES =
  process.env.JWT_EXPIRES && !isNaN(+process.env.JWT_EXPIRES) ? +process.env.JWT_EXPIRES : 14400;
export const PREVENT_CACHE_ON_GET_AUTH_USER = process.env.PREVENT_CACHE_ON_GET_AUTH_USER !== '0';
export const TEST_MODE = process.env.TEST_MODE === '1';

// ****** ENVS Stop *********

// ****** Env Validation Start ********

export function validateEnv(): void {
  const required = ['SECRET_KEY', 'AUTH_KEY'] as const;
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}

// ****** Env Validation Stop *********

type JwtPayloadDecoded = {
  token: string;
  user: Record<string, unknown>;
  iat: number;
  exp: number;
};

const ERROR_CODES = {
  ERROR_CSRF_100: {
    code: 'ERROR_CSRF_100',
    message: 'Unable to validate CSRF TOKEN. Please refresh this page and try again.',
  },
};

const baseRouter = express.Router();

// ****** CORS Start ********

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin || ALLOWED_ORIGINS.length === 0) return callback(null, true);
    // Allow if the origin is in our allowed list
    if (ALLOWED_ORIGINS.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Specify allowed methods
  credentials: true, // This is crucial for sending cookies and custom headers
};

baseRouter.use(cors(corsOptions));

// ****** CORS Stop  ********

// ****** Rate Limiter Start *******

function keyGenerator(req: Request, _res: Response): string {
  if (!req.ip) {
    if (TEST_MODE) console.error('Warning: request.ip is missing!');
    return req.socket.remoteAddress ?? '';
  }

  return req.ip.replace(/:\d+[^:]*$/, '');
}

// Limiter for sensitive authentication routes (default window: 1 hour, max: 50 requests)
const authLimiter = rateLimit({
  windowMs: API_AUTH_LIMITER_EXPIRES * 1000,
  limit: API_AUTH_LIMITER_MAX,
  message: {
    status: 'error',
    message: 'Too many login attempts from this IP, please try again after 15 minutes',
  },
  statusCode: 429,
  keyGenerator,
});

// Limiter for general API data fetching (default window: 15 minutes, max: 10 requests)
const apiLimiter = rateLimit({
  windowMs: API_DEFAULT_LIMITER_EXPIRES * 1000,
  limit: API_DEFAULT_LIMITER_MAX,
  message: {
    status: 'error',
    message: 'You have exceeded the API request limit. Please try again later.',
  },
  statusCode: 429,
  keyGenerator,
});

// ******** Rate Limiter Stop *********

// API route for health
baseRouter.get('/api/health/', apiLimiter, healthController);

// API route for saving the token
baseRouter.post('/api/auth/login/', apiLimiter, verifyCSRFTokenMiddleware, loginController);

// API route for removing the token
baseRouter.post('/api/auth/logout/', apiLimiter, verifyCSRFTokenMiddleware, logoutController);

// API route for retrieving the token
baseRouter.get('/api/auth/user/', authLimiter, authUserController);

// ********** Validators Start ************

// Schema for the login credentials coming from your React frontend
export const loginRequestSchema = z.object({
  credentials: z.object(
    {
      token: z.string({ message: 'Token is required' }),
      user: z.record(z.string(), z.unknown(), { message: 'User object is required.' }),
    },
    { message: 'Credentials are required.' },
  ),
});

// ********** Validators Stop *************

// ********** Controllers Start ***********

// Controller to check if the backend server is live
export async function healthController(_req: Request, res: Response): Promise<void> {
  try {
    const cookies = cookie.parse(_req.headers.cookie || '');

    // Add CSRF_TOKEN IF NOT PRESENT
    const csrfToken = cookies[CSRF_TOKEN];
    if (!csrfToken) generateCsrfTokenInResponse(res);
    else res.setHeader(CSRF_TOKEN, csrfToken);

    res.status(200).json({
      status: 'success',
      message: 'Health is Good',
      data: { ip: TEST_MODE ? _req.ip : undefined },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: TEST_MODE && error instanceof Error ? error.message : 'Something went wrong on the client server.',
    });
  }
}

// Login Controller
export async function loginController(req: Request, res: Response): Promise<void> {
  try {
    const { credentials } = loginRequestSchema.parse(req.body);

    const token = jwt.sign(credentials, SECRET_KEY, {
      expiresIn: JWT_EXPIRES,
    });

    // Add CSRF_TOKEN
    generateCsrfTokenInResponse(res, token);

    res.status(200).json({
      status: 'success',
      message: 'Logged in successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        status: 'error',
        message: error.issues[0].message,
      });
      return;
    }
    res.status(500).json({
      status: 'error',
      message: TEST_MODE && error instanceof Error ? error.message : 'Something went wrong on the client server.',
    });
  }
}

// Logout Controller
export async function logoutController(_req: Request, res: Response): Promise<void> {
  try {
    // Add CSRF_TOKEN
    generateCsrfTokenInResponse(res, null);

    res.status(200).json({ status: 'success', message: 'Token removed successfully' });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Something went wrong on the client server.',
    });
  }
}

// Auth User Controller
export async function authUserController(req: Request, res: Response): Promise<void> {
  try {
    if (PREVENT_CACHE_ON_GET_AUTH_USER) {
      // Prevent netlify from caching this endpoint
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
    }

    const cookies = cookie.parse(req.headers.cookie || '');
    const token = cookies[AUTH_KEY];

    // Add CSRF_TOKEN IF NOT PRESENT
    const csrfToken = cookies[CSRF_TOKEN];
    if (!csrfToken) generateCsrfTokenInResponse(res);
    else res.setHeader(CSRF_TOKEN, csrfToken);

    if (token) {
      const decoded = jwt.verify(token, SECRET_KEY) as JwtPayloadDecoded;
      if (!decoded || !decoded.token) {
        res.status(401).json({
          status: 'error',
          message: 'Authentication credentials are invalid',
        });
      } else {
        const { iat: _iat, exp: _exp, ...data } = decoded;

        res.status(200).json({
          status: 'success',
          message: 'Authentication credentials verified',
          data: { ...data, csrfToken },
        });
      }
    } else {
      res.status(401).json({
        status: 'error',
        message: 'Authentication credentials were not found',
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Something went wrong on the client server.',
    });
  }
}

// ********** Controllers Stop ************

// ********** Middlewares Start ************

// verify CSRF_TOKEN middleware
export function verifyCSRFTokenMiddleware(req: Request, res: Response, next: NextFunction): void {
  try {
    // Get the token from the cookies
    const cookies = cookie.parse(req.headers.cookie || '');
    const cookieCsrfToken = cookies[CSRF_TOKEN];

    // Get the token from the request headers
    const headerCsrfToken = req.header(CSRF_TOKEN);

    if (!headerCsrfToken || !cookieCsrfToken) {
      res.status(403).json({
        errorCode: ERROR_CODES.ERROR_CSRF_100.code,
        status: 'error',
        message: ERROR_CODES.ERROR_CSRF_100.message + ' Token is not present in headers or cookies.',
      });
      return;
    }

    // Check they are both the same
    if (headerCsrfToken !== cookieCsrfToken) {
      res.status(403).json({
        errorCode: ERROR_CODES.ERROR_CSRF_100.code,
        status: 'error',
        message: ERROR_CODES.ERROR_CSRF_100.message + ' CSRF Token is not valid.',
      });
      return;
    }

    // continue
    next();
  } catch (error) {
    res.status(500).json({
      errorCode: ERROR_CODES.ERROR_CSRF_100.code,
      status: 'error',
      message:
        TEST_MODE && error instanceof Error
          ? error.message
          : ERROR_CODES.ERROR_CSRF_100.message + ' Something went wrong on the client server.',
    });
  }
}

// ********** Middlewares Stop *************

// ********** Utils Start ************

// Function to generate a random token
export function generateCsrfToken(): string {
  // Generate 32 random bytes and convert to a hex string
  return crypto.randomBytes(32).toString('hex');
}

// Function to generate a CSRF token and place in the response headers.
// If auth token is passed in then set the auth cookie; if null, clear it.
export function generateCsrfTokenInResponse(res: Response, token?: string | null): void {
  const csrfToken = generateCsrfToken();
  res.setHeader(CSRF_TOKEN, csrfToken);

  const cookies: string[] = [
    cookie.serialize(CSRF_TOKEN, csrfToken, {
      expires: CSRF_TOKEN_EXPIRES ? new Date(Date.now() + CSRF_TOKEN_EXPIRES * 1000) : undefined,
      httpOnly: true,
      path: '/',
      sameSite: 'strict',
      secure: NODE_ENV !== 'development',
    }),
  ];
  if (token) {
    cookies.push(
      cookie.serialize(AUTH_KEY, token, {
        expires: new Date(Date.now() + JWT_EXPIRES * 1000),
        httpOnly: true,
        path: '/',
        sameSite: 'strict',
        secure: NODE_ENV !== 'development',
      }),
    );
  } else if (token === null) {
    cookies.push(
      cookie.serialize(AUTH_KEY, '', {
        expires: new Date(0),
        httpOnly: true,
        path: '/',
        sameSite: 'strict',
        secure: NODE_ENV !== 'development',
      }),
    );
  }

  res.setHeader('Set-Cookie', cookies);
}

// ********** Utils Stop *************

// Export Final
export const router = baseRouter;
