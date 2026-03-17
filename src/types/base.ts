import type { FormRule as AntdFormRule } from 'antd';

export type AppResponseType<DataType = undefined> = DataType extends void
  ? {
      message: string;
      errorCode?: string;
      status: 'error' | 'success';
      data?: undefined;
    }
  : {
      message: string;
      errorCode?: string;
      status: 'error' | 'success';
      data: DataType;
    };

export type AppResponseErrorType<DataType = undefined> = {
  message: string;
  errorCode?: string;
  status: 'error' | 'success' | number;
  data?: DataType;
};

export type AppPaginatedResponseType<T> = AppResponseType<{
  totalPages: number;
  currentPage: number;
  totalRecords: number; // total records
  pageSize?: number;
  result: T[];
}>;

export type QueryListOptionsType = {
  limit?: number;
  page?: number;
  search?: string;
  from?: string;
  to?: string;
  status?: string;
};

export type MutationOptionsType<T = void, U = void> = {
  onSuccess: T extends void ? (data: Omit<AppResponseType, 'data'>) => void : (data: AppResponseType<T>) => void;
  onError?: U extends void ? (err: AppResponseErrorType) => void : (err: AppResponseErrorType<U>) => void;
};

export type GetValidatorErrorType<T> = {
  [K in keyof T]?: T[K] extends Date | number ? string : T[K] extends object ? GetValidatorErrorType<T[K]> : string;
};

export type PaginationState = {
  pageIndex: number;
  pageSize: number;
};

export type ModalBaseRefType = {
  open: () => void;
  close: () => void;
};

export type FormRule = AntdFormRule;

export type ReactPaginationState = React.Dispatch<React.SetStateAction<PaginationState>>;
