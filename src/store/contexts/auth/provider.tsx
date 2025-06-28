import React from 'react';

import { AuthContext } from './context';
import type { AuthDataType } from '../../../types';

export type AuthContextType = AuthType & {
  login: (data: LoginPayloadType) => void;
  logout: () => void;
};

type AuthType = { data: AuthDataType | null; token: string | null; auth: boolean; loading: boolean };
type LoginPayloadType = { user: AuthDataType; token: string };

function reducer(state: AuthType, action: { type: 'logout' } | { type: 'login'; payload: LoginPayloadType }) {
  switch (action.type) {
    case 'login':
      return {
        auth: true,
        loading: false,
        data: action.payload.user,
        token: action.payload.token,
      };
    case 'logout':
      return { auth: false, loading: false, data: state.data, token: null };
    default:
      return state;
  }
}

const initialState = {
  auth: false,
  data: null,
  loading: true,
  token: null,
};

const AuthProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  const login = React.useCallback(
    (userData: LoginPayloadType) => {
      dispatch({
        type: 'login',
        payload: userData,
      });
    },
    [dispatch]
  );

  const logout = React.useCallback(() => {
    dispatch({
      type: 'logout',
    });
  }, [dispatch]);

  return (
    <AuthContext.Provider
      value={{
        auth: state.auth,
        data: state.data,
        loading: state.loading,
        login,
        logout,
        token: state.token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
