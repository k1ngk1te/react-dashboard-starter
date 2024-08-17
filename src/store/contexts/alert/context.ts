import React from 'react';

import { AlertContext } from './provider';

import type { AlertContextType } from './provider';

export const useAlertContext = () => {
  return React.useContext(AlertContext) as AlertContextType;
};
