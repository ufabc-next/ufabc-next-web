import config from '@/environment'; // error here
import axios from 'axios';

const api = axios.create({ baseURL: config.API_URL }); // error here

api.interceptors.request.use(async (config) => {
  // TODO get token and add to Authorization header
  return config;
});

export default api;
