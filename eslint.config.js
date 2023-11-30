import { jsvEslintConfig } from '@joabesv/eslint-config';

export default jsvEslintConfig({
  react: true,
  vue: true,
  typescript: true,
  javascript: true,
  rules: {
    'unicorn/filename-case': ['off'],
  },
});
