import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

const AddPrincessForm: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <Header title="新規姫追加" />
      <main className="p-4 pb-16 pt-[calc(env(safe-area-inset-top)+66px)]">
        <p className="text-center mt-4 text-gray-600">
          新規姫追加フォーム（今後実装予定）
        </p>
        <button
          onClick={() => navigate('/princess')}
          className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-lg"
        >
          戻る
        </button>
      </main>
    </>
  );
};

export default AddPrincessForm;