// src/components/BackgroundLogo.tsx
import React from 'react';

/**
 * 背景ロゴ（画面幅の 90% で上限なし）
 *  - 端末ごとに自動拡大：width 90vw
 *  - pointerEvents なしで操作を邪魔しない
 *  - z-index 0 で最背面
 */
const BackgroundLogo: React.FC = () => (
  <img
    id="bg-logo"
    src="/images/logo.png"
    alt="背景ロゴ"
    style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '90vw',       // ← 画面幅の 90%（上限を取っ払いました）
      opacity: 0.06,       // 薄く
      pointerEvents: 'none',
      userSelect: 'none',
      zIndex: 0,
    }}
  />
);

export default BackgroundLogo;
