import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import { Input as AntdInput, InputNumber as AntdInputNumber } from 'antd';
import { InputOTP as AntdInputOTP, InputOTPProps } from 'antd-input-otp';
import React from 'react';

import classNames from '../../utils/classnames';

import type { InputProps, InputNumberProps, InputRef } from 'antd';
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

type TextAreaType = TextAreaProps & {
  error?: string;
  label?: string;
};

const classes = 'form-field-item';

const Input = React.forwardRef<InputRef, InputType>(
  ({ error, label, icon: Icon, className: propsClassName, ...props }, ref) => {
    const className = classNames(classes, propsClassName || '');
    return (
      <>
        {label && (
          <label className={`${error ? 'text-red-500' : ''} form-field-label`} htmlFor={props.id}>
            {label}
          </label>
        )}

        <AntdInput
          allowClear
          status={error ? 'error' : undefined}
          className={className}
          size="large"
          required={false}
          ref={ref}
          prefix={
            Icon ? (
              <span className="pr-2">
                <Icon className="text-xs text-primary-500" />
              </span>
            ) : undefined
          }
          {...props}
        />
      </>
    );
  }
);

export const InputNumber = ({ error, label, icon: Icon, ...props }: InputNumberType) => {
  const className = classNames(classes, props.className || '');
  return (
    <>
      {label && (
        <label className={`${error ? 'text-red-500' : ''} form-field-label`} htmlFor={props.id}>
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
    </>
  );
};

export const InputPassword = React.forwardRef<InputRef, InputType>(
  ({ error, label, icon: Icon, ...props }, ref) => {
    const className = classNames(classes, props.className || '');
    return (
      <>
        {label && (
          <label className={`${error ? 'text-red-500' : ''} form-field-label`} htmlFor={props.id}>
            {label}
          </label>
        )}

        <AntdInput.Password
          allowClear
          className={className}
          status={error ? 'error' : undefined}
          iconRender={(visible) =>
            !visible ? (
              <span>
                <EyeOutlined className="cursor-pointer text-sm" />
              </span>
            ) : (
              <span>
                <EyeInvisibleOutlined className="cursor-pointer text-sm" />
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
      </>
    );
  }
);

export const Textarea = React.forwardRef<TextAreaRef, TextAreaType>(
  ({ error, label, ...props }, ref) => {
    const className = classNames(classes, props.className || '');
    return (
      <>
        {label && (
          <label className={`${error ? 'text-red-500' : ''} form-field-label`} htmlFor={props.id}>
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
          style={{
            fontSize: 'inherit',
          }}
          styles={{
            textarea: {
              color: 'inherit',
            },
          }}
          {...props}
        />
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
