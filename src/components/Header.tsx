import React from 'react';
import { useStore } from '../context/StoreContext';

const Header: React.FC = () => {
  const { currentStore, isEmployeeView } = useStore();
  
  if (!isEmployeeView || !currentStore) return null;

  return (
    <header className="bg-white shadow p-4 flex justify-center items-center">
      <span className="font-semibold">{currentStore.name}</span>
    </header>
  );
};

export default Header;
