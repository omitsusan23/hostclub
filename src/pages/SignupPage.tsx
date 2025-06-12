import React, { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

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
  const [password, setPassword] = useState('')
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
        .single()

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

    const { data: signupData, error: signupError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: name,
          role: inviteInfo.role,
          store_id: inviteInfo.store_id,
        },
      },
    })

    if (signupError || !signupData.user) {
      setError(signupError?.message || '登録に失敗しました')
      setLoading(false)
      return
    }

    const userId = signupData.user.id
    let photoUrl = null

    if (photoFile) {
      const fileExt = photoFile.name.split('.').pop()
      const filePath = `${inviteInfo.store_id}/${userId}.${fileExt}`

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
        photoUrl = urlData.publicUrl
      }
    }

    const { error: updateError } = await supabase
      .from('casts')
      .update({
        email,       // ← email 保存
        photo_url: photoUrl, // ← 写真URL保存（任意）
      })
      .eq('invite_token', token)

    if (updateError) {
      console.error('登録情報の保存に失敗:', updateError)
    }

    alert('登録が完了しました。ログインしてください。')
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
            <label className="block mb-1">パスワード</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
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
