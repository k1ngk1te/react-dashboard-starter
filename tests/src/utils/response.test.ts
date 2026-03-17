import { describe, it, expect } from 'vitest';
import {
  getResponseHeader,
  NewSuccessResponse,
  NewSuccessDataResponse,
} from '../../../src/server/utils/response';

// ─── NewSuccessResponse ───────────────────────────────────────────────────────

describe('NewSuccessResponse', () => {
  it('returns a success response with the given message', () => {
    const result = NewSuccessResponse('Done');
    expect(result).toEqual({ status: 'success', message: 'Done' });
  });

  it('always sets status to success', () => {
    expect(NewSuccessResponse('anything').status).toBe('success');
  });
});

// ─── NewSuccessDataResponse ───────────────────────────────────────────────────

describe('NewSuccessDataResponse', () => {
  it('returns a success response with data and message', () => {
    const result = NewSuccessDataResponse({ id: 1 }, 'Created');
    expect(result).toEqual({ status: 'success', message: 'Created', data: { id: 1 } });
  });

  it('defaults message to "Success" when not provided', () => {
    const result = NewSuccessDataResponse({ id: 1 });
    expect(result.message).toBe('Success');
  });

  it('handles null and primitive data values', () => {
    expect(NewSuccessDataResponse(null).data).toBeNull();
    expect(NewSuccessDataResponse(42).data).toBe(42);
    expect(NewSuccessDataResponse('hello').data).toBe('hello');
  });
});

// ─── getResponseHeader ────────────────────────────────────────────────────────

describe('getResponseHeader', () => {
  it('returns undefined for null or non-object headers', () => {
    expect(getResponseHeader(null, 'X-Token')).toBeUndefined();
    expect(getResponseHeader('string', 'X-Token')).toBeUndefined();
  });

  it('reads a header from a plain object (case-insensitive)', () => {
    expect(getResponseHeader({ 'x-token': 'abc' }, 'X-Token')).toBe('abc');
    expect(getResponseHeader({ 'X-Token': 'abc' }, 'X-Token')).toBe('abc');
  });

  it('reads a header using the .get() method', () => {
    const headers = { get: (name: string) => (name === 'X-Token' ? 'xyz' : null) };
    expect(getResponseHeader(headers, 'X-Token')).toBe('xyz');
  });

  it('returns first value when header is an array', () => {
    expect(getResponseHeader({ 'x-token': ['first', 'second'] }, 'X-Token')).toBe('first');
  });

  it('returns undefined when header is not present', () => {
    expect(getResponseHeader({}, 'X-Token')).toBeUndefined();
  });
});
