/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
    'no-case-declarations': 'off',
    'no-empty-pattern': 'off',
    'react-hooks/exhaustive-deps': 'warn',
    'react-refresh/only-export-components': 'off',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
}
