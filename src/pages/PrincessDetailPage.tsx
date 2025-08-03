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
      <Header title="姫" showBack={true} />
      
      {/* 姫情報詳細ヘッダー - 姫ページと同じスタイル */}
      <header className="relative w-screen h-[42px] bg-black -ml-[50vw] left-[50%]" role="banner">
        <div className="relative flex items-center justify-center h-full">
          <h1 className="font-bold text-white text-xl text-center tracking-[0] leading-[normal] whitespace-nowrap">
            姫情報詳細
          </h1>
        </div>
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
        <div className="bg-[#2a2a2a] p-4 mx-4 mt-2 mb-4 rounded-lg">
          <div className="flex items-center mb-4">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mr-4">
              <span className="text-black text-sm font-bold">
                {princess.attribute?.slice(0, 4) || '新規'}
              </span>
            </div>
            <div className="flex-1">
              <h3 className="text-white text-xl font-bold mb-1">{princess.name}</h3>
              {princess.age && (
                <p className="text-gray-400 text-sm">{princess.age}歳</p>
              )}
              {princess.line_name && (
                <p className="text-gray-400 text-sm">LINE: {princess.line_name}</p>
              )}
            </div>
          </div>

          <div className="border-t border-gray-600 pt-3">
            <p className="text-gray-400 text-sm mb-2">来店回数</p>
            <p className="text-white text-2xl font-bold">0回</p>
            <p className="text-gray-500 text-xs mt-1">来店なし</p>
          </div>
        </div>

        {/* チャートセクション（将来実装） */}
        <div className="bg-[#2a2a2a] p-4 m-4 rounded-lg">
          <h2 className="text-white text-lg font-bold mb-4">来店履歴</h2>
          <div className="h-40 flex items-center justify-center border border-gray-600 rounded">
            <p className="text-gray-500">グラフは今後実装予定</p>
          </div>
        </div>

        {/* 詳細情報セクション */}
        <div className="bg-[#2a2a2a] p-4 m-4 rounded-lg">
          <h2 className="text-white text-lg font-bold mb-4">詳細情報</h2>
          
          <div className="space-y-3">
            {princess.birth_date && (
              <div className="flex justify-between py-2 border-b border-gray-700">
                <span className="text-gray-400 text-sm">誕生日</span>
                <span className="text-white text-sm">{princess.birth_date}</span>
              </div>
            )}
            
            {princess.blood_type && (
              <div className="flex justify-between py-2 border-b border-gray-700">
                <span className="text-gray-400 text-sm">血液型</span>
                <span className="text-white text-sm">{princess.blood_type}</span>
              </div>
            )}
            
            {princess.occupation && (
              <div className="flex justify-between py-2 border-b border-gray-700">
                <span className="text-gray-400 text-sm">職業</span>
                <span className="text-white text-sm">{princess.occupation}</span>
              </div>
            )}
            
            {princess.current_residence && (
              <div className="flex justify-between py-2 border-b border-gray-700">
                <span className="text-gray-400 text-sm">現住所</span>
                <span className="text-white text-sm">{princess.current_residence}</span>
              </div>
            )}
            
            {princess.birthplace && (
              <div className="flex justify-between py-2 border-b border-gray-700">
                <span className="text-gray-400 text-sm">出身地</span>
                <span className="text-white text-sm">{princess.birthplace}</span>
              </div>
            )}
            
            {princess.favorite_drink && (
              <div className="flex justify-between py-2 border-b border-gray-700">
                <span className="text-gray-400 text-sm">好きなお酒</span>
                <span className="text-white text-sm">{princess.favorite_drink}</span>
              </div>
            )}
            
            {princess.favorite_brand && (
              <div className="flex justify-between py-2 border-b border-gray-700">
                <span className="text-gray-400 text-sm">好きなブランド</span>
                <span className="text-white text-sm">{princess.favorite_brand}</span>
              </div>
            )}
            
            {princess.hobby && (
              <div className="flex justify-between py-2 border-b border-gray-700">
                <span className="text-gray-400 text-sm">趣味</span>
                <span className="text-white text-sm">{princess.hobby}</span>
              </div>
            )}
            
            {princess.contact_time && (
              <div className="flex justify-between py-2 border-b border-gray-700">
                <span className="text-gray-400 text-sm">連絡可能時間</span>
                <span className="text-white text-sm">{princess.contact_time}</span>
              </div>
            )}
          </div>
        </div>

        {/* プロフィールセクション */}
        <div className="bg-[#2a2a2a] p-4 m-4 rounded-lg mb-20">
          <h2 className="text-white text-lg font-bold mb-4">その他の情報</h2>
          
          <div className="space-y-3">
            {princess.favorite_cigarette && (
              <div className="flex justify-between py-2 border-b border-gray-700">
                <span className="text-gray-400 text-sm">好きなタバコ</span>
                <span className="text-white text-sm">{princess.favorite_cigarette}</span>
              </div>
            )}
            
            {princess.bottle_name && (
              <div className="flex justify-between py-2 border-b border-gray-700">
                <span className="text-gray-400 text-sm">ボトル名</span>
                <span className="text-white text-sm">{princess.bottle_name}</span>
              </div>
            )}
            
            {princess.favorite_help && (
              <div className="flex justify-between py-2 border-b border-gray-700">
                <span className="text-gray-400 text-sm">好きなヘルプ</span>
                <span className="text-white text-sm">{princess.favorite_help}</span>
              </div>
            )}
            
            {princess.specialty && (
              <div className="flex justify-between py-2 border-b border-gray-700">
                <span className="text-gray-400 text-sm">特技</span>
                <span className="text-white text-sm">{princess.specialty}</span>
              </div>
            )}
            
            {princess.holiday && (
              <div className="flex justify-between py-2 border-b border-gray-700">
                <span className="text-gray-400 text-sm">休日</span>
                <span className="text-white text-sm">{princess.holiday}</span>
              </div>
            )}
            
            {princess.marriage && (
              <div className="flex justify-between py-2 border-b border-gray-700">
                <span className="text-gray-400 text-sm">結婚</span>
                <span className="text-white text-sm">{princess.marriage}</span>
              </div>
            )}
            
            {princess.children && (
              <div className="flex justify-between py-2 border-b border-gray-700">
                <span className="text-gray-400 text-sm">子供</span>
                <span className="text-white text-sm">{princess.children}</span>
              </div>
            )}
            
            {princess.partner && (
              <div className="flex justify-between py-2 border-b border-gray-700">
                <span className="text-gray-400 text-sm">パートナー</span>
                <span className="text-white text-sm">{princess.partner}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PrincessDetailPage;