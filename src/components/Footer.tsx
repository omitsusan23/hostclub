import React from 'react';
import { useStore } from '../context/StoreContext';

const Footer: React.FC = () => {
  const { user } = useStore();
  const isEmployee = user?.role === 'owner' || user?.role === 'operator';
  const isCast = user?.role === 'cast';

  return (
    <footer className="bg-white shadow p-4 flex justify-around items-center">
      {isEmployee && (
        <>
          <a href="/tables">卓状況</a>
          <a href="/reservations">来店予約</a>
          <a href="/casts">キャスト一覧</a>
          <a href="/settings">設定</a>
        </>
      )}
      {isCast && (
        <>
          <a href="/tables">卓状況</a>
          <a href="/reservations">来店予約</a>
          <a href="/princesses">姫一覧</a>
          <a href="/mypage">マイページ</a>
        </>
      )}
    </footer>
  );
};

export default Footer;
