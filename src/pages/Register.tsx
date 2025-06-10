import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAppContext } from '../context/AppContext';

const Register = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useAppContext();
  const session = state.session;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [storeId, setStoreId] = useState('');
  const [storeExists, setStoreExists] = useState<boolean | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const hostname = window.location.hostname;
    const subdomain = hostname.split('.')[0];
    setStoreId(subdomain);

    if (session === undefined) {
      console.log('⏳ セッション復元中のため処理保留');
      return;
    }

    if (session?.user) {
      // 🔁 ログイン中なら即リダイレクト
      const meta = session.user.user_metadata;
      const role = meta?.role;
      if (role === 'cast') {
        navigate(`/cast/${subdomain}`);
      } else {
        navigate(`/stores/${subdomain}`);
      }
      return;
    }

    const checkStore = async () => {
      try {
        const isLocalhost = hostname === 'localhost';
        const apiBaseUrl = isLocalhost
          ? 'http://localhost:3001'
          : window.location.origin;

        const res = await fetch(`${apiBaseUrl}/api/is-store-registered?subdomain=${subdomain}`);
        const json = await res.json();
        setStoreExists(json.exists);
      } catch (err) {
        console.error('店舗確認エラー:', err);
        setError('店舗の登録状況を確認できませんでした');
      }
    };

    checkStore();
  }, [session, navigate]);

  const handleRegister = async () => {
    setError('');
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          store_id: storeId,
          role: 'admin',
        },
      },
    });

    if (error) {
      setError(error.message);
    } else {
      const sessionResult = await supabase.auth.getSession();
      const session = sessionResult.data.session;

      dispatch({ type: 'SET_SESSION', payload: session });

      if (session?.user) {
        const meta = session.user.user_metadata;
        dispatch({
          type: 'SET_USER',
          payload: {
            username: session.user.email ?? '',
            role: meta.role,
            canManageTables: meta.role !== 'cast',
          },
        });

        if (meta.role === 'cast') {
          navigate(`/cast/${storeId}`);
        } else {
          navigate(`/stores/${storeId}`);
        }
      } else {
        setError('セッション情報が取得できませんでした。');
      }
    }

    setLoading(false);
  };

  const handleToLogin = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  if (storeExists === null) {
    return <div className="text-center mt-20">読み込み中...</div>;
  }

  if (storeExists) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <h1 className="text-2xl font-bold text-red-600 mb-4">すでに管理者登録されています</h1>
        <p className="mb-4">この店舗ではすでに管理者が登録されています。ログイン画面からお進みください。</p>
        <button
          onClick={handleToLogin}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          ログイン画面へ
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-2xl font-bold mb-4">管理者アカウント登録</h1>

      <input
        type="email"
        placeholder="メールアドレス"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border px-3 py-2 mb-2 w-64 rounded"
      />
      <input
        type="password"
        placeholder="パスワード"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border px-3 py-2 mb-2 w-64 rounded"
      />

      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

      <button
        onClick={handleRegister}
        disabled={loading}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
      >
        {loading ? '登録中...' : '登録してログイン'}
      </button>
    </div>
  );
};

export default Register;
