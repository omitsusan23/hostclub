import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAppContext } from '../context/AppContext'

const Login = () => {
  const navigate = useNavigate()
  const { dispatch } = useAppContext()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [storeId, setStoreId] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    const hostname = window.location.hostname
    const subdomain = hostname.split('.')[0]
    setStoreId(subdomain)
  }, [])

  const handleLogin = async () => {
    setError('')
    setLoading(true)

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
    } else {
      const session = data.session
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
      <h1 className="text-2xl font-bold mb-4">ログイン</h1>

      {/* ✅ メールアドレス欄：font-sans 追加 */}
      <input
        type="email"
        placeholder="メールアドレス"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border px-3 py-2 mb-2 w-64 rounded font-sans"
      />

      {/* ✅ パスワード欄：目のアイコン表示付き */}
      <div className="relative w-64 mb-2">
        <input
          type={showPassword ? 'text' : 'password'}
          placeholder="パスワード"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border px-3 py-2 w-full rounded font-sans pr-10"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-lg text-gray-500 hover:text-gray-700"
          aria-label="パスワード表示切替"
        >
          {showPassword ? '🙈' : '👁'}
        </button>
      </div>

      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

      <button
        onClick={handleLogin}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? 'ログイン中...' : 'ログイン'}
      </button>
    </div>
  )
}

export default Login
