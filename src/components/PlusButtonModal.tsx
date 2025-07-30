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
        className="fixed inset-0 bg-black bg-opacity-75 z-40"
      />
      
      {/* Modal content - higher z-index than overlay */}
      <div className="fixed inset-0 z-[60] flex items-center justify-center pointer-events-none">
        <div className="relative bg-white rounded-2xl shadow-xl max-w-xs w-full mx-4 py-6 pointer-events-auto">
          {/* Menu items */}
          <div className="space-y-3 px-6">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={item.onClick}
                className="w-full flex items-center justify-between py-4 px-5 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors group"
              >
                <span className="text-gray-800 font-medium text-base">{item.title}</span>
                <span className="text-gray-400 group-hover:text-gray-600 transition-colors">→</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};