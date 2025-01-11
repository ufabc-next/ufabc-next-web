import { defineStore } from 'pinia';
import type { User } from 'types';

type UseAuthState = {
  user: User | null;
  token: string | null;
};

export const useAuth = defineStore('auth-storage', {
  persist: true,
  state: (): UseAuthState => ({
    user: null,
    token: null,
  }),
  getters: {
    isLoggedIn: (state) => !!state.user,
  },
  actions: {
    authenticate(token: string) {
      if (token) {
        const user = JSON.parse(atob(token.split('.')[1])) as User;
        this.user = user;
        this.token = token;
      }
    },
    logOut() {
      this.user = null;
      this.token = null;
      window.location.href = '/';
    },
  },
});
