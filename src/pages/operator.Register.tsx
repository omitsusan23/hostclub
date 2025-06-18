// src/pages/OperatorRegisterPage.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

export default function OperatorRegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [validToken, setValidToken] = useState(false);
  const [role, setRole] = useState<'operator' | 'cast' | null>(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const roleParam = searchParams.get('role');
  const storeId = window.location.hostname.split('.')[0];

  useEffect(() => {
    if (!token || !roleParam || !['operator', 'cast'].includes(roleParam)) {
      setError('URLが無効です');
    } else {
      setRole(roleParam as 'operator' | 'cast');
      setValidToken(true);
    }
  }, [token, roleParam]);

  const handleRegister = async () => {
    setError('');
    setLoading(true);

    try {
      const baseDomain = import.meta.env.VITE_BASE_DOMAIN ?? 'hostclub-tableststus.com';
      const redirectUrl = `https://${storeId}.${baseDomain}/auth/callback`;

      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            store_id: storeId,
            role,
            invite_token: token,
          },
        },
      });

      if (signUpError) throw signUpError;

      alert('確認メールを送信しました');
      navigate('/login');
    } catch (e: any) {
      console.error(e);
      setError(e.message || '登録に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  if (!validToken) {
    return <p className="text-center text-red-600">{error || '検証中...'}</p>;
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4 text-center">
        オペレーター登録
      </h1>
      {error && <p className="text-red-600 mb-2 text-center">{error}</p>}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleRegister();
        }}
        className="space-y-4"
      >
        <div>
          <label className="block mb-1">メールアドレス</label>
          <input
            type="email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block mb-1">パスワード</label>
          <input
            type="password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? '登録中...' : '確認メールを送信'}
        </button>
      </form>
    </div>
  );
}
