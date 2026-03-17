import axios, { type AxiosRequestConfig } from 'axios';

import { CSRF_TOKEN } from '~/config/app';
import authStore from '~/store/listeners/auth';
import { authActions } from '~/store/contexts/auth/context';

const axiosInstance = axios.create();
axiosInstance.defaults.headers.common.Accept = 'application/json';
axiosInstance.defaults.headers.common['Content-Type'] = 'application/json';

// Queue of resolvers waiting on an in-progress refresh
let isRefreshing = false;
let refreshQueue: Array<(token: string) => void> = [];

function processQueue(newToken: string) {
  refreshQueue.forEach((resolve) => resolve(newToken));
  refreshQueue = [];
}

axiosInstance.interceptors.response.use(
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
          resolve(axiosInstance(original));
        });
      });
    }

    original._retry = true;
    isRefreshing = true;

    try {
      const result = await handler(refreshToken);
      authStore.set({ token: result.token, refreshToken: result.refreshToken ?? refreshToken });
      axiosInstance.defaults.headers.common.Authorization = 'Bearer ' + result.token;
      axiosInstance.defaults.headers.common[CSRF_TOKEN] = authStore.get().csrfToken ?? '';
      processQueue(result.token);
      original.headers = { ...original.headers, Authorization: 'Bearer ' + result.token };
      return axiosInstance(original);
    } catch {
      authActions.logout();
      return Promise.reject(error);
    } finally {
      isRefreshing = false;
    }
  },
);

export default class HttpInstance {
  static httpInstance = axiosInstance;

  static current() {
    return this.httpInstance;
  }

  static csrf(csrfToken: string) {
    this.httpInstance.defaults.headers.common[CSRF_TOKEN] = csrfToken;
    return this.httpInstance;
  }

  static login(token: string, csrfToken: string) {
    this.httpInstance.defaults.headers.common.Authorization = 'Bearer ' + token;
    this.httpInstance.defaults.headers.common[CSRF_TOKEN] = csrfToken;
    return this.httpInstance;
  }

  static logout() {
    this.httpInstance.defaults.headers.common.Authorization = undefined;
    return this.httpInstance;
  }
}

export function httpJson(csrfToken: string) {
  const axiosInstance = axios.create();
  axiosInstance.defaults.headers.common.Accept = 'application/json';
  axiosInstance.defaults.headers.common['Content-Type'] = 'application/json';
  axiosInstance.defaults.headers.common[CSRF_TOKEN] = csrfToken;
  return axiosInstance;
}

export function httpAuth(token: string, csrfToken: string) {
  const axiosInstance = axios.create();
  axiosInstance.defaults.headers.common.Accept = 'application/json';
  axiosInstance.defaults.headers.common.Authorization = 'Bearer ' + token;
  axiosInstance.defaults.headers.common['Content-Type'] = 'application/json';
  axiosInstance.defaults.headers.common[CSRF_TOKEN] = csrfToken;
  return axiosInstance;
}
