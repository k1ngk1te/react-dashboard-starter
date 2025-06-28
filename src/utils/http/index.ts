import axios from 'axios';

const axiosInstance = axios.create();
axiosInstance.defaults.headers.common.Accept = 'application/json';
axiosInstance.defaults.headers.common['Content-Type'] = 'application/json';

export default class HttpInstance {
  static httpInstance = axiosInstance;

  static current() {
    return this.httpInstance;
  }

  static login(token: string) {
    this.httpInstance.defaults.headers.common.Authorization = 'Bearer ' + token;
    return this.httpInstance;
  }

  static logout() {
    this.httpInstance.defaults.headers.common.Authorization = undefined;
    return this.httpInstance;
  }
}

export function httpAuth(token: string) {
  const axiosInstance = axios.create();
  axiosInstance.defaults.headers.common.Accept = 'application/json';
  axiosInstance.defaults.headers.common.Authorization = 'Bearer ' + token;
  axiosInstance.defaults.headers.common['Content-Type'] = 'application/json';
  return axiosInstance;
}
