import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAppContext } from '../context/AppContext'

const Register = () => {
  const navigate = useNavigate()
  const { dispatch } = useAppContext()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [storeId, setStoreId] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const hostname = window.location.hostname
    const subdomain = hostname.split('.')[0]
    setStoreId(subdomain)
  }, [])

  const handleRegister = async () => {
    setError('')
    setLoading(true)

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          store_id: storeId,
          role: 'admin',
        },
      },
    })

    if (error) {
      setError(error.message)
    } else {
      // ✅ セッション取得とAppContextへの反映
      const sessionResult = await supabase.auth.getSession()
      const session = sessionResult.data.session

      dispatch({ type: 'SET_SESSION', payload: session })

      if (session?.user) {
        const meta = session.user.user_metadata
        dispatch({
          type: 'SET_USER',
          payload: {
            username: session.user.email ?? '',
            role: meta.role,
            canManageTables: meta.role !== 'cast',
          },
        })

        // ✅ リダイレクト先をロールに応じて変更
        if (meta.role === 'cast') {
          navigate(`/cast/${storeId}`)
        } else {
          navigate(`/stores/${storeId}`)
        }
      } else {
        setError('セッション情報が取得できませんでした。')
      }
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-2xl font-bold mb-4">管理者アカウント登録</h1>

      <input
        type="email"
        placeholder="メールアドレス"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border px-3 py-2 mb-2 w-64 rounded"
      />
      <input
        type="password"
        placeholder="パスワード"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border px-3 py-2 mb-2 w-64 rounded"
      />

      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

      <button
        onClick={handleRegister}
        disabled={loading}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
      >
        {loading ? '登録中...' : '登録してログイン'}
      </button>
    </div>
  )
}

export default Register
