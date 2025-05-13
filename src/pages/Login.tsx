import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// 仮のユーザー一覧（canManageTables を追加）
const mockUsers = [
  { id: 1, username: 'owner', password: '1234', role: 'admin', canManageTables: true },
  { id: 2, username: 'cast1', password: '5678', role: 'cast', canManageTables: false },
];

interface LoginProps {
  setCurrentUser: (user: typeof mockUsers[number] | null) => void;
}

function Login({ setCurrentUser }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    const foundUser = mockUsers.find(
      (user) => user.username === username && user.password === password
    );

    if (!foundUser) {
      setError('ユーザー名またはパスワードが間違っています。');
      return;
    }

    // 親コンポーネントにログイン情報を渡す
    setCurrentUser(foundUser);

    // ロールに応じて遷移
    if (foundUser.role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/cast');
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
