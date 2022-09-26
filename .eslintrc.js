// @ts-check
'use strict';

module.exports = ((/** @type {import('eslint').Linter.Config} */ e) => e)({
  extends: './node_modules/@arthurka/eslint',
  rules: {
    '@typescript-eslint/no-empty-interface': 'warn',
    'react/prop-types': 'off',
    'react/jsx-indent': 'warn',
    'react/jsx-key': 'warn',
    'react/no-array-index-key': 'off',
    'react/jsx-closing-tag-location': 'off',
  },
});
