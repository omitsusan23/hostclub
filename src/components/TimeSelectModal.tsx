import React, { useState, useRef, useEffect } from 'react';

interface TimeSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTime: string;
  onTimeSelect: (time: string) => void;
}

export const TimeSelectModal: React.FC<TimeSelectModalProps> = ({
  isOpen,
  onClose,
  selectedTime,
  onTimeSelect,
}) => {
  // 営業時間設定（20:00〜01:00）
  const hours = ['20', '21', '22', '23', '00', '01'];
  const minutes = ['00', '15', '30', '45'];

  // 初期値設定
  const [selectedHour, setSelectedHour] = useState(() => {
    if (selectedTime) {
      const [hour] = selectedTime.split(':');
      return hour;
    }
    return '21'; // デフォルト
  });

  const [selectedMinute, setSelectedMinute] = useState(() => {
    if (selectedTime) {
      const [, minute] = selectedTime.split(':');
      return minute;
    }
    return '00'; // デフォルト
  });

  // スクロール用のref
  const hourScrollRef = useRef<HTMLDivElement>(null);
  const minuteScrollRef = useRef<HTMLDivElement>(null);

  // モーダルが開いたときに選択された時間にスクロール
  useEffect(() => {
    if (isOpen) {
      scrollToSelected();
    }
  }, [isOpen]);

  const scrollToSelected = () => {
    // 時間のスクロール
    if (hourScrollRef.current) {
      const hourIndex = hours.indexOf(selectedHour);
      if (hourIndex !== -1) {
        // 選択アイテムが真ん中（3番目の位置）に来るようにスクロール
        // 上に1つ余分なアイテムが見えるように調整
        const scrollPosition = (hourIndex - 1.8) * 44; // 44px = h-11
        hourScrollRef.current.scrollTop = scrollPosition;
      }
    }

    // 分のスクロール
    if (minuteScrollRef.current) {
      const minuteIndex = minutes.indexOf(selectedMinute);
      if (minuteIndex !== -1) {
        const scrollPosition = (minuteIndex - 1.8) * 44;
        minuteScrollRef.current.scrollTop = scrollPosition;
      }
    }
  };

  const handleScroll = (type: 'hour' | 'minute', event: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = event.currentTarget.scrollTop;
    const index = Math.round(scrollTop / 44);
    
    if (type === 'hour') {
      const newHour = hours[Math.max(0, Math.min(index, hours.length - 1))];
      if (newHour !== selectedHour) {
        setSelectedHour(newHour);
      }
    } else {
      const newMinute = minutes[Math.max(0, Math.min(index, minutes.length - 1))];
      if (newMinute !== selectedMinute) {
        setSelectedMinute(newMinute);
      }
    }
  };

  const handleComplete = () => {
    onTimeSelect(`${selectedHour}:${selectedMinute}`);
    onClose();
  };

  const getItemStyle = (isSelected: boolean, distance: number) => {
    if (isSelected) {
      return "text-white text-[22px]";
    } else if (distance === 1) {
      return "text-[#999999] text-xl";
    } else {
      return "text-[#666666] text-lg";
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-end justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-black w-full h-[50vh] rounded-t-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#38383a]">
          <h2 className="text-white text-lg font-semibold">入店予定時間</h2>
          <button
            onClick={handleComplete}
            className="text-white text-base font-medium border-b border-white pb-0.5"
          >
            完了
          </button>
        </div>

        {/* Time Picker Content */}
        <div className="flex-1 relative">
          {/* Selection highlight */}
          <div 
            className="absolute w-[calc(100%-48px)] h-[38px] top-1/2 left-6 -translate-y-1/2 bg-[#9191917d] rounded-[10px] pointer-events-none z-10"
          />

          {/* Picker columns */}
          <div className="flex h-full items-center justify-center px-6">
            {/* Hour column */}
            <div className="flex-1 h-full relative">
              <div 
                ref={hourScrollRef}
                onScroll={(e) => handleScroll('hour', e)}
                className="h-full overflow-y-auto scrollbar-hide scroll-smooth"
                style={{ scrollSnapType: 'y mandatory' }}
              >
                {/* 上部のパディング */}
                <div className="h-[calc(50%-22px)]" />
                
                {hours.map((hour, index) => {
                  const isSelected = hour === selectedHour;
                  const distance = Math.abs(hours.indexOf(selectedHour) - index);
                  
                  return (
                    <div
                      key={hour}
                      onClick={() => setSelectedHour(hour)}
                      className={`h-11 flex items-center justify-center cursor-pointer ${getItemStyle(isSelected, distance)}`}
                      style={{ scrollSnapAlign: 'center' }}
                    >
                      {hour}
                    </div>
                  );
                })}
                
                {/* 下部のパディング */}
                <div className="h-[calc(50%-22px)]" />
              </div>
            </div>

            {/* Colon separator */}
            <div className="w-8 flex items-center justify-center">
              <span className="text-white text-[22px]">:</span>
            </div>

            {/* Minute column */}
            <div className="flex-1 h-full relative">
              <div 
                ref={minuteScrollRef}
                onScroll={(e) => handleScroll('minute', e)}
                className="h-full overflow-y-auto scrollbar-hide scroll-smooth"
                style={{ scrollSnapType: 'y mandatory' }}
              >
                {/* 上部のパディング */}
                <div className="h-[calc(50%-22px)]" />
                
                {minutes.map((minute, index) => {
                  const isSelected = minute === selectedMinute;
                  const distance = Math.abs(minutes.indexOf(selectedMinute) - index);
                  
                  return (
                    <div
                      key={minute}
                      onClick={() => setSelectedMinute(minute)}
                      className={`h-11 flex items-center justify-center cursor-pointer ${getItemStyle(isSelected, distance)}`}
                      style={{ scrollSnapAlign: 'center' }}
                    >
                      {minute}
                    </div>
                  );
                })}
                
                {/* 下部のパディング */}
                <div className="h-[calc(50%-22px)]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};