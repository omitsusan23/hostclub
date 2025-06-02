// src/components/BackgroundLogo.tsx
import React from 'react';

const BackgroundLogo: React.FC = () => {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0">
      <img
        src="/images/logo.png"
        alt="Background Logo"
        className="opacity-10 w-[300px] sm:w-[360px]"
      />
    </div>
  );
};

export default BackgroundLogo;
