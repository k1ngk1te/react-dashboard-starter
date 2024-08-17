import { Switch as AntdSwitch } from 'antd';
import React from 'react';

import type { SwitchProps } from 'antd';

type SwitchType = SwitchProps & {
  error?: string;
  label?: React.ReactNode;
  placeholder?: React.ReactNode;
};

function Switch({ label, error, placeholder, ...props }: SwitchType) {
  return (
    <>
      {' '}
      {label && (
        <label className={`${error ? 'text-red-500' : ''} form-field-label`} htmlFor={props.id}>
          {label}
        </label>
      )}
      <span className="flex items-center w-full">
        <AntdSwitch defaultChecked={false} size="small" {...props} />
        {placeholder && (
          <span className={`${error ? 'text-red-500' : ''} ml-2 form-field-label`}>
            {placeholder}
          </span>
        )}
      </span>
    </>
  );
}

export default Switch;
