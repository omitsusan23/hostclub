// .eslintrc.cjs
module.exports = {

  // 対象外にするパスを追加
  ignorePatterns: [
    'coverage/**',
    'postcss.config.js',
    'tailwind.config.js',
    'vite.config.ts',
    'server/**'
  ],

  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    ecmaVersion: 2021,
    sourceType: 'module',
    ecmaFeatures: { jsx: true },
  },
  env: {
    browser: true,
    es2021: true,
    jest: true,
  },
  plugins: ['react', '@typescript-eslint', 'react-hooks'],
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  settings: {
    react: { version: 'detect' },
  },
  rules: {
    // No case declarations エラー回避の例（必要に応じて調整）
    'no-case-declarations': 'off',
    // any の抑制（必要に応じて調整）
    '@typescript-eslint/no-explicit-any': 'warn',
  },
};
