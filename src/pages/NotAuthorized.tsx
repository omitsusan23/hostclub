// src/pages/NotAuthorized.tsx
import React from 'react'
import { Link } from 'react-router-dom'

const NotAuthorized: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 text-center">
      <h1 className="text-3xl font-bold text-red-600 mb-4">アクセスが拒否されました</h1>
      <p className="mb-6 text-gray-700">
        このページにアクセスする権限がありません。ログイン情報やユーザーの権限を確認してください。
      </p>
      <Link
        to="/"
        className="text-white bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded transition"
      >
        ホームに戻る
      </Link>
    </div>
  )
}

export default NotAuthorized
