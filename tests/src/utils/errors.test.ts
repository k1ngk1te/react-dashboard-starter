import { describe, it, expect } from 'vitest';
import { AxiosError } from 'axios';
import {
  AppError,
  handleAllErrors,
  handleAppErrors,
  handleHttpErrors,
  isResponseWithData,
  isResponseWithMessage,
} from '../../../src/utils/errors';

// ─── isResponseWithMessage ────────────────────────────────────────────────────

describe('isResponseWithMessage', () => {
  it('returns true when response has a message property', () => {
    expect(isResponseWithMessage({ message: 'hello' })).toBe(true);
  });

  it('returns false for null', () => {
    expect(isResponseWithMessage(null)).toBe(false);
  });

  it('returns false for undefined', () => {
    expect(isResponseWithMessage(undefined)).toBe(false);
  });

  it('returns false when message property is absent', () => {
    expect(isResponseWithMessage({ status: 'error' })).toBe(false);
  });
});

// ─── isResponseWithData ───────────────────────────────────────────────────────

describe('isResponseWithData', () => {
  it('returns true when response has a data property', () => {
    expect(isResponseWithData({ data: { id: 1 } })).toBe(true);
  });

  it('returns false for null', () => {
    expect(isResponseWithData(null)).toBe(false);
  });

  it('returns false when data property is absent', () => {
    expect(isResponseWithData({ message: 'ok' })).toBe(false);
  });
});

// ─── handleAppErrors ──────────────────────────────────────────────────────────

describe('handleAppErrors', () => {
  it('returns structured error for AppError', () => {
    const err = new AppError(404, 'Not found');
    const result = handleAppErrors(err);
    expect(result).toEqual({ status: 404, message: 'Not found', data: undefined });
  });

  it('returns undefined for a plain Error', () => {
    expect(handleAppErrors(new Error('oops'))).toBeUndefined();
  });

  it('returns undefined for non-error values', () => {
    expect(handleAppErrors('string error')).toBeUndefined();
    expect(handleAppErrors(null)).toBeUndefined();
  });

  it('uses the default message for a known status code', () => {
    const err = new AppError(401);
    const result = handleAppErrors(err);
    expect(result?.message).toBe('Authentication credentials were not provided.');
  });
});

// ─── handleHttpErrors ─────────────────────────────────────────────────────────

describe('handleHttpErrors', () => {
  it('returns undefined for a plain Error', () => {
    expect(handleHttpErrors(new Error('oops'))).toBeUndefined();
  });

  it('extracts error from an AxiosError with data and message', () => {
    const axiosError = new AxiosError('Request failed');
    axiosError.response = {
      data: { message: 'Unauthorized', data: null },
      status: 401,
      statusText: 'Unauthorized',
      headers: {},
      config: {} as any,
    };
    const result = handleHttpErrors(axiosError);
    expect(result?.status).toBe(401);
    expect(result?.message).toBe('Unauthorized');
  });

  it('extracts error from an AxiosError with only a message', () => {
    const axiosError = new AxiosError('Request failed');
    axiosError.response = {
      data: { message: 'Bad request' },
      status: 400,
      statusText: 'Bad Request',
      headers: {},
      config: {} as any,
    };
    const result = handleHttpErrors(axiosError);
    expect(result?.status).toBe(400);
    expect(result?.message).toBe('Bad request');
  });
});

// ─── handleAllErrors ──────────────────────────────────────────────────────────

describe('handleAllErrors', () => {
  it('returns 500 with a generic message for an unknown error', () => {
    const result = handleAllErrors('something broke');
    expect(result.status).toBe(500);
  });

  it('uses the defaultMessage option when provided and error has no message', () => {
    const result = handleAllErrors({}, { defaultMessage: 'Custom fallback' });
    expect(result.message).toBe('Custom fallback');
  });

  it('AppError takes priority over Axios errors', () => {
    const err = new AppError(403, 'Forbidden');
    const result = handleAllErrors(err);
    expect(result.status).toBe(403);
    expect(result.message).toBe('Forbidden');
  });

  it('extracts message from a plain Error', () => {
    const result = handleAllErrors(new Error('plain error'));
    expect(result.message).toBe('plain error');
  });
});
