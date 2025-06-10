import React from 'react';
import { useAppContext } from '../context/AppContext';
import { FooterButton } from './FooterButton';

/* アイコン */
import CastIcon        from '../assets/icons/cast.svg';
import ReservationIcon from '../assets/icons/reservation.svg';
import TableStatusIcon from '../assets/icons/table-status.svg';
import ChatIcon        from '../assets/icons/chat.svg';
import SettingsIcon    from '../assets/icons/settings.svg';

const Footer: React.FC = () => {
  const { state } = useAppContext();
  const role = state.session?.user?.user_metadata?.role;

  if (!role) return null;

  const isEmployee = role === 'owner' || role === 'operator';
  const isCast     = role === 'cast';

  return (
    <footer
      className="
        fixed bottom-0 left-0 right-0 z-50
        bg-white shadow px-2 pt-2 pb-10
        before:content-[''] before:absolute before:inset-x-0 before:bottom-0
        before:h-[env(safe-area-inset-bottom)] before:bg-white before:z-[-1]
      "
    >
      <div
        className="
          relative z-10
          grid grid-cols-5 max-w-[390px] mx-auto
          md:max-w-none md:w-full
          md:flex md:justify-between md:px-8
        "
      >
        {isEmployee && (
          <>
            <FooterButton to="/casts"        icon={CastIcon}        label="キャスト" />
            <FooterButton to="/reservations" icon={ReservationIcon} label="来店予約" />
            <FooterButton to="/tables"       icon={TableStatusIcon} label="卓状況"   />
            <FooterButton to="/chat"         icon={ChatIcon}        label="チャット" />
            <FooterButton to="/settings"     icon={SettingsIcon}    label="設定"     />
          </>
        )}

        {isCast && (
          <>
            <FooterButton to="/tables"       icon={TableStatusIcon} label="卓状況"   />
            <FooterButton to="/reservations" icon={ReservationIcon} label="来店予約" />
            <FooterButton to="/chat"         icon={ChatIcon}        label="チャット" />
            <FooterButton to="/settings"     icon={SettingsIcon}    label="設定"     />
            <div className="hidden md:block" />
          </>
        )}
      </div>
    </footer>
  );
};

export default Footer;
