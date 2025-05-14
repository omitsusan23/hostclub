// jest.setup.cjs

/**
 * Setup script for Jest environment
 * Polyfill TextEncoder/TextDecoder for JSDOM
 */
const { TextEncoder, TextDecoder } = require('util');

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;