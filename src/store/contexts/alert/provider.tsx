import { CheckCircleFilled, CloseCircleFilled, ExclamationCircleFilled } from '@ant-design/icons';
import { message } from 'antd';
import { type ReactNode, useCallback } from 'react';
import { AlertContext, type AlertContextHandlerType } from './context';
import { classNames } from '~/utils';

export default function ToastProvider({ children }: { children: ReactNode }) {
  const [messageApi, contextHolder] = message.useMessage();

  const close = useCallback(
    (key?: string) => {
      messageApi.destroy(key);
    },
    [messageApi],
  );

  const open = useCallback(
    (data: AlertContextHandlerType) => {
      let icon: React.ReactNode;

      if (data.icon === undefined) {
        switch (data?.type) {
          case 'danger':
          case 'error':
            icon = <CloseCircleFilled />;
            break;
          case 'info':
          case 'warning':
            icon = <ExclamationCircleFilled />;
            break;
          case 'success':
            icon = <CheckCircleFilled />;
            break;
          default:
            break;
        }
      }

      const type = data.type === 'danger' ? 'error' : data.type;

      messageApi.open({
        ...data,
        icon,
        className: classNames('custom-notification-message', type || '', data.className || ''),
        content: data.message,
        type,
      });
    },
    [messageApi],
  );

  const buildCallback = useCallback(
    (
      type: NonNullable<AlertContextHandlerType['type']>,
      message: string,
      options?: Omit<AlertContextHandlerType, 'type' | 'message'>,
    ) => {
      open({ ...options, message, type });
    },
    [open],
  );

  const success = useCallback(
    (message: string, options?: Omit<AlertContextHandlerType, 'message' | 'type'>) =>
      buildCallback('success', message, options),
    [buildCallback],
  );
  const danger = useCallback(
    (message: string, options?: Omit<AlertContextHandlerType, 'message' | 'type'>) =>
      buildCallback('danger', message, options),
    [buildCallback],
  );
  const error = useCallback(
    (message: string, options?: Omit<AlertContextHandlerType, 'message' | 'type'>) =>
      buildCallback('error', message, options),
    [buildCallback],
  );
  const info = useCallback(
    (message: string, options?: Omit<AlertContextHandlerType, 'message' | 'type'>) =>
      buildCallback('info', message, options),
    [buildCallback],
  );
  const warning = useCallback(
    (message: string, options?: Omit<AlertContextHandlerType, 'message' | 'type'>) =>
      buildCallback('warning', message, options),
    [buildCallback],
  );

  return (
    <AlertContext.Provider value={{ open, close, success, danger, error, info, warning }}>
      {contextHolder}
      {children}
    </AlertContext.Provider>
  );
}
