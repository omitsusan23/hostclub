// jest.config.cjs

/**
 * Jest configuration (CommonJS)
 */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest'
  },
  // グローバルセットアップファイル（必要なら）
  setupFiles: ['<rootDir>/jest.setup.cjs'],
  // テスト環境セットアップ（@testing-library/jest-dom を含む）
  setupFilesAfterEnv: ['<rootDir>/jest.setup.cjs']
};
