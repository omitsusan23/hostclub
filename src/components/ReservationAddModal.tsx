import React, { useState, useRef, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { ModalNavigation } from './ModalNavigation';

interface ReservationAddModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReservationAddModal: React.FC<ReservationAddModalProps> = ({ isOpen, onClose }) => {
  const { dispatch } = useAppContext();
  
  // フォーム入力state
  const [personInCharge, setPersonInCharge] = useState('');
  const [name, setName] = useState('');
  const [plannedEntryTime, setPlannedEntryTime] = useState('');
  const [plan, setPlan] = useState('');
  const [budget, setBudget] = useState('');
  const [requestNumber, setRequestNumber] = useState('');
  const [single, setSingle] = useState('');
  const [requestHelp, setRequestHelp] = useState('');
  const [decoKeep, setDecoKeep] = useState('');
  const [notes, setNotes] = useState('');

  // フォーカス用ref
  const firstInputRef = useRef<HTMLInputElement>(null);
  
  // Auto-focus disabled as per user request
  // useEffect(() => {
  //   if (isOpen) {
  //     firstInputRef.current?.focus();
  //   }
  // }, [isOpen]);

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

  // 予約追加
  const handleAdd = () => {
    // TODO: Implement reservation add logic
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="reservation-add-modal-title"
      className="fixed inset-0 z-[200]"
      onKeyDown={handleKeyDown}
    >
      {/* Black overlay */}
      <div className="absolute inset-0 bg-black" />
      
      {/* Top black area with checked label */}
      <div className="absolute top-0 left-0 right-0 bg-black z-[95]" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
        <div className="flex items-center justify-center py-5">
          <div className="flex items-center text-white">
            <div className="w-6 h-6 border-2 border-white rounded flex items-center justify-center mr-3">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-xl font-bold">来店予約追加</span>
          </div>
        </div>
      </div>
      
      {/* Fixed Navigation - 戻るのみ */}
      <ModalNavigation onBack={onClose} />
      
      {/* Modal content - full screen from navigation bar */}
      <div className="absolute top-[calc(env(safe-area-inset-top)+64px)] bottom-0 left-0 right-0 bg-black overflow-y-auto">
        <div className="flex flex-col w-[361px] items-start gap-4 mx-auto p-4 pb-8">
          {/* Form Fields */}
          <div className="flex flex-col items-start gap-2 self-stretch">
            {/* 名前 */}
            <div className="flex items-center self-stretch h-[44px] bg-[#464646] rounded border border-[#d7d7d7]">
              <label className="text-[#d7d7d7] text-[15px] pl-3 pr-2 whitespace-nowrap">名前</label>
              <input
                ref={firstInputRef}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="flex-1 bg-transparent text-[#d7d7d7] text-[15px] outline-none pr-3 text-right placeholder-[#888]"
                placeholder="タップで入力"
              />
            </div>
            {/* 入店予定時間 */}
            <div className="flex items-center self-stretch h-[44px] bg-[#464646] rounded border border-[#d7d7d7]">
              <label className="text-[#d7d7d7] text-[15px] pl-3 pr-2 whitespace-nowrap">入店予定時間</label>
              <input
                type="text"
                value={plannedEntryTime}
                onChange={(e) => setPlannedEntryTime(e.target.value)}
                className="flex-1 bg-transparent text-[#d7d7d7] text-[15px] outline-none pr-3 text-right placeholder-[#888]"
                placeholder="タップで入力"
              />
            </div>

            {/* プラン */}
            <div className="flex items-center self-stretch h-[44px] bg-[#464646] rounded border border-[#d7d7d7]">
              <label className="text-[#d7d7d7] text-[15px] pl-3 pr-2 whitespace-nowrap">プラン</label>
              <input
                type="text"
                value={plan}
                onChange={(e) => setPlan(e.target.value)}
                className="flex-1 bg-transparent text-[#d7d7d7] text-[15px] outline-none pr-3 text-right placeholder-[#888]"
                placeholder="タップで入力"
              />
            </div>

            {/* 予算/単価 */}
            <div className="flex items-center self-stretch h-[44px] bg-[#464646] rounded border border-[#d7d7d7]">
              <label className="text-[#d7d7d7] text-[15px] pl-3 pr-2 whitespace-nowrap">予算/単価</label>
              <input
                type="text"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="flex-1 bg-transparent text-[#d7d7d7] text-[15px] outline-none pr-3 text-right placeholder-[#888]"
                placeholder="タップで入力"
              />
            </div>

            {/* 希望卓 */}
            <div className="flex items-center self-stretch h-[44px] bg-[#464646] rounded border border-[#d7d7d7]">
              <label className="text-[#d7d7d7] text-[15px] pl-3 pr-2 whitespace-nowrap">希望卓</label>
              <input
                type="text"
                value={requestNumber}
                onChange={(e) => setRequestNumber(e.target.value)}
                className="flex-1 bg-transparent text-[#d7d7d7] text-[15px] outline-none pr-3 text-right placeholder-[#888]"
                placeholder="タップで入力"
              />
            </div>

            {/* 希望ヘルプ */}
            <div className="flex items-center self-stretch h-[44px] bg-[#464646] rounded border border-[#d7d7d7]">
              <label className="text-[#d7d7d7] text-[15px] pl-3 pr-2 whitespace-nowrap">希望ヘルプ</label>
              <input
                type="text"
                value={requestHelp}
                onChange={(e) => setRequestHelp(e.target.value)}
                className="flex-1 bg-transparent text-[#d7d7d7] text-[15px] outline-none pr-3 text-right placeholder-[#888]"
                placeholder="タップで入力"
              />
            </div>

          </div>

          {/* 飾り・キープ */}
          <div className="bg-[#464646] rounded border border-[#d7d7d7] self-stretch">
            <label className="text-[#d7d7d7] text-[13px] block px-3 py-2 border-b border-[#d7d7d7]">飾り・キープ</label>
            <textarea
              value={decoKeep}
              onChange={(e) => setDecoKeep(e.target.value)}
              className="w-full bg-transparent text-[#d7d7d7] text-[15px] outline-none resize-none placeholder-[#888] px-3 py-3"
              rows={2}
              placeholder="タップで入力"
            />
          </div>

          {/* 備考 */}
          <div className="bg-[#464646] rounded border border-[#d7d7d7] self-stretch">
            <label className="text-[#d7d7d7] text-[13px] block px-3 py-2 border-b border-[#d7d7d7]">備考</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-transparent text-[#d7d7d7] text-[15px] outline-none resize-none placeholder-[#888] px-3 py-3"
              rows={3}
              placeholder="タップで入力"
            />
          </div>
        </div>
      </div>
    </div>
  );
};