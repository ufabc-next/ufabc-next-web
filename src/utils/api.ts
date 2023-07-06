import { API_URL } from '@/environment';
import axios from 'axios';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(async (config) => {
  return config;
});

export default api;
