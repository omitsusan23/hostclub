import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useStore } from '../context/StoreContext';

const AuthCallback = () => {
  const navigate = useNavigate();
  const { setSession, setUserMetadata } = useStore();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
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
      const token = metadata.invite_token;
      const email = user.email;
      const authUserId = user.id;

      if (!storeId || !role || !token || !email || !authUserId) {
        setErrorMessage('必要な情報が不足しています');
        return;
      }

      const table = role === 'cast' ? 'casts' : 'operators';

      // すでにauth_user_idで登録済みなら何もしない
      const { data: alreadyExists, error: fetchError } = await supabase
        .from(table)
        .select('id')
        .eq('auth_user_id', authUserId)
        .maybeSingle();

      if (fetchError) {
        setErrorMessage('登録済み確認に失敗しました');
        return;
      }

      if (!alreadyExists) {
        // 招待トークンで既存レコードを探してupdate
        const { data: inviteRecord, error: inviteFetchError } = await supabase
          .from(table)
          .select('id')
          .eq('invite_token', token)
          .eq('store_id', storeId)
          .maybeSingle();

        if (inviteFetchError || !inviteRecord) {
          setErrorMessage('招待レコードが見つかりません');
          return;
        }

        const { error: updateError } = await supabase
          .from(table)
          .update({
            auth_user_id: authUserId,
            email,
            is_active: true,
            invite_token: null,
          })
          .eq('id', inviteRecord.id);

        if (updateError) {
          setErrorMessage('ユーザー情報の更新に失敗しました');
          return;
        }
      }

      setSession(session);
      setUserMetadata(metadata);

      if (role === 'cast') navigate('/cast/profile');
      else if (role === 'operator') navigate('/operator/profile');
      else navigate('/admin/profile');
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
