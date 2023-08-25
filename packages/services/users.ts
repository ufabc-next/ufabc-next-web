import api from './api';

type Oauth = {
  email: string;
  facebook: string;
  picture: string;
  emailFacebook: string;
};

type Device = {
  _id: string;
  deviceId: string;
  token: string;
  phone: string;
};

type User = {
  _id: string;
  oauth: Oauth;
  confirmed: boolean;
  email: string;
  ra: number;
  createAt: string;
  devices: Device[];
};

const userApi = {
  completeSignup: async (params = {}) => api.put('/users/complete', params),
  confirmSignup: async (params = {}) => api.post('/account/confirm', params),
  resendEmail: async () => api.post('/users/me/resend'),
  recovery: async (email: string) => api.post('/users/me/recover', { email }),
  delete: async () => api.delete('/users/me/delete'),
  info: async () => api.get<User>('/users/info'),
};

export default userApi;
