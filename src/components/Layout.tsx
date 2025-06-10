// src/components/Layout.tsx
import React from 'react';
import Footer from './Footer';
import { useStore } from '../context/StoreContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { currentStore } = useStore();

  console.log('📦 現在の店舗 (currentStore):', currentStore);
  console.log('🖼️ 背景ロゴURL (logo_url):', currentStore?.logo_url);

  return (
    <div className="relative flex flex-col min-h-screen bg-white overflow-hidden">
      {/* ✅ 固定配置された大サイズの背景ロゴ（IDとロゴURLが揃ってるときのみ表示） */}
      {currentStore?.id && currentStore.logo_url && (
        <img
          src={currentStore.logo_url}
          alt="背景ロゴ"
          className="
            fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
            w-[90vw] md:w-[60vw] lg:w-[50vw]
            opacity-10 pointer-events-none select-none z-0
          "
        />
      )}

      {/* z-10 で前面コンテンツ */}
      <main className="relative z-10 flex-grow container mx-auto px-4 py-6">
        {children}
      </main>

      <Footer />
    </div>
  );
};

export default Layout;
