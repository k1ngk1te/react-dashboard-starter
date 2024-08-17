import { CaretDownOutlined } from '@ant-design/icons';
import { Select as AntdSelect } from 'antd';
// import React from 'react';

import type { SelectProps } from 'antd';

import classNames from '../../utils/classnames';

export type SelectType = SelectProps & {
  error?: string;
  label?: string;
  labelClassName?: string;
  name?: string;
};

function Select({
  className: propsClassName,
  label,
  labelClassName,
  error,
  onSelect,
  ...props
}: SelectType) {
  // const [value, setValue] = React.useState(props.value || props.defaultValue || undefined);

  const className = classNames('form-field-item', propsClassName || '');
  const labelClass = classNames('form-field-label', labelClassName || '');

  return (
    <>
      {label && (
        <label className={`${error ? 'text-red-500' : ''} ${labelClass}`} htmlFor={props.id}>
          {label}
        </label>
      )}
      <AntdSelect
        className={className}
        status={error ? 'error' : undefined}
        style={{ width: '100%' }}
        size="large"
        {...props}
        onSelect={(value, option) => {
          if (onSelect) onSelect(value, option);
          // setValue(value);
        }}
        suffixIcon={<CaretDownOutlined />}
      />
      {/* <input type="hidden" name={name} id={props.id} readOnly value={value || ''} /> */}
    </>
  );
}

export default Select;
