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

const user = {
  completeSignup: (params = {}) => api.put('/users/complete', params),
  confirmSignup: (params = {}) => api.post('/account/confirm', params),
  resendEmail: () => api.post('/users/me/resend'),
  recovery: (email: string) => api.post('/users/me/recover', { email }),
  delete: () => api.delete('/users/me/delete'),
  info: () => api.get<User>('/users/info'),
};

export default user;
