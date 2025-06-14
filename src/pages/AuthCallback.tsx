// src/pages/AuthCallback.tsx
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { useAppContext } from '../context/AppContext'

const AuthCallback = () => {
  const { dispatch } = useAppContext()
  const navigate = useNavigate()
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const handleAuth = async () => {
      // セッションを取得
      const { data, error } = await supabase.auth.getSession()

      if (error || !data.session) {
        console.error('❌ セッション取得失敗:', error)
        setErrorMessage('セッションの取得に失敗しました。ログインし直してください。')
        setTimeout(() => navigate('/login'), 3000)
        return
      }

      const session = data.session
      const meta = session.user.user_metadata
      const email = session.user.email ?? ''
      const role = meta?.role ?? ''
      const storeId = meta?.store_id ?? ''
      const currentSubdomain = window.location.hostname.split('.')[0]

      // ✅ store_id がURLサブドメインと一致しない場合、ブロック
      if (storeId !== currentSubdomain) {
        console.warn(`⛔ store_id(${storeId})とアクセス中サブドメイン(${currentSubdomain})が一致しません`)
        setErrorMessage('アクセス権限がありません。ログインし直してください。')
        setTimeout(() => navigate('/login'), 3000)
        return
      }

      // ✅ Context にセッション保存
      dispatch({ type: 'SET_SESSION', payload: session })
      dispatch({
        type: 'SET_USER',
        payload: {
          username: email,
          role,
          canManageTables: role !== 'cast',
        },
      })

      // ✅ 成功 → /tables に遷移
      navigate('/tables')
    }

    handleAuth()
  }, [dispatch, navigate])

  return (
    <div className="text-center mt-20">
      {errorMessage ? (
        <div className="text-red-600">{errorMessage}</div>
      ) : (
        <div>ログイン処理中...</div>
      )}
    </div>
  )
}

export default AuthCallback
