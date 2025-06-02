import React from 'react';

const BackgroundLogo: React.FC = () => (
  <img
    src="/images/logo.png"
    alt="背景ロゴ"
    style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '60vw',
      maxWidth: '500px',
      opacity: 0.06,
      pointerEvents: 'none',
      zIndex: 0,
    }}
  />
);

// ★ これを必ず付ける
export default BackgroundLogo;
