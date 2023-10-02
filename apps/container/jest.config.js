/** @type {import('jest').Config} */

const config = {
  testMatch: ['<rootDir>/src/**/*.test.ts'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  transform: {
    '.+\\.(css|styl|less|sass|scss|jpg|jpeg|png|svg|gif|eot|otf|webp|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga|avif)$':
      'jest-transform-stub',
    '^.+\\.(ts|js|mjs)x?$': 'babel-jest',
    '^.+\\.vue$': '@vue/vue3-jest',
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^vuetify/components$':
      '<rootDir>/../../node_modules/vuetify/lib/components/index.mjs',
    '^vuetify/directives$':
      '<rootDir>/../../node_modules/vuetify/lib/directives/index.mjs',
  },
  // watchPlugins: [
  //   require.resolve('jest-watch-typeahead/filename'),
  //   require.resolve('jest-watch-typeahead/testname'),
  // ],
  testEnvironment: 'jsdom',
  testEnvironmentOptions: {
    url: 'http://localhost/',
    customExportConditions: ['node'],
  },
  moduleFileExtensions: ['js', 'json', 'vue', 'ts', 'mjs'],
  transformIgnorePatterns: [
    '<rootDir>/node_modules/(?!axios)',
    '<rootDir>/node_modules/(?!vuetify)',
  ],
  // collectCoverage: true,
  // collectCoverageFrom: ['<rootDir>/src/**/*.{ts}', '!<rootDir>/src/mocks/*.ts'],
  // coverageReporters: ['text', 'lcov'],
};

module.exports = config;
