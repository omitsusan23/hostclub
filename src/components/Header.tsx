import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

const Header: React.FC = () => {
  const { currentStore, isEmployeeView } = useStore();
  
  if (!isEmployeeView || !currentStore) return null;

  return (
    <header className="bg-white shadow p-4 flex justify-between items-center">
      <div className="flex items-center space-x-2">
        <span className="font-semibold">店舗: {currentStore.name}</span>
      </div>
      <nav>
        <ul className="flex space-x-6">
          <li><Link to={`/stores/${currentStore.id}`}>店舗管理</Link></li>
          <li><Link to="/tables">卓状況</Link></li>
          <li><Link to="/reservations">予約管理</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
