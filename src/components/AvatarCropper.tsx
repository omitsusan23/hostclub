import React, { useCallback, useState } from 'react'
import Cropper from 'react-easy-crop'
import { getCroppedImg } from '../lib/cropImage'

interface AvatarCropperProps {
  image: string
  onCancel: () => void
  onComplete: (croppedFile: File) => void
}

const AvatarCropper: React.FC<AvatarCropperProps> = ({ image, onCancel, onComplete }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const onCropComplete = useCallback((_croppedArea: any, croppedPixels: any) => {
    setCroppedAreaPixels(croppedPixels)
  }, [])

  const handleConfirm = async () => {
    try {
      const croppedFile = await getCroppedImg(image, croppedAreaPixels, zoom)
      const preview = URL.createObjectURL(croppedFile)
      setPreviewUrl(preview)

      // 実際のアップロード処理は親コンポーネントに任せる
      onComplete(croppedFile)
    } catch (e) {
      console.error('画像の切り抜きに失敗しました:', e)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center">
      <div className="bg-white p-4 rounded shadow-lg w-[90vw] max-w-md">
        <div className="relative w-full h-64 bg-gray-100">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>

        {/* ▼ 切り抜きプレビュー */}
        {previewUrl && (
          <div className="flex justify-center mt-4">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-24 h-24 rounded-full object-cover border"
            />
          </div>
        )}

        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onCancel} className="px-4 py-2 bg-gray-300 rounded">キャンセル</button>
          <button onClick={handleConfirm} className="px-4 py-2 bg-blue-500 text-white rounded">決定</button>
        </div>
      </div>
    </div>
  )
}

export default AvatarCropper
