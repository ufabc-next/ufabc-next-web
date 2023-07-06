import api from '@/utils/api';
import Auth from './Auth';

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
  completeSignup(params = {}) {
    return api.put('/users/complete', params);
  },

  confirmSignup(params = {}) {
    const token = api.post('/account/confirm', params);

    if (window.device) {
      Auth.addDevice();
    }

    return token;
  },

  resendEmail() {
    return api.post('/users/me/resend');
  },

  recovery(email: string) {
    return api.post('/users/me/recover', { email });
  },

  delete() {
    return api.delete('/users/me/delete');
  },

  info() {
    return api.get<User>('/users/info');
  },
};

export default user;
