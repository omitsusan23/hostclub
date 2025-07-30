import React, { useRef, useEffect, useState } from 'react';

export const MobileFormExample: React.FC = () => {
  const [name, setName] = useState('');
  const formContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  useEffect(() => {
    // ビューポートの高さ変化を検知してキーボードの表示/非表示を判定
    const initialHeight = window.visualViewport?.height || window.innerHeight;
    
    const handleViewportChange = () => {
      const currentHeight = window.visualViewport?.height || window.innerHeight;
      const keyboardVisible = currentHeight < initialHeight * 0.75;
      setIsKeyboardVisible(keyboardVisible);
    };

    // visualViewport APIが利用可能な場合
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleViewportChange);
      window.visualViewport.addEventListener('scroll', handleViewportChange);
    }

    // 通常のresize イベントもリッスン
    window.addEventListener('resize', handleViewportChange);

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleViewportChange);
        window.visualViewport.removeEventListener('scroll', handleViewportChange);
      }
      window.removeEventListener('resize', handleViewportChange);
    };
  }, []);

  const handleInputFocus = () => {
    // フォーカス時に入力欄を画面中央に配置
    setTimeout(() => {
      if (inputRef.current && formContainerRef.current) {
        const inputRect = inputRef.current.getBoundingClientRect();
        const containerRect = formContainerRef.current.getBoundingClientRect();
        const inputCenter = inputRect.top + inputRect.height / 2;
        const containerCenter = window.innerHeight / 2;
        const scrollOffset = inputCenter - containerCenter;

        formContainerRef.current.scrollBy({
          top: scrollOffset,
          behavior: 'smooth'
        });
      }
    }, 300); // キーボード表示のアニメーションを待つ
  };

  const handleInputBlur = () => {
    // ブラー時に最上部にスクロールして位置をリセット
    setTimeout(() => {
      if (formContainerRef.current) {
        formContainerRef.current.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }
    }, 100);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 送信処理
    console.log('送信:', name);
    
    // キーボードを閉じる
    inputRef.current?.blur();
  };

  return (
    <div className="fixed inset-0 bg-gray-50">
      {/* メインコンテナ - 横スクロール完全無効化 */}
      <div 
        ref={formContainerRef}
        className="h-full w-full overflow-x-hidden overflow-y-auto overscroll-y-contain"
        style={{
          // PWA・iOS Safari対策
          WebkitOverflowScrolling: 'touch',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      >
        {/* コンテンツラッパー - 画面幅に固定 */}
        <div className="min-h-full w-full max-w-full px-4 py-8">
          {/* ヘッダー */}
          <header className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-gray-800">
              モバイルフォーム
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              左右のズレを防ぐ実装例
            </p>
          </header>

          {/* フォーム */}
          <form onSubmit={handleSubmit} className="mx-auto max-w-sm">
            <div className="space-y-6">
              {/* 名前入力フィールド */}
              <div className="relative">
                <label 
                  htmlFor="name" 
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  お名前
                </label>
                <input
                  ref={inputRef}
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="山田太郎"
                  autoComplete="name"
                />
              </div>

              {/* ダミーコンテンツ（スクロール確認用） */}
              <div className="space-y-4 text-gray-600">
                <p>ここにその他のフォーム要素が入ります。</p>
                <p>スクロール動作を確認するための</p>
                <p>ダミーテキストです。</p>
                <div className="h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500">追加コンテンツエリア</span>
                </div>
              </div>

              {/* 送信ボタン */}
              <button
                type="submit"
                className={`w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all ${
                  isKeyboardVisible ? 'mb-64' : ''
                }`}
              >
                送信
              </button>
            </div>
          </form>

          {/* フッタースペーサー */}
          <div className="h-32" />
        </div>
      </div>
    </div>
  );
};