import { promises as fs } from 'node:fs';
import path from 'node:path';
import { glob } from 'glob';
import sharp from 'sharp';

/* ───────── 設定 ───────── */
const SRC_PATTERN = 'public/raw-logos/**/*.png'; // 余白ありロゴ置き場
const DEST_DIR    = 'public/images';             // 出力先
const MAX_SIDE    = 1500;                        // 最長辺
const PADDING     = 10;                          // 付け直す透過余白(px)
/* ──────────────────────── */

function destPath(src) {
  const rel = path.relative('public/raw-logos', src);
  return path.join(DEST_DIR, rel);
}

async function processOne(file) {
  const out = destPath(file);
  await fs.mkdir(path.dirname(out), { recursive: true });

  await sharp(file)
    .trim()                                 // ← 引数なしで完全トリム
    .extend({                               // 余白を PADDING px 付け直す
      top: PADDING,
      bottom: PADDING,
      left: PADDING,
      right: PADDING,
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    })
    .resize({
      width : MAX_SIDE,
      height: MAX_SIDE,
      fit   : 'inside',
      withoutEnlargement: true
    })
    .png({ compressionLevel: 9 })
    .toFile(out);

  console.log('✔', path.relative('.', out));
}

const files = await glob(SRC_PATTERN);
if (files.length === 0) {
  console.log('No raw logos found at', SRC_PATTERN);
  process.exit();
}

await Promise.all(files.map(processOne));
