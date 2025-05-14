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
  // JSDOM の TextEncoder/TextDecoder ポリフィルを読み込む
  setupFiles: ['<rootDir>/jest.setup.cjs'],
  // @testing-library/jest-dom のマッチャーを読み込む
  setupFilesAfterEnv: ['<rootDir>/jest.setup.cjs']
};
