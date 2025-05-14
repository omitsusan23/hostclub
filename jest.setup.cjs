// jest.setup.cjs

/**
 * Setup script for Jest environment
 * 1) Polyfill TextEncoder/TextDecoder for JSDOM
 * 2) Load @testing-library/jest-dom matchers
 */
const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// 追加：jest-dom のカスタムマッチャーを登録
require('@testing-library/jest-dom');
