import Axios from 'axios';
import Auth from './Auth';

class User {
  async completeSignup(params = {}) {
    return await Axios.put('/users/complete', params);
  }

  async confirmSignup(params = {}) {
    const token = await Axios.post('/account/confirm', params);

    if (window.device) {
      await Auth.addDevice();
    }

    return token;
  }

  async resendEmail() {
    return await Axios.post('/users/me/resend');
  }

  async recovery(email: string) {
    return await Axios.post('/users/me/recover', { email });
  }

  async delete() {
    return await Axios.delete('/users/me/delete');
  }

  async info() {
    return await Axios.get('/users/info');
  }
}

export default new User();
