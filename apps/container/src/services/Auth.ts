import axios from 'axios';
import { ref } from 'vue';
import JwtDecode from 'jwt-decode';

import type { User } from '@/types';

class Auth {
  user = ref<User | null>(null);
  token = ref<string | null>(null);
  private _listeners: ((user: User) => void)[] = [];

  constructor() {
    this.loadFromLocalStorage();
  }

  logOut() {
    this.setToken(null);
  }

  isLoggedIn() {
    if (this.user) {
      window?.opener?.parent?.postMessage(this.token.value, '*');
    }
    return !!this.user;
  }

  setToken(token: string | null) {
    if (this.token.value === token) {
      return;
    }

    try {
      if (token) {
        window?.opener?.parent?.postMessage(token, '*');
      }
      if (!token) {
        localStorage.removeItem('token');
        this.token.value = null;
        this.user.value = null;
        return;
      }
      localStorage.setItem('token', token);
      this.user.value = JwtDecode(token);
      this.token.value = token;
    } catch (e) {
      localStorage.removeItem('token');
      this.token.value = null;
      this.user.value = null;
    }

    for (const listener of this._listeners) {
      this.user.value && listener(this.user.value);
    }
  }

  loadFromLocalStorage() {
    const token = localStorage.getItem('token') || null;
    this.setToken(token);
  }

  onAuthStateChanged(callback: (user: unknown) => void) {
    if (!this._listeners.includes(callback)) {
      this._listeners.push(callback);
    }

    if (this.user.value !== undefined) {
      setTimeout(() => callback(this.user.value), 0);
    }
  }

  async forgot(email: string) {
    return await axios.get('/auth/reset', {
      params: {
        email: email,
      },
    });
  }

  async reset(user: User) {
    return await axios.post('/auth/reset', user);
  }

  async addDevice() {
    const firebaseToken = localStorage.getItem('firebaseToken') || null;
    const deviceId = window.device?.uuid;

    if (this.isLoggedIn() && firebaseToken && deviceId) {
      await axios.post('/users/me/devices', {
        token: firebaseToken,
        deviceId: deviceId,
      });
    }
  }

  async removeDevice() {
    const deviceId = window.device?.uuid;

    if (deviceId) {
      return await axios.delete(`/users/me/devices/${deviceId}`);
    }
  }
}

export default new Auth();
