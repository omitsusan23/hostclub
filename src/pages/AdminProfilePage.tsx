// src/pages/AdminProfilePage.tsx
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { useAppContext } from '../context/AppContext'
import AvatarCropper from '../components/AvatarCropper'

const AdminProfilePage = () => {
  const navigate = useNavigate()
  const {
    state: { session },
  } = useAppContext()

  const [displayName, setDisplayName] = useState('')
  const [photoUrl, setPhotoUrl] = useState('')
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [showCropper, setShowCropper] = useState(false)

  useEffect(() => {
    if (!session?.user) {
      navigate('/login')
    }
  }, [session, navigate])

  const handleSave = async () => {
    setError('')
    setSuccess('')

    const authUserId = session?.user.id
    const storeId = session?.user.user_metadata?.store_id

    if (!authUserId || !storeId) {
      setError('ユーザー情報の取得に失敗しました')
      return
    }

    const { data: existingAdmin, error: selectError } = await supabase
      .from('admins')
      .select('id')
      .eq('auth_user_id', authUserId)
      .maybeSingle()

    if (selectError) {
      console.error('🔍 取得エラー:', selectError)
      setError('プロフィール情報の確認に失敗しました')
      return
    }

    let dbError = null

    if (existingAdmin) {
      const { error } = await supabase
        .from('admins')
        .update({
          display_name: displayName,
          photo_url: photoUrl || null,
        })
        .eq('auth_user_id', authUserId)
      dbError = error
    } else {
      const { error } = await supabase
        .from('admins')
        .insert({
          auth_user_id: authUserId,
          store_id: storeId,
          display_name: displayName,
          photo_url: photoUrl || null,
        })
      dbError = error
    }

    if (dbError) {
      console.error('🛑 登録エラー:', dbError)
      setError('登録に失敗しました')
    } else {
      setSuccess('登録が完了しました')
      setTimeout(() => navigate('/tables'), 1500)
    }
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return
    const file = e.target.files[0]
    const reader = new FileReader()

    reader.onload = () => {
      setImageSrc(reader.result as string)
      setShowCropper(true)
    }
    reader.readAsDataURL(file)
  }

  const handleCropComplete = async (croppedFile: File) => {
    try {
      setUploading(true)
      const storeId = session?.user.user_metadata.store_id
      const userId = session?.user.id
      const filePath = `${storeId}/admin-icons/${userId}.jpg`

      const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, croppedFile, {
        cacheControl: '3600',
        upsert: true,
        contentType: 'image/jpeg',
      })

      if (uploadError) throw uploadError

      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath)
      setPhotoUrl(data.publicUrl)
      setShowCropper(false)
    } catch (error: any) {
      console.error('Upload Error:', error.message)
      setError('画像アップロードに失敗しました')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <h1 className="text-2xl font-bold mb-4">プロフィール登録</h1>
      <p className="text-gray-600 mb-4">サイト内で使用する源氏名とアイコン画像を登録してください。</p>

      <input
        type="text"
        placeholder="源氏名"
        value={displayName}
        onChange={(e) => setDisplayName(e.target.value)}
        className="border px-3 py-2 mb-2 w-64 rounded"
      />

      <input
        type="file"
        accept="image/*"
        onChange={handleUpload}
        className="mb-4"
      />

      {photoUrl && <img src={photoUrl} alt="プロフィール画像" className="w-24 h-24 rounded-full mb-4 object-cover" />}

      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
      {success && <p className="text-green-600 text-sm mb-2">{success}</p>}

      <button
        onClick={handleSave}
        disabled={uploading}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
      >
        {uploading ? 'アップロード中...' : '登録する'}
      </button>

      {showCropper && imageSrc && (
        <AvatarCropper
          image={imageSrc} // ✅ 修正済み
          onComplete={handleCropComplete}
          onCancel={() => setShowCropper(false)}
        />
      )}
    </div>
  )
}

export default AdminProfilePage
