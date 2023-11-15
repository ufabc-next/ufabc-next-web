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
      exclude: [
        '**/node_modules/**',
        '**/test-utils.ts',
        '**/mocks/**',
        '.eslintrc.js',
        'mf.config.js',
        'remotes.hosts.local.js',
        'remotes.hosts.production.js',
        'remotes.hosts.staging.js',
        'vue.config.js',
        'src/bootstrap.ts',
        'src/main.ts',
        '**/*.d.ts',
      ],
      all: true,
      reportOnFailure: true,
      thresholdAutoUpdate: true,
      statements: 50,
      branches: 56.55,
      functions: 50,
      lines: 50,
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
