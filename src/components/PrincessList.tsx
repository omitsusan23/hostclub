import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useStore } from '../context/StoreContext';
import { PrincessCard } from './PrincessCard';

interface Princess {
  id: string;
  name: string;
  attribute?: string;
  line_name?: string;
  age?: number;
  favorite_drink?: string;
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
        .select('id, name, attribute, line_name, age, favorite_drink, created_at')
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
      <div className="flex flex-col gap-1 px-2">
        {filteredPrincesses.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            姫が登録されていません
          </div>
        ) : (
          filteredPrincesses.map((princess) => (
            <PrincessCard
              key={princess.id}
              name={princess.name}
              attribute={princess.attribute}
              age={princess.age}
              lineName={princess.line_name}
              favoriteDrink={princess.favorite_drink}
              onClick={() => {
                // TODO: 詳細ページへの遷移
                console.log('Princess clicked:', princess.id);
              }}
            />
          ))
        )}
      </div>
    </div>
  );
};