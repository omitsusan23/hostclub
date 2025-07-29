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
    <header className="fixed top-0 z-50 w-full bg-white">
      {/* メインヘッダー */}
      <div className="h-10 flex items-center justify-between px-4 bg-white">
        {/* 左側: マイページ */}
        <Link to="/mypage" className="flex flex-col items-center gap-px">
          <img src={UserIcon} alt="MyPage" className="w-5 h-5" />
          <span className="text-[10px] text-black">MYpage</span>
        </Link>

        {/* 中央: ページタイトル */}
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <div className="bg-black text-white px-[36px] py-2 text-base font-bold">
            {title}
          </div>
        </div>

        {/* 右側: カレンダーとベル */}
        <div className="flex items-end gap-3">
          <img src={CalendarIcon} alt="Calendar" className="w-5 h-5" />
          <img src={BellIcon} alt="Notifications" className="w-5 h-[22.22px]" />
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