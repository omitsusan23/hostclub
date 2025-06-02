// src/components/BackgroundLogo.tsx
import React from 'react';

const BackgroundLogo: React.FC = () => {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    >
      <img
        src="/images/logo.png"
        alt="Background Logo"
        style={{
          width: '380px',         // ← Figmaサイズと同等
          maxWidth: '90vw',
          opacity: 0.05,
          userSelect: 'none',
        }}
      />
    </div>
  );
};

export default BackgroundLogo;
