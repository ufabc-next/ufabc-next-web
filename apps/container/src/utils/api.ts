import { API_URL } from '@/environment';
import axios from 'axios';
import { auth } from 'stores';

const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use(async (config) => {
  const { token } = auth.getState();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
