import React from 'react';
import { useStore } from '../context/StoreContext';

const Header: React.FC = () => {
  const { currentStore } = useStore();

  return (
    <header className="bg-white shadow p-4 flex justify-center items-center">
      <span className="font-semibold">
        {currentStore?.name || '店舗情報が取得できません'}
      </span>
    </header>
  );
};

export default Header;
