import { promises as fs } from 'node:fs';
import path from 'node:path';
import { glob } from 'glob';
import sharp from 'sharp';

const SRC_PATTERN = 'public/raw-logos/**/*.png';
const DEST_DIR    = 'public/images';
const MAX_SIDE    = 1500;
const PADDING     = 10;          // 付け直す余白(px)

function destPath(src) {
  const rel = path.relative('public/raw-logos', src);
  return path.join(DEST_DIR, rel);
}

async function processOne(file) {
  const out = destPath(file);
  await fs.mkdir(path.dirname(out), { recursive: true });

  const img = sharp(file);
  const { width, height } = await img.metadata();

  await img
    .trim()                                 // 透明余白を完全に削除
    .extend({                               // 10px の透過余白を付け直す
      top: PADDING,
      bottom: PADDING,
      left: PADDING,
      right: PADDING,
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    })
    .resize({                               // サイズ制限
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
