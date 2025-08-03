import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import ModalNavigation from './ModalNavigation';

interface PrincessDetail {
  id: string;
  name: string;
  memo?: string;
}

interface MemoEditModalProps {
  princess: PrincessDetail;
  onClose: () => void;
  onUpdate: (updatedPrincess: PrincessDetail) => void;
}

const MemoEditModal: React.FC<MemoEditModalProps> = ({ princess, onClose, onUpdate }) => {
  const [memo, setMemo] = useState(princess.memo || '');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('princess_profiles')
        .update({ memo })
        .eq('id', princess.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating memo:', error);
        alert('メモの更新に失敗しました');
        return;
      }

      onUpdate(data);
    } catch (error) {
      console.error('Unexpected error:', error);
      alert('エラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      <ModalNavigation
        title="メモ編集"
        onBack={onClose}
        onAction={handleSave}
        actionText="保存"
        isLoading={loading}
      />

      {/* コンテンツエリア */}
      <div className="flex-1 px-4 pt-4 pb-8 overflow-y-auto">
        <div className="bg-[#2a2a2a] p-4 rounded-lg">
          <textarea
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="メモを入力してください"
            className="w-full h-64 p-3 bg-black text-white rounded-lg resize-none focus:outline-none focus:ring-1 focus:ring-gray-500"
          />
        </div>
      </div>
    </div>
  );
};

export default MemoEditModal;