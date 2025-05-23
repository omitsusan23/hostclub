import React from 'react';
import { useStore } from '../context/StoreContext';

const Header: React.FC = () => {
  const { currentStore, isEmployeeView } = useStore();

  if (!isEmployeeView || !currentStore) return null;

  return (
    <header className="bg-white shadow p-4 text-xl font-semibold">
      {currentStore.name}
    </header>
  );
};

export default Header;
