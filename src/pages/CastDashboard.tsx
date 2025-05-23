import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { useStore } from '../context/StoreContext';

function CastDashboard() {
  const navigate = useNavigate();
  const { state, dispatch } = useAppContext();
  const { currentStore } = useStore();
  const user = state.currentUser;

  const handleLogout = () => {
    dispatch({ type: 'SET_USER', payload: null });
    navigate('/');
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">キャストダッシュボード</h1>
      <p>ようこそ、{user?.username}さん（{user?.role}）</p>

      {currentStore ? (
        <div className="mb-4">
          <p>店舗名: {currentStore.name}</p>
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
