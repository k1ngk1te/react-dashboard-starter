import cookie from 'cookie';
import dotenv from 'dotenv';
import express from 'express';
import jwt from 'jsonwebtoken';

dotenv.config();

const AUTH_KEY = process.env.AUTH_KEY || 'nrGgtPY';
const SECRET_KEY = process.env.SECRET_KEY || 'mrhqpzfUCPLie3537e7ebb5f58e';
const JWT_EXPIRES = process.env.JWT_EXPIRES && isNaN(+process.env.JWT_EXPIRES) ? +process.env.JWT_EXPIRES : 14400;
const TEST_MODE = +process.env.TEST_MODE === 1;

const baseRouter = express.Router();

// API route for health
baseRouter.get('/api/health/', (req, res) => {
  try {
    res.status(200).json({
      status: 'success',
      message: 'Health is Good',
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: TEST_MODE && error.message ? error.message : 'Something went wrong on the client server.',
    });
  }
});

// API route for saving the token
baseRouter.post('/api/auth/login/', (req, res) => {
  try {
    const { credentials } = req.body;

    if (!credentials) {
      throw new Error('Credentials are required.');
    }

    const token = jwt.sign(credentials, SECRET_KEY, {
      expiresIn: JWT_EXPIRES,
    });

    res.setHeader('Set-Cookie', [
      cookie.serialize(AUTH_KEY, token, {
        expires: new Date(Date.now() + JWT_EXPIRES * 1000),
        httpOnly: true,
        path: '/',
        sameSite: 'strict',
        secure: process.env.NODE_ENV !== 'development',
      }),
    ]);

    res.status(200).json({
      status: 'success',
      message: 'Logged in successfully',
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: TEST_MODE && error.message ? error.message : 'Something went wrong on the client server.',
    });
  }
});

// API route for removing the token
baseRouter.post('/api/auth/logout/', (_, res) => {
  try {
    res.setHeader('Set-Cookie', [
      cookie.serialize(AUTH_KEY, '', {
        expires: new Date(0),
        httpOnly: true,
        path: '/',
        sameSite: 'strict',
        secure: process.env.NODE_ENV !== 'development',
      }),
    ]);

    res.status(200).json({ status: 'success', message: 'Token removed successfully' });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message || 'Something went wrong on the client server.',
    });
  }
});

// API route for retrieving the token
baseRouter.get('/api/auth/user/', (req, res) => {
  try {
    const cookies = cookie.parse(req.headers.cookie || '');
    const token = cookies[AUTH_KEY];
    if (token) {
      const decoded = jwt.verify(token, SECRET_KEY);
      if (!decoded || !decoded.token) {
        res.status(401).json({
          success: 'error',
          message: 'Authentication credentials are invalid',
        });
      } else {
        const { iat, exp, ...data } = decoded;
        res.status(200).json({
          status: 'success',
          message: 'Authentication credentials verified',
          data,
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
      message: error.message || 'Something went wrong on the client server.',
    });
  }
});

export const router = baseRouter;
