import { DatePicker as AntdDatePicker } from 'antd';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import React from 'react';

import type { DatePickerProps } from 'antd';

dayjs.extend(customParseFormat);

type DatePickerType = Omit<DatePickerProps, 'defaultValue'> & {
  defaultValue?: string | dayjs.Dayjs | Date;
  error?: string;
  label?: string;
};

function DatePicker({ label, error, id, onChange, defaultValue, value, ...props }: DatePickerType) {
  // const [inputValue, setValue] = React.useState<string>();

  const controlDefaultValue = React.useMemo(() => {
    if (!defaultValue) return undefined;

    if (typeof defaultValue === 'string') {
      const date = dayjs(defaultValue);
      // setValue(date.format('YYYY-MM-DD'));
      return date;
    }
    const value = dayjs(defaultValue);
    // setValue(value.format('YYYY-MM-DD'));
    return value;
  }, [defaultValue]);

  const controlValue = React.useMemo(() => {
    if (!value) return undefined;

    if (typeof value === 'string') {
      const date = dayjs(value);
      // setValue(date.format('YYYY-MM-DD'));
      return date;
    }
    // setValue(value.format('YYYY-MM-DD'));
    return value;
  }, [value]);

  return (
    <>
      {label && (
        <label
          className={`${error ? '!text-red-500' : 'text-gray-600'} form-field-label`}
          htmlFor={id}
        >
          {label}
        </label>
      )}
      <AntdDatePicker
        className="text-sm w-full lg:text-base"
        status={error ? 'error' : undefined}
        size="large"
        onChange={(date, dateString) => {
          if (onChange) onChange(date, dateString);
          // setValue(dateString);
        }}
        {...props}
        defaultValue={controlDefaultValue}
        value={controlValue}
      />
      {/* <input
        type="hidden"
        name={name}
        id={id}
        readOnly
        value={inputValue || ''}
      /> */}
    </>
  );
}

export default DatePicker;
