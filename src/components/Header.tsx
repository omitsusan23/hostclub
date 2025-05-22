// src/components/Header.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

const Header: React.FC = () => {
  const { name, isEmployeeView } = useStore();

  // 従業員画面でなければ何も表示しない
  if (!isEmployeeView) return null;

  return (
    <header className="bg-white shadow p-4 flex justify-between items-center">
      <div className="text-2xl font-bold">{name}</div>
      <nav>
        <ul className="flex space-x-6">
          <li><Link to="/">ダッシュボード</Link></li>
          <li><Link to="/tables">卓状況</Link></li>
          <li><Link to="/reservations">予約管理</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
