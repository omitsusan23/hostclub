const BackgroundLogo: React.FC = () => (
  <img
    id="bg-logo"
    src="/images/logo.png"
    alt="背景ロゴ"
    style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%,-50%)',
      width: '90vw',      // ← 80vw → 90vw へ
      maxWidth: '700px',  // ← 600 → 700 に上限拡大
      opacity: 0.06,
      pointerEvents: 'none',
      zIndex: 0,
      userSelect: 'none',
    }}
  />
);
