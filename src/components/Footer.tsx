// src/components/Footer.tsx
import React from 'react';
import { useAppContext } from '../context/AppContext';
import { FooterButton } from './FooterButton';

// アイコン読み込み
import CastIcon from '../assets/icons/cast.svg';
import ReservationIcon from '../assets/icons/reservation.svg';
import TableStatusIcon from '../assets/icons/table-status.svg';
import SettingsIcon from '../assets/icons/settings.svg';

const Footer: React.FC = () => {
  const { state } = useAppContext();
  const user = state.currentUser;

  if (!user) return null;

  const isEmployee = user.role === 'owner' || user.role === 'operator';
  const isCast = user.role === 'cast';

  return (
    <footer className="bg-white shadow p-2 flex justify-around items-center">
      {isEmployee && (
        <>
          <FooterButton to="/tables" icon={TableStatusIcon} label="卓状況" />
          <FooterButton to="/reservations" icon={ReservationIcon} label="来店予約" />
          <FooterButton to="/casts" icon={CastIcon} label="キャスト一覧" />
          <FooterButton to="/settings" icon={SettingsIcon} label="設定" />
        </>
      )}
      {isCast && (
        <>
          <FooterButton to="/tables" icon={TableStatusIcon} label="卓状況" />
          <FooterButton to="/reservations" icon={ReservationIcon} label="来店予約" />
        </>
      )}
    </footer>
  );
};

export default Footer;
