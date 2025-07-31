import React from 'react';
import Header from '../components/Header';

const PrincessPage: React.FC = () => {
  return (
    <>
      <Header title="姫" />
      {/* 姫一覧ヘッダー - ヘッダー直下に配置 */}
      <header className="relative w-full h-[42px] bg-black" role="banner">
          <div className="inline-flex items-center absolute top-2 left-[calc(50%-61px)]">
            <h1 className="relative w-fit mt-[-1.00px] [font-family:'Inter-Bold',Helvetica] font-bold text-white text-xl text-center tracking-[0] leading-[normal] whitespace-nowrap">
              姫一覧
            </h1>
            <span className="relative w-fit mt-[-1.00px] [font-family:'Inter-Bold',Helvetica] font-bold text-white text-xl text-center tracking-[0] leading-[normal] whitespace-nowrap">
              (20人)
            </span>
          </div>
          <button
            className="absolute w-[29px] h-6 top-2 right-4 bg-[url(/vector.svg)] bg-[100%_100%]"
            aria-label="Add new item"
            type="button"
          />
        </header>
      <main className="pb-16">
        {/* ここに今後のコンテンツを追加 */}
      </main>
    </>
  );
};

export default PrincessPage;