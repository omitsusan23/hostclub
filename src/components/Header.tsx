import React from 'react';

interface HeaderProps {
  title: string;
  children?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ title, children }) => {
  return (
    <header className="pt-[env(safe-area-inset-top)] h-[110px] bg-white border-b px-4 flex items-end justify-between">
      <h1 className="text-2xl font-bold">{title}</h1>
      <div className="flex items-center space-x-2">
        {children}
      </div>
    </header>
  );
};

export default Header;
