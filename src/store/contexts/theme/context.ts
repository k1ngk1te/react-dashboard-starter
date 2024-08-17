import React from 'react';

import { ThemeContext } from './provider';

import type { ThemeContextType } from './provider';

export const useThemeContext = () => {
  return React.useContext(ThemeContext) as ThemeContextType;
};
