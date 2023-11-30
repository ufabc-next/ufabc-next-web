import { jsvEslintConfig } from '@joabesv/eslint-config';

export default jsvEslintConfig(
  {
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
      },
      typescript: {
        'ts/consistent-type-definitions': ['off', 'type'],
        'ts/consistent-type-imports': [
          'error',
          { fixStyle: 'inline-type-imports' },
        ],
      },
    },
  },
  { files: ['**/*.tsx'], react: true },
);
