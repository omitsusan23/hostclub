import React from "react";

export const Screen = () => {
  return (
    <div className="bg-black flex flex-row justify-center w-full min-h-screen">
      <div className="bg-black w-[402px] relative">
        {/* ヘッダー部分 */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-black pt-[env(safe-area-inset-top)]">
          <div className="inline-flex items-center justify-center w-full h-8 relative">
            <h1 className="[font-family:'Inter-Bold',Helvetica] font-bold text-white text-xl text-center tracking-[0] leading-[normal] whitespace-nowrap">
              姫一覧
            </h1>
            <span className="[font-family:'Inter-Bold',Helvetica] font-bold text-white text-xl text-center tracking-[0] leading-[normal] whitespace-nowrap">
              (20人)
            </span>
            <button
              className="absolute w-[29px] h-6 right-4 bg-[url(/vector.svg)] bg-[100%_100%]"
              aria-label="Add new item"
              type="button"
            />
          </div>
        </header>

        {/* コンテンツ部分 */}
        <main className="p-4 pb-16 pt-[calc(env(safe-area-inset-top)+66px)]">
          {/* 検索バー */}
          <div className="mb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="検索"
                className="w-full h-10 bg-gray-600 text-white rounded-lg pl-10 pr-4 placeholder-gray-400"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m21 21-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z" />
                </svg>
              </div>
            </div>
          </div>

          {/* フィルターボタン */}
          <div className="flex gap-2 mb-4">
            <button className="flex items-center bg-gray-600 text-white px-3 py-2 rounded-lg text-sm">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v2.586a1 1 0 0 1-.293.707l-6.414 6.414a1 1 0 0 0-.293.707V17l-4 2v-4.586a1 1 0 0 0-.293-.707L3.293 7.207A1 1 0 0 1 3 6.5V4z" />
              </svg>
              絞り込み
            </button>
            <button className="flex items-center bg-gray-600 text-white px-3 py-2 rounded-lg text-sm">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              全て表示
            </button>
          </div>

          {/* 姫一覧 */}
          <div className="space-y-2">
            {Array.from({ length: 9 }, (_, index) => (
              <div key={index} className="flex items-center bg-gray-700 rounded-lg p-3">
                <div className="w-12 h-12 bg-gray-500 rounded-full mr-3 flex-shrink-0">
                  <img
                    src="/api/placeholder/48/48"
                    alt="山田ななみ"
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-medium">山田ななみ</h3>
                </div>
                <div className="text-right">
                  <span className="text-white text-sm">
                    {index === 4 || index === 5 ? "本指名" : 
                     index === 6 ? "送りレピ" : 
                     index === 7 ? "初回" : "送り"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};