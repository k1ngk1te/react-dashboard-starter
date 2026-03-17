import type { AuthDataType } from '~/types';

export type RefreshHandler = (refreshToken: string) => Promise<{ token: string; refreshToken?: string }>;

export type AuthStoreDataType = {
  data: AuthDataType | null;
  token: string | null;
  csrfToken: string | null;
  refreshToken: string | null;
  loading: boolean;
};

let currentState: AuthStoreDataType = {
  data: null,
  token: null,
  csrfToken: null,
  refreshToken: null,
  loading: true,
};

let refreshHandler: RefreshHandler | null = null;
let refreshUrl: string | null = null;

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

  setRefreshHandler: (handler: RefreshHandler | null, url?: string) => {
    refreshHandler = handler;
    refreshUrl = url ?? null;
  },

  getRefreshHandler: (): RefreshHandler | null => refreshHandler,

  getRefreshUrl: (): string | null => refreshUrl,
};

export default authStore;
