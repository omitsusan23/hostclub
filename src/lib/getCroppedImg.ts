// lib/getCroppedImg.ts
export const getCroppedImg = (
  image: HTMLImageElement,
  crop: { x: number; y: number },
  zoom: number,
  fileName = 'cropped.jpg'
): Promise<File> => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) throw new Error('2Dコンテキストが取得できません');

  const outputSize = 300;
  canvas.width = outputSize;
  canvas.height = outputSize;

  const scale = zoom;
  const sx = crop.x;
  const sy = crop.y;
  const sw = image.naturalWidth / scale;
  const sh = image.naturalHeight / scale;

  ctx.drawImage(
    image,
    sx,
    sy,
    sw,
    sh,
    0,
    0,
    outputSize,
    outputSize
  );

  // 圓形マスク
  ctx.globalCompositeOperation = 'destination-in';
  ctx.beginPath();
  ctx.arc(outputSize / 2, outputSize / 2, outputSize / 2, 0, 2 * Math.PI);
  ctx.fill();

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('Blob生成に失敗しました'));
        return;
      }
      resolve(new File([blob], fileName, { type: 'image/jpeg' }));
    }, 'image/jpeg');
  });
};
