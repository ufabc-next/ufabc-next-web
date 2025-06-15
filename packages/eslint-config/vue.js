import baseConfig from './base.js';
import vuePlugin from 'eslint-plugin-vue';
import vueEslintParser from 'vue-eslint-parser';
import tseslint from 'typescript-eslint';

export default [
  // Base configuration for all files
  ...baseConfig,
  
  // Vue-specific configuration
  ...vuePlugin.configs['flat/recommended'],
  
  // TypeScript configuration for Vue files
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueEslintParser,
      parserOptions: {
        parser: tseslint.parser,
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
        extraFileExtensions: ['.vue'],
      },
    },
  },
  
  // Enhanced rules for Vue files
  {
    files: ['**/*.vue'],
    rules: {
      // Vue-specific rules
      'vue/no-unused-vars': 'error',
      'vue/multi-word-component-names': 'off',
      'vue/require-default-prop': 'off',
      'vue/require-explicit-emits': 'error',
      'vue/no-setup-props-destructure': 'off',
      'vue/component-definition-name-casing': ['error', 'PascalCase'],
      'vue/component-name-in-template-casing': ['error', 'PascalCase'],
      'vue/define-macros-order': 'error',
      'vue/no-undef-components': 'error',
      'vue/no-unused-components': 'error',
      'vue/no-unused-refs': 'error',
      'vue/prefer-import-from-vue': 'error',
      'vue/prefer-separate-static-class': 'error',
      'vue/prefer-true-attribute-shorthand': 'error',
      'vue/require-macro-variable-name': 'error',
      
      // TypeScript in Vue rules
      '@typescript-eslint/no-unused-vars': 'off', // handled by vue/no-unused-vars
    },
  },
  
  // Test files configuration
  {
    files: [
      '**/__tests__/*.{j,t}s?(x)', 
      '**/tests/unit/**/*.spec.{j,t}s?(x)', 
      '**/*.test.{j,t}s?(x)',
      '**/test-utils.ts',
      '**/setup-tests.ts'
    ],
    rules: {
      'no-console': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
];
