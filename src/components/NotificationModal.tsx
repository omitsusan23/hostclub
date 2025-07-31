import React from 'react';
import { ModalNavigation } from './ModalNavigation';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({ isOpen, onClose }) => {
  // ESCで閉じる、左右の矢印キーを無効化
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
    // 左右の矢印キーでのフォーカス移動を無効化
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  // お知らせ作成完了
  const handleComplete = () => {
    // TODO: Implement notification creation logic
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="notification-modal-title"
      className="fixed inset-0 z-[200]"
      onKeyDown={handleKeyDown}
    >
      {/* Black overlay */}
      <div className="absolute inset-0 bg-black" />
      
      {/* Top black area with checked label */}
      <div className="absolute top-0 left-0 right-0 bg-black" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
        <div className="flex items-center justify-center py-5">
          <div className="flex items-center text-white">
            <div className="w-6 h-6 border-2 border-white rounded flex items-center justify-center mr-3">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-xl font-bold">お知らせ</span>
          </div>
        </div>
      </div>
      
      {/* Fixed Navigation */}
      <ModalNavigation onBack={onClose} onComplete={handleComplete} />
      
      {/* Modal content - full screen from navigation bar */}
      <div className="absolute top-[calc(env(safe-area-inset-top)+120px)] bottom-0 left-0 right-0 bg-black overflow-y-auto">
        <div className="flex flex-col w-[361px] items-start gap-4 mx-auto p-4 pb-8">
          {/* お知らせ内容フォーム */}
          <div className="bg-[#464646] rounded border border-[#d7d7d7] self-stretch">
            <label className="text-[#d7d7d7] text-[13px] block px-3 py-2 border-b border-[#d7d7d7]">お知らせ内容</label>
            <textarea
              className="w-full bg-transparent text-[#d7d7d7] text-[15px] outline-none resize-none placeholder-[#888] px-3 py-3"
              rows={10}
              placeholder="タップで入力"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;