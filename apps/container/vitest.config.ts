/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: 'jsdom',
    coverage: {
      reporter: ['text', 'html'],
      exclude: ['**/node_modules/**', '**/test-utils.ts', '**/mocks/**'],
    },
    alias: {
      '@': './src',
    },
    server: {
      deps: {
        inline: ['vuetify'],
      },
    },
    setupFiles: ['./setup-tests.ts'],
  },
});
