import { promises as fs } from 'node:fs';
import path from 'node:path';
import glob from 'glob';
import sharp from 'sharp';

/** ---------------- 設定 ---------------- */
const SOURCE_PATTERN = 'public/raw-logos/**/*.png';   // 余白ありロゴ置き場
const DEST_DIR       = 'public/images';               // 出力先
const MAX_SIDE       = 1500;                          // 短辺をここまで縮小
const TRIM_TOLERANCE = 10;                            // 透明余白を 10px 残す
/** -------------------------------------- */

function destPath(src) {
  // 例: public/raw-logos/ruberu/logo.png → public/images/ruberu/logo.png
  const rel = path.relative('public/raw-logos', src);
  return path.join(DEST_DIR, rel);
}

async function processOne(file) {
  const out = destPath(file);
  await fs.mkdir(path.dirname(out), { recursive: true });

  await sharp(file)
    .trim(TRIM_TOLERANCE)      // 透明余白カット
    .resize({                  // 最大サイズを制限
      width : MAX_SIDE,
      height: MAX_SIDE,
      fit   : 'inside',
      withoutEnlargement: true,
    })
    .png({ compressionLevel: 9 })
    .toFile(out);

  console.log('✔ trimmed →', out);
}

glob(SOURCE_PATTERN, async (err, files) => {
  if (err) throw err;
  await Promise.all(files.map(processOne));
});
