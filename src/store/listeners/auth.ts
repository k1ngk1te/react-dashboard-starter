import type { AuthDataType } from '~/types';

export type AuthStoreDataType = {
  data: AuthDataType | null;
  token: string | null;
  csrfToken: string | null;
  loading: boolean;
};

let currentState: AuthStoreDataType = {
  data: null,
  token: null,
  csrfToken: null,
  loading: true,
};

const listeners = new Set<(state: AuthStoreDataType) => void>();

const authStore = {
  get: (): AuthStoreDataType => currentState,

  set: (payload: Partial<AuthStoreDataType>) => {
    currentState = { ...currentState, ...payload };
    listeners.forEach((listener) => listener(currentState));
  },

  subscribe: (callback: (state: AuthStoreDataType) => void): () => void => {
    listeners.add(callback);
    return () => listeners.delete(callback);
  },
};

export default authStore;
