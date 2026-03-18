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

const validateEnvSchema = z.object({
  ALLOWED_ORIGINS: z
    .string()
    .optional()
    .transform((value) => {
      if (!value || value === '' || value.trim() === '*') return [];
      return value.split(',');
    }),
  API_AUTH_LIMITER_EXPIRES: z.coerce.number().optional().default(3600), // seconds
  API_AUTH_LIMITER_MAX: z.coerce.number().optional().default(50), // 50 request count
  API_DEFAULT_LIMITER_EXPIRES: z.coerce.number().optional().default(900), // seconds
  API_DEFAULT_LIMITER_MAX: z.coerce.number().optional().default(10), // 10 request count
  AUTH_KEY: z.string(),
  CSRF_TOKEN: z.string().optional().default('X-Csrf-Token'),
  CSRF_TOKEN_EXPIRES: z.coerce.number().optional(), // seconds, if undefined then it's session
  DISABLE_CSRF: z.coerce.number().optional().default(0).transform(Boolean),
  JWT_EXPIRES: z.coerce.number().optional().default(14400), // seconds
  NODE_ENV: z.enum(['production', 'development', 'test']).optional().default('production'),
  PREVENT_CACHE_ON_GET_AUTH_USER: z.coerce.number().optional().default(1).transform(Boolean),
  SECRET_KEY: z.string(),
  TEST_MODE: z.coerce.number().optional().default(0).transform(Boolean),
  TRUST_PROXY: z.coerce.number().optional().default(0).transform(Boolean),
});

export const env = validateEnvSchema.parse(process.env);

// ****** ENVS Stop *********

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
    if (!origin || env.ALLOWED_ORIGINS.length === 0) return callback(null, true);
    // Allow if the origin is in our allowed list
    if (env.ALLOWED_ORIGINS.indexOf(origin) === -1) {
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
    if (env.TEST_MODE) console.error('Warning: request.ip is missing!');
    return req.socket.remoteAddress ?? '';
  }

  return req.ip.replace(/:\d+[^:]*$/, '');
}

// Limiter for sensitive authentication routes (default window: 1 hour, max: 50 requests)
const authLimiter = rateLimit({
  windowMs: env.API_AUTH_LIMITER_EXPIRES * 1000,
  limit: env.API_AUTH_LIMITER_MAX,
  message: {
    status: 'error',
    message: 'Too many login attempts from this IP, please try again after 15 minutes',
  },
  statusCode: 429,
  keyGenerator,
});

// Limiter for general API data fetching (default window: 15 minutes, max: 10 requests)
const apiLimiter = rateLimit({
  windowMs: env.API_DEFAULT_LIMITER_EXPIRES * 1000,
  limit: env.API_DEFAULT_LIMITER_MAX,
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

    if (!env.DISABLE_CSRF) {
      const csrfToken = cookies[env.CSRF_TOKEN];
      if (!csrfToken) generateCsrfTokenInResponse(res);
      else res.setHeader(env.CSRF_TOKEN, csrfToken);
    }

    res.status(200).json({
      status: 'success',
      message: 'Health is Good',
      data: { ip: env.TEST_MODE ? _req.ip : undefined },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: env.TEST_MODE && error instanceof Error ? error.message : 'Something went wrong on the client server.',
    });
  }
}

// Login Controller
export async function loginController(req: Request, res: Response): Promise<void> {
  try {
    const { credentials } = loginRequestSchema.parse(req.body);

    const token = jwt.sign(credentials, env.SECRET_KEY, {
      expiresIn: env.JWT_EXPIRES,
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
      message: env.TEST_MODE && error instanceof Error ? error.message : 'Something went wrong on the client server.',
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
    if (env.PREVENT_CACHE_ON_GET_AUTH_USER) {
      // Prevent netlify from caching this endpoint
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
    }

    const cookies = cookie.parse(req.headers.cookie || '');
    const token = cookies[env.AUTH_KEY];

    let csrfToken = '';
    if (!env.DISABLE_CSRF) {
      csrfToken = cookies[env.CSRF_TOKEN] ?? '';
      if (!csrfToken) generateCsrfTokenInResponse(res);
      else res.setHeader(env.CSRF_TOKEN, csrfToken);
    }

    if (token) {
      const decoded = jwt.verify(token, env.SECRET_KEY) as JwtPayloadDecoded;
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
  if (env.DISABLE_CSRF) {
    next();
    return;
  }
  try {
    // Get the token from the cookies
    const cookies = cookie.parse(req.headers.cookie || '');
    const cookieCsrfToken = cookies[env.CSRF_TOKEN];

    // Get the token from the request headers
    const headerCsrfToken = req.header(env.CSRF_TOKEN);

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
        env.TEST_MODE && error instanceof Error
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
  res.setHeader(env.CSRF_TOKEN, csrfToken);

  const cookies: string[] = [
    cookie.serialize(env.CSRF_TOKEN, csrfToken, {
      expires: env.CSRF_TOKEN_EXPIRES ? new Date(Date.now() + env.CSRF_TOKEN_EXPIRES * 1000) : undefined,
      httpOnly: true,
      path: '/',
      sameSite: 'strict',
      secure: env.NODE_ENV !== 'development',
    }),
  ];
  if (token) {
    cookies.push(
      cookie.serialize(env.AUTH_KEY, token, {
        expires: new Date(Date.now() + env.JWT_EXPIRES * 1000),
        httpOnly: true,
        path: '/',
        sameSite: 'strict',
        secure: env.NODE_ENV !== 'development',
      }),
    );
  } else if (token === null) {
    cookies.push(
      cookie.serialize(env.AUTH_KEY, '', {
        expires: new Date(0),
        httpOnly: true,
        path: '/',
        sameSite: 'strict',
        secure: env.NODE_ENV !== 'development',
      }),
    );
  }

  res.setHeader('Set-Cookie', cookies);
}

// ********** Utils Stop *************

// Export Final
export const router = baseRouter;
