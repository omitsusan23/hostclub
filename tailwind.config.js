// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  /* どのファイル内のクラスを抽出するか */
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],

  /* ────────── 追加: ビルド時に残すユーティリティ ────────── */
  safelist: [
    'w-[90vw]',  // モバイル用
    'w-[50vw]',  // タブレット用
    'w-[40vw]'   // デスクトップ用
  ],

  /* ────────── テーマ設定 ────────── */
  theme: {
    /* カスタムブレークポイント */
    screens: {
      sm:  '480px',  // スマホ大
      md:  '768px',  // タブレット
      lg: '1024px',  // PC小
      xl: '1280px',  // PC中
      '2xl': '1536px' // PC大
    },

    extend: {
      /* コンテナ設定 */
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm:  '1rem',
          md:  '2rem',
          lg:  '4rem',
          xl:  '5rem',
          '2xl': '6rem',
        },
      },

      /* フォントファミリー */
      fontFamily: {
        tamanegi: ['TamanegiKaisho', 'sans-serif'],
      },
    },
  },

  plugins: [],
};
