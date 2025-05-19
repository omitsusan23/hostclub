// src/components/Layout.tsx
import React, { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

export const Layout: React.FC<Props> = ({ children }) => {
  return (
    <div className="container mx-auto">
      {/* 例：ここにヘッダーを追加してもOK */}
      <main className="px-4 sm:px-3 md:px-8">
        {children}
      </main>
      {/* 例：ここにフッターを追加してもOK */}
    </div>
  );
};
