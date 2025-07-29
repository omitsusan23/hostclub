import React from 'react';
import { Link } from 'react-router-dom';
import UserIcon from '../assets/icons/user.svg';
import CalendarIcon from '../assets/icons/calendar.svg';
import BellIcon from '../assets/icons/bell.svg';

interface HeaderProps {
  title: string;
  children?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ title, children }) => {
  return (
    <header className="fixed top-0 z-50 w-full bg-white pt-[env(safe-area-inset-top)]">
      {/* メインヘッダー */}
      <div className="relative h-10 bg-white">
        {/* 左右の要素のレイヤー */}
        <div className="absolute inset-0 flex items-center justify-between px-4">
          {/* 左側: マイページ */}
          <Link to="/mypage" className="flex flex-col items-center gap-px">
            <img src={UserIcon} alt="MyPage" className="w-5 h-5" />
            <span className="text-[10px] text-black">MYpage</span>
          </Link>

          {/* 右側: カレンダーとベル */}
          <div className="flex items-center gap-3">
            <img src={CalendarIcon} alt="Calendar" className="w-5 h-5" />
            <img src={BellIcon} alt="Notifications" className="w-5 h-[22.22px]" />
          </div>
        </div>

        {/* 中央: ページタイトル（独立したレイヤーで完全中央配置） */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-black text-white px-[36px] py-2 text-base font-bold pointer-events-auto">
            {title}
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