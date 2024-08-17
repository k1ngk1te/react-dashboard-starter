import React from 'react';

import { ToastContext } from './provider';

import type { ToastContextType } from './provider';

export const useToastContext = () => {
  return React.useContext(ToastContext) as ToastContextType;
};
