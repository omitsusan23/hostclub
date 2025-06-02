// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    // カスタムブレークポイントの定義
    screens: {
      sm: '480px',    // スマホ大
      md: '768px',    // タブレット
      lg: '1024px',   // PC小
      xl: '1280px',   // PC中
      '2xl': '1536px' // PC大
    },
    extend: {
      // コンテナ設定の拡張
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem', // 全体の基本余白
          sm: '1rem',      // sm 以上
          md: '2rem',      // md 以上
          lg: '4rem',      // lg 以上
          xl: '5rem',      // xl 以上
          '2xl': '6rem'    // 2xl 以上
        }
      },
      // フォントファミリーの拡張
      fontFamily: {
        tamanegi: ['TamanegiKaisho', 'sans-serif']
      }
    }
  },
  plugins: []
}
