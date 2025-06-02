// src/components/BackgroundLogo.tsx
const BackgroundLogo: React.FC = () => (
  <img
    src="/images/logo.png"
    alt="bg"
    style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '90vw',      // ← 画面幅の 90% に
      maxWidth: '700px',  // ← 大きく上限を張る
      opacity: 0.05,
      pointerEvents: 'none',
      zIndex: 0,
    }}
  />
);
