// src/components/BackgroundLogo.tsx
import React from 'react';

/**
 * 背景ロゴ
 *  - モバイル … 画面幅 90 vw
 *  - PC(768px 以上)… 画面幅 60 vw
 */
const BackgroundLogo: React.FC = () => (
  <img
    id="bg-logo"
    src="/images/ruberu/logo.png"
    alt="背景ロゴ"
    className="
      fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
      w-[90vw] md:w-[60vw]        /* ← 幅だけ Tailwind で切替 */
      pointer-events-none select-none
      opacity-6                   /* 0.06 = 6% (Tailwind では 0.06 → 6 で表記) */
      z-0
    "
  />
);

export default BackgroundLogo;
