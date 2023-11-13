import { api } from './api';

export type Oauth = {
  email: string;
  facebook: string;
  picture: string;
  emailFacebook: string;
  google?: string;
};

export type Device = {
  _id: string;
  deviceId: string;
  token: string;
  phone: string;
};

export type User = {
  _id: string;
  oauth: Oauth;
  confirmed: boolean;
  email: string;
  ra: number;
  createdAt: string;
  devices: Device[];
};

export type UserSignup = {
  email: string;
  ra: number;
};

export const Users = {
  completeSignup: (params: UserSignup) => api.put('/users/complete', params),
  confirmSignup: (params = {}) => api.post('/account/confirm', params),
  resendEmail: () => api.post('/users/me/resend'),
  recovery: (email: string) => api.post('/users/me/recover', { email }),
  delete: () => api.delete('/users/me/delete'),
  info: () => api.get<User>('/users/info'),
};
