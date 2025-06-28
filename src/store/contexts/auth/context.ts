import React from 'react';

import { AppError } from '~/utils/errors';

import type { AuthContextType } from './provider';

export const useAuthContext = () => {
  return React.useContext(AuthContext) as AuthContextType;
};

export const useUserContext = () => {
  const { data, token, ...context } = useAuthContext();
  if (!data || !token) throw new AppError(401);

  return { ...context, user: data, data, token };
};

export const AuthContext = React.createContext<AuthContextType | null>(null);
