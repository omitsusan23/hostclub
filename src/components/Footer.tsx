// src/components/Footer.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

// SVGアイコン読み込み
import CastIcon from '../assets/icons/cast.svg';
import ReservationIcon from '../assets/icons/reservation.svg';
import TableStatusIcon from '../assets/icons/table-status.svg';
import ChatIcon from '../assets/icons/chat.svg';
import SettingsIcon from '../assets/icons/settings.svg';
import PrincessIcon from '../assets/icons/princess.svg';
import MypageIcon from '../assets/icons/mypage.svg';

const Footer: React.FC = () => {
  const { state } = useAppContext();
  const user = state.currentUser;

  if (!user) return null;

  const isEmployee = user.role === 'owner' || user.role === 'operator';
  const isCast = user.role === 'cast';

  const footerItems = isEmployee
    ? [
        { to: '/tables', icon: TableStatusIcon, label: '卓状況' },
        { to: '/reservations', icon: ReservationIcon, label: '来店予約' },
        { to: '/casts', icon: CastIcon, label: 'キャスト一覧' },
        { to: '/settings', icon: SettingsIcon, label: '設定' },
      ]
    : [
        { to: '/tables', icon: TableStatusIcon, label: '卓状況' },
        { to: '/reservations', icon: ReservationIcon, label: '来店予約' },
        { to: '/princesses', icon: PrincessIcon, label: '姫一覧' },
        { to: '/mypage', icon: MypageIcon, label: 'マイページ' },
      ];

  return (
    <footer className="bg-white shadow p-2 flex justify-around items-center text-xs">
      {footerItems.map((item, index) => (
        <Link
          key={index}
          to={item.to}
          className="flex flex-col items-center justify-center gap-1 text-gray-800 hover:text-pink-600"
        >
          <img src={item.icon} alt={item.label} className="w-6 h-6" />
          <span>{item.label}</span>
        </Link>
      ))}
    </footer>
  );
};

export default Footer;
