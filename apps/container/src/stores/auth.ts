import { User } from '@ufabc-next/types';
import { defineStore } from 'pinia';

type AuthState = {
  user: User | null;
  token: string | null;
};

const decodeJwtPayload = (token: string): User | null => {
  const [, payload = ''] = token.split('.');
  if (!payload) return null;
  const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=');
  try {
    return JSON.parse(atob(padded)) as User;
  } catch {
    return null;
  }
};

export const useAuthStore = defineStore('auth', {
  persist: true,
  state: (): AuthState => {
    return {
      user: null,
      token: null,
    };
  },
  getters: {
    isLoggedIn: (state): boolean => Boolean(state.user),
  },
  actions: {
    authenticate(token: string) {
      if (token) {
        const user = decodeJwtPayload(token);
        this.token = token;
        if (user) this.user = user;
      }
    },
    logOut(redirect = true) {
      localStorage.removeItem('auth');
      this.user = null;
      this.token = null;

      if (redirect) window.location.href = '/';
    },
  },
});
