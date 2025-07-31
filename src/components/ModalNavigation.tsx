import React from "react";

interface ModalNavigationProps {
  onBack: () => void;
  onComplete: () => void;
}

export const ModalNavigation: React.FC<ModalNavigationProps> = ({ onBack, onComplete }) => {

  return (
    <nav className="fixed left-0 right-0 z-[100] flex items-center justify-between px-4" style={{ top: 'env(safe-area-inset-top)', paddingTop: '20px', paddingBottom: '20px' }}>
      <button
        onClick={onBack}
        className="text-white text-base font-medium border-b border-white pb-0.5 hover:opacity-80 transition-opacity"
        type="button"
      >
        戻る
      </button>
      
      <button
        onClick={onComplete}
        className="text-white text-base font-medium border-b border-white pb-0.5 hover:opacity-80 transition-opacity"
        type="button"
      >
        完了
      </button>
    </nav>
  );
};