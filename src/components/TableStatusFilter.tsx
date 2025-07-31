import React, { useState, useEffect } from "react";

type FilterType = 'all' | 'occupied' | 'empty' | 'first';

interface TableStatusFilterProps {
  selectedFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

export const TableStatusFilter: React.FC<TableStatusFilterProps> = ({
  selectedFilter,
  onFilterChange
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('ja-JP', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
      const dateStr = now.toLocaleDateString('ja-JP', {
        month: 'numeric',
        day: 'numeric',
        weekday: 'short'
      });
      
      setCurrentTime(timeStr);
      setCurrentDate(dateStr);
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const tabData = [
    { key: 'occupied' as FilterType, label: "使用中" },
    { key: 'empty' as FilterType, label: "空卓" },
    { key: 'first' as FilterType, label: "初回" },
    { key: 'all' as FilterType, label: "使用後" },
  ];

  return (
    <header className="relative w-screen h-[42px] bg-black -ml-[50vw] left-[50%]" role="banner">
      {/* 左側の日時表示 */}
      <div className="flex items-center gap-[5px] px-[5px] py-0 absolute top-[19px] left-[21px]">
        <div className="text-white text-xs tracking-[0.63px] font-normal leading-[0.1px]">
          {currentDate}
        </div>
        <div className="text-white text-xl tracking-[0.63px] font-normal leading-[0.1px]">
          {currentTime}
        </div>
      </div>

      {/* 右側のフィルタタブ */}
      <div
        className="flex w-56 h-5 items-center absolute top-2.5 left-[170px] bg-black border-[0.41px] border-solid border-white"
        role="tablist"
        aria-label="Table status tabs"
      >
        {tabData.map((tab, index) => (
          <button
            key={tab.key}
            role="tab"
            aria-selected={tab.key === selectedFilter}
            aria-controls={`tabpanel-${index}`}
            tabIndex={tab.key === selectedFilter ? 0 : -1}
            onClick={() => onFilterChange(tab.key)}
            onKeyDown={(e) => {
              if (e.key === "ArrowLeft" && index > 0) {
                onFilterChange(tabData[index - 1].key);
              } else if (e.key === "ArrowRight" && index < tabData.length - 1) {
                onFilterChange(tabData[index + 1].key);
              }
            }}
            className={`relative w-[56.01px] h-[19.62px] border-[0.41px] border-solid transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-inset ${
              tab.key === selectedFilter
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
              } text-[12.3px] tracking-[0.41px] font-normal leading-[0.1px] ${
                tab.key === selectedFilter ? "text-black" : "text-white"
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