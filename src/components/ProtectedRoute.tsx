// src/components/ProtectedRoute.tsx
import React, { ReactNode, useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import { supabase } from '../lib/supabaseClient'

interface ProtectedRouteProps {
  children: ReactNode
  allowedRoles?: string[]
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const {
    state: { session, currentUser },
  } = useAppContext()
  const [confirmed, setConfirmed] = useState<boolean | null>(null)

  useEffect(() => {
    const checkConfirmation = async () => {
      if (!session) {
        setConfirmed(false)
        return
      }

      const { data, error } = await supabase.auth.getUser()

      if (error || !data.user) {
        setConfirmed(false)
        return
      }

      setConfirmed(!!data.user.confirmed_at)
    }

    checkConfirmation()
  }, [session])

  if (confirmed === null) {
    return <div className="text-center mt-20">確認中...</div>
  }

  // 未確認ならログインページに飛ばす
  if (!session || !currentUser || confirmed === false) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/not-authorized" replace />
  }

  return <>{children}</>
}

export default ProtectedRoute
