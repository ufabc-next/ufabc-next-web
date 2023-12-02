import { jsvEslintConfig } from '@joabesv/eslint-config';

export default jsvEslintConfig({
  react: true,
  vue: true,
  typescript: true,
  javascript: true,
  prettier: true,
  rules: {
    'unicorn/filename-case': ['off'],
  },
  overrides: {
    vue: {
      'vue/html-self-closing': 'off',
      'vue/html-indent': 'off',
      'vue/html-closing-bracket-newline': 'off',
      'vue/operator-linebreak': 'off',
      'vue/block-tag-newline': 'off',
    },
    typescript: {
      'ts/consistent-type-definitions': ['off', 'type'],
      'ts/consistent-type-imports': [
        'error',
        { fixStyle: 'inline-type-imports' },
      ],
    },
    test: {
      'test/consistent-test-it': [
        'error',
        {
          fn: 'it',
          withinDescribe: 'test',
        },
      ],
    },
  },
});
