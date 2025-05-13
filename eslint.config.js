// eslint.config.js
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
    // any を一時的に許可
    '@typescript-eslint/no-explicit-any': 'off',
    // case 内での let/const を許可
    'no-case-declarations': 'off',
    // 空のオブジェクトパターンを許可
    'no-empty-pattern': 'off',
    // useEffect の依存警告を warning に
    'react-hooks/exhaustive-deps': 'warn',
    // Fast refresh 警告をオフ
    'react-refresh/only-export-components': 'off',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
