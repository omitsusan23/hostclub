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
      className="fixed inset-0 z-[40]"
      onKeyDown={handleKeyDown}
    >
      {/* Black overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-75" />
      
      {/* Fixed Navigation */}
      <ModalNavigation onBack={onClose} onComplete={handleAdd} />
      
      {/* Modal content - full screen from navigation bar */}
      <div className="absolute top-[calc(env(safe-area-inset-top)+80px)] bottom-0 left-0 right-0 bg-black overflow-y-auto">
        <div className="flex flex-col w-[361px] items-start gap-4 mx-auto mt-4 mb-8">
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

            {/* 飾り・キープ */}
            <div className="flex items-center self-stretch h-[44px] bg-[#464646] rounded border border-[#d7d7d7]">
              <label className="text-[#d7d7d7] text-[15px] pl-3 pr-2 whitespace-nowrap">飾り・キープ</label>
              <input
                type="text"
                value={decoKeep}
                onChange={(e) => setDecoKeep(e.target.value)}
                className="flex-1 bg-transparent text-[#d7d7d7] text-[15px] outline-none pr-3 text-right placeholder-[#888]"
                placeholder="タップで入力"
              />
            </div>

            {/* 備考 */}
            <div className="flex items-center self-stretch h-[44px] bg-[#464646] rounded border border-[#d7d7d7]">
              <label className="text-[#d7d7d7] text-[15px] pl-3 pr-2 whitespace-nowrap">備考</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="flex-1 bg-transparent text-[#d7d7d7] text-[15px] outline-none pr-3 text-right placeholder-[#888]"
                placeholder="タップで入力"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};