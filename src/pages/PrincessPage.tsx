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
        {/* 人アイコンボタン - 右側に配置 */}
        <button
          onClick={() => setIsPrincessModalOpen(true)}
          className="absolute top-2 right-4"
          aria-label="Add new princess"
          type="button"
        >
          <svg width="29" height="24" viewBox="0 0 29 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19.5 10.5C19.5 11.8261 18.9732 13.0979 18.0355 14.0355C17.0979 14.9732 15.8261 15.5 14.5 15.5C13.1739 15.5 11.9021 14.9732 10.9645 14.0355C10.0268 13.0979 9.5 11.8261 9.5 10.5C9.5 9.17392 10.0268 7.90215 10.9645 6.96447C11.9021 6.02678 13.1739 5.5 14.5 5.5C15.8261 5.5 17.0979 6.02678 18.0355 6.96447C18.9732 7.90215 19.5 9.17392 19.5 10.5Z" fill="white"/>
            <path d="M14.5 0C11.3185 0 8.26756 1.26428 6.01759 3.51472C3.76763 5.76516 2.50342 8.8174 2.50342 12C2.50342 15.1826 3.76763 18.2348 6.01759 20.4853C8.26756 22.7357 11.3185 24 14.5 24C17.6815 24 20.7324 22.7357 22.9824 20.4853C25.2324 18.2348 26.4966 15.1826 26.4966 12C26.4966 8.8174 25.2324 5.76516 22.9824 3.51472C20.7324 1.26428 17.6815 0 14.5 0ZM21.836 18.924C21.308 17.684 18.116 16.5 14.5 16.5C10.884 16.5 7.692 17.684 7.164 18.924C5.85014 17.5014 5.00706 15.7235 4.74556 13.8245C4.48406 11.9255 4.81564 9.99479 5.69709 8.28668C6.57854 6.57858 7.96838 5.17276 9.68393 4.25723C11.3995 3.3417 13.3617 2.96057 15.3172 3.16555C17.2727 3.37053 19.1275 4.15237 20.6335 5.40413C22.1395 6.65589 23.2264 8.31655 23.7508 10.1682C24.2751 12.0199 24.2127 13.976 23.5714 15.7902C22.9301 17.6044 21.7396 19.1896 20.164 20.34C20.536 19.436 21.544 18.628 21.836 18.924Z" fill="white"/>
            <path d="M25 6H21V2H20V6H16V7H20V11H21V7H25V6Z" fill="white"/>
          </svg>
        </button>
      </header>
      
      <main className="p-2 pb-10">
        {/* 検索バー */}
        <div>
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