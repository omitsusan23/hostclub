import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useStore } from '../context/StoreContext';

interface Princess {
  id: string;
  name: string;
  line_name?: string;
}

interface NameSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedName: string;
  onNameSelect: (name: string) => void;
}

export const NameSelectModal: React.FC<NameSelectModalProps> = ({
  isOpen,
  onClose,
  selectedName,
  onNameSelect,
}) => {
  const { currentStore } = useStore();
  const [princesses, setPrincesses] = useState<Princess[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  // 検索フィルター（名前とLine名の両方で検索）- useEffectより前に定義
  const filteredPrincesses = princesses.filter(princess => {
    const searchLower = searchTerm.toLowerCase();
    const nameMatch = princess.name.toLowerCase().includes(searchLower);
    const lineNameMatch = princess.line_name?.toLowerCase().includes(searchLower) || false;
    return nameMatch || lineNameMatch;
  });

  useEffect(() => {
    if (isOpen && currentStore?.id) {
      fetchPrincesses();
    }
  }, [isOpen, currentStore]);

  // 選択されたアイテムにスクロール
  useEffect(() => {
    if (isOpen && filteredPrincesses.length > 0 && scrollRef.current) {
      const selectedIndex = filteredPrincesses.findIndex(p => p.name === selectedName);
      if (selectedIndex !== -1) {
        // 選択アイテムが中央に来るように、上に1つ半分見える位置にスクロール
        const scrollPosition = (selectedIndex - 1.8) * 44; // 44px = h-11
        scrollRef.current.scrollTop = Math.max(0, scrollPosition);
      }
    }
  }, [isOpen, filteredPrincesses, selectedName]);

  const fetchPrincesses = async () => {
    if (!currentStore?.id) return;

    try {
      const { data, error } = await supabase
        .from('princess_profiles')
        .select('id, name, line_name')
        .eq('store_id', currentStore.id)
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching princesses:', error);
        return;
      }

      setPrincesses(data || []);
    } catch (error) {
      console.error('Unexpected error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNameSelect = (name: string) => {
    onNameSelect(name);
    onClose();
  };


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-end justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50" 
        onClick={onClose}
      />
      
      {/* Modal Content - 画面の半分固定 */}
      <div className="relative bg-black w-full h-[50vh] rounded-t-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#38383a]">
          <h2 className="text-white text-lg font-semibold">名前を選択</h2>
          <button
            onClick={onClose}
            className="text-white text-base font-medium border-b border-white pb-0.5"
          >
            完了
          </button>
        </div>

        {/* 検索バー */}
        <div className="p-4">
          <div className="relative w-full h-[36px] bg-[#1c1c1e] rounded-lg overflow-hidden border border-[#38383a]">
            <div className="absolute inset-0 flex items-center px-3">
              <svg 
                className="w-5 h-5 mr-2" 
                fill="none" 
                stroke="#8e8e93" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="m21 21-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z" 
                />
              </svg>
              <input
                type="text"
                placeholder="検索"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 bg-transparent text-white text-[15px] outline-none placeholder-[#8e8e93]"
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col items-center justify-center flex-1 overflow-y-auto">
          {loading ? (
            <div className="text-white text-center py-8">読み込み中...</div>
          ) : filteredPrincesses.length === 0 ? (
            <div className="text-gray-400 text-center py-8">
              {searchTerm ? '検索結果がありません' : '姫が登録されていません'}
            </div>
          ) : (
            <div ref={scrollRef} className="w-full overflow-y-auto">
              {/* 上部パディング */}
              <div className="h-[calc(50%-22px)]" />
              {filteredPrincesses.map((princess, index) => {
                const isSelected = princess.name === selectedName;
                const isAdjacent = filteredPrincesses.findIndex(p => p.name === selectedName);
                const isAboveSelected = index === isAdjacent - 1;
                const isBelowSelected = index === isAdjacent + 1;
                
                return (
                  <div
                    key={princess.id}
                    onClick={() => handleNameSelect(princess.name)}
                    className={`
                      relative cursor-pointer
                      ${isSelected 
                        ? "w-[370px] h-[38px] bg-[#9191917d] rounded-[10px] overflow-hidden mx-auto" 
                        : "h-11 w-full"
                      }
                    `}
                  >
                    <div
                      className={`
                        ${isSelected 
                          ? "absolute w-[402px] h-11 -top-1 -left-4 text-white text-2xl leading-[28.8px]" 
                          : `relative ${isAboveSelected || isBelowSelected 
                              ? "text-[#999999] text-[22px] leading-[26.4px]" 
                              : "text-[#666666] text-xl leading-6"
                            }`
                        } 
                        font-normal text-center tracking-[0]
                      `}
                    >
                      {princess.name}
                    </div>
                  </div>
                );
              })}
              {/* 下部パディング */}
              <div className="h-[calc(50%-22px)]" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};