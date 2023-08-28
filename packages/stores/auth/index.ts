import { persist } from 'zustand/middleware';
import { createStore } from 'zustand/vanilla';

type OAuth = {
  email: string;
  google: string;
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

export type User = {
  _id: string;
  oauth: OAuth;
  confirmed: boolean;
  email: string;
  ra: number;
  createdAt: string;
  devices: Device[];
};

type UseAuthStore = {
  user: User | null;
  token: string | null;
  isLoggedIn: () => boolean;
  authenticate: (token: string) => void;
  logOut: () => void;
};

const useAuthStore = createStore(
  persist<UseAuthStore>(
    (set, get) => ({
      user: null,
      token: null,
      isLoggedIn: () => !!get().user,
      authenticate: (token) => {
        if (token) {
          const user = JSON.parse(atob(token.split('.')[1])) as User;
          set({ token, user });
        }
      },
      logOut: () => localStorage.clear(),
    }),
    {
      name: 'auth-storage',
    },
  ),
);

export default useAuthStore;
