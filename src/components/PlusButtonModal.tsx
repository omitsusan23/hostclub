import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  TouchSensor,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface PlusButtonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReservationClick: (position: { x: number; y: number }) => void;
  onPrincessClick: (position: { x: number; y: number }) => void;
  onNotificationClick: (position: { x: number; y: number }) => void;
  onStaffClick: (position: { x: number; y: number }) => void;
  onDailyReportClick: (position: { x: number; y: number }) => void;
  onFirstVisitClick: (position: { x: number; y: number }) => void;
  onVisitClick: (position: { x: number; y: number }) => void;
}

interface MenuItem {
  id: string;
  title: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

// Sortable Item Component
const SortableItem: React.FC<{ 
  item: MenuItem; 
  isEditMode: boolean;
  isDragging?: boolean;
}> = ({ item, isEditMode, isDragging }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: item.id, disabled: !isEditMode });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...(isEditMode ? listeners : {})}
      className={`text-white text-left block w-full ${isEditMode ? 'touch-none' : ''}`}
    >
      <button
        onClick={(e) => !isEditMode && item.onClick(e)}
        className={`w-full ${isEditMode ? 'pointer-events-none' : ''}`}
        disabled={isEditMode}
      >
        <div className="py-3">
          <div className="flex flex-col items-center">
            <div className="relative w-[180px]">
              <div className="flex items-center">
                {/* Checkbox icon */}
                <div className={`w-6 h-6 border-2 border-white rounded flex items-center justify-center mr-3 flex-shrink-0 ${
                  isEditMode ? 'animate-wiggle' : ''
                }`}>
                  {isEditMode && (
                    <div className="w-2 h-2 bg-white rounded-full" />
                  )}
                </div>
                <span className={`text-xl font-bold ${isEditMode ? 'animate-wiggle' : ''}`}>
                  {item.title}
                </span>
              </div>
            </div>
            {/* Bottom border - 6文字分の幅 */}
            <div className="h-[2px] bg-white mt-3 w-[180px]" />
          </div>
        </div>
      </button>
    </div>
  );
};

export const PlusButtonModal: React.FC<PlusButtonModalProps> = ({ 
  isOpen, 
  onClose, 
  onReservationClick, 
  onPrincessClick, 
  onNotificationClick,
  onStaffClick,
  onDailyReportClick,
  onFirstVisitClick,
  onVisitClick 
}) => {
  const { state } = useAppContext();
  const role = state.session?.user?.user_metadata?.role;
  const [isEditMode, setIsEditMode] = useState(false);
  const [items, setItems] = useState<MenuItem[]>([]);
  const longPressTimer = useRef<NodeJS.Timeout>();
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize sensors for drag and drop
  const sensors = useSensors(
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 0,
        tolerance: 5,
      },
    }),
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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

  const handleStaffClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const position = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    };
    onStaffClick(position);
  };

  const handleDailyReportClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const position = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    };
    onDailyReportClick(position);
  };

  const handleFirstVisitClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const position = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    };
    onFirstVisitClick(position);
  };

  const handleVisitClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const position = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    };
    onVisitClick(position);
  };

  const isOperator = role === 'operator' || role === 'owner' || role === 'admin';
  const isCast = role === 'cast';

  // Get menu items based on permissions
  const getMenuItems = React.useCallback(() => {
    const menuItems: MenuItem[] = [];

    // Always show reservation for both roles
    menuItems.push({
      id: 'reservation',
      title: '来店予約追加',
      onClick: handleReservationClick
    });

    // Add princess option for cast role
    if (isCast) {
      menuItems.push({
        id: 'add-princess',
        title: '姫追加',
        onClick: handlePrincessClick
      });
    }

    // Add notification option for all roles
    menuItems.push({
      id: 'notification',
      title: 'お知らせ',
      onClick: handleNotificationClick
    });

    // Add staff option
    menuItems.push({
      id: 'staff',
      title: 'スタッフ追加',
      onClick: handleStaffClick
    });

    // Add daily report option
    menuItems.push({
      id: 'daily-report',
      title: '日報',
      onClick: handleDailyReportClick
    });

    // Add first visit option
    menuItems.push({
      id: 'first-visit',
      title: '初回来店',
      onClick: handleFirstVisitClick
    });

    // Add visit option
    menuItems.push({
      id: 'visit',
      title: '来店',
      onClick: handleVisitClick
    });

    return menuItems;
  }, [isCast]);

  // Initialize items on mount and when role changes
  useEffect(() => {
    if (isOpen) {
      // Load saved order from localStorage or use default
      const savedOrder = localStorage.getItem(`plusButtonOrder_${role}`);
      const defaultItems = getMenuItems();
      
      if (savedOrder) {
        try {
          const orderIds = JSON.parse(savedOrder);
          const orderedItems = orderIds
            .map((id: string) => defaultItems.find(item => item.id === id))
            .filter(Boolean) as MenuItem[];
          
          // Add any new items that aren't in saved order
          const newItems = defaultItems.filter(
            item => !orderIds.includes(item.id)
          );
          
          setItems([...orderedItems, ...newItems]);
        } catch {
          setItems(defaultItems);
        }
      } else {
        setItems(defaultItems);
      }
    }
  }, [isOpen, role, getMenuItems]);

  // Long press detection
  const handleTouchStart = () => {
    longPressTimer.current = setTimeout(() => {
      setIsEditMode(true);
      // Vibrate if available
      if ('vibrate' in navigator) {
        navigator.vibrate(50);
      }
    }, 500);
  };

  const handleTouchEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
  };

  // Handle drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        const newItems = arrayMove(items, oldIndex, newIndex);
        
        // Save new order to localStorage
        const orderIds = newItems.map(item => item.id);
        localStorage.setItem(`plusButtonOrder_${role}`, JSON.stringify(orderIds));
        
        return newItems;
      });
    }
  };

  // Handle overlay click
  const handleOverlayClick = () => {
    if (isEditMode) {
      setIsEditMode(false);
    } else {
      onClose();
    }
  };

  // 条件付き返却をフックの後に移動
  if (!isOpen) return null;

  return (
    <>
      {/* Black overlay - covers entire screen */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-75 z-[100]"
        onClick={handleOverlayClick}
      />
      
      {/* Modal content - positioned above the X button */}
      <div 
        ref={containerRef}
        className="fixed bottom-[140px] left-0 right-0 z-[110] flex justify-center"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleTouchStart}
        onMouseUp={handleTouchEnd}
        onMouseLeave={handleTouchEnd}
      >
        {/* Menu items */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={items.map(item => item.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-0 w-[240px]">
              {items.map((item) => (
                <SortableItem
                  key={item.id}
                  item={item}
                  isEditMode={isEditMode}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>
      
      {/* Edit mode indicator */}
      {isEditMode && (
        <div className="fixed top-20 left-0 right-0 z-[120] px-4">
          <div className="flex items-center justify-between max-w-md mx-auto">
            <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
              <span className="text-white text-sm">長押しして移動</span>
            </div>
            <button
              onClick={() => setIsEditMode(false)}
              className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-white text-sm hover:bg-white/30 transition-colors"
            >
              完了
            </button>
          </div>
        </div>
      )}
    </>
  );
};