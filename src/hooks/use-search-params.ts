import React from 'react';
import { useSearchParams as useNextSearchParams } from 'react-router-dom';

type UseSearchParamsType = {
  get: (key: string) => string | null;
  set: (key: string, value: string, options?: NavigationOptionsType) => void;
  update: (params: Record<string, string | number>, options?: NavigationOptionsType) => void;
  remove: (key: string, options?: NavigationOptionsType) => void;
  delete: (keys: string[], options?: NavigationOptionsType) => void;
};

type NavigationOptionsType = {
  replace?: boolean;
};

export default function useSearchParams(options?: {
  prefix?: string;
  // Note: Please provide this optional prefix to mostly avoid re-renders and differentiate search params
  // when this hook is used multiple times in the same component or a parent component
}): UseSearchParamsType {
  const [searchParams, setSearchParams] = useNextSearchParams();

  const getKey = React.useCallback(
    (key: string) => {
      if (options?.prefix) return options.prefix + '_' + key;
      return key;
    },
    [options?.prefix]
  );

  const getCurrentParams = React.useCallback((currentParams: Iterable<[string, string]>) => {
    const params: Record<string, string> = {};
    for (const [key, value] of currentParams) {
      params[key] = value;
    }
    return params;
  }, []);

  const setParams = React.useCallback(
    (key: string, value: string, options?: NavigationOptionsType) =>
      setSearchParams(
        (currentParams) => ({
          ...getCurrentParams(currentParams.entries()),
          [getKey(key)]: value,
        }),
        options
      ),
    [setSearchParams, getCurrentParams, getKey]
  );

  const setMultipleParams = React.useCallback(
    (params: Record<string, string | number>, options?: NavigationOptionsType) => {
      setSearchParams((currentParams) => {
        const newParams = Object.entries(params).reduce(
          (acc: Record<string, string>, item) => ({
            ...acc,
            [getKey(item[0])]: item[1].toString(),
          }),
          {}
        );
        return { ...getCurrentParams(currentParams.entries()), ...newParams };
      }, options);
    },
    [setSearchParams, getCurrentParams, getKey]
  );

  const removeParam = React.useCallback(
    (name: string, options?: NavigationOptionsType) => {
      setSearchParams((prevParams) => {
        const newParams: Record<string, string> = {};
        prevParams.forEach((value, _key) => {
          const key = getKey(_key);
          if (key !== name) newParams[key] = value;
        });

        return newParams;
      }, options);
    },
    [setSearchParams, getKey]
  );

  const removeParams = React.useCallback(
    (keys: string[], options?: NavigationOptionsType) => {
      setSearchParams((prevParams) => {
        const newParams: Record<string, string> = {};
        prevParams.forEach((value, _key) => {
          const key = getKey(_key);
          if (!keys.includes(key)) newParams[key] = value;
        });

        return newParams;
      }, options);
    },
    [setSearchParams, getKey]
  );

  const result = React.useMemo(() => {
    return {
      get: (item: string) => searchParams.get(item),
      set: setParams,
      update: setMultipleParams,
      remove: removeParam,
      delete: removeParams,
    };
  }, [searchParams, setMultipleParams, setParams, removeParam, removeParams]);

  return result;
}
