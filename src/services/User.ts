import Axios from 'axios';
import Auth from './Auth';

class User {
  async completeSignup(params = {}) {
    return await Axios.put('/users/complete', params);
  }

  async confirmSignup(params = {}) {
    // return await Axios.post('/users/me/confirm', params)
    const token = await Axios.post('/account/confirm', params);

    //---------------------------------
    // problem with "window.device" again
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (window.device) {
      await Auth.addDevice();
    }
    // -----------------------------------

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

  async relationships(breadth: number, depth: number) {
    return await Axios.get('/users/me/relationships', {
      params: {
        breadth: breadth,
        depth: depth,
      },
    });
  }
}

export default new User();
