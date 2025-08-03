import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { supabase } from '../lib/supabaseClient';
import { useStore } from '../context/StoreContext';
import { PrincessList } from '../components/PrincessList';
import { PrincessAddModal } from '../components/PrincessAddModal';


const PrincessPage: React.FC = () => {
  const { currentStore } = useStore();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [princessCount, setPrincessCount] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);

  // 姫数を取得
  useEffect(() => {
    if (!currentStore?.id) return;
    
    const fetchCount = async () => {
      const { count } = await supabase
        .from('princess_profiles')
        .select('*', { count: 'exact', head: true })
        .eq('store_id', currentStore.id);
      
      setPrincessCount(count || 0);
    };
    
    fetchCount();
  }, [currentStore, refreshKey]);
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
      
      <main className="bg-black min-h-screen">
        {/* PrincessListコンポーネントに姫一覧の表示を委譲 */}
        <PrincessList key={refreshKey} />
      </main>

      {/* 姫追加モーダル */}
      <PrincessAddModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setRefreshKey(prev => prev + 1); // リストを更新
        }}
      />
    </>
  );
};

export default PrincessPage;