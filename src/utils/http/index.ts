import axios from 'axios';

const axiosJsonInstance = axios.create();
axiosJsonInstance.defaults.headers.common['Accept'] = 'application/json';
axiosJsonInstance.defaults.headers.common['Content-Type'] = 'application/json';

// const axiosDefault = axios.create();
// axiosDefault.defaults.headers.common['Accept'] = 'application/json';

const axiosFile = axios.create();
axiosFile.defaults.headers.common['Accept'] = 'application/json';
axiosFile.defaults.headers.common['Content-Type'] = 'multipart/form-data';

// export const httpInstance = axiosDefault;
export const httpFileInstance = axiosFile;
export default axiosJsonInstance;
