import React from 'react';
import Header from '../components/Header';

const StorePage: React.FC = () => {
  return (
    <>
      <Header title="店舗" />
      <div className="p-4">
        <p className="text-center mt-4 text-gray-600">
          こちらは店舗ページです。今後コンテンツを追加予定です。
        </p>
      </div>
    </>
  );
};

export default StorePage;