import React from 'react';
import { useAppContext } from '../context/AppContext';

interface PlusButtonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReservationClick: (position: { x: number; y: number }) => void;
  onPrincessClick: (position: { x: number; y: number }) => void;
  onNotificationClick: (position: { x: number; y: number }) => void;
}

export const PlusButtonModal: React.FC<PlusButtonModalProps> = ({ isOpen, onClose, onReservationClick, onPrincessClick, onNotificationClick }) => {
  const { state } = useAppContext();
  const role = state.session?.user?.user_metadata?.role;

  if (!isOpen) return null;

  const handleReservationClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const position = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    };
    onReservationClick(position);
  };

  const handlePrincessClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const position = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    };
    onPrincessClick(position);
  };

  const handleNotificationClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const position = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    };
    onNotificationClick(position);
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
      onClick: (e: React.MouseEvent<HTMLButtonElement>) => handleReservationClick(e)
    });

    // Add princess option for cast role
    if (isCast) {
      items.push({
        id: 'add-princess',
        title: '姫追加',
        onClick: (e: React.MouseEvent<HTMLButtonElement>) => handlePrincessClick(e)
      });
    }

    // Add notification option for all roles
    items.push({
      id: 'notification',
      title: 'お知らせ',
      onClick: (e: React.MouseEvent<HTMLButtonElement>) => handleNotificationClick(e)
    });

    return items;
  };

  const menuItems = getMenuItems();

  return (
    <>
      {/* Black overlay - covers entire screen */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-75 z-[100]"
        onClick={onClose}
      />
      
      {/* Modal content - positioned above the X button */}
      <div className="fixed bottom-[140px] left-0 right-0 z-[110] flex justify-center">
        {/* Menu items without background container */}
        <div className="space-y-0 w-[240px]">
          {menuItems.map((item, index) => (
            <button
              key={item.id}
              onClick={(e) => item.onClick(e)}
              className="text-white text-left block w-full"
            >
              <div className="py-3">
                <div className="flex flex-col items-start">
                  <div className="flex items-center">
                    {/* Checkbox icon - unchecked by default */}
                    <div className="w-6 h-6 border-2 border-white rounded flex items-center justify-center mr-3 flex-shrink-0">
                      {/* Empty checkbox - no checkmark */}
                    </div>
                    <span className="text-xl font-bold">{item.title}</span>
                  </div>
                  {/* Bottom border - 6文字分の幅 */}
                  <div className="h-[2px] bg-white mt-3 w-[180px]" />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </>
  );
};