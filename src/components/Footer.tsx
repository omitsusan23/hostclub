// src/components/Footer.tsx
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
  const user = state.currentUser;
  if (!user) return null;

  const isEmployee = user.role === 'owner' || user.role === 'operator';
  const isCast     = user.role === 'cast';

  return (
    <footer
      className="
        fixed bottom-0 left-0 right-0 z-50 bg-white shadow
        px-2 pt-2 pb-[calc(2.5rem+env(safe-area-inset-bottom))]
      "
    >
      {/* ==== モバイル ====
           - 390px 上限グリッドで中央揃え
         ==== md 以上 ====
           - max-w 制限解除 & フレックスで左右いっぱい
      */}
      <div
        className="
          grid grid-cols-5 max-w-[390px] mx-auto
          md:max-w-none md:w-full              /* 幅制限を解除           */
          md:flex md:justify-between md:px-8   /* 左右いっぱい＆余白     */
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
            <div className="hidden md:block" /> {/* モバイルグリッド用の空セルは非表示 */}
          </>
        )}
      </div>
    </footer>
  );
};

export default Footer;
