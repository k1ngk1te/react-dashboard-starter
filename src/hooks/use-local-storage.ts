import React from 'react';

type LocalStorageOptions<T> = {
  initialValue?: T;
  type?: 'string' | 'number' | 'array' | 'object' | 'boolean';
};

function useLocalStorage<T = any>(
  key: string,
  options: LocalStorageOptions<T> = {
    type: 'string',
  }
) {
  const [value, setValue] = React.useState<T>(() => {
    const result = localStorage.getItem(key);
    if (result)
      return options.type === 'array' || options.type === 'object' || options.type === 'boolean'
        ? JSON.parse(result)
        : options.type === 'number'
        ? +result
        : result;
    return options.initialValue;
  });

  const changeValue = React.useCallback(
    (value: T) => {
      setValue(value);
      const isObjOrArrayOrBool = typeof value === 'object' || typeof value === 'boolean';
      localStorage.setItem(key, isObjOrArrayOrBool ? JSON.stringify(value) : String(value));
    },
    [key]
  );

  return {
    value,
    setValue: changeValue,
  };
}

export default useLocalStorage;
