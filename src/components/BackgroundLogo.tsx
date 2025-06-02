// src/components/BackgroundLogo.tsx
import React from 'react';

const BackgroundLogo: React.FC = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-0">
      <img
        src="/images/logo.png"
        alt="Background Logo"
        className="opacity-10 w-[60%] max-w-[300px]"
      />
    </div>
  );
};

export default BackgroundLogo;
