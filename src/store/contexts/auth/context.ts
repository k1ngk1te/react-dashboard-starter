import { useSyncExternalStore } from 'react';
import authStore from '~/store/listeners/auth';
import type { AuthDataType } from '~/types';
import { AppError } from '~/utils/errors';

export type LoginPayloadType = { user: AuthDataType; csrfToken: string; token: string };
export type LogoutPayloadType = { csrfToken?: string } | void;

export const authActions = {
  login: (payload: LoginPayloadType) =>
    authStore.set({
      data: payload.user,
      token: payload.token,
      csrfToken: payload.csrfToken,
      loading: false,
    }),

  logout: (payload?: LogoutPayloadType) =>
    authStore.set({
      token: null,
      csrfToken: payload?.csrfToken || authStore.get().csrfToken,
      loading: false,
    }),

  changeCSRFToken: (token: string) => authStore.set({ csrfToken: token }),
};

export const useAuthContext = () => {
  const state = useSyncExternalStore(authStore.subscribe, authStore.get);
  return {
    ...state,
    auth: !!state.data && !!state.token,
    ...authActions,
  };
};

export const useUserContext = () => {
  const { csrfToken, data, token, ...context } = useAuthContext();
  if (!data || !token || !csrfToken) throw new AppError(401);
  return { ...context, user: data, csrfToken, data, token };
};
