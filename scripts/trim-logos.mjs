/* scripts/trim-logos.mjs */
import { promises as fs } from 'node:fs';
import path from 'node:path';
import glob from 'glob';
import sharp from 'sharp';

const SOURCE_PATTERN  = 'public/raw-logos/**/*.png'; // 余白ありロゴ
const DEST_DIR        = 'public/images';             // 出力先
const MAX_SIDE        = 1500;                        // 最長辺
const TRIM_TOLERANCE  = 10;                          // 余白残し(px)

function destPath(src) {
  const rel = path.relative('public/raw-logos', src);
  return path.join(DEST_DIR, rel);
}

async function processOne(file) {
  const out = destPath(file);
  await fs.mkdir(path.dirname(out), { recursive: true });
  await sharp(file)
    .trim(TRIM_TOLERANCE)
    .resize({ width: MAX_SIDE, height: MAX_SIDE, fit: 'inside', withoutEnlargement: true })
    .png({ compressionLevel: 9 })
    .toFile(out);
  console.log('✔', path.relative('.', out));
}

glob(SOURCE_PATTERN, async (err, files) => {
  if (err) throw err;
  if (files.length === 0) {
    console.log('No raw logos found at', SOURCE_PATTERN);
    return;
  }
  await Promise.all(files.map(processOne));
});
