import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAppContext } from '../context/AppContext';

const HomeRedirect = () => {
  const [redirectTo, setRedirectTo] = useState<string | null>(null);
  const {
    state: { session },
  } = useAppContext();

  useEffect(() => {
    if (!session || !session.user) {
      const checkExistingAdmin = async () => {
        const subdomain = window.location.hostname.split('.')[0];
        const { data, error } = await supabase.auth.admin.listUsers();

        if (error) {
          console.error('ユーザー取得エラー:', error);
          setRedirectTo('/register');
          return;
        }

        const found = data?.users?.some((user) => {
          return user.user_metadata?.store_id === subdomain;
        });

        setRedirectTo(found ? '/login' : '/register');
      };

      checkExistingAdmin();
    } else {
      setRedirectTo('/tables');
    }
  }, [session]);

  if (!redirectTo) return null;
  return <Navigate to={redirectTo} replace />;
};

export default HomeRedirect;