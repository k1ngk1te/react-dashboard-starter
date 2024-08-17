import { Dropdown as AntdDropdown, theme } from 'antd';
import React from 'react';

import { classNames } from '../../utils';

import type { DropDownProps } from 'antd';

type DropdownType = DropDownProps;

function Dropdown({ children, className: propsClassName, ...props }: DropdownType) {
  const className = classNames('dark:bg-gray-800', propsClassName || '');

  const { token } = theme.useToken();

  return (
    <AntdDropdown
      className={className}
      dropdownRender={(menu) => (
        <div
          className="bg-white dark:bg-gray-800"
          style={{
            backgroundColor: undefined,
            borderRadius: token.borderRadiusLG,
            boxShadow: token.boxShadowSecondary,
          }}
        >
          {React.cloneElement(menu as React.ReactElement, {
            style: {
              boxShadow: 'none',
            },
          })}
        </div>
      )}
      {...props}
    >
      <span>{children}</span>
    </AntdDropdown>
  );
}

export default Dropdown;
