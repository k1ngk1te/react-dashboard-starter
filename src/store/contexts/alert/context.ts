import React from 'react';

import type { AlertContextType } from './provider';

export const AlertContext = React.createContext<AlertContextType>({
  open: () => {},
  close: () => {},
});

export const useAlertContext = () => {
  return React.useContext(AlertContext) as AlertContextType;
};
