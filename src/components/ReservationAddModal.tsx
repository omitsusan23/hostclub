import React, { useState, useRef, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';

interface ReservationAddModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReservationAddModal: React.FC<ReservationAddModalProps> = ({ isOpen, onClose }) => {
  const { dispatch } = useAppContext();
  
  // フォーム入力state
  const [princess, setPrincess] = useState('');
  const [requestedTable, setRequestedTable] = useState('');
  const [plannedTime, setPlannedTime] = useState('');
  const [budgetMode, setBudgetMode] = useState<'undecided' | 'input'>('undecided');
  const [budget, setBudget] = useState<number | ''>('');
  const [errors, setErrors] = useState<{ princess?: string; budget?: string }>({});

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

  // バリデーション
  const validate = () => {
    const newErrors: typeof errors = {};
    if (!princess.trim()) newErrors.princess = '姫名を入力してください';
    if (budgetMode === 'input' && (budget === '' || isNaN(budget as number))) {
      newErrors.budget = '予算を入力してください';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 予約追加
  const handleAdd = () => {
    if (!validate()) return;
    
    dispatch({
      type: 'ADD_RESERVATION',
      payload: {
        id: Date.now().toString(),
        princess: princess.trim(),
        requestedTable: requestedTable.trim(),
        time: plannedTime,
        budget: budgetMode === 'input' ? Number(budget) : 0,
      },
    });
    
    // フォームをリセット
    setPrincess('');
    setRequestedTable('');
    setPlannedTime('');
    setBudgetMode('undecided');
    setBudget('');
    setErrors({});
    onClose();
  };

  const handleBudgetModeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setBudgetMode(e.target.value as 'undecided' | 'input');
    setBudget('');
    setErrors((prev) => ({ ...prev, budget: undefined }));
  };

  const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (/^\d*$/.test(val)) {
      setBudget(val === '' ? '' : Number(val));
      setErrors((prev) => ({ ...prev, budget: undefined }));
    } else {
      setErrors((prev) => ({ ...prev, budget: '許可されていない文字です' }));
    }
  };

  // 時間の選択肢を生成
  const generateTimeOptions = (): string[] => {
    const opts: string[] = [];
    for (let h = 19; h <= 25; h++) {
      for (const m of [0, 15, 30, 45]) {
        if (h === 25 && m > 0) continue;
        const hh = h.toString().padStart(2, '0');
        const mm = m.toString().padStart(2, '0');
        opts.push(`${hh}:${mm}`);
      }
    }
    return opts;
  };
  const timeOptions = generateTimeOptions();

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="reservation-add-modal-title"
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onKeyDown={handleKeyDown}
    >
      <div className="bg-white p-6 rounded-lg w-full max-w-md mx-4">
        <h3 id="reservation-add-modal-title" className="text-lg font-semibold mb-4">
          来店予約追加
        </h3>

        {/* 姫名 */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">姫名</label>
          <input
            ref={firstInputRef}
            type="text"
            value={princess}
            onChange={(e) => setPrincess(e.target.value)}
            className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="姫名を入力"
          />
          {errors.princess && (
            <p className="text-red-500 text-sm mt-1">{errors.princess}</p>
          )}
        </div>

        {/* 希望卓番号 */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">希望卓番号</label>
          <input
            type="text"
            value={requestedTable}
            onChange={(e) => setRequestedTable(e.target.value)}
            className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="希望卓番号を入力"
          />
        </div>

        {/* 予定時間 */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">予定時間</label>
          <select
            value={plannedTime}
            onChange={(e) => setPlannedTime(e.target.value)}
            className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">選択してください</option>
            {timeOptions.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
        </div>

        {/* 予算 */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">予算</label>
          <select
            value={budgetMode}
            onChange={handleBudgetModeChange}
            className="border border-gray-300 p-2 w-full rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="undecided">未定</option>
            <option value="input">金額を入力</option>
          </select>
          
          {budgetMode === 'input' && (
            <>
              <input
                type="text"
                value={budget}
                onChange={handleBudgetChange}
                className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="予算を入力（円）"
              />
              {errors.budget && (
                <p className="text-red-500 text-sm mt-1">{errors.budget}</p>
              )}
            </>
          )}
        </div>

        {/* ボタン */}
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
          >
            キャンセル
          </button>
          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            追加
          </button>
        </div>
      </div>
    </div>
  );
};