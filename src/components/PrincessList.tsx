import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useStore } from '../context/StoreContext';

interface Princess {
  id: string;
  name: string;
  attribute?: string;
  line_name?: string;
  created_at: string;
}

export const PrincessList: React.FC = () => {
  const { currentStore } = useStore();
  const [princesses, setPrincesses] = useState<Princess[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPrincesses();
  }, [currentStore]);

  const fetchPrincesses = async () => {
    if (!currentStore?.id) return;

    try {
      const { data, error } = await supabase
        .from('princess_profiles')
        .select('id, name, attribute, line_name, created_at')
        .eq('store_id', currentStore.id)
        .order('created_at', { ascending: false });

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

  // 検索フィルター
  const filteredPrincesses = princesses.filter(princess =>
    princess.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="text-center py-4 text-white">読み込み中...</div>;
  }

  return (
    <div className="flex flex-col">
      {/* 検索バー */}
      <div className="p-2">
        <div className="relative w-full h-[31px] bg-[#d7d7d7] rounded-lg overflow-hidden">
          <div className="absolute inset-0 flex items-center px-2">
            <svg 
              className="w-[21px] h-[21px] mr-2" 
              fill="none" 
              stroke="#525154" 
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
              className="flex-1 bg-transparent text-[#525154] text-[15px] font-bold outline-none placeholder-[#525154]"
            />
          </div>
        </div>
      </div>

      {/* フィルターボタン */}
      <div className="flex gap-2 px-2 mb-3">
        <button className="px-3 py-1 bg-black border border-white rounded text-white text-sm">
          並び順
        </button>
        <button className="px-3 py-1 bg-black border border-white rounded text-white text-sm">
          絞り込む
        </button>
      </div>

      {/* 姫リスト */}
      <div className="flex flex-col">
        {filteredPrincesses.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            姫が登録されていません
          </div>
        ) : (
          filteredPrincesses.map((princess) => (
            <div
              key={princess.id}
              className="flex items-center h-[60px] px-4 bg-[#464646] border-b border-[#5a5a5a] active:bg-[#525252]"
            >
              {/* アイコン部分 - 属性を表示 */}
              <div className="w-[45px] h-[45px] rounded-full bg-white flex items-center justify-center mr-3">
                <span className="text-black text-xs font-bold">
                  {princess.attribute ? princess.attribute.slice(0, 4) : '新規'}
                </span>
              </div>
              
              {/* 名前部分 */}
              <div className="flex-1">
                <div className="text-white text-[17px] font-bold">
                  {princess.name}
                </div>
                {princess.line_name && (
                  <div className="text-gray-400 text-[13px]">
                    LINE: {princess.line_name}
                  </div>
                )}
              </div>
              
              {/* 矢印アイコン */}
              <svg 
                className="w-5 h-5 text-gray-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="m9 5 7 7-7 7" 
                />
              </svg>
            </div>
          ))
        )}
      </div>
    </div>
  );
};