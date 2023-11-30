import { jsvEslintConfig } from '@joabesv/eslint-config';

export default jsvEslintConfig({
  react: true,
  vue: true,
  typescript: true,
  javascript: true,
  rules: {
    'unicorn/filename-case': ['off'],
    'ts/consistent-type-definitions': ['off', 'type'],
    'ts/consistent-type-imports': [
      'error',
      { fixStyle: 'inline-type-imports' },
    ],
  },
});
