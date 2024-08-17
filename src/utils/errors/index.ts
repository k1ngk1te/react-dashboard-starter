/* eslint-disable no-mixed-spaces-and-tabs */
import { AxiosError } from 'axios';

import AppError from './app-error';
import type { ResponseType } from '../../types';

export { AppError };

// A generic function to handle all errors;
export function handleAllErrors<T = any>(
  error: unknown,
  options?: {
    defaultMessage?: string;
  }
) {
  // Handle Unknown Errors
  const axiosError = handleHttpErrors<T>(error);
  if (axiosError) {
    return {
      status: axiosError.status,
      message: axiosError.message,
      data: axiosError.data,
    };
  }

  // Handle App Errors
  const appError = handleAppErrors<T>(error);
  if (appError) {
    return {
      status: appError.status,
      message: appError.message,
      data: appError.data,
    };
  }

  // Could not handle any error
  return {
    status: 500,
    message: (error as any)?.message
      ? String((error as any).message)
      : options?.defaultMessage || 'An error occurred. Please try again.',
  };
}

export function handleHttpErrors<T = any>(
  err: unknown
):
  | {
      status: number;
      data?: T;
      message: string;
    }
  | undefined {
  const error = err as AxiosError;
  if (error && error.name === 'AxiosError' && error.response?.data) {
    if (isResponseWithData<T>(error.response.data)) {
      return {
        status: error.response.status,
        data: error.response.data.data,
        message: error.response.data.message,
      };
    }
    if (isResponseWithMessage(error.response.data)) {
      return {
        status: error.response.status,
        message: error.response.data.message,
      };
    }
  }
  return undefined;
}

function handleAppErrors<T = any>(
  error: unknown
):
  | {
      status: number;
      data?: T;
      message: string;
    }
  | undefined {
  if (error instanceof AppError) {
    return {
      status: error.status,
      message: error.message,
      data: error.data as T,
    };
  }
  return undefined;
}

export function isResponseWithMessage(response: unknown): response is ResponseType {
  return response !== null && response !== undefined && (response as any)?.message !== undefined;
}

export function isResponseWithData<DataType = unknown>(
  response: unknown
): response is ResponseType<DataType> {
  return response !== null && response !== undefined && (response as any)?.data !== undefined;
}
