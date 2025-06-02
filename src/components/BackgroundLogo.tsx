// src/components/BackgroundLogo.tsx
import React from 'react';

const BackgroundLogo: React.FC = () => {
  return (
    <img
      src="/images/logo.png"
      alt="背景ロゴ"
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: '60vw',            // ビューポート幅の60%に拡大（Figmaに近づける）
        maxWidth: '500px',        // 最大サイズ（安全）
        transform: 'translate(-50%, -50%)',
        opacity: 0.07,
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
};

export default BackgroundLogo;
