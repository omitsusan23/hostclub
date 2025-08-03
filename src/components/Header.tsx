import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import UserIcon from '../assets/icons/user.svg';
import CalendarIcon from '../assets/icons/calendar.svg';
import BellIcon from '../assets/icons/bell.svg';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  children?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ title, showBack = false, children }) => {
  const navigate = useNavigate();
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white pt-[env(safe-area-inset-top)]">
      {/* メインヘッダー */}
      <div className="relative h-8 bg-white">
        {/* 中央のタイトル - 最初に配置 */}
        <div className="absolute w-full h-full flex items-center justify-center">
          <div className="bg-black text-white px-9 py-1 text-base font-bold">
            {title}
          </div>
        </div>
        
        {/* 左右の要素 - タイトルの上に重ねる */}
        <div className="relative h-full flex items-center justify-between px-6 z-10">
          {/* 左側: 戻るボタンまたはマイページ */}
          {showBack ? (
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center"
            >
              <span className="text-black text-base font-medium border-b border-black pb-0.5">戻る</span>
            </button>
          ) : (
            <Link to="/mypage" className="flex flex-col items-center gap-px">
              <img src={UserIcon} alt="MyPage" className="w-5 h-5" />
              <span className="text-[10px] text-black">MYpage</span>
            </Link>
          )}

          {/* 右側: カレンダーとベル */}
          <div className="flex items-center">
            <img src={CalendarIcon} alt="Calendar" className="w-5 h-5 mr-3" />
            <img src={BellIcon} alt="Notifications" className="w-5 h-[22.22px]" />
          </div>
        </div>
      </div>
      
      {/* 子要素（フィルターボタンなど） */}
      {children && (
        <div className="bg-white border-b border-gray-200 px-4 py-2">
          {children}
        </div>
      )}
    </header>
  );
};

export default Header;