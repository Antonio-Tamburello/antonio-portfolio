import js from '@eslint/js';
import globals from 'globals';
import next from 'eslint-config-next';
import prettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

export default [
  js.configs.recommended,
  ...next(),
  prettierConfig,
  {
    plugins: { prettier },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node
      }
    },
    rules: {
      'prettier/prettier': 'error'
    }
  }
];
