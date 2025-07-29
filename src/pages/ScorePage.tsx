import React from 'react';
import Header from '../components/Header';

const ScorePage: React.FC = () => {
  return (
    <>
      <Header title="成績" />
      <div className="p-4">
        <p className="text-center mt-4 text-gray-600">
          こちらは成績ページです。今後コンテンツを追加予定です。
        </p>
      </div>
    </>
  );
};

export default ScorePage;