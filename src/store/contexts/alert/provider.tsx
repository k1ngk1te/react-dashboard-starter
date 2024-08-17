import { notification } from 'antd';
import React from 'react';

import type { NotificationPlacement } from 'antd/es/notification/interface';

export type AlertContextType = {
  name?: string;
  open: (options: AlertContextHandlerType) => void;
};

type AlertContextHandlerType = {
  description: React.ReactNode;
  message: string;
  placement?: NotificationPlacement;
  type?: 'success' | 'info' | 'warning' | 'error' | 'open';
};

export const AlertContext = React.createContext<AlertContextType>({
  name: 'Default',
  open: () => {},
});

const AlertProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [api, contextHolder] = notification
    .useNotification
    // {
    //   stack: enabled
    //     ? {
    //         threshold,
    //       }
    //     : false,
    // }
    ();

  const open = React.useCallback(
    ({ description, message, placement = 'topRight', type = 'open' }: AlertContextHandlerType) => {
      api[type]({
        message,
        description: <AlertContext.Consumer>{() => <>{description}</>}</AlertContext.Consumer>,
        placement,
        // duration: null,
        // className: "",
        // style: {
        //   width: 600,
        // },
        // icon: <SmileOutlined style={{ color: '#108ee9' }} />,
      });
    },
    [api]
  );

  return (
    <AlertContext.Provider value={{ open }}>
      {contextHolder}
      {children}
    </AlertContext.Provider>
  );
};

export default AlertProvider;
