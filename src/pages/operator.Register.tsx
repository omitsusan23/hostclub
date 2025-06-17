import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

export default function OperatorRegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [validToken, setValidToken] = useState(false)
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const [storeId, setStoreId] = useState('')

  useEffect(() => {
    const checkInviteToken = async () => {
      if (!token) {
        setError('招待トークンが見つかりません')
        return
      }

      const { data, error } = await supabase
        .from('operators')
        .select('store_id')
        .eq('invite_token', token)
        .eq('is_active', true)
        .maybeSingle()

      if (error || !data) {
        setError('この招待リンクは無効です')
        return
      }

      setStoreId(data.store_id)
      setValidToken(true)
    }

    checkInviteToken()
  }, [token])

  const handleRegister = async () => {
    if (!storeId || !token) {
      setError('招待情報が不正です')
      return
    }

    setLoading(true)
    setError('')

    try {
      const { data: existingOperator, error: opError } = await supabase
        .from('operators')
        .select('id, auth_user_id')
        .eq('email', email)
        .eq('store_id', storeId)
        .maybeSingle()

      if (opError) throw opError
      if (existingOperator) {
        // 既存のデータがあれば、auth_user_id が null の場合に更新を行う
        if (!existingOperator.auth_user_id) {
          // 既存のデータに auth_user_id を更新
          const { error: emailUpdateError } = await supabase
            .from('operators')
            .update({ email, auth_user_id: null }) // auth_user_idを更新
            .eq('invite_token', token)
            .eq('store_id', storeId)

          if (emailUpdateError) throw emailUpdateError
        }
      }

      const baseDomain = import.meta.env.VITE_BASE_DOMAIN ?? 'hostclub-tableststus.com'
      const redirectUrl = `https://${storeId}.${baseDomain}/auth/callback`

      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            store_id: storeId,
            role: 'operator',
          },
        },
      })

      if (signUpError) {
        setError(signUpError.message)
        setLoading(false)
        return
      }

      // ✅ 招待トークンの無効化
      const { error: updateError } = await supabase
        .from('operators')
        .update({
          is_active: false,
          invite_token: null,
        })
        .eq('invite_token', token)

      if (updateError) throw updateError

      alert('確認メールを送信しました。メールのリンクをクリックして登録を完了してください。')
      navigate('/login')
    } catch (e: any) {
      console.error(e)
      setError('登録中にエラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  if (!validToken) {
    return (
      <div className="p-6 max-w-md mx-auto text-center">
        <h1 className="text-xl font-bold mb-2">オペレーター登録</h1>
        <p className="text-red-500">{error || 'トークンを検証中...'}</p>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4 text-center">オペレーター登録</h1>
      {error && <p className="text-red-600 mb-2 text-center">{error}</p>}

      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleRegister()
        }}
        className="space-y-4"
      >
        <div>
          <label className="block mb-1">メールアドレス</label>
          <input
            type="email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block mb-1">パスワード</label>
          <input
            type="password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? '登録中...' : '確認メールを送信'}
        </button>
      </form>
    </div>
  )
}
