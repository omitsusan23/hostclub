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

  // 初期値設定（当日、現在選択可能な時間）
  const [selectedDate, setSelectedDate] = useState(dates[0].value);
  const [selectedHour, setSelectedHour] = useState('21');
  const [selectedMinute, setSelectedMinute] = useState('00');

  // スクロール用のref
  const dateScrollRef = useRef<HTMLDivElement>(null);
  const hourScrollRef = useRef<HTMLDivElement>(null);
  const minuteScrollRef = useRef<HTMLDivElement>(null);

  // モーダルが開いたときに選択された時間にスクロール
  useEffect(() => {
    if (isOpen) {
      // タイマーで少し遅延させて確実に要素が描画されてからスクロール
      setTimeout(() => scrollToSelected(), 100);
    }
  }, [isOpen]);

  const scrollToSelected = () => {
    // 日付のスクロール - 中央に配置
    if (dateScrollRef.current) {
      const dateIndex = dates.findIndex(d => d.value === selectedDate);
      if (dateIndex !== -1) {
        const scrollPosition = Math.max(0, dateIndex * 44);
        dateScrollRef.current.scrollTop = scrollPosition;
      }
    }

    // 時間のスクロール - 中央に配置
    if (hourScrollRef.current) {
      const hourIndex = hours.indexOf(selectedHour);
      if (hourIndex !== -1) {
        const scrollPosition = Math.max(0, hourIndex * 44);
        hourScrollRef.current.scrollTop = scrollPosition;
      }
    }

    // 分のスクロール - 中央に配置
    if (minuteScrollRef.current) {
      const minuteIndex = minutes.indexOf(selectedMinute);
      if (minuteIndex !== -1) {
        const scrollPosition = Math.max(0, minuteIndex * 44);
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
        const selectedDateLabel = newDate.label;
        console.log(`入店予定時間: ${selectedDateLabel} ${selectedHour}:${selectedMinute}`);
      }
    } else if (type === 'hour') {
      const newHour = hours[Math.max(0, Math.min(index, hours.length - 1))];
      if (newHour !== selectedHour) {
        setSelectedHour(newHour);
        const selectedDateObj = dates.find(d => d.value === selectedDate);
        const dateLabel = selectedDateObj?.label || '';
        console.log(`入店予定時間: ${dateLabel} ${newHour}:${selectedMinute}`);
      }
    } else {
      const newMinute = minutes[Math.max(0, Math.min(index, minutes.length - 1))];
      if (newMinute !== selectedMinute) {
        setSelectedMinute(newMinute);
        const selectedDateObj = dates.find(d => d.value === selectedDate);
        const dateLabel = selectedDateObj?.label || '';
        console.log(`入店予定時間: ${dateLabel} ${selectedHour}:${newMinute}`);
      }
    }
  };

  const handleComplete = () => {
    const selectedDateObj = dates.find(d => d.value === selectedDate);
    const dateLabel = selectedDateObj?.label || '';
    const result = `${dateLabel} ${selectedHour}:${selectedMinute}`;
    console.log(`入店予定時間: ${result}`);
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
                {/* 上部のパディング */}
                <div className="h-[calc(50%-22px)]" />
                
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