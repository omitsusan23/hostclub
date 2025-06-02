// src/components/BackgroundLogo.tsx
import React from 'react';

/**
 * 背景ロゴ
 *  - 画面幅の 90% で自動拡大
 *  - pointerEvents なしで UI 操作を邪魔しない
 *  - z-index 0 で最背面
 */
const BackgroundLogo: React.FC = () => (
  <img
    id="bg-logo"
    src="/images/ruberu/logo.png"   /* 生成されたトリム済みロゴ */
    alt="背景ロゴ"
    style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '90vw',
      opacity: 0.06,
      pointerEvents: 'none',
      userSelect: 'none',
      zIndex: 0,
    }}
  />
);

export default BackgroundLogo;
