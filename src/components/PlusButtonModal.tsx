import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

interface PlusButtonModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PlusButtonModal: React.FC<PlusButtonModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { state } = useAppContext();
  const role = state.session?.user?.user_metadata?.role;

  if (!isOpen) return null;

  const handleReservationClick = () => {
    onClose();
    navigate('/reservations');
  };

  const isOperator = role === 'operator' || role === 'owner' || role === 'admin';
  const isCast = role === 'cast';

  // Future: This will be expanded based on user permissions
  const getMenuItems = () => {
    const items = [];

    // Always show reservation for both roles (as per current Footer setup)
    items.push({
      id: 'reservation',
      title: '来店予約',
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
      
      {/* Modal content - positioned to be centered with X button */}
      <div className="fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[65]">
        {/* Menu items with black background style */}
        <div className="bg-black rounded-lg overflow-hidden">
          {menuItems.map((item, index) => (
            <button
              key={item.id}
              onClick={item.onClick}
              className="w-full text-white hover:bg-gray-900 transition-colors block"
            >
              <div className="px-6 py-4">
                <div className="flex items-center">
                  {/* Checkbox icon */}
                  <div className="w-5 h-5 border-2 border-white rounded-sm flex items-center justify-center mr-3">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-base font-medium whitespace-nowrap">{item.title}</span>
                </div>
              </div>
              {/* Bottom border - not on last item */}
              {index < menuItems.length - 1 && (
                <div className="h-[1px] bg-white opacity-20 mx-4" />
              )}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};