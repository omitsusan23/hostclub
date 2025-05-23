import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StoreInfo } from '../context/StoreContext';

interface CastDashboardProps {
  user: { username: string; role: string };
  setCurrentUser: (user: null) => void;
}

function CastDashboard({ user, setCurrentUser }: CastDashboardProps) {
  const navigate = useNavigate();

  const [store, setStore] = useState<StoreInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch('/api/stores/001')
      .then((res) => res.json())
      .then((data) => {
        setStore(data);
      })
      .catch((err) => {
        console.error('Failed to fetch store', err);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    // 親コンポーネントの setCurrentUser を呼び出し
    setCurrentUser(null);
    navigate('/');
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">キャストダッシュボード</h1>
      <p>ようこそ、{user.username}さん（{user.role}）</p>

      {loading ? (
        <p>Loading...</p>
      ) : store ? (
        <div className="mb-4">
          <p>店舗名: {store.name}</p>
          <p>テーブル数: {store.tableCount}</p>
        </div>
      ) : (
        <p className="text-red-600">店舗情報を取得できませんでした。</p>
      )}

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
