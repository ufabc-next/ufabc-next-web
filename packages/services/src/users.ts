import type { User } from 'types';

import { api } from './api';

export type UserSignup = {
  email: string;
  ra: number;
};

export type FacebookAuth = {
  // user personal email `not` @aluno.ufabc.edu.br
  email: string;
  ra: string;
};

export type FacebookConfirmResponse = {
  token: string;
};

export type UserConfirmResponse = {
  token: string;
};

export type EmailResponse = {
  email: string;
};

export const Users = {
  completeSignup: (params: UserSignup) => api.put('/users/complete', params),
  confirmSignup: (token: string) =>
    api.post<UserConfirmResponse>('/users/confirm', { token }),
  resendEmail: () => api.post('/users/resend'),
  recovery: (email: string) => api.post('/users/recover', { email }),
  delete: () => api.delete('/users/remove'),
  info: () => api.get<User>('/users/info'),
  facebookAuth: (params: FacebookAuth) =>
    api.post<FacebookConfirmResponse>('/users/facebook', params),
  getEmail: (ra: string) =>
    api.get<EmailResponse>('/users/check-email', { params: { ra } }),
};
