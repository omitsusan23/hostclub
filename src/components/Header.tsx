import React from 'react';

interface HeaderProps {
  title: string;
  children?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ title, children }) => {
  return (
    <header
      className="fixed top-0 z-50 w-full pt-[env(safe-area-inset-top)] bg-white
      before:content-[''] before:absolute before:top-0 before:left-0 before:right-0
      before:h-[env(safe-area-inset-top)] before:bg-white before:z-[-1]"
    >
      {/* ✅ アンダーライン（線）はそのまま全幅に固定 */}
      <div className="fixed left-0 right-0 top-[calc(env(safe-area-inset-top)_+_66px)] h-px bg-gray-300 z-40" />

      {/* ✅ Y軸を保ったままX方向だけ左に寄せる */}
      <div className="min-h-[66px] flex items-center justify-start gap-x-4 pl-4">
        <h1 className="text-3xl font-bold leading-none whitespace-nowrap">{title}</h1>

        {/* ✅ ボタン群も同一行・左寄せ */}
        <div className="flex items-center space-x-2 overflow-x-auto">
          {children}
        </div>
      </div>
    </header>
  );
};

export default Header;
