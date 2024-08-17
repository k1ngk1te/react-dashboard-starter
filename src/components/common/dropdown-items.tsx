import { MoreOutlined } from '@ant-design/icons';
import React from 'react';

import Button, { ButtonType } from '../controls/button';
import Dropdown, { DropdownType } from '../controls/dropdown';
import IconButton, { ButtonType as IconButtonType } from '../controls/icon-button';
import Link from '../controls/link';

export type DropdownItemsType = DropdownType & {
  actions?: (ButtonType & {
    key: string;
    label: React.ReactNode;
    href?: string;
    renderButtonWrapper?: boolean;
  })[];
  component?: (props: IconButtonType) => React.ReactNode;
};

export default function DropdownItems({
  actions = [],
  component: ActionButton,
  ...props
}: DropdownItemsType) {
  const menuItems = React.useMemo(() => {
    return actions.map(({ key, label, href, renderButtonWrapper = true, ...props }) => {
      const className = 'dropdown-item-button';
      const labelClassName = 'dropdown-item-button-label';

      return {
        className: '!p-0',
        key,
        label: !renderButtonWrapper ? (
          label
        ) : !href ? (
          <div>
            <Button className={className} type="link" size="middle" {...props}>
              <span className={labelClassName}>{label}</span>
            </Button>
          </div>
        ) : (
          <Link to={href}>
            <Button className={className} type="text" size="middle" {...props}>
              <span className={labelClassName}>{label}</span>
            </Button>
          </Link>
        ),
      };
    });
  }, [actions]);

  return (
    <Dropdown menu={{ items: menuItems }} trigger={['click']} {...props}>
      {ActionButton ? <ActionButton /> : <IconButton className="!rounded-md" icon={MoreOutlined} />}
    </Dropdown>
  );
}
