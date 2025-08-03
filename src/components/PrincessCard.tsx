import React from 'react';

interface PrincessCardProps {
  name: string;
  attribute?: string;
  age?: number;
  lineName?: string;
  favoriteDrink?: string;
  onClick?: () => void;
}

export const PrincessCard: React.FC<PrincessCardProps> = ({
  name,
  attribute,
  age,
  lineName,
  favoriteDrink,
  onClick
}) => {
  return (
    <div
      onClick={onClick}
      className="flex items-center p-3 bg-[#464646] rounded-lg active:bg-[#525252] cursor-pointer transition-colors"
    >
      {/* アイコン部分 - 属性を表示 */}
      <div className="w-[45px] h-[45px] rounded-full bg-white flex items-center justify-center flex-shrink-0">
        <span className="text-black text-[10px] font-bold text-center px-1">
          {attribute ? (
            attribute.length > 4 ? attribute.slice(0, 4) : attribute
          ) : (
            '新規'
          )}
        </span>
      </div>
      
      {/* 名前と情報部分 */}
      <div className="flex-1 ml-3 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-white text-[16px] font-bold truncate">
            {name || '山田ななみ'}
          </span>
          {age && (
            <span className="text-gray-400 text-[14px]">
              ({age}歳)
            </span>
          )}
        </div>
        {(lineName || favoriteDrink) && (
          <div className="text-gray-400 text-[12px] mt-0.5 truncate">
            {lineName && `LINE: ${lineName}`}
            {lineName && favoriteDrink && ' / '}
            {favoriteDrink && `好きなお酒: ${favoriteDrink}`}
          </div>
        )}
      </div>
    </div>
  );
};