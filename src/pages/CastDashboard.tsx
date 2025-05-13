import React from 'react';
import { useNavigate } from 'react-router-dom';

interface CastDashboardProps {
  user: { username: string; role: string };
  setCurrentUser: (user: null) => void;
}

function CastDashboard({ user, setCurrentUser }: CastDashboardProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    // 親コンポーネントの setCurrentUser を呼び出し
    setCurrentUser(null);
    navigate('/');
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">キャストダッシュボード</h1>
      <p>ようこそ、{user.username}さん（{user.role}）</p>

      <button
        onClick={handleLogout}
        className="mt-4 text-sm text-red-500 underline"
      >
        ログアウト
      </button>
    </div>
  );
}

export default CastDashboard;
