import React from 'react';

/**
 * 背景ロゴ
 *  - スマホ    : 画面幅 90 vw
 *  - タブレット: 50 vw
 *  - デスクトップ(≥1024px): 40 vw
 *  - 透過 0.06、背面固定
 */
const BackgroundLogo: React.FC = () => (
  <img
    id="bg-logo"
    src="/images/ruberu/logo.png"
    alt="背景ロゴ"
    style={{ opacity: 0.06 }}                /* 透過をインラインで厳密指定 */
    className="
      fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
      w-[90vw]               /* モバイル */
      md:w-[50vw]            /* ≥768px */
      lg:w-[40vw]            /* ≥1024px */
      pointer-events-none select-none
      z-0
    "
  />
);

export default BackgroundLogo;
