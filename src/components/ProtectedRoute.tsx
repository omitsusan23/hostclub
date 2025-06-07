// src/components/ProtectedRoute.tsx
import React, { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'

interface ProtectedRouteProps {
  children: ReactNode
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const {
    state: { session },
  } = useAppContext()

  if (!session) {
    return <Navigate to="/register" replace />
  }

  return <>{children}</>
}

export default ProtectedRoute
