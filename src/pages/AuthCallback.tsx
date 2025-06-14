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
      const { data, error } = await supabase.auth.getSession()

      if (error || !data.session) {
        console.error('❌ セッション取得失敗:', error)
        setErrorMessage('セッションの取得に失敗しました。ログインし直してください。')
        setTimeout(() => navigate('/login'), 3000)
        return
      }

      const session = data.session
      const user = session.user
      const meta = user.user_metadata
      const email = user.email ?? ''
      const role = meta?.role ?? ''
      const storeId = meta?.store_id ?? ''
      const currentSubdomain = window.location.hostname.split('.')[0]

      if (storeId !== currentSubdomain) {
        console.warn(`⛔ store_id(${storeId})とサブドメイン(${currentSubdomain})が一致しません`)
        setErrorMessage('アクセス権限がありません。ログインし直してください。')
        setTimeout(() => navigate('/login'), 3000)
        return
      }

      // ✅ adminsテーブルに既に登録されているか確認
      const { data: existingAdmin, error: checkError } = await supabase
        .from('admins')
        .select('id')
        .eq('auth_user_id', user.id)
        .maybeSingle()

      if (checkError) {
        console.error('❌ adminsチェックエラー:', checkError)
        setErrorMessage('管理者情報の確認に失敗しました。')
        setTimeout(() => navigate('/login'), 3000)
        return
      }

      // ✅ 未登録の場合のみ登録
      if (!existingAdmin) {
        const { error: insertError } = await supabase.from('admins').insert([
          {
            auth_user_id: user.id,
            store_id: storeId,
            email: email,
            role: role,
          },
        ])

        if (insertError) {
          console.error('❌ adminsテーブルへの登録失敗:', insertError)
          setErrorMessage('管理者情報の登録に失敗しました。')
          setTimeout(() => navigate('/login'), 3000)
          return
        }
      }

      // ✅ Context保存 → /tablesへ遷移
      dispatch({ type: 'SET_SESSION', payload: session })
      dispatch({
        type: 'SET_USER',
        payload: {
          username: email,
          role,
          canManageTables: role !== 'cast',
        },
      })

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
