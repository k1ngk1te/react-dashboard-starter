import axios from 'axios';

const axiosInstance = axios.create({
  withCredentials: true,
});

axiosInstance.defaults.headers.common['Accept'] = 'application/json';
axiosInstance.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
axiosInstance.defaults.headers.common['Access-Control-Allow-Credentials'] =
  true;
axiosInstance.defaults.headers.common['Content-Type'] = 'application/json';

export default axiosInstance;
