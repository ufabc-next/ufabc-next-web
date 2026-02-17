import { createPinia, setActivePinia } from 'pinia';

import { useAuthStore } from '@/stores/auth';

const createJwt = (payload: Record<string, unknown>) => {
  const encodedPayload = btoa(JSON.stringify(payload))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
  return `header.${encodedPayload}.signature`;
};

describe('auth store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  test('sets token and user for valid jwt payload', () => {
    const authStore = useAuthStore();
    const token = createJwt({
      email: 'john@ufabc.edu.br',
      ra: 123456,
      confirmed: true,
      iat: Math.floor(Date.now() / 1000),
    });

    authStore.authenticate(token);

    expect(authStore.token).toBe(token);
    expect(authStore.user).toMatchObject({
      email: 'john@ufabc.edu.br',
      ra: 123456,
      confirmed: true,
    });
  });

  test('clears auth state for malformed jwt payload', () => {
    const authStore = useAuthStore();

    authStore.authenticate('aaa.bbb.ccc');

    expect(authStore.token).toBeNull();
    expect(authStore.user).toBeNull();
  });

  test('clears auth state for empty token', () => {
    const authStore = useAuthStore();
    const token = createJwt({
      email: 'john@ufabc.edu.br',
      ra: 123456,
      confirmed: true,
      iat: Math.floor(Date.now() / 1000),
    });

    authStore.authenticate(token);
    authStore.authenticate('');

    expect(authStore.token).toBeNull();
    expect(authStore.user).toBeNull();
  });

  test('clears stale user when invalid token is provided after login', () => {
    const authStore = useAuthStore();
    const token = createJwt({
      email: 'john@ufabc.edu.br',
      ra: 123456,
      confirmed: true,
      iat: Math.floor(Date.now() / 1000),
    });

    authStore.authenticate(token);
    authStore.authenticate('aaa.bbb.ccc');

    expect(authStore.token).toBeNull();
    expect(authStore.user).toBeNull();
  });
});
