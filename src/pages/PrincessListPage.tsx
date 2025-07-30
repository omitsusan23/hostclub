import React from 'react';
import Header from '../components/Header';

export default function PrincessListPage() {
  return (
    <>
      <Header title="姫リスト" />
      <main className="p-4 pb-16 pt-[calc(env(safe-area-inset-top)+66px)]">
        {/* 後で実装 */}
        <p className="text-gray-500">姫リスト機能は後で実装されます</p>
      </main>
    </>
  );
}