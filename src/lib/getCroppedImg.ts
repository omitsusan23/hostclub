export const getCroppedImg = (
  imageSrc: string,
  crop: { x: number; y: number; width: number; height: number },
  zoom: number,
  fileName = 'cropped.jpg'
): Promise<File> => {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.crossOrigin = 'anonymous'

    image.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')

      if (!ctx) return reject(new Error('2Dコンテキストが取得できません'))
      if (crop.width < 1 || crop.height < 1) {
        return reject(new Error('切り抜き範囲が不正です'))
      }

      const size = 300
      canvas.width = size
      canvas.height = size

      ctx.drawImage(
        image,
        crop.x, crop.y, crop.width, crop.height,
        0, 0, size, size
      )

      // 丸型マスク適用
      ctx.globalCompositeOperation = 'destination-in'
      ctx.beginPath()
      ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2)
      ctx.fill()

      canvas.toBlob((blob) => {
        if (!blob) return reject(new Error('Blob生成に失敗しました'))
        resolve(new File([blob], fileName, { type: 'image/jpeg' }))
      }, 'image/jpeg')
    }

    image.onerror = () => reject(new Error('画像の読み込みに失敗しました'))
    image.src = imageSrc // 必ず最後に設定
  })
}
