import Axios from 'axios';
import JwtDecode from 'jwt-decode';

interface Device {
  _id: string;
  deviceId: string;
  token: string;
  phone: string;
}

interface User {
  _id: string;
  oauth: {
    email: string;
    emailFacebook?: string;
    emailGoogle?: string;
    facebook?: string;
    google?: string;
    picture?: string;
  };
  confirmed: boolean;
  email: string;
  ra: number;
  createdAt: Date;
  devices?: Array<Device>;
}

class Auth {
  user?: User | null;
  _listeners: Array<(any: any) => void> | any; // receive functions in 'router/index.js' on original project
  token?: string | null; // I don't know what kind of it here. I need to align with the backend

  constructor(
    user?: User | null,
    _listeners?: Array<() => void>,
    token?: string | null,
  ) {
    this.user = user;
    this._listeners = _listeners;
    this.token = token;

    // -------------------------------------------
    // O próprio vue já é reativo. Definir isso com ref() ou deixar padrão?
    // Fonte: https://stackoverflow.com/questions/41791193/vuejs-reactive-binding-for-a-plugin-how-to
    // comentei pq vue.util não existe no vue 3
    // mas não sei o impacto disso no resto do projeto

    // Vue.util.defineReactive(this, 'user', null);
    // Vue.util.defineReactive(this, 'token', null);
    // -------------------------------------------

    this.loadFromLocalStorage();
  }

  /**
   * system logout via token
   */
  logOut() {
    this.setToken(null);
  }

  /**
   * get auth status
   * @returns boolean
   */
  isLoggedIn() {
    if (this.user) {
      window &&
        window.opener &&
        window.opener.parent &&
        window.opener.parent.postMessage(this.token, '*');
    }
    return !!this.user;
  }

  /**
   * set auth token
   * @return - undefined if token pre-setted
   */
  setToken(token: string | null) {
    if (this.token === token) {
      return;
    }

    // I modified this code snippet to be able to infer types more assertively.
    // Please compare with the original code in services/auth.js
    // in the master branch of the project
    if (token) {
      window &&
        window.opener &&
        window.opener.parent &&
        window.opener.parent.postMessage(token, '*');

      localStorage.setItem('token', token);
      this.user = JwtDecode(token);
      this.token = token;
    } else {
      localStorage.removeItem('token');
      this.token = null;
      this.user = null;
    }

    for (const k in this._listeners) {
      const listener = this._listeners[k];
      listener(this.user);
    }
  }

  /**
   * load token saved in localstorage (???) i dont understand this function
   *
   */
  loadFromLocalStorage() {
    const token = localStorage.getItem('token') || null;
    this.setToken(token);
  }

  /**
   * function used in 'router/index.js' on original project, but i dont understand the reason.
   *
   */
  onAuthStateChanged(callback: <TReturn>(user?: User | null) => TReturn) {
    /**
     * I'm having a problem with this line of code below.
     * For some reason TS is pulling the "number|string|symbol"
     * type from somewhere I still don't understand.
     */

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (!(callback in this._listeners)) this._listeners.push(callback);

    if (this.user !== undefined) setTimeout(() => callback(this.user), 0);
  }

  /**
   * AJAX call to forgot
   * @param email - user email
   * @returns - AJAX request (axios)
   */
  async forgot(email: string) {
    return await Axios.get('/auth/reset', {
      params: {
        email: email,
      },
    });
  }

  /**
   * AJAX call to reset
   * @param user - i dont know what is
   * @returns - AJAX request (axios)
   */
  async reset(user: User) {
    return await Axios.post('/auth/reset', user);
  }

  /**
   * session device for mobile
   */
  async addDevice() {
    const firebaseToken = localStorage.getItem('firebaseToken') || null;

    // "window.device.uuid" returns error:
    // Property 'device' does not exist on type 'Window & typeof globalThis'.ts(2339)

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const deviceId = window.device.uuid;

    if (this.isLoggedIn() && firebaseToken && deviceId) {
      await Axios.post('/users/me/devices', {
        token: firebaseToken,
        deviceId: deviceId,
      });
    }
  }

  async removeDevice() {
    // "window.device.uuid" returns error:
    // Property 'device' does not exist on type 'Window & typeof globalThis'.ts(2339)

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const deviceId = window.device.uuid;

    if (deviceId) {
      return await Axios.delete(`/users/me/devices/${deviceId}`);
    }
  }
}

/**
 * When I got here, I had to put all the attributes I set in the constructor as optional
 * because TS asks for the required arguments.
 * I need help with this module.
 */
// const teste = new Auth();
// teste.user?.createdAt
export default new Auth();
