// src/components/ProtectedRoute.tsx
import React, { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'

interface ProtectedRouteProps {
  children: ReactNode
  allowedRoles?: string[] // ロール制限（例: ['admin', 'owner']）
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const {
    state: { session, currentUser },
  } = useAppContext()

  // ✅ セッションまたはユーザー情報がなければ /register にリダイレクト
  if (!session || !currentUser) {
    return <Navigate to="/register" replace />
  }

  // ✅ メール確認が済んでいない場合もブロック
  if (!session.user.confirmed_at) {
    return <Navigate to="/login" replace />
  }

  // ✅ ロール制限があれば確認する
  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/not-authorized" replace />
  }

  return <>{children}</>
}

export default ProtectedRoute
