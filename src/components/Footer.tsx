// src/components/Footer.tsx
import React from 'react';
import { useAppContext } from '../context/AppContext';
import { FooterButton } from './FooterButton';

import CastIcon from '../assets/icons/cast.svg';
import ReservationIcon from '../assets/icons/reservation.svg';
import TableStatusIcon from '../assets/icons/table-status.svg';
import SettingsIcon from '../assets/icons/settings.svg';
import ChatIcon from '../assets/icons/chat.svg'; // チャットアイコン追加

const Footer: React.FC = () => {
  const { state } = useAppContext();
  const user = state.currentUser;

  if (!user) return null;

  const isEmployee = user.role === 'owner' || user.role === 'operator';
  const isCast = user.role === 'cast';

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 bg-white shadow px-2 pt-2 pb-[calc(2.5rem+env(safe-area-inset-bottom))]">
      <div className="mx-auto max-w-sm flex justify-between items-center">
        {isEmployee && (
          <>
            <FooterButton to="/casts" icon={CastIcon} label="キャスト一覧" />
            <FooterButton to="/reservations" icon={ReservationIcon} label="来店予約" />
            <FooterButton to="/tables" icon={TableStatusIcon} label="卓状況" />
            <FooterButton to="/chat" icon={ChatIcon} label="チャット" />
            <FooterButton to="/settings" icon={SettingsIcon} label="設定" />
          </>
        )}
        {isCast && (
          <>
            <FooterButton to="/reservations" icon={ReservationIcon} label="来店予約" />
            <FooterButton to="/tables" icon={TableStatusIcon} label="卓状況" />
            <FooterButton to="/chat" icon={ChatIcon} label="チャット" />
          </>
        )}
      </div>
    </footer>
  );
};

export default Footer;
