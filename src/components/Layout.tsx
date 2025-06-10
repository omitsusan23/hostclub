import React from 'react';
import Footer from './Footer';
import { useStore } from '../context/StoreContext';
import { useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { currentStore } = useStore();
  const location = useLocation();

  const hideFooter = ['/register', '/login'].some(path => location.pathname.startsWith(path));

  return (
    <div className="relative flex flex-col min-h-screen bg-white overflow-hidden">
      {/* 背景ロゴ */}
      {currentStore?.id && currentStore.logo_url && (
        <img
          src={currentStore.logo_url}
          alt="背景ロゴ"
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] md:w-[60vw] lg:w-[50vw] opacity-10 pointer-events-none select-none z-0"
        />
      )}

      <main className="relative z-10 flex-grow container mx-auto px-4 py-6">
        {children}
      </main>

      {/* ✅ フッターは login/register 以外でのみ表示 */}
      {!hideFooter && <Footer />}
    </div>
  );
};

export default Layout;
