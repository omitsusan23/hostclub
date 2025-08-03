import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useStore } from '../context/StoreContext';

interface Princess {
  id: string;
  name: string;
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

  useEffect(() => {
    if (isOpen && currentStore?.id) {
      fetchPrincesses();
    }
  }, [isOpen, currentStore]);

  const fetchPrincesses = async () => {
    if (!currentStore?.id) return;

    try {
      const { data, error } = await supabase
        .from('princess_profiles')
        .select('id, name')
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
      
      {/* Modal Content */}
      <div className="relative bg-black w-full max-h-[60vh] rounded-t-2xl overflow-hidden">
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

        {/* Content */}
        <div className="flex flex-col items-center justify-center flex-1 overflow-y-auto">
          {loading ? (
            <div className="text-white text-center py-8">読み込み中...</div>
          ) : princesses.length === 0 ? (
            <div className="text-gray-400 text-center py-8">姫が登録されていません</div>
          ) : (
            <div className="w-full px-4 py-6">
              {princesses.map((princess, index) => {
                const isSelected = princess.name === selectedName;
                const isAdjacent = princesses.findIndex(p => p.name === selectedName);
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
};