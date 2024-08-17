import { Drawer as AntdDrawer } from 'antd';

import type { DrawerProps } from 'antd';

function Drawer({ children, ...props }: DrawerProps) {
  return (
    <AntdDrawer destroyOnClose={true} {...props}>
      {children}
    </AntdDrawer>
  );
}

export default Drawer;
