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
  const [chipMassInput, setChipMassInput] = useState('');
  const [plan, setPlan] = useState('');
  const [budget, setBudget] = useState('');
  const [requestNumber, setRequestNumber] = useState('');
  const [single, setSingle] = useState('');
  const [drink, setDrink] = useState('');
  const [decoKeep, setDecoKeep] = useState('');
  const [notes, setNotes] = useState('');

  // フォーカス用ref
  const firstInputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (isOpen) {
      firstInputRef.current?.focus();
    }
  }, [isOpen]);

  // ESCで閉じる
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
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
      className="fixed inset-0 z-[80]"
      onKeyDown={handleKeyDown}
    >
      {/* Black overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-75" />
      
      {/* Fixed Navigation */}
      <ModalNavigation onBack={onClose} onComplete={handleAdd} />
      
      {/* Modal content - full screen from navigation bar */}
      <div className="absolute top-[calc(env(safe-area-inset-top)+80px)] bottom-0 left-0 right-0 bg-black overflow-y-auto">
        <div className="flex flex-col w-[361px] items-start gap-4 mx-auto mt-4">
          {/* Profile Section */}
          <header className="flex items-center gap-[17px] relative self-stretch w-full">
            <div className="relative w-[60px] h-[60px]">
              <div className="absolute inset-0 rounded-full border-[3px] border-[#cdb05a] bg-gray-300"></div>
            </div>
            <div className="flex flex-col items-start gap-[3px] flex-1">
              <div className="flex items-center gap-2">
                <span className="text-[#d7d7d7] text-[13px] leading-[normal]">担当</span>
                <span className="bg-[#464646] text-[#d7d7d7] px-[6px] py-[2px] rounded text-[11px] leading-[normal]">主任</span>
              </div>
              <div className="flex items-center gap-2 self-stretch">
                <span className="text-[#d7d7d7] text-[13px] leading-[normal]">名前</span>
                <input
                  ref={firstInputRef}
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="flex-1 bg-transparent text-[#d7d7d7] text-[13px] outline-none placeholder-[#888]"
                  placeholder="タップで入力"
                />
              </div>
            </div>
          </header>

          {/* Form Fields */}
          <div className="flex flex-col items-start gap-2 self-stretch">
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

            {/* チップマス入力 */}
            <div className="flex items-center self-stretch h-[44px] bg-[#464646] rounded border border-[#d7d7d7]">
              <label className="text-[#d7d7d7] text-[15px] pl-3 pr-2 whitespace-nowrap">チップマス入力</label>
              <input
                type="text"
                value={chipMassInput}
                onChange={(e) => setChipMassInput(e.target.value)}
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

            {/* 要望卓番号 */}
            <div className="flex items-center self-stretch h-[44px] bg-[#464646] rounded border border-[#d7d7d7]">
              <label className="text-[#d7d7d7] text-[15px] pl-3 pr-2 whitespace-nowrap">要望卓番号</label>
              <input
                type="text"
                value={requestNumber}
                onChange={(e) => setRequestNumber(e.target.value)}
                className="flex-1 bg-transparent text-[#d7d7d7] text-[15px] outline-none pr-3 text-right placeholder-[#888]"
                placeholder="タップで入力"
              />
            </div>

            {/* 単価 */}
            <div className="flex items-center self-stretch h-[44px] bg-[#464646] rounded border border-[#d7d7d7]">
              <label className="text-[#d7d7d7] text-[15px] pl-3 pr-2 whitespace-nowrap">単価</label>
              <input
                type="text"
                value={single}
                onChange={(e) => setSingle(e.target.value)}
                className="flex-1 bg-transparent text-[#d7d7d7] text-[15px] outline-none pr-3 text-right placeholder-[#888]"
                placeholder="タップで入力"
              />
            </div>

            {/* 飲直 */}
            <div className="flex items-center self-stretch h-[44px] bg-[#464646] rounded border border-[#d7d7d7]">
              <label className="text-[#d7d7d7] text-[15px] pl-3 pr-2 whitespace-nowrap">飲直</label>
              <input
                type="text"
                value={drink}
                onChange={(e) => setDrink(e.target.value)}
                className="flex-1 bg-transparent text-[#d7d7d7] text-[15px] outline-none pr-3 text-right placeholder-[#888]"
                placeholder="タップで入力"
              />
            </div>
          </div>

          {/* その他 Section */}
          <div className="text-[#d7d7d7] text-[15px] font-medium self-stretch">その他</div>

          {/* デコネーム・キープ */}
          <div className="flex flex-col gap-2 self-stretch">
            <label className="text-[#d7d7d7] text-[13px]">デコネーム・キープ</label>
            <div className="bg-[#464646] rounded border border-[#d7d7d7] p-3">
              <textarea
                value={decoKeep}
                onChange={(e) => setDecoKeep(e.target.value)}
                className="w-full bg-transparent text-[#d7d7d7] text-[15px] outline-none resize-none"
                rows={2}
                placeholder="タップで入力"
              />
            </div>
          </div>

          {/* 備考 */}
          <div className="flex flex-col gap-2 self-stretch mb-8">
            <label className="text-[#d7d7d7] text-[13px]">備考</label>
            <div className="bg-[#464646] rounded border border-[#d7d7d7] p-3">
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-transparent text-[#d7d7d7] text-[15px] outline-none resize-none"
                rows={3}
                placeholder="タップで入力"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};