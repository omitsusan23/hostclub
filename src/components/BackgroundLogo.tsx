// src/components/BackgroundLogo.tsx
import React from 'react';

const BackgroundLogo: React.FC = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-0">
      <img
        src="/images/logo.png"
        alt="Background Logo"
        style={{
          width: '360px',         // ← サイズを絶対指定
          maxWidth: '90%',        // ← 小さい端末では90%に調整
          opacity: 0.08,          // ← やや薄く（好みで調整可）
        }}
      />
    </div>
  );
};

export default BackgroundLogo;
