import React, { useState } from 'react';
import Header from '../components/Header';
import PrincessAddModal from '../components/PrincessAddModal';

const PrincessPage: React.FC = () => {
  const [isPrincessModalOpen, setIsPrincessModalOpen] = useState(false);

  return (
    <>
      <Header title="姫" />
      {/* 姫一覧ヘッダー - ヘッダー直下に配置、全幅表示 */}
      <header className="relative w-full h-[42px] bg-black" role="banner">
        <div className="flex items-center justify-center h-full">
          <h1 className="[font-family:'Inter-Bold',Helvetica] font-bold text-white text-xl text-center tracking-[0] leading-[normal] whitespace-nowrap">
            姫一覧
          </h1>
        </div>
        {/* 姫追加ボタン - 右側に配置 */}
        <button
          onClick={() => setIsPrincessModalOpen(true)}
          className="absolute w-[29px] h-6 top-2 right-4 bg-[url(/vector.svg)] bg-[100%_100%]"
          aria-label="Add new princess"
          type="button"
        />
      </header>
      
      <main className="p-4 pb-16">
        {/* 検索バー */}
        <div className="mb-4">
          <div className="w-full h-[31px] bg-[#d7d7d7] rounded-lg overflow-hidden">
            <div className="inline-flex items-center gap-2.5 relative top-1 left-2">
              <div className="relative w-[22px] h-[22px]">
                <svg 
                  className="absolute w-[21px] h-[21px] top-0 left-0" 
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
              <div className="relative w-fit [font-family:'Inter-Bold',Helvetica] font-bold text-[#525154] text-[15px] text-center tracking-[0] leading-[normal] whitespace-nowrap">
                検索
              </div>
            </div>
          </div>
        </div>

        {/* ここに今後のコンテンツを追加 */}
      </main>

      {/* 姫追加モーダル */}
      <PrincessAddModal
        isOpen={isPrincessModalOpen}
        onClose={() => setIsPrincessModalOpen(false)}
      />
    </>
  );
};

export default PrincessPage;