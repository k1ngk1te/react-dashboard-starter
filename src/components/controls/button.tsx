import { Button as AntdButton } from 'antd';
import React from 'react';

import type { ButtonProps } from 'antd';
import classNames from '../../utils/classnames';

export type ButtonType = Omit<ButtonProps, 'icon'> & {
  icon?: ({ className }: { className?: string }) => React.ReactNode;
  iconClass?: string;
  wrap?: boolean;
};

function Button({
  className: propsClassName,
  children,
  icon: Icon,
  iconClass = 'text-lg',
  wrap = true,
  ...props
}: ButtonType) {
  const className = classNames('flex items-center justify-center rounded-md', propsClassName || '');

  const iconClassName = classNames('text-sm', iconClass);
  return (
    <AntdButton
      block
      icon={
        Icon ? (
          <span className={iconClassName}>
            <Icon />
          </span>
        ) : undefined
      }
      className={className}
      size="large"
      type="primary"
      htmlType="submit"
      {...props}
    >
      {wrap ? <span className="px-2 text-sm md:text-base">{children}</span> : children}
    </AntdButton>
  );
}

export default Button;
