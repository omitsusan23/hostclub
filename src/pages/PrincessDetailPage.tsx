import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import Header from '../components/Header';

interface PrincessDetail {
  id: string;
  name: string;
  attribute?: string;
  age?: number;
  line_name?: string;
  favorite_drink?: string;
  birth_year?: number;
  birth_date?: string;
  current_residence?: string;
  birthplace?: string;
  blood_type?: string;
  occupation?: string;
  contact_time?: string;
  favorite_cigarette?: string;
  bottle_name?: string;
  favorite_help?: string;
  hobby?: string;
  specialty?: string;
  holiday?: string;
  favorite_brand?: string;
  marriage?: string;
  children?: string;
  partner?: string;
  created_at: string;
}

const PrincessDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [princess, setPrincess] = useState<PrincessDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrincessDetail();
  }, [id]);

  const fetchPrincessDetail = async () => {
    if (!id) return;

    try {
      const { data, error } = await supabase
        .from('princess_profiles')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching princess detail:', error);
        navigate('/princess');
        return;
      }

      setPrincess(data);
    } catch (error) {
      console.error('Unexpected error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-black">
        <div className="text-white">読み込み中...</div>
      </div>
    );
  }

  if (!princess) {
    return (
      <div className="flex justify-center items-center h-screen bg-black">
        <div className="text-white">姫が見つかりません</div>
      </div>
    );
  }

  return (
    <>
      <Header title="姫" />
      
      {/* 姫情報詳細ヘッダー - 姫ページと同じスタイル */}
      <header className="relative w-screen h-[42px] bg-black -ml-[50vw] left-[50%]" role="banner">
        <div className="relative flex items-center justify-center h-full">
          <h1 className="font-bold text-white text-xl text-center tracking-[0] leading-[normal] whitespace-nowrap">
            姫情報詳細
          </h1>
        </div>
        {/* 戻るボタン - 左側に配置 */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-2 left-4 flex items-center justify-center"
          aria-label="戻る"
        >
          <span className="font-bold text-white text-xl">戻る</span>
        </button>
        {/* 編集ボタン - 右側に配置 */}
        <button
          onClick={() => navigate(`/princess/${id}/edit`)}
          className="absolute top-2 right-4 flex items-center justify-center px-2 py-0 border-b border-white"
          aria-label="編集"
        >
          <span className="font-bold text-white text-xl">編集</span>
        </button>
      </header>
      
      <div className="flex flex-col w-full bg-black min-h-screen">
        {/* サマリーセクション - ヘッダーから8pxの間隔（姫ページと同じ） */}
        <div className="bg-[#2a2a2a] p-4 mx-4 mt-2 rounded-lg">
          <div className="flex items-center relative">
            {/* 属性アイコン - 二回り小さく */}
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mr-3">
              <span className="text-black text-[10px] font-bold">
                {princess.attribute?.slice(0, 4) || '新規'}
              </span>
            </div>
            {/* 名前 */}
            <h3 className="text-white text-base font-bold">{princess.name}</h3>
            {/* LINE名 - X軸中心より10px右からスタート */}
            {princess.line_name && (
              <div className="absolute left-[calc(50%+10px)] flex items-center">
                <span className="text-gray-400 text-sm">LINE: {princess.line_name}</span>
              </div>
            )}
          </div>
        </div>

        {/* メモセクション */}
        <div className="bg-[#2a2a2a] p-4 mx-4 mt-2 rounded-lg">
          <h2 className="text-white text-lg font-bold mb-4">メモ</h2>
          <button className="text-gray-400 text-sm">詳しく見る</button>
        </div>

        {/* 最終来店履歴セクション */}
        <div className="bg-[#2a2a2a] p-4 mx-4 mt-2 rounded-lg">
          <h2 className="text-white text-lg font-bold mb-4">最終来店履歴</h2>
          
          {/* 来店記録がない場合 */}
          <p className="text-gray-400 text-sm">来店なし</p>
        </div>

        {/* グラフセクション（将来実装） */}
        <div className="bg-[#2a2a2a] p-4 mx-4 mt-2 rounded-lg">
          <h2 className="text-white text-lg font-bold mb-4">来店履歴</h2>
          <div className="h-40 flex items-center justify-center border border-gray-600 rounded">
            <p className="text-gray-500">グラフは今後実装予定</p>
          </div>
        </div>

        {/* 基本情報セクション */}
        <div className="bg-[#2a2a2a] p-4 mx-4 mt-2 mb-20 rounded-lg">
          <h2 className="text-white text-lg font-bold mb-4">基本情報</h2>
          
          <div className="space-y-3">
            <div className="flex items-center py-2 border-b border-gray-700">
              <span className="text-gray-400 text-sm w-24">年齢</span>
              <span className="text-white text-sm">{princess.age || ''}</span>
            </div>
            
            <div className="flex items-center py-2 border-b border-gray-700">
              <span className="text-gray-400 text-sm w-24">誕生年</span>
              <span className="text-white text-sm">{princess.birth_year || ''}</span>
            </div>
            
            <div className="flex items-center py-2 border-b border-gray-700">
              <span className="text-gray-400 text-sm w-24">誕生日</span>
              <span className="text-white text-sm">{princess.birth_date || ''}</span>
            </div>
            
            <div className="flex items-center py-2 border-b border-gray-700">
              <span className="text-gray-400 text-sm w-24">現在の居住地</span>
              <span className="text-white text-sm">{princess.current_residence || ''}</span>
            </div>
            
            <div className="flex items-center py-2 border-b border-gray-700">
              <span className="text-gray-400 text-sm w-24">出身地</span>
              <span className="text-white text-sm">{princess.birthplace || ''}</span>
            </div>
            
            <div className="flex items-center py-2 border-b border-gray-700">
              <span className="text-gray-400 text-sm w-24">血液型</span>
              <span className="text-white text-sm">{princess.blood_type || ''}</span>
            </div>
            
            <div className="flex items-center py-2 border-b border-gray-700">
              <span className="text-gray-400 text-sm w-24">職業</span>
              <span className="text-white text-sm">{princess.occupation || ''}</span>
            </div>
            
            <div className="flex items-center py-2 border-b border-gray-700">
              <span className="text-gray-400 text-sm w-24">連絡可能時間</span>
              <span className="text-white text-sm">{princess.contact_time || ''}</span>
            </div>
            
            <div className="flex items-center py-2 border-b border-gray-700">
              <span className="text-gray-400 text-sm w-24">好きなお酒</span>
              <span className="text-white text-sm">{princess.favorite_drink || ''}</span>
            </div>
            
            <div className="flex items-center py-2 border-b border-gray-700">
              <span className="text-gray-400 text-sm w-24">好きなタバコ</span>
              <span className="text-white text-sm">{princess.favorite_cigarette || ''}</span>
            </div>
            
            <div className="flex items-center py-2 border-b border-gray-700">
              <span className="text-gray-400 text-sm w-24">ボトル名</span>
              <span className="text-white text-sm">{princess.bottle_name || ''}</span>
            </div>
            
            <div className="flex items-center py-2 border-b border-gray-700">
              <span className="text-gray-400 text-sm w-24">好きなヘルプ</span>
              <span className="text-white text-sm">{princess.favorite_help || ''}</span>
            </div>
            
            <div className="flex items-center py-2 border-b border-gray-700">
              <span className="text-gray-400 text-sm w-24">趣味</span>
              <span className="text-white text-sm">{princess.hobby || ''}</span>
            </div>
            
            <div className="flex items-center py-2 border-b border-gray-700">
              <span className="text-gray-400 text-sm w-24">特技</span>
              <span className="text-white text-sm">{princess.specialty || ''}</span>
            </div>
            
            <div className="flex items-center py-2 border-b border-gray-700">
              <span className="text-gray-400 text-sm w-24">休日</span>
              <span className="text-white text-sm">{princess.holiday || ''}</span>
            </div>
            
            <div className="flex items-center py-2 border-b border-gray-700">
              <span className="text-gray-400 text-sm w-24">好きなブランド</span>
              <span className="text-white text-sm">{princess.favorite_brand || ''}</span>
            </div>
            
            <div className="flex items-center py-2 border-b border-gray-700">
              <span className="text-gray-400 text-sm w-24">結婚</span>
              <span className="text-white text-sm">{princess.marriage || ''}</span>
            </div>
            
            <div className="flex items-center py-2 border-b border-gray-700">
              <span className="text-gray-400 text-sm w-24">子供</span>
              <span className="text-white text-sm">{princess.children || ''}</span>
            </div>
            
            <div className="flex items-center py-2 border-b border-gray-700">
              <span className="text-gray-400 text-sm w-24">恋人</span>
              <span className="text-white text-sm">{princess.partner || ''}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PrincessDetailPage;