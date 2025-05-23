import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface LoginProps {
  setCurrentUser: (user: any) => void;
}

function Login({ setCurrentUser }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError('');
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) throw new Error('login failed');
      const user = await res.json();
      setCurrentUser(user);
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/cast');
      }
    } catch {
      setError('ユーザー名またはパスワードが間違っています。');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-2xl font-bold mb-4">ログイン</h1>

      <input
        type="text"
        placeholder="ユーザー名"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
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
        onClick={handleLogin}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        ログイン
      </button>
    </div>
  );
}

export default Login;
