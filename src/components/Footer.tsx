import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { useAppContext } from '../context/AppContext';

const Footer: React.FC = () => {
  const { user: storeUser } = useStore() as any;
  const { state } = useAppContext();

  useEffect(() => {
    console.log('storeUser:', storeUser);
    console.log('appContext currentUser:', state.currentUser);
  }, [storeUser, state.currentUser]);

  return (
    <footer className="bg-white shadow p-4 flex justify-around items-center">
      フッター（調査中）
    </footer>
  );
};

export default Footer;
