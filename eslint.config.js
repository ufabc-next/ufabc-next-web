import baseConfig from './packages/eslint-config-custom/base';

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
