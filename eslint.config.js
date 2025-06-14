import baseConfig from './packages/eslint-config/base.js';

export default [
  ...baseConfig,
  {
    languageOptions: {
      globals: {
        node: true,
      },
    },
  },
];
