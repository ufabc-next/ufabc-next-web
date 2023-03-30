/** @type {import('jest').Config} */
const config = {
  preset: '@vue/cli-plugin-unit-jest/presets/typescript-and-babel',
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.{js,vue}'],
  coveragePathIgnorePatterns: ['/node_modules/'],
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
