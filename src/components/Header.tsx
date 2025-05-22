// src/components/Header.tsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

const Header: React.FC = () => {
  const { stores, currentStore, setCurrentStoreById, isEmployeeView } = useStore();
  const navigate = useNavigate();
  if (!isEmployeeView || !currentStore) return null;

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setCurrentStoreById(id);
    navigate(`/stores/${id}`);
  };

  return (
    <header className="bg-white shadow p-4 flex justify-between items-center">
      <div className="flex items-center space-x-2">
        <label htmlFor="store-select" className="font-semibold">店舗:</label>
        <select
          id="store-select"
          value={currentStore.id}
          onChange={handleSelect}
          className="border rounded p-1"
        >
          {stores.map((store) => (
            <option key={store.id} value={store.id}>{store.name}</option>
          ))}
        </select>
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