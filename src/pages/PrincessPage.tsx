import React from 'react';
import Header from '../components/Header';

const PrincessPage: React.FC = () => {
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
        {/* 人アイコンボタン - 右側に配置（一時的に無効化） */}
        <button
          onClick={() => {}}
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
      
      <main className="p-4">
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
    </>
  );
};

export default PrincessPage;