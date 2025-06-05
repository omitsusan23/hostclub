import React from 'react';

interface HeaderProps {
  title: string;
  children?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ title, children }) => {
  return (
    <header className="pt-[env(safe-area-inset-top)] h-[110px] bg-white border-b px-4 flex items-center justify-between">
  <div className="flex flex-col justify-center">
    <h1 className="text-2xl font-bold leading-tight">卓状況</h1>
  </div>
  <div className="flex items-center space-x-2 mt-1">
    {/* フィルターたち */}
  </div>
</header>

  );
};

export default Header;
