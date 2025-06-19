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

      if (!metadata?.store_id || !metadata?.role || !user.email || !user.id) {
        setErrorMessage('必要な情報が不足しています');
        return;
      }

      try {
        setSession?.(session);
        setUserMetadata?.(metadata);
      } catch (e) {
        console.error('❌ Context関数の呼び出しエラー:', e);
      }

      // ✅ すべてのロールで共通のRedirect先に統一
      navigate('/signup', { replace: true });
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
