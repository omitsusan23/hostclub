// src/components/BackgroundLogo.tsx
import React from 'react';

/**
 * 背景ロゴ（画面幅の 90% ／上限なし）
 *  - 端末幅に応じて自動拡大（width 90vw）
 *  - pointerEvents なしで UI 操作を邪魔しない
 *  - z-index 0 で最背面に配置
 */
const BackgroundLogo: React.FC = () => (
  <img
    id="bg-logo"
    src="/images/ruberu/logo.png"     {/* ← 生成されたパスに変更 */}
    alt="背景ロゴ"
    style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '90vw',      // 画面幅の 90%
      opacity: 0.06,      // 薄く表示
      pointerEvents: 'none',
      userSelect: 'none',
      zIndex: 0,
    }}
  />
);

export default BackgroundLogo;
