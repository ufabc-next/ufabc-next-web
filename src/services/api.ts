import axios from 'axios';
// import { useAuthStore } from '@/stores/auth';

// const authStore = useAuthStore();

const resolveEndpoint = (env?: string) =>
  ({
    // development: 'http://localhost:5000',
    development: 'https://api.v2.ufabcnext.com',
    staging: 'https://api.v2.ufabcnext.com',
    production: 'https://api.v2.ufabcnext.com',
  })[env!] || 'http://localhost:5000';

export const api = axios.create({
  baseURL: resolveEndpoint(process.env.VUE_APP_MF_ENV),
});

// api.interceptors.request.use(async (config) => {
//   const token = authStore.token;
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });
