import React, { useState } from 'react';
import { ModalNavigation } from './ModalNavigation';

interface PrincessAddModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrincessAddModal: React.FC<PrincessAddModalProps> = ({ isOpen, onClose }) => {
  // フォーム入力state
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');

  // ESCで閉じる
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  // 姫追加
  const handleAdd = () => {
    // TODO: Implement princess add logic
    console.log('姫追加:', { name, phoneNumber, email, notes });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex items-center justify-center"
      onKeyDown={handleKeyDown}
    >
      <div 
        className="bg-gray-100 w-full h-full max-w-[390px] max-h-[844px] overflow-hidden"
        style={{ paddingTop: 'env(safe-area-inset-top)' }}
      >
        {/* ヘッダー */}
        <div className="bg-white p-4 text-center text-lg font-bold">
          新規姫追加
        </div>

        {/* ナビゲーション */}
        <ModalNavigation
          onPrev={() => {}}
          onNext={() => {}}
          onClose={onClose}
          isFirstPage={true}
          isLastPage={true}
          onConfirm={handleAdd}
        />

        {/* フォーム */}
        <div className="p-4 space-y-4" style={{ paddingTop: 'calc(env(safe-area-inset-top) + 120px)' }}>
          <p className="text-center text-gray-600 mb-6">
            新規姫追加フォーム（今後実装予定）
          </p>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">名前</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg"
              placeholder="山田ななみ"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">電話番号</label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg"
              placeholder="090-1234-5678"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">メールアドレス</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg"
              placeholder="example@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">備考</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg"
              rows={3}
              placeholder="メモを入力"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrincessAddModal;