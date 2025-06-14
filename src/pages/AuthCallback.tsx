// src/pages/AuthCallback.tsx
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { useAppContext } from '../context/AppContext'

const AuthCallback = () => {
  const { dispatch } = useAppContext()
  const navigate = useNavigate()

  useEffect(() => {
    const handleAuth = async () => {
      const { data, error } = await supabase.auth.getSession()

      if (error || !data.session) {
        console.error('❌ セッション取得失敗:', error)
        navigate('/login')
        return
      }

      const session = data.session
      const meta = session.user.user_metadata

      dispatch({ type: 'SET_SESSION', payload: session })
      dispatch({
        type: 'SET_USER',
        payload: {
          username: session.user.email ?? '',
          role: meta.role,
          canManageTables: meta.role !== 'cast',
        },
      })

      navigate('/tables') // 任意のログイン後遷移先
    }

    handleAuth()
  }, [dispatch, navigate])

  return <div className="text-center mt-20">ログイン処理中...</div>
}

export default AuthCallback
