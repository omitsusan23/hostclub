import React, { useState, useRef, useEffect } from 'react';

interface ReservationDateBarProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

const ReservationDateBar: React.FC<ReservationDateBarProps> = ({ selectedDate, onDateChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 25時制で現在日時を取得
  const getCurrentDate = () => {
    const now = new Date();
    const hours = now.getHours();
    
    // 0-4時（24-28時）の場合は前日の日付として扱う
    if (hours < 5) {
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      return yesterday;
    }
    return now;
  };

  // 日付をフォーマット
  const formatDate = (date: Date) => {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
    const weekday = weekdays[date.getDay()];
    return `${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}(${weekday})`;
  };

  // 選択可能な日付リストを生成（当日から1ヶ月後まで）
  const generateDateOptions = () => {
    const options: Date[] = [];
    const today = getCurrentDate();
    today.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < 31; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      options.push(date);
    }
    
    return options;
  };

  const dateOptions = generateDateOptions();

  // クリック外側で閉じる
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleDateSelect = (date: Date) => {
    onDateChange(date);
    setIsOpen(false);
  };

  return (
    <header className="relative w-screen h-[42px] bg-black -ml-[50vw] left-[50%] flex items-center justify-center" role="banner">
      <div ref={dropdownRef} className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex w-[125px] h-6 items-center justify-center bg-white border border-solid border-black"
          aria-label="Select date"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
        >
          <span className="relative w-fit [font-family:'Abhaya_Libre_ExtraBold-Regular',Helvetica] font-normal text-black text-[15px] tracking-[0] leading-[normal] whitespace-nowrap">
            {formatDate(selectedDate)}
          </span>
          <svg
            className={`relative w-[12.99px] h-[11.25px] ml-1 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            viewBox="0 0 13 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M6.5 11.25L0.00480938 0L12.9952 0L6.5 11.25Z" fill="black"/>
          </svg>
        </button>

        {isOpen && (
          <div 
            className="absolute top-full mt-1 w-[125px] max-h-[200px] overflow-y-auto bg-white border border-solid border-black z-50"
            role="listbox"
          >
            {dateOptions.map((date, index) => (
              <button
                key={index}
                onClick={() => handleDateSelect(date)}
                className="w-full px-2 py-1 text-left text-black text-[13px] hover:bg-gray-100 [font-family:'Abhaya_Libre_ExtraBold-Regular',Helvetica]"
                role="option"
                aria-selected={date.getTime() === selectedDate.getTime()}
              >
                {formatDate(date)}
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};

export default ReservationDateBar;