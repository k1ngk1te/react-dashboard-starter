import axios, { type AxiosRequestConfig } from 'axios';

import authStore from '~/store/listeners/auth';
import { authActions } from '~/store/contexts/auth/context';

export const httpClient = axios.create();
httpClient.defaults.headers.common.Accept = 'application/json';
httpClient.defaults.headers.common['Content-Type'] = 'application/json';

// Queue of resolvers waiting on an in-progress refresh
let isRefreshing = false;
let refreshQueue: Array<(token: string) => void> = [];

function processQueue(newToken: string) {
  refreshQueue.forEach((resolve) => resolve(newToken));
  refreshQueue = [];
}

httpClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original: AxiosRequestConfig & { _retry?: boolean } = error.config;

    if (error?.response?.status !== 401) {
      return Promise.reject(error);
    }

    const refreshUrl = authStore.getRefreshUrl();
    const isRefreshEndpoint = refreshUrl && original.url?.includes(refreshUrl);

    if (original._retry || isRefreshEndpoint) {
      authActions.logout();
      return Promise.reject(error);
    }

    const { refreshToken } = authStore.get();
    const handler = authStore.getRefreshHandler();

    if (!refreshToken || !handler) {
      authActions.logout();
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve) => {
        refreshQueue.push((newToken: string) => {
          original.headers = { ...original.headers, Authorization: 'Bearer ' + newToken };
          resolve(httpClient(original));
        });
      });
    }

    original._retry = true;
    isRefreshing = true;

    try {
      const result = await handler(refreshToken);
      authStore.set({ token: result.token, refreshToken: result.refreshToken ?? refreshToken });
      setAuthHeader(result.token);
      processQueue(result.token);
      original.headers = { ...original.headers, Authorization: 'Bearer ' + result.token };
      return httpClient(original);
    } catch {
      authActions.logout();
      return Promise.reject(error);
    } finally {
      isRefreshing = false;
    }
  },
);

export function setAuthHeader(token: string) {
  httpClient.defaults.headers.common.Authorization = 'Bearer ' + token;
}

export function clearAuthHeader() {
  delete httpClient.defaults.headers.common.Authorization;
}
