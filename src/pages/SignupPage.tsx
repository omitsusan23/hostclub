import React, { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

export default function SignupPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token')

  const [inviteInfo, setInviteInfo] = useState<{
    store_id: string
    role: 'cast' | 'operator'
  } | null>(null)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('') // ※現時点では使用されません（将来の認証方式変更に備えて残してもOK）
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!token) return
    const fetchInvite = async () => {
      const { data, error } = await supabase
        .from('casts')
        .select('store_id, role')
        .eq('invite_token', token)
        .maybeSingle()

      if (error || !data) {
        setError('有効な招待が見つかりません')
      } else {
        setInviteInfo(data)
      }
    }

    fetchInvite()
  }, [token])

  const handleSignup = async () => {
    if (!inviteInfo) return
    setLoading(true)
    setError('')

    // ① 対象キャスト行の取得（id を取得するため）
    const { data: castData, error: castError } = await supabase
      .from('casts')
      .select('id')
      .eq('invite_token', token)
      .maybeSingle()

    if (castError || !castData?.id) {
      setError('キャスト情報が見つかりません')
      setLoading(false)
      return
    }

    const castId = castData.id
    let photoUrl = null

    // ② 写真アップロード（任意）
    if (photoFile) {
      const fileExt = photoFile.name.split('.').pop()
      const filePath = `${inviteInfo.store_id}/${castId}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('cast-photos')
        .upload(filePath, photoFile, {
          cacheControl: '3600',
          upsert: true,
        })

      if (!uploadError) {
        const { data: urlData } = supabase.storage
          .from('cast-photos')
          .getPublicUrl(filePath)
        photoUrl = urlData?.publicUrl || null
      } else {
        console.error('アップロード失敗:', uploadError)
      }
    }

    // ③ castsテーブルにUPDATE（display_name, email, photo_url）
    const { error: updateError } = await supabase
      .from('casts')
      .update({
        display_name: name,
        email,
        photo_url: photoUrl,
      })
      .eq('id', castId)

    if (updateError) {
      console.error('保存エラー:', updateError)
      setError('プロフィールの保存に失敗しました')
      setLoading(false)
      return
    }

    alert('登録が完了しました。ログイン認証は別途実装予定です。')
    navigate('/login')
    setLoading(false)
  }

  if (!token) {
    return <p className="p-4 text-red-600">トークンが見つかりません</p>
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4 text-center">キャスト登録</h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {!inviteInfo ? (
        <p className="text-gray-700">招待情報を確認中...</p>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSignup()
          }}
          className="space-y-4"
        >
          <div>
            <label className="block mb-1">名前</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div>
            <label className="block mb-1">メールアドレス</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div>
            <label className="block mb-1">パスワード（現在は未使用）</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div>
            <label className="block mb-1">宣材写真（任意）</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
              className="w-full"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {loading ? '登録中...' : '登録する'}
          </button>
        </form>
      )}
    </div>
  )
}
