// eslint.config.cjs
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// 既存の .eslintrc.cjs が CommonJS で書かれている設定をそのまま流用
const legacyConfig = require('./.eslintrc.cjs');

export default legacyConfig;
