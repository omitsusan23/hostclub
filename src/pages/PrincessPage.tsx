import React from 'react';
import Header from '../components/Header';

const PrincessPage: React.FC = () => {
  return (
    <>
      <Header title="姫" />
      <div className="p-4">
        <p className="text-center mt-4 text-gray-600">
          こちらは姫ページです。今後コンテンツを追加予定です。
        </p>
      </div>
    </>
  );
};

export default PrincessPage;