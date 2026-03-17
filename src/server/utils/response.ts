import type { AppResponseType } from '~/types';

type MessageResponseType = Omit<AppResponseType, 'status'> & { status: 'success' };
type DataResponseType<T> = Omit<AppResponseType, 'status' | 'data'> & { status: 'success'; data: T };

export function getResponseHeader(headers: unknown, name: string): string | undefined {
  if (!headers || typeof headers !== 'object') return undefined;

  const normalizedName = name.toLowerCase();
  const headerBag = headers as Record<string, unknown> & {
    get?: (headerName: string) => unknown;
  };

  if (typeof headerBag.get === 'function') {
    const value = headerBag.get(name) ?? headerBag.get(normalizedName);
    return typeof value === 'string' ? value : value?.toString();
  }

  const value = headerBag[name] ?? headerBag[normalizedName];

  if (Array.isArray(value)) return value[0]?.toString();

  return typeof value === 'string' ? value : value?.toString();
}

export function NewSuccessResponse(message: string): MessageResponseType {
  return {
    status: 'success' as const,
    message,
  };
}

export function NewSuccessDataResponse<T = unknown>(data: T, message: string = 'Success'): DataResponseType<T> {
  return {
    status: 'success' as const,
    message,
    data,
  };
}
