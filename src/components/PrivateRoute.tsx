import React from 'react';
import { Navigate } from 'react-router-dom';

interface PrivateRouteProps {
  children: React.ReactElement;
  currentUser: { role: string } | null;
  allowedRoles: string[];
}

export default function PrivateRoute({
  children,
  currentUser,
  allowedRoles,
}: PrivateRouteProps) {
  // ログインしていなければログイン画面へ
  if (!currentUser) {
    return <Navigate to="/" replace />;
  }
  // 権限がなければログイン画面へ
  if (!allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/" replace />;
  }
  // 通過OK
  return children;
}
