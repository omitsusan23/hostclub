// src/components/Footer.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const Footer: React.FC = () => {
  const { state } = useAppContext();
  const user = state.currentUser;

  if (!user) return null;

  const isEmployee = user.role === 'owner' || user.role === 'operator';
  const isCast = user.role === 'cast';

  return (
    <footer className="bg-white shadow p-4 flex justify-around items-center text-sm font-medium">
      {isEmployee && (
        <>
          <Link to="/tables">卓状況</Link>
          <Link to="/reservations">来店予約</Link>
          <Link to="/casts">キャスト一覧</Link>
          <Link to="/settings">設定</Link>
        </>
      )}
      {isCast && (
        <>
          <Link to="/tables">卓状況</Link>
          <Link to="/reservations">来店予約</Link>
          <Link to="/princesses">姫一覧</Link>
          <Link to="/mypage">マイページ</Link>
        </>
      )}
    </footer>
  );
};

export default Footer;
