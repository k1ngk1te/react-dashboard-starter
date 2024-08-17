import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import { Input as AntdInput, InputNumber as AntdInputNumber } from 'antd';
import { InputOTP as AntdInputOTP, InputOTPProps } from 'antd-input-otp';
import React from 'react';

import classNames from '../../utils/classnames';

import type { InputProps, InputNumberProps, InputRef } from 'antd';
import type { SearchProps } from 'antd/es/input';
import type { TextAreaRef, TextAreaProps } from 'antd/es/input/TextArea';

type InputType = InputProps & {
  error?: string;
  icon?: ({ className }: { className?: string }) => React.ReactNode;
  label?: string;
};

type InputNumberType = InputNumberProps & {
  error?: string;
  icon?: ({ className }: { className?: string }) => React.ReactNode;
  label?: string;
};

type InputOTPType = InputOTPProps & {
  className?: string;
  error?: string;
  label?: string;
};

type InputSearchType = SearchProps & {
  error?: string;
  icon?: ({ className }: { className?: string }) => React.ReactNode;
  label?: string;
};

type TextAreaType = TextAreaProps & {
  error?: string;
  label?: string;
};

const Input = React.forwardRef<InputRef, InputType>(
  ({ className: propsClassName, error, label, icon: Icon, ...props }, ref) => {
    const className = classNames(
      'border border-gray-300 font-medium rounded-md text-sm md:text-base',
      propsClassName || ''
    );
    return (
      <>
        {label && (
          <label
            className={`${error ? '!text-red-500' : 'text-gray-600'} form-field-label`}
            htmlFor={props.id}
          >
            {label}
          </label>
        )}

        <AntdInput
          allowClear
          status={error ? 'error' : undefined}
          className={className}
          size="large"
          required
          ref={ref}
          prefix={
            Icon ? (
              <span className="pr-2">
                <Icon className="text-xs text-primary-500" />
              </span>
            ) : undefined
          }
          id={props.name}
          {...props}
        />

        {error && <span className="block !text-red-500 form-field-label">{error}</span>}
      </>
    );
  }
);

export const InputNumber = ({
  className: propsClassName,
  error,
  label,
  icon: Icon,
  ...props
}: InputNumberType) => {
  const className = classNames(
    'border border-gray-300 font-medium rounded-md text-sm w-full md:text-base',
    propsClassName || ''
  );
  return (
    <>
      {label && (
        <label
          className={`${error ? '!text-red-500' : 'text-gray-600'} form-field-label`}
          htmlFor={props.id}
        >
          {label}
        </label>
      )}

      <AntdInputNumber
        className={className}
        status={error ? 'error' : undefined}
        required={false}
        size="large"
        prefix={
          Icon ? (
            <span className="pr-2">
              <Icon className="text-xs text-primary-500" />
            </span>
          ) : undefined
        }
        // ref={ref}
        {...props}
      />

      {error && <span className="block !text-red-500 form-field-label">{error}</span>}
    </>
  );
};

export const InputPassword = React.forwardRef<InputRef, InputType>(
  ({ className: propsClassName, error, label, icon: Icon, ...props }, ref) => {
    const className = classNames(
      'border border-gray-300 font-medium rounded-md text-sm md:text-base',
      propsClassName || ''
    );
    return (
      <>
        {label && (
          <label
            className={`${error ? '!text-red-500' : 'text-gray-600'} form-field-label`}
            htmlFor={props.id}
          >
            {label}
          </label>
        )}

        <AntdInput.Password
          allowClear
          className={className}
          status={error ? 'error' : undefined}
          iconRender={(visible) =>
            !visible ? (
              <span className="text-primary-500 text-sm cursor-pointer">
                <EyeOutlined />
              </span>
            ) : (
              <span className="text-primary-500 text-sm cursor-pointer">
                <EyeInvisibleOutlined />
              </span>
            )
          }
          required={false}
          size="large"
          prefix={
            Icon ? (
              <span className="pr-2">
                <Icon className="text-xs text-primary-500" />
              </span>
            ) : undefined
          }
          ref={ref}
          {...props}
        />

        {error && <span className="block !text-red-500 form-field-label">{error}</span>}
      </>
    );
  }
);

export const InputSearch = React.forwardRef<InputRef, InputSearchType>(
  ({ className: propsClassName, error, label, icon: Icon, ...props }, ref) => {
    const className = classNames(
      'border border-gray-300 font-medium rounded-md text-sm md:text-base',
      propsClassName || ''
    );
    return (
      <>
        {label && (
          <label
            className={`${error ? '!text-red-500' : 'text-gray-600'} form-field-label`}
            htmlFor={props.id}
          >
            {label}
          </label>
        )}

        <AntdInput.Search
          allowClear
          status={error ? 'error' : undefined}
          className={className}
          size="large"
          required
          ref={ref}
          prefix={
            Icon ? (
              <span className="pr-2">
                <Icon className="text-xs text-primary-500" />
              </span>
            ) : undefined
          }
          id={props.name}
          enterButton
          {...props}
        />

        {error && <span className="block !text-red-500 form-field-label">{error}</span>}
      </>
    );
  }
);

export const Textarea = React.forwardRef<TextAreaRef, TextAreaType>(
  ({ className: propsClassName, error, label, ...props }, ref) => {
    const className = classNames(
      'border border-gray-300 font-medium rounded-md text-sm md:text-base',
      propsClassName || ''
    );
    return (
      <>
        {label && (
          <label
            className={`${error ? '!text-red-500' : 'text-gray-600'} form-field-label`}
            htmlFor={props.id}
          >
            {label}
          </label>
        )}

        <AntdInput.TextArea
          allowClear
          autoSize={{
            minRows: 2,
            maxRows: 4,
          }}
          className={className}
          status={error ? 'error' : undefined}
          size="large"
          required={false}
          ref={ref}
          {...props}
        />

        {error && <span className="block !text-red-500 form-field-label">{error}</span>}
      </>
    );
  }
);

export const InputOTP = React.forwardRef<any, InputOTPType>(({ error, label, ...props }, ref) => {
  const className = classNames(
    'border font-medium h-[50px] rounded-md max-w-none text-sm md:text-base',
    props.className || ''
  );
  return (
    <>
      {label && (
        <label className={`${error ? 'text-red-500' : ''} form-field-label`} htmlFor={props.id}>
          {label}
        </label>
      )}

      <AntdInputOTP
        ref={ref}
        status={error ? 'error' : undefined}
        className={className}
        length={5}
        wrapperClassName="flex justify-between"
        {...props}
      />
    </>
  );
});

export default Input;
