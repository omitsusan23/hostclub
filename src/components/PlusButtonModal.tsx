import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { ReservationAddModal } from './ReservationAddModal';

interface PlusButtonModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PlusButtonModal: React.FC<PlusButtonModalProps> = ({ isOpen, onClose }) => {
  const { state } = useAppContext();
  const role = state.session?.user?.user_metadata?.role;
  const [isReservationModalOpen, setIsReservationModalOpen] = useState(false);

  if (!isOpen) return null;

  const handleReservationClick = () => {
    onClose();
    setIsReservationModalOpen(true);
  };

  const isOperator = role === 'operator' || role === 'owner' || role === 'admin';
  const isCast = role === 'cast';

  // Future: This will be expanded based on user permissions
  const getMenuItems = () => {
    const items = [];

    // Always show reservation for both roles (as per current Footer setup)
    items.push({
      id: 'reservation',
      title: '来店予約追加',
      onClick: handleReservationClick
    });

    // Future implementation for new store visit and princess addition
    // These will be conditionally shown based on permissions
    if (isOperator) {
      // items.push({
      //   id: 'new-visit',
      //   title: '新規来店',
      //   onClick: () => { /* Future implementation */ }
      // });
      // items.push({
      //   id: 'add-princess',
      //   title: '姫追加',
      //   onClick: () => { /* Future implementation */ }
      // });
    }

    return items;
  };

  const menuItems = getMenuItems();

  return (
    <>
      {/* Black overlay - covers entire screen */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-75 z-[55]"
      />
      
      {/* Modal content - positioned above the X button */}
      <div className="fixed bottom-[140px] left-0 right-0 z-[65] flex justify-center">
        {/* Menu items without background container */}
        <div className="space-y-0">
          {menuItems.map((item, index) => (
            <button
              key={item.id}
              onClick={item.onClick}
              className="text-white text-left block"
            >
              <div className="py-3">
                <div className="flex items-center">
                  {/* Checkbox icon */}
                  <div className="w-6 h-6 border-2 border-white rounded flex items-center justify-center mr-3 flex-shrink-0">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-xl font-bold">{item.title}</span>
                </div>
                {/* Bottom border */}
                <div className="h-[2px] bg-white mt-3 w-[240px]" />
              </div>
            </button>
          ))}
        </div>
      </div>
      
      {/* Reservation Add Modal */}
      <ReservationAddModal 
        isOpen={isReservationModalOpen} 
        onClose={() => setIsReservationModalOpen(false)} 
      />
    </>
  );
};