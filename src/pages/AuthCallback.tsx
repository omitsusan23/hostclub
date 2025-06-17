import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { useAppContext } from '../context/AppContext'

const AuthCallback = () => {
  const { dispatch } = useAppContext()
  const navigate = useNavigate()
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!session) {
        console.error('❌ セッションが取得できません')
        setErrorMessage('セッションの取得に失敗しました。ログインし直してください。')
        setTimeout(() => navigate('/login'), 3000)
        return
      }

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

      const table = role === 'admin'
        ? 'admins'
        : role === 'cast'
        ? 'casts'
        : role === 'operator'
        ? 'operators'
        : null

      if (!table) {
        setErrorMessage('不正なロールです')
        setTimeout(() => navigate('/login'), 3000)
        return
      }

      const { data: existing, error: checkError } = await supabase
        .from(table)
        .select('id')
        .eq('auth_user_id', user.id)
        .maybeSingle()

      if (checkError) {
        console.error(`❌ ${table}チェックエラー:`, checkError)
        setErrorMessage('登録状況の確認に失敗しました。')
        setTimeout(() => navigate('/login'), 3000)
        return
      }

      if (!existing) {
        const { error: insertError } = await supabase.from(table).insert([{
          auth_user_id: user.id,
          store_id: storeId,
          email: email,
          role: role,
        }])

        if (insertError) {
          console.error(`❌ ${table}テーブルへの登録失敗:`, insertError)
          setErrorMessage('初回登録に失敗しました。')
          setTimeout(() => navigate('/login'), 3000)
          return
        }
      }

      dispatch({ type: 'SET_SESSION', payload: session })
      dispatch({
        type: 'SET_USER',
        payload: {
          username: email,
          role,
          canManageTables: role !== 'cast',
        },
      })

      const profilePath =
        role === 'admin'
          ? '/admin/profile'
          : role === 'cast'
          ? '/cast/profile'
          : '/operator/profile'

      navigate(profilePath)
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
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
