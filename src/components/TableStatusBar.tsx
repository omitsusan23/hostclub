import React, { useState, useEffect } from 'react';

type FilterType = 'all' | 'occupied' | 'empty' | 'first' | 'used';

interface TableStatusBarProps {
  selectedFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

const TableStatusBar: React.FC<TableStatusBarProps> = ({ selectedFilter, onFilterChange }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
    const weekday = weekdays[date.getDay()];
    return `${month}/${day}(${weekday})`;
  };

  const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const tabData = [
    { id: 'occupied' as FilterType, label: '使用中' },
    { id: 'empty' as FilterType, label: '空卓' },
    { id: 'first' as FilterType, label: '初回' },
    { id: 'used' as FilterType, label: '使用後' },
  ];

  return (
    <header className="relative w-screen h-[42px] bg-black -ml-[50vw] left-[50%]" role="banner">
      {/* 左側の日時表示 */}
      <div className="flex w-[79px] items-center gap-[5px] px-[5px] py-0 absolute top-[19px] left-[21px] rotate-[-0.06deg]">
        <div className="relative w-fit mt-[-0.63px] text-white text-xs tracking-[0.63px] [font-family:'Inter-Regular',Helvetica] font-normal leading-[0.1px]">
          {formatDate(currentTime)}
        </div>
        <div className="relative w-fit mt-[-0.63px] mr-[-33.00px] text-white text-xl tracking-[0.63px] [font-family:'Inter-Regular',Helvetica] font-normal leading-[0.1px]">
          {formatTime(currentTime)}
        </div>
      </div>

      {/* 右側のフィルタータブ */}
      <div
        className="flex w-56 h-5 items-center absolute top-2.5 left-[170px] bg-black border-[0.41px] border-solid border-white"
        role="tablist"
        aria-label="Table status tabs"
      >
        {tabData.map((tab, index) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={tab.id === selectedFilter}
            aria-controls={`tabpanel-${index}`}
            tabIndex={tab.id === selectedFilter ? 0 : -1}
            onClick={() => onFilterChange(tab.id)}
            onKeyDown={(e) => {
              if (e.key === 'ArrowLeft' && index > 0) {
                onFilterChange(tabData[index - 1].id);
              } else if (e.key === 'ArrowRight' && index < tabData.length - 1) {
                onFilterChange(tabData[index + 1].id);
              }
            }}
            className={`relative w-[56.01px] h-[19.62px] border-[0.41px] border-solid transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-inset ${
              tab.id === selectedFilter
                ? "bg-white border-black"
                : "bg-black border-white hover:bg-gray-900"
            } ${index === tabData.length - 1 ? "mr-[-0.03px]" : ""}`}
          >
            <span
              className={`absolute h-px ${
                index === 0
                  ? "top-2.5 left-[9px]"
                  : index === 3
                    ? "top-[9px] left-[9px]"
                    : "top-2.5 left-[15px]"
              } text-[12.3px] tracking-[0.41px] [font-family:'Inter-Regular',Helvetica] font-normal leading-[0.1px] ${
                tab.id === selectedFilter ? "text-black" : "text-white"
              }`}
            >
              {tab.label}
            </span>
          </button>
        ))}
      </div>
    </header>
  );
};

export default TableStatusBar;