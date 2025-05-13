// eslint.config.mjs
import tsParser from '@typescript-eslint/parser'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import reactPlugin from 'eslint-plugin-react'
import hooksPlugin from 'eslint-plugin-react-hooks'

/** @type {import('eslint').ESLint.FlatConfig[]} */
export default [
  {
    // 対象ファイル
    files: ['**/*.{js,jsx,ts,tsx}'],
    // TypeScript + JSX を parser に設定
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
    },
    // 推奨設定をベースに拡張
    extends: [
      'eslint:recommended',
      'plugin:react/recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:react-hooks/recommended',
    ],
    // 必要なプラグイン
    plugins: {
      react: reactPlugin,
      '@typescript-eslint': tsPlugin,
      'react-hooks': hooksPlugin,
    },
    // 追加・上書きルール
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'no-case-declarations': 'off',
      'no-empty-pattern': 'off',
      'react-hooks/exhaustive-deps': 'warn',
      'react-refresh/only-export-components': 'off',
    },
    settings: {
      react: { version: 'detect' },
    },
  },
]
