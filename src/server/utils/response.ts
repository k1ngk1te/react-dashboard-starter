import type { ResponseType } from '~/types';

export function NewSuccessResponse(message: string): Omit<ResponseType, 'status'> & { status: 'success' } {
  return {
    status: 'success' as const,
    message,
  };
}

export function NewSuccessDataResponse<T = unknown>(
  data: T,
  message: string = 'Success'
): Omit<ResponseType, 'status' | 'data'> & { status: 'success'; data: T } {
  return {
    status: 'success' as const,
    message,
    data,
  };
}
