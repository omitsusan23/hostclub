export const getCroppedImg = (
  imageSrc: string,
  croppedAreaPixels: { x: number; y: number; width: number; height: number },
  zoom: number,
  fileName = 'cropped.jpg'
): Promise<File> => {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.src = imageSrc
    image.crossOrigin = 'anonymous'

    image.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')

      if (!ctx) {
        reject(new Error('Canvasコンテキスト取得に失敗しました'))
        return
      }

      const size = 300 // 出力サイズ(px)
      canvas.width = size
      canvas.height = size

      // ◯ 円形マスク
      ctx.beginPath()
      ctx.arc(size / 2, size / 2, size / 2, 0, 2 * Math.PI)
      ctx.closePath()
      ctx.clip()

      ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        size,
        size
      )

      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Blobの生成に失敗しました'))
          return
        }

        resolve(new File([blob], fileName, { type: 'image/jpeg' }))
      }, 'image/jpeg')
    }

    image.onerror = () => {
      reject(new Error('画像の読み込みに失敗しました'))
    }
  })
}
