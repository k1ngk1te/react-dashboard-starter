import React from 'react';

import { DEFAULT_PAGINATION_SIZE } from '../../config/app';
import type { ReactPaginationState } from '../../types';
import { dates, getDate } from '../../utils';

import useDebouncedSearchParamInput from './use-debounced-search-param-input';
import useSearchParams from '../use-search-params';

export default function usePageFilters(options?: {
  prefix?: string;
  // Note: Please provide this optional prefix to mostly avoid re-renders and differentiate search params
  // when this hook is used multiple times in the same component or a parent component
}) {
  const debouncedSearchInput = useDebouncedSearchParamInput({
    prefix: options?.prefix,
  });

  const searchParams = useSearchParams({ prefix: options?.prefix });

  const keys = React.useMemo(() => {
    const prefix = options?.prefix ? options.prefix + '_' : '';

    return {
      status: prefix + 'status',
      page: prefix + 'page',
      limit: prefix + 'limit',
      from: prefix + 'from',
      to: prefix + 'to',
      search: prefix + 'search',
    };
  }, [options?.prefix]);

  const pageFilters = React.useMemo(() => {
    let page = +(searchParams.get(keys.page) || '1');
    if (!page || isNaN(+page) || page < 1) page = 1;

    let pageSize = +(searchParams.get(keys.limit) || DEFAULT_PAGINATION_SIZE);
    if (!pageSize || isNaN(+pageSize) || pageSize < 1) pageSize = DEFAULT_PAGINATION_SIZE;

    const fromParam = searchParams.get(keys.from);
    const toParam = searchParams.get(keys.to);
    const from = fromParam ? dates.getDate<'dayjs'>(fromParam, 'dayjs') : undefined;
    const to = toParam ? dates.getDate<'dayjs'>(toParam, 'dayjs') : undefined;
    const status = searchParams.get(keys.status);

    const pagination = {
      pageIndex: page - 1,
      pageSize,
    };

    return {
      pagination,
      from,
      to,
      status,
    };
  }, [searchParams, keys]);

  const filters = React.useMemo(() => {
    return {
      limit: pageFilters.pagination.pageSize,
      page: pageFilters.pagination.pageIndex + 1,
      search: debouncedSearchInput.debouncedValue,
      from: pageFilters.from ? pageFilters.from.format('YYYY-MM-DD') : undefined,
      to: pageFilters.to ? pageFilters.to.format('YYYY-MM-DD') : undefined,
      status: pageFilters.status,
    };
  }, [pageFilters, debouncedSearchInput]);

  const changeFilters = React.useCallback(
    (name: string, value: string | Date | Record<string, Date> | null) => {
      if (value) {
        if (value instanceof Date) {
          searchParams.set(name, getDate<string>(value, true));
        } else if (typeof value !== 'string') {
          const params = Object.entries(value).reduce((acc: Record<string, string>, item) => {
            return {
              ...acc,
              [item[0]]: getDate<string>(item[1], true),
            };
          }, {});
          searchParams.update(params);
        } else searchParams.set(name, value);
      } else {
        if (name.endsWith('dateRange')) {
          searchParams.delete(['from', 'to']);
        } else {
          searchParams.remove(name);
        }
      }
    },
    [searchParams]
  );

  const changePagination: ReactPaginationState = React.useCallback(
    (onChange) => {
      if (typeof onChange === 'function') {
        const values = onChange(pageFilters.pagination);
        searchParams.update({
          page: values.pageIndex + 1,
          limit: values.pageSize,
        });
      } else {
        searchParams.update({
          page: onChange.pageIndex + 1,
          limit: onChange.pageSize,
        });
      }
    },
    [pageFilters, searchParams]
  );

  return {
    keys,
    search: debouncedSearchInput.debouncedValue,
    searchInput: {
      onChange: debouncedSearchInput.onChange,
      value: debouncedSearchInput.value,
    },
    searchParams,
    filters,
    changeFilters,
    changePagination,
    ...pageFilters,
  };
}
