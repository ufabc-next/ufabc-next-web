/** @type {import('jest').Config} */
const config = {
  preset: '@vue/cli-plugin-unit-jest/presets/typescript-and-babel',
  testMatch: ['<rootDir>/src/**/*.test.ts'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  transform: { '^.*\\.js$': 'babel-jest' },
  transformIgnorePatterns: ['node_modules/(?!axios)'],
  moduleNameMapper: {
    '^vuetify/lib': 'vuetify/es5/entry-lib',
    '^vuetify/lib/(.*)': 'vuetify/es5/$1',
  },
  collectCoverage: true,
  collectCoverageFrom: [
    '<rootDir>/src/**/*.{ts,vue}',
    '!<rootDir>/src/mocks/*.ts',
  ],
  coverageReporters: ['text', 'html'],
};

module.exports = config;
