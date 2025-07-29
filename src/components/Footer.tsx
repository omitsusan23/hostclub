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

  console.log('🧪 Footer描画チェック', JSON.stringify({
    session: state.session,
    role,
    user_metadata: state.session?.user?.user_metadata,
  }, null, 2));

  if (!role) return null;

  const isOperator = role === 'operator' || role === 'owner' || role === 'admin';
  const isCast     = role === 'cast';

  const handlePlusClick = () => {
    console.log('Plus button clicked');
  };

  return (
    <footer
      className="
        fixed bottom-0 left-0 right-0 z-50
        bg-gray-100 shadow-lg border-t border-gray-300
        px-2 pt-3 pb-8 mt-6
        before:content-[''] before:absolute before:inset-x-0 before:bottom-0
        before:h-[env(safe-area-inset-bottom)] before:z-[-1]
      "
    >
      <div
        className="
          relative z-10
          grid grid-cols-5 max-w-[390px] mx-auto
          md:max-w-none md:w-full
          md:flex md:justify-between md:px-8
          items-center
        "
      >
        {isOperator && (
          <>
            <FooterButton to="/tables"       icon={TableStatusIcon} label="卓状況" />
            <FooterButton to="/reservations" icon={ReservationIcon} label="来店予約" />
            <button
              onClick={handlePlusClick}
              className="relative flex flex-col items-center justify-center text-xs text-gray-700 hover:text-pink-600"
            >
              <div className="absolute -top-4 w-16 h-16 bg-black rounded-full flex items-center justify-center text-white font-bold text-3xl shadow-lg">
                +
              </div>
              <span className="mt-12"></span>
            </button>
            <FooterButton to="/store-page"   icon={SettingsIcon}    label="店舗" />
            <FooterButton to="/casts"        icon={CastIcon}        label="スタッフ" />
          </>
        )}

        {isCast && (
          <>
            <FooterButton to="/tables"       icon={TableStatusIcon} label="卓状況" />
            <FooterButton to="/reservations" icon={ReservationIcon} label="来店予約" />
            <button
              onClick={handlePlusClick}
              className="relative flex flex-col items-center justify-center text-xs text-gray-700 hover:text-pink-600"
            >
              <div className="absolute -top-4 w-16 h-16 bg-black rounded-full flex items-center justify-center text-white font-bold text-3xl shadow-lg">
                +
              </div>
              <span className="mt-12"></span>
            </button>
            <FooterButton to="/princess-page" icon={CastIcon}      label="姫" />
            <FooterButton to="/score-page"    icon={ChatIcon}      label="成績" />
          </>
        )}
      </div>
    </footer>
  );
};

export default Footer;
