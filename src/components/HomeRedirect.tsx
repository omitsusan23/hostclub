// src/components/HomeRedirect.tsx
import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const HomeRedirect = () => {
  const [redirectTo, setRedirectTo] = useState<string | null>(null);

  useEffect(() => {
    const checkExistingAdmin = async () => {
      const subdomain = window.location.hostname.split('.')[0];
      const { data, error } = await supabase.auth.admin.listUsers();

      if (error) {
        console.error('ユーザー取得エラー:', error);
        setRedirectTo('/register'); // 万が一エラーでも登録へ
        return;
      }

      const found = data?.users?.some((user) => {
        return user.user_metadata?.store_id === subdomain;
      });

      setRedirectTo(found ? '/login' : '/register');
    };

    checkExistingAdmin();
  }, []);

  if (!redirectTo) return null;
  return <Navigate to={redirectTo} replace />;
};

export default HomeRedirect;
