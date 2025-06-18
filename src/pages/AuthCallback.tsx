// src/pages/AuthCallback.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useStore } from '../context/StoreContext';

const AuthCallback = () => {
  const navigate = useNavigate();
  const { setSession, setUserMetadata } = useStore();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let alreadyHandled = false;

    const handleCallback = async () => {
      if (alreadyHandled) return;
      alreadyHandled = true;

      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error || !session?.user) {
        setErrorMessage('ログインに失敗しました');
        return;
      }

      const user = session.user;
      const metadata = user.user_metadata;
      const storeId = metadata.store_id;
      const role = metadata.role;
      const email = user.email;
      const authUserId = user.id;

      if (!storeId || !role || !email || !authUserId) {
        setErrorMessage('必要な情報が不足しています');
        return;
      }

      const table = role === 'cast' ? 'casts' : 'operators';

      const { data: alreadyExists, error: fetchError } = await supabase
        .from(table)
        .select('id')
        .eq('auth_user_id', authUserId)
        .maybeSingle();

      if (fetchError) {
        setErrorMessage('登録済み確認に失敗しました');
        return;
      }

      // ✅ プランBではinsertせず、プロフィールページで処理
      setSession(session);
      setUserMetadata(metadata);

      if (role === 'cast') {
        navigate('/cast/profile', { replace: true });
      } else if (role === 'operator') {
        navigate('/operator/profile', { replace: true });
      } else {
        navigate('/admin/profile', { replace: true });
      }
    };

    handleCallback();
  }, [navigate, setSession, setUserMetadata]);

  return (
    <div className="flex items-center justify-center h-screen">
      {errorMessage ? (
        <p className="text-red-500">{errorMessage}</p>
      ) : (
        <p className="text-gray-700">ログイン処理中...</p>
      )}
    </div>
  );
};

export default AuthCallback;
