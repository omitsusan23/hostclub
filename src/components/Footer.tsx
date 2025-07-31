import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { FooterButton } from './FooterButton';
import { PlusButtonModal } from './PlusButtonModal';
import { ReservationAddModal } from './ReservationAddModal';
import { ReservationTransition } from './ReservationTransition';

/* アイコン */
import CastIcon        from '../assets/icons/cast.svg';
import ReservationIcon from '../assets/icons/reservation.svg';
import TableStatusIcon from '../assets/icons/table-status.svg';
import ChatIcon        from '../assets/icons/chat.svg';
import SettingsIcon    from '../assets/icons/settings.svg';

const Footer: React.FC = () => {
  const { state } = useAppContext();
  const role = state.session?.user?.user_metadata?.role;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReservationModalOpen, setIsReservationModalOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationTriggerPosition, setAnimationTriggerPosition] = useState<{ x: number; y: number }>();

  console.log('🧪 Footer描画チェック', JSON.stringify({
    session: state.session,
    role,
    user_metadata: state.session?.user?.user_metadata,
  }, null, 2));

  if (!role) return null;

  const isOperator = role === 'operator' || role === 'owner' || role === 'admin';
  const isCast     = role === 'cast';

  const handlePlusClick = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  // ReservationAddModalが開いている時は、フッターを非表示にする
  if (isReservationModalOpen) {
    return (
      <ReservationAddModal
        isOpen={isReservationModalOpen}
        onClose={() => setIsReservationModalOpen(false)}
      />
    );
  }

  return (
    <>
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
            <FooterButton to="/tables"       icon={TableStatusIcon} label="卓状況" disabled={isModalOpen} />
            <FooterButton to="/reservations" icon={ReservationIcon} label="来店予約" disabled={isModalOpen} />
            {/* Placeholder for plus button spacing */}
            <div className="relative flex flex-col items-center justify-center">
              <span className="mt-12"></span>
            </div>
            <FooterButton to="/store-page"   icon={SettingsIcon}    label="店舗" disabled={isModalOpen} />
            <FooterButton to="/casts"        icon={CastIcon}        label="スタッフ" disabled={isModalOpen} />
          </>
        )}

        {isCast && (
          <>
            <FooterButton to="/tables"       icon={TableStatusIcon} label="卓状況" disabled={isModalOpen} />
            <FooterButton to="/reservations" icon={ReservationIcon} label="来店予約" disabled={isModalOpen} />
            {/* Placeholder for plus button spacing */}
            <div className="relative flex flex-col items-center justify-center">
              <span className="mt-12"></span>
            </div>
            <FooterButton to="/princess-page" icon={CastIcon}      label="姫" disabled={isModalOpen} />
            <FooterButton to="/score-page"    icon={ChatIcon}      label="成績" disabled={isModalOpen} />
          </>
        )}
      </div>
      </footer>
    
    {/* Plus button - outside footer's stacking context */}
    {(isOperator || isCast) && (
      <button
        onClick={handlePlusClick}
        className="fixed bottom-[52px] left-1/2 transform -translate-x-1/2 z-[9999] flex flex-col items-center justify-center text-xs text-gray-700 hover:text-pink-600"
      >
        {/* Outer white circle */}
        <div className="w-[74px] h-[74px] bg-white rounded-full flex items-center justify-center shadow-lg">
          {/* Gray circle */}
          <div className="w-[72px] h-[72px] bg-gray-300 rounded-full flex items-center justify-center">
            {/* Black circle */}
            <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center text-white font-bold text-3xl">
              <span className={`inline-block transition-transform duration-200 ${isModalOpen ? 'rotate-45' : ''}`}>
                +
              </span>
            </div>
          </div>
        </div>
      </button>
    )}
      
    <PlusButtonModal 
      isOpen={isModalOpen} 
      onClose={handleModalClose}
      onReservationClick={(position) => {
        setAnimationTriggerPosition(position);
        setIsAnimating(true);
        handleModalClose();
      }}
    />
    
    <ReservationAddModal
      isOpen={isReservationModalOpen}
      onClose={() => setIsReservationModalOpen(false)}
    />
    
    <ReservationTransition
      isAnimating={isAnimating}
      onComplete={() => {
        setIsAnimating(false);
        setIsReservationModalOpen(true);
      }}
      onClose={() => {
        setIsAnimating(false);
      }}
      triggerPosition={animationTriggerPosition}
    />
    </>
  );
};

export default Footer;
