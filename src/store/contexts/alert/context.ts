import type React from 'react';
import { createContext, useContext } from 'react';

export const useAlertContext = () => {
  return useContext(AlertContext) as AlertContextType;
};

export type AlertContextType = {
  close: (key?: string) => void;
  open: (options: AlertContextHandlerType) => void;
  success: (message: string, options?: Omit<AlertContextHandlerType, 'message'>) => void;
  danger: (message: string, options?: Omit<AlertContextHandlerType, 'message'>) => void;
  error: (message: string, options?: Omit<AlertContextHandlerType, 'message'>) => void;
  info: (message: string, options?: Omit<AlertContextHandlerType, 'message'>) => void;
  warning: (message: string, options?: Omit<AlertContextHandlerType, 'message'>) => void;
};

export type AlertContextHandlerType = {
  className?: string;
  duration?: number;
  message: string;
  icon?: 'check' | 'close' | 'exclamation' | React.ReactNode;
  type?: 'info' | 'success' | 'danger' | 'error' | 'warning';
};

export const AlertContext = createContext<AlertContextType>({
  open: () => {},
  close: () => {},
  success: () => {},
  danger: () => {},
  error: () => {},
  info: () => {},
  warning: () => {},
});
