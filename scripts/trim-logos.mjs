import { promises as fs } from 'node:fs';
import path from 'node:path';
import { glob } from 'glob';     // ★ named import に変更
import sharp from 'sharp';

/** ── 設定 ───────────────────────────── */
const SOURCE_PATTERN  = 'public/raw-logos/**/*.png';
const DEST_DIR        = 'public/images';
const MAX_SIDE        = 1500;   // 短辺最大
const TRIM_TOLERANCE  = 10;     // 透明余白を 10px 残す
/** ──────────────────────────────────── */

function destPath(src) {
  const rel = path.relative('public/raw-logos', src);
  return path.join(DEST_DIR, rel);
}

async function processOne(file) {
  const out = destPath(file);
  await fs.mkdir(path.dirname(out), { recursive: true });

  await sharp(file)
    .trim(TRIM_TOLERANCE)
    .resize({
      width: MAX_SIDE,
      height: MAX_SIDE,
      fit: 'inside',
      withoutEnlargement: true,
    })
    .png({ compressionLevel: 9 })
    .toFile(out);

  console.log('✔', path.relative('.', out));
}

/* ── 実行 ───────────────────────────── */
const files = await glob(SOURCE_PATTERN);
if (files.length === 0) {
  console.log('No raw logos found at', SOURCE_PATTERN);
  process.exit(0);
}
await Promise.all(files.map(processOne));
