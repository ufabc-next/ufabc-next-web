import Axios from 'axios';
import Auth from './Auth';

class User {
  completeSignup(params = {}) {
    return Axios.put('/users/complete', params);
  }

  confirmSignup(params = {}) {
    const token = Axios.post('/account/confirm', params);

    if (window.device) {
      Auth.addDevice();
    }

    return token;
  }

  resendEmail() {
    return Axios.post('/users/me/resend');
  }

  recovery(email: string) {
    return Axios.post('/users/me/recover', { email });
  }

  delete() {
    return Axios.delete('/users/me/delete');
  }

  info() {
    return Axios.get('/users/info');
  }
}

export default new User();
