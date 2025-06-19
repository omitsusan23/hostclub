import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAppContext } from '../context/AppContext';

const SignupRedirect = () => {
  const { dispatch } = useAppContext();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let alreadyHandled = false;

    const handleSignupRedirect = async () => {
      if (alreadyHandled) return;
      alreadyHandled = true;

      const { data, error } = await supabase.auth.getSession();

      if (error || !data.session) {
        console.error('❌ セッション取得失敗:', error);
        setErrorMessage('セッションの取得に失敗しました。ログインし直してください。');
        setTimeout(() => navigate('/login'), 3000);
        return;
      }

      const session = data.session;
      const user = session.user;
      const meta = user.user_metadata;
      const email = user.email ?? '';
      const role = meta?.role ?? '';
      const storeId = meta?.store_id ?? '';
      const currentSubdomain = window.location.hostname.split('.')[0];

      if (storeId !== currentSubdomain) {
        console.warn(`⛔ store_id(${storeId})とサブドメイン(${currentSubdomain})が一致しません`);
        setErrorMessage('アクセス権限がありません。ログインし直してください。');
        setTimeout(() => navigate('/login'), 3000);
        return;
      }

      // ✅ テーブル・リダイレクト先を role に応じて分岐
      let table = '';
      let profilePage = '';

      if (role === 'cast') {
        table = 'casts';
        profilePage = '/cast/profile';
      } else if (role === 'operator') {
        table = 'operators';
        profilePage = '/operator/profile';
      } else if (role === 'admin') {
        table = 'admins';
        profilePage = '/admin/profile';
      } else {
        console.error('❌ 不明なロール:', role);
        setErrorMessage('不明なユーザー種別です。');
        setTimeout(() => navigate('/login'), 3000);
        return;
      }

      // ✅ すでにプロフィール登録済みかチェック
      const { data: existing, error: checkError } = await supabase
        .from(table)
        .select('id')
        .eq('auth_user_id', user.id)
        .maybeSingle();

      if (checkError) {
        console.error(`❌ ${table}チェックエラー:`, checkError);
        setErrorMessage('情報の確認に失敗しました。');
        setTimeout(() => navigate('/login'), 3000);
        return;
      }

      dispatch({ type: 'SET_SESSION', payload: session });
      dispatch({
        type: 'SET_USER',
        payload: {
          username: email,
          role,
          canManageTables: role !== 'cast',
        },
      });

      if (existing) {
        console.log('✅ プロフィール登録済み → スキップして一覧画面へ');
        navigate('/tables', { replace: true });
      } else {
        console.log('🆕 初回登録ユーザー → プロフィール入力ページへ誘導');
        navigate(profilePage, { replace: true });
      }
    };

    handleSignupRedirect();
  }, [dispatch, navigate]);

  return (
    <div className="text-center mt-20">
      {errorMessage ? (
        <div className="text-red-600">{errorMessage}</div>
      ) : (
        <div>ログイン処理中...</div>
      )}
    </div>
  );
};

export default SignupRedirect;
