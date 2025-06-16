import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { useAppContext } from '../context/AppContext'

const SignupRedirect = () => {
  const { dispatch } = useAppContext()
  const navigate = useNavigate()
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const handleSignupRedirect = async () => {
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

      // cast/operator登録先を動的に選定
      const table = role === 'cast' ? 'casts' : role === 'operator' ? 'operators' : null
      const profilePage = role === 'cast' ? '/cast/profile' : role === 'operator' ? '/operator/profile' : '/login'

      if (!table) {
        console.error('❌ 不明なロール:', role)
        setErrorMessage('不明なユーザー種別です。')
        setTimeout(() => navigate('/login'), 3000)
        return
      }

      // 登録済みか確認
      const { data: existing, error: checkError } = await supabase
        .from(table)
        .select('id')
        .eq('auth_user_id', user.id)
        .maybeSingle()

      if (checkError) {
        console.error(`❌ ${table}チェックエラー:`, checkError)
        setErrorMessage('情報の確認に失敗しました。')
        setTimeout(() => navigate('/login'), 3000)
        return
      }

      // 未登録の場合のみ挿入（insertCast/Operatorはフロントで処理済みなのでここでは何もしない）
      dispatch({ type: 'SET_SESSION', payload: session })
      dispatch({
        type: 'SET_USER',
        payload: {
          username: email,
          role,
          canManageTables: role !== 'cast',
        },
      })

      navigate(profilePage)
    }

    handleSignupRedirect()
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

export default SignupRedirect
