import React from 'react';

interface HeaderProps {
  title: string;
  children?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ title, children }) => {
  return (
    <header className="fixed top-0 z-50 w-full pt-[env(safe-area-inset-top)] bg-white px-4 sm:px-6 md:px-8 
      after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1px] after:bg-gray-300
      before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-[env(safe-area-inset-top)] before:bg-white before:z-[-1]">
      
      <div className="flex items-center justify-between min-h-[66px] gap-x-4">
        <h1 className="text-3xl font-bold leading-none whitespace-nowrap">{title}</h1>
        <div className="flex items-center space-x-2 overflow-x-auto">
          {children}
        </div>
      </div>
    </header>
  );
};

export default Header;
