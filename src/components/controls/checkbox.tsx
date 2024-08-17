import { Checkbox as AntdCheckbox } from 'antd';
import React from 'react';

import type { CheckboxProps } from 'antd';

type CheckboxType = CheckboxProps & {
  error?: string;
  label?: React.ReactNode;
  placeholder?: React.ReactNode;
};

function Checkbox({ label, error, placeholder, ...props }: CheckboxType) {
  return (
    <>
      {' '}
      {label && (
        <label
          className={`${
            error ? 'text-red-500' : 'text-gray-600'
          } block font-semibold my-1 text-xs  sm:text-sm`}
          htmlFor={props.id}
        >
          {label}
        </label>
      )}
      <AntdCheckbox defaultChecked={false} {...props}>
        {placeholder}
      </AntdCheckbox>
    </>
  );
}

export default Checkbox;
