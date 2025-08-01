import React, { useState } from 'react';
import { ModalNavigation } from './ModalNavigation';
import { BasicInfoSection } from './BasicInfoSection';

interface PrincessAddModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrincessAddModal: React.FC<PrincessAddModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    lineName: '',
    attribute: ''
  });

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

  // フォームフィールドの更新
  const handleFieldChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // 姫追加完了
  const handleRegister = () => {
    // TODO: Implement princess registration logic
    console.log('Registering princess:', formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="princess-add-modal-title"
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
            <span className="text-xl font-bold">姫追加</span>
          </div>
        </div>
      </div>
      
      {/* Fixed Navigation - 戻ると登録 */}
      <ModalNavigation onBack={onClose} onComplete={handleRegister} completeText="登録" />
      
      {/* Modal content - full screen from navigation bar */}
      <div className="absolute top-[calc(env(safe-area-inset-top)+120px)] bottom-0 left-0 right-0 bg-black overflow-y-auto">
        <div className="p-4">
          <BasicInfoSection 
            formData={formData}
            onChange={handleFieldChange}
          />
        </div>
      </div>
    </div>
  );
};

export default PrincessAddModal;