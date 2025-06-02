// src/components/BackgroundLogo.tsx
import React from 'react';

const BackgroundLogo: React.FC = () => {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-0"
      style={{
        backgroundImage: 'url("/images/logo.png")',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center center',
        backgroundSize: '60%', // 必要に応じて調整
        opacity: 0.08, // 半透明感（調整可）
      }}
    />
  );
};

export default BackgroundLogo;
