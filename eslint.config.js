import baseConfig from './packages/eslint-config/base';

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
