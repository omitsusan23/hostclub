// eslint.config.mjs
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// 既存の .eslintrc.cjs をそのまま流用
const legacyConfig = require('./.eslintrc.cjs');

export default legacyConfig;
