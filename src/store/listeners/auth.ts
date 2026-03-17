import type { AuthDataType } from '~/types';
import { AppError } from '~/utils/errors';
import { DISABLE_CSRF } from '~/config/app';

export type RefreshHandler = (refreshToken: string) => Promise<{ token: string; refreshToken?: string }>;

export type AuthStoreDataType = {
  data: AuthDataType | null;
  token: string | null;
  csrfToken: string | null;
  refreshToken: string | null;
  loading: boolean;
};

export type UserStoreDataType = {
  data: AuthDataType;
  token: string;
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

  getUser: (): UserStoreDataType => {
    const { data, token, csrfToken, ...otherStates } = currentState;
    if (!data || !token || (!DISABLE_CSRF && !csrfToken)) throw new AppError(401);
    return { ...otherStates, data, token, csrfToken };
  },

  set: (payload: Partial<AuthStoreDataType>) => {
    currentState = { ...currentState, ...payload };
    listeners.forEach((listener) => listener(currentState));
  },

  subscribe: (callback: (state: AuthStoreDataType) => void): (() => void) => {
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
