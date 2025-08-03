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

  // 日付生成（今日から1ヶ月後まで）
  const generateDates = () => {
    const dates = [];
    const today = new Date();
    const oneMonthLater = new Date();
    oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);

    const weekDays = ['日', '月', '火', '水', '木', '金', '土'];

    for (let i = 0; i <= 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const weekDay = weekDays[date.getDay()];
      
      if (i === 0) {
        dates.push({ label: '今日', value: date.toISOString().split('T')[0], isToday: true });
      } else if (i === 1) {
        dates.push({ label: '明日', value: date.toISOString().split('T')[0], isToday: false });
      } else {
        dates.push({ 
          label: `${month}/${day}(${weekDay})`, 
          value: date.toISOString().split('T')[0],
          isToday: false 
        });
      }
    }
    
    return dates;
  };

  const dates = generateDates();

  // 初期値設定
  const [selectedDate, setSelectedDate] = useState(dates[0].value);
  const [selectedHour, setSelectedHour] = useState(() => {
    if (selectedTime && selectedTime.includes(':')) {
      // 既存の値から時間部分を抽出（日付がある場合も考慮）
      const timePart = selectedTime.split(' ').pop() || '';
      const [hour] = timePart.split(':');
      // 営業時間内の時間かチェック
      return hours.includes(hour) ? hour : '21';
    }
    return '21'; // デフォルト
  });

  const [selectedMinute, setSelectedMinute] = useState(() => {
    if (selectedTime && selectedTime.includes(':')) {
      // 既存の値から分部分を抽出（日付がある場合も考慮）
      const timePart = selectedTime.split(' ').pop() || '';
      const [, minute] = timePart.split(':');
      // 有効な分かチェック
      return minutes.includes(minute) ? minute : '00';
    }
    return '00'; // デフォルト
  });

  // スクロール用のref
  const dateScrollRef = useRef<HTMLDivElement>(null);
  const hourScrollRef = useRef<HTMLDivElement>(null);
  const minuteScrollRef = useRef<HTMLDivElement>(null);

  // モーダルが開いたときに選択された時間にスクロール
  useEffect(() => {
    if (isOpen) {
      // タイマーで少し遅延させて確実に要素が描画されてからスクロール
      setTimeout(() => scrollToSelected(), 50);
    }
  }, [isOpen]);

  const scrollToSelected = () => {
    // 日付のスクロール
    if (dateScrollRef.current) {
      const dateIndex = dates.findIndex(d => d.value === selectedDate);
      if (dateIndex !== -1) {
        // 選択項目を中央に配置（indexそのままで使用）
        const scrollPosition = dateIndex * 44;
        dateScrollRef.current.scrollTop = scrollPosition;
      }
    }

    // 時間のスクロール
    if (hourScrollRef.current) {
      const hourIndex = hours.indexOf(selectedHour);
      if (hourIndex !== -1) {
        const scrollPosition = hourIndex * 44;
        hourScrollRef.current.scrollTop = scrollPosition;
      }
    }

    // 分のスクロール
    if (minuteScrollRef.current) {
      const minuteIndex = minutes.indexOf(selectedMinute);
      if (minuteIndex !== -1) {
        const scrollPosition = minuteIndex * 44;
        minuteScrollRef.current.scrollTop = scrollPosition;
      }
    }
  };

  const handleScroll = (type: 'date' | 'hour' | 'minute', event: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = event.currentTarget.scrollTop;
    const index = Math.round(scrollTop / 44);
    
    if (type === 'date') {
      const newDate = dates[Math.max(0, Math.min(index, dates.length - 1))];
      if (newDate && newDate.value !== selectedDate) {
        setSelectedDate(newDate.value);
      }
    } else if (type === 'hour') {
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
    const selectedDateObj = dates.find(d => d.value === selectedDate);
    const dateLabel = selectedDateObj?.label || '';
    const result = `${dateLabel} ${selectedHour}:${selectedMinute}`;
    console.log('TimeSelectModal - Selected:', result);
    onTimeSelect(result);
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
            {/* Date column */}
            <div className="flex-1 h-full relative">
              <div 
                ref={dateScrollRef}
                onScroll={(e) => handleScroll('date', e)}
                className="h-full overflow-y-auto scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                style={{ scrollSnapType: 'y mandatory' }}
              >
                {/* 上部のパディング（短くして上の空白を削減） */}
                <div className="h-[calc(50%-44px)]" />
                
                {dates.map((date, index) => {
                  const isSelected = date.value === selectedDate;
                  const selectedIndex = dates.findIndex(d => d.value === selectedDate);
                  const distance = Math.abs(selectedIndex - index);
                  
                  return (
                    <div
                      key={date.value}
                      onClick={() => setSelectedDate(date.value)}
                      className={`h-11 flex items-center justify-center cursor-pointer ${getItemStyle(isSelected, distance)}`}
                      style={{ scrollSnapAlign: 'center' }}
                    >
                      {date.label}
                    </div>
                  );
                })}
                
                {/* 下部のパディング */}
                <div className="h-[calc(50%-22px)]" />
              </div>
            </div>

            {/* Hour column */}
            <div className="w-20 h-full relative">
              <div 
                ref={hourScrollRef}
                onScroll={(e) => handleScroll('hour', e)}
                className="h-full overflow-y-auto scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                style={{ scrollSnapType: 'y mandatory' }}
              >
                {/* 上部のパディング（短くして上の空白を削減） */}
                <div className="h-[calc(50%-44px)]" />
                
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
            <div className="w-5 flex items-center justify-center">
              <span className="text-white text-[22px]">:</span>
            </div>

            {/* Minute column */}
            <div className="w-20 h-full relative">
              <div 
                ref={minuteScrollRef}
                onScroll={(e) => handleScroll('minute', e)}
                className="h-full overflow-y-auto scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                style={{ scrollSnapType: 'y mandatory' }}
              >
                {/* 上部のパディング（短くして上の空白を削減） */}
                <div className="h-[calc(50%-44px)]" />
                
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