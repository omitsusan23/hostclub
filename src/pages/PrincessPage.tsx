import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { useAppContext } from '../context/AppContext';
import { supabase } from '../lib/supabaseClient';
import { useStore } from '../context/StoreContext';
import { PrincessCard } from '../components/PrincessCard';
import { PrincessAddModal } from '../components/PrincessAddModal';

interface Princess {
  id: string;
  name: string;
  attribute?: string;
  age?: number;
  line_name?: string;
  favorite_drink?: string;
  birth_year?: number;
  birth_date?: string;
  current_residence?: string;
  birthplace?: string;
  blood_type?: string;
  occupation?: string;
  contact_time?: string;
  favorite_cigarette?: string;
  bottle_name?: string;
  favorite_help?: string;
  hobby?: string;
  specialty?: string;
  holiday?: string;
  favorite_brand?: string;
  marriage?: string;
  children?: string;
  partner?: string;
}

const PrincessPage: React.FC = () => {
  const { state } = useAppContext();
  const { currentStore } = useStore();
  const [princesses, setPrincesses] = useState<Princess[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Supabaseから姫情報を取得
  useEffect(() => {
    fetchPrincesses();
  }, [currentStore]);

  const fetchPrincesses = async () => {
    if (!currentStore?.id) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('princess_profiles')
        .select('*')
        .eq('store_id', currentStore.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching princesses:', error);
      } else {
        setPrincesses(data || []);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    } finally {
      setLoading(false);
    }
  };

  // 検索フィルタリング
  const filteredPrincesses = princesses.filter(princess => 
    princess.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    princess.attribute?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    princess.line_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const princessCount = princesses.length;
  return (
    <>
      <Header title="姫" />
      {/* 姫一覧ヘッダー - ヘッダー直下に配置、全幅表示 */}
      <header className="relative w-screen h-[42px] bg-black -ml-[50vw] left-[50%]" role="banner">
        <div className="relative flex items-center justify-center h-full">
          <h1 className="font-bold text-white text-xl text-center tracking-[0] leading-[normal] whitespace-nowrap">
            登録人数({princessCount})
          </h1>
        </div>
        {/* 人アイコンボタン - 右側に配置 */}
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="absolute top-2 right-4"
          aria-label="Add new princess"
          type="button"
        >
          <svg width="29" height="24" viewBox="0 0 29 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_277_14431)">
              <path d="M4.35 6C4.35 4.4087 4.96107 2.88258 6.04878 1.75736C7.13649 0.632141 8.61174 0 10.15 0C11.6883 0 13.1635 0.632141 14.2512 1.75736C15.3389 2.88258 15.95 4.4087 15.95 6C15.95 7.5913 15.3389 9.11742 14.2512 10.2426C13.1635 11.3679 11.6883 12 10.15 12C8.61174 12 7.13649 11.3679 6.04878 10.2426C4.96107 9.11742 4.35 7.5913 4.35 6ZM0 22.6078C0 17.9906 3.61594 14.25 8.07922 14.25H12.2208C16.6841 14.25 20.3 17.9906 20.3 22.6078C20.3 23.3766 19.6973 24 18.9542 24H1.34578C0.602656 24 0 23.3766 0 22.6078ZM22.8375 14.625V11.625H19.9375C19.3348 11.625 18.85 11.1234 18.85 10.5C18.85 9.87656 19.3348 9.375 19.9375 9.375H22.8375V6.375C22.8375 5.75156 23.3223 5.25 23.925 5.25C24.5277 5.25 25.0125 5.75156 25.0125 6.375V9.375H27.9125C28.5152 9.375 29 9.87656 29 10.5C29 11.1234 28.5152 11.625 27.9125 11.625H25.0125V14.625C25.0125 15.2484 24.5277 15.75 23.925 15.75C23.3223 15.75 22.8375 15.2484 22.8375 14.625Z" fill="white"/>
            </g>
            <defs>
              <clipPath id="clip0_277_14431">
                <rect width="29" height="24" fill="white"/>
              </clipPath>
            </defs>
          </svg>
        </button>
      </header>
      
      <main className="p-4 pb-20">
        {/* 検索バー */}
        <div className="mb-4">
          <div className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="検索"
              className="w-full h-[31px] bg-[#d7d7d7] rounded-lg pl-10 pr-4 text-[#525154] placeholder-[#525154] font-bold text-[15px] outline-none"
            />
            <svg 
              className="absolute left-2 top-1 w-[21px] h-[21px]" 
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
          </div>
        </div>

        {/* 姫リスト */}
        <div className="space-y-3">
          {loading ? (
            <div className="text-center text-white py-8">読み込み中...</div>
          ) : filteredPrincesses.length === 0 ? (
            <div className="text-center text-[#999] py-8">
              {searchQuery ? '検索結果がありません' : '姫が登録されていません'}
            </div>
          ) : (
            filteredPrincesses.map(princess => (
              <PrincessCard
                key={princess.id}
                name={princess.name}
                attribute={princess.attribute}
                age={princess.age}
                lineName={princess.line_name}
                favoriteDrink={princess.favorite_drink}
                onClick={() => {
                  // TODO: 姫詳細ページへの遷移
                  console.log('Princess clicked:', princess.id);
                }}
              />
            ))
          )}
        </div>
      </main>

      {/* 姫追加モーダル */}
      <PrincessAddModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          fetchPrincesses(); // モーダルを閉じたら姫リストを更新
        }}
      />
    </>
  );
};

export default PrincessPage;