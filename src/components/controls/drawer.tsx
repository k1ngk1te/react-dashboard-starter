import { CloseOutlined } from '@ant-design/icons';
import { Drawer as AntdDrawer } from 'antd';
import React from 'react';

import type { DrawerProps } from 'antd';

type DrawerType = DrawerProps & {
  drawerCloseIcon?: boolean;
  drawerTitle?: string;
};

function Drawer({ children, drawerCloseIcon = true, drawerTitle, ...props }: DrawerType) {
  const compItems = React.useMemo(() => {
    const items: Record<string, any> = {};
    if (drawerTitle) {
      items.title = <span className="dark-text dark:text-gray-300">{drawerTitle}</span>;
    }
    return items;
  }, [drawerTitle]);

  return (
    <AntdDrawer
      className="dark:bg-gray-800 dark:text-gray-300"
      closeIcon={drawerCloseIcon ? <CloseOutlined className="dark:text-gray-300" /> : undefined}
      {...compItems}
      {...props}
    >
      {children}
    </AntdDrawer>
  );
}

export default Drawer;
