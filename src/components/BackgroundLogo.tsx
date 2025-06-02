// src/components/BackgroundLogo.tsx
import React from 'react';

const BackgroundLogo: React.FC = () => {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
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
          width: '360px',      // ← ここで大きさを絶対指定
          maxWidth: '90vw',    // ← 画面幅に応じて可変
          opacity: 0.06,       // ← Figmaに近い薄さに調整
        }}
      />
    </div>
  );
};

export default BackgroundLogo;
