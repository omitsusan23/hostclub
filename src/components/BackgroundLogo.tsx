// src/components/BackgroundLogo.tsx
import React from 'react';

/**
 * 画面中央に薄く表示する背景ロゴ
 *  - 端末幅の 90% まで拡大（上限 700px）
 *  - クリック／スクロールを邪魔しない
 *  - z-index 0 なので他コンテンツの背面
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
      width: '90vw',      // 画面幅の 90%
      maxWidth: '700px',  // 上限 700px
      opacity: 0.06,      // 薄く
      pointerEvents: 'none',
      userSelect: 'none',
      zIndex: 0,
      // 幅 360px 以下の端末（iPhone SE 等）はさらに広げる
      ['@media(max-width:360px)']: {
        width: '95vw',
      },
    }}
  />
);

/* ★ 忘れずに default export */
export default BackgroundLogo;
