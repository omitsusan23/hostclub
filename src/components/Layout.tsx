// src/components/Layout.tsx
import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { useStore } from '../context/StoreContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isEmployeeView } = useStore();

  return (
    <div className="flex flex-col min-h-screen">
      {/* 従業員画面でのみヘッダー表示 */}
      {isEmployeeView && <Header />}
      <main className="flex-grow container mx-auto px-4 py-6">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;