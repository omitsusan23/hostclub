// src/pages/MyPage.tsx

import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import Header from '../components/Header'

// MyPageProps に setCurrentUser を追加
interface MyPageProps {
  setCurrentUser: React.Dispatch<React.SetStateAction<any>>
}

export default function MyPage({ setCurrentUser }: MyPageProps) {
  const navigate = useNavigate()
  const { dispatch } = useAppContext()

  // ログアウト時に App 側の currentUser と context 両方をクリア
  const handleLogout = () => {
    // App.tsx のローカル state をクリア
    setCurrentUser(null)
    // Context state もクリア
    dispatch({ type: 'LOGOUT' })
    // ログイン画面へリダイレクト
    navigate('/')
  }

  return (
    <>
      <Header title="マイページ" />
      <div className="p-4">
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          ログアウト
        </button>
      </div>
    </>
  )
}