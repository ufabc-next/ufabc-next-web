/** @type {import('jest').Config} */
const config = {
  preset: '@vue/cli-plugin-unit-jest/presets/typescript-and-babel',
  testMatch: ['<rootDir>/src/**/*.spec.ts'],
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.{ts,vue}'],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    'd.ts',
    '.spec.ts',
    'components/*/index.ts',
  ],
  coverageReporters: ['lcov'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};

module.exports = config;
