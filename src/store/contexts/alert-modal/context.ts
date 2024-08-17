import React from 'react';

import { AlertModalContext } from './provider';

import type { AlertModalContextType } from './provider';

export const useAlertModalContext = () => {
  return React.useContext(AlertModalContext) as AlertModalContextType;
};
