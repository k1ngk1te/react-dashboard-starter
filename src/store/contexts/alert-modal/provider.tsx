import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import React from 'react';

import Button, { type ButtonType } from '../../../components/controls/button';
import Modal from '../../../components/controls/modal';

type AlertModalContextHandlerType = {
  description?: React.ReactNode;
  message: string;
  type?: 'success' | 'info' | 'warning' | 'error';
  actions?: ButtonType[];
};

export const AlertModalContext = React.createContext({});

export type AlertModalContextType = {
  open: (props: AlertModalContextHandlerType) => void;
  close: () => void;
};

const AlertModalProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [context, setContext] = React.useState<
    AlertModalContextHandlerType & {
      visible: boolean;
    }
  >({
    visible: false,
    message: 'No Message found',
  });

  const open = React.useCallback((props: AlertModalContextHandlerType) => {
    setContext({ ...props, visible: true });
  }, []);

  const close = React.useCallback(() => {
    setContext({
      visible: false,
      message: 'No Message Found.',
    });
  }, []);

  const Icon =
    context.type === 'success'
      ? CheckCircleOutlined
      : context.type === 'error'
      ? CloseCircleOutlined
      : context.type === 'warning'
      ? ExclamationCircleOutlined
      : ExclamationCircleOutlined;

  return (
    <AlertModalContext.Provider value={{ open, close }}>
      {children}
      <Modal onCancel={() => close()} open={context.visible}>
        <div className="flex flex-col items-center gap-2 pt-4">
          <span className="text-2xl">
            <Icon
              className={`${
                context.type === 'success'
                  ? 'text-green-500'
                  : context.type === 'error'
                  ? 'text-red-500'
                  : context.type === 'warning'
                  ? 'text-yellow-500'
                  : context.type === 'info'
                  ? 'text-primary-500'
                  : 'text-gray-500 dark:text-gray-300'
              }`}
            />
          </span>
          <h4 className="alert-modal-title">{context.message}</h4>
          {context.description && <p className="alert-modal-description">{context.description}</p>}
          <div className="grid grid-cols-1 gap-2 mt-2 w-full">
            {context.actions ? (
              context.actions.map((action, index) => {
                return <Button key={index} {...action} />;
              })
            ) : (
              <Button onClick={close}>Done</Button>
            )}
          </div>
        </div>
      </Modal>
    </AlertModalContext.Provider>
  );
};

export default AlertModalProvider;
