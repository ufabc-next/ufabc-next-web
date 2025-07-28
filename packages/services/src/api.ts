import axios from 'axios';
import { authStore } from 'stores';

const resolveEndpoint = (env?: string) =>
  ({
    development: 'http://localhost:5000',
    staging: 'https://api.v2.ufabcnext.com',
    production: 'https://api.v2.ufabcnext.com',
  })[env!] || 'https://api.v2.ufabcnext.com';

export const api = axios.create({
  baseURL: resolveEndpoint(import.meta.env.VITE_APP_ENV),
});

api.interceptors.request.use(async (config) => {
  const { token } = authStore.getState();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
