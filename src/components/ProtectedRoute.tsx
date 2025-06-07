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

  // 未ログインの場合はリダイレクト
  if (!session) {
    return <Navigate to="/register" replace />
  }

  // ロールが許可されていない場合はリダイレクト
  if (allowedRoles && currentUser && !allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/not-authorized" replace />
  }

  return <>{children}</>
}

export default ProtectedRoute
