// src/components/BackgroundLogo.tsx
import React from 'react';

/** -------------------------------------------------------
 *  中央に “必ず” 大きく表示される背景ロゴ
 *  ----------------------------------------------------- */
const BackgroundLogo: React.FC = () => (
  <img
    id="bg-logo"                    /* DevTools で探しやすく */
    src="/images/logo.png"
    alt="背景ロゴ"
    style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '80vw',                // 画面幅の 80%
      maxWidth: '600px',            // 上限 600px
      opacity: 0.06,                // 薄さ
      pointerEvents: 'none',
      zIndex: 0,
      userSelect: 'none',
    }}
  />
);

export default BackgroundLogo;
