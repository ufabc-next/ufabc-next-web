import Axios from 'axios'
import Vue from 'vue'
import Auth from './Auth'

class User {
  constructor(){}

  async completeSignup(params = {}) {
    return await Axios.put('/users/complete', params)
  }

  async confirmSignup(params = {}) {
    // return await Axios.post('/users/me/confirm', params)
    const token = await Axios.post('/account/confirm', params)

    if(device) {
      await Auth.addDevice({
        token: device.token,
        id: device.uuid
      })
    }

    return token
  }

  async resendEmail() {
    return await Axios.post('/users/me/resend')
  }

  async delete() {
    return await Axios.delete('/users/me/delete')
  }

  async info() {
    return await Axios.get('/users/info')
  }

  async relationships(breadth, depth) {
    return await Axios.get('/users/me/relationships', { params: {
      breadth: breadth,
      depth: depth
    }})
  }
}

export default (new User)