import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { FooterButton } from './FooterButton';
import { PlusButtonModal } from './PlusButtonModal';
import { ReservationAddModal } from './ReservationAddModal';
import { ReservationTransition } from './ReservationTransition';
import PrincessAddModal from './PrincessAddModal';
import { PrincessTransition } from './PrincessTransition';
import NotificationModal from './NotificationModal';
import { NotificationTransition } from './NotificationTransition';
import StaffAddModal from './StaffAddModal';
import { StaffTransition } from './StaffTransition';
import DailyReportModal from './DailyReportModal';
import { DailyReportTransition } from './DailyReportTransition';
import FirstVisitModal from './FirstVisitModal';
import { FirstVisitTransition } from './FirstVisitTransition';
import VisitModal from './VisitModal';
import { VisitTransition } from './VisitTransition';

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
  const [isPrincessModalOpen, setIsPrincessModalOpen] = useState(false);
  const [isPrincessAnimating, setIsPrincessAnimating] = useState(false);
  const [princessAnimationTriggerPosition, setPrincessAnimationTriggerPosition] = useState<{ x: number; y: number }>();
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [isNotificationAnimating, setIsNotificationAnimating] = useState(false);
  const [notificationAnimationTriggerPosition, setNotificationAnimationTriggerPosition] = useState<{ x: number; y: number }>();
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [isStaffAnimating, setIsStaffAnimating] = useState(false);
  const [staffAnimationTriggerPosition, setStaffAnimationTriggerPosition] = useState<{ x: number; y: number }>();
  const [isDailyReportModalOpen, setIsDailyReportModalOpen] = useState(false);
  const [isDailyReportAnimating, setIsDailyReportAnimating] = useState(false);
  const [dailyReportAnimationTriggerPosition, setDailyReportAnimationTriggerPosition] = useState<{ x: number; y: number }>();
  const [isFirstVisitModalOpen, setIsFirstVisitModalOpen] = useState(false);
  const [isFirstVisitAnimating, setIsFirstVisitAnimating] = useState(false);
  const [firstVisitAnimationTriggerPosition, setFirstVisitAnimationTriggerPosition] = useState<{ x: number; y: number }>();
  const [isVisitModalOpen, setIsVisitModalOpen] = useState(false);
  const [isVisitAnimating, setIsVisitAnimating] = useState(false);
  const [visitAnimationTriggerPosition, setVisitAnimationTriggerPosition] = useState<{ x: number; y: number }>();

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

  // PrincessAddModalが開いている時は、フッターを非表示にする
  if (isPrincessModalOpen) {
    return (
      <PrincessAddModal
        isOpen={isPrincessModalOpen}
        onClose={() => setIsPrincessModalOpen(false)}
      />
    );
  }

  // NotificationModalが開いている時は、フッターを非表示にする
  if (isNotificationModalOpen) {
    return (
      <NotificationModal
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
      />
    );
  }

  // StaffAddModalが開いている時は、フッターを非表示にする
  if (isStaffModalOpen) {
    return (
      <StaffAddModal
        isOpen={isStaffModalOpen}
        onClose={() => setIsStaffModalOpen(false)}
      />
    );
  }

  // DailyReportModalが開いている時は、フッターを非表示にする
  if (isDailyReportModalOpen) {
    return (
      <DailyReportModal
        isOpen={isDailyReportModalOpen}
        onClose={() => setIsDailyReportModalOpen(false)}
      />
    );
  }

  // FirstVisitModalが開いている時は、フッターを非表示にする
  if (isFirstVisitModalOpen) {
    return (
      <FirstVisitModal
        isOpen={isFirstVisitModalOpen}
        onClose={() => setIsFirstVisitModalOpen(false)}
      />
    );
  }

  // VisitModalが開いている時は、フッターを非表示にする
  if (isVisitModalOpen) {
    return (
      <VisitModal
        isOpen={isVisitModalOpen}
        onClose={() => setIsVisitModalOpen(false)}
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
        <div className="w-[80px] h-[80px] bg-white rounded-full flex items-center justify-center shadow-lg">
          {/* Gray circle */}
          <div className="w-[72px] h-[72px] bg-gray-300 rounded-full flex items-center justify-center">
            {/* Black circle */}
            <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center text-white relative">
              <div 
                className={`absolute w-full h-full flex items-center justify-center transition-transform duration-200 ${isModalOpen ? 'rotate-45' : ''}`}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 5v14M5 12h14" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                </svg>
              </div>
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
      onPrincessClick={(position) => {
        setPrincessAnimationTriggerPosition(position);
        setIsPrincessAnimating(true);
        handleModalClose();
      }}
      onNotificationClick={(position) => {
        setNotificationAnimationTriggerPosition(position);
        setIsNotificationAnimating(true);
        handleModalClose();
      }}
      onStaffClick={(position) => {
        setStaffAnimationTriggerPosition(position);
        setIsStaffAnimating(true);
        handleModalClose();
      }}
      onDailyReportClick={(position) => {
        setDailyReportAnimationTriggerPosition(position);
        setIsDailyReportAnimating(true);
        handleModalClose();
      }}
      onFirstVisitClick={(position) => {
        setFirstVisitAnimationTriggerPosition(position);
        setIsFirstVisitAnimating(true);
        handleModalClose();
      }}
      onVisitClick={(position) => {
        setVisitAnimationTriggerPosition(position);
        setIsVisitAnimating(true);
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
    
    <PrincessAddModal
      isOpen={isPrincessModalOpen}
      onClose={() => setIsPrincessModalOpen(false)}
    />
    
    <PrincessTransition
      isAnimating={isPrincessAnimating}
      onComplete={() => {
        setIsPrincessAnimating(false);
        setIsPrincessModalOpen(true);
      }}
      onClose={() => {
        setIsPrincessAnimating(false);
      }}
      triggerPosition={princessAnimationTriggerPosition}
    />
    
    <NotificationModal
      isOpen={isNotificationModalOpen}
      onClose={() => setIsNotificationModalOpen(false)}
    />
    
    <NotificationTransition
      isAnimating={isNotificationAnimating}
      onAnimationComplete={() => {
        setIsNotificationAnimating(false);
        setIsNotificationModalOpen(true);
      }}
      triggerPosition={notificationAnimationTriggerPosition}
    />
    
    <StaffAddModal
      isOpen={isStaffModalOpen}
      onClose={() => setIsStaffModalOpen(false)}
    />
    
    <StaffTransition
      isAnimating={isStaffAnimating}
      onAnimationComplete={() => {
        setIsStaffAnimating(false);
        setIsStaffModalOpen(true);
      }}
      triggerPosition={staffAnimationTriggerPosition}
    />
    
    <DailyReportModal
      isOpen={isDailyReportModalOpen}
      onClose={() => setIsDailyReportModalOpen(false)}
    />
    
    <DailyReportTransition
      isAnimating={isDailyReportAnimating}
      onAnimationComplete={() => {
        setIsDailyReportAnimating(false);
        setIsDailyReportModalOpen(true);
      }}
      triggerPosition={dailyReportAnimationTriggerPosition}
    />
    
    <FirstVisitModal
      isOpen={isFirstVisitModalOpen}
      onClose={() => setIsFirstVisitModalOpen(false)}
    />
    
    <FirstVisitTransition
      isAnimating={isFirstVisitAnimating}
      onAnimationComplete={() => {
        setIsFirstVisitAnimating(false);
        setIsFirstVisitModalOpen(true);
      }}
      triggerPosition={firstVisitAnimationTriggerPosition}
    />
    
    <VisitModal
      isOpen={isVisitModalOpen}
      onClose={() => setIsVisitModalOpen(false)}
    />
    
    <VisitTransition
      isAnimating={isVisitAnimating}
      onAnimationComplete={() => {
        setIsVisitAnimating(false);
        setIsVisitModalOpen(true);
      }}
      triggerPosition={visitAnimationTriggerPosition}
    />
    </>
  );
};

export default Footer;
