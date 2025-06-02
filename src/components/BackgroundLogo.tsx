// src/components/BackgroundLogo.tsx
import React, { useEffect } from 'react';

const BackgroundLogo: React.FC = () => {
  useEffect(() => {
    const el = document.getElementById('bg-logo');
    if (el) {
      el.style.position = 'fixed';
      el.style.top = '50%';
      el.style.left = '50%';
      el.style.transform = 'translate(-50%, -50%)';
      el.style.zIndex = '0';
      el.style.opacity = '0.05';
      el.style.pointerEvents = 'none';
    }
  }, []);

  return (
    <img
      id="bg-logo"
      src="/images/logo.png"
      alt="Background Logo"
      style={{
        width: '380px',      // ← 実寸指定
        maxWidth: '90vw',
        userSelect: 'none',
        position: 'fixed',
      }}
    />
  );
};

export default BackgroundLogo;
