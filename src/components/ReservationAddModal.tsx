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
  
  // 拡張フォームstate
  const [selectedPlan, setSelectedPlan] = useState('');
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [guestCount, setGuestCount] = useState<number>(1);
  const [isVip, setIsVip] = useState(false);

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
        // 拡張フィールド
        guestCount,
        plan: selectedPlan,
        options: selectedOptions,
        notes: additionalNotes,
        isVip: selectedOptions.includes('vip-room'),
      },
    });
    
    // フォームをリセット
    setPrincess('');
    setRequestedTable('');
    setPlannedTime('');
    setBudgetMode('undecided');
    setBudget('');
    setErrors({});
    setGuestCount(1);
    setSelectedPlan('');
    setSelectedOptions([]);
    setAdditionalNotes('');
    setIsVip(false);
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
      className="fixed inset-0 z-[80]"
      onKeyDown={handleKeyDown}
    >
      {/* Black overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-75" />
      
      {/* Modal content - full screen from header */}
      <div className="absolute top-[calc(env(safe-area-inset-top)+32px)] bottom-0 left-0 right-0 bg-[#000000eb]">
        <div className="w-full h-full overflow-y-auto">
          {/* White background section */}
          <div className="bg-white px-5 py-6">
            <h3 id="reservation-add-modal-title" className="text-xl font-bold mb-6">
              来店予約追加
            </h3>

            {/* 基本情報セクション */}
            <div className="space-y-4">
              {/* 姫名 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">姫名</label>
                <input
                  ref={firstInputRef}
                  type="text"
                  value={princess}
                  onChange={(e) => setPrincess(e.target.value)}
                  className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="姫名を入力"
                />
                {errors.princess && (
                  <p className="text-red-500 text-sm mt-1">{errors.princess}</p>
                )}
              </div>

              {/* 人数 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">人数</label>
                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                    className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                  >
                    -
                  </button>
                  <span className="text-lg font-medium w-10 text-center">{guestCount}</span>
                  <button
                    type="button"
                    onClick={() => setGuestCount(guestCount + 1)}
                    className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* 希望卓番号 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">希望卓番号</label>
                <input
                  type="text"
                  value={requestedTable}
                  onChange={(e) => setRequestedTable(e.target.value)}
                  className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="希望卓番号を入力"
                />
              </div>
            </div>
          </div>

          {/* ダークセクション */}
          <div className="bg-[#000000eb] px-5 py-6">
            <div className="space-y-6">
              {/* 時間選択 */}
              <div>
                <label className="block text-sm font-medium text-white mb-3">予定時間</label>
                <div className="grid grid-cols-4 gap-2">
                  {timeOptions.map((time) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => setPlannedTime(time)}
                      className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                        plannedTime === time
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              {/* プラン選択 */}
              <div>
                <label className="block text-sm font-medium text-white mb-3">プラン</label>
                <div className="space-y-2">
                  {['VIPプラン', 'スタンダードプラン', 'カジュアルプラン'].map((plan) => (
                    <button
                      key={plan}
                      type="button"
                      onClick={() => setSelectedPlan(plan)}
                      className={`w-full py-3 px-4 rounded-lg text-left transition-colors ${
                        selectedPlan === plan
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {plan}
                    </button>
                  ))}
                </div>
              </div>

              {/* オプション */}
              <div>
                <label className="block text-sm font-medium text-white mb-3">オプション</label>
                <div className="space-y-2">
                  {[
                    { id: 'vip-room', label: 'VIPルーム' },
                    { id: 'champagne', label: 'シャンパンコール' },
                    { id: 'birthday', label: 'バースデープレート' }
                  ].map((option) => (
                    <label key={option.id} className="flex items-center text-white">
                      <input
                        type="checkbox"
                        checked={selectedOptions.includes(option.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedOptions([...selectedOptions, option.id]);
                          } else {
                            setSelectedOptions(selectedOptions.filter(id => id !== option.id));
                          }
                        }}
                        className="mr-3 rounded"
                      />
                      <span className="text-sm">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 予算 */}
              <div>
                <label className="block text-sm font-medium text-white mb-3">予算</label>
                <select
                  value={budgetMode}
                  onChange={handleBudgetModeChange}
                  className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="undecided">未定</option>
                  <option value="input">金額を入力</option>
                </select>
                
                {budgetMode === 'input' && (
                  <div className="mt-2">
                    <input
                      type="text"
                      value={budget}
                      onChange={handleBudgetChange}
                      className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="予算を入力（円）"
                    />
                    {errors.budget && (
                      <p className="text-red-400 text-sm mt-1">{errors.budget}</p>
                    )}
                  </div>
                )}
              </div>

              {/* 追加メモ */}
              <div>
                <label className="block text-sm font-medium text-white mb-3">追加メモ</label>
                <textarea
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="特別なリクエストやメモがあれば入力"
                />
              </div>
            </div>

            {/* ボタン */}
            <div className="flex justify-between mt-8">
              <button
                onClick={onClose}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                キャンセル
              </button>
              <button
                onClick={handleAdd}
                className="px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
              >
                予約を確定
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};