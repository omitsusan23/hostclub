// src/components/Layout.tsx
import React from 'react';
import Footer from './Footer';
import { useStore } from '../context/StoreContext'; // 修正: 正しいhook名に変更

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { currentStore } = useStore(); // 修正: currentStore を取得

  // ✅ currentStore と logo_url をログ出力して確認
  console.log('📦 現在の店舗 (currentStore):', currentStore);
  console.log('🖼️ 背景ロゴURL (logo_url):', currentStore?.logo_url);

  return (
    <div className="relative flex flex-col min-h-screen bg-white overflow-hidden">
      {/* ✅ Supabaseから取得した背景ロゴを中央に配置 */}
      {currentStore?.logo_url && (
        <img
          src={currentStore.logo_url}
          alt="背景ロゴ"
          className="absolute top-1/2 left-1/2 w-64 -translate-x-1/2 -translate-y-1/2 opacity-10 pointer-events-none select-none z-0"
        />
      )}

      {/* z-10 でコンテンツを背景より前面に出す */}
      <main className="relative z-10 flex-grow container mx-auto px-4 py-6">
        {children}
      </main>

      <Footer />
    </div>
  );
};

export default Layout;
