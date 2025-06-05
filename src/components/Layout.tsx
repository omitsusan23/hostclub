// src/components/Layout.tsx
import React from 'react';
import Footer from './Footer';
import BackgroundLogo from './BackgroundLogo'; // ← 追加

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="relative flex flex-col min-h-screen bg-white">
      <BackgroundLogo /> {/* ← 背景ロゴ */}
      {/* <Header /> ← ✅ ここは削除 */}
      <main className="relative z-10 flex-grow container mx-auto px-4 py-6">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
