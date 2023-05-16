import { API_URL } from '@/environment'; // error here
import axios from 'axios';

const api = axios.create({ baseURL: API_URL }); // error here

api.interceptors.request.use(async (config) => {
  // TODO get token and add to Authorization header
  return config;
});

export default api;
